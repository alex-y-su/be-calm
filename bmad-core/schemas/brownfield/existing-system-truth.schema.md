# Existing System Truth Schema Specification

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Capture the current state of existing systems (brownfield projects)
**Scope:** Level 0 truth for "what IS" - the actual current behavior and implementation

---

## Overview

The `existing-system-truth.yaml` file documents **what the system currently does** based on empirical observation, not what documentation claims. This serves as the baseline for brownfield enhancements and must be validated through regression testing.

### Key Principles

1. **Evidence-Based** - Documented through code analysis, testing, and observation
2. **Reality Over Documentation** - Trust observed behavior, not outdated docs
3. **Regression Safety** - Establishes baseline for compatibility testing
4. **Complete Current State** - Captures actual behavior, including quirks and bugs

---

## Schema Structure

```yaml
# existing-system-truth.yaml

metadata:
  version: string                    # Semantic version (e.g., "1.0.0")
  analyzed_date: ISO8601             # When system was analyzed
  last_validated: ISO8601            # Last validation check
  system_name: string                # Current system name
  system_version: string             # Current version in production
  analysis_method: enum              # [code_review, runtime_analysis, combined]
  analyzers: [string]                # Who performed the analysis (human/agent)

system_overview:
  name: string
  description: string                # What the system currently does
  version: string                    # Current version
  deployment:
    environment: enum                # [production, staging, development]
    deployment_date: ISO8601
    user_base: string                # Current user count/type

  tech_stack:
    languages: [string]
    frameworks: [string]
    databases: [string]
    infrastructure: [string]
    third_party_services: [string]

current_architecture:
  style: enum                        # [monolith, microservices, serverless, etc.]
  components:
    - id: string                     # Component ID
      name: string
      type: enum                     # [service, module, library, database, etc.]
      description: string

      responsibilities: [string]     # What this component does
      dependencies: [string]         # Component IDs this depends on

      interfaces:
        - type: enum                 # [rest_api, graphql, grpc, database, message_queue]
          endpoint: string
          contract: string           # Schema/interface definition
          consumers: [string]        # What uses this interface

      data_stores:
        - name: string
          type: enum                 # [sql, nosql, cache, file_system]
          schema_location: string    # Where schema is defined

      code_location: string          # Path to source code

  data_flow:
    - id: string
      name: string
      description: string
      path: [string]                 # Component IDs in flow sequence
      data_transformations: [string]

existing_data_models:
  - id: string                       # Model ID
    name: string
    type: enum                       # [entity, value_object, dto, event]
    location: string                 # Where defined in code

    fields:
      - name: string
        type: string
        required: boolean
        default_value: any
        validation_rules: [string]
        usage_analysis:              # How this field is actually used
          read_locations: [string]
          write_locations: [string]
          null_frequency: string     # % of time field is null

    relationships:
      - field: string
        related_model: string
        type: enum                   # [one-to-one, one-to-many, many-to-many]
        enforced: boolean            # Is relationship enforced in DB/code?

    constraints:
      - type: enum                   # [unique, foreign_key, check, etc.]
        definition: string
        enforced_where: enum         # [database, application, both, none]

    usage_statistics:
      record_count: integer          # Approximate number of records
      growth_rate: string
      query_patterns: [string]       # Common query patterns

current_business_logic:
  - id: string                       # Logic ID
    name: string
    description: string              # What it actually does (not what it should)
    type: enum                       # [validation, calculation, workflow, integration]

    location: string                 # Code location
    trigger: string                  # What causes this logic to execute

    actual_behavior:
      inputs: [string]
      process: string                # Description of actual processing
      outputs: [string]
      side_effects: [string]         # Unintended consequences

    edge_cases:                      # Discovered edge cases
      - scenario: string
        behavior: string
        expected_vs_actual: string   # If there's a discrepancy
        frequency: enum              # [common, occasional, rare]

    test_coverage:
      covered: boolean
      test_location: string
      test_dataset_id: string        # Regression test dataset

    dependencies: [string]           # Other logic IDs this depends on

current_apis:
  - id: string
    endpoint: string
    method: enum                     # [GET, POST, PUT, DELETE, etc.]
    description: string

    request:
      parameters: [object]
      body_schema: string
      headers: [string]

    response:
      success_schema: string
      error_schemas: [string]
      status_codes: [integer]

    authentication: string
    authorization: string
    rate_limiting: string

    actual_behavior:                 # Observed behavior
      response_time_p95: string
      error_rate: string
      usage_frequency: string

    consumers:                       # Who uses this API
      - name: string
        type: enum                   # [internal, external, third_party]
        dependency_level: enum       # [critical, important, optional]

    breaking_change_risk: enum       # [high, medium, low]
    test_dataset_id: string          # API regression tests

current_user_workflows:
  - id: string
    name: string
    description: string
    user_role: string

    steps:
      - step_number: integer
        action: string
        ui_component: string
        backend_apis: [string]

    completion_rate: string          # % of users who complete this workflow
    abandonment_points: [string]     # Where users commonly drop off

    test_dataset_id: string          # Workflow regression tests

known_issues:
  - id: string
    title: string
    description: string
    severity: enum                   # [critical, high, medium, low]
    impact: string

    workaround: string               # Current mitigation
    affected_components: [string]

    reproduction_steps: [string]
    test_dataset_id: string          # Test that reproduces issue

    status: enum                     # [open, acknowledged, wont_fix]
    decision_rationale: string       # Why not fixed or why wont_fix

technical_debt:
  - id: string
    category: enum                   # [code_quality, architecture, security, performance]
    description: string
    location: string

    impact:
      maintenance_cost: enum         # [high, medium, low]
      change_risk: enum              # [high, medium, low]

    remediation_effort: string
    priority: enum                   # [high, medium, low]

integration_points:
  - id: string
    name: string
    type: enum                       # [external_api, database, file_system, message_queue]
    provider: string

    integration_method: string
    data_format: string

    dependencies:
      - name: string
        version: string
        criticality: enum            # [critical, important, optional]

    failure_behavior: string         # What happens when integration fails
    fallback_mechanism: string

    monitoring: string               # How this is monitored
    test_dataset_id: string          # Integration regression tests

security_posture:
  authentication:
    method: string
    implementation: string

  authorization:
    model: enum                      # [rbac, abac, acl, etc.]
    implementation: string

  data_protection:
    encryption_at_rest: boolean
    encryption_in_transit: boolean
    pii_handling: string

  vulnerabilities:
    - id: string
      type: string
      severity: enum                 # [critical, high, medium, low]
      status: enum                   # [open, mitigated, accepted]

performance_characteristics:
  - metric: enum                     # [response_time, throughput, resource_usage]
    component: string
    current_value: string
    measurement_method: string
    acceptable_range: string
    test_dataset_id: string

regression_test_suite:
  location: string                   # Where regression tests are
  coverage_percentage: number
  test_datasets_dir: string          # Path to regression test datasets

  critical_paths:                    # Must-not-break scenarios
    - path_name: string
      description: string
      test_dataset_ids: [string]
      validation_frequency: enum     # [every_commit, daily, weekly]

compatibility_requirements:
  backwards_compatibility:
    api_versions: [string]           # API versions that must remain compatible
    data_formats: [string]           # Data formats that must be supported
    client_versions: [string]        # Client versions that must work

  integration_compatibility:
    - integration_id: string
      constraint: string
      test_dataset_id: string

  migration_constraints:
    - constraint: string
      reason: string
      test_method: string

observability:
  logging:
    locations: [string]
    format: string
    retention: string

  metrics:
    - metric_name: string
      type: enum                     # [counter, gauge, histogram]
      purpose: string

  tracing:
    enabled: boolean
    tool: string
    coverage: string

validation_evidence:
  code_analysis:
    - tool: string
      report_location: string
      findings_summary: string

  runtime_analysis:
    - method: string                 # [profiling, load_testing, monitoring]
      duration: string
      findings_summary: string

  user_research:
    - method: string                 # [interviews, analytics, surveys]
      sample_size: integer
      findings_summary: string

linkage:
  domain_truth_file: string          # Path to domain-truth.yaml (what SHOULD be)
  enhancement_truth_file: string     # Path to enhancement-truth.yaml (what WILL change)
  compatibility_analysis_file: string # Path to compatibility-analysis.yaml
  migration_strategy_file: string    # Path to migration-strategy.yaml
  regression_test_datasets_dir: string
```

