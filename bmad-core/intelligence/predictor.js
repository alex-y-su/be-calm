/**
 * Prediction Engine - Predictive Orchestration System
 *
 * Anticipates needs and proactively prepares agents by:
 * - Predicting next agent(s) needed
 * - Predicting required artifacts
 * - Predicting validation triggers
 * - Predicting potential bottlenecks
 * - Generating proactive suggestions
 */

class PredictionEngine {
  constructor(config = {}) {
    this.config = config;
    this.transitionMatrix = new Map(); // Markov chain for agent transitions
    this.artifactDependencies = new Map();
    this.validationTriggers = new Map();
    this.bottleneckPatterns = [];
    this.suggestions = [];
    this.suggestionAcceptanceRate = new Map();
  }

  /**
   * Initialize prediction models with default patterns
   */
  initialize() {
    this.buildDefaultTransitionMatrix();
    this.buildDefaultArtifactDependencies();
    this.buildDefaultValidationTriggers();
    this.buildDefaultBottleneckPatterns();
  }

  /**
   * Build default agent transition matrix (Markov chain)
   */
  buildDefaultTransitionMatrix() {
    // Transitions: agent -> next_agent -> probability
    const transitions = [
      // Domain Research phase
      { from: 'domain-researcher', to: 'oracle', probability: 0.9 },
      { from: 'oracle', to: 'eval', probability: 0.7, context: 'domain_research' },

      // Discovery phase
      { from: 'pm', to: 'architect', probability: 0.85, context: 'after_prd' },
      { from: 'pm', to: 'oracle', probability: 0.8, context: 'validation' },
      { from: 'pm', to: 'eval', probability: 0.6, context: 'test_foundation' },

      // Architecture phase
      { from: 'architect', to: 'oracle', probability: 0.9, context: 'validation' },
      { from: 'architect', to: 'validator', probability: 0.7, context: 'validation' },
      { from: 'architect', to: 'dev', probability: 0.75, context: 'after_architecture' },

      // Development phase
      { from: 'dev', to: 'eval', probability: 0.95, context: 'development' },
      { from: 'dev', to: 'oracle', probability: 0.7, context: 'semantic_check' },
      { from: 'dev', to: 'reflection', probability: 0.3, context: 'on_failure' },

      // Eval phase
      { from: 'eval', to: 'validator', probability: 0.8, context: 'coverage_check' },
      { from: 'eval', to: 'reflection', probability: 0.6, context: 'on_failure' },
      { from: 'eval', to: 'dev', probability: 0.5, context: 'on_failure' },

      // Reflection phase
      { from: 'reflection', to: 'oracle', probability: 0.8, context: 'truth_check' },
      { from: 'reflection', to: 'dev', probability: 0.9, context: 'after_analysis' },
      { from: 'reflection', to: 'pm', probability: 0.4, context: 'requirements_issue' }
    ];

    for (const t of transitions) {
      const key = `${t.from}:${t.context || 'default'}`;
      if (!this.transitionMatrix.has(key)) {
        this.transitionMatrix.set(key, []);
      }
      this.transitionMatrix.get(key).push({
        agent: t.to,
        probability: t.probability
      });
    }
  }

  /**
   * Build default artifact dependencies
   */
  buildDefaultArtifactDependencies() {
    const dependencies = {
      // Architecture phase needs
      'architecture': {
        requires: ['prd.md', 'domain-truth.yaml'],
        probability: 0.95
      },

      // Development phase needs
      'development': {
        requires: ['prd.md', 'architecture.md', 'story-file', 'eval-tests'],
        probability: 0.99
      },

      // PRD creation needs
      'prd': {
        requires: ['domain-analysis.md', 'domain-truth.yaml'],
        probability: 0.8
      },

      // Eval foundation needs
      'eval_foundation': {
        requires: ['domain-truth.yaml', 'test-datasets/'],
        probability: 0.9
      },

      // Story creation needs
      'story': {
        requires: ['prd.md', 'architecture.md', 'epic-file'],
        probability: 0.95
      }
    };

    for (const [phase, deps] of Object.entries(dependencies)) {
      this.artifactDependencies.set(phase, deps);
    }
  }

  /**
   * Build default validation triggers
   */
  buildDefaultValidationTriggers() {
    const triggers = {
      'prd_created': ['oracle', 'eval', 'validator'],
      'architecture_created': ['oracle', 'validator'],
      'code_changed': ['eval', 'oracle'],
      'story_completed': ['validator', 'eval'],
      'phase_completed': ['validator']
    };

    for (const [event, agents] of Object.entries(triggers)) {
      this.validationTriggers.set(event, agents);
    }
  }

