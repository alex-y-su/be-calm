/**
 * Natural Language Interface
 *
 * Provides conversational AI interface for user interactions:
 * - Context-aware conversation
 * - Intent understanding
 * - Clarifying questions
 * - Progress updates
 * - Suggestion handling
 */

class NaturalLanguageInterface {
  constructor(config = {}) {
    this.config = config;
    this.conversationHistory = [];
    this.contextStack = [];
    this.userPreferences = new Map();
    this.clarificationQueue = [];
    this.activeConversation = null;
  }

  /**
   * Process user message and generate response
   *
   * @param {string} userMessage - User's input
   * @param {Object} workflowContext - Current workflow state
   * @returns {Object} Response with message and actions
   */
  async processMessage(userMessage, workflowContext = {}) {
    // Add to conversation history
    this.addToHistory('user', userMessage);

    // Update context stack
    this.updateContext(userMessage, workflowContext);

    // Understand intent
    const intent = await this.understandIntent(userMessage);

    // Check if clarification needed
    if (intent.needsClarification) {
      const clarification = this.generateClarification(intent);
      this.addToHistory('system', clarification.message);
      return clarification;
    }

    // Generate response
    const response = await this.generateResponse(intent, workflowContext);

    // Add to history
    this.addToHistory('system', response.message);

    return response;
  }

  /**
   * Understand user intent
   */
  async understandIntent(message) {
    const lowercased = message.toLowerCase();

    // Extract primary intent
    const primaryIntent = this.extractPrimaryIntent(lowercased);

    // Extract entities
    const entities = this.extractEntities(lowercased);

    // Check for ambiguity
    const ambiguity = this.detectAmbiguity(message, primaryIntent, entities);

    // Resolve pronouns using context
    const resolved = this.resolvePronouns(message, this.getRecentContext());

    return {
      original: message,
      primary: primaryIntent,
      entities,
      ambiguity,
      resolved,
      needsClarification: ambiguity.level === 'high',
      confidence: this.calculateIntentConfidence(primaryIntent, entities, ambiguity)
    };
  }

  /**
   * Extract primary intent
   */
  extractPrimaryIntent(text) {
    const intents = {
      create: /\b(create|make|build|generate|write|add)\b/,
      validate: /\b(validate|check|verify|review|test)\b/,
      fix: /\b(fix|repair|resolve|debug|correct)\b/,
      explain: /\b(explain|describe|what|how|why|tell me)\b/,
      status: /\b(status|progress|where|how far|update)\b/,
      help: /\b(help|assist|support|guide)\b/,
      optimize: /\b(optimize|improve|enhance|speed up|faster)\b/,
      delete: /\b(delete|remove|clear|erase)\b/,
      list: /\b(list|show|display|what are)\b/
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(text)) {
        return intent;
      }
    }

