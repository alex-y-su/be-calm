/**
 * Autonomy Metrics Collector
 * Tracks metrics related to autonomous behavior and automation
 */

class AutonomyMetricsCollector {
  constructor(metricsCollector) {
    this.metrics = metricsCollector;
    this.agentSwitches = { automated: 0, manual: 0 };
    this.humanInterventions = 0;
    this.workflowStartTime = null;
  }

  /**
   * Record agent switch
   * @param {boolean} automated - Whether switch was automated
   */
  async recordAgentSwitch(automated) {
    if (automated) {
      this.agentSwitches.automated++;
    } else {
      this.agentSwitches.manual++;
    }

    const total = this.agentSwitches.automated + this.agentSwitches.manual;
    const rate = total > 0 ? this.agentSwitches.automated / total : 0;

    await this.metrics.record('agent_switch_automation_rate', rate, { automated });
  }

  /**
   * Record human intervention
   * @param {string} reason - Reason for intervention
   */
  async recordHumanIntervention(reason) {
    this.humanInterventions++;
    await this.metrics.record('human_intervention_rate', this.humanInterventions, { reason });
  }

  /**
   * Start workflow timer
   */
  startWorkflow() {
    this.workflowStartTime = Date.now();
  }

  /**
   * End workflow and record completion time
   */
  async endWorkflow() {
    if (!this.workflowStartTime) return;

    const duration = Date.now() - this.workflowStartTime;
    await this.metrics.record('workflow_completion_time', duration);
    this.workflowStartTime = null;
  }

  /**
   * Record agent utilization
   * @param {number} activeAgents - Number of active agents
   * @param {number} totalAgents - Total number of available agents
   */
  async recordAgentUtilization(activeAgents, totalAgents) {
    const utilization = totalAgents > 0 ? activeAgents / totalAgents : 0;
    await this.metrics.record('agent_utilization', utilization, {
      active: activeAgents,
      total: totalAgents
    });
  }

  /**
   * Record parallel execution rate
   * @param {number} parallelTasks - Number of tasks running in parallel
   * @param {number} totalTasks - Total number of tasks
   */
  async recordParallelExecution(parallelTasks, totalTasks) {
    const rate = totalTasks > 0 ? parallelTasks / totalTasks : 0;
    await this.metrics.record('parallel_execution_rate', rate, {
      parallel: parallelTasks,
      total: totalTasks
    });
  }
}

export default AutonomyMetricsCollector;
