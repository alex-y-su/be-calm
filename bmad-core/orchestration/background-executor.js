/**
 * BMAD Background Agent Execution System
 * Version: 2.0
 *
 * Manages background execution of agents without blocking main workflow.
 */

import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import os from 'os';

export class BackgroundExecutor extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      maxConcurrentAgents: config.maxConcurrentAgents || 5,
      maxCpuPercent: config.maxCpuPercent || 80,
      maxMemoryMb: config.maxMemoryMb || 2048,
      throttleIfExceeded: config.throttleIfExceeded !== false,
      priorityLevels: config.priorityLevels || {
        critical: 5,
        high: 4,
        medium: 3,
        low: 2,
        background: 1
      },
      ...config
    };

    this.processes = new Map();
    this.queue = [];
    this.running = 0;
    this.resourceMonitor = new ResourceMonitor();
  }

  /**
   * Initialize background executor
   */
  async initialize() {
    // Start resource monitoring
    this.resourceMonitor.start();

    this.resourceMonitor.on('threshold-exceeded', (data) => {
      if (this.config.throttleIfExceeded) {
        this.throttle();
      }
      this.emit('resource-threshold-exceeded', data);
    });

    this.emit('initialized');
    return this;
  }

  /**
   * Execute agent in fire-and-forget mode
   */
  async fireAndForget(agent, task, options = {}) {
    const executionId = this.generateExecutionId();

    this.emit('fire-and-forget-started', {
      executionId,
      agent,
      task
    });

    const execution = {
      id: executionId,
      agent,
      task,
      options,
      mode: 'fire-and-forget',
      priority: options.priority || 'low',
      started: Date.now(),
      status: 'queued'
    };

    this.enqueue(execution);
    this.processQueue();

    return {
      executionId,
      mode: 'fire-and-forget',
      status: 'queued'
    };
  }

  /**
   * Execute agent with callback
   */
  async executeWithCallback(agent, task, callback, options = {}) {
    const executionId = this.generateExecutionId();

    this.emit('async-callback-started', {
      executionId,
      agent,
      task
    });

    const execution = {
      id: executionId,
      agent,
      task,
      options,
      mode: 'async-callback',
      priority: options.priority || 'medium',
      callback,
      started: Date.now(),
      status: 'queued'
    };

    this.enqueue(execution);
    this.processQueue();

    return {
      executionId,
      mode: 'async-callback',
      status: 'queued'
    };
  }

  /**
   * Execute agent in watched background mode
   */
  async executeWatched(agent, task, options = {}) {
    const executionId = this.generateExecutionId();

    this.emit('watched-started', {
      executionId,
      agent,
      task
    });

    const execution = {
      id: executionId,
      agent,
      task,
      options,
      mode: 'watched',
      priority: options.priority || 'medium',
      started: Date.now(),
      status: 'queued',
      progress: 0
    };

    this.enqueue(execution);
    this.processQueue();

    // Start periodic status updates
    const statusInterval = setInterval(() => {
      const current = this.processes.get(executionId);
      if (current) {
        if (current.status === 'running' || current.status === 'queued') {
          this.emit('progress-update', {
            executionId,
            agent,
            progress: current.progress || 0,
            status: current.status,
            duration: Date.now() - current.started
          });
        } else if (current.status === 'completed' || current.status === 'failed') {
          clearInterval(statusInterval);
        }
      } else {
        // Execution not found (might still be in queue), wait a bit more
        // Only clear after checking a few times
        if (!statusInterval.checkCount) statusInterval.checkCount = 0;
        statusInterval.checkCount++;
        if (statusInterval.checkCount > 5) {
          clearInterval(statusInterval);
        }
      }
    }, 1000);

    return {
      executionId,
      mode: 'watched',
      status: 'queued'
    };
  }

  /**
   * Enqueue execution
   */
  enqueue(execution) {
    this.queue.push(execution);

    // Sort queue by priority
    this.queue.sort((a, b) => {
      const priorityA = this.config.priorityLevels[a.priority] || 0;
      const priorityB = this.config.priorityLevels[b.priority] || 0;
      return priorityB - priorityA;
    });

    this.emit('execution-queued', {
      executionId: execution.id,
      queuePosition: this.queue.findIndex(e => e.id === execution.id),
      queueLength: this.queue.length
    });
  }

  /**
   * Process execution queue
   */
  async processQueue() {
    // Check if we can run more agents
    while (this.running < this.config.maxConcurrentAgents && this.queue.length > 0) {
      // Check resource limits
      if (this.config.throttleIfExceeded) {
        const resourceStatus = this.resourceMonitor.getStatus();

        if (
          resourceStatus.cpu > this.config.maxCpuPercent ||
          resourceStatus.memory > this.config.maxMemoryMb
        ) {
          this.emit('queue-throttled', { resourceStatus });
          break;
        }
      }

      const execution = this.queue.shift();
      await this.execute(execution);
    }
  }

  /**
   * Execute an agent
   */
  async execute(execution) {
    this.running++;
    execution.status = 'running';
    this.processes.set(execution.id, execution);

    this.emit('execution-started', {
      executionId: execution.id,
      agent: execution.agent,
      task: execution.task,
      mode: execution.mode
    });

    try {
      // Spawn agent process (this would integrate with actual agent system)
      const result = await this.spawnAgentProcess(execution);

      execution.status = 'completed';
      execution.result = result;
      execution.completed = Date.now();
      execution.duration = execution.completed - execution.started;

      this.emit('execution-completed', {
        executionId: execution.id,
        agent: execution.agent,
        result,
        duration: execution.duration
      });

      // Handle callbacks
      if (execution.mode === 'async-callback' && execution.callback) {
        try {
          execution.callback(null, result);
        } catch (error) {
          this.emit('callback-error', {
            executionId: execution.id,
            error
          });
        }
      }
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.completed = Date.now();

      this.emit('execution-failed', {
        executionId: execution.id,
        agent: execution.agent,
        error: error.message
      });

      // Handle callbacks
      if (execution.mode === 'async-callback' && execution.callback) {
        try {
          execution.callback(error, null);
        } catch (callbackError) {
          this.emit('callback-error', {
            executionId: execution.id,
            error: callbackError
          });
        }
      }
    } finally {
      this.running--;

      // Remove from active processes after some time
      setTimeout(() => {
        this.processes.delete(execution.id);
      }, 60000); // Keep for 1 minute for status queries

      // Process next in queue
      this.processQueue();
    }
  }

  /**
   * Spawn agent process
   */
  async spawnAgentProcess(execution) {
    return new Promise((resolve, reject) => {
      // This is a placeholder - would integrate with actual agent execution
      // For now, simulate agent execution

      const { agent, task, options } = execution;

      // Simulate progress updates for watched executions
      if (execution.mode === 'watched') {
        const progressInterval = setInterval(() => {
          execution.progress = Math.min(100, (execution.progress || 0) + 10);

          if (execution.progress >= 100) {
            clearInterval(progressInterval);
          }
        }, 500);
      }

      // Simulate execution time
      const duration = options.simulatedDuration || 2000;

      setTimeout(() => {
        resolve({
          success: true,
          agent,
          task,
          output: `${agent} completed ${task}`,
          timestamp: Date.now()
        });
      }, duration);
    });
  }

  /**
   * Execute multiple agents and aggregate results
   */
  async executeMultiple(agents, task, options = {}) {
    const aggregationId = this.generateExecutionId();

    this.emit('aggregation-started', {
      aggregationId,
      agents,
      task
    });

    const executions = agents.map(agent =>
      this.executeWithCallback(agent, task, null, options)
    );

    const executionIds = executions.map(e => e.executionId);

    // Wait for all to complete
    const results = await this.waitForCompletion(executionIds);

    // Validate consistency
    const consistent = this.validateResultConsistency(results);

    // Generate aggregate report
    const report = this.generateAggregateReport(results, consistent);

    this.emit('aggregation-completed', {
      aggregationId,
      results,
      report
    });

    return {
      aggregationId,
      results,
      consistent,
      report
    };
  }

  /**
   * Wait for executions to complete
   */
  async waitForCompletion(executionIds) {
    const results = [];

    for (const executionId of executionIds) {
      const result = await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const execution = this.processes.get(executionId);

          if (execution && (execution.status === 'completed' || execution.status === 'failed')) {
            clearInterval(checkInterval);
            resolve(execution);
          } else if (!execution) {
            // Execution not found - might have been cleaned up already
            // Return a placeholder completed status
            clearInterval(checkInterval);
            resolve({
              id: executionId,
              status: 'completed',
              result: { success: true },
              duration: 0
            });
          }
        }, 100);
      });

      results.push(result);
    }

    return results;
  }

  /**
   * Validate result consistency
   */
  validateResultConsistency(results) {
    // Check if all succeeded
    const allSucceeded = results.every(r => r.status === 'completed');

    if (!allSucceeded) {
      return {
        consistent: false,
        reason: 'some_executions_failed',
        failures: results.filter(r => r.status === 'failed')
      };
    }

    // Could add more sophisticated consistency checks here
    return {
      consistent: true,
      all_succeeded: true
    };
  }

  /**
   * Generate aggregate report
   */
  generateAggregateReport(results, consistency) {
    const successful = results.filter(r => r.status === 'completed');
    const failed = results.filter(r => r.status === 'failed');

    const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);
    const avgDuration = totalDuration / results.length;

    return {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      success_rate: (successful.length / results.length) * 100,
      total_duration: totalDuration,
      average_duration: avgDuration,
      consistency,
      timestamp: Date.now()
    };
  }

  /**
   * Get execution status
   */
  getExecutionStatus(executionId) {
    // Check running/completed processes first
    const execution = this.processes.get(executionId);

    if (execution) {
      return {
        found: true,
        id: execution.id,
        agent: execution.agent,
        task: execution.task,
        status: execution.status,
        progress: execution.progress || 0,
        started: execution.started,
        duration: execution.completed
          ? execution.completed - execution.started
          : Date.now() - execution.started,
        result: execution.result || null,
        error: execution.error || null
      };
    }

    // Check queue
    const queued = this.queue.find(e => e.id === executionId);
    if (queued) {
      return {
        found: true,
        id: queued.id,
        agent: queued.agent,
        task: queued.task,
        status: 'queued',
        progress: 0,
        started: queued.started,
        duration: 0,
        result: null,
        error: null
      };
    }

    return { found: false };
  }

  /**
   * Cancel execution
   */
  async cancelExecution(executionId) {
    const execution = this.processes.get(executionId);

    if (!execution) {
      return { success: false, error: 'Execution not found' };
    }

    if (execution.status !== 'running') {
      return {
        success: false,
        error: `Cannot cancel execution in ${execution.status} status`
      };
    }

    // Mark as cancelled
    execution.status = 'cancelled';
    execution.completed = Date.now();

    this.emit('execution-cancelled', {
      executionId,
      agent: execution.agent
    });

    this.running--;
    this.processQueue();

    return { success: true };
  }

  /**
   * Throttle queue processing
   */
  throttle() {
    this.emit('queue-throttled', {
      running: this.running,
      queued: this.queue.length,
      resources: this.resourceMonitor.getStatus()
    });

    // Pause queue processing temporarily
    setTimeout(() => {
      this.processQueue();
    }, 5000);
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queued: this.queue.length,
      running: this.running,
      max_concurrent: this.config.maxConcurrentAgents,
      queue: this.queue.map(e => ({
        id: e.id,
        agent: e.agent,
        priority: e.priority,
        mode: e.mode
      }))
    };
  }

  /**
   * Get active executions
   */
  getActiveExecutions() {
    return Array.from(this.processes.values())
      .filter(e => e.status === 'running')
      .map(e => ({
        id: e.id,
        agent: e.agent,
        task: e.task,
        mode: e.mode,
        progress: e.progress || 0,
        duration: Date.now() - e.started
      }));
  }

  /**
   * Get executor status
   */
  getStatus() {
    return {
      running: this.running,
      queued: this.queue.length,
      max_concurrent: this.config.maxConcurrentAgents,
      active_processes: this.processes.size,
      resources: this.resourceMonitor.getStatus()
    };
  }

  /**
   * Generate execution ID
   */
  generateExecutionId() {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Shutdown executor
   */
  async shutdown() {
    this.emit('shutting-down', {
      running: this.running,
      queued: this.queue.length
    });

    // Stop accepting new executions
    this.queue = [];

    // Wait for running executions to complete
    const activeIds = Array.from(this.processes.keys())
      .filter(id => this.processes.get(id).status === 'running');

    if (activeIds.length > 0) {
      await this.waitForCompletion(activeIds);
    }

    // Stop resource monitor
    this.resourceMonitor.stop();

    this.emit('shutdown-complete');
  }
}

