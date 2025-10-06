/**
 * Workflow Engine
 *
 * Main orchestrator that manages the entire workflow lifecycle.
 * Coordinates state machine, agents, validators, and phase execution.
 */

import { StateMachine } from './StateMachine.js';
import { AgentRegistry } from './AgentRegistry.js';
import { TraceabilityValidator } from './validators/TraceabilityValidator.js';
import { CoverageValidator } from './validators/CoverageValidator.js';

// Phase orchestrators
import { CodebaseDiscoveryPhase } from './phases/Phase-1_CodebaseDiscovery.js';
import { DomainResearchPhase } from './phases/Phase0_DomainResearch.js';
import { EvalFoundationPhase } from './phases/Phase1_EvalFoundation.js';
import { CompatibilityAnalysisPhase } from './phases/Phase1.5_CompatibilityAnalysis.js';
import { DiscoveryPhase } from './phases/Phase2_Discovery.js';
import { ArchitecturePhase } from './phases/Phase3_Architecture.js';
import { PlanningPhase } from './phases/Phase4_Planning.js';
import { DevelopmentPhase } from './phases/Phase5_Development.js';

export class WorkflowEngine {
  constructor(config = {}) {
    this.config = config;
    this.stateMachine = null;
    this.agentRegistry = null;
    this.validators = null;
    this.phases = new Map();
  }

  /**
   * Initialize the workflow engine
   */
  async initialize(projectType = 'greenfield') {
    console.log('🚀 Initializing BMAD Workflow Engine...\n');

    // Initialize state machine
    this.stateMachine = new StateMachine({
      projectType,
      stateFile: this.config.stateFile || '.bmad/workflow-state.json'
    });
    await this.stateMachine.initialize();

    // Initialize agent registry
    this.agentRegistry = new AgentRegistry({
      agentsPath: this.config.agentsPath || 'bmad-core/agents'
    });
    await this.agentRegistry.initialize();

    // Initialize validators
    this.validators = {
      traceability: new TraceabilityValidator(),
      coverage: new CoverageValidator()
    };

    // Register phase orchestrators
    this.registerPhases();

    console.log(`✅ Workflow engine initialized (${projectType} mode)\n`);
  }

  /**
   * Register all phase orchestrators
   */
  registerPhases() {
    this.phases.set('codebase_discovery',
      new CodebaseDiscoveryPhase(this.stateMachine, this.agentRegistry, this.validators));

    this.phases.set('domain_research',
      new DomainResearchPhase(this.stateMachine, this.agentRegistry, this.validators));

    this.phases.set('eval_foundation',
      new EvalFoundationPhase(this.stateMachine, this.agentRegistry, this.validators));

    this.phases.set('compatibility_analysis',
      new CompatibilityAnalysisPhase(this.stateMachine, this.agentRegistry, this.validators));

    this.phases.set('discovery',
      new DiscoveryPhase(this.stateMachine, this.agentRegistry, this.validators));

    this.phases.set('architecture',
      new ArchitecturePhase(this.stateMachine, this.agentRegistry, this.validators));

    this.phases.set('planning',
      new PlanningPhase(this.stateMachine, this.agentRegistry, this.validators));

    this.phases.set('development',
      new DevelopmentPhase(this.stateMachine, this.agentRegistry, this.validators));
  }

  /**
   * Execute the workflow from current state to completion
   */
  async execute() {
    console.log('🎬 Starting workflow execution...\n');

    while (true) {
      const status = this.stateMachine.getStatus();

      // Check if halted
      if (status.halted) {
        console.log('⏸️  Workflow is halted');
        break;
      }

      // Check if complete
      if (status.validTransitions.length === 0) {
        console.log('🎉 Workflow complete!');
        break;
      }

      // Execute current phase
      const currentPhase = status.currentState;
      await this.executePhase(currentPhase);
    }
  }

  /**
   * Execute a specific phase
   */
  async executePhase(phaseName) {
    const phase = this.phases.get(phaseName);

    if (!phase) {
      throw new Error(`Phase not found: ${phaseName}`);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`PHASE: ${phaseName.toUpperCase()}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      await phase.execute();
    } catch (error) {
      console.error(`\n❌ Phase ${phaseName} failed: ${error.message}\n`);
      throw error;
    }
  }

  /**
   * Execute a single phase (for testing or manual execution)
   */
  async executeSinglePhase(phaseName) {
    await this.executePhase(phaseName);
  }

  /**
   * Get workflow status
   */
  getStatus() {
    return this.stateMachine.getStatus();
  }

  /**
   * Reset workflow
   */
  async reset() {
    await this.stateMachine.reset();
    console.log('Workflow reset to initial state');
  }

  /**
   * Resume halted workflow
   */
  async resume() {
    await this.stateMachine.resume();
    console.log('Workflow resumed');
    await this.execute();
  }

  /**
   * Generate comprehensive workflow report
   */
  async generateReport() {
    const status = this.getStatus();

    const report = {
      generated: new Date().toISOString(),
      projectType: status.projectType,
      currentState: status.currentState,
      progress: status.progress,
      completedPhases: status.completedPhases,
      validationStatus: {},
      traceability: {},
      coverage: {}
    };

    // Add validation status
    for (const validator of ['oracle', 'validator', 'eval']) {
      report.validationStatus[validator] = this.stateMachine.getValidationStatus(validator);
    }

    // Generate traceability matrix
    try {
      const artifacts = [
        'domain-truth.yaml',
        'docs/prd.md',
        'docs/architecture.md'
      ];
      report.traceability = await this.validators.traceability.generateMatrix(artifacts);
    } catch (error) {
      report.traceability.error = error.message;
    }

    // Generate coverage report
    try {
      report.coverage = await this.validators.coverage.generateCoverageReport({
        domainTruth: 'domain-truth.yaml',
        domainTests: ['test-datasets/domain-examples.json'],
        prd: 'docs/prd.md',
        requirementTests: ['test-datasets/functional-tests.json']
      });
    } catch (error) {
      report.coverage.error = error.message;
    }

    // Save report
    const fs = await import('fs/promises');
    await fs.mkdir('.bmad', { recursive: true });
    await fs.writeFile('.bmad/workflow-report.json', JSON.stringify(report, null, 2));

    console.log('📊 Workflow report generated: .bmad/workflow-report.json');

    return report;
  }
}
