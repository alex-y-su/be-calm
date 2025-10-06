/**
 * Truth Metrics Collector
 * Tracks metrics related to domain truth and validation
 */

class TruthMetricsCollector {
  constructor(metricsCollector) {
    this.metrics = metricsCollector;
  }

  /**
   * Record domain coverage
   * @param {number} factsWithTests - Number of domain facts with eval tests
   * @param {number} totalFacts - Total number of domain facts
   */
  async recordDomainCoverage(factsWithTests, totalFacts) {
    const coverage = totalFacts > 0 ? factsWithTests / totalFacts : 0;
    await this.metrics.record('domain_coverage', coverage, {
      covered: factsWithTests,
      total: totalFacts
    });
  }

  /**
   * Record traceability score
   * @param {number} tracedCode - Amount of code traced to domain truth
   * @param {number} totalCode - Total amount of code
   */
  async recordTraceability(tracedCode, totalCode) {
    const score = totalCode > 0 ? tracedCode / totalCode : 0;
    await this.metrics.record('traceability_score', score, {
      traced: tracedCode,
      total: totalCode
    });
  }

  /**
   * Record eval test results
   * @param {number} passed - Number of tests passed
   * @param {number} total - Total number of tests
   */
  async recordEvalTests(passed, total) {
    const passRate = total > 0 ? passed / total : 0;
    await this.metrics.record('eval_pass_rate', passRate, {
      passed,
      failed: total - passed,
      total
    });
  }

  /**
   * Record drift detection
   * @param {boolean} driftDetected - Whether drift was detected
   * @param {string} type - Type of drift
   */
  async recordDriftDetection(driftDetected, type) {
    await this.metrics.record('drift_detected', driftDetected ? 1 : 0, { type });
  }

  /**
   * Record oracle accuracy
   * @param {boolean} correct - Whether oracle was correct
   * @param {string} validationType - Type of validation
   */
  async recordOracleAccuracy(correct, validationType) {
    await this.metrics.record('oracle_validation', correct ? 1 : 0, {
      type: validationType
    });
  }

  /**
   * Calculate and record overall oracle accuracy
   */
  async calculateOracleAccuracy() {
    const validations = await this.metrics.get('oracle_validation', {
      startTime: Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
    });

    if (validations.length === 0) return;

    const correct = validations.filter(v => v.value === 1).length;
    const accuracy = correct / validations.length;

    await this.metrics.record('oracle_accuracy', accuracy, {
      correct,
      total: validations.length
    });
  }
}

export default TruthMetricsCollector;