  /**
   * Build default bottleneck patterns
   */
  buildDefaultBottleneckPatterns() {
    this.bottleneckPatterns = [
      {
        pattern: 'high_complexity_story',
        indicators: ['complexity > 8', 'many_dependencies'],
        predictions: {
          dev_time_multiplier: 1.5,
          eval_failure_probability: 0.4,
          reflection_needed_probability: 0.6
        }
      },
      {
        pattern: 'many_integration_points',
        indicators: ['integrations > 3'],
        predictions: {
          architecture_phase_delay: 1.3,
          coordination_overhead: 1.4
        }
      },
      {
        pattern: 'unclear_requirements',
        indicators: ['low_prd_score', 'oracle_warnings > 5'],
        predictions: {
          rework_probability: 0.7,
          pm_clarification_needed: 0.9
        }
      }
    ];
  }

  /**
   * Predict next agent(s) based on current state
   *
   * @param {string} currentAgent - Currently active agent
   * @param {Object} context - Workflow context
   * @returns {Array} Predicted next agents with probabilities
   */
  predictNextAgent(currentAgent, context = {}) {
    const predictions = [];

    // Check transition matrix
    const transitionKey = `${currentAgent}:${context.situation || 'default'}`;
    const transitions = this.transitionMatrix.get(transitionKey);

    if (transitions) {
      predictions.push(...transitions.map(t => ({
        agent: t.agent,
        probability: t.probability,
        source: 'transition_matrix'
      })));
    }

    // Check context-specific patterns
    if (context.recentFailures && context.recentFailures.length > 0) {
      predictions.push({
        agent: 'reflection',
        probability: 0.8,
        source: 'failure_pattern'
      });
    }

    // Phase-based prediction
    const phasePrediction = this.predictAgentByPhase(context.currentPhase, currentAgent);
    predictions.push(...phasePrediction);

    // Sort by probability and deduplicate
    return this.deduplicatePredictions(predictions);
  }

  /**
   * Predict agent based on current phase
   */
  predictAgentByPhase(phase, currentAgent) {
    const predictions = [];

    switch(phase) {
      case 'domain_research':
        if (currentAgent === 'domain-researcher') {
          predictions.push({ agent: 'oracle', probability: 0.85, source: 'phase_pattern' });
        }
        break;

      case 'discovery':
        if (currentAgent === 'pm') {
          predictions.push({ agent: 'architect', probability: 0.8, source: 'phase_pattern' });
          predictions.push({ agent: 'oracle', probability: 0.75, source: 'phase_pattern' });
        }
        break;

      case 'development':
        if (currentAgent === 'dev') {
          predictions.push({ agent: 'eval', probability: 0.9, source: 'phase_pattern' });
          predictions.push({ agent: 'oracle', probability: 0.6, source: 'phase_pattern' });
        }
        break;
    }

    return predictions;
  }

  /**
   * Predict which artifacts will be needed
   *
   * @param {string} nextPhase - Upcoming phase
   * @param {string} nextAgent - Predicted next agent
   * @returns {Array} Required artifacts to pre-load
   */
  predictArtifacts(nextPhase, nextAgent) {
    const artifacts = [];

    // Phase-based artifact prediction
    const phaseDeps = this.artifactDependencies.get(nextPhase);
    if (phaseDeps) {
      artifacts.push(...phaseDeps.requires.map(a => ({
        artifact: a,
        probability: phaseDeps.probability,
        reason: `Required for ${nextPhase} phase`
      })));
    }

    // Agent-based artifact prediction
    const agentArtifacts = this.getAgentArtifactNeeds(nextAgent);
    artifacts.push(...agentArtifacts);

    return artifacts;
  }

  /**
   * Get artifacts typically needed by specific agent
   */
  getAgentArtifactNeeds(agent) {
    const needs = {
      'architect': [
        { artifact: 'prd.md', probability: 0.95, reason: 'Architecture references PRD' },
        { artifact: 'domain-truth.yaml', probability: 0.8, reason: 'Truth alignment' }
      ],
      'dev': [
        { artifact: 'story-file', probability: 0.99, reason: 'Story contains implementation details' },
        { artifact: 'prd.md', probability: 0.7, reason: 'Context and requirements' },
        { artifact: 'architecture.md', probability: 0.8, reason: 'Technical guidance' }
      ],
      'eval': [
        { artifact: 'test-datasets/', probability: 0.9, reason: 'Test data' },
        { artifact: 'domain-truth.yaml', probability: 0.85, reason: 'Truth for assertions' }
      ],
      'oracle': [
        { artifact: 'domain-truth.yaml', probability: 0.99, reason: 'Source of truth' },
        { artifact: 'prd.md', probability: 0.7, reason: 'Semantic validation' }
      ],
      'validator': [
        { artifact: 'traceability-matrix', probability: 0.8, reason: 'Coverage tracking' },
        { artifact: 'validation-gates', probability: 0.9, reason: 'Gate definitions' }
      ]
    };

    return needs[agent] || [];
  }

