# Analyze Failure

**Agent:** Reflection
**Phase:** All Phases
**Trigger:** eval_failure, oracle_block, gate_failure

---

## Objective

Perform deep root cause analysis of failures to extract learnings, identify patterns, and generate actionable recommendations for preventing future occurrences.

---

## Inputs

- **Failure Event:** Eval test failure, Oracle block, or Gate failure
- **Failure Context:** Code, test, artifact involved
- **Domain Truth:** `domain-truth.yaml`
- **Requirements:** PRD, Epic, Story
- **Historical Failures:** Previous failure analyses
- **Pattern Library:** `pattern-library.yaml`

---

## Process

### 1. Gather Failure Details

**Collect:**
- Failure type (eval, oracle, gate)
- Timestamp
- Failed artifact
- Failure message
- Related requirements
- Phase and sprint context

**Example:**
```yaml
failure:
  id: FAIL-2024-10-05-001
  type: eval_failure
  timestamp: "2024-10-05T14:30:00Z"
  artifact:
    type: test
    name: test_retry_logic_limits
    path: tests/eval/test-retry.js
  message: "Expected max 3 retries, got unlimited"
  phase: "Phase 5 - Development"
  story: STORY-042
  epic: EPIC-07
```

---

### 2. Identify Root Cause

**Categories:**
1. **Code Bug** - Implementation error
2. **Truth Gap** - Missing/incorrect domain fact
3. **Test Error** - Test incorrectly written
4. **Requirement Ambiguity** - Unclear requirement
5. **Architecture Issue** - Design problem

**Analysis:**
- Review failure message
- Examine failed code/test
- Check domain-truth.yaml for relevant facts
- Review requirement clarity
- Check architecture alignment

**Example Root Cause:**
```yaml
root_cause:
  category: truth_gap
  primary_cause: "Missing constraint in domain-truth.yaml"
  contributing_factors:
    - factor: "Incomplete domain analysis in Phase 0"
      impact: high

  truth_gap:
    missing_facts:
      - fact_category: constraints
        fact_description: "Maximum retry attempts is 3"
        why_needed: "Prevent infinite retry loops"
```

---

### 3. Analyze Pattern

**Check for recurrence:**
1. Search past failures for similar issues
2. Look for pattern in pattern-library.yaml
3. Determine if this is 1st, 2nd, 3rd+ occurrence

**Pattern Detection:**
- ≥ 3 occurrences → Pattern confirmed
- Create or update pattern in library
- Tag with pattern ID

**Example:**
```yaml
pattern_analysis:
  is_recurring: true
  occurrences: 5
  first_occurrence: "2024-09-15T10:00:00Z"
  last_occurrence: "2024-10-05T14:30:00Z"
  similar_failures:
    - FAIL-2024-09-15-003
    - FAIL-2024-09-22-007
    - FAIL-2024-09-28-012
    - FAIL-2024-10-02-005
  pattern_id: PAT-001
  pattern_category: truth_gap
```

---

### 4. Assess Impact

**Determine:**
- Scope (story, epic, phase, project)
- Time lost
- Rework required
- Progress blocked?
- Downstream effects

**Example:**
```yaml
impact:
  scope: story
  affected_artifacts:
    - type: code
      path: src/services/retry.js
    - type: test
      path: tests/eval/test-retry.js
  downstream_effects:
    - effect: "All retry-related features affected"
      severity: high
  time_lost_hours: 3.5
  rework_required: true
  blocks_progress: false
```

---

### 5. Extract Learning

**Ask:**
- What did we learn?
- Why did this happen?
- How can we prevent it?

**Document:**
- Key insight
- Root cause explanation
- Preventive measures
- Process improvements

**Example:**
```yaml
learning:
  what_we_learned: |
    Domain truth requires explicit constraint documentation.
    Implicit constraints lead to implementation ambiguity.

  why_it_happened: |
    Phase 0 domain analysis focused on features but didn't
    systematically capture constraints.

  how_to_prevent: |
    Add constraint analysis checklist to Phase 0.
    Review all domain facts for missing constraints.

  preventive_measures:
    - measure: "Add constraint checklist to domain research"
      implementation: "Update Phase 0 template"
      effectiveness: high

  process_improvements:
    - improvement: "Enhanced domain analysis"
      rationale: "Prevent missing constraint scenarios"
```

---

### 6. Generate Recommendations

**Categories:**
1. **Immediate Actions** - Fix this failure now
2. **Truth Updates** - Update domain-truth.yaml
3. **Test Improvements** - Fix or add tests
4. **Validation Rule Changes** - Tune Oracle/Validator
5. **Workflow Optimizations** - Improve process

