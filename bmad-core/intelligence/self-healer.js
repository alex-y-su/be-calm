/**
 * Self-Healing System
 *
 * Provides automatic error recovery and system resilience:
 * - Automatic error detection and analysis
 * - Known fix application
 * - Retry with adjustments
 * - Degraded mode operation
 * - Proactive maintenance
 */

class SelfHealingSystem {
  constructor(config = {}) {
    this.config = config;
    this.knownIssues = new Map();
    this.recoveryStrategies = new Map();
    this.failureHistory = [];
    this.healingHistory = [];
    this.degradedComponents = new Set();
    this.healthChecks = new Map();
    this.initializeKnownIssues();
    this.initializeRecoveryStrategies();
  }

  /**
   * Initialize known issues and their fixes
   */
  initializeKnownIssues() {
    // Eval test failures
    this.knownIssues.set('eval_test_timeout', {
      pattern: /timeout|timed out|exceeded.*time/i,
      severity: 'medium',
      fixes: ['increase_timeout', 'optimize_test', 'split_test']
    });

    this.knownIssues.set('eval_assertion_failure', {
      pattern: /assertion.*failed|expected.*got/i,
      severity: 'high',
      fixes: ['analyze_with_reflection', 'check_domain_truth', 'update_implementation']
    });

    // Oracle validation failures
    this.knownIssues.set('oracle_terminology_mismatch', {
      pattern: /terminology|inconsistent.*term|undefined.*term/i,
      severity: 'medium',
      fixes: ['update_domain_truth', 'fix_terminology', 'add_alias']
    });

    this.knownIssues.set('oracle_semantic_violation', {
      pattern: /semantic|meaning|contradicts/i,
      severity: 'high',
      fixes: ['reflect_on_requirements', 'consult_pm', 'revise_implementation']
    });

    // Validator failures
    this.knownIssues.set('coverage_incomplete', {
      pattern: /coverage.*incomplete|missing.*coverage|untested/i,
      severity: 'medium',
      fixes: ['generate_missing_tests', 'update_traceability']
    });

    this.knownIssues.set('traceability_break', {
      pattern: /traceability|trace.*broken|orphan/i,
      severity: 'high',
      fixes: ['rebuild_traceability', 'link_artifacts']
    });

    // System errors
    this.knownIssues.set('agent_unavailable', {
      pattern: /agent.*not.*found|unavailable|offline/i,
      severity: 'critical',
      fixes: ['retry', 'use_fallback_agent', 'degrade_gracefully']
    });

    this.knownIssues.set('resource_exhaustion', {
      pattern: /out.*memory|resource.*exceeded|quota/i,
      severity: 'critical',
      fixes: ['cleanup_resources', 'increase_limits', 'reduce_concurrency']
    });
  }

  /**
   * Initialize recovery strategies
   */
  initializeRecoveryStrategies() {
    // Retry strategy
    this.recoveryStrategies.set('retry', {
      name: 'Retry',
      execute: async (context) => this.retryOperation(context),
      maxAttempts: 3,
      backoff: 'exponential'
    });

    // Increase timeout strategy
    this.recoveryStrategies.set('increase_timeout', {
      name: 'Increase Timeout',
      execute: async (context) => this.increaseTimeout(context),
      maxAttempts: 2
    });

    // Analyze with reflection
    this.recoveryStrategies.set('analyze_with_reflection', {
      name: 'Reflection Analysis',
      execute: async (context) => this.analyzeWithReflection(context),
      maxAttempts: 1
    });

    // Check domain truth
    this.recoveryStrategies.set('check_domain_truth', {
      name: 'Domain Truth Check',
      execute: async (context) => this.checkDomainTruth(context),
      maxAttempts: 1
    });

    // Degrade gracefully
    this.recoveryStrategies.set('degrade_gracefully', {
      name: 'Graceful Degradation',
      execute: async (context) => this.degradeGracefully(context),
      maxAttempts: 1
    });

    // Generate missing tests
    this.recoveryStrategies.set('generate_missing_tests', {
      name: 'Generate Missing Tests',
      execute: async (context) => this.generateMissingTests(context),
      maxAttempts: 1
    });

    // Update domain truth
    this.recoveryStrategies.set('update_domain_truth', {
      name: 'Update Domain Truth',
      execute: async (context) => this.updateDomainTruth(context),
      maxAttempts: 1
    });
  }

