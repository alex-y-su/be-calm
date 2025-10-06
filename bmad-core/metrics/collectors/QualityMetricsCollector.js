/**
 * Quality Metrics Collector
 * Tracks metrics related to code and process quality
 */

class QualityMetricsCollector {
  constructor(metricsCollector) {
    this.metrics = metricsCollector;
  }

  /**
   * Record bug escape rate
   * @param {number} productionBugs - Number of bugs found in production
   * @param {number} totalBugs - Total number of bugs
   */
  async recordBugEscapeRate(productionBugs, totalBugs) {
    const rate = totalBugs > 0 ? productionBugs / totalBugs : 0;
    await this.metrics.record('bug_escape_rate', rate, {
      production: productionBugs,
      total: totalBugs
    });
  }

  /**
   * Record requirements defect rate
   * @param {number} defects - Number of requirements defects
   * @param {number} totalRequirements - Total number of requirements
   */
  async recordRequirementsDefects(defects, totalRequirements) {
    const rate = totalRequirements > 0 ? defects / totalRequirements : 0;
    await this.metrics.record('requirements_defect_rate', rate, {
      defects,
      total: totalRequirements
    });
  }

  /**
   * Record architectural drift
   * @param {number} deviations - Number of deviations from design
   * @param {number} totalComponents - Total number of components
   */
  async recordArchitecturalDrift(deviations, totalComponents) {
    const drift = totalComponents > 0 ? deviations / totalComponents : 0;
    await this.metrics.record('architectural_drift', drift, {
      deviations,
      total: totalComponents
    });
  }

  /**
   * Record test coverage
   * @param {number} coverage - Test coverage percentage (0-1)
   */
  async recordTestCoverage(coverage) {
    await this.metrics.record('test_coverage', coverage);
  }

  /**
   * Record code quality score
   * @param {number} score - Code quality score (0-1)
   * @param {Object} breakdown - Quality breakdown
   */
  async recordCodeQuality(score, breakdown = {}) {
    await this.metrics.record('code_quality_score', score, breakdown);
  }
}

export default QualityMetricsCollector;
