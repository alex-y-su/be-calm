# Oracle Task: Validate Enhancement (Brownfield)

**Task ID:** oracle-validate-enhancement
**Agent:** Oracle
**Category:** Brownfield Validation
**When to Use:** Validate complete enhancement proposal against all three truths

---

## Purpose

Perform comprehensive validation of a brownfield enhancement against:
1. **Existing System Truth** (respects current state)
2. **Domain Truth** (moves toward ideal state)
3. **Enhancement Truth** (migration strategy is sound)

**This is the final validation before implementation.**

---

## Context

You are the Oracle agent in **brownfield mode**. An enhancement has been proposed with full migration strategy. Before development begins, you must validate the ENTIRE enhancement plan for:
- Compatibility with existing system
- Alignment with domain truth
- Soundness of migration strategy
- Completeness of planning

---

## Inputs Required

1. **Enhancement truth file** (`enhancement-truth.yaml`)
2. **Existing system truth** (`existing-system-truth.yaml`)
3. **Domain truth** (`domain-truth.yaml`)
4. **PRD enhancements** (docs/prd.md - brownfield sections)

**Optional:**
- **Architecture changes** (docs/architecture.md - brownfield sections)
- **Migration strategy** (migration-strategy.yaml)

---

## Enhancement Validation Process

### Step 1: Load All Three Truths

```yaml
truth_sources:
  existing:
    file: "docs/existing-system-truth.yaml"
    facts: 27
    constraints: 8

  domain:
    file: "docs/domain-truth.yaml"
    facts: 47
    constraints: 12

  enhancement:
    file: "docs/enhancement-truth.yaml"
    enhancements: 15
    breaking_changes: 3
```

### Step 2: Validate Enhancement Structure

Check that `enhancement-truth.yaml` is properly formed:

```yaml
structure_validation:
  has_reconciliation_source: true ✅
  has_enhancements_list: true ✅
  has_migration_strategies: true ✅

  completeness:
    all_enhancements_have_current_state: true ✅
    all_enhancements_have_target_state: true ✅
    all_breaking_changes_have_migration: true ✅
    all_enhancements_reference_domain_facts: true ✅

  verdict: "STRUCTURE VALID ✅"
```

### Step 3: Validate Each Enhancement

For each enhancement in enhancement-truth.yaml:

```yaml
enhancement_validation:
  enhancement_id: "ENH-001"
  title: "Reduce JWT token expiry to 15 minutes"

  # 3.1 Current State Validation
  current_state_check:
    declared_current:
      fact_id: "EXIST-BIZ-002"
      value: "30 minutes"

    actual_existing_truth:
      fact_id: "BIZ-002"
      value: "30 minutes"

    match: true ✅

  # 3.2 Target State Validation
  target_state_check:
    declared_target:
      fact_id: "FACT-001"
      value: "15 minutes"

    actual_domain_truth:
      fact_id: "FACT-001"
      value: "15 minutes"

    match: true ✅

  # 3.3 Rationale Validation
  rationale_check:
    rationale_provided: true ✅
    rationale: "Security best practice: shorter session timeout"
    aligns_with_domain_truth: true ✅

  # 3.4 Breaking Change Assessment
  breaking_change_validation:
    declared_breaking: true
    actual_breaking: true
    match: true ✅

    migration_strategy_ref: "MIG-001"
    migration_exists: true ✅

  # 3.5 Backward Compatibility Period
  compatibility_period_check:
    declared_period: "3 months"
    reasonable: true ✅
    implementation_plan: "Phased rollout with client updates"
    rollback_plan: true ✅

  verdict: "ENH-001 VALID ✅"
```

### Step 4: Validate Enhancement Consistency

Check that enhancements don't conflict with each other:

```yaml
cross_enhancement_validation:
  enhancements_checked: 15

  conflicts_found:
    - conflict_id: "CONF-001"
      enhancement_1: "ENH-003 (Add rate limiting)"
      enhancement_2: "ENH-007 (Increase API throughput)"
      issue: "Rate limiting may conflict with throughput goals"
      severity: "warning"
      resolution_needed: true

  dependencies_found:
    - dependency_id: "DEP-001"
      enhancement: "ENH-005 (Email verification)"
      depends_on: "ENH-002 (Email service integration)"
      dependency_type: "prerequisite"
      order_enforced: true ✅

  verdict: "1 conflict needs resolution ⚠️"
```

