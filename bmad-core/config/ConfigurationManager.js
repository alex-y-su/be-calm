/**
 * Configuration Manager
 * Handles loading, validation, and runtime management of BMAD configuration
 */

import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'js-yaml';
import { EventEmitter } from 'node:events';

class ConfigurationManager extends EventEmitter {
  constructor() {
    super();
    this.configs = new Map();
    this.overrides = new Map();
    this.configDir = '.bmad-config';
    this.loaded = false;
  }

  /**
   * Initialize configuration system
   * @param {string} projectRoot - Project root directory
   */
  async initialize(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.configPath = path.join(projectRoot, this.configDir);

    // Ensure config directory exists
    await fs.ensureDir(this.configPath);

    // Load all configurations
    await this.loadConfigurations();

    this.loaded = true;
    this.emit('initialized');
  }

  /**
   * Load all configuration files
   */
  async loadConfigurations() {
    const configFiles = [
      'autonomy-settings.yaml',
      'truth-settings.yaml',
      'metrics-config.yaml',
      'deployment-config.yaml',
      'notification-config.yaml'
    ];

    for (const file of configFiles) {
      await this.loadConfig(file);
    }
  }

  /**
   * Load a specific configuration file
   * @param {string} filename - Configuration filename
   */
  async loadConfig(filename) {
    const filePath = path.join(this.configPath, filename);
    const configName = path.parse(filename).name;

    try {
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        const config = yaml.load(content);
        this.configs.set(configName, config);
        this.emit('config-loaded', { name: configName, config });
      } else {
        // Load default configuration
        const defaultConfig = await this.loadDefaultConfig(configName);
        this.configs.set(configName, defaultConfig);
        // Save default to disk
        await this.saveConfig(configName, defaultConfig);
      }
    } catch (error) {
      throw new Error(`Failed to load config ${filename}: ${error.message}`);
    }
  }

  /**
   * Load default configuration
   * @param {string} configName - Configuration name
   */
  async loadDefaultConfig(configName) {
    const defaultsPath = path.join(__dirname, 'defaults', `${configName}.yaml`);

    if (await fs.pathExists(defaultsPath)) {
      const content = await fs.readFile(defaultsPath, 'utf8');
      return yaml.load(content);
    }

    // Return built-in defaults
    return this.getBuiltInDefaults(configName);
  }

  /**
   * Get built-in default configurations
   * @param {string} configName - Configuration name
   */
  getBuiltInDefaults(configName) {
    const defaults = {
      'autonomy-settings': {
        level: 'balanced',
        auto_agent_switching: { enabled: true, require_confirmation: true },
        background_agents: { enabled: true, max_concurrent: 2 },
        auto_command_execution: { enabled: false },
        predictive_suggestions: { enabled: true, auto_accept_threshold: 0.95 },
        goal_mode: { enabled: true, checkpoint_approval: 'major_milestones_only' },
        truth_validation: {
          oracle_blocking: true,
          eval_blocking: true,
          validator_warnings: true,
          monitor_alerts: true
        }
      },
      'truth-settings': {
        domain_truth: { auto_create: true, require_approval: true },
        eval_datasets: { auto_generate: true, coverage_threshold: 0.90 },
        validation: { oracle_validation: 'blocking', eval_test_execution: 'blocking' },
        propagation: { cascade_updates: true, require_approval: 'major_changes_only' }
      },
      'metrics-config': {
        collection: { enabled: true, frequency: 'real_time' },
        storage: { location: '.bmad-metrics', retention_days: 90 },
        dashboards: { enabled: true, port: 3001 }
      },
      'deployment-config': {
        mode: 'local_development',
        health_checks: { enabled: true, frequency: 'startup' }
      },
      'notification-config': {
        channels: ['cli', 'web'],
        levels: { info: ['cli'], warning: ['cli', 'web'], error: ['cli', 'web'], critical: ['cli', 'web'] }
      }
    };

    return defaults[configName] || {};
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key (dot notation: 'autonomy-settings.level')
   */
  get(key) {
    // Check overrides first
    if (this.overrides.has(key)) {
      return this.overrides.get(key);
    }

    // Parse key
    const parts = key.split('.');
    const configName = parts[0];
    const config = this.configs.get(configName);

    if (!config) {
      return undefined;
    }

    // Navigate nested path
    let value = config;
    for (let i = 1; i < parts.length; i++) {
      value = value?.[parts[i]];
    }

    return value;
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key
   * @param {*} value - Configuration value
   * @param {boolean} persist - Whether to persist to disk
   */
  async set(key, value, persist = true) {
    const parts = key.split('.');
    const configName = parts[0];
    let config = this.configs.get(configName);

    if (!config) {
      config = {};
      this.configs.set(configName, config);
    }

    // Navigate and set value
    let current = config;
    for (let i = 1; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;

    this.emit('config-changed', { key, value });

    if (persist) {
      await this.saveConfig(configName, config);
    }
  }

  /**
   * Set temporary override (session only)
   * @param {string} key - Configuration key
   * @param {*} value - Override value
   */
  setOverride(key, value) {
    this.overrides.set(key, value);
    this.emit('override-set', { key, value });
  }

  /**
   * Clear temporary override
   * @param {string} key - Configuration key
   */
  clearOverride(key) {
    this.overrides.delete(key);
    this.emit('override-cleared', { key });
  }

  /**
   * Clear all temporary overrides
   */
  clearAllOverrides() {
    this.overrides.clear();
    this.emit('overrides-cleared');
  }

  /**
   * Save configuration to disk
   * @param {string} configName - Configuration name
   * @param {Object} config - Configuration object
   */
  async saveConfig(configName, config) {
    const filePath = path.join(this.configPath, `${configName}.yaml`);
    const yamlContent = yaml.dump(config, { indent: 2, lineWidth: 120 });
    await fs.writeFile(filePath, yamlContent, 'utf8');
    this.emit('config-saved', { name: configName });
  }

  /**
   * Validate configuration
   * @param {string} configName - Configuration name (optional, validates all if not specified)
   */
  async validate(configName) {
    if (configName) {
      return this.validateSingleConfig(configName);
    }

    // Validate all configurations
    const results = {};
    for (const [name] of this.configs) {
      results[name] = await this.validateSingleConfig(name);
    }
    return results;
  }

  /**
   * Validate a single configuration
   * @param {string} configName - Configuration name
   */
  async validateSingleConfig(configName) {
    const config = this.configs.get(configName);
    if (!config) {
      return { valid: false, errors: [`Configuration ${configName} not found`] };
    }

    const errors = [];
    const warnings = [];

    // Load validator if exists
    const validatorPath = path.join(__dirname, 'validators', `${configName}-validator.js`);
    if (await fs.pathExists(validatorPath)) {
      const validator = (await import(validatorPath)).default;
      const result = validator.validate(config);
      errors.push(...(result.errors || []));
      warnings.push(...(result.warnings || []));
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Reset configuration to defaults
   * @param {string} configName - Configuration name (optional, resets all if not specified)
   */
  async reset(configName) {
    if (configName) {
      const defaultConfig = await this.loadDefaultConfig(configName);
      this.configs.set(configName, defaultConfig);
      await this.saveConfig(configName, defaultConfig);
      this.emit('config-reset', { name: configName });
    } else {
      // Reset all
      for (const [name] of this.configs) {
        await this.reset(name);
      }
    }
  }

  /**
   * Get autonomy level
   */
  getAutonomyLevel() {
    return this.get('autonomy-settings.level') || 'balanced';
  }

  /**
   * Set autonomy level
   * @param {string} level - Autonomy level (conservative, balanced, aggressive, full_auto)
   */
  async setAutonomyLevel(level) {
    const validLevels = ['conservative', 'balanced', 'aggressive', 'full_auto'];
    if (!validLevels.includes(level)) {
      throw new Error(`Invalid autonomy level: ${level}. Must be one of: ${validLevels.join(', ')}`);
    }

    await this.set('autonomy-settings.level', level);

    // Apply level-specific settings
    await this.applyAutonomyLevelSettings(level);

    this.emit('autonomy-level-changed', { level });
  }

  /**
   * Apply autonomy level-specific settings
   * @param {string} level - Autonomy level
   */
  async applyAutonomyLevelSettings(level) {
    const levelSettings = {
      conservative: {
        'autonomy-settings.auto_agent_switching.enabled': false,
        'autonomy-settings.background_agents.enabled': true,
        'autonomy-settings.auto_command_execution.enabled': false,
        'autonomy-settings.predictive_suggestions.enabled': true,
        'autonomy-settings.goal_mode.enabled': false,
        'autonomy-settings.truth_validation.oracle_blocking': true,
        'autonomy-settings.truth_validation.eval_blocking': true
      },
      balanced: {
        'autonomy-settings.auto_agent_switching.enabled': true,
        'autonomy-settings.auto_agent_switching.require_confirmation': true,
        'autonomy-settings.background_agents.enabled': true,
        'autonomy-settings.auto_command_execution.enabled': false,
        'autonomy-settings.predictive_suggestions.enabled': true,
        'autonomy-settings.goal_mode.enabled': true,
        'autonomy-settings.goal_mode.checkpoint_approval': 'major_milestones_only',
        'autonomy-settings.truth_validation.oracle_blocking': true
      },
      aggressive: {
        'autonomy-settings.auto_agent_switching.enabled': true,
        'autonomy-settings.auto_agent_switching.require_confirmation': false,
        'autonomy-settings.background_agents.enabled': true,
        'autonomy-settings.background_agents.max_concurrent': 4,
        'autonomy-settings.auto_command_execution.enabled': true,
        'autonomy-settings.predictive_suggestions.enabled': true,
        'autonomy-settings.goal_mode.enabled': true,
        'autonomy-settings.goal_mode.checkpoint_approval': 'minimal',
        'autonomy-settings.truth_validation.oracle_blocking': false
      },
      full_auto: {
        'autonomy-settings.auto_agent_switching.enabled': true,
        'autonomy-settings.auto_agent_switching.require_confirmation': false,
        'autonomy-settings.background_agents.enabled': true,
        'autonomy-settings.background_agents.max_concurrent': -1,
        'autonomy-settings.auto_command_execution.enabled': true,
        'autonomy-settings.predictive_suggestions.enabled': true,
        'autonomy-settings.goal_mode.enabled': true,
        'autonomy-settings.goal_mode.checkpoint_approval': 'none',
        'autonomy-settings.truth_validation.oracle_blocking': false,
        'autonomy-settings.truth_validation.eval_blocking': false
      }
    };

    const settings = levelSettings[level];
    for (const [key, value] of Object.entries(settings)) {
      await this.set(key, value, false);
    }

    // Save the autonomy-settings config once
    await this.saveConfig('autonomy-settings', this.configs.get('autonomy-settings'));
  }

  /**
   * Export configuration
   * @param {string} format - Export format (yaml, json)
   */
  exportConfig(format = 'yaml') {
    const allConfigs = {};
    for (const [name, config] of this.configs) {
      allConfigs[name] = config;
    }

    if (format === 'json') {
      return JSON.stringify(allConfigs, null, 2);
    } else {
      return yaml.dump(allConfigs, { indent: 2, lineWidth: 120 });
    }
  }

  /**
   * Import configuration
   * @param {string} content - Configuration content
   * @param {string} format - Format (yaml, json)
   */
  async importConfig(content, format = 'yaml') {
    let configs;

    if (format === 'json') {
      configs = JSON.parse(content);
    } else {
      configs = yaml.load(content);
    }

    for (const [name, config] of Object.entries(configs)) {
      this.configs.set(name, config);
      await this.saveConfig(name, config);
    }

    this.emit('config-imported');
  }
}

// Singleton instance
let instance = null;

export default {
  ConfigurationManager,
  getInstance: () => {
    if (!instance) {
      instance = new ConfigurationManager();
    }
    return instance;
  }
};
