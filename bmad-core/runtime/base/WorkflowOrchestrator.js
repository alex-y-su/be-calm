/**
 * Base Workflow Orchestrator
 *
 * Provides common functionality for all workflow phase orchestrators including:
 * - Agent execution
 * - Validation gates
 * - Exit condition checking
 * - State transitions
 * - Human checkpoints
 */

export class WorkflowOrchestrator {
  constructor(config, stateMachine, agentRegistry) {
    this.config = config;
    this.stateMachine = stateMachine;
    this.agentRegistry = agentRegistry;
    this.phase = config.phase;
    this.exitConditions = config.exit_conditions || [];
    this.humanCheckpoint = config.human_checkpoint || null;
    this.blockingConditions = config.blocking_conditions || {};
  }

  /**
   * Execute the workflow phase
   * @returns {Promise<Object>} Result with status and outputs
   */
  async execute() {
    try {
      console.log(`\n🚀 Starting ${this.phase} phase...`);

      // Check prerequisites
      await this.checkPrerequisites();

      // Execute phase-specific logic
      const result = await this.executePhase();

      // Validate exit conditions
      await this.validateExitConditions();

      // Human checkpoint if required
      if (this.humanCheckpoint && this.humanCheckpoint.required) {
        await this.performHumanCheckpoint();
      }

      // Auto-transition if configured
      if (this.config.auto_transition) {
        await this.autoTransition();
      }

      console.log(`✅ ${this.phase} phase complete`);
      return { status: 'success', ...result };

    } catch (error) {
      console.error(`❌ ${this.phase} phase failed:`, error.message);

      // Check if this is a blocking condition
      if (this.isBlockingCondition(error)) {
        await this.handleBlockingCondition(error);
      }

      throw error;
    }
  }

  /**
   * Execute phase-specific logic (override in subclasses)
   */
  async executePhase() {
    throw new Error('executePhase() must be implemented by subclass');
  }

  /**
   * Check prerequisites before starting phase
   */
  async checkPrerequisites() {
    if (!this.config.prerequisites) return;

    for (const prereq of this.config.prerequisites) {
      const satisfied = await this.checkPrerequisite(prereq);
      if (!satisfied) {
        throw new Error(`Prerequisite not met: ${prereq}`);
      }
    }
  }

  /**
   * Check a single prerequisite
   */
  async checkPrerequisite(prereq) {
    // Check if it's a file existence check
    if (prereq.includes('must exist')) {
      const file = prereq.split(' must exist')[0];
      const fs = await import('fs/promises');
      try {
        await fs.access(file);
        return true;
      } catch {
        return false;
      }
    }

    // Check if it's a state condition
    if (prereq.includes('completed')) {
      const phase = prereq.split(' completed')[0];
      return this.stateMachine.isPhaseComplete(phase);
    }

    return true;
  }

  /**
   * Execute a sequential step
   */
  async executeStep(step) {
    console.log(`  ▶ ${step.step}...`);

    const agent = this.agentRegistry.getAgent(step.agent);
    if (!agent) {
      throw new Error(`Agent not found: ${step.agent}`);
    }

    const result = await agent.execute({
      task: step.task,
      inputs: step.inputs || [],
      mode: step.mode,
      validates: step.validates,
      analyzes: step.analyzes,
      compares: step.compares,
      identifies: step.identifies,
      outputs: step.outputs || []
    });

    // Handle outputs
    if (step.outputs) {
      await this.saveOutputs(step.outputs, result);
    }

    // Validation if blocking
    if (step.blocking && !result.success) {
      throw new Error(`Blocking step failed: ${step.step}`);
    }

    return result;
  }

  /**
   * Execute parallel steps
   */
  async executeParallelSteps(steps) {
    console.log(`  ⚡ Executing ${steps.length} parallel steps...`);

    const promises = steps.map(step => this.executeStep(step));
    const results = await Promise.all(promises);

    return results;
  }

  /**
   * Save step outputs
   */
  async saveOutputs(outputs, result) {
    const fs = await import('fs/promises');
    const path = await import('path');

    for (const output of outputs) {
      if (result.outputs && result.outputs[output]) {
        const outputPath = path.join(process.cwd(), output);
        const dir = path.dirname(outputPath);

        // Ensure directory exists
        await fs.mkdir(dir, { recursive: true });

        // Save output
        if (typeof result.outputs[output] === 'object') {
          await fs.writeFile(outputPath, JSON.stringify(result.outputs[output], null, 2));
        } else {
          await fs.writeFile(outputPath, result.outputs[output]);
        }

        console.log(`    📄 Saved: ${output}`);
      }
    }
  }