  /**
   * Detect and recover from failure automatically
   *
   * @param {Object} failure - Failure information
   * @returns {Object} Recovery result
   */
  async handleFailure(failure) {
    const startTime = Date.now();

    // Record failure
    this.recordFailure(failure);

    // Analyze failure
    const analysis = this.analyzeFailure(failure);

    // Detect issue type
    const issueType = this.detectIssueType(failure);

    if (!issueType) {
      return {
        recovered: false,
        reason: 'Unknown issue type',
        analysis,
        action: 'manual_intervention_required'
      };
    }

    // Get recovery strategies
    const strategies = this.knownIssues.get(issueType).fixes;

    // Attempt recovery strategies in order
    for (const strategyName of strategies) {
      const strategy = this.recoveryStrategies.get(strategyName);

      if (!strategy) continue;

      try {
        const context = {
          failure,
          analysis,
          issueType,
          attempt: 1
        };

        const result = await this.attemptRecovery(strategy, context);

        if (result.success) {
          const duration = Date.now() - startTime;

          // Record successful healing
          this.recordHealing({
            failure,
            issueType,
            strategy: strategyName,
            duration,
            success: true
          });

          return {
            recovered: true,
            strategy: strategyName,
            result,
            duration,
            analysis
          };
        }
      } catch (error) {
        console.error(`Recovery strategy ${strategyName} failed:`, error);
      }
    }

    // All strategies failed
    return {
      recovered: false,
      reason: 'All recovery strategies exhausted',
      analysis,
      action: 'escalate_to_user'
    };
  }

  /**
   * Analyze failure to understand root cause
   */
  analyzeFailure(failure) {
    const analysis = {
      type: failure.type || 'unknown',
      severity: 'unknown',
      rootCause: null,
      affectedComponents: [],
      suggestedActions: []
    };

    // Determine severity
    if (failure.message) {
      for (const [issueType, issue] of this.knownIssues.entries()) {
        if (issue.pattern.test(failure.message)) {
          analysis.severity = issue.severity;
          analysis.rootCause = issueType;
          break;
        }
      }
    }

    // Identify affected components
    if (failure.agent) {
      analysis.affectedComponents.push(failure.agent);
    }

    if (failure.phase) {
      analysis.affectedComponents.push(`phase:${failure.phase}`);
    }

    // Generate suggestions
    if (analysis.rootCause) {
      const issue = this.knownIssues.get(analysis.rootCause);
      analysis.suggestedActions = issue.fixes;
    }

    return analysis;
  }

  /**
   * Detect issue type from failure
   */
  detectIssueType(failure) {
    if (!failure.message) return null;

    for (const [issueType, issue] of this.knownIssues.entries()) {
      if (issue.pattern.test(failure.message)) {
        return issueType;
      }
    }

    return null;
  }

