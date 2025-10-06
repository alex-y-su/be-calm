/**
 * Swarm Coordinator - Multi-Agent Collaboration Intelligence
 *
 * Coordinates multiple agent instances working together like a swarm:
 * - Competitive collaboration (multiple proposals, select best)
 * - Parallel work division
 * - Cross-checking and validation
 * - Agent specialization tracking
 * - Meta-learning capabilities
 */

class SwarmCoordinator {
  constructor(config = {}) {
    this.config = config;
    this.activeSwarms = new Map();
    this.agentSpecializations = new Map();
    this.swarmHistory = [];
    this.metaLearningData = {
      validationRuleEffectiveness: new Map(),
      collaborationPatternSuccess: new Map(),
      checkpointTimingOptimal: new Map()
    };
  }

  /**
   * Create a competitive swarm (agents compete, best result selected)
   *
   * @param {string} task - Task description
   * @param {Array} agents - Agents to participate
   * @param {Object} config - Swarm configuration
   * @returns {Object} Swarm coordination result
   */
  async createCompetitiveSwarm(task, agents, config = {}) {
    const swarmId = this.generateSwarmId();

    const swarm = {
      id: swarmId,
      type: 'competitive',
      task,
      agents,
      config,
      results: [],
      status: 'running',
      startTime: Date.now()
    };

    this.activeSwarms.set(swarmId, swarm);

    // Spawn agents in parallel
    const agentPromises = agents.map(agent =>
      this.executeAgent(agent, task, { swarmId, mode: 'competitive' })
    );

    // Wait for all agents to complete
    const results = await Promise.allSettled(agentPromises);

    // Collect successful results
    swarm.results = results
      .filter(r => r.status === 'fulfilled')
      .map((r, index) => ({
        agent: agents[index],
        result: r.value,
        score: null // Will be scored
      }));

    // Score and rank results
    const scored = await this.scoreResults(swarm.results, task, config.scoringCriteria);

    // Select best result
    const best = scored.reduce((top, current) =>
      current.score > top.score ? current : top
    );

    swarm.status = 'completed';
    swarm.endTime = Date.now();
    swarm.duration = swarm.endTime - swarm.startTime;
    swarm.winner = best.agent;
    swarm.bestResult = best.result;

    // Record in history
    this.recordSwarmHistory(swarm);

    // Learn from outcome
    this.learnFromSwarm(swarm);

    return {
      swarmId,
      bestResult: best.result,
      winner: best.agent,
      allResults: scored,
      duration: swarm.duration
    };
  }

  /**
   * Create a collaborative swarm (agents divide work, combine results)
   *
   * @param {string} task - Task description
   * @param {Array} agents - Agents to participate
   * @param {Object} config - Swarm configuration
   * @returns {Object} Combined swarm result
   */
  async createCollaborativeSwarm(task, agents, config = {}) {
    const swarmId = this.generateSwarmId();

    const swarm = {
      id: swarmId,
      type: 'collaborative',
      task,
      agents,
      config,
      workDivision: null,
      results: [],
      status: 'running',
      startTime: Date.now()
    };

    this.activeSwarms.set(swarmId, swarm);

    // Divide work among agents
    const workDivision = this.divideWork(task, agents, config);
    swarm.workDivision = workDivision;

    // Execute agents in parallel with their assigned work
    const agentPromises = workDivision.map(division =>
      this.executeAgent(division.agent, division.subtask, {
        swarmId,
        mode: 'collaborative',
        context: division.context
      })
    );

    // Wait for all to complete
    const results = await Promise.allSettled(agentPromises);

    // Collect results
    swarm.results = results
      .filter(r => r.status === 'fulfilled')
      .map((r, index) => ({
        agent: workDivision[index].agent,
        subtask: workDivision[index].subtask,
        result: r.value
      }));

    // Combine results
    const combined = await this.combineResults(swarm.results, task, config);

    swarm.status = 'completed';
    swarm.endTime = Date.now();
    swarm.duration = swarm.endTime - swarm.startTime;
    swarm.combinedResult = combined;

    // Record and learn
    this.recordSwarmHistory(swarm);
    this.learnFromSwarm(swarm);

    return {
      swarmId,
      result: combined,
      contributions: swarm.results,
      duration: swarm.duration
    };
  }

