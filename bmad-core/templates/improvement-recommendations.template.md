# Improvement Recommendations

**Generated:** {{generated_at}}
**Period:** {{period}}
**Sprint:** {{sprint}}
**Project:** {{project_name}}

---

## Executive Summary

**Total Recommendations:** {{summary.total_recommendations}}

### By Priority
- 🔴 **Critical:** {{summary.by_priority.critical}}
- 🟠 **High:** {{summary.by_priority.high}}
- 🟡 **Medium:** {{summary.by_priority.medium}}
- 🟢 **Low:** {{summary.by_priority.low}}

### By Category
- Domain Truth Updates: {{summary.by_category.domain_truth_updates}}
- Eval Test Improvements: {{summary.by_category.eval_test_improvements}}
- Validation Rule Tuning: {{summary.by_category.validation_rule_tuning}}
- Agent Strategy Updates: {{summary.by_category.agent_strategy_updates}}
- Workflow Optimizations: {{summary.by_category.workflow_optimizations}}
- Human Checkpoint Tuning: {{summary.by_category.human_checkpoint_tuning}}

### Estimated Impact
- **Total Effort:** {{summary.estimated_total_effort_hours}} hours
- **Impact Score:** {{summary.estimated_impact_score}}/100

---

## Critical Priority Recommendations

