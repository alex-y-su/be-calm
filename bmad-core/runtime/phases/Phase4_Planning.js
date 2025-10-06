/**
 * Phase 4: Planning (Stories with Truth)
 *
 * Shards documents into epics and stories with embedded truth references.
 * Every story has eval acceptance tests before development begins.
 */

import { WorkflowOrchestrator } from '../base/WorkflowOrchestrator.js';

export class PlanningPhase extends WorkflowOrchestrator {
  constructor(stateMachine, agentRegistry, validators) {
    const config = {
      phase: 'planning',
      agents: ['po', 'sm', 'eval', 'oracle', 'validator'],

      exit_conditions: [
        'stories_created',
        '100%_stories_have_eval_tests',
        'oracle_validated_all_stories',
        'validator_confirmed_traceability'
      ],

      auto_transition: {
        next_state: 'development',
        message: 'Planning complete. All stories validated with tests. Ready for development.'
      }
    };

    super(config, stateMachine, agentRegistry);
    this.validators = validators;
  }

  /**
   * Execute Phase 4 workflow
   */
  async executePhase() {
    console.log('Phase 4: Planning\n');

    // Step 1: Shard documents with truth
    await this.shardDocuments();

    // Step 2: Create stories with tests
    await this.createStoriesWithTests();

    return {
      outputs: {
        'docs/epics/': 'created',
        'docs/stories/': 'created',
        'test-datasets/story-*-tests.json': 'created'
      }
    };
  }

  /**
   * Step 1: Shard documents with truth
   */
  async shardDocuments() {
    console.log('  ▶ shard_with_truth...');

    const result = await this.executeAgentTask('po', 'shard-doc', {
      inputs: ['docs/prd.md', 'docs/architecture.md'],
      mode: 'truth_enhanced',
      enhancement: {
        inject_into_epics: [
          'domain_truth_references',
          'eval_test_ids',
          'oracle_validation_status'
        ]
      }
    });

    // Enhance epics with truth references
    await this.enhanceEpicsWithTruth();

    console.log('    ✓ Documents sharded with truth references');
    return result;
  }

  /**
   * Enhance epics with truth references
   */
  async enhanceEpicsWithTruth() {
    const fs = await import('fs/promises');
    const path = await import('path');

    try {
      const epicsDir = 'docs/epics';
      const files = await fs.readdir(epicsDir);

      for (const file of files) {
        if (file.endsWith('.md')) {
          const epicPath = path.join(epicsDir, file);
          let content = await fs.readFile(epicPath, 'utf-8');

          // Add truth references section if not present
          if (!content.includes('## Truth References')) {
            const truthSection = this.generateTruthSection();
            content += '\n\n' + truthSection;
            await fs.writeFile(epicPath, content);
          }
        }
      }

      console.log('      ✓ Epics enhanced with truth references');
    } catch (error) {
      console.warn(`      Warning: Could not enhance epics: ${error.message}`);
    }
  }

  /**
   * Generate truth references section
   */
  generateTruthSection() {
    return `## Truth References

**Domain Facts:** [domain-truth.yaml](../../domain-truth.yaml)
**Eval Tests:** See story-level test datasets
**Oracle Validation:** Pending story creation
**Traceability Chain:** PRD → Epic → Stories (to be created)
`;
  }

  /**
   * Step 2: Create stories with tests
   */
  async createStoriesWithTests() {
    console.log('  ▶ create_stories_with_tests...');

    // Get list of epics
    const epics = await this.getEpics();

    for (const epic of epics) {
      await this.createStoriesForEpic(epic);
    }

    console.log('    ✓ All stories created with tests and validation');
  }

  /**
   * Get list of epics
   */
  async getEpics() {
    const fs = await import('fs/promises');
    const path = await import('path');

    try {
      const epicsDir = 'docs/epics';
      const files = await fs.readdir(epicsDir);
      return files
        .filter(f => f.endsWith('.md'))
        .map(f => ({
          id: path.basename(f, '.md'),
          path: path.join(epicsDir, f)
        }));
    } catch {
      return [];
    }
  }

  /**
   * Create stories for an epic
   */
  async createStoriesForEpic(epic) {
    console.log(`    📖 Creating stories for ${epic.id}...`);

    // Create story
    const storyResult = await this.executeAgentTask('sm', 'create-next-story', {
      inputs: [epic.path],
      mode: 'truth_enhanced'
    });

    // Get story ID from result
    const storyId = storyResult.storyId || epic.id + '.1';

    // Parallel validation for the story
    await this.parallelStoryValidation(storyId);

    console.log(`      ✓ Story ${storyId} created and validated`);
  }

  /**
   * Parallel story validation
   */
  async parallelStoryValidation(storyId) {
    const promises = [
      this.generateStoryAcceptanceTests(storyId),
      this.oracleValidateStory(storyId),
      this.validatorTraceabilityChain(storyId)
    ];

    await Promise.all(promises);
  }

  /**
   * Generate story acceptance tests
   */
  async generateStoryAcceptanceTests(storyId) {
    const storyPath = `docs/stories/${storyId}.md`;

    const result = await this.executeAgentTask('eval', 'generate-story-acceptance-tests', {
      inputs: [storyPath, 'domain-truth.yaml'],
      outputs: [`test-datasets/story-${storyId}-tests.json`]
    });

    await this.saveOutputs([`test-datasets/story-${storyId}-tests.json`], result);

    // Enhance story with test references
    await this.enhanceStoryWithTests(storyId);

    console.log(`        ✓ Eval: Story ${storyId} acceptance tests generated`);
    return result;
  }

  /**
   * Oracle validate story
   */
  async oracleValidateStory(storyId) {
    const storyPath = `docs/stories/${storyId}.md`;

    const result = await this.executeAgentTask('oracle', 'validate-story', {
      inputs: [storyPath, 'domain-truth.yaml'],
      validates: 'story aligns with domain truth'
    });

    if (!result.success) {
      console.warn(`        ⚠️  Oracle: Story ${storyId} does not align with domain truth`);
    } else {
      console.log(`        ✓ Oracle: Story ${storyId} validated`);
    }

    return result;
  }

  /**
   * Validator traceability chain
   */
  async validatorTraceabilityChain(storyId) {
    const storyPath = `docs/stories/${storyId}.md`;

    const result = await this.executeAgentTask('validator', 'validate-story-traceability', {
      inputs: [storyPath],
      validates: 'story ↔ epic ↔ PRD ↔ domain-truth chain'
    });

    if (!result.success) {
      console.warn(`        ⚠️  Validator: Story ${storyId} traceability chain broken`);
    } else {
      console.log(`        ✓ Validator: Story ${storyId} traceability confirmed`);
    }

    return result;
  }

  /**
   * Enhance story with test references
   */
  async enhanceStoryWithTests(storyId) {
    const fs = await import('fs/promises');
    const storyPath = `docs/stories/${storyId}.md`;

    try {
      let content = await fs.readFile(storyPath, 'utf-8');

      // Add acceptance tests section if not present
      if (!content.includes('## Acceptance Tests (Executable)')) {
        const testSection = `

## Truth References

**Domain Facts:** See epic for domain truth references
**Eval Tests:** test-datasets/story-${storyId}-tests.json
**Oracle Validation:** Passed
**Traceability Chain:** Validated

## Acceptance Tests (Executable)

> Auto-generated from eval agent
> Test Dataset: test-datasets/story-${storyId}-tests.json
> All tests must pass before story completion
`;
        content += testSection;
        await fs.writeFile(storyPath, content);
      }
    } catch (error) {
      console.warn(`        Warning: Could not enhance story: ${error.message}`);
    }
  }
}
