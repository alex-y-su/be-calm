# Reflection Agent User Guide

**Version:** 1.0
**Stage:** 3 (Monitoring & Reflection)
**Agent:** Reflection 🪞

---

## Overview

The Reflection agent analyzes failures, extracts learnings, identifies patterns, and generates actionable improvement recommendations. It enables the BMAD-METHOD framework to learn from experience and continuously improve.

---

## Quick Start

### 1. Analyze a Failure

When eval test fails, Oracle blocks, or gate fails:

```bash
bmad reflection analyze-failure <failure-id>
```

### 2. Review Failure Analysis

```bash
cat reflections/failures/<failure-id>.yaml
```

### 3. Check Recommendations

```bash
cat reflections/improvement-recommendations.yaml
```

---

## Core Functions

### Analyze Failure

**Trigger:** Eval failure, Oracle block, Gate failure
**Purpose:** Root cause analysis and learning extraction

```bash
bmad reflection analyze-failure FAIL-2024-10-05-001
```

**What it does:**
1. Identifies root cause (code bug, truth gap, test error, etc.)
2. Checks for recurring pattern
3. Assesses impact
4. Extracts learning
5. Generates recommendations
6. Updates pattern library

**Output:** `reflections/failures/FAIL-2024-10-05-001.yaml`

---

### Extract Sprint Lessons

**Trigger:** Sprint end
**Purpose:** Capture learnings from sprint

```bash
bmad reflection extract-lessons --sprint 12
```

**Analyzes:**
- Successes and what made them work
- Failures and root causes
- Key learnings
- Recurring patterns
- Action items for next sprint

**Output:** `reflections/lessons-learned-sprint-12.yaml`

---

### Suggest Improvements

**Trigger:** Weekly review
**Purpose:** Generate actionable recommendations

```bash
bmad reflection suggest-improvements
```

**Recommendation categories:**
1. Domain truth updates
2. Eval test improvements
3. Validation rule tuning
4. Agent strategy updates
5. Workflow optimizations
6. Human checkpoint tuning

**Output:** `reflections/improvement-recommendations.yaml`

---

### Analyze Patterns

**Trigger:** Sprint end, on-demand
**Purpose:** Identify recurring issues

```bash
bmad reflection analyze-patterns
```

**Detects:**
- Truth gap patterns
- Code bug patterns
- Test issue patterns
- Process inefficiency patterns
- Architecture drift patterns

**Output:** `reflections/pattern-library.yaml`

---

## Understanding Failure Analysis

### Root Cause Categories

#### 1. Truth Gap
**What:** Missing or incorrect fact in domain-truth.yaml

**Example:**
```yaml
root_cause:
  category: truth_gap
  primary_cause: "Missing constraint in domain-truth.yaml"
  truth_gap:
    missing_facts:
      - fact_category: constraints
        fact_description: "Maximum retry attempts is 3"
        why_needed: "Prevent infinite retry loops"
```

**Recommendation:** Add missing fact to domain-truth.yaml

---

#### 2. Code Bug
**What:** Implementation error

**Example:**
```yaml
root_cause:
  category: code_bug
  primary_cause: "Off-by-one error in pagination"
  code_bug:
    bug_type: logic_error
    location: "src/api/pagination.js:42"
    expected_behavior: "Return items 11-20 for page 2"
    actual_behavior: "Returns items 10-19"
```

**Recommendation:** Fix logic error

---

#### 3. Test Error
**What:** Test incorrectly written

**Example:**
```yaml
root_cause:
  category: test_error
  primary_cause: "Assertion checking wrong value"
  test_error:
    test_issue_type: incorrect_assertion
    test_name: "test_user_creation"
    issue_description: "Test expects 200, should expect 201 for creation"
```

**Recommendation:** Fix test assertion

---

#### 4. Requirement Ambiguity
**What:** Unclear requirement leading to misinterpretation

**Example:**
```yaml
root_cause:
  category: requirement_ambiguity
  primary_cause: "Unclear timeout specification"
  requirement_ambiguity:
    ambiguous_requirement_id: REQ-042
    ambiguity_description: "Timeout duration not specified"
    interpretation_1: "30 seconds"
    interpretation_2: "30 minutes"
    correct_interpretation: "30 minutes"
```

**Recommendation:** Clarify requirement in PRD

---

#### 5. Architecture Issue
**What:** Design problem

**Example:**
```yaml
root_cause:
  category: architecture_issue
  primary_cause: "Missing component for caching"
  architecture_issue:
    issue_type: missing_component
    component: "CacheManager"
    architecture_expectation: "Cache layer between API and DB"
    actual_implementation: "Direct DB calls"
```

