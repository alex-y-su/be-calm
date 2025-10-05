# Compatibility Validation Report

**Project:** {{project_name}}
**Enhancement:** {{enhancement_name}}
**Analysis Date:** {{timestamp}}
**Compatibility Agent Version:** {{agent_version}}
**Overall Status:** {{overall_status}}

---

## Executive Summary

**Breaking Changes Detected:** {{breaking_changes_count}}
**Compatibility Risks:** {{risk_count}}
**Migration Complexity:** {{migration_complexity}}
**Backward Compatibility:** {{backward_compatible}}

{{executive_summary_text}}

---

## Existing System Analysis

### Current State

**System Version:** {{existing_version}}
**Architecture:** {{existing_architecture}}
**Key Constraints:**
{{#constraints}}
- {{constraint_id}}: {{constraint_description}}
{{/constraints}}

### Integration Points

| Integration | Type | Version | Criticality | Can Modify |
|-------------|------|---------|-------------|------------|
{{#integration_points}}
| {{name}} | {{type}} | {{version}} | {{criticality}} | {{can_modify}} |
{{/integration_points}}

---

## Enhancement Compatibility Analysis

### Proposed Changes

{{#changes}}
#### {{change_id}}: {{title}}

**Type:** {{change_type}}
**Scope:** {{scope}}

**Current State:**
{{current_state}}

**Target State:**
{{target_state}}

**Compatibility Assessment:**
- **Breaking Change:** {{is_breaking}}
- **Risk Level:** {{risk_level}}
- **Migration Required:** {{needs_migration}}
- **Backward Compatible:** {{is_backward_compatible}}

**Impact Analysis:**
{{impact_description}}

**Dependencies Affected:**
{{#affected_dependencies}}
- {{dependency_name}} ({{impact}})
{{/affected_dependencies}}

---
{{/changes}}

---

## Breaking Changes

{{#breaking_changes}}
### {{change_id}}: {{title}}

**Category:** {{category}}
**Severity:** {{severity}}
**Impact Radius:** {{impact_radius}}

**What Breaks:**
{{what_breaks}}

**Who Is Affected:**
{{#affected_consumers}}
- {{consumer_name}}: {{impact_description}}
{{/affected_consumers}}

**Migration Path:**
{{migration_description}}

**Timeline:**
- Deprecation Notice: {{deprecation_date}}
- Backward Compatible Until: {{compatibility_deadline}}
- Hard Cutover: {{cutover_date}}

---
{{/breaking_changes}}

---

## Compatibility Constraints

### Must Maintain

{{#must_maintain}}
- **{{constraint_id}}**: {{description}}
  - Current: {{current_value}}
  - After Change: {{new_value}}
  - Status: {{compliance_status}}
  - Mitigation: {{mitigation_strategy}}
{{/must_maintain}}

### May Change With Care

{{#may_change}}
- **{{constraint_id}}**: {{description}}
  - Risk: {{risk_level}}
  - Recommendation: {{recommendation}}
{{/may_change}}

### Cannot Change

{{#cannot_change}}
- **{{constraint_id}}**: {{description}}
  - Reason: {{reason}}
  - Alternative: {{alternative_approach}}
{{/cannot_change}}

---

## Migration Strategy

### Approach

**Strategy Type:** {{migration_strategy_type}}
**Duration:** {{migration_duration}}
**Phases:** {{phase_count}}

{{migration_overview}}

### Phased Rollout Plan

{{#phases}}
#### Phase {{phase_number}}: {{phase_name}}

**Duration:** {{duration}}
**Objective:** {{objective}}

**Actions:**
{{#actions}}
- {{action_description}}
{{/actions}}

**Deliverables:**
{{#deliverables}}
- {{deliverable}}
{{/deliverables}}

**Success Criteria:**
{{#criteria}}
- {{criterion}}
{{/criteria}}

**Rollback Plan:**
{{rollback_strategy}}

---
{{/phases}}

### Compatibility Layer

{{#compatibility_layer}}
**Required:** {{is_required}}
**Type:** {{layer_type}}
**Duration:** {{duration}}

**Components:**
{{#components}}
- {{component_name}}: {{description}}
{{/components}}

**Implementation:**
{{implementation_details}}

**Removal Date:** {{removal_date}}
{{/compatibility_layer}}

---

## Risk Assessment

### High Risk Areas

{{#high_risks}}
#### {{risk_id}}: {{title}}

**Probability:** {{probability}}
**Impact:** {{impact}}
**Risk Score:** {{score}}

**Description:**
{{description}}

**Indicators:**
{{#indicators}}
- {{indicator}}
{{/indicators}}

**Mitigation:**
{{mitigation}}

**Contingency:**
{{contingency}}

---
{{/high_risks}}

### Medium Risk Areas

{{#medium_risks}}
- **{{risk_id}}**: {{description}} (Mitigation: {{mitigation}})
{{/medium_risks}}

---

## Performance Impact

### Baseline Metrics

| Metric | Current | Target | Acceptable Degradation | Projected |
|--------|---------|--------|------------------------|-----------|
{{#performance_metrics}}
| {{metric_name}} | {{current_value}} | {{target_value}} | {{acceptable_degradation}} | {{projected_value}} |
{{/performance_metrics}}

### Performance Analysis

{{#performance_analysis}}
**{{metric_name}}:**
- Current: {{current}}
- After Enhancement: {{projected}}
- Change: {{change_percentage}}
- Assessment: {{assessment}}
- Mitigation: {{mitigation}}

{{/performance_analysis}}

---

## Regression Prevention

### Critical Functionality to Preserve

{{#critical_functionality}}
- **{{function_id}}**: {{description}}
  - Test Coverage: {{test_coverage}}
  - Regression Tests: {{regression_test_count}}
  - Validation: {{validation_method}}
{{/critical_functionality}}

### Regression Test Suite

**Total Tests:** {{regression_test_count}}
**Coverage:** {{regression_coverage}}%

**Test Categories:**
{{#test_categories}}
- {{category}}: {{count}} tests
{{/test_categories}}

**Test Dataset Reference:** `{{test_dataset_path}}`

---

## API Compatibility

### Public API Changes

{{#api_changes}}
#### {{api_name}}

**Change Type:** {{change_type}}
**Breaking:** {{is_breaking}}

**Before:**
```{{language}}
{{before_signature}}
```

**After:**
```{{language}}
{{after_signature}}
```

**Migration:**
```{{language}}
{{migration_example}}
```

**Deprecation Timeline:**
- Deprecated: {{deprecation_date}}
- Removed: {{removal_date}}

---
{{/api_changes}}

### Contract Validation

{{#contracts}}
- **{{contract_name}}**: {{validation_status}}
  - Consumers: {{consumer_count}}
  - Breaking Changes: {{breaking_count}}
  - Migration Required: {{needs_migration}}
{{/contracts}}

---

## Data Compatibility

### Schema Changes

{{#schema_changes}}
#### {{schema_name}}

**Change Type:** {{change_type}}
**Breaking:** {{is_breaking}}

**Current Schema:**
```{{schema_format}}
{{current_schema}}
```

**New Schema:**
```{{schema_format}}
{{new_schema}}
```

**Migration Script:** `{{migration_script_path}}`
**Rollback Script:** `{{rollback_script_path}}`

**Data Volume:** {{record_count}} records
**Migration Time Estimate:** {{migration_time}}

---
{{/schema_changes}}

---

## Consumer Impact Assessment

### External Consumers

{{#external_consumers}}
#### {{consumer_name}}

**Integration Type:** {{integration_type}}
**Breaking Changes Affecting:** {{breaking_change_count}}
**Notification Required:** {{needs_notification}}
**Migration Support Required:** {{needs_support}}

**Impact:**
{{impact_description}}

**Action Items:**
{{#action_items}}
- {{action}}
{{/action_items}}

---
{{/external_consumers}}

### Internal Consumers

{{#internal_consumers}}
- **{{consumer_name}}**: {{impact}} (Owner: {{owner}})
{{/internal_consumers}}

---

## Validation Results

### Compatibility Tests

**Tests Run:** {{tests_run}}
**Passed:** {{tests_passed}}
**Failed:** {{tests_failed}}
**Skipped:** {{tests_skipped}}

{{#failed_tests}}
#### ❌ {{test_name}}

**Reason:** {{failure_reason}}
**Impact:** {{impact}}
**Fix Required:** {{fix_description}}

{{/failed_tests}}

### Compliance Checks

{{#compliance_checks}}
- **{{check_name}}**: {{status}}
  - Requirement: {{requirement}}
  - Result: {{result}}
  - Notes: {{notes}}
{{/compliance_checks}}

---

## Recommendations

### Must Address

{{#must_address}}
- **{{recommendation_id}}**: {{description}}
  - Priority: CRITICAL
  - Effort: {{effort}}
  - Owner: {{owner}}
{{/must_address}}

### Should Address

{{#should_address}}
- **{{recommendation_id}}**: {{description}}
  - Priority: HIGH
  - Effort: {{effort}}
{{/should_address}}

### Consider

{{#consider}}
- {{description}}
{{/consider}}

---

## Sign-Off Requirements

**Compatibility Review:** {{compatibility_review_status}}
**Architecture Review:** {{architecture_review_status}}
**Security Review:** {{security_review_status}}
**Performance Review:** {{performance_review_status}}

**Approvals Needed:**
{{#approvals}}
- {{approver_role}}: {{status}}
{{/approvals}}

---

## Next Steps

1. {{next_step_1}}
2. {{next_step_2}}
3. {{next_step_3}}

---

**Validated by Compatibility Agent**
**Oracle Validation:** {{oracle_validation_ref}}
**Enhancement Truth Reference:** {{enhancement_truth_file}}