{{#each critical_recommendations}}
### 🔴 {{recommendation_id}}: {{title}}

**Category:** {{category}}
**Priority:** Critical
**Effort:** {{effort.effort_level}} ({{effort.estimated_hours}}h)
**Impact Score:** {{impact.impact_score}}/100

#### Rationale

{{rationale.trigger}}

**Evidence:**
{{#each rationale.evidence}}
- {{evidence_item}} (Source: `{{source}}`)
{{/each}}

{{#if rationale.pattern_reference}}
**Related Pattern:** `{{rationale.pattern_reference}}`
{{/if}}

#### Suggested Action

{{suggested_action.summary}}

**Steps:**
{{#each suggested_action.detailed_steps}}
{{@index}}. **{{step}}**
   {{details}}
{{/each}}

**Artifacts to Modify:**
{{#each suggested_action.artifacts_to_modify}}
- {{artifact_type}} (`{{artifact_path}}`): {{change_type}}
{{/each}}

#### Impact

{{impact.impact_description}}

**Problems Prevented:**
{{#each impact.problems_prevented}}
- {{problem}} ({{frequency}}, severity: {{severity}})
{{/each}}

**Metrics Improved:**
{{#each impact.metrics_improved}}
- {{metric_name}}: {{current_value}} → {{expected_value}} (+{{improvement_percentage}}%)
{{/each}}

**ROI:**
- Effort: {{roi.effort_hours}}h
- Time Saved per Sprint: {{roi.time_saved_per_sprint_hours}}h
- Payback Period: {{roi.payback_period_sprints}} sprints
- ROI Score: {{roi.roi_score}}

#### Implementation

**Status:** {{implementation.status}}
{{#if implementation.assigned_to}}**Assigned:** {{implementation.assigned_to}}{{/if}}
{{#if implementation.target_sprint}}**Target Sprint:** {{implementation.target_sprint}}{{/if}}

**Success Criteria:**
{{#each verification.success_criteria}}
- {{criterion}}: {{metric}} = {{target_value}}
{{/each}}

---
{{/each}}

## High Priority Recommendations

{{#each high_priority_recommendations}}
### 🟠 {{recommendation_id}}: {{title}}

**Category:** {{category}} | **Effort:** {{effort.effort_level}} | **Impact:** {{impact.impact_score}}/100

#### Summary
{{suggested_action.summary}}

#### Why This Matters
{{impact.impact_description}}

#### ROI
Effort: {{roi.effort_hours}}h → Time saved: {{roi.time_saved_per_sprint_hours}}h/sprint (Payback: {{roi.payback_period_sprints}} sprints)

---
{{/each}}

## Medium Priority Recommendations

{{#each medium_priority_recommendations}}
### 🟡 {{recommendation_id}}: {{title}}

**Category:** {{category}} | **Effort:** {{effort.effort_level}} | **Impact:** {{impact.impact_score}}/100

{{suggested_action.summary}}

---
{{/each}}

## Domain Truth Update Recommendations

{{#if domain_truth_updates}}
{{#each domain_truth_updates}}
### {{recommendation_id}}: {{title}}

**Priority:** {{priority}} | **Effort:** {{effort}}

#### Missing Facts

{{#each missing_facts}}
**{{fact_category}}:** {{fact_description}}

Suggested addition to `domain-truth.yaml`:
```yaml
- id: {{suggested_fact_id}}
  {{yaml_snippet}}
```
{{/each}}

#### Incorrect Facts

{{#each incorrect_facts}}
**`{{fact_id}}`**
- Current: {{current_value}}
- Corrected: {{corrected_value}}

```yaml
{{yaml_snippet}}
```
{{/each}}

#### New Constraints

{{#each new_constraints}}
**{{constraint_description}}**

```yaml
{{yaml_snippet}}
```
{{/each}}

**Rationale:** {{rationale}}
**Impact:** {{impact}}

---
{{/each}}
{{else}}
_No domain truth updates recommended at this time._
{{/if}}

## Eval Test Improvement Recommendations

{{#if eval_test_improvements}}
{{#each eval_test_improvements}}
### {{recommendation_id}}: {{title}}

**Priority:** {{priority}} | **Effort:** {{effort}}

#### Coverage Gaps

{{#each coverage_gaps}}
**`{{fact_id}}`:** {{fact_description}}

Suggested test: `{{suggested_test_name}}`
```
{{test_outline}}
```
{{/each}}

#### Test Quality Issues

{{#each test_quality_issues}}
**`{{test_name}}`**
- Issue: {{issue}}
- Fix: {{suggested_fix}}

```javascript
{{code_example}}
```
{{/each}}

#### New Test Categories

{{#each new_test_categories}}
**{{category}}**
{{rationale}}

Example tests:
{{#each example_tests}}
- `{{test_name}}`: {{test_outline}}
{{/each}}
{{/each}}

**Impact:** {{impact}}

---
{{/each}}
{{else}}
_No eval test improvements recommended at this time._
{{/if}}

## Validation Rule Tuning Recommendations

{{#if validation_rule_tuning}}
{{#each validation_rule_tuning}}
### {{recommendation_id}}: {{title}}

**Priority:** {{priority}} | **Effort:** {{effort}}

#### Oracle Rules

{{#each oracle_rules}}
**{{rule_name}}**
- Current Threshold: {{current_threshold}}
- Suggested: {{suggested_threshold}}
- Rationale: {{rationale}}
{{/each}}

#### Validator Rules

{{#each validator_rules}}
**{{rule_name}}**
- Issue: {{issue}}
- Suggested Change: {{suggested_change}}
{{/each}}

#### Gate Thresholds

{{#each gate_thresholds}}
**{{gate_name}}**
- Current: {{current_threshold}}
- Suggested: {{suggested_threshold}}
- Rationale: {{rationale}}
{{/each}}

**Impact:** {{impact}}

---
{{/each}}
{{else}}
_No validation rule tuning recommended at this time._
{{/if}}

## Agent Strategy Update Recommendations

{{#if agent_strategy_updates}}
{{#each agent_strategy_updates}}
### {{recommendation_id}}: {{title}}

**Priority:** {{priority}} | **Effort:** {{effort}}
**Agent:** {{agent}}

#### Current vs Proposed Behavior

**Current:**
{{current_behavior}}

**Proposed:**
{{suggested_behavior}}

#### Strategy Changes

{{#each strategy_changes}}
**{{aspect}}**
- Current: {{current}}
- Proposed: {{proposed}}
{{/each}}

#### Expected Improvements

{{#each expected_improvement}}
- {{metric}}: {{current_value}} → {{expected_value}}
{{/each}}

**Rationale:** {{rationale}}
**Impact:** {{impact}}

---
{{/each}}
{{else}}
_No agent strategy updates recommended at this time._
{{/if}}

## Workflow Optimization Recommendations

{{#if workflow_optimizations}}
{{#each workflow_optimizations}}
### {{recommendation_id}}: {{title}}

**Priority:** {{priority}} | **Effort:** {{effort}}

#### Bottleneck Identified
{{bottleneck_identified}}

#### Current Workflow
```
{{current_workflow}}
```

#### Optimized Workflow
```
{{optimized_workflow}}
```

#### Changes

{{#each changes}}
**Phase: {{phase}}**
- Current: {{current_process}}
- Optimized: {{optimized_process}}
- **Time Savings:** {{time_savings_hours}}h
{{/each}}

#### Automation Opportunities

{{#each automation_opportunities}}
**{{task}}**
- Current Manual Effort: {{current_manual_effort_hours}}h
- Automation Effort: {{automation_effort_hours}}h
- Frequency: {{recurring_frequency}}
- **ROI:** High (recurring savings)
{{/each}}

**Impact:** {{impact}}

---
{{/each}}
{{else}}
_No workflow optimizations recommended at this time._
{{/if}}

## Human Checkpoint Tuning Recommendations

{{#if human_checkpoint_tuning}}
{{#each human_checkpoint_tuning}}
### {{recommendation_id}}: {{title}}

**Priority:** {{priority}} | **Effort:** {{effort}}

**Checkpoint:** {{checkpoint}}
- Current Frequency: {{current_frequency}}
- Suggested Frequency: {{suggested_frequency}}

**Rationale:** {{rationale}}

#### Trade-offs
- **Autonomy Increase:** {{trade_offs.autonomy_increase}}
- **Risk Increase:** {{trade_offs.risk_increase}}
- **Mitigation:** {{trade_offs.mitigation}}

**Impact:** {{impact}}

---
{{/each}}
{{else}}
_No human checkpoint tuning recommended at this time._
{{/if}}

---

## Implementation Roadmap

### Immediate Actions (Within 1 Sprint)

{{#each roadmap.immediate_actions}}
- [ ] **{{recommendation_id}}**: {{title}} ({{effort_hours}}h)
{{/each}}

### Short-Term (1-3 Sprints)

{{#each roadmap.short_term}}
- [ ] **{{recommendation_id}}**: {{title}} (Priority: {{priority}}, {{effort_hours}}h)
{{/each}}

### Long-Term (3+ Sprints)

{{#each roadmap.long_term}}
- [ ] **{{recommendation_id}}**: {{title}} (Priority: {{priority}}, {{effort_hours}}h)
{{/each}}

---

## Next Steps

1. **Review Critical Recommendations** - Address immediately
2. **Prioritize High-Impact Items** - Focus on best ROI
3. **Assign Owners** - Allocate to appropriate team members
4. **Track Progress** - Monitor implementation status
5. **Verify Effectiveness** - Measure impact after implementation

---

**Related Documents:**
- Pattern Library: `reflections/pattern-library.yaml`
- Health Dashboard: `baselines/health-dashboard.yaml`
- Recent Failure Analyses: `reflections/failures/`

---

[[LLM: When generating recommendations:
1. Prioritize by ROI (time saved / effort required)
2. Focus on preventing recurring failures
3. Suggest specific, actionable changes with code examples
4. Calculate realistic effort estimates
5. Link recommendations to evidence (failures, patterns, metrics)
6. Ensure recommendations are implementable within 1-2 sprints
7. Consider dependencies and sequencing]]
