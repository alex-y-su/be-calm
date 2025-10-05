# Eval Criteria Schema Specification

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Define HOW to validate domain truth through empirical testing
**Scope:** Test datasets, acceptance criteria, validation methods

---

## Overview

The `eval-criteria.yaml` file defines the **empirical validation methods** for domain truth. It specifies test datasets, acceptance criteria, and validation procedures that prove requirements are met. This is the foundation of "empirical validation over document trust."

### Key Principles

1. **Executable Truth** - All validation must be automated where possible
2. **Concrete Examples** - Abstract requirements proven through specific test cases
3. **Complete Coverage** - Every domain rule has at least one test dataset
4. **Objective Measurement** - Pass/fail criteria are unambiguous
5. **Continuous Validation** - Tests run automatically, frequently

---

## Schema Structure

```yaml
# eval-criteria.yaml

metadata:
  version: string                    # Semantic version
  created_date: ISO8601
  last_updated: ISO8601
  project_name: string
  validation_framework: string       # e.g., "Jest", "Pytest", "JUnit"
  domain_truth_version: string       # Version of domain-truth.yaml this validates

validation_philosophy:
  approach: string                   # Overall validation approach
  automation_target: integer         # % of tests that should be automated
  execution_frequency: enum          # [on_commit, hourly, daily, on_demand]
  failure_policy: enum               # [block_deployment, warn, log_only]

test_datasets:
  location: string                   # Root directory for test datasets
  format_standards: [string]         # Allowed formats: JSON, YAML, CSV, etc.
  naming_convention: string          # How to name test dataset files

  datasets:
    - id: string                     # Unique test dataset ID
      name: string
      description: string
      type: enum                     # [unit, integration, e2e, performance, security]

      validates:                     # What this dataset validates
        domain_truth_ids: [string]   # IDs from domain-truth.yaml
        functional_requirement_ids: [string]
        domain_rule_ids: [string]
        concept_ids: [string]

      dataset_file: string           # Path to dataset file
      dataset_format: enum           # [json, yaml, csv, sql, custom]

      test_cases:
        - case_id: string
          name: string
          description: string

          input:
            format: string           # Input data structure
            data: object             # Actual input data or reference

          expected_output:
            format: string
            data: object

          preconditions: [string]    # State required before test
          postconditions: [string]   # State expected after test

          edge_cases: [string]       # Edge cases this covers
          boundary_conditions: [string]

      execution:
        test_framework: string       # Framework to run this test
        test_file: string            # Actual test implementation
        setup_script: string         # Optional setup
        teardown_script: string      # Optional cleanup
        timeout: integer             # Max execution time (ms)

      pass_criteria:
        - criterion: string
          measurement: string
          threshold: string

      tags: [string]                 # For test organization/filtering
      priority: enum                 # [critical, high, medium, low]
      automation_status: enum        # [automated, partial, manual]

functional_requirement_validation:
  - fr_id: string                    # From domain-truth.yaml
    name: string

    acceptance_criteria:
      - criterion_id: string
        description: string
        validation_method: enum      # [automated_test, manual_test, inspection, analysis]

        test_dataset_id: string      # Which dataset validates this
        test_procedure: string       # How to execute validation

        pass_conditions: [string]
        fail_conditions: [string]

        evidence_required: enum      # [test_results, screenshot, log_file, metrics]
        evidence_location: string

        validated_by: enum           # [eval_agent, qa_agent, validator_agent, human]
        validation_frequency: enum   # [every_commit, daily, weekly, on_release]

domain_rule_validation:
  - rule_id: string                  # From domain-truth.yaml
    name: string
    rule_type: enum                  # [business_logic, validation, calculation, workflow]

    validation_approach:
      method: enum                   # [example_based, property_based, formal_proof]
      description: string

    test_datasets:
      positive_cases:                # Cases that should pass
        - test_dataset_id: string
          description: string
          expected_result: string

      negative_cases:                # Cases that should fail
        - test_dataset_id: string
          description: string
          expected_error: string

      edge_cases:                    # Boundary conditions
        - test_dataset_id: string
          description: string
          expected_behavior: string

    equivalence_classes:             # Input classes with same behavior
      - class_id: string
        description: string
        representative_values: [any]
        test_dataset_id: string

    invariant_checks:                # Properties that must always hold
      - invariant_id: string         # From domain-truth.yaml
        description: string
        verification_method: string
        test_dataset_id: string

    performance_benchmarks:          # Performance validation
      - metric: string
        target_value: string
        acceptable_range: string
        test_dataset_id: string

concept_validation:
  - concept_id: string               # From domain-truth.yaml
    name: string

    property_validation:
      - property_name: string
        constraint: string           # From domain-truth.yaml

        validation_tests:
          - test_type: enum          # [type_check, range_check, format_check, relationship_check]
            test_dataset_id: string
            assertion: string

    relationship_validation:
      - relationship_type: string
        related_concept: string

        test_dataset_id: string
        cardinality_check: string
        referential_integrity_check: string

    invariant_validation:
      - invariant_id: string
        description: string
        test_dataset_id: string
        verification_approach: string

quality_attribute_validation:
  - attribute_category: enum         # [performance, security, usability, reliability]
    attribute_name: string

    measurement:
      metric: string
      unit: string
      measurement_tool: string

    acceptance_criteria:
      target_value: string
      threshold: string
      test_dataset_id: string

    validation_procedure:
      approach: string
      test_environment: string
      test_duration: string

    baseline:                        # For comparison
      current_value: string
      measurement_date: ISO8601
      source: string

integration_validation:
  - integration_point: string
    type: enum                       # [api, database, file_system, message_queue]

    contract_tests:
      - contract_id: string
        provider: string
        consumer: string

        schema_validation:
          request_schema: string
          response_schema: string
          test_dataset_id: string

        behavior_validation:
          test_scenarios: [string]
          test_dataset_ids: [string]

    integration_test_datasets:
      - test_dataset_id: string
        scenario: string
        validates: string

regression_validation:
  critical_paths:                    # Paths that must not break
    - path_id: string
      name: string
      description: string

      test_datasets:
        - test_dataset_id: string
          criticality: enum          # [critical, important, nice_to_have]

      regression_frequency: enum     # [every_commit, daily, weekly]
      failure_response: enum         # [block, warn, log]

  baseline_preservation:
    - aspect: string                 # What must stay the same
      current_baseline: string
      validation_test_id: string
      tolerance: string              # Acceptable variance

validation_automation:
  ci_cd_integration:
    pipeline_stages:
      - stage_name: string
        test_dataset_ids: [string]   # Which tests run in this stage
        pass_requirement: string     # % that must pass
        timeout: integer

    pre_commit_hooks:
      - hook_name: string
        test_dataset_ids: [string]

    deployment_gates:
      - gate_name: string
        required_validations: [string]
        test_dataset_ids: [string]

  continuous_validation:
    scheduled_runs:
      - schedule: string             # Cron expression
        test_dataset_ids: [string]
        notification_on_failure: [string]

    monitoring_validation:
      - metric: string
        threshold: string
        alert_on_deviation: boolean

test_data_management:
  data_generation:
    - generator_id: string
      type: enum                     # [synthetic, production_sample, hand_crafted]
      generates_for: [string]        # Test dataset IDs
      generation_rules: [string]

  data_privacy:
    - dataset_id: string
      contains_pii: boolean
      anonymization_method: string
      retention_policy: string

  data_versioning:
    - dataset_id: string
      version: string
      changelog: string
      backward_compatible: boolean

validation_reporting:
  report_format: enum                # [junit_xml, html, json, markdown]
  report_location: string

  metrics_tracked:
    - metric_name: string
      description: string
      calculation_method: string

  dashboards:
    - dashboard_name: string
      url: string
      metrics_displayed: [string]

  notifications:
    - trigger: enum                  # [failure, degradation, success]
      channels: [string]             # [email, slack, webhook]
      recipients: [string]

traceability_validation:
  validation_chain:
    - chain_id: string
      validates: string              # "domain-truth -> prd -> architecture -> code"

      chain_links:
        - from_artifact: string
          to_artifact: string
          validation_method: string
          test_dataset_id: string

  coverage_analysis:
    - coverage_type: enum            # [requirement_coverage, rule_coverage, code_coverage]
      target_percentage: integer
      current_percentage: integer
      gap_analysis: string

validation_evidence:
  evidence_repository: string        # Where evidence is stored

  evidence_types:
    - type: enum                     # [test_results, metrics, logs, screenshots, videos]
      storage_location: string
      retention_period: string

  audit_trail:
    - event_type: enum               # [test_execution, validation_passed, validation_failed]
      tracking_method: string
      storage_location: string

linkage:
  domain_truth_file: string
  validation_chain_proof_file: string
  test_datasets_directory: string
  test_implementation_directory: string
```

