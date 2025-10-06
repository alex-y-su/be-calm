/**
 * Audit Logger
 * Comprehensive logging system for all BMAD actions
 */

import fs from 'fs-extra';
import path from 'node:path';
import { EventEmitter } from 'node:events';

class AuditLogger extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.logDir = config.location || '.bmad-audit';
    this.retention = config.retention_days || 365;
    this.format = config.format || 'jsonl';
    this.buffer = [];
    this.bufferSize = 100;
  }

  /**
   * Initialize audit logger
   */
  async initialize() {
    await fs.ensureDir(this.logDir);

    // Start auto-flush
    this.flushTimer = setInterval(() => {
      this.flush();
    }, 5000); // Flush every 5 seconds

    this.emit('initialized');
  }

  /**
   * Log an action
   * @param {string} category - Log category
   * @param {string} action - Action performed
   * @param {Object} details - Action details
   */
  async log(category, action, details = {}) {
    const entry = {
      timestamp: Date.now(),
      category,
      action,
      details,
      user: details.user || 'system',
      session: details.session || null
    };

    this.buffer.push(entry);

    if (this.buffer.length >= this.bufferSize) {
      await this.flush();
    }

    this.emit('logged', entry);
  }

  /**
   * Log agent invocation
   */
  async logAgentInvocation(agent, context = {}) {
    await this.log('agent', 'invocation', {
      agent,
      context,
      timestamp: Date.now()
    });
  }

  /**
   * Log validation result
   */
  async logValidation(type, result, details = {}) {
    await this.log('validation', type, {
      result,
      ...details,
      timestamp: Date.now()
    });
  }

  /**
   * Log state transition
   */
  async logStateTransition(from, to, context = {}) {
    await this.log('state', 'transition', {
      from,
      to,
      context,
      timestamp: Date.now()
    });
  }

  /**
   * Log user override
   */
  async logUserOverride(action, override, reason = '') {
    await this.log('override', action, {
      override,
      reason,
      timestamp: Date.now()
    });
  }

  /**
   * Log configuration change
   */
  async logConfigChange(key, oldValue, newValue, user = 'system') {
    await this.log('configuration', 'change', {
      key,
      oldValue,
      newValue,
      user,
      timestamp: Date.now()
    });
  }

  /**
   * Log error or exception
   */
  async logError(error, context = {}) {
    await this.log('error', 'exception', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      timestamp: Date.now()
    });
  }

  /**
   * Log security event
   */
  async logSecurity(event, details = {}) {
    await this.log('security', event, {
      ...details,
      severity: details.severity || 'medium',
      timestamp: Date.now()
    });
  }

  /**
   * Flush buffer to disk
   */
  async flush() {
    if (this.buffer.length === 0) {
      return;
    }

    const entries = [...this.buffer];
    this.buffer = [];

    // Group by date
    const byDate = {};
    for (const entry of entries) {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      if (!byDate[date]) {
        byDate[date] = [];
      }
      byDate[date].push(entry);
    }

    // Write to date-partitioned files
    for (const [date, dateEntries] of Object.entries(byDate)) {
      const fileName = `audit-${date}.${this.format}`;
      const filePath = path.join(this.logDir, fileName);

      if (this.format === 'jsonl') {
        const lines = dateEntries.map(e => JSON.stringify(e)).join('\n') + '\n';
        await fs.appendFile(filePath, lines, 'utf8');
      } else {
        // JSON format - append to array
        let existing = [];
        if (await fs.pathExists(filePath)) {
          existing = await fs.readJson(filePath);
        }
        existing.push(...dateEntries);
        await fs.writeJson(filePath, existing, { spaces: 2 });
      }
    }

    this.emit('flushed', { count: entries.length });
  }

  /**
   * Query audit logs
   * @param {Object} query - Query parameters
   */
  async query(query = {}) {
    const {
      category,
      action,
      startTime,
      endTime,
      user,
      limit = 1000
    } = query;

    const files = await this.getRelevantFiles(startTime, endTime);
    const results = [];

    for (const file of files) {
      const filePath = path.join(this.logDir, file);

      if (this.format === 'jsonl') {
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        for (const line of lines) {
          if (!line) continue;
          const entry = JSON.parse(line);

          if (this.matchesQuery(entry, query)) {
            results.push(entry);
            if (results.length >= limit) {
              return results;
            }
          }
        }
      } else {
        const entries = await fs.readJson(filePath);
        for (const entry of entries) {
          if (this.matchesQuery(entry, query)) {
            results.push(entry);
            if (results.length >= limit) {
              return results;
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Check if entry matches query
   */
  matchesQuery(entry, query) {
    if (query.category && entry.category !== query.category) return false;
    if (query.action && entry.action !== query.action) return false;
    if (query.user && entry.user !== query.user) return false;
    if (query.startTime && entry.timestamp < query.startTime) return false;
    if (query.endTime && entry.timestamp > query.endTime) return false;
    return true;
  }

  /**
   * Get relevant files based on time range
   */
  async getRelevantFiles(startTime, endTime) {
    const files = await fs.readdir(this.logDir);

    if (!startTime && !endTime) {
      return files.filter(f => f.startsWith('audit-')).sort().reverse();
    }

    const start = startTime ? new Date(startTime) : new Date(0);
    const end = endTime ? new Date(endTime) : new Date();

    return files.filter(f => {
      if (!f.startsWith('audit-')) return false;

      const dateStr = f.replace('audit-', '').replace(/\.(jsonl|json)$/, '');
      const fileDate = new Date(dateStr);

      return fileDate >= start && fileDate <= end;
    }).sort().reverse();
  }

  /**
   * Clean up old audit logs
   */
  async cleanup() {
    const cutoffDate = new Date(Date.now() - (this.retention * 24 * 60 * 60 * 1000));
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const files = await fs.readdir(this.logDir);

    for (const file of files) {
      if (!file.startsWith('audit-')) continue;

      const dateStr = file.replace('audit-', '').replace(/\.(jsonl|json)$/, '');
      if (dateStr < cutoffStr) {
        await fs.unlink(path.join(this.logDir, file));
      }
    }

    this.emit('cleanup-completed');
  }

  /**
   * Export audit logs
   * @param {Object} query - Query parameters
   * @param {string} format - Export format
   */
  async export(query = {}, format = 'json') {
    const logs = await this.query(query);

    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else if (format === 'csv') {
      return this.exportCSV(logs);
    }

    throw new Error(`Unsupported export format: ${format}`);
  }

  /**
   * Export logs as CSV
   */
  exportCSV(logs) {
    if (logs.length === 0) {
      return 'No logs found';
    }

    const headers = ['Timestamp', 'Category', 'Action', 'User', 'Details'];
    const rows = [headers];

    for (const log of logs) {
      rows.push([
        new Date(log.timestamp).toISOString(),
        log.category,
        log.action,
        log.user,
        JSON.stringify(log.details)
      ]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  /**
   * Shutdown audit logger
   */
  async shutdown() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
    this.emit('shutdown');
  }
}

// Singleton instance
let instance = null;

export default {
  AuditLogger,
  getInstance: (config) => {
    if (!instance) {
      instance = new AuditLogger(config);
    }
    return instance;
  }
};
