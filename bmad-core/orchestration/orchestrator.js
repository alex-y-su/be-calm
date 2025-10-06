/**
 * BMAD Agent Orchestration & Collaboration System
 * Version: 2.0
 *
 * Coordinates agent execution, enforces rules, and manages autonomous workflows.
 */

import { EventEmitter } from 'events';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

export class Orchestrator extends EventEmitter {
  constructor(stateMachine, decisionEngine, config = {}) {
    super();

    this.stateMachine = stateMachine;
    this.decisionEngine = decisionEngine;
    this.config = {
      rulesFile: config.rulesFile || 'bmad-core/config/orchestration-rules.yaml',
      autoRecovery: config.autoRecovery !== false,
      ...config
    };

    this.rules = null;
    this.activeAgents = new Map();
    this.pendingValidations = new Map();
    this.issueQueue = [];
  }

  /**
   * Initialize orchestrator
   */
  async initialize() {
    await this.loadRules();

    // Listen to state machine events
    this.stateMachine.on('transition', this.handleStateTransition.bind(this));
    this.stateMachine.on('workflow-blocked', this.handleWorkflowBlocked.bind(this));

    this.emit('initialized');
    return this;
  }

  /**
   * Load orchestration rules
   */
  async loadRules() {
    const rulesPath = path.resolve(this.config.rulesFile);

    if (await fs.pathExists(rulesPath)) {
      const content = await fs.readFile(rulesPath, 'utf8');
      this.rules = yaml.load(content);
    } else {
      // Use default rules
      this.rules = this.getDefaultRules();
    }

    this.emit('rules-loaded', { rules: this.rules });
  }

  /**
   * Get default orchestration rules
   */
  getDefaultRules() {
    return {
      never_proceed_without: {
        oracle_validation: 'All artifacts must pass Oracle',
        eval_test_coverage: '100% domain fact coverage required',
        validator_traceability: 'Complete chain from domain to code',
        monitor_health_check: 'No critical drift detected'
      },
      auto_blocking_conditions: {
        eval_tests_failing: 'Block commit if <90% pass rate',
        oracle_validation_failed: 'Block artifact if semantic inconsistency',
        validator_traceability_broken: 'Block if chain incomplete',
        monitor_drift_alert: 'Block if critical drift detected',
        performance_degradation: 'Block if >10% slower than baseline'
      },
      auto_recovery_enabled: true,
      parallel_validation_enabled: true
    };
  }

  /**
   * Execute artifact creation with parallel validation
   */
  async executeWithParallelValidation(primaryAgent, task, options = {}) {
    const validationId = `validation-${Date.now()}`;

    this.emit('artifact-creation-started', {
      validationId,
      primaryAgent,
      task
    });

    // Track primary agent
    this.activeAgents.set(primaryAgent, {
      task,
      started: Date.now(),
      mode: 'primary'
    });

    // Start primary agent (would integrate with actual agent system)
    const primaryResult = await this.invokeAgent(primaryAgent, task, options);

    if (!primaryResult.success) {
      this.activeAgents.delete(primaryAgent);
      return {
        success: false,
        error: primaryResult.error,
        validationId
      };
    }

    const artifact = primaryResult.artifact;

    // Start background validation agents
    const backgroundAgents = [
      {
        agent: 'oracle',
        task: 'validate-semantic-consistency',
        mode: 'non-blocking'
      },
      {
        agent: 'validator',
        task: 'check-traceability',
        mode: 'non-blocking'
      },
      {
        agent: 'eval',
        task: 'create-tests',
        mode: 'non-blocking'
      },
      {
        agent: 'monitor',
        task: 'establish-baseline',
        mode: 'non-blocking'
      }
    ];

    const validationPromises = backgroundAgents.map(bg =>
      this.invokeAgent(bg.agent, bg.task, { artifact, mode: bg.mode })
    );

    // Store pending validations
    this.pendingValidations.set(validationId, {
      artifact,
      primaryAgent,
      backgroundAgents: backgroundAgents.map(bg => bg.agent),
      promises: validationPromises,
      started: Date.now()
    });

    // Wait for all background agents to complete
    const results = await Promise.allSettled(validationPromises);

    // Remove from pending
    this.pendingValidations.delete(validationId);
    this.activeAgents.delete(primaryAgent);

    // Check results
    const failures = results.filter(r => r.status === 'rejected' || !r.value?.success);

    if (failures.length > 0) {
      this.emit('artifact-validation-failed', {
        validationId,
        artifact,
        failures: failures.map((f, i) => ({
          agent: backgroundAgents[i].agent,
          error: f.reason || f.value?.error
        }))
      });

      return {
        success: false,
        status: 'needs_review',
        artifact,
        validationId,
        failures
      };
    }

    this.emit('artifact-validated', {
      validationId,
      artifact,
      results: results.map((r, i) => ({
        agent: backgroundAgents[i].agent,
        result: r.value
      }))
    });

    return {
      success: true,
      status: 'validated',
      artifact,
      validationId,
      results
    };
  }

