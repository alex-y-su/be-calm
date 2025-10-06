/**
 * Goal Decomposition Engine
 *
 * Transforms high-level goals into executable task plans by:
 * - Parsing goal intent and constraints
 * - Decomposing into sub-goals and tasks
 * - Mapping to workflow phases and agents
 * - Creating autonomous execution plans
 * - Providing checkpoint systems
 * - Supporting adaptive re-planning
 */

class GoalDecomposer {
  constructor(config = {}) {
    this.config = config;
    this.goalTemplates = new Map();
    this.executionHistory = [];
    this.checkpoints = [];
    this.initializeTemplates();
  }

  /**
   * Initialize goal templates
   */
  initializeTemplates() {
    // Greenfield new feature template
    this.goalTemplates.set('greenfield_feature', {
      name: 'Greenfield New Feature',
      phases: [
        'domain_research',
        'eval_foundation',
        'discovery',
        'architecture',
        'planning',
        'development'
      ],
      defaultAgents: ['domain-researcher', 'oracle', 'pm', 'architect', 'eval', 'dev', 'validator'],
      defaultCheckpoints: ['after_domain_research', 'after_prd', 'after_architecture', 'halfway', 'before_completion'],
      successCriteriaTemplate: [
        'All phases completed',
        'PRD validated by Oracle',
        'Architecture validated',
        'All eval tests passing',
        'Traceability 100%'
      ]
    });

    // Brownfield enhancement template
    this.goalTemplates.set('brownfield_enhancement', {
      name: 'Brownfield Enhancement',
      phases: [
        'codebase_discovery',
        'compatibility_analysis',
        'discovery',
        'architecture',
        'planning',
        'development'
      ],
      defaultAgents: ['oracle', 'pm', 'architect', 'eval', 'dev', 'validator'],
      defaultCheckpoints: ['after_discovery', 'after_compatibility', 'after_planning', 'before_integration'],
      successCriteriaTemplate: [
        'Compatibility validated',
        'No breaking changes (unless approved)',
        'Existing tests still pass',
        'New functionality validated'
      ]
    });

    // Bug fix template
    this.goalTemplates.set('bug_fix', {
      name: 'Bug Fix',
      phases: [
        'root_cause_analysis',
        'fix_planning',
        'implementation',
        'validation'
      ],
      defaultAgents: ['reflection', 'dev', 'eval', 'oracle'],
      defaultCheckpoints: ['after_root_cause', 'after_fix'],
      successCriteriaTemplate: [
        'Root cause identified',
        'Fix implemented',
        'Tests confirm fix',
        'No regressions'
      ]
    });

    // Performance optimization template
    this.goalTemplates.set('performance_optimization', {
      name: 'Performance Optimization',
      phases: [
        'performance_analysis',
        'optimization_planning',
        'implementation',
        'benchmarking'
      ],
      defaultAgents: ['reflection', 'architect', 'dev', 'eval'],
      defaultCheckpoints: ['after_analysis', 'after_implementation'],
      successCriteriaTemplate: [
        'Performance bottlenecks identified',
        'Optimization implemented',
        'Target metrics achieved',
        'No functionality regressions'
      ]
    });

    // Refactoring template
    this.goalTemplates.set('refactoring', {
      name: 'Refactoring',
      phases: [
        'code_analysis',
        'refactoring_plan',
        'implementation',
        'validation'
      ],
      defaultAgents: ['reflection', 'architect', 'dev', 'eval', 'validator'],
      defaultCheckpoints: ['after_plan', 'after_refactoring'],
      successCriteriaTemplate: [
        'Code quality improved',
        'All tests still passing',
        'No behavior changes',
        'Traceability maintained'
      ]
    });
  }

