# Migration Strategy Schema Specification

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Define HOW to execute migration from existing system to enhanced system
**Scope:** Step-by-step migration plan, validation gates, rollback procedures

---

## Overview

The `migration-strategy.yaml` file defines the **executable migration plan** for brownfield enhancements. It provides detailed steps, validation gates, rollback procedures, and coordination plans to safely evolve the system from current state to enhanced state.

### Key Principles

1. **Incremental Migration** - Changes applied in small, validated steps
2. **Continuous Validation** - Every step validated before proceeding
3. **Rollback Safety** - Can rollback at any point
4. **Zero Downtime** - Minimize or eliminate service interruptions
5. **Data Safety** - No data loss, all migrations reversible

---

## Schema Structure

```yaml
# migration-strategy.yaml

metadata:
  version: string                    # Semantic version
  created_date: ISO8601
  last_updated: ISO8601
  migration_name: string
  enhancement_id: string             # From enhancement-truth.yaml
  migration_status: enum             # [planned, in_progress, completed, rolled_back]

migration_overview:
  name: string
  description: string
  objective: string

  scope:
    systems_affected: [string]
    data_affected: string            # Description of data scope
    users_affected: string           # Count or description

  constraints:
    downtime_allowed: boolean
    max_downtime_duration: string
    migration_window: string         # When migration can occur
    business_constraints: [string]

  approach: enum                     # [big_bang, phased, parallel_run, strangler_fig, blue_green]
  estimated_duration: string
  estimated_effort: string

prerequisites:
  - prerequisite_id: string
    name: string
    description: string
    type: enum                       # [infrastructure, code, data, configuration, approval]

    validation:
      verification_method: string
      verification_test_id: string
      status: enum                   # [pending, verified, blocked]

    owner: string
    deadline: ISO8601

migration_phases:
  - phase_id: string
    name: string
    description: string
    order: integer

    objectives: [string]
    deliverables: [string]

    duration_estimate: string
    start_condition: [string]        # What must be true to start

    steps:
      - step_id: string
        name: string
        description: string
        order: integer

        type: enum                   # [code_deployment, data_migration, configuration, infrastructure, validation]

        preconditions: [string]      # What must be true before this step
        execution_details:
          method: string
          commands: [string]         # Actual commands/scripts to run
          automation_script: string  # Path to automation script
          manual_steps: [string]     # Manual interventions required

        validation:
          validation_checks: [string]
          test_dataset_ids: [string]
          success_criteria: [string]
          validation_script: string

        rollback_procedure:
          can_rollback: boolean
          rollback_steps: [string]
          rollback_script: string
          rollback_test_id: string

        estimated_duration: string
        responsible_party: string

        monitoring:
          metrics_to_watch: [string]
          alert_conditions: [string]

    validation_gate:
      gate_id: string
      name: string
      criteria: [string]
      test_dataset_ids: [string]

      approval_required: boolean
      approvers: [string]

      failure_response: enum         # [block, rollback, manual_decision]

    rollback_point:
      can_rollback_from_here: boolean
      rollback_procedure: string
      rollback_test_id: string
      estimated_rollback_duration: string

code_migration:
  deployment_strategy:
    approach: enum                   # [rolling, blue_green, canary, feature_flag]

    steps:
      - step_id: string
        name: string
        description: string

        artifacts_to_deploy: [string]
        deployment_order: [string]   # Order to deploy services

        configuration_changes:
          - config_file: string
            changes: [string]
            validation: string

        feature_flags:
          - flag_id: string
            initial_state: boolean
            rollout_plan: string

        validation:
          health_checks: [string]
          smoke_tests: [string]
          test_dataset_ids: [string]

  version_coordination:
    services:
      - service_name: string
        current_version: string
        target_version: string

        compatibility_mode: enum     # [backward_compatible, requires_coordination, breaking]
        deployment_window: string

    coordination_plan:
      parallel_deployment: boolean
      deployment_sequence: [string]  # Order to deploy
      coordination_points: [string]  # Where coordination is needed

data_migration:
  migrations:
    - migration_id: string
      name: string
      description: string
      type: enum                     # [schema_change, data_transformation, data_cleanup, data_archival]

      source:
        system: string
        schema: string
        tables: [string]
        estimated_records: integer
        estimated_size: string

      target:
        system: string
        schema: string
        tables: [string]
        estimated_records: integer

      migration_approach:
        method: enum                 # [online, offline, dual_write, shadow_write, backfill]
        implementation: string

        dual_write_period: string    # If using dual write
        shadow_write_validation: string  # If using shadow write

      transformation_logic:
        description: string
        transformation_rules: [string]
        code_location: string

        edge_cases:
          - scenario: string
            handling: string
            test_dataset_id: string

      execution_plan:
        batch_size: integer          # Records per batch
        parallel_execution: boolean
        max_parallel_workers: integer
        rate_limit: string

        execution_script: string
        estimated_duration: string

      validation:
        pre_migration_checks: [string]
        post_migration_checks: [string]
        data_integrity_checks: [string]
        test_dataset_ids: [string]

        reconciliation:
          method: string
          acceptance_threshold: string  # e.g., "99.99% match"

      rollback:
        can_rollback: boolean
        rollback_method: enum        # [restore_backup, reverse_migration, switch_back]
        rollback_script: string
        rollback_duration: string
        rollback_test_id: string

      downtime:
        required: boolean
        duration: string
        maintenance_window: string

configuration_migration:
  configuration_changes:
    - config_id: string
      name: string
      type: enum                     # [environment_variable, config_file, database_config, feature_flag]

      current_value: string
      new_value: string

      change_impact:
        affected_components: [string]
        requires_restart: boolean
        downtime_required: boolean

      deployment_method:
        approach: string
        automation_script: string
        validation_test_id: string

      rollback:
        previous_value: string
        rollback_script: string

infrastructure_migration:
  infrastructure_changes:
    - change_id: string
      name: string
      type: enum                     # [server, database, cache, load_balancer, network, storage]

      current_state:
        description: string
        configuration: string

      target_state:
        description: string
        configuration: string

      migration_steps:
        - step: string
          command: string
          validation: string

      capacity_planning:
        current_capacity: string
        target_capacity: string
        scaling_approach: string

      validation:
        test_dataset_ids: [string]
        load_test_results: string

      rollback:
        can_rollback: boolean
        rollback_procedure: string

integration_migration:
  external_integrations:
    - integration_id: string         # From existing-system-truth
      name: string

      migration_approach:
        method: enum                 # [cutover, parallel_run, gradual_migration]
        coordination_required: boolean

        coordination_plan:
          external_party: string
          coordination_window: string
          communication_plan: string

      testing:
        test_environment: string
        test_dataset_ids: [string]
        validation_with_partner: boolean

      fallback:
        fallback_to_old: boolean
        fallback_procedure: string
        fallback_duration: string

  internal_integrations:
    - integration_id: string
      consuming_services: [string]
      providing_services: [string]

      migration_sequence:
        order: [string]              # Which services migrate first
        coordination_points: [string]

      contract_evolution:
        old_contract: string
        new_contract: string
        transition_period: string

validation_strategy:
  validation_gates:
    - gate_id: string
      name: string
      location: string               # Which phase/step
      type: enum                     # [automated, manual, hybrid]

      criteria:
        - criterion: string
          measurement: string
          threshold: string
          test_dataset_id: string

      failure_handling:
        response: enum               # [block, rollback, manual_review]
        notification: [string]
        escalation: string

  continuous_validation:
    - validation_id: string
      name: string
      frequency: string              # How often to run during migration

      checks: [string]
      test_dataset_ids: [string]
      alert_conditions: [string]

  regression_validation:
    - regression_suite_id: string
      name: string
      location: string

      execution_frequency: enum      # [pre_migration, post_migration, continuous]
      critical_paths: [string]
      test_dataset_ids: [string]

rollback_strategy:
  rollback_levels:
    - level: enum                    # [step, phase, full]
      description: string

      trigger_conditions: [string]
      decision_maker: string
      approval_required: boolean

      rollback_procedure:
        steps: [string]
        automation_script: string
        manual_steps: [string]
        estimated_duration: string

      validation:
        post_rollback_checks: [string]
        test_dataset_ids: [string]

  rollback_testing:
    - rollback_scenario: string
      tested: boolean
      test_date: ISO8601
      test_result: enum              # [passed, failed, partial]
      test_dataset_id: string
      evidence: string

risk_mitigation:
  migration_risks:
    - risk_id: string
      category: enum                 # [data_loss, downtime, performance_degradation, rollback_failure]
      description: string

      probability: enum              # [high, medium, low]
      impact: enum                   # [critical, high, medium, low]

      affected_phases: [string]
      affected_steps: [string]

      mitigation:
        preventive_measures: [string]
        detection_method: string
        response_procedure: string

        validation:
          test_dataset_id: string
          tested: boolean

      contingency:
        trigger: string
        action: string
        responsible_party: string

communication_plan:
  stakeholder_communication:
    - stakeholder_group: enum        # [internal_team, users, partners, management]

      notifications:
        - notification_type: enum    # [pre_migration, during_migration, post_migration, issue]
          timing: string
          channel: [string]
          template: string
          responsible_party: string

  status_reporting:
    frequency: string
    format: enum                     # [dashboard, email, slack, meeting]
    recipients: [string]

    metrics_to_report: [string]

  incident_communication:
    escalation_path: [string]
    notification_channels: [string]
    response_time_sla: string

monitoring_and_observability:
  migration_monitoring:
    - metric_name: string
      description: string
      measurement_method: string

      normal_range: string
      alert_threshold: string
      critical_threshold: string

      alert_channels: [string]

  health_checks:
    - check_name: string
      description: string
      frequency: string

      check_procedure: string
      success_criteria: string
      failure_response: string

  dashboards:
    - dashboard_name: string
      url: string
      metrics_displayed: [string]
      audience: [string]

success_criteria:
  technical_success:
    - criterion: string
      measurement: string
      target: string
      test_dataset_id: string

  business_success:
    - criterion: string
      measurement: string
      target: string
      measurement_period: string

  migration_complete_definition:
    criteria: [string]
    validation_required: [string]
    approval_required: boolean
    approvers: [string]

post_migration:
  cleanup_tasks:
    - task_id: string
      name: string
      description: string

      timing: string                 # When to do this after migration
      responsible_party: string

      steps: [string]
      validation: string

  monitoring_period:
    duration: string
    enhanced_monitoring: [string]
    alert_sensitivity: enum          # [high, normal]

  optimization_opportunities:
    - opportunity: string
      description: string
      priority: enum                 # [high, medium, low]
      effort: string

  lessons_learned:
    location: string                 # Where to document lessons
    retrospective_date: ISO8601

execution_timeline:
  milestones:
    - milestone_id: string
      name: string
      target_date: ISO8601

      dependencies: [string]
      deliverables: [string]

      status: enum                   # [not_started, in_progress, completed, delayed]

  critical_path:
    - step_id: string
      duration: string
      dependencies: [string]

  contingency_time:
    buffer_percentage: integer
    rationale: string

linkage:
  existing_system_truth_file: string
  enhancement_truth_file: string
  compatibility_analysis_file: string
  test_datasets_dir: string
  automation_scripts_dir: string
```

