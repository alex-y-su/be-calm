/**
 * Learning Metrics Collector
 * Tracks metrics related to system learning and improvement
 */

class LearningMetricsCollector {
  constructor(metricsCollector) {
    this.metrics = metricsCollector;
  }

  /**
   * Record reflection insights
   * @param {number} insights - Number of actionable insights
   * @param {string} sprint - Sprint identifier
   */
  async recordReflectionInsights(insights, sprint) {
    await this.metrics.record('reflection_insights_per_sprint', insights, { sprint });
  }

  /**
   * Record process optimization
   * @param {number} efficiencyGain - Efficiency gain percentage (0-1)
   * @param {string} area - Area of optimization
   */
  async recordProcessOptimization(efficiencyGain, area) {
    await this.metrics.record('process_optimization_rate', efficiencyGain, { area });
  }

  /**
   * Record agent improvement
   * @param {string} agent - Agent name
   * @param {number} accuracyBefore - Previous accuracy
   * @param {number} accuracyAfter - New accuracy
   */
  async recordAgentImprovement(agent, accuracyBefore, accuracyAfter) {
    const improvement = accuracyAfter - accuracyBefore;
    await this.metrics.record('agent_improvement_rate', improvement, {
      agent,
      before: accuracyBefore,
      after: accuracyAfter
    });
  }

  /**
   * Record pattern library growth
   * @param {number} patterns - Number of patterns learned
   */
  async recordPatternLibrary(patterns) {
    await this.metrics.record('pattern_library_size', patterns);
  }

  /**
   * Record failure analysis
   * @param {string} failureType - Type of failure
   * @param {string} rootCause - Root cause
   * @param {string} resolution - How it was resolved
   */
  async recordFailureAnalysis(failureType, rootCause, resolution) {
    await this.metrics.record('failure_analyzed', 1, {
      type: failureType,
      cause: rootCause,
      resolution
    });
  }
}

export default LearningMetricsCollector;
