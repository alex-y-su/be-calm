/**
 * Rollback System
 * Provides ability to rollback to previous checkpoints
 */

import { EventEmitter } from 'node:events';
import fs from 'fs-extra';
import path from 'node:path';

class RollbackSystem extends EventEmitter {
  constructor() {
    super();
    this.checkpoints = new Map();
    this.checkpointDir = '.bmad-checkpoints';
  }

  /**
   * Initialize rollback system
   */
  async initialize() {
    await fs.ensureDir(this.checkpointDir);
    await this.loadCheckpoints();
    this.emit('initialized');
  }

  /**
   * Load existing checkpoints
   */
  async loadCheckpoints() {
    try {
      const files = await fs.readdir(this.checkpointDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.checkpointDir, file);
          const checkpoint = await fs.readJson(filePath);
          this.checkpoints.set(checkpoint.id, checkpoint);
        }
      }

      this.emit('checkpoints-loaded', { count: this.checkpoints.size });
    } catch (error) {
      // Directory might not exist yet
    }
  }

  /**
   * Create a checkpoint
   * @param {string} name - Checkpoint name
   * @param {Object} state - State to save
   */
  async createCheckpoint(name, state = {}) {
    const checkpoint = {
      id: `checkpoint-${Date.now()}`,
      name,
      timestamp: Date.now(),
      state,
      metadata: {
        phase: state.currentPhase,
        artifacts: state.artifacts || [],
        metrics: state.metrics || {}
      }
    };

    // Save to disk
    const filePath = path.join(this.checkpointDir, `${checkpoint.id}.json`);
    await fs.writeJson(filePath, checkpoint, { spaces: 2 });

    // Store in memory
    this.checkpoints.set(checkpoint.id, checkpoint);

    this.emit('checkpoint-created', { checkpoint });

    return checkpoint;
  }

  /**
   * List all checkpoints
   */
  listCheckpoints() {
    return Array.from(this.checkpoints.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get a specific checkpoint
   * @param {string} checkpointId - Checkpoint ID
   */
  getCheckpoint(checkpointId) {
    return this.checkpoints.get(checkpointId);
  }

  /**
   * Rollback to a checkpoint
   * @param {string} checkpointId - Checkpoint ID to rollback to
   * @param {Object} options - Rollback options
   */
  async rollback(checkpointId, options = {}) {
    const checkpoint = this.checkpoints.get(checkpointId);

    if (!checkpoint) {
      throw new Error(`Checkpoint ${checkpointId} not found`);
    }

    this.emit('rollback-initiated', { checkpoint });

    // Calculate impact
    const impact = await this.calculateImpact(checkpoint);

    // Create rollback report
    const report = await this.createRollbackReport(checkpoint, impact);

    // Perform rollback
    const result = await this.performRollback(checkpoint, impact, options);

    this.emit('rollback-completed', { checkpoint, result });

    return {
      success: true,
      checkpoint,
      impact,
      report,
      result
    };
  }

  /**
   * Calculate impact of rollback
   * @param {Object} checkpoint - Checkpoint to rollback to
   */
  async calculateImpact(checkpoint) {
    // Determine what will be affected by rollback
    const now = Date.now();
    const timeDiff = now - checkpoint.timestamp;

    return {
      timeRange: {
        from: checkpoint.timestamp,
        to: now,
        duration: timeDiff
      },
      affectedArtifacts: [], // Would be calculated from current state
      invalidatedWork: [], // Work that will be invalidated
      estimatedLoss: timeDiff // Time that will be lost
    };
  }

  /**
   * Create rollback report
   * @param {Object} checkpoint - Checkpoint
   * @param {Object} impact - Impact analysis
   */
  async createRollbackReport(checkpoint, impact) {
    const report = {
      title: 'Rollback Report',
      timestamp: Date.now(),
      checkpoint: {
        id: checkpoint.id,
        name: checkpoint.name,
        timestamp: checkpoint.timestamp
      },
      impact,
      warnings: this.generateRollbackWarnings(impact)
    };

    const reportFile = path.join(this.checkpointDir, `rollback-report-${Date.now()}.json`);
    await fs.writeJson(reportFile, report, { spaces: 2 });

    return report;
  }

  /**
   * Generate rollback warnings
   */
  generateRollbackWarnings(impact) {
    const warnings = [];

    if (impact.estimatedLoss > 3600000) { // 1 hour
      warnings.push('Significant work will be lost (>1 hour)');
    }

    if (impact.affectedArtifacts.length > 0) {
      warnings.push(`${impact.affectedArtifacts.length} artifacts will be affected`);
    }

    if (impact.invalidatedWork.length > 0) {
      warnings.push(`${impact.invalidatedWork.length} items will be invalidated`);
    }

    return warnings;
  }

  /**
   * Perform the actual rollback
   * @param {Object} checkpoint - Checkpoint
   * @param {Object} impact - Impact analysis
   * @param {Object} options - Rollback options
   */
  async performRollback(checkpoint, impact, options = {}) {
    // Restore state from checkpoint
    const state = checkpoint.state;

    // Notify components to restore their state
    this.emit('restore-state', { state });

    // Invalidate downstream work
    this.emit('invalidate-work', { impact });

    // Log the rollback
    await this.logRollback(checkpoint, impact);

    return {
      restoredState: state,
      invalidatedItems: impact.invalidatedWork.length,
      duration: Date.now() - checkpoint.timestamp
    };
  }

  /**
   * Log rollback action
   */
  async logRollback(checkpoint, impact) {
    const logEntry = {
      action: 'rollback',
      checkpoint: {
        id: checkpoint.id,
        name: checkpoint.name,
        timestamp: checkpoint.timestamp
      },
      impact,
      timestamp: Date.now()
    };

    const logFile = path.join(this.checkpointDir, 'rollback-log.jsonl');
    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n', 'utf8');
  }

  /**
   * Delete a checkpoint
   * @param {string} checkpointId - Checkpoint ID to delete
   */
  async deleteCheckpoint(checkpointId) {
    const checkpoint = this.checkpoints.get(checkpointId);

    if (!checkpoint) {
      throw new Error(`Checkpoint ${checkpointId} not found`);
    }

    // Delete from disk
    const filePath = path.join(this.checkpointDir, `${checkpointId}.json`);
    await fs.remove(filePath);

    // Remove from memory
    this.checkpoints.delete(checkpointId);

    this.emit('checkpoint-deleted', { checkpointId });
  }

  /**
   * Clean up old checkpoints
   * @param {number} maxAge - Maximum age in milliseconds
   */
  async cleanup(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days default
    const cutoff = Date.now() - maxAge;
    const toDelete = [];

    for (const [id, checkpoint] of this.checkpoints) {
      if (checkpoint.timestamp < cutoff) {
        toDelete.push(id);
      }
    }

    for (const id of toDelete) {
      await this.deleteCheckpoint(id);
    }

    this.emit('cleanup-completed', { deleted: toDelete.length });

    return { deleted: toDelete.length };
  }
}

// Singleton instance
let instance = null;

export default {
  RollbackSystem,
  getInstance: () => {
    if (!instance) {
      instance = new RollbackSystem();
    }
    return instance;
  }
};
