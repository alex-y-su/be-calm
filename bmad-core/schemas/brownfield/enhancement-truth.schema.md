# Enhancement Truth Schema Specification

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Define what WILL change in brownfield enhancements (reconciliation layer)
**Scope:** Level 0.5 truth - bridges existing-system-truth (IS) and domain-truth (SHOULD)

---

## Overview

The `enhancement-truth.yaml` file captures the **reconciliation between current state and desired state**. It defines exactly what will change, what must stay the same, and how the transition will occur while maintaining compatibility.

### Key Principles

1. **Explicit Change Definition** - Every change is documented and justified
2. **Compatibility Preservation** - Define what CANNOT change
3. **Incremental Evolution** - Changes must be testable and reversible
4. **Dual Validation** - Must pass both regression tests (old) and new tests

---

## Schema Structure

```yaml
# enhancement-truth.yaml

metadata:
  version: string                    # Semantic version (e.g., "1.0.0")
  created_date: ISO8601
  last_updated: ISO8601
  enhancement_name: string
  target_completion_date: ISO8601
  authors: [string]
  approval_status: enum              # [draft, approved, in_progress, completed]

enhancement_overview:
  name: string
  description: string                # What this enhancement achieves
  business_value: string             # Why this enhancement matters
  target_version: string             # Target system version after enhancement

  scope:
    included: [string]
    excluded: [string]
    future_consideration: [string]

  success_criteria:                  # How to measure success
    - criterion: string
      measurement: string
      target: string
      test_dataset_id: string

reconciliation_analysis:
  gaps:                              # Gaps between IS and SHOULD
    - id: string                     # Gap ID
      category: enum                 # [missing_feature, incorrect_behavior, performance, security]
      current_state: string          # From existing-system-truth
      desired_state: string          # From domain-truth
      impact: enum                   # [critical, high, medium, low]
      resolution_approach: string

  alignments:                        # Where IS already matches SHOULD
    - aspect: string
      current_implementation: string
      domain_requirement: string
      validation_test_id: string     # Regression test to preserve this

  conflicts:                         # Where IS contradicts SHOULD
    - id: string
      conflict_description: string
      existing_behavior: string      # What currently happens
      required_behavior: string      # What should happen
      breaking_change: boolean
      resolution_strategy: string
      migration_approach: string
      test_dataset_id: string

changes_required:
  additions:                         # New functionality to add
    - id: string                     # Change ID
      type: enum                     # [feature, component, api, data_model]
      name: string
      description: string

      domain_truth_references: [string]  # Domain requirements this satisfies
      justification: string

      implementation:
        approach: string
        components_affected: [string]
        new_components: [string]

      testing:
        new_test_datasets: [string]
        regression_impact: [string]  # Which regression tests might be affected

      rollout_strategy: enum         # [feature_flag, phased, big_bang]
      rollback_plan: string

  modifications:                     # Changes to existing functionality
    - id: string
      type: enum                     # [behavior_change, performance_improvement, refactor]
      component_id: string           # From existing-system-truth
      name: string
      description: string

      current_behavior:
        description: string
        code_location: string
        regression_test_id: string   # Test for current behavior

      new_behavior:
        description: string
        domain_truth_reference: string
        new_test_dataset_id: string

      breaking_change_analysis:
        is_breaking: boolean
        affected_consumers: [string]
        mitigation_strategy: string
        compatibility_test_id: string

      backward_compatibility:
        required: boolean
        approach: string             # How to maintain compatibility
        deprecation_plan: string     # If applicable
        test_dataset_id: string

  deprecations:                      # Functionality to remove
    - id: string
      component_id: string
      name: string
      reason: string

      current_usage:
        consumers: [string]
        usage_frequency: string
        last_used_date: ISO8601

      deprecation_timeline:
        announcement_date: ISO8601
        deprecation_date: ISO8601
        removal_date: ISO8601

      migration_path:
        alternative: string
        migration_guide: string
        automated_migration: boolean
        migration_test_id: string

      impact_analysis:
        affected_systems: [string]
        communication_plan: string

immutable_constraints:
  must_not_change:                   # Hard constraints from compatibility
    - constraint_id: string
      type: enum                     # [api_contract, data_format, behavior, performance]
      description: string
      reason: string
      affected_by: [string]          # Change IDs that might affect this
      validation_test_id: string     # Test that ensures this doesn't change

  compatibility_boundaries:
    - boundary_id: string
      description: string
      constraint: string
      validation_method: string

data_migrations:
  - migration_id: string
    name: string
    description: string
    type: enum                       # [schema_change, data_transformation, data_cleanup]

    source:
      schema: string
      data_location: string
      record_count: integer

    target:
      schema: string
      data_location: string
      expected_record_count: integer

    transformation_logic:
      description: string
      rules: [string]
      edge_cases: [string]

    validation:
      pre_migration_checks: [string]
      post_migration_checks: [string]
      rollback_procedure: string
      test_dataset_id: string

    execution_plan:
      timing: enum                   # [before_deployment, during_deployment, after_deployment]
      duration_estimate: string
      downtime_required: boolean
      downtime_duration: string

api_evolution:
  - api_id: string
    endpoint: string
    change_type: enum                # [new_endpoint, modify_existing, deprecate]

    current_version: string
    new_version: string

    changes:
      request_changes: [string]
      response_changes: [string]
      breaking_changes: [boolean]

    versioning_strategy:
      approach: enum                 # [url_versioning, header_versioning, content_negotiation]
      support_plan: string           # How long old version is supported

    consumer_impact:
      - consumer: string
        impact_level: enum           # [breaking, degraded, none]
        migration_required: boolean
        migration_effort: string

    testing:
      new_test_dataset_id: string
      compatibility_test_id: string
      consumer_test_ids: [string]

integration_changes:
  - integration_id: string           # From existing-system-truth
    name: string
    change_type: enum                # [new_integration, modify_existing, remove]

    current_integration:
      description: string
      provider: string
      version: string

    new_integration:
      description: string
      provider: string
      version: string
      migration_required: boolean

    compatibility_risk: enum         # [high, medium, low]
    fallback_strategy: string
    test_dataset_id: string

phased_rollout:
  phases:
    - phase_id: string
      name: string
      description: string
      order: integer

      includes:                      # Change IDs in this phase
        additions: [string]
        modifications: [string]
        deprecations: [string]

      dependencies: [string]         # Phase IDs this depends on
      duration_estimate: string

      validation:
        success_criteria: [string]
        test_dataset_ids: [string]
        rollback_triggers: [string]

      deployment_strategy:
        approach: enum               # [blue_green, canary, rolling, feature_flag]
        percentage_rollout: [integer] # For canary/percentage-based
        monitoring_metrics: [string]

risk_mitigation:
  risks:
    - risk_id: string
      category: enum                 # [technical, business, operational, security]
      description: string
      probability: enum              # [high, medium, low]
      impact: enum                   # [critical, high, medium, low]

      affected_changes: [string]     # Change IDs affected by this risk

      mitigation_strategy:
        approach: string
        implementation: string
        validation_test_id: string

      contingency_plan:
        trigger_conditions: [string]
        actions: [string]
        rollback_procedure: string

performance_impact:
  - component_id: string
    current_baseline:
      metric: string
      value: string
      test_dataset_id: string

    expected_after_enhancement:
      metric: string
      value: string
      acceptable_range: string
      test_dataset_id: string

    regression_threshold: string     # Max acceptable degradation
    monitoring_plan: string

feature_flags:
  - flag_id: string
    name: string
    description: string
    controls_changes: [string]       # Change IDs controlled by this flag

    default_state: boolean
    rollout_strategy:
      approach: string
      percentage_groups: [integer]
      user_targeting: string

    cleanup_plan:
      removal_date: ISO8601
      removal_procedure: string

testing_strategy:
  new_tests:                         # Tests for new functionality
    - test_suite_id: string
      name: string
      type: enum                     # [unit, integration, e2e, performance]
      covers_changes: [string]       # Change IDs this tests
      test_dataset_ids: [string]
      automation_level: enum         # [fully_automated, partially_automated, manual]

  regression_tests:                  # Existing tests that must still pass
    - test_suite_id: string
      name: string
      location: string
      criticality: enum              # [critical, important, nice_to_have]
      expected_result: enum          # [pass, pass_with_changes, deprecated]

  migration_tests:                   # Tests for migration/transition
    - test_suite_id: string
      name: string
      validates: string
      test_dataset_id: string

  compatibility_tests:               # Tests for backward compatibility
    - test_suite_id: string
      name: string
      validates_constraint: string
      test_dataset_id: string

observability_enhancements:
  new_metrics:
    - metric_name: string
      type: enum                     # [counter, gauge, histogram]
      purpose: string
      threshold_alerts: [string]

  new_logs:
    - log_category: string
      events_to_log: [string]
      retention_period: string

  new_traces:
    - trace_name: string
      covers_flow: string
      sampling_rate: string

documentation_updates:
  - document_type: enum              # [api_docs, user_guide, architecture, runbook]
    location: string
    changes_required: [string]
    responsible_party: string

validation_linkage:
  existing_system_truth_file: string
  domain_truth_file: string
  compatibility_analysis_file: string
  migration_strategy_file: string
  test_datasets_dir: string

traceability:
  traces_to:
    - source_type: enum              # [domain_truth, existing_system, business_requirement]
      source_id: string
      relationship: string

  traced_by:
    - artifact_type: enum            # [story, code, test, documentation]
      artifact_id: string
      elements: [string]
```

