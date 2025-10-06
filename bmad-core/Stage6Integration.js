/**
 * Stage 6 Integration Module
 * Orchestrates all Stage 6 components
 */

import { EventEmitter } from 'node:events';
import { ConfigurationManager } from './config/ConfigurationManager.js';
import { MetricsCollector } from './metrics/MetricsCollector.js';
import DashboardServer from './dashboard/DashboardServer.js';
import { EmergencyStop } from './safety/EmergencyStop.js';
import { RollbackSystem } from './safety/RollbackSystem.js';
import { SafeMode } from './safety/SafeMode.js';
import { AuditLogger } from './safety/AuditLogger.js';
import { NotificationSystem } from './notifications/NotificationSystem.js';
import { HealthCheckSystem } from './health/HealthCheckSystem.js';
import { MigrationTool } from './migration/MigrationTool.js';
import BmadCLI from './cli/BmadCLI.js';

class Stage6Integration extends EventEmitter {
  constructor() {
    super();
    this.initialized = false;
    this.components = {};
  }

  /**
   * Initialize all Stage 6 systems
   */
  async initialize(projectRoot = process.cwd()) {
    if (this.initialized) {
      return;
    }

    this.emit('initialization-started');

    try {
      // 1. Initialize Configuration System
      this.components.config = ConfigurationManager.getInstance();
      await this.components.config.initialize(projectRoot);
      this.emit('component-initialized', { name: 'configuration' });

      // 2. Initialize Metrics Collector
      const metricsConfig = this.components.config.get('metrics-config');
      this.components.metrics = MetricsCollector.getInstance(metricsConfig);
      await this.components.metrics.initialize();
      this.emit('component-initialized', { name: 'metrics' });

      // 3. Initialize Dashboard (if enabled)
      if (metricsConfig?.dashboards?.enabled) {
        this.components.dashboard = new DashboardServer(
          this.components.metrics,
          metricsConfig.dashboards
        );
        this.emit('component-initialized', { name: 'dashboard' });
      }

      // 4. Initialize Safety Systems
      this.components.emergencyStop = EmergencyStop.getInstance();
      this.components.rollback = RollbackSystem.getInstance();
      await this.components.rollback.initialize();
      this.components.safeMode = SafeMode.getInstance();
      this.emit('component-initialized', { name: 'safety' });

      // 5. Initialize Audit Logger
      const auditConfig = {
        location: '.bmad-audit',
        retention_days: 365,
        format: 'jsonl'
      };
      this.components.auditLogger = AuditLogger.getInstance(auditConfig);
      await this.components.auditLogger.initialize();
      this.emit('component-initialized', { name: 'audit' });

      // 6. Initialize Notification System
      const notificationConfig = this.components.config.get('notification-config');
      this.components.notifications = NotificationSystem.getInstance(notificationConfig);
      await this.components.notifications.initialize();
      this.emit('component-initialized', { name: 'notifications' });

      // 7. Initialize Health Check System
      const healthConfig = this.components.config.get('deployment-config')?.health_checks;
      this.components.health = HealthCheckSystem.getInstance(healthConfig);
      await this.components.health.initialize();
      this.emit('component-initialized', { name: 'health' });

      // 8. Initialize Migration Tool
      this.components.migration = MigrationTool.getInstance();
      this.emit('component-initialized', { name: 'migration' });

      // 9. Wire up event handlers
      this.wireEventHandlers();

      // 10. Run startup health checks
      if (healthConfig?.enabled) {
        await this.runStartupHealthChecks();
      }

      this.initialized = true;
      this.emit('initialization-completed');

      // Log initialization
      await this.components.auditLogger.log('system', 'stage6-initialized', {
        timestamp: Date.now(),
        components: Object.keys(this.components)
      });

    } catch (error) {
      this.emit('initialization-failed', { error });
      throw error;
    }
  }