  /**
   * Create a validation swarm (multiple agents cross-check)
   *
   * @param {Object} artifact - Artifact to validate
   * @param {Array} validators - Validation agents
   * @param {Object} config - Validation configuration
   * @returns {Object} Comprehensive validation result
   */
  async createValidationSwarm(artifact, validators, config = {}) {
    const swarmId = this.generateSwarmId();

    const swarm = {
      id: swarmId,
      type: 'validation',
      artifact,
      agents: validators,
      config,
      validations: [],
      status: 'running',
      startTime: Date.now()
    };

    this.activeSwarms.set(swarmId, swarm);

    // Run validators in parallel
    const validationPromises = validators.map(validator =>
      this.executeValidator(validator, artifact, {
        swarmId,
        validationRules: config.rules
      })
    );

    // Wait for all validations
    const results = await Promise.allSettled(validationPromises);

    // Collect validation results
    swarm.validations = results
      .filter(r => r.status === 'fulfilled')
      .map((r, index) => ({
        validator: validators[index],
        result: r.value,
        passed: r.value.passed,
        issues: r.value.issues || []
      }));

    // Aggregate validation results
    const aggregated = this.aggregateValidations(swarm.validations);

    swarm.status = 'completed';
    swarm.endTime = Date.now();
    swarm.duration = swarm.endTime - swarm.startTime;
    swarm.overallPassed = aggregated.passed;
    swarm.allIssues = aggregated.issues;

    // Record and learn
    this.recordSwarmHistory(swarm);
    this.learnFromSwarm(swarm);

    return {
      swarmId,
      passed: aggregated.passed,
      issues: aggregated.issues,
      validationDetails: swarm.validations,
      duration: swarm.duration
    };
  }

