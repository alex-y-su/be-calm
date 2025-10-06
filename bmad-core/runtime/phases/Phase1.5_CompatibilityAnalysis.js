/**
 * Phase 1.5: Compatibility Analysis (Brownfield Only)
 *
 * Validates domain requirements against existing system constraints.
 * Creates migration strategy for conflicts.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';

export class CompatibilityAnalysisPhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const config = {
      phase: 'compatibility_analysis',
      description: 'BROWNFIELD ONLY - Validate domain requirements against existing system constraints',
      agents: ['compatibility', 'oracle', 'validator', 'eval'],
      critical: true,

      prerequisites: [
        'existing-system-truth.yaml must exist',
        'domain-truth.yaml must exist',
        'eval test datasets must exist'
      ],

      exit_conditions: [
        'all_conflicts_identified',
        'all_conflicts_have_migration_strategies',
        'enhancement_truth_created',
        'oracle_validated_feasibility',
        'validator_confirmed_traceability',
        'migration_tests_created',
        'no_irreconcilable_conflicts'
      ],

      auto_transition: {
        next_state: 'discovery',
        message: '✓ Compatibility validated. Enhancement strategy established. Proceeding to requirements with migration awareness.'
      },

      human_checkpoint: {
        required: true,
        purpose: 'Review migration strategy and approve breaking changes',
        questions: [
          'Is the migration strategy acceptable?',
          'Are breaking changes justified and manageable?',
          'Is the timeline realistic?'
        ]
      },

      blocking_conditions: {
        irreconcilable_conflict: {
          action: 'HALT workflow',
          message: 'Domain requirement conflicts with existing system constraint. Human decision required: modify domain requirement OR accept major refactor.'
        }
      }
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
  }

  /**
   * Execute Phase 1.5 workflow
   */
  async executePhase() {
    console.log('Phase 1.5: Compatibility Analysis (Brownfield)\n');

    // Parallel analysis
    await this.parallelCompatibilityAnalysis();

    // Sequential steps
    await this.identifyConflicts();
    await this.designMigrationStrategy();
    await this.createEnhancementTruth();
    await this.validateFeasibility();
    await this.createMigrationTests();

    return {
      outputs: {
        'compatibility-conflicts.yaml': 'created',
        'migration-strategy.yaml': 'created',
        'enhancement-truth.yaml': 'created',
        'test-datasets/migration/': 'created'
      }
    };
  }

  /**
   * Parallel compatibility analysis
   */
  async parallelCompatibilityAnalysis() {
    console.log('  ⚡ Running parallel compatibility analysis...\n');

    const promises = [
      this.constraintCompatibilityAnalysis(),
      this.oracleValidationAnalysis(),
      this.testCompatibilityAnalysis()
    ];

    await Promise.all(promises);
  }

  /**
   * Constraint compatibility analysis
   */
  async constraintCompatibilityAnalysis() {
    return await this.executeStep({
      step: 'constraint_compatibility',
      agent: 'compatibility',
      task: 'validate-compatibility',
      compares: [
        'existing-system-truth.yaml constraints',
        'domain-truth.yaml requirements'
      ],
      identifies: [
        'Compatible requirements (can implement without changes)',
        'Conflicting requirements (existing vs domain mismatch)',
        'Breaking changes required',
        'Migration complexity'
      ]
    });
  }

  /**
   * Oracle validation analysis
   */
  async oracleValidationAnalysis() {
    return await this.executeStep({
      step: 'oracle_validation',
      agent: 'oracle',
      mode: 'brownfield',
      validates: [
        'Domain requirements against existing capabilities',
        'Proposed changes against existing constraints',
        'Terminology consistency across existing and domain'
      ]
    });
  }

  /**
   * Test compatibility analysis
   */
  async testCompatibilityAnalysis() {
    return await this.executeStep({
      step: 'test_compatibility',
      agent: 'eval',
      validates: [
        'Can new tests coexist with regression tests?',
        'Are there test conflicts (same input, different expected output)?',
        'Migration test scenarios feasible?'
      ]
    });
  }

  /**
   * Identify conflicts
   */
  async identifyConflicts() {
    return await this.executeStep({
      step: 'identify_conflicts',
      agent: 'compatibility',
      outputs: ['compatibility-conflicts.yaml']
    });
  }

  /**
   * Design migration strategy
   */
  async designMigrationStrategy() {
    return await this.executeStep({
      step: 'design_migration_strategy',
      agent: 'compatibility',
      task: 'analyze-migration-path',
      outputs: ['migration-strategy.yaml']
    });
  }

  /**
   * Create enhancement truth
   */
  async createEnhancementTruth() {
    const result = await this.executeStep({
      step: 'create_enhancement_truth',
      agent: 'oracle',
      mode: 'brownfield',
      task: 'validate-enhancement',
      inputs: [
        'existing-system-truth.yaml',
        'domain-truth.yaml',
        'migration-strategy.yaml'
      ],
      outputs: ['enhancement-truth.yaml']
    });

    this.stateMachine.setValidationStatus('oracle', result.success);
    return result;
  }

  /**
   * Validate feasibility
   */
  async validateFeasibility() {
    return await this.executeStep({
      step: 'validate_feasibility',
      agent: 'validator',
      validates: [
        'All conflicts have migration strategies',
        'Migration strategies are technically feasible',
        'No irreconcilable conflicts exist',
        'Traceability: existing → domain → enhancement'
      ],
      blocking: true
    });
  }

  /**
   * Create migration tests
   */
  async createMigrationTests() {
    return await this.executeStep({
      step: 'create_migration_tests',
      agent: 'eval',
      task: 'create-migration-tests',
      inputs: ['enhancement-truth.yaml', 'migration-strategy.yaml'],
      outputs: [
        'test-datasets/migration/phase-1-tests.json',
        'test-datasets/migration/phase-2-tests.json',
        'test-datasets/migration/phase-3-tests.json'
      ]
    });
  }
}
