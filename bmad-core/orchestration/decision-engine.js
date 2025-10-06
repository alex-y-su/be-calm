/**
 * BMAD Autonomous Decision Making Framework
 * Version: 2.0
 *
 * Manages autonomous decision-making with confidence scoring and approval routing.
 */

import { EventEmitter } from 'events';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

export class DecisionEngine extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      capabilitiesFile: config.capabilitiesFile || 'bmad-core/config/agent-capabilities.yaml',
      decisionLevelsFile: config.decisionLevelsFile || 'bmad-core/config/decision-levels.yaml',
      previewDelay: config.previewDelay || 5000, // 5 seconds
      historySize: config.historySize || 1000,
      ...config
    };

    this.agentCapabilities = null;
    this.decisionLevels = null;
    this.decisionHistory = [];
    this.pendingApprovals = new Map();
    this.pendingPreviews = new Map();
  }

  /**
   * Initialize decision engine
   */
  async initialize() {
    await this.loadAgentCapabilities();
    await this.loadDecisionLevels();

    this.emit('initialized');
    return this;
  }

  /**
   * Load agent capabilities
   */
  async loadAgentCapabilities() {
    const capabilitiesPath = path.resolve(this.config.capabilitiesFile);

    if (await fs.pathExists(capabilitiesPath)) {
      const content = await fs.readFile(capabilitiesPath, 'utf8');
      this.agentCapabilities = yaml.load(content);
    } else {
      this.agentCapabilities = this.getDefaultCapabilities();
    }

    this.emit('capabilities-loaded', { capabilities: this.agentCapabilities });
  }

  /**
   * Load decision levels
   */
  async loadDecisionLevels() {
    const levelsPath = path.resolve(this.config.decisionLevelsFile);

    if (await fs.pathExists(levelsPath)) {
      const content = await fs.readFile(levelsPath, 'utf8');
      this.decisionLevels = yaml.load(content);
    } else {
      this.decisionLevels = this.getDefaultDecisionLevels();
    }

    this.emit('decision-levels-loaded', { levels: this.decisionLevels });
  }

  /**
   * Get default agent capabilities
   */
  getDefaultCapabilities() {
    return {
      dev: {
        can_auto_proceed_when: [
          'eval_tests_pass',
          'oracle_validated',
          'validator_traceability_confirmed',
          'monitor_health_green',
          'no_blocking_issues'
        ],
        requires_approval_for: [
          'merge_to_main',
          'deploy_to_production',
          'breaking_api_changes'
        ]
      },
      pm: {
        can_auto_create_requirements_when: [
          'traces_to_domain_truth',
          'eval_tests_generated',
          'oracle_approved',
          'no_conflicts_with_existing'
        ],
        requires_approval_for: [
          'major_scope_changes',
          'new_constraints_not_in_domain',
          'deprecated_features'
        ]
      },
      architect: {
        can_auto_design_when: [
          'domain_constraints_satisfied',
          'eval_test_scenarios_supported',
          'oracle_consistency_verified',
          'no_major_tech_changes'
        ],
        requires_approval_for: [
          'new_technology_stack',
          'major_architectural_changes',
          'security_model_changes'
        ]
      },
      oracle: {
        can_auto_validate: true,
        can_auto_block_inconsistencies: true,
        requires_approval_for: [
          'domain_truth_updates',
          'terminology_changes',
          'constraint_relaxation'
        ]
      },
      eval: {
        can_auto_generate_tests: true,
        can_auto_run_tests: true,
        can_auto_block_commits: true,
        requires_approval_for: [
          'lower_test_coverage_threshold',
          'disable_test_categories',
          'skip_tests'
        ]
      },
      validator: {
        can_auto_check_traceability: true,
        can_auto_block_broken_chains: true,
        requires_approval_for: [
          'relax_traceability_requirements',
          'override_traceability_failures'
        ]
      },
      monitor: {
        can_auto_track_metrics: true,
        can_auto_alert: true,
        can_auto_establish_baselines: true,
        requires_approval_for: [
          'change_alert_thresholds',
          'disable_monitoring',
          'reset_baselines'
        ]
      },
      reflection: {
        can_auto_analyze: true,
        can_auto_generate_recommendations: true,
        requires_approval_for: [
          'apply_recommendations_automatically',
          'modify_agent_strategies',
          'update_validation_rules'
        ]
      }
    };
  }

  /**
   * Get default decision levels
   */
  getDefaultDecisionLevels() {
    return {
      fully_automatic: {
        description: 'Execute without human approval',
        examples: [
          'run_eval_tests_on_save',
          'generate_test_datasets_from_domain_truth',
          'validate_traceability_chains',
          'track_metrics_and_trends',
          'generate_reports'
        ]
      },
      automatic_with_notification: {
        description: 'Execute automatically, notify human',
        examples: [
          'transition_to_next_workflow_phase',
          'create_functional_test_datasets',
          'generate_validation_chain_proof',
          'update_baselines'
        ]
      },
      automatic_with_preview: {
        description: 'Show preview, auto-execute if no objection',
        preview_delay_ms: 5000,
        examples: [
          'create_enhancement_truth_brownfield',
          'generate_migration_strategy',
          'update_domain_truth_based_on_learnings'
        ]
      },
      require_approval: {
        description: 'Require explicit human approval',
        examples: [
          'accept_breaking_changes_brownfield',
          'modify_domain_truth',
          'override_blocking_validation',
          'force_state_transition'
        ]
      }
    };
  }

  /**
   * Make a decision
   */
  async makeDecision(agent, action, context = {}) {
    const decisionId = `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.emit('decision-requested', {
      decisionId,
      agent,
      action,
      context
    });

    // Calculate confidence score
    const confidence = await this.calculateConfidence(agent, action, context);

    // Determine decision level
    const level = this.determineDecisionLevel(agent, action, confidence, context);

    // Record decision
    const decision = {
      id: decisionId,
      agent,
      action,
      context,
      confidence,
      level,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.recordDecision(decision);

    // Route decision based on level
    const result = await this.routeDecision(decision);

    // Update decision with result
    decision.status = result.approved ? 'approved' : 'rejected';
    decision.result = result;
    decision.completed_at = Date.now();

    this.emit('decision-completed', decision);

    return result;
  }

  /**
   * Calculate confidence score
   */
  async calculateConfidence(agent, action, context) {
    const factors = {
      similar_pattern_success_rate: 0.3,
      oracle_validation_strength: 0.25,
      eval_test_coverage: 0.2,
      historical_accuracy: 0.15,
      complexity_factor: 0.1
    };

    let score = 0;

    // Similar pattern success rate
    const similarPatterns = this.findSimilarPatterns(agent, action);
    const successRate = this.calculateSuccessRate(similarPatterns);
    score += successRate * factors.similar_pattern_success_rate;

    // Oracle validation strength
    const oracleStrength = context.oracle_validated ? 1.0 : 0.5;
    score += oracleStrength * factors.oracle_validation_strength;

    // Eval test coverage
    const evalCoverage = (context.eval_coverage || 0) / 100;
    score += evalCoverage * factors.eval_test_coverage;

    // Historical accuracy
    const historicalAccuracy = this.getAgentHistoricalAccuracy(agent);
    score += historicalAccuracy * factors.historical_accuracy;

    // Complexity factor (inverse - simpler is higher confidence)
    const complexity = context.complexity || 0.5;
    const complexityScore = 1 - complexity;
    score += complexityScore * factors.complexity_factor;

    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Find similar decision patterns
   */
  findSimilarPatterns(agent, action) {
    return this.decisionHistory.filter(d =>
      d.agent === agent &&
      d.action === action &&
      d.status !== 'pending'
    );
  }

  /**
   * Calculate success rate from patterns
   */
  calculateSuccessRate(patterns) {
    if (patterns.length === 0) return 0.5; // Default to 50% if no history

    const successful = patterns.filter(p =>
      p.status === 'approved' &&
      p.result?.success === true
    ).length;

    return successful / patterns.length;
  }

  /**
   * Get agent historical accuracy
   */
  getAgentHistoricalAccuracy(agent) {
    const agentDecisions = this.decisionHistory.filter(d =>
      d.agent === agent &&
      d.status !== 'pending'
    );

    if (agentDecisions.length === 0) return 0.7; // Default to 70%

    const successful = agentDecisions.filter(d =>
      d.status === 'approved' &&
      d.result?.success === true
    ).length;

    return successful / agentDecisions.length;
  }

  /**
   * Determine decision level
   */
  determineDecisionLevel(agent, action, confidence, context) {
    // Check if action requires approval
    const capabilities = this.agentCapabilities[agent];

    if (capabilities?.requires_approval_for?.includes(action)) {
      return 'require_approval';
    }

    // Route based on confidence
    if (confidence >= 0.95) {
      return 'fully_automatic';
    } else if (confidence >= 0.80) {
      return 'automatic_with_notification';
    } else if (confidence >= 0.65) {
      return 'automatic_with_preview';
    } else {
      return 'require_approval';
    }
  }

  /**
   * Route decision based on level
   */
  async routeDecision(decision) {
    switch (decision.level) {
      case 'fully_automatic':
        return await this.executeAutomatic(decision);

      case 'automatic_with_notification':
        return await this.executeWithNotification(decision);

      case 'automatic_with_preview':
        return await this.executeWithPreview(decision);

      case 'require_approval':
        return await this.requireApproval(decision);

      default:
        return await this.requireApproval(decision);
    }
  }

  /**
   * Execute automatically
   */
  async executeAutomatic(decision) {
    this.emit('executing-automatic', decision);

    // Would integrate with actual agent execution
    const result = await this.executeAgentAction(decision);

    return {
      approved: true,
      automatic: true,
      level: 'fully_automatic',
      ...result
    };
  }

  /**
   * Execute with notification
   */
  async executeWithNotification(decision) {
    this.emit('executing-with-notification', decision);

    // Notify human
    this.emit('notify-human', {
      type: 'automatic_execution',
      decision,
      message: `${decision.agent} is executing: ${decision.action}`
    });

    // Execute
    const result = await this.executeAgentAction(decision);

    // Notify completion
    this.emit('notify-human', {
      type: 'execution_completed',
      decision,
      result,
      message: `${decision.agent} completed: ${decision.action}`
    });

    return {
      approved: true,
      automatic: true,
      level: 'automatic_with_notification',
      notified: true,
      ...result
    };
  }

  /**
   * Execute with preview
   */
  async executeWithPreview(decision) {
    this.emit('executing-with-preview', decision);

    // Generate preview
    const preview = await this.generatePreview(decision);

    // Show preview to human
    this.emit('show-preview', {
      decision,
      preview,
      delay: this.config.previewDelay,
      message: `Preview of ${decision.agent} action: ${decision.action}. Will execute in ${this.config.previewDelay / 1000}s unless cancelled.`
    });

    // Store pending preview
    const previewId = decision.id;
    this.pendingPreviews.set(previewId, {
      decision,
      preview,
      timestamp: Date.now()
    });

    // Wait for delay or cancellation
    const cancelled = await this.waitForPreviewCancellation(previewId);

    this.pendingPreviews.delete(previewId);

    if (cancelled) {
      this.emit('preview-cancelled', { decision });
      return {
        approved: false,
        cancelled: true,
        level: 'automatic_with_preview',
        reason: 'human_cancelled'
      };
    }

    // Execute
    const result = await this.executeAgentAction(decision);

    return {
      approved: true,
      automatic: true,
      level: 'automatic_with_preview',
      preview_shown: true,
      ...result
    };
  }

  /**
   * Require approval
   */
  async requireApproval(decision) {
    this.emit('approval-required', decision);

    const approvalId = decision.id;

    // Request approval from human
    this.emit('request-approval', {
      approvalId,
      decision,
      message: `${decision.agent} requests approval for: ${decision.action}`,
      context: decision.context
    });

    // Store pending approval
    this.pendingApprovals.set(approvalId, {
      decision,
      timestamp: Date.now()
    });

    // Wait for approval
    const approval = await this.waitForApproval(approvalId);

    this.pendingApprovals.delete(approvalId);

    if (!approval.approved) {
      this.emit('approval-rejected', { decision, approval });
      return {
        approved: false,
        level: 'require_approval',
        reason: approval.reason || 'human_rejected'
      };
    }

    // Execute
    const result = await this.executeAgentAction(decision);

    return {
      approved: true,
      level: 'require_approval',
      approval_received: true,
      ...result
    };
  }

  /**
   * Wait for preview cancellation
   */
  async waitForPreviewCancellation(previewId) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.removeListener('cancel-preview', handler);
        resolve(false);
      }, this.config.previewDelay);

      const handler = (event) => {
        if (event.previewId === previewId) {
          clearTimeout(timeout);
          this.removeListener('cancel-preview', handler);
          resolve(true);
        }
      };

      this.on('cancel-preview', handler);
    });
  }

  /**
   * Wait for approval
   */
  async waitForApproval(approvalId) {
    return new Promise((resolve) => {
      const handler = (event) => {
        if (event.approvalId === approvalId) {
          this.removeListener('approval-response', handler);
          resolve(event);
        }
      };

      this.on('approval-response', handler);
    });
  }

  /**
   * Cancel preview
   */
  cancelPreview(previewId) {
    this.emit('cancel-preview', { previewId });
  }

  /**
   * Respond to approval request
   */
  respondToApproval(approvalId, approved, reason = null) {
    this.emit('approval-response', {
      approvalId,
      approved,
      reason,
      timestamp: Date.now()
    });
  }

  /**
   * Generate preview of action
   */
  async generatePreview(decision) {
    // Would integrate with agent system to generate preview
    return {
      agent: decision.agent,
      action: decision.action,
      description: `Preview of ${decision.action}`,
      estimated_impact: 'medium',
      affected_artifacts: [],
      confidence: decision.confidence
    };
  }

  /**
   * Execute agent action
   */
  async executeAgentAction(decision) {
    // Would integrate with actual agent execution system
    this.emit('agent-action-execute', decision);

    // Simulate execution
    return new Promise((resolve) => {
      // This would be replaced with actual agent execution
      setTimeout(() => {
        resolve({
          success: true,
          result: `${decision.action} completed`,
          timestamp: Date.now()
        });
      }, 100);
    });
  }

  /**
   * Check if agent can auto-proceed
   */
  canAutoProceed(agent, context = {}) {
    const capabilities = this.agentCapabilities[agent];

    if (!capabilities?.can_auto_proceed_when) {
      return { canProceed: false, reason: 'no_auto_proceed_capability' };
    }

    const conditions = Array.isArray(capabilities.can_auto_proceed_when)
      ? capabilities.can_auto_proceed_when
      : [capabilities.can_auto_proceed_when];

    const unmet = [];

    for (const condition of conditions) {
      const met = this.checkCondition(condition, context);
      if (!met) {
        unmet.push(condition);
      }
    }

    if (unmet.length > 0) {
      return {
        canProceed: false,
        reason: 'conditions_not_met',
        unmet_conditions: unmet
      };
    }

    return { canProceed: true };
  }

  /**
   * Check if condition is met
   */
  checkCondition(condition, context) {
    switch (condition) {
      case 'eval_tests_pass':
        return context.eval_tests_pass === true;

      case 'oracle_validated':
        return context.oracle_validated === true;

      case 'validator_traceability_confirmed':
        return context.traceability_confirmed === true;

      case 'monitor_health_green':
        return context.health_status === 'green';

      case 'no_blocking_issues':
        return !context.blocking_issues || context.blocking_issues.length === 0;

      case 'traces_to_domain_truth':
        return context.traces_to_domain === true;

      case 'eval_tests_generated':
        return context.eval_tests_generated === true;

      case 'oracle_approved':
        return context.oracle_approved === true;

      case 'no_conflicts_with_existing':
        return !context.has_conflicts;

      default:
        return false;
    }
  }

  /**
   * Record decision in history
   */
  recordDecision(decision) {
    this.decisionHistory.push(decision);

    // Trim history if too large
    if (this.decisionHistory.length > this.config.historySize) {
      this.decisionHistory = this.decisionHistory.slice(-this.config.historySize);
    }

    this.emit('decision-recorded', decision);
  }

  /**
   * Get decision history
   */
  getDecisionHistory(filters = {}) {
    let history = this.decisionHistory;

    if (filters.agent) {
      history = history.filter(d => d.agent === filters.agent);
    }

    if (filters.action) {
      history = history.filter(d => d.action === filters.action);
    }

    if (filters.level) {
      history = history.filter(d => d.level === filters.level);
    }

    if (filters.status) {
      history = history.filter(d => d.status === filters.status);
    }

    return history;
  }

  /**
   * Get pending approvals
   */
  getPendingApprovals() {
    return Array.from(this.pendingApprovals.values());
  }

  /**
   * Get pending previews
   */
  getPendingPreviews() {
    return Array.from(this.pendingPreviews.values());
  }

  /**
   * Get engine status
   */
  getStatus() {
    return {
      pending_approvals: this.pendingApprovals.size,
      pending_previews: this.pendingPreviews.size,
      decision_history_size: this.decisionHistory.length,
      agent_capabilities: Object.keys(this.agentCapabilities || {}).length,
      decision_levels: Object.keys(this.decisionLevels || {}).length
    };
  }
}

export default DecisionEngine;
