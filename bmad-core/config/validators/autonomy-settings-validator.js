/**
 * Autonomy Settings Validator
 */

function validate(config) {
  const errors = [];
  const warnings = [];

  // Validate level
  const validLevels = ['conservative', 'balanced', 'aggressive', 'full_auto'];
  if (!validLevels.includes(config.level)) {
    errors.push(`Invalid autonomy level: ${config.level}. Must be one of: ${validLevels.join(', ')}`);
  }

  // Validate auto_agent_switching
  if (config.auto_agent_switching) {
    if (typeof config.auto_agent_switching.enabled !== 'boolean') {
      errors.push('auto_agent_switching.enabled must be a boolean');
    }
    if (config.auto_agent_switching.confidence_threshold &&
        (config.auto_agent_switching.confidence_threshold < 0 || config.auto_agent_switching.confidence_threshold > 1)) {
      errors.push('auto_agent_switching.confidence_threshold must be between 0 and 1');
    }
  }

  // Validate background_agents
  if (config.background_agents) {
    if (typeof config.background_agents.enabled !== 'boolean') {
      errors.push('background_agents.enabled must be a boolean');
    }
    if (config.background_agents.max_concurrent && config.background_agents.max_concurrent < 1 && config.background_agents.max_concurrent !== -1) {
      errors.push('background_agents.max_concurrent must be >= 1 or -1 for unlimited');
    }
  }

  // Validate predictive_suggestions
  if (config.predictive_suggestions) {
    if (config.predictive_suggestions.auto_accept_threshold &&
        (config.predictive_suggestions.auto_accept_threshold < 0 || config.predictive_suggestions.auto_accept_threshold > 1)) {
      errors.push('predictive_suggestions.auto_accept_threshold must be between 0 and 1');
    }
  }

  // Validate goal_mode
  if (config.goal_mode) {
    const validCheckpoints = ['none', 'minimal', 'major_milestones_only', 'all'];
    if (config.goal_mode.checkpoint_approval && !validCheckpoints.includes(config.goal_mode.checkpoint_approval)) {
      errors.push(`goal_mode.checkpoint_approval must be one of: ${validCheckpoints.join(', ')}`);
    }
  }

  // Warnings for potentially risky configurations
  if (config.level === 'full_auto') {
    warnings.push('full_auto autonomy level provides maximum automation - use with caution');
  }

  if (config.auto_command_execution?.enabled && config.auto_command_execution.blacklist?.length === 0) {
    warnings.push('auto_command_execution enabled with no blacklist - consider adding safety restrictions');
  }

  return { errors, warnings };
}

export default { validate };
