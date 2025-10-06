/**
 * Intelligent Parallelization Engine
 *
 * Automatically detects which tasks can run in parallel and optimizes execution:
 * - Dependency graph analysis
 * - Resource-aware scheduling
 * - Parallel validation orchestration
 * - Throughput maximization
 */

class ParallelizationEngine {
  constructor(config = {}) {
    this.config = config;
    this.dependencyGraph = new Map();
    this.resourcePools = {
      cpu: config.maxCpuConcurrency || 4,
      io: config.maxIoConcurrency || 10,
      mixed: config.maxMixedConcurrency || 6
    };
    this.activeJobs = new Map();
    this.completedJobs = new Map();
    this.executionHistory = [];
  }

  /**
   * Execute tasks with intelligent parallelization
   *
   * @param {Array} tasks - Array of tasks to execute
   * @param {Object} options - Execution options
   * @returns {Object} Execution results
   */
  async executeTasks(tasks, options = {}) {
    // Build dependency graph
    const graph = this.buildDependencyGraph(tasks);

    // Identify independent tasks
    const independent = this.findIndependentTasks(graph);

    // Create execution plan
    const plan = this.createExecutionPlan(graph, independent);

    // If dry run, return plan without executing
    if (options.dryRun) {
      return plan;
    }

    // Execute plan with parallelization
    const results = await this.executePlan(plan, options);

    // Record execution metrics
    this.recordExecution(tasks, results);

    return results;
  }

  /**
   * Build dependency graph from tasks
   */
  buildDependencyGraph(tasks) {
    const graph = new Map();

    for (const task of tasks) {
      if (!graph.has(task.id)) {
        graph.set(task.id, {
          task,
          dependencies: [],
          dependents: [],
          status: 'pending',
          resourceType: this.classifyResourceType(task)
        });
      }

      const node = graph.get(task.id);

      // Add dependencies
      if (task.dependencies && task.dependencies.length > 0) {
        for (const depId of task.dependencies) {
          node.dependencies.push(depId);

          // Create dependent node if doesn't exist
          if (!graph.has(depId)) {
            const depTask = tasks.find(t => t.id === depId);
            if (depTask) {
              graph.set(depId, {
                task: depTask,
                dependencies: [],
                dependents: [],
                status: 'pending',
                resourceType: this.classifyResourceType(depTask)
              });
            }
          }

          // Add reverse dependency
          if (graph.has(depId)) {
            graph.get(depId).dependents.push(task.id);
          }
        }
      }
    }

    this.dependencyGraph = graph;
    return graph;
  }

  /**
   * Classify task by resource type
   */
  classifyResourceType(task) {
    // Heuristic classification
    const taskType = task.agent || task.type || 'unknown';

    // CPU-bound tasks
    if (['dev', 'architect', 'reflection'].includes(taskType)) {
      return 'cpu';
    }

    // IO-bound tasks
    if (['eval', 'validator', 'oracle'].includes(taskType)) {
      return 'io';
    }

    // Mixed workload
    return 'mixed';
  }

  /**
   * Find tasks with no dependencies (can start immediately)
   */
  findIndependentTasks(graph) {
    const independent = [];

    for (const [taskId, node] of graph.entries()) {
      if (node.dependencies.length === 0) {
        independent.push(taskId);
      }
    }

    return independent;
  }

  /**
   * Create execution plan with parallelization strategy
   */
  createExecutionPlan(graph, independent) {
    const plan = {
      stages: [],
      totalTasks: graph.size,
      parallelizationOpportunities: 0
    };

    const remaining = new Set(graph.keys());
    const completed = new Set();

    // Stage 0: Independent tasks
    if (independent.length > 0) {
      const optimized = this.optimizeStage(independent, graph);

      plan.stages.push({
        stage: 0,
        tasks: independent,
        parallel: true,
        optimized,
        estimatedDuration: this.estimateStageDuration(independent, graph)
      });

      for (const taskId of independent) {
        remaining.delete(taskId);
      }
    }

    // Subsequent stages: tasks whose dependencies are met
    let stageNum = 1;

    while (remaining.size > 0) {
      const ready = [];

      for (const taskId of remaining) {
        const node = graph.get(taskId);

        // Check if all dependencies completed
        const depsReady = node.dependencies.every(depId =>
          completed.has(depId) || !remaining.has(depId)
        );

        if (depsReady) {
          ready.push(taskId);
        }
      }

      if (ready.length === 0) {
        // Circular dependency or error
        console.warn('Unable to resolve remaining tasks - possible circular dependency');
        break;
      }

      // Optimize within stage by resource type
      const optimized = this.optimizeStage(ready, graph);

      plan.stages.push({
        stage: stageNum,
        tasks: ready,
        parallel: ready.length > 1,
        optimized,
        estimatedDuration: this.estimateStageDuration(ready, graph)
      });

      // Mark as completed for dependency resolution
      for (const taskId of ready) {
        remaining.delete(taskId);
        completed.add(taskId);
      }

      stageNum++;
    }

    // Count parallelization opportunities
    plan.parallelizationOpportunities = plan.stages.filter(s => s.parallel).length;

    return plan;
  }