  /**
   * Decompose a goal into executable tasks
   *
   * @param {string} goalText - High-level goal description
   * @param {Object} options - Decomposition options
   * @returns {Object} Execution plan with tasks and checkpoints
   */
  async decomposeGoal(goalText, options = {}) {
    // Step 1: Parse goal
    const parsed = this.parseGoal(goalText);

    // Step 2: Determine goal level
    const level = this.determineGoalLevel(parsed);

    // Step 3: Select template or create custom plan
    const template = this.selectTemplate(parsed, options.template);

    // Step 4: Decompose into tasks
    const tasks = await this.decomposeTasks(parsed, template, level);

    // Step 5: Create execution plan
    const plan = this.createExecutionPlan(tasks, template);

    // Step 6: Validate plan
    const validatedPlan = await this.validatePlan(plan, parsed);

    return validatedPlan;
  }

  /**
   * Parse goal to extract objective, constraints, and success criteria
   */
  parseGoal(goalText) {
    const parsed = {
      original: goalText,
      objective: null,
      constraints: [],
      successCriteria: [],
      keywords: [],
      entities: []
    };

    // Extract main objective (simplified NLP)
    parsed.objective = goalText;

    // Extract constraints (look for "must", "should", "without", etc.)
    const constraintPatterns = [
      /must\s+(.+?)(?:\.|$)/gi,
      /should\s+(.+?)(?:\.|$)/gi,
      /without\s+(.+?)(?:\.|$)/gi,
      /within\s+(.+?)(?:\.|$)/gi
    ];

    for (const pattern of constraintPatterns) {
      const matches = goalText.matchAll(pattern);
      for (const match of matches) {
        parsed.constraints.push(match[1].trim());
      }
    }

    // Extract keywords
    const words = goalText.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    parsed.keywords = words.filter(w => w.length > 3 && !stopWords.has(w));

    // Extract entities
    const entityPatterns = {
      feature: /\b(feature|functionality|capability)\b/i,
      system: /\b(system|service|component|module)\b/i,
      authentication: /\b(auth|authentication|login|user|account)\b/i,
      payment: /\b(payment|billing|transaction|checkout)\b/i,
      performance: /\b(performance|speed|optimization|latency)\b/i,
      bug: /\b(bug|issue|error|problem|fix)\b/i
    };

    for (const [entity, pattern] of Object.entries(entityPatterns)) {
      if (pattern.test(goalText)) {
        parsed.entities.push(entity);
      }
    }

    return parsed;
  }

  /**
   * Determine if goal is high, medium, or low level
   */
  determineGoalLevel(parsed) {
    // High level: Broad goals with multiple entities/phases
    if (parsed.entities.length >= 2 || parsed.keywords.length >= 5) {
      return 'high';
    }

    // Low level: Very specific goals
    if (parsed.entities.length <= 1 && parsed.keywords.length <= 3) {
      return 'low';
    }

    return 'medium';
  }

  /**
   * Select appropriate template
   */
  selectTemplate(parsed, explicitTemplate = null) {
    if (explicitTemplate && this.goalTemplates.has(explicitTemplate)) {
      return this.goalTemplates.get(explicitTemplate);
    }

    // Auto-select based on entities
    if (parsed.entities.includes('bug')) {
      return this.goalTemplates.get('bug_fix');
    }

    if (parsed.entities.includes('performance')) {
      return this.goalTemplates.get('performance_optimization');
    }

    // Check for keywords suggesting refactoring
    if (parsed.keywords.some(k => ['refactor', 'improve', 'cleanup', 'restructure'].includes(k))) {
      return this.goalTemplates.get('refactoring');
    }

    // Default to greenfield feature
    return this.goalTemplates.get('greenfield_feature');
  }

  /**
   * Decompose into detailed tasks
   */
  async decomposeTasks(parsed, template, level) {
    const tasks = [];

    if (level === 'high') {
      // High-level goal: decompose through all phases
      for (const phase of template.phases) {
        const phaseTasks = this.createPhaseTasks(phase, parsed);
        tasks.push(...phaseTasks);
      }
    } else if (level === 'medium') {
      // Medium-level goal: partial phases
      const relevantPhases = this.selectRelevantPhases(parsed, template);
      for (const phase of relevantPhases) {
        const phaseTasks = this.createPhaseTasks(phase, parsed);
        tasks.push(...phaseTasks);
      }
    } else {
      // Low-level goal: single task or small set
      tasks.push(this.createSingleTask(parsed));
    }

    return tasks;
  }

