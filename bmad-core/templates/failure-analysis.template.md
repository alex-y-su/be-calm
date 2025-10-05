# Failure Analysis: {{failure_title}}

**Failure ID:** {{failure_id}}
**Analyzed:** {{analyzed_at}}
**Analyzed by:** Reflection Agent
**Sprint:** {{sprint}}
**Phase:** {{phase}}

---

## Executive Summary

{{executive_summary}}

**Root Cause:** {{root_cause_category}}
**Severity:** {{severity}}
**Recurring:** {{is_recurring}}
**Pattern ID:** {{pattern_id}}

---

## Failure Details

### What Failed

- **Type:** {{failure_type}}
- **Timestamp:** {{failure_timestamp}}
- **Artifact:** {{artifact_name}} (`{{artifact_path}}`)

### Failure Message

```
{{failure_message}}
```

### Context

- **Phase:** {{phase}}
- **Story:** {{story_id}}
- **Epic:** {{epic_id}}
- **Related Requirements:**
  {{#each related_requirements}}
  - `{{requirement_id}}`: {{requirement_description}}
  {{/each}}

---

## Root Cause Analysis

### Primary Cause: {{root_cause_category}}

{{root_cause_description}}

### Contributing Factors

{{#each contributing_factors}}
- **{{factor}}** (Impact: {{impact}})
{{/each}}

### Detailed Analysis

{{#if code_bug}}
#### Code Bug Analysis

- **Bug Type:** {{code_bug.bug_type}}
- **Location:** `{{code_bug.location}}`

**Code Snippet:**
```{{language}}
{{code_bug.code_snippet}}
```

**Expected Behavior:**
{{code_bug.expected_behavior}}

**Actual Behavior:**
{{code_bug.actual_behavior}}

{{/if}}

{{#if truth_gap}}
#### Truth Gap Analysis

**Missing Facts:**
{{#each truth_gap.missing_facts}}
- **Category:** {{fact_category}}
- **Description:** {{fact_description}}
- **Why Needed:** {{why_needed}}
{{/each}}

**Incorrect Facts:**
{{#each truth_gap.incorrect_facts}}
- **Fact ID:** `{{fact_id}}`
- **Current:** {{current_description}}
- **Should Be:** {{should_be}}
- **Why Wrong:** {{why_wrong}}
{{/each}}

{{/if}}

{{#if test_error}}
#### Test Error Analysis

- **Test Issue:** {{test_error.test_issue_type}}
- **Test:** `{{test_error.test_name}}`
- **Location:** `{{test_error.test_location}}`

**Issue:**
{{test_error.issue_description}}

**Correct Test Should:**
{{test_error.correct_test_should}}

{{/if}}

{{#if requirement_ambiguity}}
#### Requirement Ambiguity Analysis

- **Requirement:** `{{requirement_ambiguity.ambiguous_requirement_id}}`

**Ambiguity:**
{{requirement_ambiguity.ambiguity_description}}

**Interpretation 1:**
{{requirement_ambiguity.interpretation_1}}

**Interpretation 2:**
{{requirement_ambiguity.interpretation_2}}

**Correct Interpretation:**
{{requirement_ambiguity.correct_interpretation}}

{{/if}}

{{#if architecture_issue}}
#### Architecture Issue Analysis

- **Issue Type:** {{architecture_issue.issue_type}}
- **Component:** {{architecture_issue.component}}

**Issue:**
{{architecture_issue.issue_description}}

**Architecture Expectation:**
{{architecture_issue.architecture_expectation}}

**Actual Implementation:**
{{architecture_issue.actual_implementation}}

{{/if}}

---

## Pattern Analysis

{{#if is_recurring}}
### ⚠️ This is a Recurring Failure

- **Occurrences:** {{pattern_analysis.occurrences}}
- **First Seen:** {{pattern_analysis.first_occurrence}}
- **Last Seen:** {{pattern_analysis.last_occurrence}}
- **Pattern ID:** `{{pattern_analysis.pattern_id}}`
- **Category:** {{pattern_analysis.pattern_category}}

### Similar Failures

{{#each pattern_analysis.similar_failures}}
- `{{failure_id}}` ({{timestamp}}) - {{similarity}}
{{/each}}

{{else}}
### First Occurrence

This appears to be a new type of failure. Monitoring for recurrence to identify potential pattern.

{{/if}}

---

## Impact Analysis

### Scope

- **Impact Scope:** {{impact.scope}}
- **Time Lost:** {{impact.time_lost_hours}} hours
- **Rework Required:** {{impact.rework_required}}
- **Blocks Progress:** {{impact.blocks_progress}}

### Affected Artifacts

{{#each impact.affected_artifacts}}
- {{artifact_type}}: `{{artifact_path}}`
{{/each}}

### Downstream Effects

{{#each impact.downstream_effects}}
- **{{effect}}** (Severity: {{severity}})
{{/each}}

---

## Learning

### What We Learned

{{learning.what_we_learned}}

### Why It Happened

{{learning.why_it_happened}}

### How to Prevent

{{learning.how_to_prevent}}

### Preventive Measures

{{#each learning.preventive_measures}}
- **{{measure}}**
  - Implementation: {{implementation}}
  - Effectiveness: {{effectiveness}}
{{/each}}

### Process Improvements

{{#each learning.process_improvements}}
- **{{improvement}}**
  - Rationale: {{rationale}}
{{/each}}

---

## Recommendations

### Immediate Actions

{{#each recommendations.immediate_actions}}
#### {{action}} (Priority: {{priority}})

- **Owner:** {{owner}}
- **Estimated Effort:** {{estimated_effort}}

{{/each}}

### Truth Updates

{{#if recommendations.truth_updates}}
{{#each recommendations.truth_updates}}
#### {{update_type}}: {{target}}

{{change_description}}

**Proposed Change:**
```yaml
{{new_content}}
```

{{/each}}
{{else}}
_No truth updates required_
{{/if}}

### Test Improvements

{{#if recommendations.test_improvements}}
{{#each recommendations.test_improvements}}
#### {{improvement_type}}: {{test_name}}

{{change_description}}

{{/each}}
{{else}}
_No test improvements required_
{{/if}}

### Validation Rule Changes

{{#if recommendations.validation_rule_changes}}
{{#each recommendations.validation_rule_changes}}
#### {{rule_type}} Rule Update

**Current Rule:**
```
{{current_rule}}
```

**Proposed Rule:**
```
{{proposed_rule}}
```

**Rationale:** {{rationale}}

{{/each}}
{{else}}
_No validation rule changes required_
{{/if}}

### Workflow Optimizations

{{#if recommendations.workflow_optimizations}}
{{#each recommendations.workflow_optimizations}}
#### {{optimization}}

- **Benefit:** {{benefit}}
- **Effort:** {{effort}}

{{/each}}
{{else}}
_No workflow optimizations identified_
{{/if}}

---

## Resolution

**Status:** {{resolution.status}}
{{#if resolution.resolved_at}}
**Resolved:** {{resolution.resolved_at}} by {{resolution.resolved_by}}
{{/if}}

### Actions Taken

{{#each resolution.resolution_actions_taken}}
- **{{action}}**
  - Completed: {{completed_at}}
  - Outcome: {{outcome}}
{{/each}}

### Verification

{{#if resolution.verification.verified}}
✅ **Verified:** {{resolution.verification.verification_date}}
- **Method:** {{resolution.verification.verification_method}}
{{else}}
⏳ **Verification Pending**
{{/if}}

---

## Follow-Up

{{#if follow_up.added_to_pattern_library}}
✅ Added to Pattern Library: `{{follow_up.pattern_library_id}}`
{{else}}
⏳ Not yet added to pattern library
{{/if}}

### Recommendations Status

{{#each follow_up.recommendations_implemented}}
- `{{recommendation_id}}`: {{status}}
{{/each}}

### Future Monitoring

Monitor these metrics to ensure this failure doesn't recur:

{{#each follow_up.future_monitoring}}
- **{{metric}}**: Threshold {{threshold}} for {{duration}}
{{/each}}

---

## Related Links

- Pattern Library: `reflections/pattern-library.yaml`
- Health Dashboard: `baselines/health-dashboard.yaml`
- Improvement Recommendations: `reflections/improvement-recommendations.md`

---

[[LLM: This failure analysis should be thorough and actionable. Focus on:
1. Clear identification of root cause
2. Specific, implementable recommendations
3. Pattern recognition for recurring issues
4. Learnings that can prevent future failures
5. Verification methods to ensure resolution effectiveness

After creating this analysis:
- Update pattern-library.yaml if recurring
- Generate improvement recommendations
- Notify Monitor agent to track related metrics
- Update agent-tuning-suggestions.yaml if agent behavior needs adjustment]]
