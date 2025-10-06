# Truth Propagation Guide

**Version:** 5.0
**Date:** 2025-10-04
**Purpose:** Guide for how truth updates cascade through the system

---

## Overview

Truth propagation is BMAD's change management system. When domain truth changes, those changes must cascade through all downstream artifacts (PRD, Architecture, Stories, Code, Tests).

**Key principle:** Truth flows downward. Changes upstream trigger updates downstream.

---

## Truth Hierarchy

```
domain-truth.yaml (SOURCE OF TRUTH)
    ↓
prd.md (requirements)
    ↓
architecture.md (design)
    ↓
stories/*.md (implementation plans)
    ↓
src/ (code)
    ↓
test/ (validation)
```

**Rule:** Changes at any level must be consistent with levels above.

---

## Truth Update Protocol

### When Domain Truth Changes

**Trigger:** Oracle `update-domain-truth` task completes

**Cascade sequence:**
1. Oracle marks affected artifacts in `domain-truth.yaml#change_history`
2. Validator re-validates entire chain
3. Eval updates test datasets
4. Monitor tracks ripple effects
5. Affected agents auto-update work

**Example:**
```yaml
# FACT-001 changed: JWT expiry 30min → 15min

Cascade:
  1. Oracle updates domain-truth.yaml ✅
  2. Validator flags: prd.md FR-003 now inconsistent
  3. PM agent updates FR-003 in PRD
  4. Validator flags: architecture.md COMP-002 inconsistent
  5. Architect updates COMP-002
  6. Validator flags: Story 1.1 inconsistent
  7. SM agent updates Story 1.1 context
  8. Validator flags: Code implementation inconsistent
  9. Dev agent updates src/auth/jwt.service.ts
  10. Eval updates test datasets
  11. QA runs regression tests
  12. Validator confirms: All artifacts consistent ✅
```

---

## Truth Update Decision Tree

### When Eval Test Fails

**Question:** Why did test fail?

```
Test failure detected
    ↓
Reflection analyzes root cause:
    ↓
┌───────────────┬──────────────────┬────────────────┐
│               │                  │                │
│ Truth wrong   │  Code wrong      │  Test wrong    │
│               │                  │                │
↓               ↓                  ↓
Update          Dev fixes          Eval updates
domain-truth    implementation     test dataset
    ↓               ↓                  ↓
Cascade         Re-run tests       Re-run tests
updates         Expect PASS        Expect PASS
```

**Decision criteria:**
- **Truth wrong:** Domain expert says fact is incorrect
- **Code wrong:** Implementation doesn't match truth
- **Test wrong:** Test expectation incorrect

---

## Propagation Rules

### Rule 1: Upstream Changes Cascade Down

When domain truth changes:
- All downstream artifacts MUST update
- Inconsistencies BLOCK development
- Validation REQUIRED before proceeding

### Rule 2: Downstream Cannot Change Upstream

Code cannot change domain truth. If code reveals truth is wrong, truth must be updated via Oracle `update-domain-truth`.

### Rule 3: Bidirectional Validation

After updates:
- Forward: Verify domain truth → code chain
- Backward: Verify code → domain truth chain

### Rule 4: Atomic Updates

Truth changes are atomic:
- Either all artifacts update, or none
- Partial updates not allowed
- Rollback if cascade fails

---

## Automated Propagation

### Auto-Update Triggers

```yaml
auto_updates:
  oracle_triggers:
    - event: "domain-truth.yaml changed"
      action: "Validate all artifacts, flag inconsistencies"

  validator_triggers:
    - event: "Artifact becomes inconsistent"
      action: "Notify responsible agent"

  eval_triggers:
    - event: "Domain fact changed"
      action: "Update test datasets"

  monitor_triggers:
    - event: "Truth change detected"
      action: "Track cascade progress"
```

### Manual Intervention Required

Some updates require human decisions:
- **Breaking changes:** Migration strategy needed
- **Ambiguous changes:** Domain expert clarification
- **Conflicting changes:** Prioritization decision

---

## Brownfield Truth Propagation

Brownfield projects have THREE truth sources:

