# BMAD Orchestration System Guide

**Version:** 2.0
**Stage:** 4 - Orchestration & State Machine
**Status:** Complete

## Overview

The BMAD Orchestration System is the autonomous control layer that enables agents to collaborate, make decisions, and navigate workflows without constant human intervention. It consists of five integrated components:

1. **State Machine** - Manages workflow states and transitions
2. **Orchestrator** - Coordinates agent execution and enforces rules
3. **Decision Engine** - Handles autonomous decision-making with confidence scoring
4. **Collaboration Framework** - Manages agent communication and coordination
5. **Background Executor** - Runs agents in background without blocking

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Orchestration Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐      ┌──────────────────┐              │
│  │ State Machine  │◄────►│  Orchestrator    │              │
│  └────────────────┘      └──────────────────┘              │
│         │                         │                          │
│         │                         ▼                          │
│         │                ┌──────────────────┐               │
│         └───────────────►│ Decision Engine  │               │
│                          └──────────────────┘               │
│                                   │                          │
│                                   ▼                          │
│                  ┌────────────────────────────┐             │
│                  │ Collaboration Framework    │             │
│                  └────────────────────────────┘             │
│                                   │                          │
│                                   ▼                          │
│                  ┌────────────────────────────┐             │
│                  │  Background Executor       │             │
│                  └────────────────────────────┘             │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                        Agent Layer                            │
│  Oracle  │  Eval  │  Validator  │  Monitor  │  Reflection   │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. State Machine

**Purpose:** Manages workflow states and transitions

**Key Features:**
- Automatic state transitions when conditions are met
- State persistence and recovery
- Rollback capability
- Blocking conditions
- Exit condition tracking
- Metadata management per state

**States:**
- `codebase_discovery` (brownfield only)
- `domain_research` (universal)
- `eval_foundation` (universal)
- `compatibility_analysis` (brownfield only)
- `discovery` (universal)
- `architecture` (universal)
- `planning` (universal)
- `development` (universal)

**Usage:**
```javascript
import StateMachine from './bmad-core/orchestration/state-machine.js';

const sm = new StateMachine();
await sm.initialize('greenfield');

// Check current state
const state = sm.getCurrentState();

// Update metadata
sm.updateMetadata({ completion_percentage: 50 });

// Mark exit condition
sm.markExitCondition('domain_truth_created', true);

// Transition to next state
await sm.transitionTo('eval_foundation');
```

### 2. Orchestrator

**Purpose:** Coordinates agent execution and enforces orchestration rules

**Key Features:**
- Parallel validation of artifacts
- Auto-recovery flow for issues
- Blocking condition enforcement
- Issue routing to appropriate agents
- Never-proceed-without rules

**Orchestration Rules:**
- Never proceed without Oracle validation
- Never proceed without 100% eval test coverage
- Never proceed without complete traceability
- Auto-block on test failures (<90% pass rate)
- Auto-block on critical drift

**Usage:**
```javascript
import Orchestrator from './bmad-core/orchestration/orchestrator.js';

const orchestrator = new Orchestrator(stateMachine, decisionEngine);
await orchestrator.initialize();

// Execute with parallel validation
const result = await orchestrator.executeWithParallelValidation(
  'pm',
  'create-prd',
  { artifact: 'prd.md' }
);

// Check blocking conditions
const blocking = await orchestrator.checkBlockingConditions({
  eval_pass_rate: 85,
  oracle_validated: true
});
```

### 3. Decision Engine

**Purpose:** Manages autonomous decision-making with confidence scoring

**Key Features:**
- Four decision levels (fully automatic, with notification, with preview, require approval)
- Confidence scoring (0.0 - 1.0)
- Agent capability definitions
- Approval workflow
- Preview system with auto-execute

**Decision Levels:**
- **Fully Automatic** (confidence ≥ 0.95): Execute immediately
- **With Notification** (0.80 ≤ confidence < 0.95): Execute and notify
- **With Preview** (0.65 ≤ confidence < 0.80): Show preview, auto-execute after delay
- **Require Approval** (confidence < 0.65): Wait for human approval

**Usage:**
```javascript
import DecisionEngine from './bmad-core/orchestration/decision-engine.js';

const de = new DecisionEngine();
await de.initialize();

// Make a decision
const result = await de.makeDecision(
  'dev',
  'merge_to_main',
  { eval_tests_pass: true, oracle_validated: true }
);

// Check if agent can auto-proceed
const canProceed = de.canAutoProceed('dev', {
  eval_tests_pass: true,
  oracle_validated: true,
  traceability_confirmed: true
});
```

### 4. Collaboration Framework

**Purpose:** Manages agent communication and coordination

**Key Features:**
- Four collaboration modes (sequential, parallel, collaborative, competitive)
- Agent message bus
- Dependency management
- Conflict resolution
- Explicit and implicit handoffs

**Collaboration Modes:**
- **Sequential**: Agents execute one after another (A → B → C)
- **Parallel**: Agents execute simultaneously
- **Collaborative**: Primary agent with supporting agent (Dev + Eval)
- **Competitive**: Multiple agents solve same problem, best wins

**Usage:**
```javascript
import CollaborationFramework from './bmad-core/orchestration/collaboration.js';

const collab = new CollaborationFramework();
await collab.initialize();

// Sequential execution
await collab.executeSequential(
  ['analyst', 'oracle', 'eval'],
  'domain-research'
);

// Parallel execution
await collab.executeParallel(
  ['oracle', 'eval', 'validator'],
  'validate-prd'
);

// Collaborative execution
await collab.executeCollaborative(
  'dev',
  'eval',
  'implement-feature'
);
```

### 5. Background Executor

**Purpose:** Runs agents in background without blocking main workflow

