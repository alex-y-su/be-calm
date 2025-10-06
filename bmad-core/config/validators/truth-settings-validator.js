/**
 * Truth Settings Validator
 */

function validate(config) {
  const errors = [];
  const warnings = [];

  // Validate validation modes
  const validModes = ['blocking', 'warning', 'advisory'];

  if (config.validation) {
    if (config.validation.oracle_validation && !validModes.includes(config.validation.oracle_validation)) {
      errors.push(`validation.oracle_validation must be one of: ${validModes.join(', ')}`);
    }
    if (config.validation.validator_traceability && !validModes.includes(config.validation.validator_traceability)) {
      errors.push(`validation.validator_traceability must be one of: ${validModes.join(', ')}`);
    }
    if (config.validation.monitor_drift && !validModes.includes(config.validation.monitor_drift)) {
      errors.push(`validation.monitor_drift must be one of: ${validModes.join(', ')}`);
    }
    if (config.validation.eval_test_execution && !validModes.includes(config.validation.eval_test_execution)) {
      errors.push(`validation.eval_test_execution must be one of: ${validModes.join(', ')}`);
    }
  }

  // Validate eval_datasets
  if (config.eval_datasets) {
    if (config.eval_datasets.coverage_threshold &&
        (config.eval_datasets.coverage_threshold < 0 || config.eval_datasets.coverage_threshold > 1)) {
      errors.push('eval_datasets.coverage_threshold must be between 0 and 1');
    }
  }

  // Validate propagation
  if (config.propagation) {
    const validApprovals = ['all', 'major_changes_only', 'none'];
    if (config.propagation.require_approval && !validApprovals.includes(config.propagation.require_approval)) {
      errors.push(`propagation.require_approval must be one of: ${validApprovals.join(', ')}`);
    }
  }

  // Validate truth quality
  if (config.truth_quality) {
    if (config.truth_quality.auto_refresh_threshold_days && config.truth_quality.auto_refresh_threshold_days < 1) {
      errors.push('truth_quality.auto_refresh_threshold_days must be >= 1');
    }
  }

  // Warnings
  if (config.validation?.oracle_validation === 'advisory' && config.validation?.eval_test_execution === 'advisory') {
    warnings.push('All validations set to advisory mode - truth reliability may be reduced');
  }

  if (config.eval_datasets?.coverage_threshold && config.eval_datasets.coverage_threshold < 0.8) {
    warnings.push('Low eval dataset coverage threshold - consider increasing for better reliability');
  }

  return { errors, warnings };
}

export default { validate };