---

## Usage Guidelines

### For Migration Agent

When executing migration:

1. **Follow Phases Strictly** - Execute phases in order
2. **Validate at Every Gate** - Don't proceed without validation
3. **Monitor Continuously** - Watch metrics during migration
4. **Document Progress** - Update status in real-time
5. **Be Ready to Rollback** - Have rollback plan ready at all times

### For Validator Agent

When validating migration:

1. **Check Preconditions** - Verify prerequisites before starting
2. **Validate Each Step** - Confirm success before next step
3. **Run Regression Tests** - Ensure existing functionality intact
4. **Verify Data Integrity** - Validate data migrations
5. **Sign Off on Gates** - Approve progression through gates

### For Monitor Agent

When monitoring migration:

1. **Track All Metrics** - Monitor defined migration metrics
2. **Alert on Anomalies** - Notify on threshold violations
3. **Update Dashboards** - Provide real-time visibility
4. **Detect Issues Early** - Identify problems before critical
5. **Trigger Rollback** - Initiate rollback if needed

### Validation Requirements

Every migration-strategy file must:

- [ ] Define all migration phases with validation gates
- [ ] Provide rollback procedures for each phase
- [ ] Link to test datasets for all validations
- [ ] Define monitoring and alerting
- [ ] Identify all risks with mitigation plans
- [ ] Specify communication plan
- [ ] Define success criteria

