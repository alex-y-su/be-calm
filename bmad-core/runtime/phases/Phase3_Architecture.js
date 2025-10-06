/**
 * Phase 3: Architecture (Design Validated)
 *
 * Creates architecture with validation against domain constraints.
 * Generates integration test datasets and establishes monitoring baselines.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';

export class ArchitecturePhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const config = {
      phase: 'architecture',
      agents: ['architect', 'oracle', 'validator', 'eval', 'monitor'],

      exit_conditions: [
        'architecture_complete',
        'oracle_validation_passed',
        'all_components_have_eval_tests',
        'integration_test_datasets_created',
        'monitor_baseline_established',
        'validator_full_traceability_confirmed'
      ],

      auto_transition: {
        next_state: 'planning',
        message: 'Architecture validated. Proceeding to planning...'
      }
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
  }

  /**
   * Execute Phase 3 workflow
   */
  async executePhase() {
    console.log('Phase 3: Architecture\n');

    // Step 1: Create architecture
    await this.createArchitecture();

    // Step 2: Parallel validation
    await this.parallelArchitectureValidation();

    // Step 3: Generate architecture truth map
    await this.generateArchitectureTruthMap();

    return {
      outputs: {
        'docs/architecture.md': 'created',
        'test-datasets/integration-tests.json': 'created',
        'baselines/architecture-metrics.yaml': 'created',
        'architecture-truth-map.yaml': 'created'
      }
    };
  }

  /**
   * Step 1: Create architecture
   */
  async createArchitecture() {
    const result = await this.executeStep({
      step: 'create_architecture',
      agent: 'architect',
      task: 'create-architecture',
      inputs: ['docs/prd.md', 'domain-truth.yaml'],
      outputs: ['docs/architecture.md']
    });

    return result;
  }

  /**
   * Step 2: Parallel architecture validation
   */
  async parallelArchitectureValidation() {
    console.log('  ⚡ Running parallel architecture validation...\n');

    const promises = [
      this.oracleValidation(),
      this.generateIntegrationTests(),
      this.validatorConsistency(),
      this.createArchitectureBaseline()
    ];

    await Promise.all(promises);
  }

  /**
   * Oracle validation
   */
  async oracleValidation() {
    const result = await this.executeAgentTask('oracle', 'validate-architecture', {
      inputs: ['docs/architecture.md', 'domain-truth.yaml'],
      validates: [
        'Tech stack supports domain constraints',
        'Architecture enables eval test execution',
        'No contradictions with domain truth'
      ]
    });

    this.stateMachine.setValidationStatus('oracle', result.success);

    if (!result.success) {
      throw new Error('Oracle validation failed: Architecture conflicts with domain truth');
    }

    console.log('      ✓ Oracle: Architecture validated against domain truth');
    return result;
  }

  /**
   * Generate integration tests
   */
  async generateIntegrationTests() {
    const result = await this.executeAgentTask('eval', 'generate-integration-test-data', {
      inputs: ['docs/architecture.md', 'docs/prd.md'],
      outputs: ['test-datasets/integration-tests.json'],
      validates: 'architecture supports all eval scenarios'
    });

    await this.saveOutputs(['test-datasets/integration-tests.json'], result);

    console.log('      ✓ Eval: Integration tests generated');
    return result;
  }

  /**
   * Validator consistency
   */
  async validatorConsistency() {
    const result = await this.executeAgentTask('validator', 'validate-architecture-consistency', {
      inputs: ['docs/architecture.md', 'docs/prd.md', 'domain-truth.yaml'],
      validates: [
        'Architecture ↔ PRD consistency',
        'Architecture ↔ domain-truth alignment',
        'All NFRs addressable'
      ]
    });

    this.stateMachine.setValidationStatus('validator', result.success);

    if (!result.success) {
      throw new Error('Validator failed: Architecture inconsistent with PRD or domain truth');
    }

    console.log('      ✓ Validator: Architecture consistency confirmed');
    return result;
  }

  /**
   * Create architecture baseline
   */
  async createArchitectureBaseline() {
    const result = await this.executeAgentTask('monitor', 'create-architecture-health-baseline', {
      inputs: ['docs/architecture.md'],
      outputs: ['baselines/architecture-metrics.yaml']
    });

    await this.saveOutputs(['baselines/architecture-metrics.yaml'], result);

    console.log('      ✓ Monitor: Architecture baseline established');
    return result;
  }

  /**
   * Step 3: Generate architecture truth map
   */
  async generateArchitectureTruthMap() {
    console.log('  ▶ Generating architecture-truth-map.yaml...');

    const fs = await import('fs/promises');
    const yaml = await import('js-yaml');

    // Parse architecture for components
    const architecture = await fs.readFile('docs/architecture.md', 'utf-8');
    const components = this.extractComponents(architecture);

    // Load integration tests
    const integrationTests = await this.loadJsonFile('test-datasets/integration-tests.json');

    // Build truth map
    const truthMap = {};

    for (const component of components) {
      const relatedTests = integrationTests
        .filter(test => test.component === component.name || (test.components && test.components.includes(component.name)))
        .map(test => test.test_id);

      truthMap[`component_${component.name}`] = {
        implements: component.requirements || [],
        domain_constraint: component.constraint || 'None specified',
        eval_tests: relatedTests,
        oracle_validated: true
      };
    }

    // Save
    await fs.writeFile('architecture-truth-map.yaml', yaml.dump(truthMap));
    console.log('    ✓ architecture-truth-map.yaml created');
  }

  /**
   * Extract components from architecture
   */
  extractComponents(architecture) {
    const components = [];

    // Look for component definitions (simple pattern matching)
    const lines = architecture.split('\n');
    let currentComponent = null;

    for (const line of lines) {
      // Detect component headings
      if (line.match(/^##+ .*(Service|Component|Module|Layer)/i)) {
        if (currentComponent) components.push(currentComponent);

        currentComponent = {
          name: line.replace(/^#+\s*/, '').trim(),
          requirements: [],
          constraint: null
        };
      }

      // Extract requirements
      if (currentComponent && line.match(/(?:FR|NFR)-\d+/)) {
        const reqs = line.match(/(?:FR|NFR)-\d+/g) || [];
        currentComponent.requirements.push(...reqs);
      }
    }

    if (currentComponent) components.push(currentComponent);

    return components;
  }

  /**
   * Load JSON file
   */
  async loadJsonFile(path) {
    const fs = await import('fs/promises');
    try {
      const content = await fs.readFile(path, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }
}
