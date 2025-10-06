/**
 * Phase 1: Eval Foundation (Test-First)
 *
 * Creates test datasets BEFORE requirements - establishes empirical truth.
 * Ensures every domain fact has corresponding test cases.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';

export class EvalFoundationPhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const isBrownfield = stateMachine.projectType === 'brownfield';

    const config = {
      phase: 'eval_foundation',
      description: 'Create test datasets BEFORE requirements - establish empirical truth',
      agents: ['eval', 'oracle', 'validator'],
      critical: true,

      prerequisites: [
        'domain-truth.yaml must exist',
        'domain-analysis.md validated'
      ],

      exit_conditions: [
        'all_domain_facts_have_tests',
        'test_datasets_validated',
        'oracle_approved',
        '100%_coverage_threshold'
      ],

      auto_transition: {
        next_state: isBrownfield ? 'compatibility_analysis' : 'discovery',
        message: '✓ Empirical truth established. All code must pass these tests.'
      }
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
  }

  /**
   * Execute Phase 1 workflow
   */
  async executePhase() {
    console.log('Phase 1: Eval Foundation (Test-First)\n');

    // Step 1: Create domain test cases
    await this.createDomainTestCases();

    // Step 2: Validate test coverage
    await this.validateTestCoverage();

    // Step 3: Oracle approval
    await this.oracleApproval();

    return {
      outputs: {
        'test-datasets/domain-examples.json': 'created',
        'test-datasets/constraint-tests.yaml': 'created',
        'test-datasets/edge-cases.json': 'created',
        'eval-criteria.yaml': 'created'
      }
    };
  }

  /**
   * Step 1: Create domain test cases
   */
  async createDomainTestCases() {
    const result = await this.executeStep({
      step: 'create_domain_test_cases',
      agent: 'eval',
      task: 'create-eval-dataset',
      inputs: ['domain-truth.yaml', 'domain-analysis.md'],
      outputs: [
        'test-datasets/domain-examples.json',
        'test-datasets/constraint-tests.yaml',
        'test-datasets/edge-cases.json'
      ]
    });

    // Generate eval-criteria.yaml
    await this.generateEvalCriteria();

    return result;
  }

  /**
   * Step 2: Validate test coverage
   */
  async validateTestCoverage() {
    console.log('  ▶ validate_test_coverage...');

    const testDatasets = [
      'test-datasets/domain-examples.json',
      'test-datasets/constraint-tests.yaml',
      'test-datasets/edge-cases.json'
    ];

    try {
      await this.validators.coverage.validateDomainFactCoverage(
        'domain-truth.yaml',
        testDatasets
      );

      console.log('    ✓ All domain facts have test cases');
      return { success: true };

    } catch (error) {
      console.error('    ❌ Test coverage validation failed (blocking)');
      throw error;
    }
  }

  /**
   * Step 3: Oracle approval
   */
  async oracleApproval() {
    const result = await this.executeStep({
      step: 'oracle_approval',
      agent: 'oracle',
      validates: 'test datasets match domain truth',
      blocking: true
    });

    this.stateMachine.setValidationStatus('oracle', result.success);

    if (!result.success) {
      throw new Error('Oracle approval failed: test datasets do not match domain truth');
    }

    return result;
  }

  /**
   * Generate eval-criteria.yaml
   */
  async generateEvalCriteria() {
    console.log('    📄 Generating eval-criteria.yaml...');

    const fs = await import('fs/promises');
    const yaml = await import('js-yaml');

    // Load existing tests
    const domainTests = await this.loadJsonFile('test-datasets/domain-examples.json');
    const constraintTests = await this.loadYamlFile('test-datasets/constraint-tests.yaml');

    // Create eval criteria structure
    const evalCriteria = {
      generated: new Date().toISOString(),
      domain_tests: domainTests.map((test, index) => ({
        test_id: test.test_id || `DOM-${String(index + 1).padStart(3, '0')}`,
        description: test.description,
        input: test.input,
        expected_output: test.expected_output,
        source: test.source || 'domain-truth.yaml#domain'
      })),
      constraint_tests: constraintTests.map((test, index) => ({
        test_id: test.test_id || `CON-${String(index + 1).padStart(3, '0')}`,
        description: test.description,
        input: test.input,
        expected_output: test.expected_output,
        source: test.source || 'domain-truth.yaml#constraints'
      }))
    };

    // Save
    await fs.writeFile('eval-criteria.yaml', yaml.dump(evalCriteria));
    console.log('      ✓ eval-criteria.yaml created');
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

  /**
   * Load YAML file
   */
  async loadYamlFile(path) {
    const fs = await import('fs/promises');
    const yaml = await import('js-yaml');
    try {
      const content = await fs.readFile(path, 'utf-8');
      return yaml.load(content) || [];
    } catch {
      return [];
    }
  }
}
