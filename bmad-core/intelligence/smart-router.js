/**
 * Smart Router - Intelligent Agent Routing System
 *
 * Provides context-aware agent selection and invocation based on:
 * - User intent analysis
 * - Current workflow context
 * - Historical patterns
 * - Fuzzy matching for ambiguous requests
 */

class SmartRouter {
  constructor(config = {}) {
    this.config = config;
    this.routingHistory = [];
    this.patterns = new Map();
    this.agentCapabilities = this.initializeAgentCapabilities();
    this.routingRules = [];
  }

  /**
   * Initialize agent capabilities mapping
   */
  initializeAgentCapabilities() {
    return {
      'pm': {
        capabilities: ['create_prd', 'define_requirements', 'write_stories', 'prioritize_features'],
        domains: ['product', 'requirements', 'planning'],
        keywords: ['prd', 'requirements', 'feature', 'epic', 'story', 'product']
      },
      'architect': {
        capabilities: ['design_architecture', 'validate_design', 'technical_decisions', 'system_design'],
        domains: ['architecture', 'design', 'technical'],
        keywords: ['architecture', 'design', 'system', 'component', 'integration', 'technical']
      },
      'dev': {
        capabilities: ['implement_code', 'fix_bugs', 'refactor', 'write_tests'],
        domains: ['development', 'implementation', 'coding'],
        keywords: ['implement', 'code', 'develop', 'build', 'fix', 'bug', 'refactor']
      },
      'oracle': {
        capabilities: ['validate_truth', 'check_consistency', 'verify_terminology', 'semantic_validation'],
        domains: ['validation', 'truth', 'consistency'],
        keywords: ['validate', 'check', 'verify', 'truth', 'consistent', 'semantic']
      },
      'eval': {
        capabilities: ['create_tests', 'run_tests', 'validate_implementation', 'test_coverage'],
        domains: ['testing', 'evaluation', 'quality'],
        keywords: ['test', 'eval', 'evaluate', 'coverage', 'quality', 'assertion']
      },
      'validator': {
        capabilities: ['gate_validation', 'compliance_check', 'traceability', 'coverage_validation'],
        domains: ['validation', 'compliance', 'gates'],
        keywords: ['validate', 'gate', 'compliance', 'traceability', 'coverage']
      },
      'reflection': {
        capabilities: ['analyze_failures', 'root_cause', 'suggest_improvements', 'pattern_detection'],
        domains: ['analysis', 'improvement', 'debugging'],
        keywords: ['analyze', 'reflect', 'failure', 'why', 'improve', 'pattern']
      },
      'domain-researcher': {
        capabilities: ['domain_research', 'competitive_analysis', 'best_practices', 'knowledge_gathering'],
        domains: ['research', 'domain', 'knowledge'],
        keywords: ['research', 'domain', 'investigate', 'analyze', 'study', 'competitive']
      }
    };
  }

  /**
   * Main routing method - analyzes request and routes to appropriate agent(s)
   *
   * @param {string} userInput - The user's request
   * @param {Object} context - Current workflow context
   * @returns {Object} Routing decision with agents and confidence
   */
  async route(userInput, context = {}) {
    // Step 1: Parse input
    const parsed = await this.parseInput(userInput);

    // Step 2: Check context
    const contextInfo = this.analyzeContext(context);

    // Step 3: Match agents
    const agentMatch = this.matchAgents(parsed, contextInfo);

    // Step 4: Validate routing
    const validated = this.validateRouting(agentMatch);

    // Step 5: Calculate confidence
    const confidence = this.calculateConfidence(parsed, agentMatch, contextInfo);

    // Step 6: Store in history
    this.recordRouting(userInput, validated, confidence, context);

    return {
      agents: validated.agents,
      collaborationMode: validated.mode,
      confidence: confidence.overall,
      reasoning: validated.reasoning,
      suggestion: this.getSuggestionAction(confidence.overall)
    };
  }