  /**
   * Predict which validations will be triggered
   *
   * @param {string} event - Event that occurred (e.g., 'prd_created')
   * @returns {Array} Validation agents to pre-warm
   */
  predictValidations(event) {
    const agents = this.validationTriggers.get(event);
    if (!agents) return [];

    return agents.map(agent => ({
      agent,
      reason: `Validation trigger for ${event}`,
      priority: agent === 'oracle' ? 'high' : 'medium'
    }));
  }

  /**
   * Predict potential bottlenecks
   *
   * @param {Object} taskCharacteristics - Characteristics of upcoming task
   * @returns {Array} Predicted bottlenecks and recommendations
   */
  predictBottlenecks(taskCharacteristics) {
    const predictions = [];

    for (const pattern of this.bottleneckPatterns) {
      const matches = this.matchesPattern(pattern, taskCharacteristics);

      if (matches) {
        predictions.push({
          pattern: pattern.pattern,
          predictions: pattern.predictions,
          recommendations: this.generateBottleneckRecommendations(pattern)
        });
      }
    }

    return predictions;
  }

  /**
   * Check if task matches bottleneck pattern
   */
  matchesPattern(pattern, characteristics) {
    for (const indicator of pattern.indicators) {
      // Simple pattern matching (can be enhanced with more complex logic)
      if (indicator.includes('complexity') && characteristics.complexity > 8) return true;
      if (indicator.includes('many_dependencies') && characteristics.dependencies > 5) return true;
      if (indicator.includes('integrations') && characteristics.integrations > 3) return true;
      if (indicator.includes('low_prd_score') && characteristics.prd_score < 0.7) return true;
      if (indicator.includes('oracle_warnings') && characteristics.oracle_warnings > 5) return true;
    }

    return false;
  }

  /**
   * Generate recommendations for bottleneck
   */
  generateBottleneckRecommendations(pattern) {
    const recommendations = {
      'high_complexity_story': [
        'Consider breaking story into smaller sub-stories',
        'Allocate extra time for development',
        'Plan for multiple reflection cycles'
      ],
      'many_integration_points': [
        'Review architecture for simplification opportunities',
        'Create integration plan early',
        'Budget extra time for architecture phase'
      ],
      'unclear_requirements': [
        'Schedule PM clarification session',
        'Run Oracle validation early',
        'Consider creating proof-of-concept first'
      ]
    };

    return recommendations[pattern.pattern] || [];
  }

  /**
   * Generate proactive suggestions based on current state
   *
   * @param {Object} context - Current workflow context
   * @returns {Array} Suggestions for user
   */
  generateSuggestions(context) {
    const suggestions = [];

    // Phase completion suggestions
    if (context.phaseCompleted) {
      const nextPhase = this.getNextPhase(context.currentPhase);
      if (nextPhase) {
        suggestions.push({
          type: 'phase_transition',
          message: `You just completed ${context.currentPhase}. Ready to start ${nextPhase}?`,
          action: `start_phase:${nextPhase}`,
          priority: 'high'
        });
      }
    }

    // Validation warning suggestions
    if (context.validationWarnings && context.validationWarnings.length > 0) {
      suggestions.push({
        type: 'validation_fix',
        message: `Oracle found ${context.validationWarnings.length} issues. Fix now?`,
        action: 'fix_validation_issues',
        priority: 'high'
      });
    }

    // Test coverage suggestions
    if (context.testCoverage && context.testCoverage < 0.9) {
      const missing = Math.round((0.9 - context.testCoverage) * 100);
      suggestions.push({
        type: 'test_coverage',
        message: `Test coverage is ${Math.round(context.testCoverage * 100)}%. Generate ${missing}% more tests?`,
        action: 'generate_tests',
        priority: 'medium'
      });
    }

    // Bottleneck warnings
    const bottlenecks = this.predictBottlenecks(context.taskCharacteristics || {});
    for (const bottleneck of bottlenecks) {
      suggestions.push({
        type: 'bottleneck_warning',
        message: `Potential bottleneck detected: ${bottleneck.pattern}`,
        action: 'review_recommendations',
        priority: 'medium',
        recommendations: bottleneck.recommendations
      });
    }

    this.suggestions = suggestions;
    return suggestions;
  }

  /**
   * Get next phase in workflow
   */
  getNextPhase(currentPhase) {
    const phaseSequence = [
      'domain_research',
      'eval_foundation',
      'discovery',
      'architecture',
      'planning',
      'development'
    ];

    const currentIndex = phaseSequence.indexOf(currentPhase);
    if (currentIndex >= 0 && currentIndex < phaseSequence.length - 1) {
      return phaseSequence[currentIndex + 1];
    }

    return null;
  }

