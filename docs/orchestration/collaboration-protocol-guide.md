# Collaboration Protocol Guide

**Component:** Agent Collaboration Framework v2.0
**File:** `bmad-core/orchestration/collaboration.js`

## Purpose

The Collaboration Framework manages agent communication, coordination, and collaboration patterns, enabling agents to work together efficiently through sequential, parallel, collaborative, and competitive modes.

## Collaboration Modes

### 1. Sequential
Agents execute one after another, each building on previous output.

**Use Case:** Pipeline processing
**Example:** Analyst → Oracle → Eval

```javascript
await collab.executeSequential(
  ['analyst', 'oracle', 'eval'],
  'domain-research',
  { initialInput: projectBrief }
);
```

**Flow:**
1. Analyst completes → output
2. Oracle validates output → validated output
3. Eval creates tests from validated output → final result

### 2. Parallel
Agents execute simultaneously on same input.

**Use Case:** Independent validations
**Example:** Oracle + Eval + Validator (PRD validation)

```javascript
await collab.executeParallel(
  ['oracle', 'eval', 'validator'],
  'validate-prd',
  { input: prd }
);
```

**Flow:**
1. All agents start together
2. Execute independently
3. Wait for all to complete
4. Aggregate results

### 3. Collaborative
Primary agent with supporting agent providing continuous feedback.

**Use Case:** Real-time validation
**Example:** Dev + Eval (continuous testing)

```javascript
await collab.executeCollaborative(
  'dev',              // primary
  'eval',             // supporting
  'implement-feature',
  { story: storyData }
);
```

**Flow:**
1. Dev implements (primary)
2. Eval watches and validates (supporting)
3. Continuous feedback loop
4. Integrated result

### 4. Competitive
Multiple agents solve same problem, best solution wins.

**Use Case:** Multiple solutions
**Example:** Multiple architecture proposals

```javascript
await collab.executeCompetitive(
  ['architect1', 'architect2', 'architect3'],
  'design-system',
  { requirements: prd }
);
```

**Flow:**
1. All agents generate solutions
2. Oracle/Validator score solutions
3. Best solution selected
4. Return winner

## Dependency Management

Agents have dependencies defined in `collaboration-modes.yaml`:

```yaml
oracle:
  depends_on: []
  required_by: [eval, validator, pm, architect, dev]

eval:
  depends_on: [oracle]
  required_by: [dev, qa, validator]
```

### Execute with Dependencies

Automatically resolves dependencies and executes in correct order:

```javascript
await collab.executeWithDependencies(
  ['dev', 'eval', 'oracle', 'validator'],
  'validate-implementation'
);
```

**Process:**
1. Build dependency graph
2. Topological sort
3. Group by dependency level
4. Execute levels in parallel where possible

## Agent Communication

### Message Types

**Task Request:**
```javascript
{
  type: 'task_request',
  from: 'orchestrator',
  to: 'oracle',
  payload: {
    task_id: 'unique_id',
    task_type: 'validate-artifact',
    inputs: { artifact: 'prd.md' },
    priority: 'high'
  }
}
```

**Task Response:**
```javascript
{
  type: 'task_response',
  from: 'oracle',
  to: 'orchestrator',
  payload: {
    task_id: 'unique_id',
    status: 'complete',
    result: { validated: true },
    metadata: { confidence: 0.95 }
  }
}
```

**Notification:**
```javascript
{
  type: 'notification',
  from: 'oracle',
  to: 'all_agents',
  payload: {
    event: 'domain_truth_updated',
    affected_artifacts: ['prd.md']
  }
}
```

## Conflict Resolution

When agents disagree:

```javascript
const resolution = await collab.resolveConflict({
  agents: ['oracle', 'validator'],
  issue: 'validation_disagreement',
  contexts: {
    oracle: { result: 'valid', confidence: 0.9 },
    validator: { result: 'broken_chain', confidence: 0.85 }
  }
});
```

**Resolution Rules:**
1. Truth-keepers (Oracle, Eval) have highest priority
2. Validator overrides on traceability issues
3. Check confidence scores
4. If unresolved → route to human

## Handoffs

### Explicit Handoff

Deliberate hand-off between agents:

```javascript
await collab.handoff(
  'analyst',
  'oracle',
  { domainAnalysis: analysisData },
  { validate: true }
);
```