---

## Examples

### Minimal Migration Strategy (Discount Enhancement)

```yaml
metadata:
  version: "1.0.0"
  created_date: "2025-10-04T10:00:00Z"
  migration_name: "Discount Code Enhancement Migration"
  enhancement_id: "ENHANCE-001"
  migration_status: planned

migration_overview:
  name: "Discount Code Feature Migration"
  description: "Add discount code support to shopping cart system"
  objective: "Deploy discount functionality with zero downtime and full rollback capability"

  scope:
    systems_affected: ["CartService", "CartAPI", "Cart Database"]
    data_affected: "Cart table - add 2 columns"
    users_affected: "All users (0% impact due to feature flag)"

  constraints:
    downtime_allowed: false
    max_downtime_duration: "0 minutes"
    migration_window: "Weekday 10am-4pm EST"
    business_constraints: ["No changes during Black Friday week"]

  approach: phased
  estimated_duration: "2 weeks"
  estimated_effort: "40 hours"

prerequisites:
  - prerequisite_id: "PREREQ-001"
    name: "Database Schema Approval"
    description: "Schema changes reviewed and approved by DBA"
    type: approval
    validation:
      verification_method: "Approval document signed"
      verification_test_id: null
      status: verified
    owner: "DBA Team"
    deadline: "2025-10-10T00:00:00Z"

  - prerequisite_id: "PREREQ-002"
    name: "Feature Flag Infrastructure"
    description: "Feature flag system ready for discount flag"
    type: infrastructure
    validation:
      verification_method: "Feature flag test"
      verification_test_id: "FF-TEST-001"
      status: verified
    owner: "DevOps Team"
    deadline: "2025-10-11T00:00:00Z"

migration_phases:
  - phase_id: "PHASE-1"
    name: "Database Schema Migration"
    description: "Add discount columns to cart table"
    order: 1

    objectives:
      - "Add discount_code and discount_amount columns"
      - "Verify backward compatibility"

    duration_estimate: "2 hours"
    start_condition:
      - "DBA approval received"
      - "Backup completed"

    steps:
      - step_id: "STEP-1-1"
        name: "Database Backup"
        description: "Create backup of cart table before schema change"
        order: 1
        type: data_migration

        execution_details:
          method: "Automated backup script"
          commands:
            - "pg_dump -t cart > backup/cart_$(date +%Y%m%d).sql"
          automation_script: "scripts/backup-cart.sh"

        validation:
          validation_checks:
            - "Backup file exists"
            - "Backup file size > 0"
          success_criteria:
            - "Backup completes without errors"
          validation_script: "scripts/validate-backup.sh"

        rollback_procedure:
          can_rollback: true
          rollback_steps:
            - "Restore from backup if needed"
          rollback_script: "scripts/restore-cart.sh"
          rollback_test_id: "ROLLBACK-TEST-001"

        estimated_duration: "30 minutes"
        responsible_party: "DBA Team"

        monitoring:
          metrics_to_watch: ["database_connections", "query_latency"]
          alert_conditions: ["connections > 80%"]

      - step_id: "STEP-1-2"
        name: "Add Discount Columns"
        description: "ALTER TABLE to add new columns"
        order: 2
        type: data_migration

        execution_details:
          method: "Database migration script"
          commands:
            - "ALTER TABLE cart ADD COLUMN discount_code VARCHAR(50)"
            - "ALTER TABLE cart ADD COLUMN discount_amount DECIMAL(10,2)"
          automation_script: "migrations/001_add_discount_columns.sql"

        validation:
          validation_checks:
            - "Columns exist in schema"
            - "Columns are nullable"
            - "Old queries still work"
          test_dataset_ids: ["DATA-MIG-TEST-001"]
          success_criteria:
            - "Schema updated successfully"
            - "No errors in application logs"
          validation_script: "scripts/validate-schema.sh"

        rollback_procedure:
          can_rollback: true
          rollback_steps:
            - "DROP COLUMN discount_code"
            - "DROP COLUMN discount_amount"
          rollback_script: "migrations/001_rollback.sql"
          rollback_test_id: "ROLLBACK-TEST-002"

        estimated_duration: "30 minutes"
        responsible_party: "DBA Team"

    validation_gate:
      gate_id: "GATE-1"
      name: "Schema Migration Validation"
      criteria:
        - "New columns exist"
        - "Application still functions"
        - "No performance degradation"
      test_dataset_ids: ["GATE-TEST-001", "REGRESSION-TEST-001"]

      approval_required: true
      approvers: ["DBA Lead", "Engineering Manager"]
      failure_response: rollback

    rollback_point:
      can_rollback_from_here: true
      rollback_procedure: "Execute rollback scripts STEP-1-2, STEP-1-1"
      rollback_test_id: "ROLLBACK-TEST-003"
      estimated_rollback_duration: "1 hour"

  - phase_id: "PHASE-2"
    name: "Code Deployment"
    description: "Deploy discount service and updated cart service"
    order: 2

    objectives:
      - "Deploy DiscountService"
      - "Deploy updated CartService"
      - "Feature flag OFF (dark deploy)"

    duration_estimate: "4 hours"
    start_condition:
      - "Phase 1 validation gate passed"
      - "CI/CD pipeline green"

    steps:
      - step_id: "STEP-2-1"
        name: "Deploy DiscountService"
        description: "Deploy new discount validation service"
        order: 1
        type: code_deployment

        execution_details:
          method: "Rolling deployment via Kubernetes"
          commands:
            - "kubectl apply -f k8s/discount-service.yaml"
            - "kubectl rollout status deployment/discount-service"
          automation_script: "scripts/deploy-discount-service.sh"

        validation:
          validation_checks:
            - "All pods healthy"
            - "Health check endpoint returns 200"
            - "Metrics endpoint accessible"
          test_dataset_ids: ["SERVICE-HEALTH-001"]
          success_criteria:
            - "Deployment complete"
            - "0 errors in logs"
          validation_script: "scripts/validate-service.sh"

        rollback_procedure:
          can_rollback: true
          rollback_steps:
            - "kubectl rollout undo deployment/discount-service"
          rollback_script: "scripts/rollback-discount-service.sh"

        estimated_duration: "1 hour"
        responsible_party: "DevOps Team"

      - step_id: "STEP-2-2"
        name: "Deploy Updated CartService"
        description: "Deploy cart service with discount logic (flag OFF)"
        order: 2
        type: code_deployment

        execution_details:
          method: "Blue-green deployment"
          commands:
            - "kubectl apply -f k8s/cart-service-v2.yaml"
            - "scripts/switch-traffic.sh blue green"
          automation_script: "scripts/deploy-cart-service.sh"

        validation:
          validation_checks:
            - "Green deployment healthy"
            - "Smoke tests pass"
            - "Feature flag is OFF"
          test_dataset_ids: ["CART-DEPLOY-001", "SMOKE-TEST-001"]
          success_criteria:
            - "All smoke tests pass"
            - "No increase in error rate"
          validation_script: "scripts/validate-cart-deployment.sh"

        rollback_procedure:
          can_rollback: true
          rollback_steps:
            - "scripts/switch-traffic.sh green blue"
            - "kubectl delete -f k8s/cart-service-v2.yaml"
          rollback_script: "scripts/rollback-cart-service.sh"

        estimated_duration: "2 hours"
        responsible_party: "DevOps Team"

    validation_gate:
      gate_id: "GATE-2"
      name: "Deployment Validation"
      criteria:
        - "All services healthy"
        - "Feature flag OFF confirmed"
        - "Regression tests pass"
      test_dataset_ids: ["DEPLOY-GATE-001", "REGRESSION-TEST-001"]

      approval_required: true
      approvers: ["Engineering Manager"]
      failure_response: rollback

    rollback_point:
      can_rollback_from_here: true
      rollback_procedure: "Rollback code deployments, keep schema changes"
      rollback_test_id: "ROLLBACK-TEST-004"
      estimated_rollback_duration: "1 hour"

  - phase_id: "PHASE-3"
    name: "Feature Rollout"
    description: "Gradually enable discount feature via feature flag"
    order: 3

    objectives:
      - "Validate discount logic in production"
      - "Gradual rollout to 100%"

    duration_estimate: "1 week"
    start_condition:
      - "Phase 2 validation gate passed"
      - "Monitoring dashboards ready"

    steps:
      - step_id: "STEP-3-1"
        name: "Enable for Internal Users (5%)"
        description: "Turn on feature flag for internal beta"
        order: 1
        type: configuration

        execution_details:
          method: "Feature flag configuration"
          commands:
            - "feature-flag set discount-enabled --percentage=5 --users=internal"
          automation_script: "scripts/configure-feature-flag.sh"

        validation:
          validation_checks:
            - "5% of requests use discount code path"
            - "No errors in discount validation"
            - "Cart totals correct"
          test_dataset_ids: ["DISCOUNT-TEST-001", "CALC-TEST-001"]
          success_criteria:
            - "Error rate < 0.1%"
            - "All test datasets pass"
          validation_script: "scripts/validate-rollout.sh"

        rollback_procedure:
          can_rollback: true
          rollback_steps:
            - "feature-flag set discount-enabled --percentage=0"
          rollback_script: "scripts/disable-feature-flag.sh"

        estimated_duration: "3 days observation"
        responsible_party: "Product Team"

        monitoring:
          metrics_to_watch:
            - "discount_validation_errors"
            - "cart_total_calculation_errors"
            - "api_error_rate"
          alert_conditions:
            - "error_rate > 0.5%"
            - "calculation_errors > 0"

      - step_id: "STEP-3-2"
        name: "Expand to 25% of Users"
        description: "Increase feature flag to 25%"
        order: 2
        type: configuration

        preconditions:
          - "STEP-3-1 successful"
          - "No critical issues"
          - "Error rate < 0.1%"

        execution_details:
          method: "Feature flag configuration"
          commands:
            - "feature-flag set discount-enabled --percentage=25"
          automation_script: "scripts/configure-feature-flag.sh"

        validation:
          validation_checks:
            - "25% of requests use discount"
            - "Error rate stable"
          test_dataset_ids: ["ROLLOUT-TEST-002"]
          success_criteria:
            - "Error rate < 0.1%"
            - "No customer complaints"

        estimated_duration: "3 days observation"
        responsible_party: "Product Team"

      - step_id: "STEP-3-3"
        name: "Full Rollout (100%)"
        description: "Enable feature for all users"
        order: 3
        type: configuration

        preconditions:
          - "STEP-3-2 successful"
          - "Business approval"

        execution_details:
          method: "Feature flag configuration"
          commands:
            - "feature-flag set discount-enabled --percentage=100"
          automation_script: "scripts/configure-feature-flag.sh"

        validation:
          validation_checks:
            - "All users can use discounts"
            - "System stable"
          test_dataset_ids: ["ROLLOUT-TEST-003"]
          success_criteria:
            - "Error rate < 0.1%"
            - "Performance within SLA"

        estimated_duration: "1 day observation"
        responsible_party: "Product Team"

    validation_gate:
      gate_id: "GATE-3"
      name: "Full Rollout Validation"
      criteria:
        - "100% rollout successful"
        - "All metrics within normal range"
        - "No critical issues"
      test_dataset_ids: ["FINAL-VALIDATION-001"]

      approval_required: true
      approvers: ["Product Manager", "Engineering Manager"]
      failure_response: manual_decision

rollback_strategy:
  rollback_levels:
    - level: step
      description: "Rollback individual step (e.g., reduce feature flag %)"
      trigger_conditions:
        - "Error rate > 1%"
        - "Calculation errors detected"
      decision_maker: "On-call engineer"
      approval_required: false
      rollback_procedure:
        steps:
          - "Reduce feature flag percentage or disable"
          - "Verify error rate returns to normal"
        automation_script: "scripts/step-rollback.sh"
        estimated_duration: "5 minutes"

    - level: phase
      description: "Rollback entire phase (e.g., rollback code deployment)"
      trigger_conditions:
        - "Service unhealthy"
        - "Multiple step rollbacks failed"
      decision_maker: "Engineering Manager"
      approval_required: true
      rollback_procedure:
        steps:
          - "Rollback code deployments"
          - "Verify services healthy"
          - "Keep schema changes"
        automation_script: "scripts/phase-rollback.sh"
        estimated_duration: "1 hour"

    - level: full
      description: "Full migration rollback (code + schema)"
      trigger_conditions:
        - "Data corruption detected"
        - "Critical business impact"
      decision_maker: "VP Engineering"
      approval_required: true
      rollback_procedure:
        steps:
          - "Rollback code deployments"
          - "Rollback schema changes"
          - "Restore from backup if needed"
        automation_script: "scripts/full-rollback.sh"
        estimated_duration: "2-3 hours"

success_criteria:
  technical_success:
    - criterion: "Discount feature deployed with zero downtime"
      measurement: "Uptime monitoring"
      target: "100% uptime"
      test_dataset_id: "UPTIME-TEST-001"

    - criterion: "All test datasets pass"
      measurement: "Test execution results"
      target: "100% pass rate"
      test_dataset_id: "ALL-TESTS-001"

  business_success:
    - criterion: "Users successfully apply discount codes"
      measurement: "Discount application rate"
      target: "> 10% of orders use discounts"
      measurement_period: "First 2 weeks"

  migration_complete_definition:
    criteria:
      - "100% feature flag rollout"
      - "All validation gates passed"
      - "No critical issues for 48 hours"
      - "Monitoring confirms stability"
    validation_required:
      - "FINAL-VALIDATION-001"
      - "REGRESSION-TEST-001"
    approval_required: true
    approvers: ["Product Manager", "Engineering Manager"]

monitoring_and_observability:
  migration_monitoring:
    - metric_name: "Discount Validation Error Rate"
      description: "% of discount validations that fail"
      measurement_method: "Application metrics"
      normal_range: "0-0.1%"
      alert_threshold: "0.5%"
      critical_threshold: "1%"
      alert_channels: ["#eng-alerts", "pagerduty"]

    - metric_name: "Cart Total Calculation Accuracy"
      description: "% of cart totals calculated correctly"
      measurement_method: "Validation checks"
      normal_range: "100%"
      alert_threshold: "99.9%"
      critical_threshold: "99%"
      alert_channels: ["#eng-alerts", "pagerduty"]

  dashboards:
    - dashboard_name: "Discount Migration Dashboard"
      url: "https://monitoring.example.com/discount-migration"
      metrics_displayed:
        - "Feature flag percentage"
        - "Error rates"
        - "Discount usage"
        - "Cart calculation accuracy"
      audience: ["Engineering Team", "Product Team"]

linkage:
  existing_system_truth_file: "existing-system-truth.yaml"
  enhancement_truth_file: "enhancement-truth.yaml"
  compatibility_analysis_file: "compatibility-analysis.yaml"
  test_datasets_dir: "test-datasets/migration/"
  automation_scripts_dir: "scripts/migration/"
```

---

## Migration Execution Process

### Step 1: Pre-Migration
- Verify all prerequisites
- Complete dry runs in staging
- Brief all stakeholders
- Prepare rollback plans

### Step 2: Phase Execution
- Execute steps in order
- Validate at each step
- Monitor metrics continuously
- Document progress

### Step 3: Gate Validation
- Run validation tests
- Review metrics
- Get approvals
- Proceed or rollback

### Step 4: Rollback (if needed)
- Identify rollback level needed
- Execute rollback procedure
- Validate rollback success
- Document lessons learned

### Step 5: Post-Migration
- Complete cleanup tasks
- Enhanced monitoring period
- Retrospective
- Documentation updates

---

## Related Schemas

- **existing-system-truth.yaml** - Current state
- **enhancement-truth.yaml** - Target state
- **compatibility-analysis.yaml** - Impact analysis
- **eval-criteria.yaml** - Validation tests

---

## Schema Validation

This schema can be validated using:

- Migration rehearsal in staging
- Rollback testing
- Automation script validation
- Validator Agent checks
- Migration Agent execution