  /**
   * Track suggestion acceptance
   *
   * @param {string} suggestionId - ID of suggestion
   * @param {boolean} accepted - Whether user accepted suggestion
   */
  trackSuggestionAcceptance(suggestionId, accepted) {
    const suggestion = this.suggestions.find(s => s.action === suggestionId);
    if (!suggestion) return;

    const key = suggestion.type;
    if (!this.suggestionAcceptanceRate.has(key)) {
      this.suggestionAcceptanceRate.set(key, {
        offered: 0,
        accepted: 0,
        rate: 0
      });
    }

    const stats = this.suggestionAcceptanceRate.get(key);
    stats.offered++;
    if (accepted) stats.accepted++;
    stats.rate = stats.accepted / stats.offered;

    // Adjust future suggestion frequency based on acceptance rate
    this.adjustSuggestionFrequency(key, stats.rate);
  }

  /**
   * Adjust suggestion frequency based on acceptance rate
   */
  adjustSuggestionFrequency(suggestionType, acceptanceRate) {
    // If acceptance rate is low, reduce frequency
    // If acceptance rate is high, maintain or increase frequency

    // This would tie into the suggestion generation logic
    // For now, just store the data
  }

  /**
   * Deduplicate and sort predictions
   */
  deduplicatePredictions(predictions) {
    const agentMap = new Map();

    for (const pred of predictions) {
      if (!agentMap.has(pred.agent)) {
        agentMap.set(pred.agent, pred);
      } else {
        // Keep higher probability
        const existing = agentMap.get(pred.agent);
        if (pred.probability > existing.probability) {
          agentMap.set(pred.agent, pred);
        }
      }
    }

    // Convert to array and sort by probability
    return Array.from(agentMap.values())
      .sort((a, b) => b.probability - a.probability);
  }

  /**
   * Learn from historical data to improve predictions
   *
   * @param {Array} workflowHistory - Historical workflow data
   */
  learnFromHistory(workflowHistory) {
    // Build transition matrix from actual transitions
    for (let i = 0; i < workflowHistory.length - 1; i++) {
      const current = workflowHistory[i];
      const next = workflowHistory[i + 1];

      const key = `${current.agent}:${current.context || 'default'}`;

      if (!this.transitionMatrix.has(key)) {
        this.transitionMatrix.set(key, []);
      }

      const transitions = this.transitionMatrix.get(key);
      const existing = transitions.find(t => t.agent === next.agent);

      if (existing) {
        // Increase probability (moving average)
        existing.probability = (existing.probability * 0.9) + (0.1 * 1.0);
      } else {
        transitions.push({
          agent: next.agent,
          probability: 0.5 // Start with medium confidence
        });
      }
    }

    // Normalize probabilities
    this.normalizeTransitionMatrix();
  }

  /**
   * Normalize transition probabilities so they sum to 1
   */
  normalizeTransitionMatrix() {
    for (const [key, transitions] of this.transitionMatrix.entries()) {
      const sum = transitions.reduce((s, t) => s + t.probability, 0);

      if (sum > 0) {
        for (const transition of transitions) {
          transition.probability = transition.probability / sum;
        }
      }
    }
  }

  /**
   * Get prediction statistics
   */
  getStatistics() {
    return {
      transitionMatrixSize: this.transitionMatrix.size,
      artifactDependenciesCount: this.artifactDependencies.size,
      validationTriggersCount: this.validationTriggers.size,
      bottleneckPatternsCount: this.bottleneckPatterns.length,
      suggestionAcceptanceRates: Object.fromEntries(this.suggestionAcceptanceRate)
    };
  }

  /**
   * Export prediction models
   */
  exportModels() {
    return {
      transitionMatrix: Array.from(this.transitionMatrix.entries()),
      artifactDependencies: Array.from(this.artifactDependencies.entries()),
      validationTriggers: Array.from(this.validationTriggers.entries()),
      bottleneckPatterns: this.bottleneckPatterns,
      suggestionAcceptance: Array.from(this.suggestionAcceptanceRate.entries())
    };
  }

  /**
   * Import prediction models
   */
  importModels(models) {
    if (models.transitionMatrix) {
      this.transitionMatrix = new Map(models.transitionMatrix);
    }
    if (models.artifactDependencies) {
      this.artifactDependencies = new Map(models.artifactDependencies);
    }
    if (models.validationTriggers) {
      this.validationTriggers = new Map(models.validationTriggers);
    }
    if (models.bottleneckPatterns) {
      this.bottleneckPatterns = models.bottleneckPatterns;
    }
    if (models.suggestionAcceptance) {
      this.suggestionAcceptanceRate = new Map(models.suggestionAcceptance);
    }
  }
}

export default PredictionEngine;
