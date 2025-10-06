/**
 * Safe Mode Controller
 * Provides a restricted operational mode with enhanced safety
 */

import { EventEmitter } from 'node:events';

class SafeMode extends EventEmitter {
  constructor() {
    super();
    this.active = false;
    this.startTime = null;
    this.restrictions = new Set();
  }

  /**
   * Activate safe mode
   * @param {Object} options - Safe mode options
   */
  async activate(options = {}) {
    if (this.active) {
      throw new Error('Safe mode already active');
    }

    this.active = true;
    this.startTime = Date.now();

    // Apply restrictions
    await this.applyRestrictions(options);

    this.emit('safe-mode-activated', {
      timestamp: this.startTime,
      restrictions: Array.from(this.restrictions)
    });

    return {
      active: true,
      startTime: this.startTime,
      restrictions: Array.from(this.restrictions)
    };
  }

  /**
   * Apply safe mode restrictions
   */
  async applyRestrictions(options = {}) {
    const defaultRestrictions = [
      'disable-all-automation',
      'manual-agent-invocation-only',
      'full-validation-enabled',
      'no-background-execution',
      'require-confirmation-all-actions',
      'read-only-mode' // Optional
    ];

    const restrictions = options.restrictions || defaultRestrictions;

    for (const restriction of restrictions) {
      this.restrictions.add(restriction);
      this.applyRestriction(restriction);
    }

    this.emit('restrictions-applied', {
      count: this.restrictions.size
    });
  }

  /**
   * Apply a single restriction
   */
  applyRestriction(restriction) {
    switch (restriction) {
      case 'disable-all-automation':
        this.emit('set-autonomy-level', 'manual');
        break;

      case 'manual-agent-invocation-only':
        this.emit('disable-agent-switching');
        break;

      case 'full-validation-enabled':
        this.emit('enable-all-validations');
        break;

      case 'no-background-execution':
        this.emit('disable-background-agents');
        break;

      case 'require-confirmation-all-actions':
        this.emit('enable-confirmations');
        break;

      case 'read-only-mode':
        this.emit('enable-read-only-mode');
        break;

      default:
        console.warn(`Unknown restriction: ${restriction}`);
    }
  }

  /**
   * Check if an action is allowed in safe mode
   * @param {string} action - Action to check
   */
  isAllowed(action) {
    if (!this.active) {
      return true; // Everything allowed when safe mode is off
    }

    // Define what's allowed in safe mode
    const allowedActions = new Set([
      'read-file',
      'view-metrics',
      'view-status',
      'manual-validation',
      'emergency-stop',
      'deactivate-safe-mode'
    ]);

    return allowedActions.has(action);
  }

  /**
   * Require confirmation for an action
   * @param {string} action - Action requiring confirmation
   */
  requireConfirmation(action) {
    if (!this.active) {
      return false;
    }

    // In safe mode, require confirmation for destructive/modifying actions
    const requiresConfirmation = new Set([
      'write-file',
      'delete-file',
      'modify-configuration',
      'invoke-agent',
      'execute-command',
      'rollback',
      'apply-changes'
    ]);

    return requiresConfirmation.has(action);
  }

  /**
   * Deactivate safe mode
   */
  async deactivate() {
    if (!this.active) {
      throw new Error('Safe mode not active');
    }

    const duration = Date.now() - this.startTime;

    // Remove all restrictions
    for (const restriction of this.restrictions) {
      this.removeRestriction(restriction);
    }

    this.restrictions.clear();
    this.active = false;

    this.emit('safe-mode-deactivated', {
      duration,
      timestamp: Date.now()
    });

    return {
      active: false,
      duration
    };
  }

  /**
   * Remove a single restriction
   */
  removeRestriction(restriction) {
    switch (restriction) {
      case 'disable-all-automation':
        this.emit('restore-autonomy-level');
        break;

      case 'manual-agent-invocation-only':
        this.emit('enable-agent-switching');
        break;

      case 'full-validation-enabled':
        this.emit('restore-validation-settings');
        break;

      case 'no-background-execution':
        this.emit('enable-background-agents');
        break;

      case 'require-confirmation-all-actions':
        this.emit('restore-confirmation-settings');
        break;

      case 'read-only-mode':
        this.emit('disable-read-only-mode');
        break;
    }
  }

  /**
   * Get safe mode status
   */
  getStatus() {
    return {
      active: this.active,
      startTime: this.startTime,
      duration: this.active ? Date.now() - this.startTime : null,
      restrictions: Array.from(this.restrictions)
    };
  }

  /**
   * Check if safe mode is active
   */
  isActive() {
    return this.active;
  }
}

// Singleton instance
let instance = null;

export default {
  SafeMode,
  getInstance: () => {
    if (!instance) {
      instance = new SafeMode();
    }
    return instance;
  }
};