### Step 5: Validate Migration Completeness

Ensure all breaking changes have migration strategies:

```yaml
migration_completeness:
  breaking_enhancements: 3

  migration_strategies:
    - enhancement_id: "ENH-001"
      breaking: true
      migration_strategy_ref: "MIG-001"
      migration_exists: true ✅
      phases: 4
      timeline: "7 weeks"
      rollback_plan: true ✅

    - enhancement_id: "ENH-005"
      breaking: true
      migration_strategy_ref: "MIG-002"
      migration_exists: true ✅
      phases: 3
      timeline: "5 weeks"
      rollback_plan: true ✅

    - enhancement_id: "ENH-009"
      breaking: true
      migration_strategy_ref: "MIG-003"
      migration_exists: false ❌
      issue: "Breaking change without migration plan"

  verdict: "1 missing migration strategy ❌"
```

### Step 6: Validate Traceability

Ensure enhancements trace to domain truth:

```yaml
traceability_validation:
  total_enhancements: 15

  domain_truth_traceability:
    with_domain_fact_reference: 15/15 (100%) ✅
    with_existing_fact_reference: 12/15 (80%) ⚠️
    without_existing_reference: 3 (new features)

  prd_traceability:
    enhancements_in_prd: 15/15 (100%) ✅

  architecture_traceability:
    enhancements_with_architecture_changes: 12/15 (80%)
    documented_in_architecture: 12/12 (100%) ✅

  verdict: "TRACEABILITY COMPLETE ✅"
```

### Step 7: Validate Constraint Compliance

Check that enhancements respect existing constraints:

```yaml
constraint_compliance:
  existing_constraints: 8

  constraint_checks:
    - constraint_id: "CON-001"
      rule: "Must maintain API backward compatibility"

      enhancements_affecting:
        - ENH-001: "Changes token expiry"
          compliance: "COMPLIES (has migration)"
        - ENH-003: "Adds rate limiting"
          compliance: "COMPLIES (non-breaking addition)"

      verdict: "COMPLIES ✅"

    - constraint_id: "CON-002"
      rule: "Performance must not degrade"

      enhancements_affecting:
        - ENH-003: "Adds rate limiting overhead"
          impact: "+5ms per request"
          baseline: "p95: 180ms"
          projected: "p95: 185ms"
          acceptable_degradation: "10% (198ms)"
          compliance: "COMPLIES ✅"

      verdict: "COMPLIES ✅"

  violations: 0
  verdict: "ALL CONSTRAINTS RESPECTED ✅"
```

### Step 8: Validate Technical Debt Handling

Check if enhancements address or worsen technical debt:

```yaml
technical_debt_validation:
  existing_debt_items: 7

  debt_addressed:
    - debt_id: "DEBT-001"
      issue: "No rate limiting"
      addressed_by: "ENH-003"
      resolution: "Adds rate limiting middleware"
      status: "RESOLVED ✅"

    - debt_id: "DEBT-002"
      issue: "Hardcoded configuration"
      addressed_by: "ENH-001 (makes expiry configurable)"
      resolution: "Partial (only token expiry)"
      status: "PARTIALLY RESOLVED ⚠️"

  debt_worsened:
    - debt_id: "DEBT-005"
      issue: "Complex authentication logic"
      worsened_by: "ENH-005 (adds email verification)"
      impact: "Increases auth complexity"
      mitigation: "Refactor auth module in Phase 2"
      acceptable: true

  new_debt_introduced:
    - new_debt_id: "DEBT-008"
      introduced_by: "ENH-001"
      issue: "Dual-token-expiry support during migration"
      temporary: true
      removal_date: "After migration complete (7 weeks)"

  verdict: "DEBT IMPACT ACCEPTABLE ✅"
```

### Step 9: Generate Enhancement Validation Report

Use template: `bmad-core/templates/compatibility-validation-tmpl.md`

