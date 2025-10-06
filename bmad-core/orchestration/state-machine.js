/**
 * BMAD Truth-Driven Workflow State Machine
 * Version: 2.0
 *
 * Manages workflow states, transitions, and persistence for autonomous agent orchestration.
 */

import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { EventEmitter } from 'events';

export class StateMachine extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      stateFile: config.stateFile || '.bmad-state/workflow-state.yaml',
      backupDir: config.backupDir || '.bmad-state/backups',
      autoSave: config.autoSave !== false,
      ...config
    };

    this.states = this.defineStates();
    this.currentState = null;
    this.stateHistory = [];
    this.metadata = {};
    this.projectType = null; // 'greenfield' or 'brownfield'
  }

  /**
   * Define all workflow states
   */
  defineStates() {
    return {
      codebase_discovery: {
        id: 'codebase_discovery',
        type: 'brownfield_only',
        phase: -1,
        agents: ['compatibility', 'bmad-master', 'oracle', 'eval'],
        name: 'Codebase Discovery',
        description: 'Analyze existing codebase and create system truth',
        exitConditions: [
          'existing_system_truth_created',
          'architecture_documented',
          'integration_points_identified'
        ]
      },
      domain_research: {
        id: 'domain_research',
        type: 'universal',
        phase: 0,
        agents: ['domain-researcher', 'oracle'],
        name: 'Domain Research',
        description: 'Research domain and create domain truth',
        exitConditions: [
          'domain_truth_created',
          'oracle_validated',
          'terminology_defined'
        ]
      },
      eval_foundation: {
        id: 'eval_foundation',
        type: 'universal',
        phase: 1,
        agents: ['eval', 'oracle', 'validator'],
        name: 'Evaluation Foundation',
        description: 'Create evaluation test datasets',
        exitConditions: [
          'test_datasets_created',
          'eval_tests_passing',
          'baseline_established'
        ]
      },
      compatibility_analysis: {
        id: 'compatibility_analysis',
        type: 'brownfield_only',
        phase: 1.5,
        agents: ['compatibility', 'oracle', 'validator', 'eval'],
        name: 'Compatibility Analysis',
        description: 'Analyze compatibility with existing system',
        exitConditions: [
          'compatibility_rules_defined',
          'breaking_changes_identified',
          'migration_strategy_created'
        ]
      },
      discovery: {
        id: 'discovery',
        type: 'universal',
        phase: 2,
        agents: ['analyst', 'pm', 'oracle', 'validator', 'eval'],
        name: 'Discovery',
        description: 'Create PRD and requirements',
        exitConditions: [
          'prd_created',
          'requirements_validated',
          'oracle_approved',
          'eval_tests_generated'
        ]
      },
      architecture: {
        id: 'architecture',
        type: 'universal',
        phase: 3,
        agents: ['architect', 'oracle', 'validator', 'eval', 'monitor'],
        name: 'Architecture',
        description: 'Define system architecture',
        exitConditions: [
          'architecture_created',
          'design_validated',
          'traceability_confirmed',
          'performance_baseline_captured'
        ]
      },
      planning: {
        id: 'planning',
        type: 'universal',
        phase: 4,
        agents: ['po', 'sm', 'eval', 'oracle', 'validator'],
        name: 'Planning',
        description: 'Create epics and stories',
        exitConditions: [
          'epics_created',
          'stories_created',
          'acceptance_criteria_defined',
          'traceability_complete'
        ]
      },
      development: {
        id: 'development',
        type: 'universal',
        phase: 5,
        agents: ['dev', 'qa', 'eval', 'oracle', 'validator', 'monitor', 'reflection'],
        name: 'Development',
        description: 'Implement features',
        exitConditions: [
          'implementation_complete',
          'all_tests_passing',
          'no_critical_drift',
          'quality_gates_passed'
        ]
      }
    };
  }

  /**
   * Initialize state machine
   */
  async initialize(projectType = 'greenfield') {
    this.projectType = projectType;

    // Try to load existing state
    const loaded = await this.loadState();

    if (!loaded) {
      // Initialize new state
      const initialState = projectType === 'brownfield'
        ? 'codebase_discovery'
        : 'domain_research';

      await this.transitionTo(initialState, 'initialization');
    }

    this.emit('initialized', { projectType, currentState: this.currentState });
    return this;
  }

  /**
   * Get current state
   */
  getCurrentState() {
    return this.states[this.currentState];
  }

  /**
   * Get state metadata
   */
  getMetadata(stateId = null) {
    const targetState = stateId || this.currentState;
    return this.metadata[targetState] || {};
  }

  /**
   * Update state metadata
   */
  updateMetadata(updates, stateId = null) {
    const targetState = stateId || this.currentState;

    if (!this.metadata[targetState]) {
      this.metadata[targetState] = {
        completion_percentage: 0,
        exit_conditions_status: {},
        validation_gates_status: {},
        artifacts_created: [],
        blocking_issues: [],
        human_checkpoints_pending: []
      };
    }

    this.metadata[targetState] = {
      ...this.metadata[targetState],
      ...updates,
      last_updated: new Date().toISOString()
    };

    this.emit('metadata-updated', { stateId: targetState, metadata: this.metadata[targetState] });

    if (this.config.autoSave) {
      this.saveState();
    }
  }

  /**
   * Check if exit conditions are met
   */
  checkExitConditions(stateId = null) {
    const targetState = stateId || this.currentState;
    const state = this.states[targetState];
    const metadata = this.getMetadata(targetState);

    if (!state.exitConditions) {
      return { met: true, conditions: [] };
    }

    const results = {};
    let allMet = true;

    for (const condition of state.exitConditions) {
      const status = metadata.exit_conditions_status?.[condition] || false;
      results[condition] = status;
      if (!status) allMet = false;
    }

    return { met: allMet, conditions: results };
  }

  /**
   * Mark exit condition as met
   */
  markExitCondition(condition, met = true, stateId = null) {
    const targetState = stateId || this.currentState;
    const metadata = this.getMetadata(targetState);

    const exitConditionsStatus = metadata.exit_conditions_status || {};
    exitConditionsStatus[condition] = met;

    this.updateMetadata({ exit_conditions_status: exitConditionsStatus }, targetState);

    this.emit('exit-condition-updated', {
      stateId: targetState,
      condition,
      met
    });

    // Check if we can auto-transition
    if (met) {
      this.checkAutoTransition();
    }
  }

  /**
   * Check if automatic transition is possible
   */
  async checkAutoTransition() {
    const exitCheck = this.checkExitConditions();
    const metadata = this.getMetadata();

    const canTransition =
      exitCheck.met &&
      (metadata.validation_gates_passed || false) &&
      (metadata.blocking_issues || []).length === 0 &&
      (metadata.human_checkpoints_approved || false);

    if (canTransition) {
      this.emit('auto-transition-ready', {
        currentState: this.currentState
      });
      return true;
    }

    return false;
  }

  /**
   * Transition to a new state
   */
  async transitionTo(newStateId, reason = 'manual', force = false) {
    const newState = this.states[newStateId];

    if (!newState) {
      throw new Error(`Invalid state: ${newStateId}`);
    }

    // Check if state is valid for project type
    if (newState.type === 'brownfield_only' && this.projectType !== 'brownfield') {
      if (!force) {
        throw new Error(`State ${newStateId} is only valid for brownfield projects`);
      }
    }

    // Validate transition (unless forced)
    if (!force && this.currentState) {
      const canTransition = await this.checkAutoTransition();
      if (!canTransition && reason === 'automatic') {
        throw new Error(`Cannot automatically transition from ${this.currentState} - conditions not met`);
      }
    }

    const previousState = this.currentState;

    // Execute pre-transition actions
    await this.executePreTransitionActions(previousState, newStateId);

    // Update state
    this.currentState = newStateId;
    this.stateHistory.push({
      from: previousState,
      to: newStateId,
      reason,
      timestamp: new Date().toISOString()
    });

    // Execute post-transition actions
    await this.executePostTransitionActions(previousState, newStateId);

    // Emit event
    this.emit('transition', {
      from: previousState,
      to: newStateId,
      reason
    });

    // Save state
    if (this.config.autoSave) {
      await this.saveState();
    }

    return this.getCurrentState();
  }

  /**
   * Execute actions before transition
   */
  async executePreTransitionActions(fromState, toState) {
    if (fromState) {
      this.emit('pre-transition', { from: fromState, to: toState });

      // Generate phase completion report
      const metadata = this.getMetadata(fromState);
      this.emit('phase-completion-report', {
        state: fromState,
        metadata,
        completedAt: new Date().toISOString()
      });
    }
  }

  /**
   * Execute actions after transition
   */
  async executePostTransitionActions(fromState, toState) {
    this.emit('post-transition', { from: fromState, to: toState });

    // Initialize metadata for new state
    const newState = this.states[toState];

    this.updateMetadata({
      phase_id: newState.phase,
      active_agents: newState.agents,
      completion_percentage: 0,
      started_at: new Date().toISOString()
    });

    // Notify agents
    this.emit('agents-notify', {
      state: toState,
      agents: newState.agents,
      message: `Transitioned to ${newState.name}`
    });

    // Trigger monitor baseline update
    if (newState.agents.includes('monitor')) {
      this.emit('monitor-baseline-update', { state: toState });
    }

    // Trigger reflection phase analysis
    if (fromState && newState.agents.includes('reflection')) {
      this.emit('reflection-phase-analysis', {
        completedPhase: fromState,
        newPhase: toState
      });
    }
  }

  /**
   * Rollback to previous state
   */
  async rollback(targetState = null) {
    if (this.stateHistory.length === 0) {
      throw new Error('No state history available for rollback');
    }

    let targetStateId = targetState;

    if (!targetStateId) {
      // Rollback to previous state
      const lastTransition = this.stateHistory[this.stateHistory.length - 1];
      targetStateId = lastTransition.from;
    }

    if (!targetStateId) {
      throw new Error('Cannot rollback - no previous state');
    }

    // Invalidate downstream artifacts
    this.emit('invalidate-downstream-artifacts', {
      fromState: this.currentState,
      toState: targetStateId
    });

    // Reset validation status for rolled-back state
    this.updateMetadata({
      validation_gates_status: {},
      rollback_occurred: true,
      rollback_timestamp: new Date().toISOString()
    }, targetStateId);

    // Transition to target state
    await this.transitionTo(targetStateId, 'rollback', true);

    this.emit('rollback', {
      from: this.currentState,
      to: targetStateId
    });
  }

  /**
   * Block workflow
   */
  block(reason, details = {}) {
    const metadata = this.getMetadata();
    const blockingIssues = metadata.blocking_issues || [];

    blockingIssues.push({
      reason,
      details,
      timestamp: new Date().toISOString()
    });

    this.updateMetadata({
      blocking_issues: blockingIssues,
      blocked: true
    });

    this.emit('workflow-blocked', {
      state: this.currentState,
      reason,
      details
    });

    this.emit('alert-human', {
      severity: 'critical',
      message: `Workflow blocked in ${this.currentState}`,
      reason,
      details
    });
  }

  /**
   * Unblock workflow
   */
  unblock(reason, resolvedBy = 'human') {
    this.updateMetadata({
      blocking_issues: [],
      blocked: false,
      unblocked_at: new Date().toISOString(),
      unblocked_by: resolvedBy,
      unblock_reason: reason
    });

    this.emit('workflow-unblocked', {
      state: this.currentState,
      reason
    });
  }

  /**
   * Save state to file
   */
  async saveState() {
    const stateData = {
      version: '2.0',
      current_state: this.currentState,
      project_type: this.projectType,
      state_history: this.stateHistory,
      metadata: this.metadata,
      saved_at: new Date().toISOString()
    };

    const stateFilePath = path.resolve(this.config.stateFile);
    const backupDir = path.resolve(this.config.backupDir);
    const backupPath = path.join(
      backupDir,
      `workflow-state-${Date.now()}.yaml`
    );

    // Ensure directories exist
    await fs.ensureDir(path.dirname(stateFilePath));
    await fs.ensureDir(backupDir);

    // Save current state
    const yamlContent = yaml.dump(stateData, { indent: 2 });
    await fs.writeFile(stateFilePath, yamlContent, 'utf8');

    // Create backup (always, even for first save)
    await fs.copy(stateFilePath, backupPath);

    this.emit('state-saved', { path: stateFilePath });

    // Clean old backups (keep last 10)
    await this.cleanOldBackups(10);

    return stateFilePath;
  }

  /**
   * Load state from file
   */
  async loadState() {
    const stateFilePath = path.resolve(this.config.stateFile);

    if (!await fs.pathExists(stateFilePath)) {
      return false;
    }

    try {
      const content = await fs.readFile(stateFilePath, 'utf8');
      const stateData = yaml.load(content);

      // Verify artifact integrity
      const valid = await this.verifyArtifactIntegrity(stateData);

      if (!valid) {
        this.emit('state-integrity-failed', { path: stateFilePath });
        return false;
      }

      this.currentState = stateData.current_state;
      this.projectType = stateData.project_type;
      this.stateHistory = stateData.state_history || [];
      this.metadata = stateData.metadata || {};

      this.emit('state-loaded', {
        path: stateFilePath,
        state: this.currentState
      });

      return true;
    } catch (error) {
      this.emit('state-load-error', { error, path: stateFilePath });
      return false;
    }
  }

  /**
   * Verify artifact integrity
   */
  async verifyArtifactIntegrity(stateData) {
    // Basic validation
    if (!stateData.current_state || !stateData.project_type) {
      return false;
    }

    // Verify state exists
    if (!this.states[stateData.current_state]) {
      return false;
    }

    // Could add more sophisticated checks here
    // - Verify referenced artifacts exist
    // - Check metadata consistency
    // etc.

    return true;
  }

  /**
   * Clean old backup files
   */
  async cleanOldBackups(keepCount = 10) {
    const backupDir = path.resolve(this.config.backupDir);
    const backupFiles = await fs.readdir(backupDir);
    const yamlFiles = backupFiles
      .filter(f => f.endsWith('.yaml'))
      .sort()
      .reverse();

    // Remove old backups
    for (let i = keepCount; i < yamlFiles.length; i++) {
      const filePath = path.join(backupDir, yamlFiles[i]);
      await fs.remove(filePath);
    }
  }

  /**
   * Recover from crash
   */
  async recover() {
    const loaded = await this.loadState();

    if (!loaded) {
      throw new Error('Cannot recover - no saved state found');
    }

    // Verify artifact integrity
    const stateData = {
      current_state: this.currentState,
      project_type: this.projectType,
      state_history: this.stateHistory,
      metadata: this.metadata
    };

    const valid = await this.verifyArtifactIntegrity(stateData);

    if (!valid) {
      // Try to load from backup
      const recovered = await this.recoverFromBackup();
      if (!recovered) {
        throw new Error('State recovery failed - integrity check failed');
      }
    }

    // Notify agents of recovery
    const currentState = this.getCurrentState();
    this.emit('recovery', {
      state: this.currentState,
      agents: currentState.agents
    });

    this.emit('agents-notify', {
      state: this.currentState,
      agents: currentState.agents,
      message: 'System recovered from checkpoint'
    });

    return this;
  }

  /**
   * Recover from backup
   */
  async recoverFromBackup() {
    const backupDir = path.resolve(this.config.backupDir);

    // Check if backup directory exists
    if (!await fs.pathExists(backupDir)) {
      return false;
    }

    try {
      const backupFiles = await fs.readdir(backupDir);
      const yamlFiles = backupFiles
        .filter(f => f.endsWith('.yaml'))
        .sort()
        .reverse();

      for (const backupFile of yamlFiles) {
        try {
          const backupPath = path.join(backupDir, backupFile);
          const content = await fs.readFile(backupPath, 'utf8');
          const stateData = yaml.load(content);

          const valid = await this.verifyArtifactIntegrity(stateData);

          if (valid) {
            // Restore from this backup
            await fs.copy(backupPath, this.config.stateFile);
            await this.loadState();

            this.emit('recovered-from-backup', { backup: backupFile });
            return true;
          }
        } catch (error) {
          // Try next backup
          continue;
        }
      }
    } catch (error) {
      // Failed to read backup directory
      return false;
    }

    return false;
  }

  /**
   * Get workflow progress
   */
  getProgress() {
    const currentState = this.getCurrentState();
    const allStates = Object.values(this.states);

    // Filter states valid for project type
    const validStates = allStates.filter(state =>
      state.type === 'universal' ||
      (state.type === 'brownfield_only' && this.projectType === 'brownfield')
    );

    const currentIndex = validStates.findIndex(s => s.id === this.currentState);
    const totalStates = validStates.length;

    const progress = {
      current_state: currentState,
      current_phase: currentState.phase,
      progress_percentage: ((currentIndex + 1) / totalStates) * 100,
      completed_states: validStates.slice(0, currentIndex).map(s => s.id),
      remaining_states: validStates.slice(currentIndex + 1).map(s => s.id),
      metadata: this.getMetadata()
    };

    return progress;
  }

  /**
   * Pause workflow
   */
  pause(reason = 'manual') {
    this.updateMetadata({
      paused: true,
      paused_at: new Date().toISOString(),
      pause_reason: reason
    });

    this.emit('workflow-paused', {
      state: this.currentState,
      reason
    });
  }

  /**
   * Resume workflow
   */
  resume(reason = 'manual') {
    this.updateMetadata({
      paused: false,
      resumed_at: new Date().toISOString(),
      resume_reason: reason
    });

    this.emit('workflow-resumed', {
      state: this.currentState,
      reason
    });
  }
}

export default StateMachine;