  /**
   * Wire up event handlers between components
   */
  wireEventHandlers() {
    // Emergency Stop → Halt all components
    this.components.emergencyStop.on('halt-agents', () => {
      this.emit('halt-all-agents');
    });

    this.components.emergencyStop.on('halt-workflow', () => {
      this.emit('halt-workflow');
    });

    this.components.emergencyStop.on('halt-metrics', async () => {
      await this.components.metrics.cleanup();
    });

    // Safe Mode → Update Configuration
    this.components.safeMode.on('set-autonomy-level', (level) => {
      this.components.config.setOverride('autonomy-settings.level', level);
    });

    // Metrics → Notifications (Alerts)
    this.components.metrics.on('alert', async (alert) => {
      await this.components.notifications.warning(
        `Metric Alert: ${alert.metric}`,
        `Value ${alert.value} exceeded threshold ${alert.threshold}`
      );
    });

    // Configuration Changes → Audit Log
    this.components.config.on('config-changed', async (change) => {
      await this.components.auditLogger.logConfigChange(
        change.key,
        null,
        change.value
      );
    });

    // Health Check Failures → Notifications
    this.components.health.on('check-failed', async (failure) => {
      await this.components.notifications.error(
        `Health Check Failed: ${failure.name}`,
        failure.error.message
      );
    });

    // Rollback → Audit Log
    this.components.rollback.on('rollback-completed', async (event) => {
      await this.components.auditLogger.log('rollback', 'completed', {
        checkpoint: event.checkpoint,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Run startup health checks
   */
  async runStartupHealthChecks() {
    const results = await this.components.health.runChecks('startup');

    if (results.status === 'unhealthy') {
      await this.components.notifications.critical(
        'System Health Check Failed',
        `Health score: ${results.score}. Review failed checks.`
      );

      // Optionally enter safe mode
      const autonomyLevel = this.components.config.getAutonomyLevel();
      if (autonomyLevel === 'conservative') {
        await this.components.safeMode.activate();
        await this.components.notifications.warning(
          'Safe Mode Activated',
          'System health issues detected. Safe mode enabled.'
        );
      }
    }

    return results;
  }

  /**
   * Start dashboard server
   */
  async startDashboard() {
    if (!this.components.dashboard) {
      throw new Error('Dashboard not initialized');
    }

    await this.components.dashboard.start();
    const url = this.components.dashboard.getURL();

    await this.components.notifications.info(
      'Dashboard Started',
      `Access dashboard at: ${url}`
    );

    return url;
  }

  /**
   * Stop dashboard server
   */
  async stopDashboard() {
    if (this.components.dashboard) {
      await this.components.dashboard.stop();
    }
  }

  /**
   * Get component by name
   */
  getComponent(name) {
    return this.components[name];
  }

  /**
   * Get all components
   */
  getAllComponents() {
    return { ...this.components };
  }

  /**
   * Execute emergency stop
   */
  async executeEmergencyStop(reason) {
    const result = await this.components.emergencyStop.execute(reason);

    await this.components.notifications.critical(
      'EMERGENCY STOP EXECUTED',
      `Reason: ${reason}`
    );

    return result;
  }

  /**
   * Resume from emergency stop
   */
  async resumeFromEmergencyStop(approvedBy) {
    const result = await this.components.emergencyStop.resume(approvedBy);

    await this.components.notifications.info(
      'System Resumed',
      `Approved by: ${approvedBy}`
    );

    return result;
  }

  /**
   * Activate safe mode
   */
  async activateSafeMode() {
    const result = await this.components.safeMode.activate();

    await this.components.notifications.warning(
      'Safe Mode Activated',
      'All automation disabled. Manual operations only.'
    );

    return result;
  }

  /**
   * Deactivate safe mode
   */
  async deactivateSafeMode() {
    const result = await this.components.safeMode.deactivate();

    await this.components.notifications.info(
      'Safe Mode Deactivated',
      'Normal operations resumed.'
    );

    return result;
  }

  /**
   * Create checkpoint
   */
  async createCheckpoint(name, state = {}) {
    const checkpoint = await this.components.rollback.createCheckpoint(name, state);

    await this.components.notifications.info(
      'Checkpoint Created',
      `Checkpoint: ${name}`
    );

    return checkpoint;
  }

  /**
   * Rollback to checkpoint
   */
  async rollbackToCheckpoint(checkpointId) {
    const result = await this.components.rollback.rollback(checkpointId);

    await this.components.notifications.warning(
      'Rollback Completed',
      `Restored to checkpoint: ${result.checkpoint.name}`
    );

    return result;
  }

  /**
   * Get system status
   */
  async getSystemStatus() {
    const health = await this.components.health.getStatus();
    const metrics = await this.components.metrics.getAll();
    const autonomyLevel = this.components.config.getAutonomyLevel();
    const safeMode = this.components.safeMode.isActive();
    const emergencyStop = this.components.emergencyStop.isStopped();

    return {
      health,
      autonomyLevel,
      safeMode,
      emergencyStop,
      metrics,
      timestamp: Date.now()
    };
  }

  /**
   * Shutdown all systems
   */
  async shutdown() {
    this.emit('shutdown-started');

    // Stop periodic checks
    if (this.components.health) {
      this.components.health.stopPeriodicChecks();
    }

    // Stop dashboard
    if (this.components.dashboard) {
      await this.stopDashboard();
    }

    // Flush audit logs
    if (this.components.auditLogger) {
      await this.components.auditLogger.shutdown();
    }

    // Flush metrics
    if (this.components.metrics) {
      await this.components.metrics.cleanup();
    }

    this.emit('shutdown-completed');
  }
}

// Singleton instance
let instance = null;

export { Stage6Integration };

export function getInstance() {
  if (!instance) {
    instance = new Stage6Integration();
  }
  return instance;
}