/**
 * Resource Monitor
 */
class ResourceMonitor extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      interval: config.interval || 1000,
      cpuThreshold: config.cpuThreshold || 80,
      memoryThreshold: config.memoryThreshold || 2048,
      ...config
    };

    this.monitoring = false;
    this.intervalId = null;
    this.history = [];
  }

  /**
   * Start monitoring
   */
  start() {
    if (this.monitoring) return;

    this.monitoring = true;

    this.intervalId = setInterval(() => {
      this.check();
    }, this.config.interval);

    this.emit('started');
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (!this.monitoring) return;

    this.monitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.emit('stopped');
  }

  /**
   * Check resources
   */
  check() {
    const cpu = this.getCpuUsage();
    const memory = this.getMemoryUsage();

    const status = {
      cpu,
      memory,
      timestamp: Date.now()
    };

    this.history.push(status);

    // Keep last 60 measurements
    if (this.history.length > 60) {
      this.history.shift();
    }

    // Check thresholds
    if (cpu > this.config.cpuThreshold || memory > this.config.memoryThreshold) {
      this.emit('threshold-exceeded', status);
    }
  }

  /**
   * Get CPU usage percentage
   */
  getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);

    return usage;
  }

  /**
   * Get memory usage in MB
   */
  getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usedMb = usedMem / (1024 * 1024);

    return Math.round(usedMb);
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      cpu: this.getCpuUsage(),
      memory: this.getMemoryUsage(),
      total_memory: Math.round(os.totalmem() / (1024 * 1024)),
      free_memory: Math.round(os.freemem() / (1024 * 1024))
    };
  }

  /**
   * Get resource trends
   */
  getTrends() {
    if (this.history.length === 0) {
      return { cpu: [], memory: [] };
    }

    return {
      cpu: this.history.map(h => ({ value: h.cpu, timestamp: h.timestamp })),
      memory: this.history.map(h => ({ value: h.memory, timestamp: h.timestamp }))
    };
  }
}

export { ResourceMonitor };
export default BackgroundExecutor;