  /**
   * Attempt recovery with a strategy
   */
  async attemptRecovery(strategy, context) {
    const maxAttempts = strategy.maxAttempts || 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      context.attempt = attempt;

      try {
        const result = await strategy.execute(context);

        if (result.success) {
          return result;
        }

        // Apply backoff if configured
        if (attempt < maxAttempts && strategy.backoff === 'exponential') {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    }

    return {
      success: false,
      reason: 'Max attempts exceeded'
    };
  }

  /**
   * Retry operation
   */
  async retryOperation(context) {
    // Mock retry
    return {
      success: Math.random() > 0.3, // 70% success rate
      message: 'Operation retried'
    };
  }

  /**
   * Increase timeout and retry
   */
  async increaseTimeout(context) {
    // Mock timeout increase
    return {
      success: Math.random() > 0.4,
      message: 'Timeout increased to 2x',
      newTimeout: context.failure.timeout * 2
    };
  }

  /**
   * Analyze with reflection agent
   */
  async analyzeWithReflection(context) {
    // Mock reflection analysis
    return {
      success: true,
      message: 'Reflection agent identified root cause',
      findings: 'Implementation does not match requirement X',
      suggestedFix: 'Update implementation to align with requirement'
    };
  }

  /**
   * Check domain truth for inconsistencies
   */
  async checkDomainTruth(context) {
    // Mock domain truth check
    return {
      success: true,
      message: 'Domain truth checked',
      issues: ['Terminology mismatch: expected "user" but found "customer"'],
      suggestedFix: 'Update artifact to use "user" consistently'
    };
  }

  /**
   * Degrade gracefully when component fails
   */
  async degradeGracefully(context) {
    const component = context.failure.component || context.failure.agent;

    if (component) {
      this.degradedComponents.add(component);
    }

    return {
      success: true,
      message: `System degraded: ${component} disabled`,
      degradedMode: true,
      fallbackStrategy: this.getFallbackStrategy(component)
    };
  }

  /**
   * Get fallback strategy for degraded component
   */
  getFallbackStrategy(component) {
    const fallbacks = {
      'monitor': 'Monitoring disabled, continue without tracking',
      'eval': 'Automated tests disabled, fall back to manual testing',
      'oracle': 'Truth validation disabled, proceed with caution - user verification recommended',
      'validator': 'Gate validation disabled, continue with warnings'
    };

    return fallbacks[component] || 'Component disabled, reduced functionality';
  }

  /**
   * Generate missing tests
   */
  async generateMissingTests(context) {
    return {
      success: true,
      message: 'Generated missing test cases',
      generated: ['test-case-1', 'test-case-2', 'test-case-3'],
      coverageImprovement: '15%'
    };
  }

  /**
   * Update domain truth
   */
  async updateDomainTruth(context) {
    return {
      success: true,
      message: 'Domain truth updated',
      changes: ['Added term: customer -> user', 'Updated definition: authentication'],
      requiresReview: true
    };
  }

  /**
   * Proactive maintenance - detect and fix issues before they cause failures
   */
  async performProactiveMaintenance() {
    const issues = [];

    // Check for stale test datasets
    const datasetStaleness = await this.checkDatasetStaleness();
    if (datasetStaleness.stale) {
      issues.push({
        type: 'stale_test_datasets',
        severity: 'medium',
        action: 'regenerate_datasets',
        details: datasetStaleness
      });
    }

    // Check for domain truth drift
    const truthDrift = await this.checkDomainTruthDrift();
    if (truthDrift.drifted) {
      issues.push({
        type: 'domain_truth_drift',
        severity: 'medium',
        action: 'update_domain_truth',
        details: truthDrift
      });
    }

    // Check for performance degradation
    const perfDegradation = await this.checkPerformanceDegradation();
    if (perfDegradation.degraded) {
      issues.push({
        type: 'performance_degradation',
        severity: 'low',
        action: 'optimize_performance',
        details: perfDegradation
      });
    }

    // Auto-fix trivial issues
    const fixed = [];
    for (const issue of issues) {
      if (issue.severity === 'low' || issue.severity === 'medium') {
        const result = await this.autoFixIssue(issue);
        if (result.success) {
          fixed.push(issue.type);
        }
      }
    }

    return {
      issuesDetected: issues.length,
      issuesFixed: fixed.length,
      fixed,
      remainingIssues: issues.filter(i => !fixed.includes(i.type))
    };
  }

  /**
   * Check if test datasets are stale
   */
  async checkDatasetStaleness() {
    // Mock staleness check
    return {
      stale: Math.random() > 0.7,
      age: 30, // days
      recommendation: 'Regenerate datasets'
    };
  }

  /**
   * Check for domain truth drift
   */
  async checkDomainTruthDrift() {
    // Mock drift check
    return {
      drifted: Math.random() > 0.8,
      inconsistencies: ['Term X used differently in 3 places'],
      recommendation: 'Update domain truth'
    };
  }

  /**
   * Check for performance degradation
   */
  async checkPerformanceDegradation() {
    // Mock performance check
    return {
      degraded: Math.random() > 0.9,
      currentPerformance: 0.7,
      baselinePerformance: 1.0,
      recommendation: 'Optimize queries'
    };
  }

  /**
   * Auto-fix an issue
   */
  async autoFixIssue(issue) {
    const fixes = {
      'stale_test_datasets': () => this.regenerateDatasets(),
      'domain_truth_drift': () => this.updateDomainTruth({}),
      'performance_degradation': () => this.optimizePerformance()
    };

    const fixFn = fixes[issue.type];

    if (fixFn) {
      try {
        await fixFn();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: false, reason: 'No fix available' };
  }

  /**
   * Regenerate test datasets
   */
  async regenerateDatasets() {
    // Mock regeneration
    return {
      success: true,
      message: 'Test datasets regenerated'
    };
  }

  /**
   * Optimize performance
   */
  async optimizePerformance() {
    // Mock optimization
    return {
      success: true,
      message: 'Performance optimized',
      improvement: '20%'
    };
  }

  /**
   * Check system health
   */
  async performHealthCheck() {
    const health = {
      overall: 'healthy',
      components: {},
      degraded: Array.from(this.degradedComponents),
      recommendations: []
    };

    // Check each component
    const components = ['oracle', 'eval', 'validator', 'monitor', 'dev'];

    for (const component of components) {
      const componentHealth = await this.checkComponentHealth(component);
      health.components[component] = componentHealth;

      if (componentHealth.status !== 'healthy') {
        health.overall = 'degraded';
      }
    }

    // Generate recommendations
    if (health.degraded.length > 0) {
      health.recommendations.push(`${health.degraded.length} component(s) running in degraded mode`);
    }

    if (this.failureHistory.length > 10) {
      health.recommendations.push('High failure rate detected - consider investigating patterns');
    }

    return health;
  }

  /**
   * Check individual component health
   */
  async checkComponentHealth(component) {
    if (this.degradedComponents.has(component)) {
      return {
        status: 'degraded',
        message: `${component} is running in degraded mode`
      };
    }

    // Mock health check
    const healthy = Math.random() > 0.1;

    return {
      status: healthy ? 'healthy' : 'warning',
      message: healthy ? 'Component operational' : 'Minor issues detected'
    };
  }

  /**
   * Record failure in history
   */
  recordFailure(failure) {
    this.failureHistory.push({
      ...failure,
      timestamp: Date.now()
    });

    // Keep only recent failures
    if (this.failureHistory.length > 100) {
      this.failureHistory.shift();
    }
  }

  /**
   * Record successful healing
   */
  recordHealing(healing) {
    this.healingHistory.push({
      ...healing,
      timestamp: Date.now()
    });

    // Keep only recent healings
    if (this.healingHistory.length > 100) {
      this.healingHistory.shift();
    }
  }

  /**
   * Get self-healing statistics
   */
  getStatistics() {
    const totalFailures = this.failureHistory.length;
    const totalHealings = this.healingHistory.length;
    const successfulHealings = this.healingHistory.filter(h => h.success).length;

    return {
      totalFailures,
      totalHealings,
      successfulHealings,
      healingSuccessRate: totalHealings > 0 ? successfulHealings / totalHealings : 0,
      degradedComponents: Array.from(this.degradedComponents),
      knownIssuesCount: this.knownIssues.size,
      recoveryStrategiesCount: this.recoveryStrategies.size
    };
  }

  /**
   * Get failure patterns
   */
  getFailurePatterns() {
    const patterns = new Map();

    for (const failure of this.failureHistory) {
      const issueType = this.detectIssueType(failure);

      if (issueType) {
        if (!patterns.has(issueType)) {
          patterns.set(issueType, { count: 0, examples: [] });
        }

        const pattern = patterns.get(issueType);
        pattern.count++;

        if (pattern.examples.length < 3) {
          pattern.examples.push(failure.message);
        }
      }
    }

    return Array.from(patterns.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      examples: data.examples,
      percentage: (data.count / this.failureHistory.length) * 100
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Reset degraded components (restore full functionality)
   */
  resetDegradedComponents() {
    const count = this.degradedComponents.size;
    this.degradedComponents.clear();

    return {
      restored: count,
      message: `Restored ${count} degraded component(s) to full functionality`
    };
  }
}

export default SelfHealingSystem;