  /**
   * Invoke an agent with a task
   */
  async invokeAgent(agent, task, options = {}) {
    this.emit('agent-invoked', { agent, task, options });

    // This would integrate with the actual agent execution system
    // For now, emit events that the agent system can listen to

    return new Promise((resolve) => {
      const timeout = options.timeout || 30000;

      const timeoutId = setTimeout(() => {
        resolve({
          success: false,
          error: 'Agent execution timeout',
          agent,
          task
        });
      }, timeout);

      this.emit('agent-execute', {
        agent,
        task,
        options,
        callback: (result) => {
          clearTimeout(timeoutId);
          resolve(result);
        }
      });
    });
  }

  /**
   * Check blocking conditions
   */
  async checkBlockingConditions(context = {}) {
    const conditions = this.rules.auto_blocking_conditions;
    const blocking = [];

    for (const [conditionId, description] of Object.entries(conditions)) {
      const blocked = await this.evaluateBlockingCondition(conditionId, context);

      if (blocked) {
        blocking.push({
          condition: conditionId,
          description,
          details: blocked.details
        });
      }
    }

    if (blocking.length > 0) {
      this.emit('blocking-conditions-detected', { blocking });

      // Block the state machine
      this.stateMachine.block('blocking_conditions_detected', {
        conditions: blocking
      });

      return { blocked: true, conditions: blocking };
    }

    return { blocked: false, conditions: [] };
  }

  /**
   * Evaluate a specific blocking condition
   */
  async evaluateBlockingCondition(conditionId, context) {
    switch (conditionId) {
      case 'eval_tests_failing':
        return await this.checkEvalTestsFailure(context);

      case 'oracle_validation_failed':
        return await this.checkOracleValidation(context);

      case 'validator_traceability_broken':
        return await this.checkTraceability(context);

      case 'monitor_drift_alert':
        return await this.checkDriftAlert(context);

      case 'performance_degradation':
        return await this.checkPerformanceDegradation(context);

      default:
        return null;
    }
  }

  /**
   * Check eval test failure rate
   */
  async checkEvalTestsFailure(context) {
    // Would integrate with eval agent
    const passRate = context.eval_pass_rate || 100;

    if (passRate < 90) {
      return {
        blocked: true,
        details: {
          pass_rate: passRate,
          threshold: 90,
          message: 'Eval test pass rate below 90%'
        }
      };
    }

    return null;
  }

  /**
   * Check oracle validation
   */
  async checkOracleValidation(context) {
    // Would integrate with oracle agent
    if (context.oracle_failed) {
      return {
        blocked: true,
        details: {
          message: 'Oracle detected semantic inconsistency',
          artifact: context.artifact
        }
      };
    }

    return null;
  }

  /**
   * Check traceability
   */
  async checkTraceability(context) {
    // Would integrate with validator agent
    if (context.traceability_broken) {
      return {
        blocked: true,
        details: {
          message: 'Traceability chain incomplete',
          broken_links: context.broken_links || []
        }
      };
    }

    return null;
  }

