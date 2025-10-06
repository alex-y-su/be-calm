# BMAD Intelligence System Guide

**Version:** 1.0
**Stage:** 5 - Intelligence & Optimization
**Date:** 2025-10-05

---

## Overview

The BMAD Intelligence System is an advanced AI orchestration layer that adds predictive, adaptive, and autonomous capabilities to the BMAD workflow. It enables the system to:

- **Route intelligently** - Understand user intent and select optimal agents
- **Predict proactively** - Anticipate needs before they arise
- **Execute autonomously** - Decompose goals and execute complex multi-agent workflows
- **Collaborate intelligently** - Coordinate swarms of agents for optimal results
- **Self-heal** - Detect and recover from failures automatically
- **Learn continuously** - Improve performance based on historical data

---

## Architecture

The Intelligence System consists of six core components:

```
┌─────────────────────────────────────────────────────────┐
│            Intelligence System (Main)                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Smart Router │  │  Prediction  │  │     Goal     │ │
│  │              │  │    Engine    │  │  Decomposer  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Swarm     │  │   Natural    │  │Parallelization││
│  │ Coordinator  │  │  Language    │  │    Engine    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐                                      │
│  │ Self-Healer  │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

### Core Components

1. **Smart Router** - Intent-based agent selection and routing
2. **Prediction Engine** - Predictive orchestration and suggestions
3. **Goal Decomposer** - Goal-oriented autonomous execution
4. **Swarm Coordinator** - Multi-agent collaboration intelligence
5. **Natural Language Interface** - Conversational AI interaction
6. **Parallelization Engine** - Intelligent task parallelization
7. **Self-Healer** - Automatic error recovery and maintenance

---

## Quick Start

### Installation

The Intelligence System is included in Stage 5 of BMAD:

```javascript
const { IntelligenceSystem } = require('./bmad-core/intelligence');

// Initialize with default configuration
const intelligence = new IntelligenceSystem();

// Or with custom configuration
const intelligence = new IntelligenceSystem({
  routing: { /* routing config */ },
  prediction: { /* prediction config */ },
  goals: { /* goal config */ },
  // ... other configs
});
```

### Basic Usage

#### Process a User Request

```javascript
const response = await intelligence.processRequest(
  "Create a PRD for user authentication",
  {
    currentPhase: 'discovery',
    projectType: 'greenfield'
  }
);

console.log(response.routing.agents);      // Selected agents
console.log(response.predictions);          // Next step predictions
console.log(response.suggestions);          // Proactive suggestions
```

#### Decompose and Execute a Goal

```javascript
const result = await intelligence.executeGoal(
  "Build a user authentication system",
  { autoExecute: true }
);

console.log(result.plan);                   // Execution plan
console.log(result.results);                // Execution results
console.log(result.success);                // Overall success
```

#### Create a Competitive Swarm

```javascript
const swarmResult = await intelligence.competitiveSwarm(
  "Design the authentication architecture",
  ['architect', 'architect', 'architect'],  // 3 instances compete
  { scoringCriteria: { quality: 0.7, speed: 0.3 } }
);

console.log(swarmResult.winner);           // Best agent
console.log(swarmResult.bestResult);       // Best result
```

---

## Component Guides

### 1. Smart Router

**Purpose:** Intelligently route user requests to optimal agents based on intent, context, and patterns.

**Key Features:**
- Intent parsing (create, validate, fix, analyze, etc.)
- Context-aware routing (phase-based, pattern-based)
- Fuzzy matching for ambiguous requests
- Confidence scoring
- Learning from routing effectiveness

**Usage:**

```javascript
const { SmartRouter } = require('./bmad-core/intelligence');
const router = new SmartRouter();

const routing = await router.route(
  "Fix the failing eval test",
  {
    currentPhase: 'development',
    recentFailures: ['eval-test-failure']
  }
);

console.log(routing.agents);              // [dev, reflection, eval]
console.log(routing.confidence);          // 0.87
console.log(routing.collaborationMode);   // 'sequential'
```

**See:** [Smart Router Guide](./intelligence-router-guide.md)

### 2. Prediction Engine

**Purpose:** Predict next agents, required artifacts, validation triggers, and potential bottlenecks.

**Key Features:**
- Agent transition prediction (Markov chains)
- Artifact dependency prediction
- Validation trigger prediction
- Bottleneck detection
- Proactive suggestions

**Usage:**

```javascript
const { PredictionEngine } = require('./bmad-core/intelligence');
const predictor = new PredictionEngine();
predictor.initialize();

