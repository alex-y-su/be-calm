# Decision Framework Guide

**Component:** Autonomous Decision Making Framework v2.0
**File:** `bmad-core/orchestration/decision-engine.js`

## Purpose

The Decision Engine manages autonomous decision-making with confidence scoring, enabling agents to make decisions at appropriate autonomy levels while routing critical decisions to humans.

## Decision Levels

### 1. Fully Automatic (Confidence ≥ 0.95)
Execute immediately without approval.

**Examples:**
- Run eval tests on file save
- Generate test datasets from domain-truth
- Validate traceability chains
- Track metrics and trends

### 2. Automatic with Notification (0.80 ≤ confidence < 0.95)
Execute automatically but notify human.

**Examples:**
- Transition to next workflow phase
- Create functional test datasets
- Update baselines

### 3. Automatic with Preview (0.65 ≤ confidence < 0.80)
Show preview, auto-execute after delay (default 5s) unless cancelled.

**Examples:**
- Create enhancement-truth.yaml (brownfield)
- Generate migration strategy
- Update domain-truth based on learnings

### 4. Require Approval (Confidence < 0.65)
Wait for explicit human approval.

**Examples:**
- Accept breaking changes (brownfield)
- Modify domain-truth.yaml
- Override blocking validation
- Force state transition

## Confidence Scoring

Confidence calculated from weighted factors:

```javascript
{
  similar_pattern_success_rate: 0.30,  // Past success rate
  oracle_validation_strength: 0.25,    // Oracle validation
  eval_test_coverage: 0.20,            // Test coverage
  historical_accuracy: 0.15,           // Agent accuracy
  complexity_factor: 0.10              // Inverse complexity
}
```

Final score: 0.0 - 1.0

## Making Decisions

```javascript
const result = await de.makeDecision(
  'dev',                    // agent
  'merge_to_main',          // action
  {                         // context
    eval_tests_pass: true,
    oracle_validated: true,
    complexity: 0.3
  }
);

console.log(result.approved);  // true/false
console.log(result.level);     // decision level
```

## Agent Capabilities

Defined in `agent-capabilities.yaml`:

```yaml
dev:
  can_auto_proceed_when:
    - eval_tests_pass
    - oracle_validated
    - validator_traceability_confirmed
    - monitor_health_green
    - no_blocking_issues

  requires_approval_for:
    - merge_to_main
    - deploy_to_production
    - breaking_api_changes
```

Check if agent can auto-proceed:

```javascript
const { canProceed, unmet_conditions } = de.canAutoProceed('dev', {
  eval_tests_pass: true,
  oracle_validated: true,
  traceability_confirmed: true,
  health_status: 'green'
});
```

## Approval Workflow

### Request Approval

Decision engine emits event:

```javascript
de.on('approval-required', ({ approvalId, decision, message }) => {
  // Show approval request to user
  console.log(message);
  console.log('Context:', decision.context);
});
```

### Respond to Approval

```javascript
de.respondToApproval(approvalId, true, 'Approved by user');
// or
de.respondToApproval(approvalId, false, 'Rejected - needs review');
```

## Preview System

### Show Preview

Decision engine emits event:

```javascript
de.on('show-preview', ({ decision, preview, delay, message }) => {
  console.log(message);
  console.log('Preview:', preview);
  console.log(`Auto-executing in ${delay}ms`);
});
```

### Cancel Preview

```javascript
de.cancelPreview(previewId);
```

If not cancelled within delay, action auto-executes.

## Decision History

Track all decisions:

```javascript
// Get all history
const history = de.getDecisionHistory();

// Filter by agent
const devDecisions = de.getDecisionHistory({ agent: 'dev' });

// Filter by level
const approvalRequired = de.getDecisionHistory({ level: 'require_approval' });

// Filter by status
const approved = de.getDecisionHistory({ status: 'approved' });
```

## Events

```javascript
// Decision lifecycle
de.on('decision-requested', (data) => {});
de.on('decision-completed', (data) => {});

// Approval events
de.on('approval-required', (data) => {});
de.on('approval-rejected', (data) => {});

// Preview events
de.on('show-preview', (data) => {});
de.on('preview-cancelled', (data) => {});

// Execution events
de.on('executing-automatic', (data) => {});
de.on('executing-with-notification', (data) => {});
de.on('executing-with-preview', (data) => {});
```

## Configuration

Decision levels and routing in `decision-levels.yaml`:

```yaml
decision_levels:
  fully_automatic:
    confidence_threshold: 0.95
  automatic_with_notification:
    confidence_threshold: 0.80
  automatic_with_preview:
    confidence_threshold: 0.65
    preview_delay_ms: 5000
  require_approval:
    confidence_threshold: 0.0

confidence_scoring:
  factors:
    similar_pattern_success_rate: 0.30
    oracle_validation_strength: 0.25
    eval_test_coverage: 0.20
    historical_accuracy: 0.15
    complexity_factor: 0.10
```

Agent capabilities in `agent-capabilities.yaml` (see above).

## API Reference

### Initialize
```javascript
const de = new DecisionEngine(config);
await de.initialize();
```

### Make Decision
```javascript
const result = await de.makeDecision(agent, action, context);
```

### Check Auto-Proceed
```javascript
const { canProceed, unmet_conditions } = de.canAutoProceed(agent, context);
```

### Respond to Approval
```javascript
de.respondToApproval(approvalId, approved, reason);
```

### Cancel Preview
```javascript
de.cancelPreview(previewId);
```

### Get Decision History
```javascript
const history = de.getDecisionHistory(filters);
```

### Get Pending
```javascript
const approvals = de.getPendingApprovals();
const previews = de.getPendingPreviews();
```

### Get Status
```javascript
const status = de.getStatus();
```

## Best Practices

1. **Trust confidence scores**: Don't override unless necessary
2. **Configure capabilities**: Define what agents can do in YAML
3. **Monitor approvals**: Track pending approvals and respond promptly
4. **Review history**: Learn from past decisions
5. **Adjust thresholds**: Tune confidence thresholds based on experience
6. **Handle previews**: Implement UI for preview cancellation

## Example Integration

```javascript
import DecisionEngine from './bmad-core/orchestration/decision-engine.js';

const de = new DecisionEngine();
await de.initialize();

// Listen for approvals
de.on('approval-required', async ({ approvalId, decision }) => {
  const userInput = await promptUser(decision.message);
  de.respondToApproval(approvalId, userInput.approved, userInput.reason);
});

// Listen for previews
de.on('show-preview', async ({ previewId, preview, delay }) => {
  const cancelled = await showPreviewWithTimeout(preview, delay);
  if (cancelled) {
    de.cancelPreview(previewId);
  }
});

// Make decision
const result = await de.makeDecision('dev', 'implement-feature', {
  eval_tests_pass: true,
  oracle_validated: true
});

if (result.approved) {
  // Proceed with action
}
```

See [Orchestration System Guide](./orchestration-system-guide.md) for full integration.