**Key Features:**
- Three execution modes (fire-and-forget, async-callback, watched)
- Priority queue
- Resource monitoring and throttling
- Concurrency management
- Result aggregation

**Execution Modes:**
- **Fire-and-Forget**: Start agent, don't wait
- **Async-Callback**: Start agent, callback when done
- **Watched**: Start agent, periodic status updates

**Usage:**
```javascript
import BackgroundExecutor from './bmad-core/orchestration/background-executor.js';

const bg = new BackgroundExecutor();
await bg.initialize();

// Fire and forget
await bg.fireAndForget('monitor', 'track-metrics');

// With callback
await bg.executeWithCallback('eval', 'generate-tests', (err, result) => {
  console.log('Tests generated:', result);
});

// Watched execution
const { executionId } = await bg.executeWatched('qa', 'run-full-suite');
```

## Integration Example

Complete integration of all components:

```javascript
import StateMachine from './bmad-core/orchestration/state-machine.js';
import Orchestrator from './bmad-core/orchestration/orchestrator.js';
import DecisionEngine from './bmad-core/orchestration/decision-engine.js';
import CollaborationFramework from './bmad-core/orchestration/collaboration.js';
import BackgroundExecutor from './bmad-core/orchestration/background-executor.js';

// Initialize components
const sm = new StateMachine();
await sm.initialize('greenfield');

const de = new DecisionEngine();
await de.initialize();

const orchestrator = new Orchestrator(sm, de);
await orchestrator.initialize();

const collab = new CollaborationFramework();
await collab.initialize();

const bg = new BackgroundExecutor();
await bg.initialize();

// Wire up events
sm.on('transition', async (event) => {
  console.log(`State transition: ${event.from} → ${event.to}`);

  // Trigger agents for new state
  const state = sm.getCurrentState();
  await collab.executeWithDependencies(state.agents, 'initialize');
});

orchestrator.on('workflow-blocked', async (event) => {
  console.log('Workflow blocked:', event.reason);

  // Attempt auto-recovery
  const recovery = await orchestrator.executeAutoRecovery(event);

  if (recovery.recovered) {
    sm.unblock('auto-recovery-successful');
  }
});

// Execute workflow
async function runWorkflow() {
  // Phase 1: Domain Research
  const domainResult = await collab.executeSequential(
    ['analyst', 'oracle', 'eval'],
    'domain-research'
  );

  sm.markExitCondition('domain_truth_created', true);

  // Auto-transition when ready
  if (await sm.checkAutoTransition()) {
    await sm.transitionTo('eval_foundation');
  }
}

runWorkflow();
```

## Configuration

All components are configured via YAML files in `bmad-core/config/`:

- `orchestration-rules.yaml` - Orchestration rules and blocking conditions
- `decision-levels.yaml` - Decision levels and confidence routing
- `agent-capabilities.yaml` - What each agent can do autonomously
- `collaboration-modes.yaml` - Collaboration patterns and dependencies

## State Persistence

Workflow state is persisted in `.bmad-state/workflow-state.yaml`:
- Auto-saved on every transition
- Backed up to `.bmad-state/backups/`
- Auto-recovery on crash
- Manual rollback capability

## Event System

All components emit events for integration:

```javascript
// State Machine events
sm.on('transition', handler);
sm.on('workflow-blocked', handler);
sm.on('exit-condition-updated', handler);

// Orchestrator events
orchestrator.on('artifact-validated', handler);
orchestrator.on('auto-recovery-completed', handler);

// Decision Engine events
de.on('approval-required', handler);
de.on('preview-shown', handler);

// Collaboration events
collab.on('collaboration-completed', handler);
collab.on('conflict-detected', handler);

// Background Executor events
bg.on('execution-completed', handler);
bg.on('progress-update', handler);
```

## Best Practices

1. **Let the system manage workflow**: Trust the state machine and orchestrator
2. **Listen to events**: Monitor system behavior through events
3. **Configure, don't code**: Use YAML config files for rules
4. **Handle blocks gracefully**: Implement recovery or alert humans
5. **Test transitions**: Verify exit conditions before transitions
6. **Monitor resources**: Watch background executor resource usage
7. **Validate decisions**: Review decision confidence scores
8. **Resolve conflicts**: Have clear resolution strategies

## Monitoring

Monitor orchestration health:

```javascript
// State Machine status
const progress = sm.getProgress();
console.log(`Progress: ${progress.progress_percentage}%`);

// Orchestrator status
const orchStatus = orchestrator.getStatus();
console.log(`Active agents: ${orchStatus.active_agents.length}`);

// Decision Engine status
const deStatus = de.getStatus();
console.log(`Pending approvals: ${deStatus.pending_approvals}`);

// Background Executor status
const bgStatus = bg.getStatus();
console.log(`Running: ${bgStatus.running}/${bgStatus.max_concurrent}`);
```

## Troubleshooting

### Workflow stuck
- Check exit conditions: `sm.checkExitConditions()`
- Review blocking issues: `sm.getMetadata().blocking_issues`
- Check pending approvals: `de.getPendingApprovals()`

### Agent conflicts
- Review conflict resolution: `collab.resolveConflict()`
- Check agent priorities in config
- Monitor confidence scores

### Resource issues
- Check background executor: `bg.getStatus()`
- Review resource monitor: `bg.resourceMonitor.getStatus()`
- Adjust concurrency limits in config

## Next Steps

- **Stage 5**: Intelligence & Optimization
  - Intelligent routing
  - Predictive orchestration
  - Goal-oriented execution
  - Advanced autonomy features

## References

- [State Machine Documentation](./state-machine-guide.md)
- [Decision Framework Guide](./decision-framework-guide.md)
- [Collaboration Protocol](./collaboration-protocol-guide.md)
- [Background Execution Guide](./background-execution-guide.md)