---

## Usage Guidelines

### For Eval Agent

When creating eval criteria:

1. **Create Test Datasets** - For every domain rule and FR
2. **Define Pass Criteria** - Unambiguous, measurable
3. **Automate Where Possible** - Maximize automation
4. **Cover Edge Cases** - Include boundary conditions
5. **Link to Domain Truth** - Every test traces to a requirement

### For Validator Agent

When using eval criteria:

1. **Execute Tests** - Run test datasets automatically
2. **Verify Coverage** - Ensure all domain truth is validated
3. **Track Results** - Maintain validation evidence
4. **Alert on Failures** - Notify when validation fails
5. **Update Baselines** - Keep regression baselines current

### For Dev Agent

When implementing features:

1. **Review Test Datasets** - Understand what success looks like
2. **Run Locally** - Execute relevant tests before committing
3. **Achieve Coverage** - Ensure all test datasets pass
4. **Add Evidence** - Provide test results as evidence

### Validation Requirements

Every eval-criteria file must:

- [ ] Cover all domain rules with at least one test dataset
- [ ] Cover all FRs with acceptance criteria
- [ ] Define both positive and negative test cases
- [ ] Specify automation approach for each test
- [ ] Link to test dataset files and test implementations
- [ ] Define pass/fail criteria unambiguously
- [ ] Establish regression validation baselines