    return 'unknown';
  }

  /**
   * Extract entities from message
   */
  extractEntities(text) {
    const entities = {
      artifacts: [],
      agents: [],
      phases: [],
      actions: []
    };

    // Artifacts
    const artifactPatterns = {
      prd: /\b(prd|product requirements|requirements document)\b/,
      architecture: /\b(architecture|system design|design doc)\b/,
      story: /\b(story|user story|stories)\b/,
      code: /\b(code|implementation|source)\b/,
      tests: /\b(test|tests|eval|evaluation)\b/
    };

    for (const [artifact, pattern] of Object.entries(artifactPatterns)) {
      if (pattern.test(text)) {
        entities.artifacts.push(artifact);
      }
    }

    // Agents
    const agentPatterns = {
      pm: /\b(pm|product manager)\b/,
      architect: /\b(architect|architecture agent)\b/,
      dev: /\b(dev|developer|development)\b/,
      oracle: /\b(oracle|validator|truth)\b/,
      eval: /\b(eval|evaluator|test)\b/
    };

    for (const [agent, pattern] of Object.entries(agentPatterns)) {
      if (pattern.test(text)) {
        entities.agents.push(agent);
      }
    }

    // Phases
    const phasePatterns = {
      domain_research: /\b(domain research|research phase)\b/,
      discovery: /\b(discovery|prd phase)\b/,
      architecture: /\b(architecture phase|design phase)\b/,
      development: /\b(development|coding|implementation)\b/
    };

    for (const [phase, pattern] of Object.entries(phasePatterns)) {
      if (pattern.test(text)) {
        entities.phases.push(phase);
      }
    }

    return entities;
  }

  /**
   * Detect ambiguity in message
   */
  detectAmbiguity(message, intent, entities) {
    const ambiguity = {
      level: 'low',
      reasons: []
    };

    // Check for vague pronouns without context
    if (/\b(it|this|that|them)\b/i.test(message) && this.conversationHistory.length < 2) {
      ambiguity.level = 'high';
      ambiguity.reasons.push('Vague pronoun without context');
    }

    // Check for generic requests
    if (/\b(make it better|fix it|improve|optimize)\b/i.test(message) && entities.artifacts.length === 0) {
      ambiguity.level = 'high';
      ambiguity.reasons.push('Generic request without specific target');
    }

    // Check for multiple possible interpretations
    if (intent === 'unknown') {
      ambiguity.level = 'high';
      ambiguity.reasons.push('Unable to determine intent');
    }

    // Check for conflicting intents
    const intentMatches = message.match(/\b(create|validate|fix|delete)\b/gi);
    if (intentMatches && intentMatches.length > 2) {
      ambiguity.level = 'medium';
      ambiguity.reasons.push('Multiple intents detected');
    }

    return ambiguity;
  }

  /**
   * Resolve pronouns using context
   */
  resolvePronouns(message, context) {
    let resolved = message;

    // Get recent entities from context
    const recentArtifact = context.lastArtifact;
    const recentAgent = context.lastAgent;
    const recentAction = context.lastAction;

    // Replace pronouns
    if (recentArtifact) {
      resolved = resolved.replace(/\bit\b/gi, recentArtifact);
      resolved = resolved.replace(/\bthis\b/gi, recentArtifact);
    }

    if (recentAction) {
      resolved = resolved.replace(/\bthat\b/gi, recentAction);
    }

    return {
      original: message,
      resolved: resolved !== message ? resolved : null,
      replacements: {
        artifact: recentArtifact,
        agent: recentAgent,
        action: recentAction
      }
    };
  }

  /**
   * Calculate intent confidence
   */
  calculateIntentConfidence(intent, entities, ambiguity) {
    let confidence = 0.5; // Base confidence

    // Increase if intent is clear
    if (intent !== 'unknown') confidence += 0.2;

    // Increase if entities present
    confidence += Math.min(0.3, entities.artifacts.length * 0.1);

    // Decrease for ambiguity
    if (ambiguity.level === 'high') confidence -= 0.3;
    if (ambiguity.level === 'medium') confidence -= 0.15;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate clarification question
   */
  generateClarification(intent) {
    const clarifications = [];

    for (const reason of intent.ambiguity.reasons) {
      if (reason.includes('Vague pronoun')) {
        clarifications.push({
          question: 'What would you like me to work on specifically?',
          options: this.getSuggestedArtifacts()
        });
      }

      if (reason.includes('Generic request')) {
        if (intent.primary === 'optimize') {
          clarifications.push({
            question: 'What would you like to optimize? Response time, build time, code quality, or something else?',
            options: ['Response time', 'Build time', 'Code quality', 'Memory usage']
          });
        } else {
          clarifications.push({
            question: 'Which component or file would you like me to work on?',
            options: []
          });
        }
      }

      if (reason.includes('Unable to determine intent')) {
        clarifications.push({
          question: 'I\'m not sure what you\'d like me to do. Could you rephrase or choose one of these options?',
          options: ['Create something', 'Validate existing work', 'Fix an issue', 'Check status', 'Get help']
        });
      }
    }

    return {
      type: 'clarification',
      message: clarifications[0].question,
      options: clarifications[0].options,
      needsUserInput: true
    };
  }

  /**
   * Generate response based on intent
   */
  async generateResponse(intent, workflowContext) {
    const responses = {
      create: () => this.handleCreateIntent(intent, workflowContext),
      validate: () => this.handleValidateIntent(intent, workflowContext),
      fix: () => this.handleFixIntent(intent, workflowContext),
      explain: () => this.handleExplainIntent(intent, workflowContext),
      status: () => this.handleStatusIntent(intent, workflowContext),
      help: () => this.handleHelpIntent(intent, workflowContext),
      optimize: () => this.handleOptimizeIntent(intent, workflowContext),
      list: () => this.handleListIntent(intent, workflowContext)
    };

    const handler = responses[intent.primary];

    if (handler) {
      return await handler();
    }

    return {
      type: 'response',
      message: 'I understand you want to do something, but I\'m not sure what. Could you provide more details?',
      actions: []
    };
  }

  /**
   * Handle create intent
   */
  async handleCreateIntent(intent, context) {
    const artifact = intent.entities.artifacts[0];

    if (!artifact) {
      return {
        type: 'question',
        message: 'What would you like me to create?',
        suggestions: ['PRD', 'Architecture', 'Story', 'Tests']
      };
    }

    // Suggest next steps based on context
    const agentSuggestion = this.suggestAgent(artifact);

    return {
      type: 'action',
      message: `I'll create the ${artifact}. ${this.getContextualTip(artifact, context)}`,
      actions: [
        {
          type: 'invoke_agent',
          agent: agentSuggestion,
          task: `create_${artifact}`
        }
      ],
      followUp: `Would you like me to validate it with Oracle after creation?`
    };
  }

  /**
   * Handle validate intent
   */
  async handleValidateIntent(intent, context) {
    const artifact = intent.entities.artifacts[0] || context.lastArtifact;

    if (!artifact) {
      return {
        type: 'question',
        message: 'What would you like me to validate?',
        suggestions: this.getValidatableArtifacts(context)
      };
    }

    return {
      type: 'action',
      message: `I'll validate the ${artifact} using Oracle and Validator agents.`,
      actions: [
        { type: 'invoke_agent', agent: 'oracle', task: `validate_${artifact}` },
        { type: 'invoke_agent', agent: 'validator', task: `check_${artifact}` }
      ],
      followUp: `I'll let you know if any issues are found.`
    };
  }

  /**
   * Handle fix intent
   */
  async handleFixIntent(intent, context) {
    return {
      type: 'action',
      message: `I'll analyze the issue and implement a fix. Running Reflection first to identify root cause.`,
      actions: [
        { type: 'invoke_agent', agent: 'reflection', task: 'analyze_issue' },
        { type: 'invoke_agent', agent: 'dev', task: 'implement_fix' },
        { type: 'invoke_agent', agent: 'eval', task: 'verify_fix' }
      ],
      followUp: `I'll confirm once the fix is validated.`
    };
  }

  /**
   * Handle status intent
   */
  async handleStatusIntent(intent, context) {
    const statusMessage = this.buildStatusMessage(context);

    return {
      type: 'status',
      message: statusMessage,
      actions: [],
      data: context.currentStatus
    };
  }

  /**
   * Handle explain intent
   */
  async handleExplainIntent(intent, context) {
    const topic = intent.entities.artifacts[0] || intent.entities.phases[0];

    return {
      type: 'explanation',
      message: this.explainTopic(topic, context),
      actions: []
    };
  }

  /**
   * Handle help intent
   */
  async handleHelpIntent(intent, context) {
    return {
      type: 'help',
      message: this.getContextualHelp(context),
      actions: [],
      suggestions: this.getHelpfulSuggestions(context)
    };
  }

  /**
   * Handle optimize intent
   */
  async handleOptimizeIntent(intent, context) {
    return {
      type: 'action',
      message: `I'll analyze performance and suggest optimizations.`,
      actions: [
        { type: 'invoke_agent', agent: 'reflection', task: 'analyze_performance' },
        { type: 'invoke_agent', agent: 'architect', task: 'suggest_optimizations' }
      ]
    };
  }

  /**
   * Handle list intent
   */
  async handleListIntent(intent, context) {
    const listType = intent.entities.artifacts[0] || intent.entities.phases[0] || 'all';

    return {
      type: 'list',
      message: `Here's what I found:`,
      items: this.getListItems(listType, context),
      actions: []
    };
  }

  /**
   * Suggest appropriate agent for artifact
   */
  suggestAgent(artifact) {
    const mapping = {
      prd: 'pm',
      architecture: 'architect',
      story: 'pm',
      code: 'dev',
      tests: 'eval'
    };

    return mapping[artifact] || 'dev';
  }

  /**
   * Get contextual tip
   */
  getContextualTip(artifact, context) {
    const tips = {
      prd: 'Make sure domain research is complete first.',
      architecture: 'The PRD should be validated before starting architecture.',
      code: 'I recommend having the story file ready with all context.',
      tests: 'I can use the domain truth to generate comprehensive test datasets.'
    };

    return tips[artifact] || '';
  }

  /**
   * Build status message
   */
  buildStatusMessage(context) {
    const phase = context.currentPhase || 'unknown';
    const progress = context.progress || 0;
    const recentActivity = context.recentActivity || [];

    let message = `Current phase: ${phase}. `;
    message += `Progress: ${Math.round(progress * 100)}%. `;

    if (recentActivity.length > 0) {
      message += `Recent activity: ${recentActivity[0]}`;
    }

    return message;
  }

  /**
   * Explain a topic
   */
  explainTopic(topic, context) {
    const explanations = {
      prd: 'The PRD (Product Requirements Document) defines what you\'re building, including features, requirements, and success criteria.',
      architecture: 'The Architecture document describes how the system is designed, including components, data flow, and technical decisions.',
      oracle: 'Oracle is the truth validator - it maintains domain truth and ensures all artifacts stay consistent with it.',
      eval: 'Eval creates and runs tests to validate that implementations match requirements.',
      domain_research: 'Domain research phase involves studying the problem space and establishing foundational truth.'
    };

    return explanations[topic] || 'I don\'t have specific information about that topic.';
  }

  /**
   * Get contextual help
   */
  getContextualHelp(context) {
    if (!context.currentPhase) {
      return 'You can start by creating a PRD or running domain research. What would you like to do?';
    }

    const phaseHelp = {
      domain_research: 'In domain research, you should use the Domain Researcher and Oracle to establish truth.',
      discovery: 'In discovery, create your PRD with the PM agent and validate with Oracle.',
      architecture: 'In architecture phase, use the Architect agent to design your system.',
      development: 'In development, implement stories one at a time with the Dev agent.'
    };

    return phaseHelp[context.currentPhase] || 'I can help you with various tasks. What do you need?';
  }

  /**
   * Get helpful suggestions
   */
  getHelpfulSuggestions(context) {
    const suggestions = [
      'Create a PRD',
      'Validate existing work',
      'Check current status',
      'Run tests',
      'Get explanation of a concept'
    ];

    return suggestions;
  }

  /**
   * Get list items
   */
  getListItems(type, context) {
    // Mock implementation
    return ['Item 1', 'Item 2', 'Item 3'];
  }

  /**
   * Get suggested artifacts
   */
  getSuggestedArtifacts() {
    return ['PRD', 'Architecture', 'Story', 'Code', 'Tests'];
  }

  /**
   * Get validatable artifacts
   */
  getValidatableArtifacts(context) {
    return ['PRD', 'Architecture', 'Code'];
  }

  /**
   * Add message to conversation history
   */
  addToHistory(role, message) {
    this.conversationHistory.push({
      role,
      message,
      timestamp: Date.now()
    });

    // Keep only recent history
    if (this.conversationHistory.length > 50) {
      this.conversationHistory.shift();
    }
  }

  /**
   * Update context stack
   */
  updateContext(message, workflowContext) {
    const intent = this.extractPrimaryIntent(message.toLowerCase());
    const entities = this.extractEntities(message.toLowerCase());

    this.contextStack.push({
      intent,
      entities,
      workflowContext,
      timestamp: Date.now()
    });

    // Keep only recent context
    if (this.contextStack.length > 20) {
      this.contextStack.shift();
    }
  }

  /**
   * Get recent context
   */
  getRecentContext() {
    if (this.contextStack.length === 0) {
      return {
        lastArtifact: null,
        lastAgent: null,
        lastAction: null
      };
    }

    const recent = this.contextStack[this.contextStack.length - 1];

    return {
      lastArtifact: recent.entities.artifacts[0] || null,
      lastAgent: recent.entities.agents[0] || null,
      lastAction: recent.intent
    };
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    this.contextStack = [];
  }

  /**
   * Get conversation statistics
   */
  getStatistics() {
    const totalMessages = this.conversationHistory.length;
    const userMessages = this.conversationHistory.filter(m => m.role === 'user').length;
    const systemMessages = this.conversationHistory.filter(m => m.role === 'system').length;

    return {
      totalMessages,
      userMessages,
      systemMessages,
      contextStackSize: this.contextStack.length
    };
  }
}

export default NaturalLanguageInterface;