  /**
   * Generate unique swarm ID
   */
  generateSwarmId() {
    return `swarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Execute an agent with task
   */
  async executeAgent(agent, task, options = {}) {
    // This would integrate with the actual agent execution system
    // For now, return a mock implementation

    return {
      agent,
      output: `Result from ${agent} for task: ${task}`,
      quality: Math.random(), // Mock quality score
      executionTime: Math.random() * 1000,
      metadata: options
    };
  }

  /**
   * Execute a validator
   */
  async executeValidator(validator, artifact, options = {}) {
    // Mock validator execution
    return {
      validator,
      passed: Math.random() > 0.3, // Mock pass/fail
      issues: Math.random() > 0.5 ? [] : ['Mock issue 1', 'Mock issue 2'],
      score: Math.random()
    };
  }

  /**
   * Score competitive results
   */
  async scoreResults(results, task, scoringCriteria = {}) {
    const criteria = {
      quality: scoringCriteria.qualityWeight || 0.5,
      speed: scoringCriteria.speedWeight || 0.2,
      completeness: scoringCriteria.completenessWeight || 0.3
    };

    return results.map(r => {
      // Calculate composite score
      const qualityScore = r.result.quality || 0.5;
      const speedScore = 1 - Math.min(r.result.executionTime / 5000, 1);
      const completenessScore = this.assessCompleteness(r.result);

      const score = (
        qualityScore * criteria.quality +
        speedScore * criteria.speed +
        completenessScore * criteria.completeness
      );

      return {
        ...r,
        score,
        breakdown: {
          quality: qualityScore,
          speed: speedScore,
          completeness: completenessScore
        }
      };
    });
  }

  /**
   * Assess completeness of result
   */
  assessCompleteness(result) {
    // Mock completeness assessment
    if (!result.output) return 0.0;
    if (result.output.length < 100) return 0.3;
    if (result.output.length < 500) return 0.7;
    return 1.0;
  }

  /**
   * Divide work among agents
   */
  divideWork(task, agents, config = {}) {
    const divisions = [];

    if (config.divisionStrategy === 'by_capability') {
      // Divide based on agent capabilities
      divisions.push(...this.divideByCapability(task, agents));
    } else if (config.divisionStrategy === 'by_artifact') {
      // Divide by different artifacts/aspects
      divisions.push(...this.divideByArtifact(task, agents));
    } else {
      // Default: equal division
      const subtasks = this.splitTaskEqually(task, agents.length);
      agents.forEach((agent, i) => {
        divisions.push({
          agent,
          subtask: subtasks[i],
          context: { division: 'equal', index: i }
        });
      });
    }

    return divisions;
  }

  /**
   * Divide work by agent capability
   */
  divideByCapability(task, agents) {
    // Example: If task involves both code and docs
    const divisions = [];

    agents.forEach(agent => {
      if (agent === 'dev') {
        divisions.push({
          agent,
          subtask: 'Implement code portion',
          context: { capability: 'coding' }
        });
      } else if (agent === 'pm') {
        divisions.push({
          agent,
          subtask: 'Create documentation',
          context: { capability: 'documentation' }
        });
      }
    });

    return divisions;
  }

  /**
   * Divide work by artifact
   */
  divideByArtifact(task, agents) {
    // Example: Each agent works on different file/section
    const artifacts = ['section-1', 'section-2', 'section-3'];

    return agents.map((agent, i) => ({
      agent,
      subtask: `Work on ${artifacts[i % artifacts.length]}`,
      context: { artifact: artifacts[i % artifacts.length] }
    }));
  }

  /**
   * Split task into equal subtasks
   */
  splitTaskEqually(task, count) {
    // Simplified splitting
    const subtasks = [];
    for (let i = 0; i < count; i++) {
      subtasks.push(`${task} - Part ${i + 1} of ${count}`);
    }
    return subtasks;
  }

  /**
   * Combine results from collaborative swarm
   */
  async combineResults(results, task, config = {}) {
    // Strategy for combining results
    const strategy = config.combineStrategy || 'concatenate';

    switch(strategy) {
      case 'concatenate':
        return this.concatenateResults(results);

      case 'merge':
        return this.mergeResults(results);

      case 'best_of_each':
        return this.selectBestOfEach(results);

      default:
        return this.concatenateResults(results);
    }
  }

  /**
   * Concatenate results
   */
  concatenateResults(results) {
    return {
      combined: results.map(r => r.result.output).join('\n\n'),
      sources: results.map(r => r.agent)
    };
  }

  /**
   * Merge results intelligently
   */
  mergeResults(results) {
    // Mock merging logic
    return {
      merged: 'Merged output from: ' + results.map(r => r.agent).join(', '),
      sources: results.map(r => r.agent)
    };
  }

  /**
   * Select best of each component
   */
  selectBestOfEach(results) {
    // Mock selection logic
    return {
      selected: results[0].result,
      sources: [results[0].agent]
    };
  }

  /**
   * Aggregate validation results
   */
  aggregateValidations(validations) {
    const passed = validations.every(v => v.passed);
    const allIssues = [];

    for (const validation of validations) {
      if (validation.issues && validation.issues.length > 0) {
        allIssues.push(...validation.issues.map(issue => ({
          validator: validation.validator,
          issue
        })));
      }
    }

    return {
      passed,
      issues: allIssues,
      validatorCount: validations.length,
      passedCount: validations.filter(v => v.passed).length
    };
  }

  /**
   * Record swarm in history
   */
  recordSwarmHistory(swarm) {
    this.swarmHistory.push({
      id: swarm.id,
      type: swarm.type,
      agents: swarm.agents,
      duration: swarm.duration,
      success: swarm.status === 'completed',
      timestamp: Date.now()
    });

    // Keep only recent history
    if (this.swarmHistory.length > 100) {
      this.swarmHistory.shift();
    }
  }

  /**
   * Learn from swarm outcomes
   */
  learnFromSwarm(swarm) {
    // Track agent specialization
    if (swarm.type === 'competitive' && swarm.winner) {
      this.trackSpecialization(swarm.winner, swarm.task, 'success');
    }

    // Track collaboration pattern success
    const pattern = `${swarm.type}:${swarm.agents.join(',')}`;
    this.trackCollaborationPattern(pattern, swarm.status === 'completed');

    // Meta-learning: learn what works
    this.updateMetaLearning(swarm);
  }

  /**
   * Track agent specialization
   */
  trackSpecialization(agent, task, outcome) {
    if (!this.agentSpecializations.has(agent)) {
      this.agentSpecializations.set(agent, {
        taskTypes: new Map(),
        successRate: 0,
        totalTasks: 0
      });
    }

    const spec = this.agentSpecializations.get(agent);

    // Extract task type (simplified)
    const taskType = this.extractTaskType(task);

    if (!spec.taskTypes.has(taskType)) {
      spec.taskTypes.set(taskType, { count: 0, successes: 0 });
    }

    const taskStats = spec.taskTypes.get(taskType);
    taskStats.count++;
    if (outcome === 'success') taskStats.successes++;

    spec.totalTasks++;
    spec.successRate = Array.from(spec.taskTypes.values())
      .reduce((sum, stats) => sum + stats.successes, 0) / spec.totalTasks;
  }

  /**
   * Extract task type from task description
   */
  extractTaskType(task) {
    const taskLower = task.toLowerCase();

    if (taskLower.includes('architecture')) return 'architecture';
    if (taskLower.includes('code') || taskLower.includes('implement')) return 'coding';
    if (taskLower.includes('test')) return 'testing';
    if (taskLower.includes('validate')) return 'validation';
    if (taskLower.includes('design')) return 'design';
    if (taskLower.includes('prd') || taskLower.includes('requirements')) return 'requirements';

    return 'general';
  }

  /**
   * Track collaboration pattern success
   */
  trackCollaborationPattern(pattern, success) {
    if (!this.metaLearningData.collaborationPatternSuccess.has(pattern)) {
      this.metaLearningData.collaborationPatternSuccess.set(pattern, {
        attempts: 0,
        successes: 0,
        rate: 0
      });
    }

    const stats = this.metaLearningData.collaborationPatternSuccess.get(pattern);
    stats.attempts++;
    if (success) stats.successes++;
    stats.rate = stats.successes / stats.attempts;
  }

  /**
   * Update meta-learning data
   */
  updateMetaLearning(swarm) {
    // Learn which swarm types work best for which tasks
    // Learn optimal timing
    // Learn best agent combinations

    // This would be expanded in a real implementation
  }

  /**
   * Get specialized agent for task type
   */
  getSpecializedAgent(taskType) {
    let bestAgent = null;
    let bestScore = 0;

    for (const [agent, spec] of this.agentSpecializations.entries()) {
      const taskStats = spec.taskTypes.get(taskType);

      if (taskStats) {
        const score = taskStats.successes / taskStats.count;

        if (score > bestScore) {
          bestScore = score;
          bestAgent = agent;
        }
      }
    }

    return bestAgent;
  }

  /**
   * Get agent specialization report
   */
  getSpecializationReport() {
    const report = [];

    for (const [agent, spec] of this.agentSpecializations.entries()) {
      const taskBreakdown = [];

      for (const [taskType, stats] of spec.taskTypes.entries()) {
        taskBreakdown.push({
          taskType,
          count: stats.count,
          successRate: stats.successes / stats.count
        });
      }

      report.push({
        agent,
        overallSuccessRate: spec.successRate,
        totalTasks: spec.totalTasks,
        specializations: taskBreakdown.sort((a, b) => b.successRate - a.successRate)
      });
    }

    return report.sort((a, b) => b.overallSuccessRate - a.overallSuccessRate);
  }

  /**
   * Get collaboration pattern insights
   */
  getCollaborationInsights() {
    const insights = [];

    for (const [pattern, stats] of this.metaLearningData.collaborationPatternSuccess.entries()) {
      insights.push({
        pattern,
        attempts: stats.attempts,
        successes: stats.successes,
        successRate: stats.rate
      });
    }

    return insights.sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Get swarm statistics
   */
  getStatistics() {
    const total = this.swarmHistory.length;
    const successful = this.swarmHistory.filter(s => s.success).length;

    const byType = {};
    for (const swarm of this.swarmHistory) {
      if (!byType[swarm.type]) byType[swarm.type] = { count: 0, successes: 0 };
      byType[swarm.type].count++;
      if (swarm.success) byType[swarm.type].successes++;
    }

    return {
      totalSwarms: total,
      successful,
      successRate: total > 0 ? successful / total : 0,
      averageDuration: total > 0
        ? this.swarmHistory.reduce((sum, s) => sum + s.duration, 0) / total
        : 0,
      byType,
      activeSwarms: this.activeSwarms.size
    };
  }
}

export default SwarmCoordinator;