**Protocol:**
1. Agent A signals completion
2. Agent A packages outputs
3. Orchestrator validates outputs (if requested)
4. Orchestrator invokes Agent B
5. Agent B acknowledges receipt
6. Agent B begins work

### Implicit Handoff

Automatic triggering based on events:

```javascript
// File save event automatically triggers
sm.on('artifact-created', async ({ artifact }) => {
  await collab.executeParallel(
    ['oracle', 'eval', 'validator'],
    'validate-artifact',
    { artifact }
  );
});
```

## Message Bus

Underlying communication system:

```javascript
const messageBus = collab.messageBus;

// Subscribe to messages
messageBus.subscribe('oracle', (message) => {
  console.log('Oracle received:', message);
});

// Send message
await messageBus.send({
  type: 'task_request',
  from: 'orchestrator',
  to: 'oracle',
  payload: { task: 'validate' }
}, 30000); // timeout
```

## Events

```javascript
// Collaboration events
collab.on('collaboration-started', (data) => {});
collab.on('collaboration-completed', (data) => {});

// Agent events
collab.on('agent-starting', (data) => {});
collab.on('agent-completed', (data) => {});

// Conflict events
collab.on('conflict-detected', (data) => {});
collab.on('conflict-resolved', (data) => {});

// Handoff events
collab.on('handoff-started', (data) => {});
collab.on('handoff-completed', (data) => {});
collab.on('handoff-failed', (data) => {});
```

## Configuration

Collaboration modes in `collaboration-modes.yaml`:

```yaml
collaboration_modes:
  sequential:
    description: "Agents execute one after another"
    examples:
      - "Analyst → Oracle → Eval"

  parallel:
    description: "Agents execute simultaneously"
    examples:
      - "Oracle + Eval + Validator"

workflow_patterns:
  domain_research_flow:
    mode: sequential
    agents: [analyst, oracle, eval]

  prd_validation_flow:
    mode: parallel
    agents: [oracle, eval, validator]
```

## API Reference

### Initialize
```javascript
const collab = new CollaborationFramework(config);
await collab.initialize();
```

### Execute Sequential
```javascript
const result = await collab.executeSequential(agents, task, options);
```

### Execute Parallel
```javascript
const result = await collab.executeParallel(agents, task, options);
```

### Execute Collaborative
```javascript
const result = await collab.executeCollaborative(primary, supporting, task, options);
```

### Execute Competitive
```javascript
const result = await collab.executeCompetitive(agents, task, options);
```

### Execute with Dependencies
```javascript
const result = await collab.executeWithDependencies(agents, task, options);
```

### Resolve Conflict
```javascript
const resolution = await collab.resolveConflict(conflict);
```

### Handoff
```javascript
const result = await collab.handoff(fromAgent, toAgent, data, options);
```

### Get Active Collaborations
```javascript
const active = collab.getActiveCollaborations();
```

## Best Practices

1. **Choose right mode**: Match collaboration mode to use case
2. **Respect dependencies**: Let framework resolve dependencies
3. **Handle conflicts**: Define clear resolution rules
4. **Monitor collaborations**: Track active collaborations
5. **Use handoffs**: Explicit handoffs for critical transitions
6. **Configure patterns**: Define reusable workflow patterns

## Example Integration

```javascript
import CollaborationFramework from './bmad-core/orchestration/collaboration.js';

const collab = new CollaborationFramework();
await collab.initialize();

// Domain research workflow
async function domainResearch() {
  // Sequential: Analyst → Oracle → Eval
  const result = await collab.executeSequential(
    ['analyst', 'oracle', 'eval'],
    'domain-research'
  );

  return result.final_output;
}

// PRD validation workflow
async function validatePRD(prd) {
  // Parallel: Oracle + Eval + Validator
  const result = await collab.executeParallel(
    ['oracle', 'eval', 'validator'],
    'validate-prd',
    { input: prd }
  );

  if (!result.success) {
    console.log('Validation failures:', result.failures);
  }

  return result;
}

// Development workflow
async function developFeature(story) {
  // Collaborative: Dev + Eval
  const result = await collab.executeCollaborative(
    'dev',
    'eval',
    'implement-feature',
    { story }
  );

  return result;
}

// Handle conflicts
collab.on('conflict-detected', async (conflict) => {
  const resolution = await collab.resolveConflict(conflict);

  if (resolution.escalated) {
    // Alert human
    console.log('Conflict escalated to human:', conflict);
  }
});
```

See [Orchestration System Guide](./orchestration-system-guide.md) for complete integration.