---

## Usage Guidelines

### For Oracle Agent

When creating enhancement truth:

1. **Analyze Gaps** - Compare existing-system-truth to domain-truth
2. **Identify Conflicts** - Find where IS contradicts SHOULD
3. **Define Changes** - Specify exactly what will change
4. **Establish Constraints** - Define what CANNOT change
5. **Plan Validation** - Link to test datasets for all changes

### For Compatibility Agent

When validating enhancement truth:

1. **Check Constraints** - Ensure immutable constraints are respected
2. **Validate Impact** - Analyze breaking change implications
3. **Test Compatibility** - Run compatibility test datasets
4. **Verify Rollback** - Ensure rollback plans are viable

### For PM/Architect Agents

When using enhancement truth:

1. **PRD Must Respect** - All changes must reference enhancement truth
2. **Architecture Must Align** - Design must support migration strategy
3. **Stories Must Trace** - Every story traces to a change ID
4. **Tests Must Cover** - Both new behavior and regression

### Validation Requirements

Every enhancement-truth file must:

- [ ] Reference existing-system-truth for current state
- [ ] Reference domain-truth for desired state
- [ ] Define explicit changes with test datasets
- [ ] Identify and protect immutable constraints
- [ ] Provide rollback plans for all changes
- [ ] Link to migration strategy
- [ ] Include both new tests and regression tests