  /**
   * Create tasks for a specific phase
   */
  createPhaseTasks(phase, parsed) {
    const tasks = [];

    switch(phase) {
      case 'domain_research':
        tasks.push({
          id: `${phase}-1`,
          name: 'Conduct domain research',
          phase,
          agent: 'domain-researcher',
          inputs: [parsed.objective],
          outputs: ['domain-analysis.md'],
          estimatedEffort: 'medium',
          dependencies: []
        });
        tasks.push({
          id: `${phase}-2`,
          name: 'Create domain truth',
          phase,
          agent: 'oracle',
          inputs: ['domain-analysis.md'],
          outputs: ['domain-truth.yaml'],
          estimatedEffort: 'medium',
          dependencies: [`${phase}-1`]
        });
        break;

      case 'eval_foundation':
        tasks.push({
          id: `${phase}-1`,
          name: 'Generate test datasets',
          phase,
          agent: 'eval',
          inputs: ['domain-truth.yaml'],
          outputs: ['test-datasets/'],
          estimatedEffort: 'medium',
          dependencies: []
        });
        break;

      case 'discovery':
        tasks.push({
          id: `${phase}-1`,
          name: 'Create PRD',
          phase,
          agent: 'pm',
          inputs: ['domain-truth.yaml', parsed.objective],
          outputs: ['prd.md'],
          estimatedEffort: 'large',
          dependencies: []
        });
        tasks.push({
          id: `${phase}-2`,
          name: 'Validate PRD',
          phase,
          agent: 'oracle',
          inputs: ['prd.md', 'domain-truth.yaml'],
          outputs: ['validation-report'],
          estimatedEffort: 'small',
          dependencies: [`${phase}-1`]
        });
        break;

      case 'architecture':
        tasks.push({
          id: `${phase}-1`,
          name: 'Create architecture',
          phase,
          agent: 'architect',
          inputs: ['prd.md', 'domain-truth.yaml'],
          outputs: ['architecture.md'],
          estimatedEffort: 'large',
          dependencies: []
        });
        tasks.push({
          id: `${phase}-2`,
          name: 'Validate architecture',
          phase,
          agent: 'oracle',
          inputs: ['architecture.md', 'prd.md'],
          outputs: ['validation-report'],
          estimatedEffort: 'small',
          dependencies: [`${phase}-1`]
        });
        break;

      case 'planning':
        tasks.push({
          id: `${phase}-1`,
          name: 'Shard PRD into epics and stories',
          phase,
          agent: 'pm',
          inputs: ['prd.md'],
          outputs: ['epics/', 'stories/'],
          estimatedEffort: 'medium',
          dependencies: []
        });
        break;

      case 'development':
        tasks.push({
          id: `${phase}-1`,
          name: 'Implement stories',
          phase,
          agent: 'dev',
          inputs: ['stories/', 'prd.md', 'architecture.md'],
          outputs: ['code implementation'],
          estimatedEffort: 'xlarge',
          dependencies: []
        });
        tasks.push({
          id: `${phase}-2`,
          name: 'Run eval tests',
          phase,
          agent: 'eval',
          inputs: ['code', 'test-datasets/'],
          outputs: ['test-results'],
          estimatedEffort: 'medium',
          dependencies: [`${phase}-1`]
        });
        break;

      case 'root_cause_analysis':
        tasks.push({
          id: `${phase}-1`,
          name: 'Analyze bug root cause',
          phase,
          agent: 'reflection',
          inputs: [parsed.objective],
          outputs: ['root-cause-analysis.md'],
          estimatedEffort: 'medium',
          dependencies: []
        });
        break;

      case 'fix_planning':
        tasks.push({
          id: `${phase}-1`,
          name: 'Plan bug fix',
          phase,
          agent: 'dev',
          inputs: ['root-cause-analysis.md'],
          outputs: ['fix-plan.md'],
          estimatedEffort: 'small',
          dependencies: []
        });
        break;

      case 'implementation':
        tasks.push({
          id: `${phase}-1`,
          name: 'Implement fix/changes',
          phase,
          agent: 'dev',
          inputs: ['fix-plan.md'],
          outputs: ['code changes'],
          estimatedEffort: 'medium',
          dependencies: []
        });
        break;

      case 'validation':
        tasks.push({
          id: `${phase}-1`,
          name: 'Validate implementation',
          phase,
          agent: 'eval',
          inputs: ['code changes'],
          outputs: ['validation-results'],
          estimatedEffort: 'small',
          dependencies: []
        });
        tasks.push({
          id: `${phase}-2`,
          name: 'Run gate validation',
          phase,
          agent: 'validator',
          inputs: ['code changes'],
          outputs: ['gate-results'],
          estimatedEffort: 'small',
          dependencies: []
        });
        break;
    }

    return tasks;
  }