  /**
   * Check drift alert
   */
  async checkDriftAlert(context) {
    // Would integrate with monitor agent
    if (context.critical_drift) {
      return {
        blocked: true,
        details: {
          message: 'Critical drift detected',
          drift_type: context.drift_type,
          severity: context.drift_severity
        }
      };
    }

    return null;
  }

  /**
   * Check performance degradation
   */
  async checkPerformanceDegradation(context) {
    // Would integrate with monitor agent
    if (context.performance_degradation) {
      const degradation = context.performance_degradation;

      if (degradation > 10) {
        return {
          blocked: true,
          details: {
            message: `Performance degraded by ${degradation}%`,
            threshold: 10,
            current: degradation
          }
        };
      }
    }

    return null;
  }

  /**
   * Auto-recovery flow
   */
  async executeAutoRecovery(issue) {
    if (!this.config.autoRecovery) {
      this.emit('auto-recovery-disabled', { issue });
      return { recovered: false, reason: 'auto_recovery_disabled' };
    }

    this.emit('auto-recovery-started', { issue });

    // Step 1: Reflection analyzes
    const analysis = await this.invokeAgent('reflection', 'analyze-failure', {
      issue,
      timeout: 60000
    });

    if (!analysis.success) {
      return { recovered: false, step: 'reflection_failed', error: analysis.error };
    }

    // Step 2: Oracle determines truth
    const truthCheck = await this.invokeAgent('oracle', 'validate-truth', {
      issue,
      analysis: analysis.result,
      timeout: 60000
    });

    if (!truthCheck.success) {
      return { recovered: false, step: 'oracle_failed', error: truthCheck.error };
    }

    // Step 3: Validator identifies affected artifacts
    const impactAnalysis = await this.invokeAgent('validator', 'trace-impact', {
      issue,
      analysis: analysis.result,
      timeout: 60000
    });

    if (!impactAnalysis.success) {
      return { recovered: false, step: 'validator_failed', error: impactAnalysis.error };
    }

    // Step 4: Monitor assesses impact
    const impactAssessment = await this.invokeAgent('monitor', 'assess-impact', {
      issue,
      affectedArtifacts: impactAnalysis.result,
      timeout: 60000
    });

    if (!impactAssessment.success) {
      return { recovered: false, step: 'monitor_failed', error: impactAssessment.error };
    }

    // Step 5: Route to appropriate agent
    const routingDecision = this.routeIssue(
      issue,
      analysis.result,
      truthCheck.result,
      impactAnalysis.result
    );

    this.emit('issue-routed', { issue, routingDecision });

    // Execute fix
    const fix = await this.invokeAgent(routingDecision.agent, routingDecision.task, {
      issue,
      analysis: analysis.result,
      routing: routingDecision,
      timeout: 120000
    });

    if (!fix.success) {
      return {
        recovered: false,
        step: 'fix_failed',
        agent: routingDecision.agent,
        error: fix.error
      };
    }

    // Step 6: Eval validates resolution
    const validation = await this.invokeAgent('eval', 'validate-resolution', {
      issue,
      fix: fix.result,
      timeout: 60000
    });

    if (!validation.success || !validation.result.resolved) {
      return {
        recovered: false,
        step: 'validation_failed',
        error: validation.error || 'Resolution not confirmed'
      };
    }

    this.emit('auto-recovery-completed', {
      issue,
      resolution: fix.result,
      validation: validation.result
    });

    return {
      recovered: true,
      analysis: analysis.result,
      fix: fix.result,
      validation: validation.result
    };
  }