const nextAgents = predictor.predictNextAgent('pm', {
  currentPhase: 'discovery'
});

const artifacts = predictor.predictArtifacts('architecture', 'architect');

const suggestions = predictor.generateSuggestions({
  phaseCompleted: true,
  currentPhase: 'discovery',
  testCoverage: 0.75
});
```

**See:** [Prediction Engine Guide](./intelligence-prediction-guide.md)

### 3. Goal Decomposer

**Purpose:** Transform high-level goals into executable task plans with autonomous execution.

**Key Features:**
- Goal parsing and intent extraction
- Template-based decomposition
- Phase mapping and agent assignment
- Checkpoint system
- Adaptive re-planning

**Usage:**

```javascript
const { GoalDecomposer } = require('./bmad-core/intelligence');
const decomposer = new GoalDecomposer();

const plan = await decomposer.decomposeGoal(
  "Build user authentication with OAuth2 and JWT",
  { template: 'greenfield_feature' }
);

console.log(plan.tasks);                  // Detailed task list
console.log(plan.checkpoints);            // Validation checkpoints
console.log(plan.totalEffort);            // Estimated effort
```

**See:** [Goal Decomposition Guide](./intelligence-goals-guide.md)

### 4. Swarm Coordinator

**Purpose:** Coordinate multiple agent instances for competitive or collaborative workflows.

**Key Features:**
- Competitive swarms (best result selected)
- Collaborative swarms (work division)
- Validation swarms (cross-checking)
- Agent specialization tracking
- Meta-learning

**Usage:**

```javascript
const { SwarmCoordinator } = require('./bmad-core/intelligence');
const swarm = new SwarmCoordinator();

// Competitive: Multiple agents compete
const competitive = await swarm.createCompetitiveSwarm(
  "Design authentication flow",
  ['architect', 'architect', 'architect']
);

// Collaborative: Agents divide work
const collaborative = await swarm.createCollaborativeSwarm(
  "Create comprehensive test suite",
  ['eval', 'eval', 'eval'],
  { divisionStrategy: 'by_capability' }
);

// Validation: Multiple validators cross-check
const validation = await swarm.createValidationSwarm(
  prdDocument,
  ['oracle', 'validator', 'eval']
);
```

**See:** [Swarm Coordination Guide](./intelligence-swarm-guide.md)

### 5. Natural Language Interface

**Purpose:** Provide conversational AI interaction with context awareness and intent understanding.

**Key Features:**
- Intent understanding
- Pronoun resolution
- Clarifying questions
- Context-aware responses
- Progress updates

**Usage:**

```javascript
const { NaturalLanguageInterface } = require('./bmad-core/intelligence');
const nlInterface = new NaturalLanguageInterface();

const response = await nlInterface.processMessage(
  "Make it better",
  { lastArtifact: 'prd.md', currentPhase: 'discovery' }
);

console.log(response.type);               // 'clarification' or 'action'
console.log(response.message);            // User-friendly message
console.log(response.actions);            // Suggested actions
```

**See:** [Natural Language Guide](./intelligence-nl-guide.md)

### 6. Parallelization Engine

**Purpose:** Automatically detect parallelization opportunities and optimize execution.

**Key Features:**
- Dependency graph analysis
- Resource-aware scheduling (CPU/IO classification)
- Parallel validation orchestration
- Throughput maximization

**Usage:**

```javascript
const { ParallelizationEngine } = require('./bmad-core/intelligence');
const parallel = new ParallelizationEngine();

const results = await parallel.executeTasks(
  [task1, task2, task3, task4],
  { maxConcurrency: 4 }
);

console.log(results.parallelizationGain);  // 0.65 (65% time saved)
console.log(results.stages);                // Execution stages
```

**See:** [Parallelization Guide](./intelligence-parallel-guide.md)

### 7. Self-Healer

**Purpose:** Detect failures, apply known fixes, and maintain system health proactively.

**Key Features:**
- Automatic error detection
- Root cause analysis
- Known fix application
- Retry with adjustments
- Degraded mode operation
- Proactive maintenance

**Usage:**

```javascript
const { SelfHealingSystem } = require('./bmad-core/intelligence');
const healer = new SelfHealingSystem();