**Recommendation:** Add missing component

---

## Pattern Library

### What is a Pattern?

A **pattern** is a failure that occurs **3 or more times** with similar root cause.

### Pattern Structure

```yaml
patterns:
  - pattern_id: PAT-001
    category: truth_gap
    subcategory: constraints
    title: "Missing constraint in domain truth"
    description: "Domain truth missing constraint causing eval failures"

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

    effectiveness:
      recurrence_after_fix: 0
      prevention_rate: 100%
      status: effective
```

### Pattern Benefits

1. **Early detection** - Spot recurring issues quickly
2. **Faster resolution** - Known patterns have known fixes
3. **Prevention** - Implement preventive measures
4. **Knowledge base** - Build project wisdom over time

---

## Improvement Recommendations

### Recommendation Format

```yaml
recommendation_id: REC-001
category: domain_truth_updates
priority: high
title: "Add constraint for maximum retries"

rationale:
  trigger: "5 eval test failures related to retry logic"
  evidence:
    - "FAIL-2024-09-15-003: Unlimited retries"
    - "FAIL-2024-09-22-007: Retry loop"
    - "FAIL-2024-10-05-001: Max retries undefined"
  pattern_reference: PAT-001

suggested_action:
  summary: "Add FACT-015 to domain-truth.yaml"
  detailed_steps:
    - "Open domain-truth.yaml"
    - "Add FACT-015 under constraints"
    - "Run eval tests to verify"

impact:
  impact_score: 85
  impact_description: "Prevent 80% of retry-related failures"
  time_saved_per_sprint_hours: 7

effort:
  effort_level: low
  estimated_hours: 0.5

roi:
  effort_hours: 0.5
  time_saved_per_sprint_hours: 7
  payback_period_sprints: 0.07  # ~1 day
  roi_score: 14  # 14x return
```

### Priority Levels

- **Critical:** Fix immediately (blocking issue)
- **High:** Fix this sprint (major impact, low effort)
- **Medium:** Fix within 2-3 sprints
- **Low:** Fix when convenient

### Implementation Workflow

```
1. Review recommendations weekly
     ↓
2. Prioritize by ROI (impact / effort)
     ↓
3. Assign owners
     ↓
4. Implement high-priority items
     ↓
5. Verify effectiveness
     ↓
6. Monitor recurrence
```

---

## Learning Loops

### Eval Failure Loop

```
Eval Test Fails
    ↓
Reflection analyzes
    ↓
Identifies truth gap
    ↓
Recommends domain-truth update
    ↓
PM adds fact to domain-truth.yaml
    ↓
Eval test passes
    ↓
Pattern prevented going forward
```

### Oracle Validation Loop

```
Oracle blocks artifact
    ↓
Reflection analyzes
    ↓
Identifies terminology mismatch
    ↓
Recommends terminology-map update
    ↓
Oracle validation rules refined
    ↓
Future artifacts pass
```

### Gate Failure Loop

```
Story fails gate
    ↓
Reflection analyzes
    ↓
Identifies upstream gap
    ↓
Recommends earlier validation
    ↓
Workflow adjusted
    ↓
Issues caught earlier
```

---

## Sprint Retrospective

### Lessons Learned Report

Generated at sprint end:

```yaml
lessons_learned:
  sprint: 12
  period: "2024-09-23 to 2024-10-04"

  successes:
    - title: "95% eval test pass rate"
      why_it_worked:
        - "Thorough domain research in Phase 0"
        - "Daily eval test execution"
      should_repeat: true

  failures:
    - title: "3 Oracle blocks for terminology"
      root_cause: "Inconsistent term usage"
      prevention_strategy: "Use terminology-map.yaml early"

  key_learnings:
    - "Constraint analysis crucial in domain research"
    - "Early Oracle validation catches issues sooner"

  recurring_patterns:
    - pattern_id: PAT-001
      occurrences_this_sprint: 2
      status: "Resolution implemented"

  action_items:
    - action: "Add constraint checklist to Phase 0"
      priority: high
      owner: PM
```

---

## Weekly Review

### Comprehensive Learning Report

Generated weekly:

1. **Failure Analyses** - All failures this week
2. **Success Patterns** - What worked well
3. **Agent Performance** - How agents performed
4. **Process Efficiency** - Workflow bottlenecks
5. **Truth Quality** - Domain truth completeness
6. **Improvement Recommendations** - Top 10 recommendations