**Example:**
```yaml
recommendations:
  immediate_actions:
    - action: "Add retry constraint to domain-truth.yaml"
      priority: high
      owner: PM
      estimated_effort: "30 minutes"

  truth_updates:
    - update_type: add_fact
      target: domain-truth.yaml
      change_description: "Add FACT-015: Max retry attempts = 3"
      new_content: |
        - id: FACT-015
          category: constraints
          description: "Maximum retry attempts is 3"
          rationale: "Prevent infinite retry loops"
          examples:
            - "API call retries: max 3"
            - "Database connection retries: max 3"

  test_improvements: []

  validation_rule_changes: []

  workflow_optimizations:
    - optimization: "Add constraint checklist to Phase 0"
      benefit: "Prevent missing constraints"
      effort: low
```

---

### 7. Update Pattern Library

If recurring (≥3 occurrences):

```yaml
# pattern-library.yaml
patterns:
  - pattern_id: PAT-001
    category: truth_gap
    subcategory: constraints
    title: "Missing constraint in domain truth"
    description: |
      Domain truth missing constraint that causes repeated failures.
      Usually discovered during eval tests.
    occurrences: 5
    first_seen: "2024-09-15T10:00:00Z"
    last_seen: "2024-10-05T14:30:00Z"
    examples:
      - FAIL-2024-09-15-003
      - FAIL-2024-09-22-007
      - FAIL-2024-10-05-001
    resolution: "Add missing constraint to domain-truth.yaml"
    preventive_measures:
      - "Use constraint checklist during domain research"
```

---

## Outputs

### failure-analysis.md

Location: `reflections/failures/FAIL-2024-10-05-001.md`

```markdown
# Failure Analysis: Missing Retry Constraint

**Failure ID:** FAIL-2024-10-05-001
**Type:** Eval Test Failure
**Date:** 2024-10-05 14:30 UTC

## Summary

Eval test failed because code implemented unlimited retries,
but test expected max 3 retries. Root cause: domain-truth.yaml
missing constraint specification.

## Root Cause

**Category:** Truth Gap
**Cause:** Missing constraint in domain-truth.yaml

Domain truth did not specify maximum retry attempts, leading
to implementation without limit.

## Pattern

⚠️ **RECURRING PATTERN** - PAT-001 (5th occurrence)

This is the 5th time we've encountered missing constraints
in domain truth causing eval test failures.

## Recommendations

1. **Immediate:** Add FACT-015 to domain-truth.yaml
2. **Process:** Add constraint checklist to Phase 0
3. **Prevention:** Review all domain facts for missing constraints

## Impact

- Time lost: 3.5 hours
- Rework required: Yes
- Similar issues prevented by fix: 80% of retry failures
```

**Schema:** `bmad-core/schemas/failure-analysis.schema.yaml`
**Template:** `bmad-core/templates/failure-analysis.template.md`

---

### improvement-recommendations.md

Updated with new recommendation:

```markdown
## REC-001: Add Constraint for Maximum Retries

**Priority:** High
**Category:** Domain Truth Updates
**Effort:** Low (30 minutes)

### Rationale

5 eval test failures related to retry logic in past 2 sprints.
All caused by missing constraint in domain truth.

### Suggested Action

Add to domain-truth.yaml:
```yaml
- id: FACT-015
  category: constraints
  description: "Maximum retry attempts is 3"
```

### Impact

Prevent 80% of retry-related failures going forward.

**ROI:** Very High (30 min effort, saves ~14 hours over 2 sprints)
```

---

## Workflow

```
Failure Occurs
    ↓
Reflection Triggered
    ↓
Gather Details
    ↓
Identify Root Cause
    ↓
Check for Pattern ──→ Update Pattern Library
    ↓
Assess Impact
    ↓
Extract Learning
    ↓
Generate Recommendations ──→ improvement-recommendations.md
    ↓
Save Analysis ──→ failure-analysis.md
    ↓
Notify Monitor ──→ Track prevention metrics
```

---

## Integration

### With Monitor
- Monitor detects failure
- Triggers Reflection analysis
- Reflection generates recommendations
- Monitor tracks prevention effectiveness

### With Oracle
- If Oracle block → Reflection analyzes
- Recommendation: Update terminology or truth
- Oracle uses improved truth

### With Eval
- If eval failure → Reflection analyzes
- Recommendation: Update truth or fix test
- Eval suite improved

---

## Best Practices

1. **Analyze immediately** - Don't let failures pile up
2. **Be thorough** - Root cause, not just symptoms
3. **Look for patterns** - Is this recurring?
4. **Generate actionable recommendations** - Specific, implementable
5. **Update pattern library** - Build knowledge base
6. **Track effectiveness** - Did fix prevent recurrence?
7. **Share learnings** - Team learns from failures

---

## Success Metrics

- Time to analysis: < 1 hour
- Root cause accuracy: > 90%
- Pattern detection rate: 100% for 3+ occurrences
- Recommendation implementation: > 70%
- Recurrence prevention: > 80%

---

## Related

- **Agent:** `bmad-core/agents/reflection.md`
- **Schema:** `bmad-core/schemas/failure-analysis.schema.yaml`
- **Tasks:**
  - `suggest-improvements.md`
  - `extract-lessons.md`
  - `analyze-patterns.md`