// Handle a failure
const recovery = await healer.handleFailure({
  type: 'eval_test_failure',
  message: 'Assertion failed: expected user but got customer',
  agent: 'eval'
});

console.log(recovery.recovered);           // true
console.log(recovery.strategy);            // 'check_domain_truth'

// Proactive maintenance
const maintenance = await healer.performProactiveMaintenance();
console.log(maintenance.issuesFixed);      // ['stale_test_datasets']
```

**See:** [Self-Healing Guide](./intelligence-healing-guide.md)

---

## Configuration

### Loading Configuration

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

// Load configurations
const routingRules = yaml.load(
  fs.readFileSync('bmad-core/config/intelligence/routing-rules.yaml', 'utf8')
);

const predictionModels = yaml.load(
  fs.readFileSync('bmad-core/config/intelligence/prediction-models.yaml', 'utf8')
);

const goalTemplates = yaml.load(
  fs.readFileSync('bmad-core/config/intelligence/goal-templates.yaml', 'utf8')
);

// Initialize with configurations
const intelligence = new IntelligenceSystem({
  routing: routingRules,
  prediction: predictionModels,
  goals: goalTemplates
});
```

### Configuration Files

- **routing-rules.yaml** - Agent capabilities, routing patterns, confidence thresholds
- **prediction-models.yaml** - Transition matrices, artifact dependencies, validation triggers
- **goal-templates.yaml** - Goal templates, checkpoints, effort estimation

**See:** Configuration files in `bmad-core/config/intelligence/`

---

## Monitoring & Analytics

### System Statistics

```javascript
const stats = intelligence.getSystemStatistics();

console.log(stats.routing.successRate);           // 0.92
console.log(stats.prediction.averageConfidence);  // 0.85
console.log(stats.swarm.totalSwarms);             // 47
console.log(stats.parallelization.averageGain);   // 0.58
console.log(stats.selfHealing.healingRate);       // 0.81
```

### Health Check

```javascript
const health = await intelligence.healthCheck();

console.log(health.overall);                      // 'healthy' or 'degraded'
console.log(health.components);                   // Per-component health
console.log(health.degraded);                     // List of degraded components
console.log(health.recommendations);              // Actionable recommendations
```

### Failure Patterns

```javascript
const patterns = intelligence.getFailurePatterns();

patterns.forEach(pattern => {
  console.log(`${pattern.type}: ${pattern.count} occurrences (${pattern.percentage}%)`);
  console.log(`Examples:`, pattern.examples);
});
```

### Agent Specialization

```javascript
const specialization = intelligence.getSpecializationReport();

specialization.forEach(report => {
  console.log(`${report.agent}: ${report.overallSuccessRate}`);
  console.log(`Specializations:`, report.specializations);
});
```

---

## Best Practices

### 1. Use Natural Language Interface for User Interaction

```javascript
// Good: Let NL interface handle ambiguity
const response = await intelligence.processRequest(
  userInput,
  workflowContext
);

// Handle clarifications
if (response.needsUserInput) {
  // Present clarification question to user
  presentOptions(response.message, response.options);
}
```

### 2. Leverage Predictions for Proactive Loading

```javascript
// Predict and pre-load artifacts
const predictions = await intelligence.predictNextSteps(routing, context);

for (const artifact of predictions.artifacts) {
  if (artifact.probability > 0.8) {
    preloadArtifact(artifact.artifact);
  }
}
```

### 3. Use Swarms for Critical Decisions

```javascript
// Use competitive swarm for important architecture decisions
const architectureResult = await intelligence.competitiveSwarm(
  "Design the system architecture for authentication",
  ['architect', 'architect', 'architect'],
  {
    scoringCriteria: {
      quality: 0.6,
      completeness: 0.3,
      speed: 0.1
    }
  }
);
```

### 4. Enable Self-Healing for Production

```javascript
// Configure self-healing with auto-recovery
const intelligence = new IntelligenceSystem({
  healing: {
    autoRecover: true,
    maxRetries: 3,
    degradedModeEnabled: true
  }
});

// Regular maintenance
setInterval(async () => {
  await intelligence.maintenance();
}, 24 * 60 * 60 * 1000); // Daily
```