  /**
   * Route issue to appropriate agent
   */
  routeIssue(issue, analysis, truthCheck, impactAnalysis) {
    // Decision tree routing
    if (analysis.root_cause === 'truth_gap') {
      return {
        agent: 'oracle',
        task: 'update-truth',
        priority: 'high'
      };
    }

    if (analysis.issue_type === 'code_implementation') {
      return {
        agent: 'dev',
        task: 'fix-implementation',
        priority: 'high'
      };
    }

    if (analysis.issue_type === 'test_error') {
      return {
        agent: 'eval',
        task: 'update-test',
        priority: 'medium'
      };
    }

    if (analysis.issue_type === 'unclear_requirement') {
      return {
        agent: 'human',
        task: 'clarify-requirement',
        priority: 'high'
      };
    }

    if (analysis.issue_type === 'architecture_mismatch') {
      return {
        agent: 'architect',
        task: 'update-architecture',
        priority: 'high'
      };
    }

    // Default: route to human
    return {
      agent: 'human',
      task: 'manual-resolution',
      priority: 'critical'
    };
  }

  /**
   * Handle state transition
   */
  async handleStateTransition(event) {
    const { from, to, reason } = event;

    this.emit('state-transition-handled', { from, to, reason });

    // Initialize agents for new state
    const newState = this.stateMachine.states[to];
    if (newState) {
      await this.initializeStateAgents(newState);
    }
  }

  /**
   * Initialize agents for a state
   */
  async initializeStateAgents(state) {
    this.emit('agents-initializing', {
      state: state.id,
      agents: state.agents
    });

    for (const agent of state.agents) {
      await this.invokeAgent(agent, 'initialize', {
        state: state.id,
        phase: state.phase
      });
    }

    this.emit('agents-initialized', {
      state: state.id,
      agents: state.agents
    });
  }

  /**
   * Handle workflow blocked event
   */
  async handleWorkflowBlocked(event) {
    const { state, reason, details } = event;

    this.emit('workflow-blocked-handled', { state, reason, details });

    // Add to issue queue
    this.issueQueue.push({
      state,
      reason,
      details,
      timestamp: Date.now()
    });

    // Attempt auto-recovery if enabled
    if (this.config.autoRecovery) {
      const recovery = await this.executeAutoRecovery({
        state,
        reason,
        details
      });

      if (recovery.recovered) {
        // Unblock workflow
        this.stateMachine.unblock('auto_recovery_successful', 'orchestrator');
      } else {
        // Escalate to human
        this.emit('escalate-to-human', {
          state,
          reason,
          details,
          recovery
        });
      }
    }
  }

  /**
   * Enforce never-proceed-without rules
   */
  async enforceNeverProceedWithout(context = {}) {
    const rules = this.rules.never_proceed_without;
    const violations = [];

    for (const [rule, description] of Object.entries(rules)) {
      const satisfied = await this.checkNeverProceedRule(rule, context);

      if (!satisfied) {
        violations.push({
          rule,
          description
        });
      }
    }

    if (violations.length > 0) {
      this.emit('never-proceed-violations', { violations });
      return { canProceed: false, violations };
    }

    return { canProceed: true, violations: [] };
  }

  /**
   * Check never-proceed-without rule
   */
  async checkNeverProceedRule(rule, context) {
    switch (rule) {
      case 'oracle_validation':
        return context.oracle_validated === true;

      case 'eval_test_coverage':
        return context.eval_coverage >= 100;

      case 'validator_traceability':
        return context.traceability_complete === true;

      case 'monitor_health_check':
        return !context.critical_drift;

      default:
        return true;
    }
  }

  /**
   * Get orchestrator status
   */
  getStatus() {
    return {
      active_agents: Array.from(this.activeAgents.entries()).map(([agent, info]) => ({
        agent,
        ...info,
        duration: Date.now() - info.started
      })),
      pending_validations: this.pendingValidations.size,
      issue_queue: this.issueQueue.length,
      rules: this.rules,
      auto_recovery_enabled: this.config.autoRecovery
    };
  }

  /**
   * Clear completed issues from queue
   */
  clearResolvedIssues() {
    const before = this.issueQueue.length;
    this.issueQueue = this.issueQueue.filter(issue => !issue.resolved);
    const cleared = before - this.issueQueue.length;

    this.emit('issues-cleared', { cleared, remaining: this.issueQueue.length });
    return cleared;
  }
}

export default Orchestrator;