---

## Examples

### Minimal Eval Criteria (Shopping Cart)

```yaml
metadata:
  version: "1.0.0"
  created_date: "2025-10-04T10:00:00Z"
  project_name: "Shopping Cart System"
  validation_framework: "Jest"
  domain_truth_version: "1.0.0"

validation_philosophy:
  approach: "Test-driven validation with automated regression"
  automation_target: 95
  execution_frequency: on_commit
  failure_policy: block_deployment

test_datasets:
  location: "test-datasets/cart/"
  format_standards: ["JSON", "YAML"]
  naming_convention: "{type}-{feature}-{case_id}.{format}"

  datasets:
    - id: "TEST-DATASET-001"
      name: "Cart Total Calculation - Basic"
      description: "Validates basic cart total calculation with items and tax"
      type: unit
      validates:
        domain_rule_ids: ["RULE-001"]
        functional_requirement_ids: ["FR-001"]
      dataset_file: "test-datasets/cart/unit-cart-total-001.json"
      dataset_format: json
      test_cases:
        - case_id: "CASE-001"
          name: "Two items with 10% tax"
          description: "Cart with 2 items should calculate total with tax correctly"
          input:
            format: "JSON"
            data:
              items:
                - {price: 10.00, quantity: 2}
                - {price: 15.00, quantity: 1}
              tax_rate: 0.10
              discount: 0.00
          expected_output:
            format: "JSON"
            data:
              total: 38.50
              breakdown:
                subtotal: 35.00
                tax: 3.50
                discount: 0.00
          preconditions: ["Cart is initialized", "Items are valid products"]
          postconditions: ["Cart total is calculated", "Total matches expected"]
      execution:
        test_framework: "Jest"
        test_file: "src/__tests__/cart/calculator.test.js"
        timeout: 5000
      pass_criteria:
        - criterion: "Calculated total matches expected total"
          measurement: "Exact match"
          threshold: "0.00 tolerance"
      tags: ["cart", "calculation", "critical"]
      priority: critical
      automation_status: automated

functional_requirement_validation:
  - fr_id: "FR-001"
    name: "Add Item to Cart"
    acceptance_criteria:
      - criterion_id: "AC-001"
        description: "Item appears in cart with correct quantity and price"
        validation_method: automated_test
        test_dataset_id: "TEST-DATASET-005"
        test_procedure: "Add item via API, verify cart contents"
        pass_conditions:
          - "Item is present in cart"
          - "Quantity matches requested"
          - "Price matches product price"
        fail_conditions:
          - "Item not added"
          - "Incorrect quantity"
          - "Price mismatch"
        evidence_required: test_results
        evidence_location: "test-results/fr-001/"
        validated_by: eval_agent
        validation_frequency: every_commit

domain_rule_validation:
  - rule_id: "RULE-001"
    name: "Cart Total Calculation"
    rule_type: calculation
    validation_approach:
      method: example_based
      description: "Validate through comprehensive example test cases"
    test_datasets:
      positive_cases:
        - test_dataset_id: "TEST-DATASET-001"
          description: "Basic calculation with items and tax"
          expected_result: "Total = 38.50"
        - test_dataset_id: "TEST-DATASET-002"
          description: "Calculation with discount"
          expected_result: "Total includes discount"
      negative_cases:
        - test_dataset_id: "TEST-DATASET-003"
          description: "Invalid tax rate"
          expected_error: "Tax rate must be between 0 and 1"
      edge_cases:
        - test_dataset_id: "TEST-DATASET-004"
          description: "Empty cart"
          expected_behavior: "Total = 0.00"
    invariant_checks:
      - invariant_id: "INV-001"
        description: "Total must equal sum of items + tax - discount"
        verification_method: "Arithmetic validation"
        test_dataset_id: "TEST-DATASET-001"

quality_attribute_validation:
  - attribute_category: performance
    attribute_name: "Cart Total Calculation Performance"
    measurement:
      metric: "Response time"
      unit: "milliseconds"
      measurement_tool: "Jest performance profiler"
    acceptance_criteria:
      target_value: "< 100ms"
      threshold: "p95 < 150ms"
      test_dataset_id: "PERF-TEST-001"
    validation_procedure:
      approach: "Load test with 1000 concurrent calculations"
      test_environment: "Staging"
      test_duration: "5 minutes"
    baseline:
      current_value: "45ms (p95)"
      measurement_date: "2025-10-01T00:00:00Z"
      source: "Production metrics"

regression_validation:
  critical_paths:
    - path_id: "CRITICAL-001"
      name: "Standard checkout flow"
      description: "User adds items, applies discount, checks out"
      test_datasets:
        - test_dataset_id: "E2E-CHECKOUT-001"
          criticality: critical
      regression_frequency: every_commit
      failure_response: block

validation_automation:
  ci_cd_integration:
    pipeline_stages:
      - stage_name: "Unit Tests"
        test_dataset_ids: ["TEST-DATASET-001", "TEST-DATASET-002"]
        pass_requirement: "100%"
        timeout: 300000
      - stage_name: "Integration Tests"
        test_dataset_ids: ["INT-TEST-001"]
        pass_requirement: "95%"
        timeout: 600000
    deployment_gates:
      - gate_name: "Production Deployment"
        required_validations: ["All critical tests pass", "Performance benchmarks met"]
        test_dataset_ids: ["CRITICAL-001", "PERF-TEST-001"]

validation_reporting:
  report_format: junit_xml
  report_location: "test-results/"
  metrics_tracked:
    - metric_name: "Test Pass Rate"
      description: "Percentage of tests passing"
      calculation_method: "(passed / total) * 100"
  notifications:
    - trigger: failure
      channels: ["slack"]
      recipients: ["#dev-team"]

linkage:
  domain_truth_file: "domain-truth.yaml"
  validation_chain_proof_file: "validation-chain-proof.yaml"
  test_datasets_directory: "test-datasets/"
  test_implementation_directory: "src/__tests__/"
```

---

## Test Dataset Creation Process

### Step 1: Domain Truth Analysis
- Review domain rules and FRs
- Identify validation requirements
- Determine test dataset needs

### Step 2: Test Case Design
- Create positive test cases (should pass)
- Create negative test cases (should fail)
- Create edge cases (boundary conditions)
- Ensure equivalence class coverage

### Step 3: Dataset Implementation
- Create dataset files (JSON/YAML/CSV)
- Implement test code
- Link to domain truth IDs
- Define pass/fail criteria

### Step 4: Automation Setup
- Configure CI/CD integration
- Set up continuous validation
- Configure reporting and alerts

### Step 5: Validation
- Execute test datasets
- Verify coverage is complete
- Document evidence
- Update baselines

---

## Related Schemas

- **domain-truth.yaml** - What this validates
- **validation-chain-proof.yaml** - Proof of traceability
- **test-datasets/** - Actual test data files
- **test-implementation/** - Actual test code

---

## Schema Validation

This schema can be validated using:

- Coverage analysis tools
- Test execution frameworks
- Eval Agent validation
- Validator Agent continuous checks
- Traceability verification tools