  /**
   * Optimize stage execution by resource type
   */
  optimizeStage(taskIds, graph) {
    const byResource = {
      cpu: [],
      io: [],
      mixed: []
    };

    for (const taskId of taskIds) {
      const node = graph.get(taskId);
      byResource[node.resourceType].push(taskId);
    }

    return {
      cpuTasks: byResource.cpu,
      ioTasks: byResource.io,
      mixedTasks: byResource.mixed,
      strategy: this.determineResourceStrategy(byResource)
    };
  }

  /**
   * Determine optimal resource allocation strategy
   */
  determineResourceStrategy(resourceBreakdown) {
    const cpuCount = resourceBreakdown.cpu.length;
    const ioCount = resourceBreakdown.io.length;
    const mixedCount = resourceBreakdown.mixed.length;

    if (cpuCount > ioCount && cpuCount > mixedCount) {
      return {
        type: 'cpu_heavy',
        maxConcurrency: this.resourcePools.cpu,
        advice: 'Limit CPU-bound task concurrency'
      };
    }

    if (ioCount > cpuCount && ioCount > mixedCount) {
      return {
        type: 'io_heavy',
        maxConcurrency: this.resourcePools.io,
        advice: 'High concurrency for IO-bound tasks'
      };
    }

    return {
      type: 'balanced',
      maxConcurrency: this.resourcePools.mixed,
      advice: 'Dynamic balancing'
    };
  }

  /**
   * Estimate stage duration
   */
  estimateStageDuration(taskIds, graph) {
    // Find max duration among parallel tasks
    let maxDuration = 0;

    for (const taskId of taskIds) {
      const node = graph.get(taskId);
      const duration = this.estimateTaskDuration(node.task);

      if (duration > maxDuration) {
        maxDuration = duration;
      }
    }

    return maxDuration;
  }

  /**
   * Estimate task duration
   */
  estimateTaskDuration(task) {
    const effortMap = {
      small: 1,
      medium: 3,
      large: 8,
      xlarge: 20
    };

    return effortMap[task.estimatedEffort] || 3;
  }

  /**
   * Execute the parallelization plan
   */
  async executePlan(plan, options = {}) {
    const startTime = Date.now();
    const results = {
      stages: [],
      totalDuration: 0,
      taskResults: new Map(),
      parallelizationGain: 0
    };

    // Calculate sequential baseline
    const sequentialDuration = this.calculateSequentialDuration(plan);

    // Execute each stage
    for (const stage of plan.stages) {
      const stageStart = Date.now();

      let stageResults;

      if (stage.parallel && stage.tasks.length > 1) {
        // Execute in parallel with resource optimization
        stageResults = await this.executeStageParallel(stage, options);
      } else {
        // Execute sequentially
        stageResults = await this.executeStageSequential(stage, options);
      }

      const stageDuration = Date.now() - stageStart;

      results.stages.push({
        stage: stage.stage,
        duration: stageDuration,
        results: stageResults,
        parallel: stage.parallel
      });

      // Store individual task results
      for (const [taskId, result] of Object.entries(stageResults)) {
        results.taskResults.set(taskId, result);
      }
    }

    results.totalDuration = Date.now() - startTime;
    results.parallelizationGain = (sequentialDuration - results.totalDuration) / sequentialDuration;

    return results;
  }

  /**
   * Execute stage tasks in parallel
   */
  async executeStageParallel(stage, options) {
    const tasks = stage.tasks.map(taskId => {
      const node = this.dependencyGraph.get(taskId);
      return node.task;
    });

    // Apply resource-based concurrency limits
    const concurrency = stage.optimized.strategy.maxConcurrency;

    // Execute with controlled concurrency
    const results = await this.executeConcurrent(tasks, concurrency, options);

    // Map results back to task IDs
    const resultMap = {};
    stage.tasks.forEach((taskId, index) => {
      resultMap[taskId] = results[index];
    });

    return resultMap;
  }

