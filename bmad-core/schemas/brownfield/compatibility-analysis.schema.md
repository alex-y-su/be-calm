# Compatibility Analysis Schema Specification

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Analyze compatibility impact of changes in brownfield projects
**Scope:** API compatibility, data compatibility, behavioral compatibility, integration impact

---

## Overview

The `compatibility-analysis.yaml` file provides **comprehensive impact analysis** for brownfield enhancements. It identifies breaking changes, assesses risk, validates backward compatibility, and defines mitigation strategies to ensure safe system evolution.

### Key Principles

1. **Explicit Break Analysis** - Every potential breaking change is identified and assessed
2. **Consumer Impact** - All affected consumers are catalogued with mitigation plans
3. **Data Safety** - Data migrations are validated for safety and reversibility
4. **Integration Preservation** - Third-party integrations remain functional
5. **Versioning Strategy** - Clear approach for managing multiple versions

---

## Schema Structure

```yaml
# compatibility-analysis.yaml

metadata:
  version: string                    # Semantic version
  analysis_date: ISO8601
  analyzed_by: [string]              # Agents/humans who performed analysis
  enhancement_id: string             # From enhancement-truth.yaml
  risk_level: enum                   # [critical, high, medium, low]

analysis_overview:
  enhancement_name: string
  description: string

  scope:
    components_affected: [string]    # From existing-system-truth
    consumers_affected: [string]
    integrations_affected: [string]

  overall_compatibility_assessment:
    breaking_changes_count: integer
    non_breaking_changes_count: integer
    compatibility_risk: enum         # [critical, high, medium, low]
    recommended_approach: enum       # [versioning, feature_flags, migration, parallel_run]

api_compatibility:
  endpoints_analyzed:
    - endpoint_id: string            # From existing-system-truth
      path: string
      method: enum                   # [GET, POST, PUT, DELETE, PATCH]

      current_contract:
        request_schema: string
        response_schema: string
        headers: [string]
        status_codes: [integer]

      proposed_changes:
        change_type: enum            # [new_field, remove_field, modify_field, new_endpoint, deprecate_endpoint]
        changes: [string]

      breaking_change_analysis:
        is_breaking: boolean
        break_type: enum             # [request_incompatible, response_incompatible, behavior_change, deprecation]
        affected_consumers:
          - consumer_name: string
            consumer_type: enum      # [internal_service, external_api, web_app, mobile_app, third_party]
            dependency_level: enum   # [critical, important, optional]
            version_range: string    # Consumer version range affected
            impact_description: string

        mitigation_strategy:
          approach: enum             # [versioning, deprecation, parallel_support, client_update]
          implementation: string
          timeline: string
          rollback_plan: string

      backward_compatibility:
        maintained: boolean
        approach: string             # How compatibility is maintained
        validation_test_id: string   # Test that proves compatibility

      consumer_migration:
        required: boolean
        migration_effort: enum       # [trivial, moderate, significant, major]
        migration_guide: string
        support_period: string       # How long old version is supported

data_compatibility:
  schema_changes:
    - entity_id: string              # From existing-system-truth
      entity_name: string
      storage_type: enum             # [sql, nosql, cache, file_system]

      current_schema:
        definition: string
        constraints: [string]

      proposed_schema:
        definition: string
        constraints: [string]

      compatibility_analysis:
        is_breaking: boolean
        break_type: enum             # [field_removed, type_changed, constraint_added, constraint_removed]
        impact: string

        data_migration_required: boolean
        migration_complexity: enum   # [simple, moderate, complex]
        data_loss_risk: enum         # [none, low, medium, high]

        backward_read_compatible: boolean   # Can old code read new data?
        backward_write_compatible: boolean  # Can old code write valid data?
        forward_read_compatible: boolean    # Can new code read old data?
        forward_write_compatible: boolean   # Can new code write to old schema?

      migration_strategy:
        approach: enum               # [in_place, dual_write, blue_green, shadow_write]
        steps: [string]
        validation_tests: [string]
        rollback_procedure: string

      validation:
        test_dataset_id: string
        migration_tested: boolean
        rollback_tested: boolean

behavioral_compatibility:
  behavior_changes:
    - component_id: string           # From existing-system-truth
      component_name: string
      change_type: enum              # [logic_change, algorithm_change, flow_change, performance_change]

      current_behavior:
        description: string
        code_location: string
        test_dataset_id: string      # Regression test for current behavior

      new_behavior:
        description: string
        justification: string        # Why change is necessary

      compatibility_impact:
        breaking: boolean
        observable_difference: string
        affected_consumers: [string]

        side_effects:
          - effect: string
            impact_level: enum       # [critical, high, medium, low]
            affected_systems: [string]

      migration_approach:
        strategy: enum               # [feature_flag, gradual_rollout, parallel_run, cutover]
        validation_method: string
        rollback_trigger: [string]   # Conditions that trigger rollback

      testing:
        compatibility_test_id: string
        comparison_test_id: string   # Test comparing old vs new behavior
        validation_passed: boolean

integration_compatibility:
  external_integrations:
    - integration_id: string         # From existing-system-truth
      name: string
      provider: string
      type: enum                     # [rest_api, graphql, soap, database, message_queue, file]

      current_integration:
        version: string
        contract: string
        data_format: string

      impact_analysis:
        affected_by_changes: [string]  # Enhancement change IDs
        breaking_impact: boolean
        degraded_functionality: boolean

        compatibility_risk: enum     # [critical, high, medium, low]
        failure_mode: string         # What happens if integration breaks

      validation_strategy:
        test_approach: string
        test_environment: string
        test_dataset_id: string

        fallback_plan: string
        monitoring_alerts: [string]

  internal_integrations:
    - integration_id: string
      consuming_service: string
      providing_service: string

      contract:
        type: enum                   # [api, event, database, shared_memory]
        definition: string

      impact_analysis:
        breaking_change: boolean
        affected_flows: [string]
        criticality: enum            # [critical, high, medium, low]

      coordination_required:
        services_to_update: [string]
        deployment_order: [string]   # Order services must be deployed
        coordination_window: string

version_compatibility:
  versioning_strategy:
    approach: enum                   # [semantic_versioning, date_versioning, api_versioning]
    current_version: string
    target_version: string
    breaking_change_indicator: string

  client_compatibility_matrix:
    - client_name: string
      client_type: enum              # [web_app, mobile_app, desktop_app, api_client]

      supported_versions:
        - version: string
          compatibility_status: enum # [fully_compatible, degraded, incompatible]
          required_updates: [string]
          migration_effort: string

      deprecation_timeline:
        announcement_date: ISO8601
        deprecation_date: ISO8601
        end_of_support_date: ISO8601
        removal_date: ISO8601

  multi_version_support:
    required: boolean
    versions_to_support: [string]
    support_duration: string
    maintenance_overhead: enum       # [low, medium, high]

performance_compatibility:
  performance_impacts:
    - component_id: string
      metric: enum                   # [response_time, throughput, resource_usage, latency]

      current_baseline:
        value: string
        measurement_date: ISO8601
        test_dataset_id: string

      projected_impact:
        new_value: string
        change_percentage: number
        acceptable: boolean
        threshold: string

      degradation_analysis:
        causes: [string]
        mitigation_options: [string]
        selected_mitigation: string

      validation:
        test_dataset_id: string
        performance_tested: boolean
        meets_requirements: boolean

security_compatibility:
  security_impacts:
    - change_id: string
      change_description: string

      current_security_posture:
        authentication: string
        authorization: string
        data_protection: string

      security_impact:
        impact_type: enum            # [authentication_change, authorization_change, encryption_change, exposure_change]
        severity: enum               # [critical, high, medium, low]
        affected_systems: [string]

      compliance_impact:
        regulations_affected: [string]  # e.g., GDPR, HIPAA, PCI-DSS
        compliance_maintained: boolean
        additional_requirements: [string]

      mitigation:
        approach: string
        validation_test_id: string

dependency_compatibility:
  dependency_changes:
    - dependency_name: string
      type: enum                     # [library, framework, service, database, runtime]

      current_version: string
      target_version: string

      compatibility_assessment:
        breaking_changes: [string]
        deprecated_features_used: [string]
        migration_required: boolean

      impact_on_system:
        affected_components: [string]
        code_changes_required: [string]
        test_updates_required: [string]

      upgrade_strategy:
        approach: string
        risk_level: enum             # [critical, high, medium, low]
        validation_test_id: string

risk_assessment:
  compatibility_risks:
    - risk_id: string
      category: enum                 # [api, data, behavior, integration, performance, security]
      description: string

      probability: enum              # [high, medium, low]
      impact: enum                   # [critical, high, medium, low]
      risk_score: number             # probability * impact

      affected_consumers: [string]
      affected_integrations: [string]

      mitigation:
        strategy: string
        owner: string
        timeline: string
        validation_test_id: string

      contingency_plan:
        trigger_conditions: [string]
        actions: [string]
        rollback_procedure: string

  blast_radius:
    immediate_impact:
      services_affected: [string]
      users_affected: string         # Count or percentage
      data_affected: string

    cascading_impact:
      secondary_services: [string]
      delayed_effects: [string]
      recovery_time: string

testing_strategy:
  compatibility_tests:
    - test_suite_id: string
      name: string
      type: enum                     # [contract_test, integration_test, regression_test, canary_test]

      validates:
        compatibility_aspect: enum   # [api, data, behavior, integration, performance]
        specific_changes: [string]

      test_approach:
        method: string
        test_dataset_id: string
        environment: string

      pass_criteria:
        criteria: [string]
        threshold: string

  consumer_validation:
    - consumer_name: string
      validation_approach: enum      # [automated_test, canary_deployment, beta_program, manual_test]
      test_dataset_id: string
      validation_status: enum        # [passed, failed, in_progress, not_started]

  rollback_validation:
    - scenario: string
      rollback_procedure: string
      tested: boolean
      test_dataset_id: string
      validation_evidence: string

communication_plan:
  stakeholders:
    - stakeholder_type: enum         # [internal_team, external_consumer, third_party, end_user]
      notification_required: boolean
      notification_timeline: string
      communication_channel: [string]
      message_template: string

  breaking_change_notifications:
    - change_id: string
      affected_parties: [string]
      notification_date: ISO8601
      deprecation_date: ISO8601
      removal_date: ISO8601
      migration_guide_url: string

deployment_strategy:
  phased_rollout:
    required: boolean
    reason: string

    phases:
      - phase_id: string
        name: string
        percentage: integer          # % of traffic/users
        duration: string
        success_criteria: [string]
        rollback_trigger: [string]

  feature_flags:
    - flag_id: string
      controls_change: string
      default_state: boolean
      rollout_percentage: integer
      monitoring_metrics: [string]

  blue_green_deployment:
    required: boolean
    switch_criteria: [string]
    rollback_plan: string

  canary_deployment:
    required: boolean
    canary_percentage: integer
    observation_period: string
    success_metrics: [string]

monitoring_and_observability:
  compatibility_metrics:
    - metric_name: string
      description: string
      measurement_method: string
      alert_threshold: string
      dashboard_url: string

  health_checks:
    - check_name: string
      validates: string
      frequency: string
      alert_on_failure: boolean

  rollback_triggers:
    - trigger_id: string
      condition: string
      auto_rollback: boolean
      notification: [string]

validation_evidence:
  compatibility_test_results:
    location: string
    summary: string

  consumer_validation_results:
    location: string
    summary: string

  performance_test_results:
    location: string
    summary: string

linkage:
  existing_system_truth_file: string
  enhancement_truth_file: string
  migration_strategy_file: string
  test_datasets_dir: string
```