```
existing-system-truth.yaml (what IS)
    +
domain-truth.yaml (what SHOULD be)
    ↓
enhancement-truth.yaml (what WILL change)
    ↓
migration-strategy.yaml (HOW to change)
    ↓
Phased implementation
```

**Propagation is more complex:**
1. Changes must respect existing constraints
2. Migration strategies required for breaking changes
3. Backward compatibility during transition
4. Dual-truth mode until migration complete

---

## Conflict Resolution

### Conflict Types

**Type 1: Domain truth contradicts itself**
- Example: FACT-001 says 15 minutes, CON-003 says 30 minutes
- Resolution: Oracle resolves ambiguity
- Action: Update domain-truth.yaml to remove contradiction

**Type 2: Artifacts contradict domain truth**
- Example: PRD says 30 minutes, domain truth says 15 minutes
- Resolution: PRD is wrong, update it
- Action: PM agent updates PRD

**Type 3: Code contradicts requirements**
- Example: Code implements 30 minutes, FR says 15 minutes
- Resolution: Code is wrong, fix it
- Action: Dev agent updates code

**Type 4: Tests contradict domain truth**
- Example: Test expects 30 minutes, truth says 15 minutes
- Resolution: Test is wrong, update it
- Action: Eval agent updates test dataset

### Resolution Protocol

```yaml
conflict_resolution:
  step_1: "Identify conflict source (which artifact contradicts truth?)"
  step_2: "Validate truth accuracy (is domain truth correct?)"
  step_3: "If truth correct: Update conflicting artifact"
  step_4: "If truth incorrect: Update domain truth, cascade changes"
  step_5: "Re-validate entire chain"
  step_6: "Confirm consistency restored"
```

---

## Propagation Monitoring

### Track Cascade Progress

```yaml
cascade_tracking:
  update_id: "UPDATE-001"
  trigger: "FACT-001 changed (30min → 15min)"

  propagation_status:
    - artifact: "domain-truth.yaml"
      status: "✅ Updated"
      timestamp: "2025-10-04T10:00:00Z"

    - artifact: "prd.md FR-003"
      status: "✅ Updated"
      timestamp: "2025-10-04T10:05:00Z"

    - artifact: "architecture.md COMP-002"
      status: "⏳ Pending"
      assigned: "Architect agent"

    - artifact: "Story 1.1"
      status: "⏳ Pending"
      blocked_by: "Architecture update"
```

### Cascade Metrics

- **Cascade time:** Time from truth update to full propagation
- **Artifacts affected:** Count of downstream changes
- **Manual interventions:** Number of human decisions needed
- **Rollbacks:** Failed cascades requiring rollback

---

## Best Practices

### ✅ DO:
- Update domain truth when domain understanding changes
- Cascade updates immediately
- Validate entire chain after changes
- Document change rationale

### ❌ DON'T:
- Change code without updating truth
- Skip validation after truth changes
- Make partial updates
- Ignore inconsistencies

---

## Examples

### Example 1: Simple Cascade

```yaml
Change: FACT-003 clarified (ambiguity resolved)
Affected: 3 artifacts (PRD, Architecture, Story 2.1)
Cascade time: 15 minutes
Manual interventions: 0
Result: Success ✅
```

### Example 2: Complex Cascade (Brownfield)

```yaml
Change: ENH-001 (reduce JWT expiry)
Affected: 15 artifacts + migration strategy
Cascade time: 3 days
Manual interventions: 4 (migration planning)
Phases: 4 (phased rollout)
Result: Success ✅ (after migration complete)
```

---

## Troubleshooting

**Problem:** Cascade fails midway

**Solution:**
1. Identify where cascade stopped
2. Check validation errors
3. Resolve blockers (ambiguity, conflicts, missing info)
4. Resume cascade
5. Validate entire chain

**Problem:** Circular dependency detected

**Solution:**
1. Analyze dependency chain
2. Break circular reference
3. Update artifacts in correct order
4. Re-validate

---

## Summary

**Truth propagation ensures:**
- One source of truth (domain-truth.yaml)
- Automatic cascade of changes
- Validation at every step
- Consistency across all artifacts
- Proof of correctness via traceability

**Remember:** Truth flows downward. Keep it consistent. Validate always.
