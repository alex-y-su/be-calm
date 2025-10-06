/**
 * Metrics Configuration Validator
 */

function validate(config) {
  const errors = [];
  const warnings = [];

  // Validate storage
  if (config.storage) {
    if (config.storage.retention_days && config.storage.retention_days < 1) {
      errors.push('storage.retention_days must be >= 1');
    }
    if (config.storage.retention_aggregated_days && config.storage.retention_aggregated_days < config.storage.retention_days) {
      errors.push('storage.retention_aggregated_days must be >= retention_days');
    }
  }

  // Validate targets
  if (config.targets) {
    const validateTarget = (category, metric, value) => {
      if (value < 0 || value > 1) {
        errors.push(`targets.${category}.${metric} must be between 0 and 1`);
      }
    };

    if (config.targets.autonomy) {
      Object.entries(config.targets.autonomy).forEach(([metric, value]) => {
        if (typeof value === 'number') validateTarget('autonomy', metric, value);
      });
    }

    if (config.targets.truth_reliability) {
      Object.entries(config.targets.truth_reliability).forEach(([metric, value]) => {
        if (typeof value === 'number') validateTarget('truth_reliability', metric, value);
      });
    }

    if (config.targets.quality) {
      Object.entries(config.targets.quality).forEach(([metric, value]) => {
        if (typeof value === 'number') validateTarget('quality', metric, value);
      });
    }
  }

  // Validate dashboards
  if (config.dashboards) {
    if (config.dashboards.port && (config.dashboards.port < 1 || config.dashboards.port > 65535)) {
      errors.push('dashboards.port must be between 1 and 65535');
    }
  }

  // Validate alerting thresholds
  if (config.alerting?.thresholds) {
    Object.entries(config.alerting.thresholds).forEach(([metric, value]) => {
      if (typeof value === 'number' && (value < 0 || value > 1)) {
        errors.push(`alerting.thresholds.${metric} must be between 0 and 1`);
      }
    });
  }

  // Warnings
  if (config.storage?.retention_days && config.storage.retention_days < 30) {
    warnings.push('Low retention_days - consider increasing for better historical analysis');
  }

  if (!config.collection?.enabled) {
    warnings.push('Metrics collection disabled - dashboards and alerts will not work');
  }

  return { errors, warnings };
}

export default { validate };