---

## Usage Guidelines

### For Compatibility Agent

When analyzing compatibility:

1. **Identify All Changes** - Catalog every API, data, and behavior change
2. **Assess Breaking Changes** - Determine what breaks existing consumers
3. **Map Consumer Impact** - Identify all affected consumers and integrations
4. **Define Mitigation** - Provide strategies to minimize breaking changes
5. **Validate with Tests** - Create compatibility test datasets

### For Oracle Agent

When reconciling compatibility:

1. **Review Impact** - Understand compatibility implications
2. **Adjust Enhancement** - Modify enhancement-truth if risks are too high
3. **Validate Constraints** - Ensure immutable constraints are respected
4. **Approve Approach** - Sign off on compatibility strategy

### For Migration Agent

When planning migration:

1. **Review Compatibility Analysis** - Understand all impacts
2. **Plan Migration Steps** - Sequence changes to minimize risk
3. **Create Migration Tests** - Validate migration approach
4. **Define Rollback** - Ensure safe rollback at each step

### Validation Requirements

Every compatibility-analysis file must:

- [ ] Identify all breaking changes explicitly
- [ ] Map all affected consumers and integrations
- [ ] Provide mitigation strategies for each breaking change
- [ ] Include compatibility test datasets
- [ ] Define rollback procedures
- [ ] Assess risk levels for all changes
- [ ] Link to migration strategy

