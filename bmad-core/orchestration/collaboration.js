/**
 * BMAD Agent Collaboration Protocol
 * Version: 2.0
 *
 * Manages agent collaboration, communication, and coordination.
 */

import { EventEmitter } from 'events';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

export class CollaborationFramework extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      modesFile: config.modesFile || 'bmad-core/config/collaboration-modes.yaml',
      messageTimeout: config.messageTimeout || 30000,
      maxRetries: config.maxRetries || 3,
      ...config
    };

    this.messageBus = new AgentMessageBus();
    this.dependencyGraph = null;
    this.collaborationModes = null;
    this.activeCollaborations = new Map();
  }

  /**
   * Initialize collaboration framework
   */
  async initialize() {
    await this.loadCollaborationModes();
    this.buildDependencyGraph();

    // Setup message bus handlers
    this.messageBus.on('message', this.handleMessage.bind(this));
    this.messageBus.on('timeout', this.handleMessageTimeout.bind(this));

    this.emit('initialized');
    return this;
  }

  /**
   * Load collaboration modes
   */
  async loadCollaborationModes() {
    const modesPath = path.resolve(this.config.modesFile);

    if (await fs.pathExists(modesPath)) {
      const content = await fs.readFile(modesPath, 'utf8');
      this.collaborationModes = yaml.load(content);
    } else {
      this.collaborationModes = this.getDefaultModes();
    }

    this.emit('modes-loaded', { modes: this.collaborationModes });
  }

  /**
   * Get default collaboration modes
   */
  getDefaultModes() {
    return {
      sequential: {
        description: 'Agents execute one after another',
        example: 'Analyst → Oracle → Eval'
      },
      parallel: {
        description: 'Agents execute simultaneously',
        example: 'Oracle + Eval + Validator'
      },
      collaborative: {
        description: 'Agents work together on same task',
        example: 'Dev + Eval (continuous testing)'
      },
      competitive: {
        description: 'Multiple agents solve same problem, best wins',
        example: 'Multiple architecture proposals'
      }
    };
  }

  /**
   * Build dependency graph
   */
  buildDependencyGraph() {
    this.dependencyGraph = {
      oracle: {
        depends_on: [],
        required_by: ['eval', 'validator', 'pm', 'architect', 'dev']
      },
      eval: {
        depends_on: ['oracle'],
        required_by: ['dev', 'qa', 'validator']
      },
      validator: {
        depends_on: ['oracle', 'eval'],
        required_by: ['orchestrator']
      },
      monitor: {
        depends_on: ['validator'],
        required_by: ['reflection', 'orchestrator']
      },
      reflection: {
        depends_on: ['monitor', 'validator', 'eval', 'oracle'],
        required_by: ['orchestrator']
      },
      pm: {
        depends_on: ['oracle'],
        required_by: ['architect', 'po', 'sm']
      },
      architect: {
        depends_on: ['oracle', 'pm'],
        required_by: ['dev']
      },
      dev: {
        depends_on: ['architect', 'eval', 'oracle'],
        required_by: ['qa']
      },
      qa: {
        depends_on: ['dev', 'eval'],
        required_by: []
      }
    };

    this.emit('dependency-graph-built', { graph: this.dependencyGraph });
  }

  /**
   * Execute agents in sequential mode
   */
  async executeSequential(agents, task, options = {}) {
    const collaborationId = this.generateCollaborationId();

    this.activeCollaborations.set(collaborationId, {
      mode: 'sequential',
      agents,
      task,
      started: Date.now(),
      status: 'running'
    });

    this.emit('collaboration-started', {
      collaborationId,
      mode: 'sequential',
      agents,
      task
    });

    const results = [];
    let previousOutput = options.initialInput || null;

    for (const agent of agents) {
      this.emit('agent-starting', {
        collaborationId,
        agent,
        input: previousOutput
      });

      const result = await this.sendTaskToAgent(agent, task, {
        input: previousOutput,
        ...options
      });

      if (!result.success) {
        this.activeCollaborations.delete(collaborationId);

        return {
          success: false,
          mode: 'sequential',
          collaborationId,
          failed_at: agent,
          error: result.error,
          completed: results
        };
      }

      results.push({
        agent,
        result: result.result,
        timestamp: Date.now()
      });

      previousOutput = result.result;

      this.emit('agent-completed', {
        collaborationId,
        agent,
        result: result.result
      });
    }

    this.activeCollaborations.delete(collaborationId);

    this.emit('collaboration-completed', {
      collaborationId,
      mode: 'sequential',
      results
    });

    return {
      success: true,
      mode: 'sequential',
      collaborationId,
      results,
      final_output: previousOutput
    };
  }

  /**
   * Execute agents in parallel mode
   */
  async executeParallel(agents, task, options = {}) {
    const collaborationId = this.generateCollaborationId();

    this.activeCollaborations.set(collaborationId, {
      mode: 'parallel',
      agents,
      task,
      started: Date.now(),
      status: 'running'
    });

    this.emit('collaboration-started', {
      collaborationId,
      mode: 'parallel',
      agents,
      task
    });

    const promises = agents.map(agent =>
      this.sendTaskToAgent(agent, task, options)
        .then(result => ({
          agent,
          success: result.success,
          result: result.result || result.error,
          timestamp: Date.now()
        }))
    );

    const results = await Promise.allSettled(promises);

    this.activeCollaborations.delete(collaborationId);

    const completed = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const failures = results
      .filter(r => r.status === 'rejected' || !r.value?.success);

    this.emit('collaboration-completed', {
      collaborationId,
      mode: 'parallel',
      results: completed,
      failures
    });

    return {
      success: failures.length === 0,
      mode: 'parallel',
      collaborationId,
      results: completed,
      failures: failures.map((f, i) => ({
        agent: agents[i],
        error: f.reason || f.value?.result
      }))
    };
  }

  /**
   * Execute agents in collaborative mode
   */
  async executeCollaborative(primaryAgent, supportingAgent, task, options = {}) {
    const collaborationId = this.generateCollaborationId();

    this.activeCollaborations.set(collaborationId, {
      mode: 'collaborative',
      primary: primaryAgent,
      supporting: supportingAgent,
      task,
      started: Date.now(),
      status: 'running'
    });

    this.emit('collaboration-started', {
      collaborationId,
      mode: 'collaborative',
      primary: primaryAgent,
      supporting: supportingAgent,
      task
    });

    // Start supporting agent in watch mode
    const supportingTask = {
      mode: 'watch',
      primary_agent: primaryAgent,
      task
    };

    const supportingPromise = this.sendTaskToAgent(supportingAgent, supportingTask, {
      ...options,
      continuous: true
    });

    // Execute primary agent
    const primaryResult = await this.sendTaskToAgent(primaryAgent, task, options);

    // Get supporting agent feedback
    const supportingResult = await supportingPromise;

    this.activeCollaborations.delete(collaborationId);

    this.emit('collaboration-completed', {
      collaborationId,
      mode: 'collaborative',
      primaryResult,
      supportingResult
    });

    return {
      success: primaryResult.success && supportingResult.success,
      mode: 'collaborative',
      collaborationId,
      primary_result: primaryResult.result,
      supporting_feedback: supportingResult.result,
      integrated: true
    };
  }

  /**
   * Execute agents in competitive mode
   */
  async executeCompetitive(agents, task, options = {}) {
    const collaborationId = this.generateCollaborationId();

    this.activeCollaborations.set(collaborationId, {
      mode: 'competitive',
      agents,
      task,
      started: Date.now(),
      status: 'running'
    });

    this.emit('collaboration-started', {
      collaborationId,
      mode: 'competitive',
      agents,
      task
    });

    // All agents solve same problem
    const promises = agents.map(agent =>
      this.sendTaskToAgent(agent, task, options)
        .then(result => ({
          agent,
          solution: result.result,
          success: result.success,
          timestamp: Date.now()
        }))
    );

    const results = await Promise.allSettled(promises);
    const solutions = results
      .filter(r => r.status === 'fulfilled' && r.value?.success)
      .map(r => r.value);

    // Score solutions using validator and oracle
    const scoredSolutions = await this.scoreSolutions(solutions, task);

    // Select best solution
    const best = scoredSolutions.reduce((prev, current) =>
      current.score > prev.score ? current : prev
    );

    this.activeCollaborations.delete(collaborationId);

    this.emit('collaboration-completed', {
      collaborationId,
      mode: 'competitive',
      solutions: scoredSolutions,
      winner: best
    });

    return {
      success: true,
      mode: 'competitive',
      collaborationId,
      solutions: scoredSolutions,
      best_solution: best,
      winner: best.agent
    };
  }

  /**
   * Score solutions from competitive execution
   */
  async scoreSolutions(solutions, task) {
    const scored = [];

    for (const solution of solutions) {
      // Get oracle score
      const oracleScore = await this.sendTaskToAgent('oracle', 'score-solution', {
        solution: solution.solution,
        task
      });

      // Get validator score
      const validatorScore = await this.sendTaskToAgent('validator', 'score-solution', {
        solution: solution.solution,
        task
      });

      const totalScore = (
        (oracleScore.result?.score || 0) * 0.6 +
        (validatorScore.result?.score || 0) * 0.4
      );

      scored.push({
        ...solution,
        oracle_score: oracleScore.result?.score || 0,
        validator_score: validatorScore.result?.score || 0,
        score: totalScore
      });
    }

    return scored.sort((a, b) => b.score - a.score);
  }

  /**
   * Send task to agent via message bus
   */
  async sendTaskToAgent(agent, task, options = {}) {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const message = {
      type: 'task_request',
      from: 'orchestrator',
      to: agent,
      payload: {
        task_id: taskId,
        task_type: typeof task === 'string' ? task : task.mode || 'execute',
        inputs: options.input || options,
        priority: options.priority || 'medium'
      },
      timestamp: Date.now()
    };

    return this.messageBus.send(message, this.config.messageTimeout);
  }

  /**
   * Execute agents based on dependencies
   */
  async executeWithDependencies(agents, task, options = {}) {
    const executionOrder = this.topologicalSort(agents);

    this.emit('dependency-execution-order', {
      agents,
      order: executionOrder
    });

    // Group agents that can run in parallel (no dependencies between them)
    const levels = this.groupByDependencyLevel(executionOrder);

    const results = [];

    for (const level of levels) {
      // Agents in same level can run in parallel
      const levelResults = await this.executeParallel(level, task, options);
      results.push(...levelResults.results);

      if (!levelResults.success) {
        return {
          success: false,
          results,
          failed_level: level,
          error: 'Dependency execution failed'
        };
      }
    }

    return {
      success: true,
      results,
      execution_order: executionOrder
    };
  }

  /**
   * Topological sort for dependency resolution
   */
  topologicalSort(agents) {
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();

    const visit = (agent) => {
      if (visited.has(agent)) return;
      if (visiting.has(agent)) {
        throw new Error(`Circular dependency detected involving ${agent}`);
      }

      visiting.add(agent);

      const deps = this.dependencyGraph[agent]?.depends_on || [];
      for (const dep of deps) {
        if (agents.includes(dep)) {
          visit(dep);
        }
      }

      visiting.delete(agent);
      visited.add(agent);
      sorted.push(agent);
    };

    for (const agent of agents) {
      visit(agent);
    }

    return sorted;
  }

  /**
   * Group agents by dependency level
   */
  groupByDependencyLevel(sortedAgents) {
    const levels = [];
    const agentLevels = new Map();

    for (const agent of sortedAgents) {
      const deps = this.dependencyGraph[agent]?.depends_on || [];
      const depLevels = deps
        .filter(dep => agentLevels.has(dep))
        .map(dep => agentLevels.get(dep));

      const level = depLevels.length > 0 ? Math.max(...depLevels) + 1 : 0;
      agentLevels.set(agent, level);

      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(agent);
    }

    return levels;
  }

  /**
   * Resolve conflict between agents
   */
  async resolveConflict(conflict) {
    const { agents, issue, contexts } = conflict;

    this.emit('conflict-detected', conflict);

    // Apply resolution rules based on priority
    const priorities = {
      oracle: 10,  // Truth-keeper has highest authority
      eval: 9,     // Eval also truth-keeper
      validator: 8, // Validator overrides on traceability
      monitor: 7,
      reflection: 6,
      architect: 5,
      pm: 4,
      dev: 3,
      qa: 2
    };

    // Check confidence scores
    const withPriority = agents.map(agent => ({
      agent,
      priority: priorities[agent] || 0,
      confidence: contexts[agent]?.confidence || 0.5
    }));

    // Sort by priority, then confidence
    withPriority.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return b.confidence - a.confidence;
    });

    const winner = withPriority[0];

    // If confidence is too low, route to human
    if (winner.confidence < 0.6) {
      this.emit('conflict-escalated-to-human', {
        conflict,
        reason: 'low_confidence',
        candidates: withPriority
      });

      return {
        resolved: false,
        escalated: true,
        reason: 'Confidence too low for automatic resolution'
      };
    }

    // Analyze conflict with reflection
    const analysis = await this.sendTaskToAgent('reflection', 'analyze-conflict', {
      conflict,
      candidates: withPriority
    });

    this.emit('conflict-resolved', {
      conflict,
      winner: winner.agent,
      analysis: analysis.result
    });

    return {
      resolved: true,
      winner: winner.agent,
      priority: winner.priority,
      confidence: winner.confidence,
      analysis: analysis.result
    };
  }

  /**
   * Explicit handoff between agents
   */
  async handoff(fromAgent, toAgent, data, options = {}) {
    const handoffId = `handoff-${Date.now()}`;

    this.emit('handoff-started', {
      handoffId,
      from: fromAgent,
      to: toAgent
    });

    // Agent A signals completion
    this.emit('agent-handoff-signal', {
      handoffId,
      agent: fromAgent,
      status: 'completed'
    });

    // Agent A packages outputs
    const packagedData = {
      ...data,
      handoff_id: handoffId,
      from_agent: fromAgent,
      timestamp: Date.now()
    };

    // Validate outputs (optional)
    if (options.validate) {
      const validation = await this.sendTaskToAgent('validator', 'validate-handoff', {
        data: packagedData,
        from: fromAgent,
        to: toAgent
      });

      if (!validation.success || !validation.result?.valid) {
        this.emit('handoff-failed', {
          handoffId,
          reason: 'validation_failed',
          validation
        });

        return {
          success: false,
          handoffId,
          error: 'Handoff validation failed'
        };
      }
    }

    // Invoke Agent B
    const acknowledgment = await this.sendTaskToAgent(toAgent, 'acknowledge-handoff', {
      handoff_id: handoffId,
      from: fromAgent,
      data: packagedData
    });

    if (!acknowledgment.success) {
      this.emit('handoff-failed', {
        handoffId,
        reason: 'acknowledgment_failed'
      });

      return {
        success: false,
        handoffId,
        error: 'Agent failed to acknowledge handoff'
      };
    }

    // Agent B begins work
    this.emit('handoff-completed', {
      handoffId,
      from: fromAgent,
      to: toAgent,
      acknowledged: true
    });

    return {
      success: true,
      handoffId,
      from: fromAgent,
      to: toAgent,
      data: packagedData
    };
  }

  /**
   * Handle message from message bus
   */
  handleMessage(message) {
    this.emit('message-received', message);

    // Route message based on type
    switch (message.type) {
      case 'task_response':
        this.emit('task-response', message);
        break;

      case 'notification':
        this.emit('agent-notification', message);
        break;

      case 'alert':
        this.emit('agent-alert', message);
        break;

      default:
        this.emit('unknown-message', message);
    }
  }

  /**
   * Handle message timeout
   */
  handleMessageTimeout(message) {
    this.emit('message-timeout', message);
  }

  /**
   * Generate collaboration ID
   */
  generateCollaborationId() {
    return `collab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get active collaborations
   */
  getActiveCollaborations() {
    return Array.from(this.activeCollaborations.entries()).map(([id, collab]) => ({
      id,
      ...collab,
      duration: Date.now() - collab.started
    }));
  }

  /**
   * Get framework status
   */
  getStatus() {
    return {
      active_collaborations: this.activeCollaborations.size,
      message_bus_status: this.messageBus.getStatus(),
      dependency_graph_size: Object.keys(this.dependencyGraph || {}).length
    };
  }
}

/**
 * Agent Message Bus
 */
class AgentMessageBus extends EventEmitter {
  constructor() {
    super();
    this.messages = new Map();
    this.subscriptions = new Map();
  }

  /**
   * Send message
   */
  async send(message, timeout = 30000) {
    const messageId = message.payload?.task_id || `msg-${Date.now()}`;

    this.messages.set(messageId, {
      message,
      timestamp: Date.now(),
      status: 'pending'
    });

    this.emit('message', message);

    // Wait for response
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.messages.delete(messageId);
        this.emit('timeout', message);
        reject(new Error('Message timeout'));
      }, timeout);

      const handler = (response) => {
        if (response.payload?.task_id === messageId) {
          clearTimeout(timeoutId);
          this.removeListener('task-response', handler);
          this.messages.delete(messageId);
          resolve(response.payload);
        }
      };

      this.on('task-response', handler);
    });
  }

  /**
   * Subscribe to messages
   */
  subscribe(agent, handler) {
    if (!this.subscriptions.has(agent)) {
      this.subscriptions.set(agent, []);
    }

    this.subscriptions.get(agent).push(handler);
  }

  /**
   * Unsubscribe from messages
   */
  unsubscribe(agent, handler) {
    if (this.subscriptions.has(agent)) {
      const handlers = this.subscriptions.get(agent);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Get bus status
   */
  getStatus() {
    return {
      pending_messages: this.messages.size,
      subscriptions: this.subscriptions.size
    };
  }
}

export { AgentMessageBus };
export default CollaborationFramework;
