/**
 * BMAD Intelligence System - Main Entry Point
 *
 * Provides access to all intelligence components:
 * - Smart Router
 * - Prediction Engine
 * - Goal Decomposer
 * - Swarm Coordinator
 * - Natural Language Interface
 * - Parallelization Engine
 * - Self-Healing System
 */

import SmartRouter from './smart-router.js';
import PredictionEngine from './predictor.js';
import GoalDecomposer from './goal-decomposer.js';
import SwarmCoordinator from './swarm-coordinator.js';
import NaturalLanguageInterface from './nl-interface.js';
import ParallelizationEngine from './parallel-engine.js';
import SelfHealingSystem from './self-healer.js';

class IntelligenceSystem {
  constructor(config = {}) {
    this.config = config;

    // Initialize all intelligence components
    this.router = new SmartRouter(config.routing || {});
    this.predictor = new PredictionEngine(config.prediction || {});
    this.goalDecomposer = new GoalDecomposer(config.goals || {});
    this.swarmCoordinator = new SwarmCoordinator(config.swarm || {});
    this.nlInterface = new NaturalLanguageInterface(config.nl || {});
    this.parallelEngine = new ParallelizationEngine(config.parallel || {});
    this.selfHealer = new SelfHealingSystem(config.healing || {});

    // Initialize prediction models
    this.predictor.initialize();

    // Flag to track if system is initialized
    this.initialized = true;
  }

  /**
   * Process a user request end-to-end
   *
   * @param {string} userInput - Natural language input from user
   * @param {Object} context - Workflow context
   * @returns {Object} Intelligent response with routing and actions
   */
  async processRequest(userInput, context = {}) {
    try {
      // 1. Natural language understanding
      const nlResponse = await this.nlInterface.processMessage(userInput, context);

      // If clarification needed, return early
      if (nlResponse.needsUserInput) {
        return nlResponse;
      }

      // 2. Intelligent routing
      const routing = await this.router.route(userInput, context);

      // 3. Predict next steps
      const predictions = await this.predictNextSteps(routing, context);

      // 4. Generate suggestions
      const suggestions = this.predictor.generateSuggestions(context);

      return {
        type: 'intelligent_response',
        naturalLanguage: nlResponse,
        routing,
        predictions,
        suggestions,
        confidence: routing.confidence
      };
    } catch (error) {
      // Self-healing: attempt to recover from error
      const recovery = await this.selfHealer.handleFailure({
        type: 'request_processing',
        message: error.message,
        context
      });

      if (recovery.recovered) {
        // Retry after recovery
        return this.processRequest(userInput, context);
      }

      return {
        type: 'error',
        message: 'Unable to process request',
        error: error.message,
        recovery
      };
    }
  }

  /**
   * Decompose a goal into executable plan
   *
   * @param {string} goalText - High-level goal description
   * @param {Object} options - Decomposition options
   * @returns {Object} Execution plan
   */
  async decomposeGoal(goalText, options = {}) {
    const plan = await this.goalDecomposer.decomposeGoal(goalText, options);

    // Optimize execution plan with parallelization
    if (plan.tasks && plan.tasks.length > 1) {
      const parallelPlan = await this.parallelEngine.executeTasks(plan.tasks, {
        dryRun: true // Just planning, not executing
      });

      plan.parallelizationPlan = parallelPlan;
    }

    return plan;
  }

  /**
   * Execute a goal autonomously
   *
   * @param {string} goalText - Goal to achieve
   * @param {Object} options - Execution options
   * @returns {Object} Execution results
   */
  async executeGoal(goalText, options = {}) {
    // Decompose goal
    const plan = await this.decomposeGoal(goalText, options);

    // Execute with intelligent parallelization
    const results = await this.parallelEngine.executeTasks(plan.tasks, options);

    // Track completion and learn
    this.learnFromExecution(plan, results);

    return {
      goal: goalText,
      plan,
      results,
      success: results.taskResults && Array.from(results.taskResults.values()).every(r => r.success)
    };
  }

  /**
   * Create a competitive swarm for task
   *
   * @param {string} task - Task description
   * @param {Array} agents - Competing agents
   * @param {Object} config - Swarm configuration
   * @returns {Object} Best result from swarm
   */
  async competitiveSwarm(task, agents, config = {}) {
    return this.swarmCoordinator.createCompetitiveSwarm(task, agents, config);
  }

  /**
   * Create a collaborative swarm for task
   *
   * @param {string} task - Task description
   * @param {Array} agents - Collaborating agents
   * @param {Object} config - Swarm configuration
   * @returns {Object} Combined result from swarm
   */
  async collaborativeSwarm(task, agents, config = {}) {
    return this.swarmCoordinator.createCollaborativeSwarm(task, agents, config);
  }

