/**
 * Metrics Storage
 * Handles persistence of metrics data
 */

import fs from 'fs-extra';
import path from 'node:path';

class MetricsStore {
  constructor(config = {}) {
    this.config = config;
    this.location = config.location || '.bmad-metrics';
    this.format = config.format || 'json';
    this.buffer = [];
    this.bufferSize = 100;
    this.flushInterval = 5000; // 5 seconds
  }

  /**
   * Initialize storage
   */
  async initialize() {
    await fs.ensureDir(this.location);

    // Start auto-flush
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Write a single metric
   * @param {Object} metric - Metric object
   */
  async write(metric) {
    this.buffer.push(metric);

    if (this.buffer.length >= this.bufferSize) {
      await this.flush();
    }
  }

  /**
   * Write multiple metrics
   * @param {Array} metrics - Array of metric objects
   */
  async writeBatch(metrics) {
    this.buffer.push(...metrics);

    if (this.buffer.length >= this.bufferSize) {
      await this.flush();
    }
  }

  /**
   * Flush buffer to disk
   */
  async flush() {
    if (this.buffer.length === 0) {
      return;
    }

    const metrics = [...this.buffer];
    this.buffer = [];

    // Group by date for efficient storage
    const byDate = {};
    for (const metric of metrics) {
      const date = new Date(metric.timestamp).toISOString().split('T')[0];
      if (!byDate[date]) {
        byDate[date] = [];
      }
      byDate[date].push(metric);
    }

    // Write to date-partitioned files
    for (const [date, dateMetrics] of Object.entries(byDate)) {
      const filePath = path.join(this.location, `${date}.json`);

      // Append to existing file
      let existing = [];
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        existing = JSON.parse(content);
      }

      existing.push(...dateMetrics);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8');
    }
  }

  /**
   * Read metrics
   * @param {string} name - Metric name
   * @param {Object} options - Query options (startTime, endTime, tags)
   */
  async read(name, options = {}) {
    const { startTime, endTime, tags } = options;

    // Determine which files to read
    const files = await this.getRelevantFiles(startTime, endTime);

    const results = [];
    for (const file of files) {
      const filePath = path.join(this.location, file);
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        const metrics = JSON.parse(content);

        for (const metric of metrics) {
          // Filter by name
          if (metric.name !== name) continue;

          // Filter by time range
          if (startTime && metric.timestamp < startTime) continue;
          if (endTime && metric.timestamp > endTime) continue;

          // Filter by tags
          if (tags) {
            let match = true;
            for (const [key, value] of Object.entries(tags)) {
              if (metric.tags?.[key] !== value) {
                match = false;
                break;
              }
            }
            if (!match) continue;
          }

          results.push(metric);
        }
      }
    }

    return results.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get relevant files based on time range
   * @param {number} startTime - Start timestamp
   * @param {number} endTime - End timestamp
   */
  async getRelevantFiles(startTime, endTime) {
    const files = await fs.readdir(this.location);

    if (!startTime && !endTime) {
      return files.filter(f => f.endsWith('.json'));
    }

    const start = startTime ? new Date(startTime) : new Date(0);
    const end = endTime ? new Date(endTime) : new Date();

    return files.filter(f => {
      if (!f.endsWith('.json')) return false;

      const dateStr = f.replace('.json', '');
      const fileDate = new Date(dateStr);

      return fileDate >= start && fileDate <= end;
    });
  }

  /**
   * Delete metrics older than timestamp
   * @param {number} timestamp - Cutoff timestamp
   */
  async deleteOlderThan(timestamp) {
    const files = await fs.readdir(this.location);
    const cutoffDate = new Date(timestamp).toISOString().split('T')[0];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const dateStr = file.replace('.json', '');
      if (dateStr < cutoffDate) {
        await fs.unlink(path.join(this.location, file));
      }
    }
  }

  /**
   * Clear all metrics
   */
  async clear() {
    await fs.emptyDir(this.location);
  }

  /**
   * Shutdown storage
   */
  async shutdown() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
  }
}

export default MetricsStore;
