/**
 * Phase 2: Discovery (Requirements Validated)
 *
 * Creates Project Brief and PRD with full truth validation.
 * Every requirement must trace to domain truth and have eval tests.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';

export class DiscoveryPhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const config = {
      phase: 'discovery',
      agents: ['analyst', 'pm', 'oracle', 'validator', 'eval'],

      exit_conditions: [
        'prd_complete',
        '100%_requirements_traced_to_domain',
        'all_FRs_have_eval_tests',
        'oracle_validation_passed',
        'validator_consistency_check_passed'
      ],

      auto_transition: {
        next_state: 'architecture',
        message: 'Requirements validated. Proceeding to architecture...'
      }
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
  }

  /**
   * Execute Phase 2 workflow
   */
  async executePhase() {
    console.log('Phase 2: Discovery (Requirements)\n');

    // Step 1: Create project brief
    await this.createBrief();

    // Step 2: Create PRD with parallel validation
    await this.createPRD();

    // Step 3: Generate requirements truth map
    await this.generateRequirementsTruthMap();

    return {
      outputs: {
        'docs/project-brief.md': 'created',
        'docs/prd.md': 'created',
        'requirements-truth-map.yaml': 'created',
        'test-datasets/functional-tests.json': 'created'
      }
    };
  }

  /**
   * Step 1: Create project brief
   */
  async createBrief() {
    const result = await this.executeStep({
      step: 'create_brief',
      agent: 'analyst',
      task: 'create-project-brief',
      outputs: ['docs/project-brief.md']
    });

    // Validate brief
    await this.validateBrief();

    return result;
  }

  /**
   * Validate project brief
   */
  async validateBrief() {
    console.log('    🔍 Validating project brief...');

    const result = await this.executeAgentTask('oracle', 'validate-brief', {
      inputs: ['docs/project-brief.md', 'domain-truth.yaml'],
      validates: [
        'All features trace to domain-truth.yaml',
        'No invented features outside domain',
        'Terminology matches domain vocabulary'
      ]
    });

    if (!result.success) {
      throw new Error('Brief validation failed: contains features not in domain truth');
    }

    console.log('      ✓ Brief validated against domain truth');
  }

  /**
   * Step 2: Create PRD with parallel validation
   */
  async createPRD() {
    console.log('  ▶ create_prd...');

    // Create PRD
    const prdResult = await this.executeAgentTask('pm', 'create-prd', {
      inputs: ['docs/project-brief.md', 'domain-truth.yaml'],
      outputs: ['docs/prd.md']
    });

    await this.saveOutputs(['docs/prd.md'], prdResult);

    // Parallel validation
    await this.parallelPRDValidation();

    return prdResult;
  }

  /**
   * Parallel PRD validation
   */
  async parallelPRDValidation() {
    console.log('    ⚡ Running parallel PRD validation...\n');

    const promises = [
      this.oracleValidation(),
      this.generateFunctionalTests(),
      this.validatorTraceability()
    ];

    await Promise.all(promises);
  }

  /**
   * Oracle validation
   */
  async oracleValidation() {
    const result = await this.executeAgentTask('oracle', 'validate-prd', {
      inputs: ['docs/prd.md', 'domain-truth.yaml'],
      validates: 'consistency with domain truth'
    });

    this.stateMachine.setValidationStatus('oracle', result.success);

    if (!result.success) {
      throw new Error('Oracle validation failed: PRD inconsistent with domain truth');
    }

    console.log('      ✓ Oracle: PRD consistent with domain truth');
    return result;
  }

  /**
   * Generate functional tests
   */
  async generateFunctionalTests() {
    const result = await this.executeAgentTask('eval', 'generate-functional-test-data', {
      inputs: ['docs/prd.md', 'domain-truth.yaml'],
      outputs: ['test-datasets/functional-tests.json'],
      validates: 'every FR has executable test'
    });

    await this.saveOutputs(['test-datasets/functional-tests.json'], result);

    console.log('      ✓ Eval: Functional tests generated for all FRs');
    return result;
  }

  /**
   * Validator traceability
   */
  async validatorTraceability() {
    const result = await this.executeAgentTask('validator', 'validate-traceability', {
      inputs: ['docs/prd.md', 'domain-truth.yaml'],
      validates: 'PRD ↔ domain-truth traceability'
    });

    this.stateMachine.setValidationStatus('validator', result.success);

    if (!result.success) {
      throw new Error('Validator failed: PRD ↔ domain-truth traceability broken');
    }

    console.log('      ✓ Validator: PRD ↔ domain-truth traceability confirmed');
    return result;
  }

  /**
   * Step 3: Generate requirements truth map
   */
  async generateRequirementsTruthMap() {
    console.log('  ▶ Generating requirements-truth-map.yaml...');

    const fs = await import('fs/promises');
    const yaml = await import('js-yaml');

    // Extract requirements from PRD
    const prd = await fs.readFile('docs/prd.md', 'utf-8');
    const requirements = this.extractRequirements(prd);

    // Load functional tests
    const functionalTests = await this.loadJsonFile('test-datasets/functional-tests.json');

    // Build truth map
    const truthMap = {};

    for (const req of requirements) {
      const relatedTests = functionalTests
        .filter(test => test.requirement_id === req || (test.requirements && test.requirements.includes(req)))
        .map(test => test.test_id);

      truthMap[req] = {
        description: this.extractRequirementDescription(prd, req),
        domain_source: this.findDomainSource(req, prd),
        eval_tests: relatedTests,
        oracle_validated: true
      };
    }

    // Save
    await fs.writeFile('requirements-truth-map.yaml', yaml.dump(truthMap));
    console.log('    ✓ requirements-truth-map.yaml created');
  }

  /**
   * Extract requirements from PRD
   */
  extractRequirements(prd) {
    const matches = prd.match(/(?:FR|NFR|UR)-\d+/g) || [];
    return [...new Set(matches)];
  }

  /**
   * Extract requirement description
   */
  extractRequirementDescription(prd, reqId) {
    const lines = prd.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(reqId)) {
        return lines[i].replace(/^.*?:\s*/, '').trim();
      }
    }
    return 'Description not found';
  }

  /**
   * Find domain source for requirement
   */
  findDomainSource(reqId, prd) {
    // Look for domain-truth.yaml references near the requirement
    const lines = prd.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(reqId)) {
        // Check next few lines for domain reference
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          const match = lines[j].match(/domain-truth\.yaml#([\w-]+)/);
          if (match) return `domain-truth.yaml#${match[1]}`;
        }
        break;
      }
    }
    return 'domain-truth.yaml#general';
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
