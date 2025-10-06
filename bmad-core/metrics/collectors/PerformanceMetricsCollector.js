/**
 * Performance Metrics Collector
 * Tracks metrics related to system performance
 */

class PerformanceMetricsCollector {
  constructor(metricsCollector) {
    this.metrics = metricsCollector;
    this.phaseStartTimes = new Map();
  }

  /**
   * Start phase timer
   * @param {string} phase - Phase name
   */
  startPhase(phase) {
    this.phaseStartTimes.set(phase, Date.now());
  }

  /**
   * End phase and record duration
   * @param {string} phase - Phase name
   */
  async endPhase(phase) {
    const startTime = this.phaseStartTimes.get(phase);
    if (!startTime) return;

    const duration = Date.now() - startTime;
    await this.metrics.record('phase_duration', duration, { phase });
    this.phaseStartTimes.delete(phase);
  }

  /**
   * Record validation gate time
   * @param {string} gate - Gate name
   * @param {number} duration - Duration in milliseconds
   */
  async recordValidationGateTime(gate, duration) {
    await this.metrics.record('validation_gate_time', duration, { gate });
  }

  /**
   * Record agent response time
   * @param {string} agent - Agent name
   * @param {number} latency - Latency in milliseconds
   */
  async recordAgentResponseTime(agent, latency) {
    await this.metrics.record('agent_response_time', latency, { agent });
  }

  /**
   * Record resource utilization
   * @param {Object} resources - Resource usage (cpu, memory)
   */
  async recordResourceUtilization(resources) {
    if (resources.cpu !== undefined) {
      await this.metrics.record('cpu_utilization', resources.cpu);
    }
    if (resources.memory !== undefined) {
      await this.metrics.record('memory_utilization', resources.memory);
    }
  }

  /**
   * Start monitoring system resources
   */
  startResourceMonitoring(interval = 60000) {
    this.resourceMonitorInterval = setInterval(async () => {
      const usage = process.memoryUsage();
      await this.recordResourceUtilization({
        memory: usage.heapUsed / usage.heapTotal
      });
    }, interval);
  }

  /**
   * Stop monitoring system resources
   */
  stopResourceMonitoring() {
    if (this.resourceMonitorInterval) {
      clearInterval(this.resourceMonitorInterval);
    }
  }
}

export default PerformanceMetricsCollector;