### 5. Track and Learn from Outcomes

```javascript
// Update routing outcome for learning
const routingId = response.routing.id;

// After task completion
intelligence.router.updateRoutingOutcome(
  routingId,
  'success',
  { userFeedback: 'Excellent routing' }
);

// Track suggestion acceptance
intelligence.predictor.trackSuggestionAcceptance(
  suggestion.action,
  userAccepted
);
```

---

## Advanced Topics

### Custom Goal Templates

```javascript
decomposer.addTemplate('custom_workflow', {
  name: 'Custom Workflow',
  phases: ['phase1', 'phase2', 'phase3'],
  defaultAgents: ['agent1', 'agent2'],
  defaultCheckpoints: ['checkpoint1'],
  successCriteriaTemplate: ['criteria1', 'criteria2']
});
```

### Extending Recovery Strategies

```javascript
healer.recoveryStrategies.set('custom_fix', {
  name: 'Custom Fix',
  execute: async (context) => {
    // Custom recovery logic
    return { success: true, message: 'Fixed' };
  },
  maxAttempts: 2
});
```

### Exporting/Importing Learning Data

```javascript
// Export learned data
const data = intelligence.exportData();
fs.writeFileSync('intelligence-data.json', JSON.stringify(data));

// Import learned data
const loadedData = JSON.parse(fs.readFileSync('intelligence-data.json'));
intelligence.importData(loadedData);
```

---

## Troubleshooting

### Low Routing Confidence

**Issue:** Router confidence consistently below 0.7

**Solutions:**
- Provide more context in requests
- Use more specific language
- Train router with more examples
- Review and update routing rules

### Prediction Inaccuracy

**Issue:** Next agent predictions frequently wrong

**Solutions:**
- Feed more historical workflow data
- Review transition matrix probabilities
- Enable learning and let system adapt
- Verify phase context is correct

### Swarm Coordination Failures

**Issue:** Swarm results inconsistent or errors

**Solutions:**
- Check agent availability
- Verify work division strategy
- Review agent specialization data
- Ensure sufficient resources for concurrency

### Self-Healing Not Recovering

**Issue:** System fails to recover from errors

**Solutions:**
- Check if issue type is known
- Add recovery strategy for new issue types
- Verify degraded mode configuration
- Review failure history for patterns

---

## Performance Tuning

### Concurrency Limits

```javascript
const intelligence = new IntelligenceSystem({
  parallel: {
    maxCpuConcurrency: 4,       // CPU-bound tasks
    maxIoConcurrency: 10,       // IO-bound tasks
    maxMixedConcurrency: 6      // Mixed workload
  }
});
```

### Confidence Thresholds

```javascript
const intelligence = new IntelligenceSystem({
  routing: {
    autoRouteThreshold: 0.9,    // Route automatically above this
    suggestThreshold: 0.7,      // Suggest above this
    confirmThreshold: 0.0       // Confirm below suggest threshold
  }
});
```

### Learning Rate

```javascript
const intelligence = new IntelligenceSystem({
  prediction: {
    learningRate: 0.1,          // How quickly to adapt (0-1)
    minProbability: 0.1,        // Minimum transition probability
    maxProbability: 0.95        // Maximum transition probability
  }
});
```

---

## Next Steps

1. **Read Component Guides** - Deep dive into each intelligence component
2. **Review Configuration** - Customize routing rules and prediction models
3. **Run Examples** - Try the example workflows in `tests/intelligence/`
4. **Monitor Performance** - Track statistics and optimize
5. **Contribute Learning Data** - Share anonymized learning data to improve models

---

## Related Documentation

- [Smart Router Guide](./intelligence-router-guide.md)
- [Prediction Engine Guide](./intelligence-prediction-guide.md)
- [Goal Decomposition Guide](./intelligence-goals-guide.md)
- [Swarm Coordination Guide](./intelligence-swarm-guide.md)
- [Natural Language Guide](./intelligence-nl-guide.md)
- [Parallelization Guide](./intelligence-parallel-guide.md)
- [Self-Healing Guide](./intelligence-healing-guide.md)
- [Configuration Reference](./intelligence-config-reference.md)

---

**Questions or Issues?**
- GitHub: https://github.com/alexsu/be-calm
- Discord: https://discord.gg/gk8jAdXWmj