---

## Examples

### Minimal Enhancement Truth (Add Discount Support to Cart)

```yaml
metadata:
  version: "1.0.0"
  created_date: "2025-10-04T10:00:00Z"
  enhancement_name: "Add Discount Code Support to Shopping Cart"
  target_completion_date: "2025-11-15T00:00:00Z"
  approval_status: approved

enhancement_overview:
  name: "Discount Code Support"
  description: "Enable users to apply discount codes to shopping cart"
  business_value: "Increase conversions by 15% through promotional campaigns"
  success_criteria:
    - criterion: "Users can apply valid discount codes"
      measurement: "Test dataset pass rate"
      target: "100%"
      test_dataset_id: "ENHANCEMENT-TEST-001"

reconciliation_analysis:
  gaps:
    - id: "GAP-001"
      category: missing_feature
      current_state: "No discount code functionality exists"
      desired_state: "Users can apply and validate discount codes"
      impact: high
      resolution_approach: "Add new DiscountService and update CartCalculator"

  alignments:
    - aspect: "Cart total calculation"
      current_implementation: "Existing CartCalculator.calculateTotal()"
      domain_requirement: "Total must be sum of items + tax"
      validation_test_id: "REGRESSION-TEST-001"

  conflicts:
    - id: "CONFLICT-001"
      conflict_description: "Current total calculation doesn't account for discounts"
      existing_behavior: "total = items + tax"
      required_behavior: "total = items + tax - discount"
      breaking_change: false
      resolution_strategy: "Extend calculation, maintain backward compatibility"
      migration_approach: "Discount defaults to 0 if not provided"
      test_dataset_id: "MIGRATION-TEST-001"

changes_required:
  additions:
    - id: "ADD-001"
      type: component
      name: "DiscountService"
      description: "Service to validate and apply discount codes"
      domain_truth_references: ["FR-012"]
      implementation:
        approach: "New microservice for discount management"
        components_affected: ["CartService", "CheckoutService"]
        new_components: ["DiscountService", "DiscountValidator"]
      testing:
        new_test_datasets: ["DISCOUNT-TEST-001", "DISCOUNT-TEST-002"]
        regression_impact: ["Must not affect existing cart calculations"]
      rollout_strategy: feature_flag
      rollback_plan: "Disable feature flag, remove discount from calculation"

  modifications:
    - id: "MOD-001"
      type: behavior_change
      component_id: "COMP-001"  # CartCalculator from existing-system-truth
      name: "Update Cart Total Calculation"
      current_behavior:
        description: "total = sum(items) + tax"
        code_location: "src/cart/CartCalculator.js:45"
        regression_test_id: "REGRESSION-TEST-001"
      new_behavior:
        description: "total = sum(items) + tax - discount"
        domain_truth_reference: "RULE-005"
        new_test_dataset_id: "CALC-WITH-DISCOUNT-001"
      breaking_change_analysis:
        is_breaking: false
        affected_consumers: []
        mitigation_strategy: "Discount parameter optional, defaults to 0"
        compatibility_test_id: "COMPAT-TEST-001"
      backward_compatibility:
        required: true
        approach: "Optional discount parameter, backward compatible API"
        test_dataset_id: "BACKWARD-COMPAT-001"

immutable_constraints:
  must_not_change:
    - constraint_id: "CONST-001"
      type: api_contract
      description: "Existing cart API /api/v1/cart must remain compatible"
      reason: "Mobile app v1.5-2.0 depends on current contract"
      affected_by: ["MOD-001"]
      validation_test_id: "API-COMPAT-001"

api_evolution:
  - api_id: "API-ENHANCE-001"
    endpoint: "/api/v1/cart"
    change_type: modify_existing
    changes:
      request_changes: ["Add optional 'discountCode' field"]
      response_changes: ["Add 'appliedDiscount' field"]
      breaking_changes: [false]
    versioning_strategy:
      approach: content_negotiation
      support_plan: "Both versions supported for 6 months"
    consumer_impact:
      - consumer: "Mobile App v2.0"
        impact_level: none
        migration_required: false
      - consumer: "Mobile App v1.5"
        impact_level: none
        migration_required: false
    testing:
      new_test_dataset_id: "API-NEW-001"
      compatibility_test_id: "API-COMPAT-001"

testing_strategy:
  new_tests:
    - test_suite_id: "NEW-TEST-001"
      name: "Discount Code Validation Tests"
      type: integration
      covers_changes: ["ADD-001", "MOD-001"]
      test_dataset_ids: ["DISCOUNT-TEST-001", "DISCOUNT-TEST-002"]
      automation_level: fully_automated

  regression_tests:
    - test_suite_id: "REGRESSION-001"
      name: "Existing Cart Calculation Tests"
      location: "test/cart/calculator.test.js"
      criticality: critical
      expected_result: pass

  compatibility_tests:
    - test_suite_id: "COMPAT-001"
      name: "API Backward Compatibility"
      validates_constraint: "CONST-001"
      test_dataset_id: "API-COMPAT-001"

validation_linkage:
  existing_system_truth_file: "existing-system-truth.yaml"
  domain_truth_file: "domain-truth.yaml"
  compatibility_analysis_file: "compatibility-analysis.yaml"
  migration_strategy_file: "migration-strategy.yaml"
  test_datasets_dir: "test-datasets/discount-enhancement/"
```