```bash
bmad reflection generate-weekly-report
```

---

## Agent Strategy Updates

Reflection can suggest agent tuning:

```yaml
agent_tuning_suggestions:
  oracle:
    - aspect: "Terminology validation threshold"
      current: 0.90
      proposed: 0.85
      rationale: "Too many false positives on valid synonyms"

  eval:
    - aspect: "Test timeout"
      current: 5000ms
      proposed: 10000ms
      rationale: "Integration tests timing out on slower machines"

  validator:
    - aspect: "Traceability chain depth"
      current: 3
      proposed: 4
      rationale: "Missing epic-level traceability"
```

**⚠️ Important:** Agent tuning requires human approval

---

## Common Workflows

### When Eval Test Fails

```bash
# 1. Reflection automatically triggered
# (or trigger manually)
bmad reflection analyze-failure FAIL-2024-10-05-001

# 2. Review analysis
cat reflections/failures/FAIL-2024-10-05-001.yaml

# 3. Check if pattern
cat reflections/pattern-library.yaml

# 4. Review recommendations
cat reflections/improvement-recommendations.yaml

# 5. Implement recommendation
# e.g., update domain-truth.yaml

# 6. Verify fix
# Re-run eval test
```

### Weekly Improvement Review

```bash
# 1. Generate recommendations
bmad reflection suggest-improvements

# 2. Review by priority
cat reflections/improvement-recommendations.yaml

# 3. Team meeting to prioritize
# Discuss high-ROI items

# 4. Assign owners
# Update recommendation status

# 5. Implement this sprint
# Track implementation

# 6. Verify effectiveness
# Check recurrence rates
```

### Sprint Retrospective

```bash
# 1. Extract lessons
bmad reflection extract-lessons --sprint 12

# 2. Review lessons learned
cat reflections/lessons-learned-sprint-12.yaml

# 3. Identify action items
# From recommendations and lessons

# 4. Plan next sprint
# Incorporate learnings

# 5. Update workflows
# Apply process improvements
```

---

## Best Practices

1. **Analyze failures immediately** - Don't let them pile up
2. **Look for patterns** - 3+ occurrences = pattern
3. **Implement high-ROI recommendations** - Best return on investment
4. **Track effectiveness** - Monitor if fixes prevent recurrence
5. **Share learnings** - Team learns from mistakes
6. **Update pattern library** - Build knowledge base
7. **Review weekly** - Regular improvement cadence
8. **Celebrate successes** - Learn from what works

---

## Integration with Monitor

**Monitor → Reflection:**
- Monitor detects failure/drift
- Triggers Reflection analysis
- Provides metrics and trends

**Reflection → Monitor:**
- Recommends threshold adjustments
- Suggests new metrics to track
- Updates based on patterns

**Closed Loop:**
```
Monitor detects issue
    ↓
Reflection analyzes
    ↓
Generates recommendation
    ↓
Recommendation implemented
    ↓
Monitor tracks effectiveness
    ↓
Issue prevented in future
```

---

## Troubleshooting

### Pattern Not Detected

**Problem:** Recurring failure not flagged as pattern

**Solution:**
- Check pattern detection threshold (default: 3)
- Verify similar failures have matching categories
- Review pattern-library.yaml manually

### Low Recommendation Quality

**Problem:** Recommendations not actionable

**Solution:**
- Provide more context in failure analysis
- Review recommendation templates
- Work with team to refine suggestions

### Recommendations Not Implemented

**Problem:** Low implementation rate

**Solution:**
- Prioritize by ROI
- Assign clear owners
- Track in sprint planning
- Reduce recommendation volume (top 10)

---

## Configuration

Edit `bmad-core/core-config.yaml`:

```yaml
reflection:
  enabled: true

  triggers:
    eval_failure: true
    oracle_block: true
    gate_failure: true
    story_complete: true
    sprint_end: true
    weekly_review: true

  analysis:
    auto_generate_recommendations: true
    pattern_detection_threshold: 3

  learning:
    auto_update_pattern_library: true
    require_human_approval_for_agent_tuning: true
```

---

## Related Resources

- **Agent Spec:** `bmad-core/agents/reflection.md`
- **Tasks:** `bmad-core/tasks/analyze-failure.md`, `suggest-improvements.md`
- **Schemas:** `bmad-core/schemas/failure-analysis.schema.yaml`
- **Templates:** `bmad-core/templates/failure-analysis.template.md`
- **Monitor Guide:** `docs/stage-3-monitor-guide.md`