---

## Usage Guidelines

### For Compatibility Agent

When analyzing existing systems:

1. **Code Over Docs** - Trust the actual code, not documentation
2. **Test Current Behavior** - Create regression test datasets
3. **Document Quirks** - Capture actual behavior, even if unexpected
4. **Identify Integration Points** - Map all external dependencies
5. **Measure Performance** - Establish baseline metrics

### For Analyst Agent

When researching brownfield:

1. **Understand Current State** - Start with existing-system-truth
2. **Identify Gaps** - Compare to domain-truth (what SHOULD be)
3. **Find Integration Points** - Understand dependencies
4. **Assess Technical Debt** - Prioritize improvements

### For Oracle Agent

When reconciling existing vs. domain truth:

1. **Compare IS vs. SHOULD** - Identify discrepancies
2. **Validate Domain Assumptions** - Existing system may reveal domain truth
3. **Update Domain Truth** - If existing system reveals domain insights
4. **Create Enhancement Truth** - Define what WILL change

### Validation Requirements

Every existing-system-truth file must:

- [ ] Be based on actual code analysis and runtime observation
- [ ] Include regression test datasets for critical paths
- [ ] Document all integration points and dependencies
- [ ] Capture known issues and technical debt
- [ ] Link to compatibility analysis and migration strategy
- [ ] Measure and document current performance baselines