  /**
   * Select relevant phases based on goal
   */
  selectRelevantPhases(parsed, template) {
    // For medium-level goals, skip some phases
    const allPhases = template.phases;

    // If it's a simple enhancement, might skip domain_research
    if (parsed.entities.includes('bug') || parsed.keywords.includes('fix')) {
      return allPhases.filter(p => !['domain_research', 'eval_foundation'].includes(p));
    }

    return allPhases;
  }

  /**
   * Create a single task for low-level goals
   */
  createSingleTask(parsed) {
    return {
      id: 'task-1',
      name: parsed.objective,
      phase: 'execution',
      agent: this.selectAgentForGoal(parsed),
      inputs: [parsed.objective],
      outputs: ['result'],
      estimatedEffort: 'small',
      dependencies: []
    };
  }

  /**
   * Select appropriate agent for goal
   */
  selectAgentForGoal(parsed) {
    if (parsed.entities.includes('bug')) return 'dev';
    if (parsed.keywords.includes('validate')) return 'oracle';
    if (parsed.keywords.includes('test')) return 'eval';
    if (parsed.keywords.includes('analyze')) return 'reflection';
    if (parsed.keywords.includes('architecture')) return 'architect';
    if (parsed.keywords.includes('requirements') || parsed.keywords.includes('prd')) return 'pm';

    return 'dev'; // Default
  }

  /**
   * Create execution plan from tasks
   */
  createExecutionPlan(tasks, template) {
    // Calculate dependencies and order
    const orderedTasks = this.orderTasksByDependencies(tasks);

    // Add checkpoints
    const checkpoints = this.createCheckpoints(orderedTasks, template);

    // Calculate total effort
    const totalEffort = this.calculateTotalEffort(orderedTasks);

    return {
      tasks: orderedTasks,
      checkpoints,
      totalEffort,
      estimatedDuration: this.estimateDuration(totalEffort),
      successCriteria: template.successCriteriaTemplate
    };
  }

  /**
   * Order tasks by dependencies (topological sort)
   */
  orderTasksByDependencies(tasks) {
    // Simple ordering: maintain phase order and dependency order
    // In real implementation, would do proper topological sort

    const ordered = [];
    const completed = new Set();

    while (ordered.length < tasks.length) {
      for (const task of tasks) {
        if (completed.has(task.id)) continue;

        const depsMet = task.dependencies.every(dep => completed.has(dep));

        if (depsMet) {
          ordered.push(task);
          completed.add(task.id);
        }
      }
    }

    return ordered;
  }

  /**
   * Create checkpoints in execution plan
   */
  createCheckpoints(tasks, template) {
    const checkpoints = [];

    // Add template-defined checkpoints
    for (const checkpointType of template.defaultCheckpoints) {
      const checkpoint = this.createCheckpoint(checkpointType, tasks);
      if (checkpoint) {
        checkpoints.push(checkpoint);
      }
    }

    return checkpoints;
  }