---

## Examples

### Minimal Compatibility Analysis (Add Discount to Cart API)

```yaml
metadata:
  version: "1.0.0"
  analysis_date: "2025-10-04T10:00:00Z"
  analyzed_by: ["Compatibility Agent", "Oracle Agent"]
  enhancement_id: "ENHANCE-001"
  risk_level: low

analysis_overview:
  enhancement_name: "Add Discount Code Support"
  scope:
    components_affected: ["CartService", "CartAPI"]
    consumers_affected: ["Web App", "Mobile App"]
    integrations_affected: []

  overall_compatibility_assessment:
    breaking_changes_count: 0
    non_breaking_changes_count: 2
    compatibility_risk: low
    recommended_approach: feature_flags

api_compatibility:
  endpoints_analyzed:
    - endpoint_id: "API-001"
      path: "/api/v1/cart"
      method: POST

      current_contract:
        request_schema: |
          {
            "items": [{"productId": "string", "quantity": "integer"}],
            "userId": "string"
          }
        response_schema: |
          {
            "cartId": "string",
            "total": "number",
            "items": [...]
          }

      proposed_changes:
        change_type: new_field
        changes:
          - "Add optional 'discountCode' field to request"
          - "Add 'appliedDiscount' field to response"

      breaking_change_analysis:
        is_breaking: false
        break_type: null
        affected_consumers: []

        mitigation_strategy:
          approach: parallel_support
          implementation: "Add optional fields, maintain backward compatibility"
          timeline: "Immediate"
          rollback_plan: "Remove new fields if issues arise"

      backward_compatibility:
        maintained: true
        approach: "Optional field, defaults to null if not provided"
        validation_test_id: "COMPAT-TEST-001"

      consumer_migration:
        required: false
        migration_effort: trivial
        migration_guide: "Optional: Add 'discountCode' to request to enable discounts"
        support_period: "Indefinite (backward compatible)"

data_compatibility:
  schema_changes:
    - entity_id: "ENTITY-001"
      entity_name: "Cart"
      storage_type: sql

      current_schema:
        definition: |
          CREATE TABLE cart (
            id UUID PRIMARY KEY,
            user_id UUID,
            items JSONB,
            total DECIMAL(10,2)
          )

      proposed_schema:
        definition: |
          CREATE TABLE cart (
            id UUID PRIMARY KEY,
            user_id UUID,
            items JSONB,
            discount_code VARCHAR(50),
            discount_amount DECIMAL(10,2),
            total DECIMAL(10,2)
          )

      compatibility_analysis:
        is_breaking: false
        break_type: null
        impact: "Add nullable columns"

        data_migration_required: false
        migration_complexity: simple
        data_loss_risk: none

        backward_read_compatible: true
        backward_write_compatible: true
        forward_read_compatible: true
        forward_write_compatible: true

      migration_strategy:
        approach: in_place
        steps:
          - "ALTER TABLE cart ADD COLUMN discount_code VARCHAR(50)"
          - "ALTER TABLE cart ADD COLUMN discount_amount DECIMAL(10,2)"
        validation_tests: ["DATA-MIG-TEST-001"]
        rollback_procedure: "DROP COLUMN discount_code, discount_amount"

      validation:
        test_dataset_id: "DATA-MIG-TEST-001"
        migration_tested: true
        rollback_tested: true

behavioral_compatibility:
  behavior_changes:
    - component_id: "COMP-001"
      component_name: "CartCalculator"
      change_type: logic_change

      current_behavior:
        description: "total = sum(items) + tax"
        code_location: "src/services/CartCalculator.js:45"
        test_dataset_id: "REGRESSION-TEST-001"

      new_behavior:
        description: "total = sum(items) + tax - discount"
        justification: "Support discount codes per business requirement"

      compatibility_impact:
        breaking: false
        observable_difference: "Total will include discount when discount code provided"
        affected_consumers: []

        side_effects: []

      migration_approach:
        strategy: feature_flag
        validation_method: "A/B test old vs new calculation"
        rollback_trigger: ["Error rate > 1%", "Total calculation errors"]

      testing:
        compatibility_test_id: "BEHAVIOR-TEST-001"
        comparison_test_id: "COMPARE-TEST-001"
        validation_passed: true

risk_assessment:
  compatibility_risks:
    - risk_id: "RISK-001"
      category: behavior
      description: "Discount calculation error could result in incorrect totals"

      probability: low
      impact: medium
      risk_score: 2.0

      affected_consumers: ["Web App", "Mobile App"]
      affected_integrations: []

      mitigation:
        strategy: "Feature flag with gradual rollout + extensive testing"
        owner: "Compatibility Agent"
        timeline: "Pre-deployment"
        validation_test_id: "DISCOUNT-TEST-001"

      contingency_plan:
        trigger_conditions: ["Calculation errors", "Customer complaints"]
        actions: ["Disable feature flag", "Revert to old calculation"]
        rollback_procedure: "Set feature flag to false"

  blast_radius:
    immediate_impact:
      services_affected: ["CartService"]
      users_affected: "0% initially (feature flag off)"
      data_affected: "New columns only"

    cascading_impact:
      secondary_services: []
      delayed_effects: []
      recovery_time: "Immediate (feature flag toggle)"

testing_strategy:
  compatibility_tests:
    - test_suite_id: "COMPAT-SUITE-001"
      name: "API Backward Compatibility Tests"
      type: contract_test

      validates:
        compatibility_aspect: api
        specific_changes: ["ADD-001", "MOD-001"]

      test_approach:
        method: "Send requests without new fields, verify responses"
        test_dataset_id: "COMPAT-TEST-001"
        environment: "Staging"

      pass_criteria:
        criteria:
          - "Old clients can still add items without discount code"
          - "Response includes all original fields"
          - "Total calculation matches for requests without discount"
        threshold: "100% pass rate"

  consumer_validation:
    - consumer_name: "Mobile App v1.5"
      validation_approach: automated_test
      test_dataset_id: "MOBILE-COMPAT-001"
      validation_status: passed

    - consumer_name: "Web App v2.0"
      validation_approach: automated_test
      test_dataset_id: "WEB-COMPAT-001"
      validation_status: passed

deployment_strategy:
  feature_flags:
    - flag_id: "FLAG-DISCOUNT"
      controls_change: "Discount code functionality"
      default_state: false
      rollout_percentage: 10
      monitoring_metrics: ["error_rate", "cart_total_accuracy"]

  phased_rollout:
    required: true
    reason: "Validate calculation correctness before full rollout"

    phases:
      - phase_id: "PHASE-1"
        name: "Internal Beta"
        percentage: 5
        duration: "3 days"
        success_criteria: ["Zero calculation errors", "Error rate < 0.1%"]
        rollback_trigger: ["Any calculation errors", "Error rate > 1%"]

      - phase_id: "PHASE-2"
        name: "Public Beta"
        percentage: 25
        duration: "7 days"
        success_criteria: ["User adoption > 10%", "Error rate < 0.1%"]
        rollback_trigger: ["Error rate > 0.5%"]

monitoring_and_observability:
  compatibility_metrics:
    - metric_name: "API Backward Compatibility Rate"
      description: "% of old client requests that succeed"
      measurement_method: "Track responses to requests without discountCode"
      alert_threshold: "< 99.9%"
      dashboard_url: "https://monitoring.example.com/compat"

  rollback_triggers:
    - trigger_id: "TRIGGER-001"
      condition: "Error rate > 1% for 5 minutes"
      auto_rollback: true
      notification: ["#dev-team", "on-call-engineer@example.com"]

linkage:
  existing_system_truth_file: "existing-system-truth.yaml"
  enhancement_truth_file: "enhancement-truth.yaml"
  migration_strategy_file: "migration-strategy.yaml"
  test_datasets_dir: "test-datasets/compatibility/"
```

---

## Analysis Process

### Step 1: Change Identification
- Review enhancement-truth for all changes
- Review existing-system-truth for current state
- Catalog all API, data, behavior, integration changes

### Step 2: Impact Assessment
- Identify all affected consumers
- Identify all affected integrations
- Determine breaking vs. non-breaking changes
- Assess risk level for each change

### Step 3: Mitigation Planning
- Define strategies to minimize breaking changes
- Plan versioning or feature flag approach
- Create migration guides for consumers
- Define rollback procedures

### Step 4: Test Creation
- Create compatibility test datasets
- Create consumer validation tests
- Create rollback validation tests
- Create monitoring and alerting

### Step 5: Validation
- Execute compatibility tests
- Validate with actual consumers
- Test rollback procedures
- Document evidence

---

## Related Schemas

- **existing-system-truth.yaml** - Current state
- **enhancement-truth.yaml** - Proposed changes
- **migration-strategy.yaml** - How to execute changes
- **domain-truth.yaml** - Domain requirements

---

## Schema Validation

This schema can be validated using:

- Compatibility Agent analysis
- Contract testing tools
- Consumer validation tests
- Integration tests
- Rollback simulation tests
