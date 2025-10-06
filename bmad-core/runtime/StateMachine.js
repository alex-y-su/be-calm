/**
 * Workflow State Machine
 *
 * Manages workflow state transitions, persistence, and validation.
 * Supports both greenfield and brownfield paths.
 */

import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export class StateMachine {
  constructor(config = {}) {
    this.config = config;
    this.currentState = null;
    this.stateHistory = [];
    this.validationStatus = new Map();
    this.completedPhases = new Set();
    this.projectType = config.projectType || 'greenfield'; // 'greenfield' or 'brownfield'
    this.halted = false;
    this.stateFile = config.stateFile || '.bmad/workflow-state.json';
  }

  /**
   * Initialize state machine
   */
  async initialize() {
    // Try to load existing state
    try {
      await this.loadState();
      console.log(`📊 Loaded workflow state: ${this.currentState}`);
    } catch {
      // No existing state, start fresh
      const initialState = this.projectType === 'brownfield'
        ? 'codebase_discovery'
        : 'domain_research';

      this.currentState = initialState;
      await this.saveState();
      console.log(`📊 Initialized workflow state: ${this.currentState}`);
    }
  }

  /**
   * Get available states for current project type
   */
  getAvailableStates() {
    const greenfield = [
      'domain_research',
      'eval_foundation',
      'discovery',
      'architecture',
      'planning',
      'development'
    ];

    const brownfield = [
      'codebase_discovery',
      'domain_research',
      'eval_foundation',
      'compatibility_analysis',
      'discovery',
      'architecture',
      'planning',
      'development'
    ];

    return this.projectType === 'brownfield' ? brownfield : greenfield;
  }

  /**
   * Get valid transitions from current state
   */
  getValidTransitions() {
    const transitions = {
      greenfield: {
        'domain_research': ['eval_foundation'],
        'eval_foundation': ['discovery'],
        'discovery': ['architecture'],
        'architecture': ['planning'],
        'planning': ['development'],
        'development': []
      },
      brownfield: {
        'codebase_discovery': ['domain_research'],
        'domain_research': ['eval_foundation'],
        'eval_foundation': ['compatibility_analysis'],
        'compatibility_analysis': ['discovery'],
        'discovery': ['architecture'],
        'architecture': ['planning'],
        'planning': ['development'],
        'development': []
      }
    };

    const projectTransitions = transitions[this.projectType];
    return projectTransitions[this.currentState] || [];
  }

  /**
   * Transition to new state
   */
  async transition(nextState) {
    if (this.halted) {
      throw new Error('Workflow is halted. Cannot transition.');
    }

    const validTransitions = this.getValidTransitions();

    if (!validTransitions.includes(nextState)) {
      throw new Error(
        `Invalid transition from ${this.currentState} to ${nextState}. ` +
        `Valid transitions: ${validTransitions.join(', ')}`
      );
    }

    // Mark current phase as complete
    this.completedPhases.add(this.currentState);

    // Record in history
    this.stateHistory.push({
      from: this.currentState,
      to: nextState,
      timestamp: new Date().toISOString()
    });

    // Update current state
    const previousState = this.currentState;
    this.currentState = nextState;

    // Persist
    await this.saveState();

    console.log(`State transition: ${previousState} → ${nextState}`);
  }

  /**
   * Check if a phase is complete
   */
  isPhaseComplete(phase) {
    return this.completedPhases.has(phase);
  }

  /**
   * Get validation status for a validator
   */
  getValidationStatus(validator) {
    return this.validationStatus.get(validator) || false;
  }

  /**
   * Set validation status
   */
  setValidationStatus(validator, passed) {
    this.validationStatus.set(validator, passed);
    this.saveState();
  }

  /**
   * Halt the workflow (for blocking conditions)
   */
  async halt() {
    this.halted = true;
    await this.saveState();
    console.log('🛑 Workflow halted due to blocking condition');
  }

  /**
   * Resume a halted workflow
   */
  async resume() {
    this.halted = false;
    await this.saveState();
    console.log('▶️  Workflow resumed');
  }

  /**
   * Save state to disk
   */
  async saveState() {
    const state = {
      currentState: this.currentState,
      projectType: this.projectType,
      stateHistory: this.stateHistory,
      completedPhases: Array.from(this.completedPhases),
      validationStatus: Object.fromEntries(this.validationStatus),
      halted: this.halted,
      lastUpdated: new Date().toISOString()
    };

    const stateDir = path.dirname(this.stateFile);
    await fs.mkdir(stateDir, { recursive: true });
    await fs.writeFile(this.stateFile, JSON.stringify(state, null, 2));

    // Create backup
    await this.createBackup(state);
  }

  /**
   * Create backup of current state
   */
  async createBackup(state) {
    const backupDir = this.config.backupDir || path.join(path.dirname(this.stateFile), 'backups');
    await fs.mkdir(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `workflow-state-${timestamp}.json`);

    try {
      await fs.writeFile(backupFile, JSON.stringify(state, null, 2));

      // Keep only last 10 backups
      const files = await fs.readdir(backupDir);
      const backupFiles = files
        .filter(f => f.startsWith('workflow-state-') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (backupFiles.length > 10) {
        for (const oldBackup of backupFiles.slice(10)) {
          await fs.unlink(path.join(backupDir, oldBackup));
        }
      }
    } catch (error) {
      // Don't fail if backup fails
      console.warn(`Failed to create backup: ${error.message}`);
    }
  }

  /**
   * Load state from disk
   */
  async loadState() {
    const data = await fs.readFile(this.stateFile, 'utf-8');
    const state = JSON.parse(data);

    this.currentState = state.currentState;
    this.projectType = state.projectType;
    this.stateHistory = state.stateHistory || [];
    this.completedPhases = new Set(state.completedPhases || []);
    this.validationStatus = new Map(Object.entries(state.validationStatus || {}));
    this.halted = state.halted || false;
  }

  /**
   * Recover from backup files
   */
  async recoverFromBackup() {
    const backupDir = this.config.backupDir || path.join(path.dirname(this.stateFile), 'backups');

    try {
      // Find latest backup file
      const files = await fs.readdir(backupDir);
      const backupFiles = files
        .filter(f => f.startsWith('workflow-state-') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (backupFiles.length === 0) {
        console.log('No backup files found');
        return false;
      }

      const latestBackup = path.join(backupDir, backupFiles[0]);
      const backupData = await fs.readFile(latestBackup, 'utf-8');
      const state = JSON.parse(backupData);

      // Restore from backup
      this.currentState = state.currentState;
      this.projectType = state.projectType;
      this.stateHistory = state.stateHistory || [];
      this.completedPhases = new Set(state.completedPhases || []);
      this.validationStatus = new Map(Object.entries(state.validationStatus || {}));
      this.halted = state.halted || false;

      // Save restored state
      await this.saveState();

      console.log(`✅ Recovered state from backup: ${latestBackup}`);
      return true;
    } catch (error) {
      console.error(`Failed to recover from backup: ${error.message}`);
      return false;
    }
  }

  /**
   * Recover state (try to load, fall back to backup if corrupted)
   */
  async recover() {
    try {
      await this.loadState();
      console.log(`✅ Recovered state: ${this.currentState}`);
      return true;
    } catch (error) {
      console.log(`Failed to load state, attempting backup recovery: ${error.message}`);
      return await this.recoverFromBackup();
    }
  }

  /**
   * Reset state (start over)
   */
  async reset() {
    this.currentState = this.projectType === 'brownfield'
      ? 'codebase_discovery'
      : 'domain_research';
    this.stateHistory = [];
    this.completedPhases.clear();
    this.validationStatus.clear();
    this.halted = false;
    await this.saveState();
    console.log('State machine reset');
  }

  /**
   * Get current workflow status
   */
  getStatus() {
    const availableStates = this.getAvailableStates();
    const currentIndex = availableStates.indexOf(this.currentState);
    const totalStates = availableStates.length;
    const progress = Math.round((currentIndex / totalStates) * 100);

    return {
      currentState: this.currentState,
      projectType: this.projectType,
      progress,
      completedPhases: Array.from(this.completedPhases),
      validTransitions: this.getValidTransitions(),
      halted: this.halted,
      history: this.stateHistory
    };
  }
}