  /**
   * Parse user input to extract intent, entities, and context
   */
  async parseInput(input) {
    const lowercased = input.toLowerCase();

    // Extract intent (action verbs)
    const intents = this.extractIntents(lowercased);

    // Extract entities (nouns/objects)
    const entities = this.extractEntities(lowercased);

    // Extract keywords
    const keywords = this.extractKeywords(lowercased);

    return {
      original: input,
      intents,
      entities,
      keywords,
      clarity: this.assessClarity(input)
    };
  }

  /**
   * Extract intent from input (create, validate, fix, analyze, etc.)
   */
  extractIntents(text) {
    const intentPatterns = {
      create: /\b(create|make|build|generate|write|add)\b/,
      validate: /\b(validate|check|verify|ensure|confirm)\b/,
      fix: /\b(fix|repair|resolve|debug|correct)\b/,
      analyze: /\b(analyze|study|examine|investigate|review)\b/,
      improve: /\b(improve|optimize|enhance|refactor|better)\b/,
      test: /\b(test|eval|evaluate|assess|coverage)\b/,
      plan: /\b(plan|design|architect|strategy|roadmap)\b/
    };

    const detected = [];
    for (const [intent, pattern] of Object.entries(intentPatterns)) {
      if (pattern.test(text)) {
        detected.push(intent);
      }
    }

    return detected.length > 0 ? detected : ['general'];
  }

  /**
   * Extract entities from input (PRD, architecture, code, tests, etc.)
   */
  extractEntities(text) {
    const entityPatterns = {
      prd: /\b(prd|requirements|product requirements)\b/,
      architecture: /\b(architecture|design|system design)\b/,
      code: /\b(code|implementation|function|class|module)\b/,
      tests: /\b(test|eval|evaluation|assertion)\b/,
      bug: /\b(bug|issue|error|defect|problem)\b/,
      documentation: /\b(doc|documentation|readme|guide)\b/,
      story: /\b(story|epic|user story|feature)\b/
    };

    const detected = [];
    for (const [entity, pattern] of Object.entries(entityPatterns)) {
      if (pattern.test(text)) {
        detected.push(entity);
      }
    }

    return detected;
  }

  /**
   * Extract relevant keywords
   */
  extractKeywords(text) {
    const words = text.split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return words.filter(w => w.length >= 3 && !stopWords.has(w));  // Changed from > 3 to >= 3
  }

  /**
   * Assess clarity of input
   */
  assessClarity(input) {
    const hasIntent = /\b(create|make|validate|check|fix|analyze|improve|test)\b/i.test(input);
    const hasEntity = input.length > 10;
    const isQuestion = input.includes('?');

    if (hasIntent && hasEntity) return 'high';
    if (hasIntent || hasEntity) return 'medium';
    return 'low';
  }

  /**
   * Analyze current workflow context
   */
  analyzeContext(context) {
    return {
      phase: context.currentPhase || 'unknown',
      projectType: context.projectType || 'unknown',
      recentActivity: context.recentActivity || [],
      activeAgents: context.activeAgents || [],
      recentFailures: context.recentFailures || []
    };
  }

  /**
   * Match agents based on parsed input and context
   */
  matchAgents(parsed, contextInfo) {
    const matches = [];

    // Intent-based matching
    const intentMatches = this.intentBasedRouting(parsed.intents, parsed.entities);
    matches.push(...intentMatches);

    // Context-based matching
    const contextMatches = this.contextBasedRouting(contextInfo);
    matches.push(...contextMatches);

    // Keyword-based matching
    const keywordMatches = this.keywordBasedRouting(parsed.keywords);
    matches.push(...keywordMatches);

    // Pattern-based matching
    const patternMatches = this.patternBasedRouting(contextInfo);
    matches.push(...patternMatches);

    // Aggregate and deduplicate
    return this.aggregateMatches(matches);
  }

