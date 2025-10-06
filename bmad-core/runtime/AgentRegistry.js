/**
 * Agent Registry
 *
 * Manages agent instances and provides access to agents for workflow execution.
 * Supports both BMAD core agents and expansion pack agents.
 */

import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export class AgentRegistry {
  constructor(config = {}) {
    this.agents = new Map();
    this.config = config;
    this.agentsPath = config.agentsPath || 'bmad-core/agents';
  }

  /**
   * Initialize and load all agents
   */
  async initialize() {
    console.log('🤖 Initializing agent registry...');

    // Load core agents
    await this.loadAgents(this.agentsPath);

    console.log(`✓ Loaded ${this.agents.size} agents`);
  }

  /**
   * Load agents from a directory
   */
  async loadAgents(agentsDir) {
    try {
      const files = await fs.readdir(agentsDir);

      for (const file of files) {
        if (file.endsWith('.md')) {
          const agentName = path.basename(file, '.md');
          const agentPath = path.join(agentsDir, file);
          const content = await fs.readFile(agentPath, 'utf-8');

          // Create agent instance
          const agent = new Agent(agentName, content, agentPath);
          this.agents.set(agentName, agent);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not load agents from ${agentsDir}: ${error.message}`);
    }
  }

  /**
   * Get an agent by name
   */
  getAgent(name) {
    return this.agents.get(name);
  }

  /**
   * Check if agent exists
   */
  hasAgent(name) {
    return this.agents.has(name);
  }

  /**
   * List all available agents
   */
  listAgents() {
    return Array.from(this.agents.keys());
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    const matchingAgents = [];

    for (const [name, agent] of this.agents) {
      if (agent.hasCapability(capability)) {
        matchingAgents.push(agent);
      }
    }

    return matchingAgents;
  }

  /**
   * Register a mock agent (for testing)
   */
  registerAgent(name, content = '') {
    const agent = new Agent(name, content, `mock://${name}`);
    this.agents.set(name, agent);
    return agent;
  }
}

/**
 * Agent class
 * Represents a single AI agent with its instructions and capabilities
 */
class Agent {
  constructor(name, content, filePath) {
    this.name = name;
    this.content = content;
    this.filePath = filePath;
    this.capabilities = this.extractCapabilities();
  }

  /**
   * Execute agent task
   * In a real implementation, this would call the LLM with the agent's instructions
   */
  async execute(options = {}) {
    const {
      task,
      inputs = [],
      mode,
      validates,
      analyzes,
      compares,
      identifies,
      outputs = []
    } = options;

    console.log(`    🤖 ${this.name} executing: ${task || 'default task'}`);

    // Prepare context
    const context = {
      agent: this.name,
      task,
      inputs,
      mode,
      validates,
      analyzes,
      compares,
      identifies,
      outputs
    };

    // In a real implementation, this would:
    // 1. Load the agent's instructions from this.content
    // 2. Prepare the prompt with the task and inputs
    // 3. Call the LLM API
    // 4. Process the response
    // 5. Save outputs

    // For now, simulate execution
    const result = await this.simulateExecution(context);

    return {
      success: true,
      agent: this.name,
      task,
      outputs: result.outputs || {},
      validationResult: result.validationResult
    };
  }

  /**
   * Simulate agent execution (placeholder)
   */
  async simulateExecution(context) {
    // This is where LLM integration would happen
    // For now, return success with mock outputs - saveOutputs will write files
    const yaml = await import('js-yaml');

    const outputs = {};

    // Generate output data based on task context
    const outputFiles = context.outputs || [];

    for (const outputFile of outputFiles) {
      let data;

      // Generate appropriate content based on file type
      if (outputFile.endsWith('.yaml') || outputFile.endsWith('.yml')) {
        if (outputFile.includes('domain-truth')) {
          data = yaml.dump({
            canonical_facts: ['Mock fact 1', 'Mock fact 2'],
            constraints: ['Mock constraint 1'],
            domain_examples: ['Example 1'],
            success_criteria: ['Criterion 1'],
            terminology: { term1: 'definition1' }
          });
        } else if (outputFile.includes('test-dataset')) {
          data = yaml.dump({
            datasets: ['dataset1', 'dataset2'],
            test_cases: []
          });
        } else if (outputFile.includes('eval-criteria')) {
          data = yaml.dump({
            criteria: ['criterion1'],
            thresholds: {}
          });
        } else {
          data = yaml.dump({ mock: 'data' });
        }
      } else if (outputFile.endsWith('.json')) {
        data = JSON.stringify({ mock: 'data', created_by: this.name }, null, 2);
      } else {
        // Markdown or text file
        data = `# Mock ${outputFile}\n\nGenerated by ${this.name}\n\n## Content\n\nMock content for testing.`;
      }

      outputs[outputFile] = data;
    }

    return {
      success: true,
      outputs,
      validationResult: { passed: true }
    };
  }

  /**
   * Extract capabilities from agent content
   */
  extractCapabilities() {
    const capabilities = [];

    // Extract from common patterns in agent markdown
    if (this.content.includes('validation')) capabilities.push('validation');
    if (this.content.includes('analysis')) capabilities.push('analysis');
    if (this.content.includes('testing')) capabilities.push('testing');
    if (this.content.includes('domain')) capabilities.push('domain');
    if (this.content.includes('architecture')) capabilities.push('architecture');

    return capabilities;
  }

  /**
   * Check if agent has a specific capability
   */
  hasCapability(capability) {
    return this.capabilities.includes(capability);
  }

  /**
   * Get agent instructions
   */
  getInstructions() {
    return this.content;
  }
}