  /**
   * Create a specific checkpoint
   */
  createCheckpoint(type, tasks) {
    const checkpointDefinitions = {
      after_domain_research: {
        name: 'Domain Research Complete',
        triggerPhase: 'domain_research',
        checks: ['domain-truth.yaml created', 'domain analysis complete']
      },
      after_prd: {
        name: 'PRD Complete',
        triggerPhase: 'discovery',
        checks: ['prd.md created', 'Oracle validation passed']
      },
      after_architecture: {
        name: 'Architecture Complete',
        triggerPhase: 'architecture',
        checks: ['architecture.md created', 'Architecture validated']
      },
      halfway: {
        name: 'Halfway Point',
        triggerTaskIndex: Math.floor(tasks.length / 2),
        checks: ['50% tasks complete', 'No blocking issues']
      },
      before_completion: {
        name: 'Final Review',
        triggerTaskIndex: tasks.length - 1,
        checks: ['All tasks complete', 'All validations passed']
      }
    };

    return checkpointDefinitions[type];
  }

  /**
   * Calculate total effort
   */
  calculateTotalEffort(tasks) {
    const effortMap = {
      small: 1,
      medium: 3,
      large: 8,
      xlarge: 20
    };

    return tasks.reduce((sum, task) => {
      return sum + (effortMap[task.estimatedEffort] || 1);
    }, 0);
  }

  /**
   * Estimate duration based on effort
   */
  estimateDuration(effort) {
    // Simplified: 1 effort point = 1 hour
    const hours = effort;
    const days = Math.ceil(hours / 6); // 6 productive hours per day

    return {
      hours,
      days,
      weeks: Math.ceil(days / 5)
    };
  }

  /**
   * Validate execution plan
   */
  async validatePlan(plan, parsedGoal) {
    const validation = {
      valid: true,
      issues: [],
      warnings: []
    };

    // Check if plan achieves goal
    const achievesGoal = this.checkGoalAchievement(plan, parsedGoal);
    if (!achievesGoal) {
      validation.valid = false;
      validation.issues.push('Plan may not achieve stated goal');
    }

    // Check dependencies
    const validDeps = this.checkDependencies(plan.tasks);
    if (!validDeps) {
      validation.valid = false;
      validation.issues.push('Task dependencies are invalid');
    }

    // Check success criteria
    if (!plan.successCriteria || plan.successCriteria.length === 0) {
      validation.warnings.push('No success criteria defined');
    }

    return {
      ...plan,
      validation
    };
  }

  /**
   * Check if plan achieves goal
   */
  checkGoalAchievement(plan, parsedGoal) {
    // Simplified check: ensure relevant agents are involved
    const agents = new Set(plan.tasks.map(t => t.agent));

    // If goal mentions specific entities, ensure relevant agents present
    if (parsedGoal.entities.includes('feature') || parsedGoal.entities.includes('system')) {
      return agents.has('pm') && agents.has('architect') && agents.has('dev');
    }

    if (parsedGoal.entities.includes('bug')) {
      return agents.has('reflection') && agents.has('dev');
    }

    return true;
  }

  /**
   * Check dependency validity
   */
  checkDependencies(tasks) {
    const taskIds = new Set(tasks.map(t => t.id));

    for (const task of tasks) {
      for (const dep of task.dependencies) {
        if (!taskIds.has(dep)) {
          return false; // Invalid dependency
        }
      }
    }

    return true;
  }

  /**
   * Get template by name
   */
  getTemplate(name) {
    return this.goalTemplates.get(name);
  }

  /**
   * List all available templates
   */
  listTemplates() {
    return Array.from(this.goalTemplates.entries()).map(([key, template]) => ({
      id: key,
      name: template.name,
      phases: template.phases,
      agents: template.defaultAgents
    }));
  }

  /**
   * Add custom template
   */
  addTemplate(id, template) {
    this.goalTemplates.set(id, template);
  }
}

export default GoalDecomposer;
