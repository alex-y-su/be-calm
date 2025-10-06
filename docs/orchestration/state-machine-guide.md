# State Machine Documentation

**Component:** Truth-Driven Workflow State Machine v2.0
**File:** `bmad-core/orchestration/state-machine.js`

## Purpose

The State Machine manages workflow states, transitions, and persistence, enabling autonomous progression through the BMAD methodology with automatic checkpoints and recovery.

## States

### Brownfield States
- **codebase_discovery** (Phase -1): Analyze existing codebase

### Universal States
- **domain_research** (Phase 0): Research domain, create domain-truth
- **eval_foundation** (Phase 1): Create evaluation test datasets
- **discovery** (Phase 2): Create PRD and requirements
- **architecture** (Phase 3): Define system architecture
- **planning** (Phase 4): Create epics and stories
- **development** (Phase 5): Implement features

### Brownfield-Only Intermediate
- **compatibility_analysis** (Phase 1.5): Analyze compatibility with existing system

## State Structure

Each state includes:
```javascript
{
  id: 'domain_research',
  type: 'universal' | 'brownfield_only',
  phase: 0,
  agents: ['domain-researcher', 'oracle'],
  name: 'Domain Research',
  description: 'Research domain and create domain truth',
  exitConditions: [
    'domain_truth_created',
    'oracle_validated',
    'terminology_defined'
  ]
}
```

## Transitions

### Automatic Transitions
Occur when all conditions met:
- All exit conditions = true
- All validation gates passed
- No blocking issues
- Human checkpoints approved

### Manual Transitions
Force transition:
```javascript
await sm.transitionTo('development', 'manual', true);
```

### Blocking Transitions
Triggered by:
- Critical validation failure
- Irreconcilable conflict (brownfield)
- Human checkpoint rejection
- Agent error threshold exceeded

## Exit Conditions

Each state has specific exit conditions that must be met. Check status:

```javascript
const { met, conditions } = sm.checkExitConditions();

if (met) {
  await sm.transitionTo(nextState);
}
```

Mark conditions as met:

```javascript
sm.markExitCondition('domain_truth_created', true);
```

## State Metadata

Each state tracks:
- `completion_percentage`: 0-100
- `exit_conditions_status`: Status of each exit condition
- `validation_gates_status`: Validation gate results
- `artifacts_created`: List of created artifacts
- `blocking_issues`: Issues preventing progress
- `human_checkpoints_pending`: Pending human approvals

Update metadata:

```javascript
sm.updateMetadata({
  completion_percentage: 75,
  artifacts_created: ['domain-truth.yaml']
});
```

## Persistence

State auto-saved to `.bmad-state/workflow-state.yaml`:

```yaml
version: "2.0"
current_state: "domain_research"
project_type: "greenfield"
state_history:
  - from: null
    to: domain_research
    reason: initialization
    timestamp: "2025-10-05T00:00:00.000Z"
metadata:
  domain_research:
    completion_percentage: 45
    exit_conditions_status:
      domain_truth_created: true
```

## Recovery

On crash or corruption:

```javascript
await sm.recover();
```

Recovery process:
1. Load last saved state
2. Verify artifact integrity
3. If corrupted, load from backup
4. Resume from checkpoint
5. Notify agents of recovery

## Rollback

Revert to previous state:

```javascript
// Rollback to previous
await sm.rollback();

// Rollback to specific state
await sm.rollback('architecture');
```

Rollback actions:
- Load target state
- Invalidate downstream artifacts
- Reset validation status
- Notify agents

## Blocking/Unblocking

Block workflow:

```javascript
sm.block('critical_issue', {
  reason: 'Eval tests failing',
  details: { pass_rate: 75 }
});
```

Unblock workflow:

```javascript
sm.unblock('issue_resolved', 'human');
```

## Progress Tracking

Get workflow progress:

```javascript
const progress = sm.getProgress();

console.log(`Current: ${progress.current_state.name}`);
console.log(`Progress: ${progress.progress_percentage}%`);
console.log(`Completed: ${progress.completed_states}`);
console.log(`Remaining: ${progress.remaining_states}`);
```

## Events

Listen to state machine events:

```javascript
sm.on('initialized', (data) => {});
sm.on('transition', ({ from, to, reason }) => {});
sm.on('metadata-updated', ({ stateId, metadata }) => {});
sm.on('exit-condition-updated', ({ condition, met }) => {});
sm.on('auto-transition-ready', ({ currentState }) => {});
sm.on('workflow-blocked', ({ reason, details }) => {});
sm.on('workflow-unblocked', ({ reason }) => {});
sm.on('state-saved', ({ path }) => {});
sm.on('recovery', ({ state, agents }) => {});
```

## API Reference

### Constructor
```javascript
const sm = new StateMachine(config);
```

### Initialize
```javascript
await sm.initialize('greenfield' | 'brownfield');
```

### Get Current State
```javascript
const state = sm.getCurrentState();
```

### Get Metadata
```javascript
const metadata = sm.getMetadata(stateId?);
```

### Update Metadata
```javascript
sm.updateMetadata(updates, stateId?);
```

### Check Exit Conditions
```javascript
const { met, conditions } = sm.checkExitConditions(stateId?);
```

### Mark Exit Condition
```javascript
sm.markExitCondition(condition, met, stateId?);
```

### Transition
```javascript
await sm.transitionTo(newStateId, reason?, force?);
```

### Rollback
```javascript
await sm.rollback(targetState?);
```

### Block/Unblock
```javascript
sm.block(reason, details);
sm.unblock(reason, resolvedBy);
```

### Pause/Resume
```javascript
sm.pause(reason);
sm.resume(reason);
```

### Save/Load
```javascript
await sm.saveState();
await sm.loadState();
```

### Recovery
```javascript
await sm.recover();
```

### Get Progress
```javascript
const progress = sm.getProgress();
```

See [Orchestration System Guide](./orchestration-system-guide.md) for integration examples.
