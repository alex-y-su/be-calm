/**
 * Phase 0: Domain Research (Truth Foundation)
 *
 * Establishes domain truth as the foundation for all subsequent work.
 * Creates canonical domain-truth.yaml.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';

export class DomainResearchPhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const config = {
      phase: 'domain_research',
      agents: ['domain-researcher', 'oracle'],

      exit_conditions: [
        'domain_analysis_complete',
        'oracle_truth_established',
        'domain_examples_documented'
      ],

      auto_transition: {
        next_state: 'eval_foundation',
        message: 'Domain truth established. Creating empirical validation datasets...'
      }
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
  }

  /**
   * Execute Phase 0 workflow
   */
  async executePhase() {
    console.log('Phase 0: Domain Research\n');

    // Parallel execution: primary research + background truth creation
    await this.parallelDomainResearchAndTruth();

    return {
      outputs: {
        'domain-analysis.md': 'created',
        'domain-truth.yaml': 'created'
      }
    };
  }

  /**
   * Parallel execution: domain research + oracle truth creation
   */
  async parallelDomainResearchAndTruth() {
    console.log('  ⚡ Running parallel: domain research + oracle truth creation...\n');

    // Primary: domain research
    const researchPromise = this.executeStep({
      step: 'research_domain',
      agent: 'domain-researcher',
      task: 'research-domain-context',
      outputs: ['domain-analysis.md']
    });

    // Background: oracle creates domain truth
    const truthPromise = this.executeStep({
      step: 'create_domain_truth',
      agent: 'oracle',
      task: 'create-domain-truth',
      inputs: ['domain-analysis.md'],
      outputs: ['domain-truth.yaml']
    });

    // Wait for both to complete
    const [researchResult, truthResult] = await Promise.all([
      researchPromise,
      truthPromise
    ]);

    // Validate domain truth structure
    await this.validateDomainTruthStructure('domain-truth.yaml');

    this.stateMachine.setValidationStatus('oracle', truthResult.success);

    return { research: researchResult, truth: truthResult };
  }

  /**
   * Validate domain truth YAML structure
   */
  async validateDomainTruthStructure(truthPath) {
    console.log('  🔍 Validating domain-truth.yaml structure...');

    const fs = await import('fs/promises');
    const yaml = await import('js-yaml');

    try {
      const content = await fs.readFile(truthPath, 'utf-8');
      const truth = yaml.load(content);

      // Check required sections
      const required = [
        'canonical_facts',
        'constraints',
        'domain_examples',
        'success_criteria',
        'terminology'
      ];

      for (const section of required) {
        if (!(section in truth)) {
          throw new Error(`Missing required section: ${section}`);
        }
      }

      console.log('    ✓ Domain truth structure valid');
      return true;

    } catch (error) {
      throw new Error(`Invalid domain-truth.yaml: ${error.message}`);
    }
  }
}
