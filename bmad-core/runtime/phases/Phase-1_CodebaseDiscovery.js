/**
 * Phase -1: Codebase Discovery (Brownfield Only)
 *
 * Establishes existing system truth before domain research.
 * Creates regression test baselines and identifies constraints.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';

export class CodebaseDiscoveryPhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const config = {
      phase: 'codebase_discovery',
      description: 'BROWNFIELD ONLY - Establish existing system truth before domain research',
      agents: ['compatibility', 'bmad-master', 'oracle', 'eval'],
      critical: true,

      prerequisites: [],

      exit_conditions: [
        'existing_codebase_fully_documented',
        'existing_patterns_extracted_and_validated',
        'regression_test_baselines_created',
        'integration_points_mapped',
        'constraints_identified',
        'oracle_validation_passed',
        '100%_integration_point_test_coverage'
      ],

      auto_transition: {
        next_state: 'domain_research',
        message: '✓ Existing system truth established. Proceeding to domain research with compatibility awareness.'
      },

      human_checkpoint: {
        required: true,
        purpose: 'Review existing-system-truth.yaml for accuracy',
        question: 'Does this accurately represent the current system constraints and capabilities?'
      }
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
  }

  /**
   * Execute Phase -1 workflow
   */
  async executePhase() {
    console.log('Phase -1: Codebase Discovery (Brownfield)\n');

    // Step 1: Analyze existing codebase
    await this.analyzeExistingCodebase();

    // Step 2: Extract existing patterns
    await this.extractExistingPatterns();

    // Step 3: Oracle validation
    await this.oracleValidation();

    // Step 4: Create regression baselines
    await this.createRegressionBaselines();

    // Step 5: Validate regression coverage
    await this.validateRegressionCoverage();

    return {
      outputs: {
        'docs/existing-system-analysis.md': 'created',
        'docs/tech-stack.md': 'created',
        'docs/api-inventory.md': 'created',
        'docs/architecture-current-state.md': 'created',
        'existing-system-truth.yaml': 'created',
        'test-datasets/regression/': 'created'
      }
    };
  }

  /**
   * Step 1: Analyze existing codebase
   */
  async analyzeExistingCodebase() {
    const result = await this.executeStep({
      step: 'analyze_existing_codebase',
      agent: 'bmad-master',
      task: 'document-project',
      outputs: [
        'docs/existing-system-analysis.md',
        'docs/tech-stack.md',
        'docs/api-inventory.md',
        'docs/architecture-current-state.md'
      ]
    });

    return result;
  }

  /**
   * Step 2: Extract existing patterns
   */
  async extractExistingPatterns() {
    const result = await this.executeStep({
      step: 'extract_existing_patterns',
      agent: 'compatibility',
      task: 'analyze-existing-system',
      analyzes: [
        'Current architecture patterns',
        'Existing constraints and limitations',
        'Integration points (internal and external)',
        'Tech stack capabilities and limitations',
        'Performance baselines',
        'Security patterns',
        'Data models and schemas'
      ],
      outputs: ['existing-system-truth.yaml']
    });

    return result;
  }

  /**
   * Step 3: Oracle validation
   */
  async oracleValidation() {
    const result = await this.executeStep({
      step: 'oracle_validation',
      agent: 'oracle',
      mode: 'brownfield',
      task: 'create-existing-truth',
      validates: 'Extracted facts are accurate',
      blocking: true
    });

    this.stateMachine.setValidationStatus('oracle', result.success);
    return result;
  }

  /**
   * Step 4: Create regression baselines
   */
  async createRegressionBaselines() {
    const result = await this.executeStep({
      step: 'create_regression_baselines',
      agent: 'eval',
      task: 'create-regression-dataset',
      inputs: ['existing-system-truth.yaml', 'docs/api-inventory.md'],
      outputs: [
        'test-datasets/regression/api-behavior.json',
        'test-datasets/regression/integration-points.json',
        'test-datasets/regression/business-logic.json',
        'test-datasets/regression/data-integrity.json'
      ]
    });

    return result;
  }

  /**
   * Step 5: Validate regression coverage
   */
  async validateRegressionCoverage() {
    console.log('  ▶ validate_regression_coverage...');

    const regressionTests = [
      'test-datasets/regression/api-behavior.json',
      'test-datasets/regression/integration-points.json',
      'test-datasets/regression/business-logic.json',
      'test-datasets/regression/data-integrity.json'
    ];

    try {
      await this.validators.coverage.validateIntegrationPointCoverage(
        'existing-system-truth.yaml',
        regressionTests
      );

      console.log('    ✓ 100% integration point test coverage achieved');
      return { success: true };

    } catch (error) {
      console.error('    ❌ Integration point coverage validation failed');
      throw error;
    }
  }
}