```yaml
enhancement_validation_report:
  timestamp: "2025-10-04T10:30:00Z"
  enhancement_truth_file: "docs/enhancement-truth.yaml"

  overall_status: "CONDITIONALLY APPROVED"

  validation_results:
    structure: "VALID ✅"
    individual_enhancements: "14/15 VALID (1 missing migration)"
    cross_enhancement_consistency: "1 conflict ⚠️"
    migration_completeness: "2/3 complete (1 missing)"
    traceability: "COMPLETE ✅"
    constraint_compliance: "COMPLIES ✅"
    technical_debt: "ACCEPTABLE ✅"

  critical_issues:
    - issue_id: "ISSUE-001"
      severity: "critical"
      description: "ENH-009 has no migration strategy"
      action_required: "Create MIG-003 before proceeding"

  warnings:
    - warning_id: "WARN-001"
      severity: "warning"
      description: "ENH-003 and ENH-007 may conflict"
      action_required: "Validate rate limiting doesn't block throughput goals"

  recommendations:
    high_priority:
      - "Create MIG-003 for ENH-009"
      - "Resolve ENH-003/ENH-007 conflict"

    medium_priority:
      - "Complete DEBT-002 resolution in Phase 2"

  approval_decision:
    proceed: "YES - after addressing critical issues"
    blockers: 1 (ENH-009 migration)
    warnings: 1 (conflict resolution)
```

---

## Validation Checklist

### ✅ Structure Validation
- [ ] enhancement-truth.yaml properly formatted
- [ ] All required sections present
- [ ] References valid (existing-truth, domain-truth)

### ✅ Enhancement Validation
- [ ] All enhancements have current state
- [ ] All enhancements have target state
- [ ] All target states reference domain truth
- [ ] Rationales provided and sound

### ✅ Migration Validation
- [ ] All breaking changes have migration strategies
- [ ] Migration phases reasonable
- [ ] Rollback plans exist
- [ ] Timeline realistic

### ✅ Consistency Validation
- [ ] No conflicting enhancements
- [ ] Dependencies identified and ordered
- [ ] Enhancements align with each other

### ✅ Compliance Validation
- [ ] Existing constraints respected
- [ ] Performance baselines maintained
- [ ] API compatibility preserved (or migrated)

### ✅ Completeness Validation
- [ ] All enhancements in PRD
- [ ] Architecture updated for changes
- [ ] Test strategy defined
- [ ] Technical debt addressed

---

## Success Criteria

- [ ] All three truth sources validated
- [ ] Enhancement structure correct
- [ ] All enhancements validated individually
- [ ] Cross-enhancement consistency checked
- [ ] Migration strategies complete
- [ ] Traceability confirmed
- [ ] Constraints respected
- [ ] Validation report generated
- [ ] Approval decision made

---

## Examples

### Example 1: Fully Valid Enhancement

```yaml
Enhancement: Add email verification requirement

Validation:
  structure: ✅ VALID
  current_state: ✅ Matches EXIST-BIZ-001
  target_state: ✅ Matches FACT-002
  breaking: ✅ Correctly identified
  migration: ✅ MIG-002 exists
  constraints: ✅ All respected

Decision: APPROVED ✅
```

### Example 2: Enhancement Needs Work

```yaml
Enhancement: Reduce token expiry

Validation:
  structure: ✅ VALID
  current_state: ✅ Matches
  target_state: ✅ Matches
  breaking: ✅ Identified
  migration: ❌ MIG-003 missing
  constraints: ⚠️ May violate CON-001

Decision: CONDITIONAL - Create MIG-003 first
```

---

## Integration Points

**Called by:**
- Oracle (final validation before development)
- PO agent (before sharding enhancement PRD)
- User (manual enhancement validation)

**Uses:**
- `existing-system-truth.yaml`
- `domain-truth.yaml`
- `enhancement-truth.yaml`
- `migration-strategy.yaml`

**Triggers:**
- `analyze-migration-path` (if migrations incomplete)
- `check-cross-document-consistency` (verify PRD/Architecture alignment)

---

## Command Signature

```bash
bmad oracle validate-enhancement \
  --enhancement-truth docs/enhancement-truth.yaml \
  --existing-truth docs/existing-system-truth.yaml \
  --domain-truth docs/domain-truth.yaml \
  --output docs/validation/enhancement-validation-report.md
```

---

**Final validation ensures brownfield enhancements are safe, complete, and aligned.**