---

## Reconciliation Process

### Step 1: Gap Analysis
- Compare existing-system-truth to domain-truth
- Identify missing features
- Find incorrect behaviors
- Note performance/security issues

### Step 2: Conflict Resolution
- Identify where IS contradicts SHOULD
- Determine if breaking change is necessary
- Plan migration approach
- Define compatibility constraints

### Step 3: Change Definition
- Define additions (new functionality)
- Define modifications (changes to existing)
- Define deprecations (removals)
- Link each to domain truth

### Step 4: Constraint Establishment
- Identify what CANNOT change
- Define compatibility boundaries
- Protect critical paths
- Create constraint validation tests

### Step 5: Test Strategy
- Create test datasets for new behavior
- Ensure regression tests still pass
- Add migration tests
- Add compatibility tests

---

## Related Schemas

- **existing-system-truth.yaml** - Current state (what IS)
- **domain-truth.yaml** - Desired state (what SHOULD be)
- **compatibility-analysis.yaml** - Impact analysis
- **migration-strategy.yaml** - How to execute changes
- **validation-chain-proof.yaml** - Proof of traceability

---

## Schema Validation

This schema can be validated using:

- Cross-reference validation (IS + SHOULD = WILL)
- Compatibility Agent checks
- Test dataset execution (new + regression)
- Migration simulation
- Validator Agent continuous validation