  /**
   * Intent-based routing
   */
  intentBasedRouting(intents, entities) {
    const routes = [];

    for (const intent of intents) {
      switch(intent) {
        case 'create':
          if (entities.includes('prd')) routes.push({ agent: 'pm', role: 'primary', reason: 'Create PRD intent' });
          if (entities.includes('architecture')) routes.push({ agent: 'architect', role: 'primary', reason: 'Create architecture intent' });
          if (entities.includes('tests')) routes.push({ agent: 'eval', role: 'primary', reason: 'Create tests intent' });
          if (entities.includes('code')) routes.push({ agent: 'dev', role: 'primary', reason: 'Create code intent' });
          break;

        case 'validate':
          routes.push({ agent: 'oracle', role: 'primary', reason: 'Validation intent' });
          routes.push({ agent: 'validator', role: 'secondary', reason: 'Gate validation' });
          if (entities.includes('tests')) routes.push({ agent: 'eval', role: 'secondary', reason: 'Test validation' });
          break;

        case 'fix':
          routes.push({ agent: 'dev', role: 'primary', reason: 'Fix intent' });
          routes.push({ agent: 'reflection', role: 'secondary', reason: 'Analyze fix' });
          if (entities.includes('tests')) routes.push({ agent: 'eval', role: 'background', reason: 'Re-run tests' });
          break;

        case 'analyze':
          routes.push({ agent: 'reflection', role: 'primary', reason: 'Analysis intent' });
          routes.push({ agent: 'oracle', role: 'secondary', reason: 'Truth check' });
          break;

        case 'test':
          routes.push({ agent: 'eval', role: 'primary', reason: 'Testing intent' });
          routes.push({ agent: 'validator', role: 'secondary', reason: 'Coverage validation' });
          break;

        case 'plan':
          routes.push({ agent: 'pm', role: 'primary', reason: 'Planning intent' });
          routes.push({ agent: 'architect', role: 'secondary', reason: 'Technical planning' });
          break;
      }
    }

    return routes;
  }

  /**
   * Context-based routing
   */
  contextBasedRouting(contextInfo) {
    const routes = [];

    switch(contextInfo.phase) {
      case 'domain_research':
        routes.push({ agent: 'domain-researcher', role: 'primary', reason: 'Domain research phase' });
        routes.push({ agent: 'oracle', role: 'secondary', reason: 'Truth establishment' });
        break;

      case 'discovery':
        routes.push({ agent: 'pm', role: 'primary', reason: 'Discovery phase' });
        routes.push({ agent: 'oracle', role: 'background', reason: 'Validation' });
        break;

      case 'architecture':
        routes.push({ agent: 'architect', role: 'primary', reason: 'Architecture phase' });
        routes.push({ agent: 'oracle', role: 'secondary', reason: 'Design validation' });
        break;

      case 'development':
        routes.push({ agent: 'dev', role: 'primary', reason: 'Development phase' });
        routes.push({ agent: 'eval', role: 'secondary', reason: 'Testing' });
        routes.push({ agent: 'oracle', role: 'background', reason: 'Semantic validation' });
        break;

      case 'eval_foundation':
        routes.push({ agent: 'eval', role: 'primary', reason: 'Eval foundation phase' });
        routes.push({ agent: 'validator', role: 'secondary', reason: 'Coverage check' });
        break;
    }

    // Check for recent failures - trigger reflection
    if (contextInfo.recentFailures.length > 0) {
      routes.push({ agent: 'reflection', role: 'primary', reason: 'Recent failures detected' });
    }

    return routes;
  }

  /**
   * Keyword-based routing
   */
  keywordBasedRouting(keywords) {
    const routes = [];

    for (const [agentName, agentInfo] of Object.entries(this.agentCapabilities)) {
      const matchCount = keywords.filter(kw =>
        agentInfo.keywords.some(agentKw => kw.includes(agentKw) || agentKw.includes(kw))
      ).length;

      if (matchCount > 0) {
        routes.push({
          agent: agentName,
          role: matchCount >= 2 ? 'primary' : 'secondary',
          reason: `Keyword match (${matchCount} keywords)`,
          score: matchCount
        });
      }
    }

    return routes;
  }

