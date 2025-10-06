/**
 * Metrics Collector
 * Collects and manages all BMAD metrics
 */

import { EventEmitter } from 'node:events';
import MetricsStore from './storage/MetricsStore.js';

class MetricsCollector extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.store = new MetricsStore(config?.storage);
    this.collectors = new Map();
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  /**
   * Initialize metrics collector
   */
  async initialize() {
    await this.store.initialize();

    // Register built-in collectors
    const AutonomyMetricsCollector = (await import('./collectors/AutonomyMetricsCollector.js')).default;
    const TruthMetricsCollector = (await import('./collectors/TruthMetricsCollector.js')).default;
    const QualityMetricsCollector = (await import('./collectors/QualityMetricsCollector.js')).default;
    const LearningMetricsCollector = (await import('./collectors/LearningMetricsCollector.js')).default;
    const PerformanceMetricsCollector = (await import('./collectors/PerformanceMetricsCollector.js')).default;

    this.registerCollector('autonomy', AutonomyMetricsCollector);
    this.registerCollector('truth', TruthMetricsCollector);
    this.registerCollector('quality', QualityMetricsCollector);
    this.registerCollector('learning', LearningMetricsCollector);
    this.registerCollector('performance', PerformanceMetricsCollector);

    this.emit('initialized');
  }

  /**
   * Register a metrics collector
   * @param {string} name - Collector name
   * @param {Object} CollectorClass - Collector class
   */
  registerCollector(name, CollectorClass) {
    const collector = new CollectorClass(this);
    this.collectors.set(name, collector);
    this.emit('collector-registered', { name });
  }

  /**
   * Record a metric
   * @param {string} name - Metric name
   * @param {number|Object} value - Metric value
   * @param {Object} tags - Optional tags
   */
  async record(name, value, tags = {}) {
    const timestamp = Date.now();
    const metric = {
      name,
      value,
      tags,
      timestamp
    };

    // Store in memory
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push(metric);

    // Persist to storage
    await this.store.write(metric);

    this.emit('metric-recorded', metric);

    // Check alerting thresholds
    await this.checkAlerts(name, value, tags);
  }

  /**
   * Record multiple metrics
   * @param {Array} metrics - Array of {name, value, tags} objects
   */
  async recordBatch(metrics) {
    const timestamp = Date.now();
    const enrichedMetrics = metrics.map(m => ({
      ...m,
      timestamp: m.timestamp || timestamp
    }));

    // Store in memory
    for (const metric of enrichedMetrics) {
      if (!this.metrics.has(metric.name)) {
        this.metrics.set(metric.name, []);
      }
      this.metrics.get(metric.name).push(metric);
    }

    // Persist to storage
    await this.store.writeBatch(enrichedMetrics);

    this.emit('metrics-recorded', { count: metrics.length });
  }

  /**
   * Get metric values
   * @param {string} name - Metric name
   * @param {Object} options - Query options (startTime, endTime, tags)
   */
  async get(name, options = {}) {
    return this.store.read(name, options);
  }

  /**
   * Get current value of a metric
   * @param {string} name - Metric name
   */
  getCurrent(name) {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return null;
    }
    return values[values.length - 1].value;
  }

  /**
   * Get metric statistics
   * @param {string} name - Metric name
   * @param {Object} options - Query options
   */
  async getStats(name, options = {}) {
    const values = await this.get(name, options);

    if (values.length === 0) {
      return null;
    }

    const numericValues = values.map(v => typeof v.value === 'number' ? v.value : 0);

    return {
      count: values.length,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
      latest: values[values.length - 1].value,
      timestamp: values[values.length - 1].timestamp
    };
  }

  /**
   * Get all metrics
   */
  async getAll() {
    const results = {};
    for (const [name] of this.metrics) {
      results[name] = await this.getStats(name);
    }
    return results;
  }

  /**
   * Check if metric exceeds alert thresholds
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   * @param {Object} tags - Metric tags
   */
  async checkAlerts(name, value, tags) {
    if (!this.config?.alerting?.enabled) {
      return;
    }

    const thresholds = this.config.alerting.thresholds || {};

    // Check specific threshold rules
    const rules = {
      'eval_pass_rate': (v) => v < (thresholds.eval_pass_rate_below || 0.90),
      'drift_detection_rate': (v) => v > (thresholds.drift_detection_above || 0.10),
      'agent_utilization': (v) => v < (thresholds.agent_utilization_below || 0.50),
      'test_coverage': (v) => v < (thresholds.test_coverage_below || 0.85)
    };

    const rule = rules[name];
    if (rule && rule(value)) {
      this.emit('alert', {
        metric: name,
        value,
        threshold: thresholds[name],
        timestamp: Date.now(),
        tags
      });
    }
  }

  /**
   * Export metrics
   * @param {string} format - Export format (json, csv)
   * @param {Object} options - Export options
   */
  async export(format = 'json', options = {}) {
    const metrics = await this.getAll();

    if (format === 'json') {
      return JSON.stringify(metrics, null, 2);
    } else if (format === 'csv') {
      return this.exportCSV(metrics, options);
    }

    throw new Error(`Unsupported export format: ${format}`);
  }

  /**
   * Export metrics as CSV
   * @param {Object} metrics - Metrics object
   * @param {Object} options - Export options
   */
  exportCSV(metrics, options = {}) {
    const rows = [];
    rows.push(['Metric', 'Count', 'Min', 'Max', 'Avg', 'Latest', 'Timestamp']);

    for (const [name, stats] of Object.entries(metrics)) {
      if (stats) {
        rows.push([
          name,
          stats.count,
          stats.min,
          stats.max,
          stats.avg.toFixed(4),
          stats.latest,
          new Date(stats.timestamp).toISOString()
        ]);
      }
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  /**
   * Clear old metrics based on retention policy
   */
  async cleanup() {
    const retentionDays = this.config?.storage?.retention_days || 90;
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);

    await this.store.deleteOlderThan(cutoffTime);
    this.emit('cleanup-completed', { cutoffTime });
  }

  /**
   * Get system uptime
   */
  getUptime() {
    return Date.now() - this.startTime;
  }

  /**
   * Reset all metrics
   */
  async reset() {
    this.metrics.clear();
    await this.store.clear();
    this.emit('reset');
  }
}

// Singleton instance
let instance = null;

export default {
  MetricsCollector,
  getInstance: (config) => {
    if (!instance) {
      instance = new MetricsCollector(config);
    }
    return instance;
  }
};