  /**
   * Execute stage tasks sequentially
   */
  async executeStageSequential(stage, options) {
    const resultMap = {};

    for (const taskId of stage.tasks) {
      const node = this.dependencyGraph.get(taskId);
      const result = await this.executeTask(node.task, options);
      resultMap[taskId] = result;
    }

    return resultMap;
  }

  /**
   * Execute tasks with controlled concurrency
   */
  async executeConcurrent(tasks, maxConcurrency, options) {
    const results = new Array(tasks.length);
    const executing = [];

    for (let i = 0; i < tasks.length; i++) {
      const promise = this.executeTask(tasks[i], options).then(result => {
        results[i] = result;
      });

      executing.push(promise);

      // If we hit concurrency limit, wait for one to complete
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
        // Remove completed promises
        executing.splice(0, executing.findIndex(p => p.status === 'fulfilled') + 1 || 1);
      }
    }

    // Wait for remaining tasks
    await Promise.all(executing);

    return results;
  }

  /**
   * Execute a single task
   */
  async executeTask(task, options) {
    const startTime = Date.now();

    try {
      // Mock task execution
      // In real implementation, this would call the actual agent/task executor
      await this.simulateTaskExecution(task);

      const duration = Date.now() - startTime;

      return {
        taskId: task.id,
        status: 'completed',
        duration,
        output: `Completed ${task.name}`,
        success: true
      };
    } catch (error) {
      return {
        taskId: task.id,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error.message,
        success: false
      };
    }
  }

  /**
   * Simulate task execution (mock)
   */
  async simulateTaskExecution(task) {
    const duration = this.estimateTaskDuration(task) * 100; // ms
    await new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * Calculate sequential execution duration
   */
  calculateSequentialDuration(plan) {
    let total = 0;

    for (const stage of plan.stages) {
      total += stage.estimatedDuration;
    }

    return total;
  }

  /**
   * Execute parallel validations
   */
  async executeParallelValidations(artifact, validators, options = {}) {
    const tasks = validators.map(validator => ({
      id: `validation-${validator}`,
      name: `Validate with ${validator}`,
      agent: validator,
      type: 'validation',
      estimatedEffort: 'small',
      dependencies: []
    }));

    // Validations are typically IO-bound, so high concurrency
    const results = await this.executeConcurrent(
      tasks,
      this.resourcePools.io,
      options
    );

    // Aggregate results
    const passed = results.every(r => r.success);
    const issues = results.filter(r => !r.success);

    return {
      passed,
      issues,
      validationResults: results
    };
  }

  /**
   * Record execution for learning
   */
  recordExecution(tasks, results) {
    this.executionHistory.push({
      timestamp: Date.now(),
      taskCount: tasks.length,
      duration: results.totalDuration,
      parallelizationGain: results.parallelizationGain,
      stages: results.stages.length
    });

    // Keep only recent history
    if (this.executionHistory.length > 50) {
      this.executionHistory.shift();
    }
  }

  /**
   * Get parallelization statistics
   */
  getStatistics() {
    if (this.executionHistory.length === 0) {
      return {
        totalExecutions: 0,
        averageDuration: 0,
        averageParallelizationGain: 0,
        averageStages: 0
      };
    }

    const total = this.executionHistory.length;

    return {
      totalExecutions: total,
      averageDuration: this.executionHistory.reduce((sum, e) => sum + e.duration, 0) / total,
      averageParallelizationGain: this.executionHistory.reduce((sum, e) => sum + e.parallelizationGain, 0) / total,
      averageStages: this.executionHistory.reduce((sum, e) => sum + e.stages, 0) / total,
      totalTasksExecuted: this.executionHistory.reduce((sum, e) => sum + e.taskCount, 0)
    };
  }

  /**
   * Visualize dependency graph (for debugging)
   */
  visualizeGraph() {
    const lines = ['Dependency Graph:'];

    for (const [taskId, node] of this.dependencyGraph.entries()) {
      const deps = node.dependencies.length > 0 ? ` <- [${node.dependencies.join(', ')}]` : '';
      lines.push(`  ${taskId} (${node.resourceType})${deps}`);
    }

    return lines.join('\n');
  }
}

export default ParallelizationEngine;