  /**
   * Pattern-based routing
   */
  patternBasedRouting(contextInfo) {
    const routes = [];

    // Pattern: Repeated eval failures
    const evalFailures = contextInfo.recentFailures.filter(f => f.includes('eval'));
    if (evalFailures.length >= 2) {
      routes.push({ agent: 'reflection', role: 'primary', reason: 'Pattern: Repeated eval failures' });
      routes.push({ agent: 'oracle', role: 'secondary', reason: 'Check truth alignment' });
      routes.push({ agent: 'dev', role: 'secondary', reason: 'Fix implementation' });
    }

    // Pattern: Oracle blocking consistently
    const oracleBlocks = contextInfo.recentFailures.filter(f => f.includes('oracle'));
    if (oracleBlocks.length >= 2) {
      routes.push({ agent: 'reflection', role: 'primary', reason: 'Pattern: Oracle blocking' });
      routes.push({ agent: 'pm', role: 'secondary', reason: 'Clarify requirements' });
    }

    return routes;
  }

  /**
   * Aggregate and deduplicate agent matches
   */
  aggregateMatches(matches) {
    const agentMap = new Map();

    for (const match of matches) {
      if (!agentMap.has(match.agent)) {
        agentMap.set(match.agent, {
          agent: match.agent,
          roles: [],
          reasons: [],
          score: 0
        });
      }

      const entry = agentMap.get(match.agent);
      if (!entry.roles.includes(match.role)) {
        entry.roles.push(match.role);
      }
      entry.reasons.push(match.reason);
      entry.score += match.score || 1;
    }

    // Convert to array and prioritize
    const aggregated = Array.from(agentMap.values());

    // Determine final role based on highest priority
    aggregated.forEach(a => {
      if (a.roles.includes('primary')) a.finalRole = 'primary';
      else if (a.roles.includes('secondary')) a.finalRole = 'secondary';
      else a.finalRole = 'background';
    });

    // Sort by role priority and score
    const rolePriority = { primary: 3, secondary: 2, background: 1 };
    aggregated.sort((a, b) => {
      const roleDiff = rolePriority[b.finalRole] - rolePriority[a.finalRole];
      if (roleDiff !== 0) return roleDiff;
      return b.score - a.score;
    });

    return aggregated;
  }

  /**
   * Validate routing decision
   */
  validateRouting(agentMatch) {
    // Ensure at least one primary agent
    const hasPrimary = agentMatch.some(a => a.finalRole === 'primary');

    if (!hasPrimary && agentMatch.length > 0) {
      agentMatch[0].finalRole = 'primary';
    }

    // Determine collaboration mode
    const primaryCount = agentMatch.filter(a => a.finalRole === 'primary').length;
    let mode = 'sequential';

    if (primaryCount > 1) mode = 'parallel';
    if (agentMatch.some(a => a.agent === 'oracle' || a.agent === 'validator')) mode = 'gated';

    return {
      agents: agentMatch,
      mode,
      reasoning: this.buildReasoning(agentMatch)
    };
  }

  /**
   * Build reasoning explanation
   */
  buildReasoning(agentMatch) {
    const primary = agentMatch.filter(a => a.finalRole === 'primary');
    const secondary = agentMatch.filter(a => a.finalRole === 'secondary');

    let reasoning = `Selected ${primary.length} primary agent(s): ${primary.map(a => a.agent).join(', ')}. `;

    if (secondary.length > 0) {
      reasoning += `Supporting agents: ${secondary.map(a => a.agent).join(', ')}. `;
    }

    const topReason = primary[0]?.reasons[0];
    if (topReason) {
      reasoning += `Primary reason: ${topReason}.`;
    }

    return reasoning;
  }

  /**
   * Calculate routing confidence
   */
  calculateConfidence(parsed, agentMatch, contextInfo) {
    // Intent clarity (0-1) - weighted more heavily
    const intentClarity = parsed.clarity === 'high' ? 1.0 : parsed.clarity === 'medium' ? 0.7 : 0.3;

    // Agent match strength (0-1) - improved scoring
    const agentMatchStrength = agentMatch.length > 0
      ? Math.min(1.0, agentMatch[0].score / 2)  // Changed from /3 to /2 for better scoring
      : 0.0;

    // Context relevance (0-1) - neutral when unknown
    const contextRelevance = contextInfo.phase !== 'unknown' ? 0.8 : 0.6;  // Changed from 0.4 to 0.6

    // Historical success (0-1) - based on routing history
    const historicalSuccess = this.calculateHistoricalSuccess(agentMatch);

    // Overall confidence (weighted average - intent and agent match are more important)
    const overall = (
      intentClarity * 0.40 +
      agentMatchStrength * 0.35 +
      contextRelevance * 0.15 +
      historicalSuccess * 0.10
    );

    return {
      intentClarity,
      agentMatchStrength,
      contextRelevance,
      historicalSuccess,
      overall
    };
  }