---

## Examples

### Minimal Existing System Truth (Legacy Payment Service)

```yaml
metadata:
  version: "1.0.0"
  analyzed_date: "2025-10-04T10:00:00Z"
  system_name: "Legacy Payment Service"
  system_version: "2.3.1"
  analysis_method: combined

system_overview:
  name: "Payment Processing Service"
  description: "Handles credit card and PayPal payments"
  tech_stack:
    languages: ["Java 8", "JavaScript"]
    frameworks: ["Spring Boot 2.1", "React 16"]
    databases: ["PostgreSQL 11", "Redis 5"]

current_architecture:
  style: monolith
  components:
    - id: "COMP-001"
      name: "PaymentController"
      type: service
      responsibilities:
        - "Process payment requests"
        - "Validate card details"
      code_location: "src/main/java/payments/PaymentController.java"
      interfaces:
        - type: rest_api
          endpoint: "/api/v1/payments"
          contract: "OpenAPI spec at docs/api-v1.yaml"
          consumers: ["Web App", "Mobile App", "Admin Portal"]

existing_business_logic:
  - id: "LOGIC-001"
    name: "Payment Amount Validation"
    description: "Validates payment amount before processing"
    location: "src/main/java/payments/validators/AmountValidator.java:45"
    actual_behavior:
      inputs: ["amount", "currency"]
      process: "Checks amount > 0 AND amount < 10000"
      outputs: ["validation_result"]
      side_effects:
        - "Logs to payment_validation.log"
        - "Updates validation_metrics table"
    edge_cases:
      - scenario: "Amount exactly 10000"
        behavior: "Rejected (uses < instead of <=)"
        expected_vs_actual: "Docs say max is 10000, but code rejects it"
        frequency: occasional
    test_dataset_id: "REGRESSION-TEST-001"

current_apis:
  - id: "API-001"
    endpoint: "/api/v1/payments"
    method: POST
    description: "Process a payment"
    actual_behavior:
      response_time_p95: "450ms"
      error_rate: "2.3%"
      usage_frequency: "~5000 requests/day"
    consumers:
      - name: "Web Application"
        type: internal
        dependency_level: critical
    breaking_change_risk: high
    test_dataset_id: "API-REGRESSION-001"

known_issues:
  - id: "ISSUE-001"
    title: "Race condition in concurrent payment processing"
    severity: high
    impact: "Duplicate charges occur ~0.1% of the time"
    workaround: "Nightly reconciliation job detects and refunds duplicates"
    test_dataset_id: "RACE-CONDITION-TEST-001"
    status: acknowledged
    decision_rationale: "Fix requires major refactoring, workaround is acceptable for now"

technical_debt:
  - id: "DEBT-001"
    category: code_quality
    description: "No unit tests for PaymentValidator class"
    location: "src/main/java/payments/validators/"
    impact:
      maintenance_cost: high
      change_risk: high
    priority: high

regression_test_suite:
  location: "src/test/regression/"
  coverage_percentage: 65
  test_datasets_dir: "test-datasets/regression/"
  critical_paths:
    - path_name: "Standard Credit Card Payment"
      description: "End-to-end successful payment flow"
      test_dataset_ids: ["CRITICAL-PATH-001"]
      validation_frequency: every_commit

compatibility_requirements:
  backwards_compatibility:
    api_versions: ["v1"]
    client_versions: ["Web App >= 2.0", "Mobile App >= 1.5"]

linkage:
  domain_truth_file: "domain-truth.yaml"
  enhancement_truth_file: "enhancement-truth.yaml"
  regression_test_datasets_dir: "test-datasets/regression/"
```

---

## Analysis Process

### Step 1: Code Analysis
- Static code analysis
- Dependency mapping
- Architecture extraction
- Data flow tracing

### Step 2: Runtime Analysis
- Performance profiling
- Load testing
- Error rate monitoring
- User behavior analytics

### Step 3: Documentation Review
- Compare docs to actual behavior
- Identify discrepancies
- Update based on reality

### Step 4: Test Dataset Creation
- Create regression tests for critical paths
- Capture edge cases
- Document actual vs. expected behavior

### Step 5: Validation
- Run regression test suite
- Verify all critical paths work
- Measure baseline performance

---

## Related Schemas

- **domain-truth.yaml** - What the domain requires (what SHOULD be)
- **enhancement-truth.yaml** - What WILL change (reconciliation)
- **compatibility-analysis.yaml** - Impact analysis of changes
- **migration-strategy.yaml** - HOW to evolve system
- **regression-test-datasets/** - Tests that prove current behavior

---

## Schema Validation

This schema can be validated using:

- Code analysis tools (AST parsers, dependency analyzers)
- Runtime monitoring and profiling
- Compatibility Agent validation checks
- Regression test execution
- Validator Agent continuous validation