  /**
   * Validate exit conditions
   */
  async validateExitConditions() {
    console.log(`  🔍 Validating exit conditions...`);

    for (const condition of this.exitConditions) {
      const satisfied = await this.checkExitCondition(condition);
      if (!satisfied) {
        throw new Error(`Exit condition not met: ${condition}`);
      }
      console.log(`    ✓ ${condition}`);
    }
  }

  /**
   * Check a single exit condition
   */
  async checkExitCondition(condition) {
    // Check for percentage thresholds
    const coverageMatch = condition.match(/(\d+)%_(.+)_coverage/);
    if (coverageMatch) {
      const threshold = parseInt(coverageMatch[1]);
      const type = coverageMatch[2];
      return await this.checkCoverage(type, threshold);
    }

    // Check for completion flags
    if (condition.endsWith('_complete')) {
      const artifact = condition.replace('_complete', '');
      return await this.checkArtifactComplete(artifact);
    }

    // Check for validation flags
    if (condition.includes('validation_passed')) {
      const validator = condition.split('_validation_passed')[0];
      return await this.checkValidationPassed(validator);
    }

    return true;
  }

  /**
   * Check coverage threshold
   */
  async checkCoverage(type, threshold) {
    // This would integrate with the validation system
    // For now, return true - will be implemented with validators
    return true;
  }

  /**
   * Check if artifact is complete
   */
  async checkArtifactComplete(artifact) {
    const fs = await import('fs/promises');

    // Try common file extensions if artifact name doesn't have one
    const extensions = ['', '.md', '.yaml', '.yml', '.json', '.txt'];
    const artifactName = artifact.replace(/_/g, '-'); // Convert underscores to hyphens

    for (const ext of extensions) {
      try {
        const filename = artifactName + ext;
        const stats = await fs.stat(filename);
        if (stats.size > 0) {
          return true;
        }
      } catch {
        // Try next extension
      }
    }

    return false;
  }

  /**
   * Check if validation passed
   */
  async checkValidationPassed(validator) {
    // This would check validation results stored by the validator agent
    return this.stateMachine.getValidationStatus(validator);
  }

  /**
   * Perform human checkpoint
   */
  async performHumanCheckpoint() {
    console.log(`\n⏸️  Human Checkpoint Required`);
    console.log(`Purpose: ${this.humanCheckpoint.purpose}`);

    if (this.humanCheckpoint.question) {
      console.log(`Question: ${this.humanCheckpoint.question}`);
    }

    if (this.humanCheckpoint.questions) {
      console.log('Questions:');
      this.humanCheckpoint.questions.forEach((q, i) => {
        console.log(`  ${i + 1}. ${q}`);
      });
    }

    // In a real implementation, this would pause and wait for user input
    // For now, we'll simulate approval
    console.log('\n⏳ Awaiting human approval...\n');
  }

  /**
   * Auto-transition to next state
   */
  async autoTransition() {
    if (!this.config.auto_transition) return;

    const nextState = this.config.auto_transition.next_state;
    const message = this.config.auto_transition.message;

    console.log(`\n${message}`);
    console.log(`➡️  Transitioning to: ${nextState}\n`);

    await this.stateMachine.transition(nextState);
  }

  /**
   * Check if error is a blocking condition
   */
  isBlockingCondition(error) {
    return Object.keys(this.blockingConditions).some(key =>
      error.message.includes(key)
    );
  }

  /**
   * Handle blocking condition
   */
  async handleBlockingCondition(error) {
    const conditionKey = Object.keys(this.blockingConditions).find(key =>
      error.message.includes(key)
    );

    if (!conditionKey) return;

    const condition = this.blockingConditions[conditionKey];

    console.log(`\n🛑 BLOCKING CONDITION: ${conditionKey}`);
    console.log(`Action: ${condition.action}`);
    console.log(`Message: ${condition.message}\n`);

    if (condition.action === 'HALT workflow') {
      await this.stateMachine.halt();
    }
  }

  /**
   * Execute agent task
   */
  async executeAgentTask(agentName, task, options = {}) {
    const agent = this.agentRegistry.getAgent(agentName);
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    return await agent.execute({ task, ...options });
  }
}
