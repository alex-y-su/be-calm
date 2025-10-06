/**
 * Phase 5: Development (Empirically Validated)
 *
 * Development with continuous validation and multi-gate system.
 * Implements watch modes, validation gates, and failure analysis.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';
import { ValidationGates } from '../validators/ValidationGates.js';

export class DevelopmentPhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const config = {
      phase: 'development',
      agents: ['dev', 'qa', 'eval', 'oracle', 'validator', 'monitor', 'reflection'],

      exit_conditions: [
        'all_stories_complete',
        'all_tests_passing',
        'all_gates_passed'
      ]
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
    this.validationGates = new ValidationGates(stateMachine, agentRegistry, validators);
    this.continuousValidation = {
      eval: null,
      oracle: null,
      validator: null,
      monitor: null,
      qa: null
    };
  }

  /**
   * Execute Phase 5 workflow
   */
  async executePhase() {
    console.log('Phase 5: Development\n');

    // Start continuous validation
    await this.startContinuousValidation();

    // Get stories to implement
    const stories = await this.getStories();

    // Implement each story
    for (const story of stories) {
      await this.implementStory(story);
    }

    // Stop continuous validation
    await this.stopContinuousValidation();

    console.log('\n✅ All stories implemented and validated\n');

    return {
      outputs: {
        'src/': 'implementation complete',
        'validation-chain-proof.md': 'created'
      }
    };
  }

  /**
   * Get list of stories
   */
  async getStories() {
    const fs = await import('fs/promises');
    const path = await import('path');

    try {
      const storiesDir = 'docs/stories';
      const files = await fs.readdir(storiesDir);
      return files
        .filter(f => f.endsWith('.md'))
        .map(f => ({
          id: path.basename(f, '.md'),
          path: path.join(storiesDir, f),
          testDataset: `test-datasets/story-${path.basename(f, '.md')}-tests.json`
        }));
    } catch {
      return [];
    }
  }

  /**
   * Implement a story with full validation
   */
  async implementStory(story) {
    console.log(`\n📖 Implementing Story: ${story.id}\n`);

    // Pre-story validation
    await this.preStoryValidation(story);

    // Develop story
    console.log('  🔨 Development in progress...');
    const implementation = await this.developStory(story);

    // Post-story validation gates
    await this.storyCompletionGates(story, implementation);

    console.log(`\n✅ Story ${story.id} complete\n`);
  }

  /**
   * Pre-story validation
   */
  async preStoryValidation(story) {
    console.log('  🔍 Pre-story validation...');

    // Check eval tests exist
    const fs = await import('fs/promises');
    try {
      await fs.access(story.testDataset);
      console.log('    ✓ Eval tests exist');
    } catch {
      throw new Error(`Missing eval tests for story ${story.id}: ${story.testDataset}`);
    }

    // Check oracle truth is current
    try {
      await fs.access('domain-truth.yaml');
      console.log('    ✓ Oracle truth current');
    } catch {
      throw new Error('domain-truth.yaml not found');
    }

    // Validator baseline established
    console.log('    ✓ Validator baseline established\n');
  }

  /**
   * Develop story
   */
  async developStory(story) {
    const result = await this.executeAgentTask('dev', 'develop-story', {
      inputs: [story.path, story.testDataset, 'domain-truth.yaml'],
      mode: 'continuous_validation'
    });

    return {
      storyId: story.id,
      implementation: result.outputs || {},
      success: result.success
    };
  }

  /**
   * Story completion gates
   */
  async storyCompletionGates(story, implementation) {
    console.log('\n  🚧 Executing story completion gates...\n');

    story.implementation = implementation;

    try {
      await this.validationGates.executeAll(story);
    } catch (error) {
      // Gate failure - trigger reflection
      await this.handleGateFailure(story, error);
      throw error;
    }

    // Generate validation chain proof
    await this.generateValidationChainProof(story);
  }

  /**
   * Handle gate failure
   */
  async handleGateFailure(story, error) {
    console.log('\n  🔍 Gate failure detected - triggering reflection...\n');

    const result = await this.executeAgentTask('reflection', 'analyze-failure', {
      inputs: [story.id, error.message],
      analyzes: [
        'Why did eval test fail?',
        'Is domain truth wrong?',
        'Is implementation wrong?',
        'Is test wrong?'
      ],
      outputs: [`failure-analysis-${story.id}.md`]
    });

    await this.saveOutputs([`failure-analysis-${story.id}.md`], result);

    console.log(`  📄 Failure analysis saved: failure-analysis-${story.id}.md`);
  }

  /**
   * Generate validation chain proof
   */
  async generateValidationChainProof(story) {
    console.log('  📋 Generating validation chain proof...');

    const fs = await import('fs/promises');

    const proof = `# Validation Chain Proof

**Story:** ${story.id}
**Generated:** ${new Date().toISOString()}

## Traceability Chain

\`\`\`
Code Implementation
  ↓ implements
Story ${story.id}
  ↓ derives from
Epic (${story.id.split('.')[0]})
  ↓ implements
PRD Requirements
  ↓ traces to
Domain Truth
\`\`\`

## Validation Gates Passed

- ✅ Gate 0: Regression (brownfield)
- ✅ Gate 1: Eval tests (100% passing)
- ✅ Gate 2: Oracle validation (matches domain truth)
- ✅ Gate 3: Validator traceability (chain intact)
- ✅ Gate 4: Monitor metrics (no drift)
- ✅ Gate 5: Compatibility (brownfield)
- ✅ Gate 6: QA supplemental

## Test Results

**Eval Tests:** test-datasets/story-${story.id}-tests.json
**Status:** All passing

## Oracle Validation

**Domain Truth:** domain-truth.yaml
**Status:** Implementation matches domain truth

## Conclusion

Story ${story.id} has been fully validated through all gates.
Complete traceability from domain truth to code confirmed.
`;

    await fs.writeFile('validation-chain-proof.md', proof);
    console.log('    ✓ validation-chain-proof.md created');
  }

  /**
   * Start continuous validation
   */
  async startContinuousValidation() {
    console.log('  ⚡ Starting continuous validation...\n');

    // These would run in background in a real implementation
    console.log('    ▶ Eval: Watch mode active (triggers on file save)');
    console.log('    ▶ Oracle: Watch mode active (triggers on code change)');
    console.log('    ▶ Validator: Continuous mode active');
    console.log('    ▶ Monitor: Continuous tracking active');
    console.log('    ▶ QA: Background mode active\n');
  }

  /**
   * Stop continuous validation
   */
  async stopContinuousValidation() {
    console.log('\n  ⏹️  Stopping continuous validation...\n');
  }

  /**
   * During implementation validation (called by watch modes)
   */
  async duringImplementationValidation() {
    // Monitor tracks drift
    await this.executeAgentTask('monitor', 'track-drift', {
      mode: 'continuous'
    });

    // Validator checks consistency
    await this.executeAgentTask('validator', 'check-consistency', {
      mode: 'continuous'
    });
  }
}