  /**
   * Calculate historical success rate for similar routings
   */
  calculateHistoricalSuccess(agentMatch) {
    if (this.routingHistory.length === 0) return 0.5; // Default

    const agentNames = agentMatch.map(a => a.agent).join(',');

    const similarRoutes = this.routingHistory.filter(h =>
      h.agents === agentNames
    );

    if (similarRoutes.length === 0) return 0.5;

    const successfulRoutes = similarRoutes.filter(h => h.outcome === 'success');
    return successfulRoutes.length / similarRoutes.length;
  }

  /**
   * Get suggested action based on confidence level
   */
  getSuggestionAction(confidence) {
    if (confidence >= 0.9) {
      return { action: 'auto_route', message: 'High confidence - routing automatically' };
    } else if (confidence >= 0.7) {
      return { action: 'suggest', message: 'Medium confidence - suggesting routing, allow override' };
    } else {
      return { action: 'confirm', message: 'Low confidence - please confirm routing' };
    }
  }

  /**
   * Record routing in history for learning
   */
  recordRouting(input, validated, confidence, context) {
    this.routingHistory.push({
      timestamp: new Date().toISOString(),
      input,
      agents: validated.agents.map(a => a.agent).join(','),
      mode: validated.mode,
      confidence: confidence.overall,
      context: context.currentPhase,
      outcome: null // Will be updated later
    });

    // Keep only recent history (last 100 routings)
    if (this.routingHistory.length > 100) {
      this.routingHistory.shift();
    }
  }

  /**
   * Update routing outcome (for learning loop)
   */
  updateRoutingOutcome(routingId, outcome, feedback = null) {
    if (routingId >= 0 && routingId < this.routingHistory.length) {
      this.routingHistory[routingId].outcome = outcome;
      this.routingHistory[routingId].feedback = feedback;

      // Learn from outcome
      this.learnFromOutcome(this.routingHistory[routingId]);
    }
  }

  /**
   * Learning loop - update routing rules based on outcomes
   */
  learnFromOutcome(routing) {
    // If successful, strengthen this routing pattern
    if (routing.outcome === 'success') {
      const pattern = {
        input: routing.input,
        agents: routing.agents,
        context: routing.context
      };

      const existingPattern = this.patterns.get(pattern.input);
      if (existingPattern) {
        existingPattern.successCount++;
        existingPattern.strength = Math.min(1.0, existingPattern.strength + 0.1);
      } else {
        this.patterns.set(pattern.input, {
          ...pattern,
          successCount: 1,
          failureCount: 0,
          strength: 0.6
        });
      }
    }

    // If failed, weaken this routing pattern
    if (routing.outcome === 'failure') {
      const existingPattern = this.patterns.get(routing.input);
      if (existingPattern) {
        existingPattern.failureCount++;
        existingPattern.strength = Math.max(0.0, existingPattern.strength - 0.1);
      }
    }
  }

  /**
   * Get routing statistics
   */
  getStatistics() {
    const total = this.routingHistory.length;
    const successful = this.routingHistory.filter(h => h.outcome === 'success').length;
    const failed = this.routingHistory.filter(h => h.outcome === 'failure').length;

    return {
      totalRoutings: total,
      successful,
      failed,
      successRate: total > 0 ? successful / total : 0,
      averageConfidence: total > 0
        ? this.routingHistory.reduce((sum, h) => sum + h.confidence, 0) / total
        : 0,
      patterns: this.patterns.size
    };
  }

  /**
   * Export routing data for analysis
   */
  exportData() {
    return {
      history: this.routingHistory,
      patterns: Array.from(this.patterns.entries()),
      statistics: this.getStatistics()
    };
  }

  /**
   * Import routing data (for persistence)
   */
  importData(data) {
    if (data.history) this.routingHistory = data.history;
    if (data.patterns) this.patterns = new Map(data.patterns);
  }
}

export default SmartRouter;
