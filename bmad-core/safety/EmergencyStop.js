/**
 * Emergency Stop System
 * Provides immediate halt of all BMAD operations
 */

import { EventEmitter } from 'node:events';
import fs from 'fs-extra';
import path from 'node:path';

class EmergencyStop extends EventEmitter {
  constructor() {
    super();
    this.stopped = false;
    this.stopTime = null;
    this.stopReason = null;
    this.stateSnapshot = null;
  }

  /**
   * Execute emergency stop
   * @param {string} reason - Reason for emergency stop
   */
  async execute(reason = 'User initiated') {
    if (this.stopped) {
      throw new Error('System already in emergency stop state');
    }

    this.stopped = true;
    this.stopTime = Date.now();
    this.stopReason = reason;

    this.emit('emergency-stop-initiated', { reason, timestamp: this.stopTime });

    // Save current state
    await this.saveState();

    // Halt all operations
    await this.haltOperations();

    // Generate emergency report
    await this.generateReport();

    this.emit('emergency-stop-completed', { reason, timestamp: Date.now() });

    return {
      success: true,
      stopTime: this.stopTime,
      reason: this.stopReason
    };
  }

  /**
   * Save current system state
   */
  async saveState() {
    this.stateSnapshot = {
      timestamp: Date.now(),
      reason: this.stopReason,
      activeAgents: [], // Would be populated from orchestrator
      currentPhase: null, // Would be populated from workflow
      pendingTasks: [], // Would be populated from task queue
      metrics: {} // Would be populated from metrics collector
    };

    const stateDir = '.bmad-emergency';
    await fs.ensureDir(stateDir);

    const stateFile = path.join(stateDir, `state-${this.stopTime}.json`);
    await fs.writeJson(stateFile, this.stateSnapshot, { spaces: 2 });

    this.emit('state-saved', { file: stateFile });
  }

  /**
   * Halt all operations
   */
  async haltOperations() {
    // Stop all agents
    this.emit('halt-agents');

    // Stop background tasks
    this.emit('halt-background-tasks');

    // Stop metrics collection
    this.emit('halt-metrics');

    // Stop workflow processing
    this.emit('halt-workflow');

    // Flush all buffers
    this.emit('flush-buffers');
  }

  /**
   * Generate emergency report
   */
  async generateReport() {
    const report = {
      title: 'BMAD Emergency Stop Report',
      timestamp: new Date(this.stopTime).toISOString(),
      reason: this.stopReason,
      state: this.stateSnapshot,
      recommendations: this.generateRecommendations()
    };

    const reportDir = '.bmad-emergency';
    const reportFile = path.join(reportDir, `report-${this.stopTime}.json`);
    await fs.writeJson(reportFile, report, { spaces: 2 });

    // Also create a human-readable markdown report
    const mdReport = this.formatReportMarkdown(report);
    const mdFile = path.join(reportDir, `report-${this.stopTime}.md`);
    await fs.writeFile(mdFile, mdReport, 'utf8');

    this.emit('report-generated', { file: reportFile });

    return report;
  }

  /**
   * Generate recommendations based on stop reason
   */
  generateRecommendations() {
    const recommendations = [];

    recommendations.push('Review the emergency report for details');
    recommendations.push('Check system logs for errors or warnings');
    recommendations.push('Verify configuration settings');
    recommendations.push('Run health checks before resuming');

    if (this.stopReason.includes('error') || this.stopReason.includes('failure')) {
      recommendations.push('Investigate and fix the underlying error');
      recommendations.push('Consider starting in safe mode');
    }

    return recommendations;
  }

  /**
   * Format report as markdown
   */
  formatReportMarkdown(report) {
    return `# ${report.title}

**Timestamp:** ${report.timestamp}
**Reason:** ${report.reason}

## State Snapshot

- **Active Agents:** ${report.state.activeAgents.length}
- **Current Phase:** ${report.state.currentPhase || 'None'}
- **Pending Tasks:** ${report.state.pendingTasks.length}

## Recommendations

${report.recommendations.map(r => `- ${r}`).join('\n')}

## Next Steps

1. Review this report thoroughly
2. Address the reason for the emergency stop
3. Run system health checks
4. Resume operations when safe
`;
  }

  /**
   * Check if system is in emergency stop state
   */
  isStopped() {
    return this.stopped;
  }

  /**
   * Resume operations (requires manual approval)
   * @param {string} approvedBy - Who approved the resume
   */
  async resume(approvedBy = 'User') {
    if (!this.stopped) {
      throw new Error('System is not in emergency stop state');
    }

    this.emit('resume-initiated', { approvedBy, timestamp: Date.now() });

    this.stopped = false;
    const duration = Date.now() - this.stopTime;

    this.emit('resume-completed', {
      approvedBy,
      duration,
      timestamp: Date.now()
    });

    // Log the resume
    await this.logResume(approvedBy, duration);

    return {
      success: true,
      duration,
      approvedBy
    };
  }

  /**
   * Log the resume action
   */
  async logResume(approvedBy, duration) {
    const logEntry = {
      action: 'emergency-stop-resume',
      approvedBy,
      duration,
      timestamp: Date.now(),
      previousStop: {
        time: this.stopTime,
        reason: this.stopReason
      }
    };

    const logDir = '.bmad-emergency';
    const logFile = path.join(logDir, 'resume-log.jsonl');

    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n', 'utf8');
  }

  /**
   * Get emergency stop status
   */
  getStatus() {
    return {
      stopped: this.stopped,
      stopTime: this.stopTime,
      stopReason: this.stopReason,
      duration: this.stopped ? Date.now() - this.stopTime : null
    };
  }
}

// Singleton instance
let instance = null;

export default {
  EmergencyStop,
  getInstance: () => {
    if (!instance) {
      instance = new EmergencyStop();
    }
    return instance;
  }
};
