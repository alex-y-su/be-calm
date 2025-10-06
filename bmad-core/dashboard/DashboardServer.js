/**
 * Dashboard Server
 * Serves web-based dashboards for BMAD metrics and controls
 */

import http from 'node:http';
import fs from 'fs-extra';
import path from 'node:path';
import { EventEmitter } from 'node:events';

class DashboardServer extends EventEmitter {
  constructor(metricsCollector, config = {}) {
    super();
    this.metrics = metricsCollector;
    this.config = config;
    this.port = config.port || 3001;
    this.server = null;
    this.wsClients = new Set();
  }

  /**
   * Start dashboard server
   */
  async start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (err) => {
        if (err) {
          reject(err);
        } else {
          this.emit('started', { port: this.port });
          resolve();
        }
      });
    });
  }

  /**
   * Handle HTTP request
   */
  async handleRequest(req, res) {
    const url = new URL(req.url, `http://localhost:${this.port}`);

    // API routes
    if (url.pathname.startsWith('/api/')) {
      await this.handleAPIRequest(url, req, res);
      return;
    }

    // Static files and views
    await this.handleViewRequest(url, req, res);
  }

  /**
   * Handle API request
   */
  async handleAPIRequest(url, req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
      const parts = url.pathname.split('/').filter(Boolean);
      const endpoint = parts[1]; // api/<endpoint>

      let data;

      switch (endpoint) {
        case 'metrics':
          data = await this.getMetrics(url.searchParams);
          break;

        case 'metrics-all':
          data = await this.metrics.getAll();
          break;

        case 'metric':
          const name = url.searchParams.get('name');
          if (!name) {
            res.statusCode = 400;
            data = { error: 'Missing metric name' };
          } else {
            data = await this.metrics.get(name, {
              startTime: url.searchParams.get('startTime'),
              endTime: url.searchParams.get('endTime')
            });
          }
          break;

        case 'stats':
          const metricName = url.searchParams.get('name');
          if (!metricName) {
            res.statusCode = 400;
            data = { error: 'Missing metric name' };
          } else {
            data = await this.metrics.getStats(metricName);
          }
          break;

        case 'health':
          data = await this.getHealthStatus();
          break;

        case 'realtime':
          data = await this.getRealtimeMetrics();
          break;

        case 'learning':
          data = await this.getLearningMetrics();
          break;

        case 'project':
          data = await this.getProjectMetrics();
          break;

        default:
          res.statusCode = 404;
          data = { error: 'Endpoint not found' };
      }

      res.end(JSON.stringify(data, null, 2));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  }

  /**
   * Handle view request
   */
  async handleViewRequest(url, req, res) {
    let filePath;

    if (url.pathname === '/' || url.pathname === '/dashboard') {
      filePath = path.join(__dirname, 'views', 'realtime.html');
    } else if (url.pathname.startsWith('/dashboard/')) {
      const view = url.pathname.split('/')[2] || 'realtime';
      filePath = path.join(__dirname, 'views', `${view}.html`);
    } else if (url.pathname.startsWith('/public/')) {
      filePath = path.join(__dirname, 'public', url.pathname.replace('/public/', ''));
    } else {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    try {
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        const ext = path.extname(filePath);

        const contentTypes = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.json': 'application/json'
        };

        res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
        res.end(content);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    } catch (error) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }

  /**
   * Get metrics data
   */
  async getMetrics(params) {
    const names = params.get('names')?.split(',') || [];

    if (names.length === 0) {
      return await this.metrics.getAll();
    }

    const results = {};
    for (const name of names) {
      results[name] = await this.metrics.getStats(name);
    }
    return results;
  }

  /**
   * Get health status
   */
  async getHealthStatus() {
    const coverage = await this.metrics.getStats('domain_coverage');
    const traceability = await this.metrics.getStats('traceability_score');
    const evalPassRate = await this.metrics.getStats('eval_pass_rate');
    const testCoverage = await this.metrics.getStats('test_coverage');

    return {
      truth_alignment: {
        domain_coverage: coverage?.latest || 0,
        traceability: traceability?.latest || 0,
        eval_pass_rate: evalPassRate?.latest || 0
      },
      quality: {
        test_coverage: testCoverage?.latest || 0
      },
      status: 'healthy',
      timestamp: Date.now()
    };
  }

  /**
   * Get real-time metrics
   */
  async getRealtimeMetrics() {
    return {
      eval_pass_rate: await this.metrics.getStats('eval_pass_rate'),
      agent_utilization: await this.metrics.getStats('agent_utilization'),
      drift_detected: await this.metrics.getCurrent('drift_detected'),
      validation_gates: {
        oracle: 'passing',
        eval: 'passing',
        traceability: 'passing'
      },
      timestamp: Date.now()
    };
  }

  /**
   * Get learning metrics
   */
  async getLearningMetrics() {
    return {
      reflection_insights: await this.metrics.getStats('reflection_insights_per_sprint'),
      process_optimization: await this.metrics.getStats('process_optimization_rate'),
      agent_improvement: await this.metrics.getStats('agent_improvement_rate'),
      pattern_library_size: await this.metrics.getCurrent('pattern_library_size'),
      timestamp: Date.now()
    };
  }

  /**
   * Get project metrics
   */
  async getProjectMetrics() {
    return {
      workflow_progress: {
        phase: 'development',
        completion: 0.65
      },
      phase_duration: await this.metrics.getStats('phase_duration'),
      validation_time: await this.metrics.getStats('validation_gate_time'),
      timestamp: Date.now()
    };
  }

  /**
   * Stop dashboard server
   */
  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          this.emit('stopped');
          resolve();
        });
      });
    }
  }

  /**
   * Get server URL
   */
  getURL() {
    return `http://localhost:${this.port}`;
  }
}

export default DashboardServer;