  /**
   * Perform comprehensive validation with multiple validators
   *
   * @param {Object} artifact - Artifact to validate
   * @param {Array} validators - Validation agents
   * @param {Object} config - Validation configuration
   * @returns {Object} Comprehensive validation result
   */
  async comprehensiveValidation(artifact, validators = ['oracle', 'validator', 'eval'], config = {}) {
    // Use swarm for parallel validation
    const swarmResult = await this.swarmCoordinator.createValidationSwarm(artifact, validators, config);

    // Self-heal if validation failed
    if (!swarmResult.passed && config.autoFix) {
      for (const issue of swarmResult.issues) {
        const recovery = await this.selfHealer.handleFailure({
          type: 'validation_failure',
          message: issue.issue,
          validator: issue.validator,
          artifact
        });

        if (recovery.recovered) {
          // Re-validate after fix
          return this.comprehensiveValidation(artifact, validators, { ...config, autoFix: false });
        }
      }
    }

    return swarmResult;
  }

  /**
   * Predict next steps based on routing
   */
  async predictNextSteps(routing, context) {
    const predictions = {
      nextAgents: [],
      artifacts: [],
      validations: []
    };

    // Predict next agent for each routed agent
    for (const agentMatch of routing.agents) {
      const nextAgent = this.predictor.predictNextAgent(agentMatch.agent, context);
      predictions.nextAgents.push(...nextAgent);
    }

    // Predict required artifacts
    if (predictions.nextAgents.length > 0) {
      const topNextAgent = predictions.nextAgents[0].agent;
      const artifacts = this.predictor.predictArtifacts(context.nextPhase, topNextAgent);
      predictions.artifacts = artifacts;
    }

    // Predict validation triggers
    if (context.lastEvent) {
      const validations = this.predictor.predictValidations(context.lastEvent);
      predictions.validations = validations;
    }

    return predictions;
  }

  /**
   * Learn from execution results
   */
  learnFromExecution(plan, results) {
    // Update routing effectiveness
    // Update prediction models
    // Improve parallelization strategies
    // This would integrate with the learning loops in each component
  }

  /**
   * Perform system health check
   */
  async healthCheck() {
    const health = await this.selfHealer.performHealthCheck();

    return {
      overall: health.overall,
      components: health.components,
      degraded: health.degraded,
      recommendations: health.recommendations,
      statistics: this.getSystemStatistics()
    };
  }

  /**
   * Perform proactive maintenance
   */
  async maintenance() {
    return this.selfHealer.performProactiveMaintenance();
  }

  /**
   * Get comprehensive system statistics
   */
  getSystemStatistics() {
    return {
      routing: this.router.getStatistics(),
      prediction: this.predictor.getStatistics(),
      swarm: this.swarmCoordinator.getStatistics(),
      parallelization: this.parallelEngine.getStatistics(),
      selfHealing: this.selfHealer.getStatistics(),
      conversation: this.nlInterface.getStatistics()
    };
  }

  /**
   * Get agent specialization report
   */
  getSpecializationReport() {
    return this.swarmCoordinator.getSpecializationReport();
  }

  /**
   * Get collaboration insights
   */
  getCollaborationInsights() {
    return this.swarmCoordinator.getCollaborationInsights();
  }

  /**
   * Get failure patterns
   */
  getFailurePatterns() {
    return this.selfHealer.getFailurePatterns();
  }

  /**
   * Export intelligence data for persistence
   */
  exportData() {
    return {
      routing: this.router.exportData(),
      prediction: this.predictor.exportModels(),
      goalTemplates: this.goalDecomposer.listTemplates(),
      swarmHistory: this.swarmCoordinator.getStatistics(),
      healingHistory: this.selfHealer.getStatistics(),
      timestamp: Date.now()
    };
  }

  /**
   * Import intelligence data
   */
  importData(data) {
    if (data.routing) {
      this.router.importData(data.routing);
    }

    if (data.prediction) {
      this.predictor.importModels(data.prediction);
    }

    if (data.goalTemplates) {
      for (const template of data.goalTemplates) {
        this.goalDecomposer.addTemplate(template.id, template);
      }
    }
  }
}

// Export intelligence components individually and as a system
export {
  IntelligenceSystem,
  SmartRouter,
  PredictionEngine,
  GoalDecomposer,
  SwarmCoordinator,
  NaturalLanguageInterface,
  ParallelizationEngine,
  SelfHealingSystem
};

export default IntelligenceSystem;
