# Validation Chain Proof Schema Specification

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Prove traceability from code back to validated domain truth
**Scope:** Establishes and validates the complete chain: domain truth → PRD → architecture → stories → code → tests

---

## Overview

The `validation-chain-proof.yaml` file provides **proof of traceability** throughout the development lifecycle. It demonstrates that every piece of code traces back to validated domain requirements and that all domain requirements are implemented and tested.

### Key Principles

1. **Complete Traceability** - Every code artifact traces to domain truth
2. **Bidirectional Links** - Forward (requirement → code) and backward (code → requirement)
3. **Validation Proof** - Every link is validated with empirical evidence
4. **Gap Detection** - Identify missing implementations or orphaned code
5. **Continuous Verification** - Automatically validate chain integrity

---

## Schema Structure

```yaml
# validation-chain-proof.yaml

metadata:
  version: string                    # Semantic version
  generated_date: ISO8601
  last_validated: ISO8601
  project_name: string
  validation_status: enum            # [complete, partial, broken, unknown]

traceability_matrix:
  domain_truth_coverage:
    total_requirements: integer
    implemented_requirements: integer
    validated_requirements: integer
    coverage_percentage: number

  orphan_detection:
    orphaned_code: [string]          # Code with no domain truth link
    orphaned_tests: [string]         # Tests with no requirement link
    orphaned_stories: [string]       # Stories with no PRD link

validation_chain:
  # Level 0: Domain Truth (immutable source)
  level_0_domain_truth:
    file: string                     # domain-truth.yaml
    version: string
    validated: boolean
    validation_method: string
    validation_evidence: string

    elements:
      - id: string                   # Domain element ID (FR, Rule, Concept)
        type: enum                   # [functional_requirement, domain_rule, concept, quality_attribute]
        status: enum                 # [validated, implemented, tested, complete]

        validation:
          eval_criteria_id: string   # From eval-criteria.yaml
          test_dataset_ids: [string]
          validation_passed: boolean
          validation_date: ISO8601
          validation_evidence: string

        traces_to_level_1: [string]  # PRD element IDs

  # Level 1: Derived Documents (PRD, Architecture)
  level_1_derived:
    documents:
      - type: enum                   # [prd, architecture, ux_spec]
        file: string
        version: string

        elements:
          - id: string               # Element ID in document
            type: enum               # [feature, epic, story, component, layer]
            content_summary: string

            traces_from_level_0: [string]  # Domain truth IDs
            traces_to_level_2: [string]    # Story/Code IDs

            validation:
              consistency_check: boolean
              semantic_validation: boolean
              domain_alignment: boolean
              validation_method: string
              validation_evidence: string

            coverage:
              requirements_covered: [string]
              requirements_gaps: [string]

  # Level 2: Implementation (Stories, Code, Tests)
  level_2_implementation:
    stories:
      - id: string                   # Story ID
        file: string
        title: string

        traces_from_level_1: [string]  # PRD/Architecture IDs
        traces_from_level_0: [string]  # Domain truth IDs (direct)

        implemented: boolean
        implementation_evidence: [string]  # Code file paths

        tested: boolean
        test_evidence: [string]        # Test file paths

        validation:
          acceptance_criteria_met: boolean
          test_datasets_passed: [string]
          validation_date: ISO8601

    code_artifacts:
      - id: string                   # Code artifact ID
        type: enum                   # [class, function, module, component, service]
        file: string
        location: string               # File:line

        implements_stories: [string]
        implements_domain_rules: [string]
        implements_requirements: [string]

        covered_by_tests: [string]     # Test file paths
        test_coverage_percentage: number

        validation:
          domain_rule_compliance: boolean
          test_validation_passed: boolean
          validation_evidence: string

    test_artifacts:
      - id: string                   # Test ID
        type: enum                   # [unit, integration, e2e, performance]
        file: string
        location: string

        validates_stories: [string]
        validates_code: [string]
        validates_domain_rules: [string]
        validates_requirements: [string]

        test_dataset_id: string        # From eval-criteria.yaml

        execution:
          last_run: ISO8601
          status: enum                 # [passed, failed, skipped, not_run]
          execution_evidence: string

traceability_rules:
  forward_traceability:              # Domain → Implementation
    - rule_id: string
      description: string
      validation_query: string       # How to verify this rule
      status: enum                   # [satisfied, violated, unknown]
      violations: [string]

  backward_traceability:             # Code → Domain
    - rule_id: string
      description: string
      validation_query: string
      status: enum                   # [satisfied, violated, unknown]
      violations: [string]

  consistency_rules:
    - rule_id: string
      description: string
      validation_query: string
      status: enum                   # [satisfied, violated, unknown]
      violations: [string]

coverage_analysis:
  requirement_coverage:
    - requirement_id: string         # From domain-truth.yaml
      requirement_type: enum         # [functional, non_functional, quality]

      covered_by:
        prd_elements: [string]
        architecture_elements: [string]
        stories: [string]
        code_artifacts: [string]
        tests: [string]

      coverage_status: enum          # [fully_covered, partially_covered, not_covered]
      coverage_percentage: number
      gaps: [string]

  code_coverage:
    - code_artifact_id: string
      traces_to_requirements: [string]
      coverage_status: enum          # [traced, orphaned, partial]

  test_coverage:
    - test_artifact_id: string
      validates_requirements: [string]
      test_dataset_ids: [string]
      coverage_status: enum          # [validated, not_validated]

gap_analysis:
  missing_implementations:
    - requirement_id: string
      requirement_description: string
      expected_in: enum              # [prd, architecture, stories, code, tests]
      priority: enum                 # [critical, high, medium, low]
      remediation_plan: string

  orphaned_artifacts:
    - artifact_id: string
      artifact_type: enum            # [code, test, story, document_section]
      artifact_location: string
      issue: string                  # Why it's orphaned
      recommended_action: enum       # [link_to_requirement, remove, document]

  inconsistencies:
    - inconsistency_id: string
      type: enum                     # [semantic, structural, coverage]
      description: string
      affected_artifacts: [string]
      resolution_required: string

validation_evidence:
  test_execution_results:
    - test_dataset_id: string
      execution_date: ISO8601
      status: enum                   # [passed, failed]
      evidence_file: string
      validates_chain_links: [string]

  code_analysis_results:
    - analysis_type: enum            # [static_analysis, dependency_analysis, coverage_analysis]
      tool: string
      execution_date: ISO8601
      results_file: string
      findings_summary: string

  document_validation_results:
    - document_type: enum            # [prd, architecture, story]
      validation_type: enum          # [consistency, completeness, alignment]
      validation_date: ISO8601
      status: enum                   # [passed, failed, partial]
      evidence_file: string

  manual_validation_results:
    - validation_type: string
      validator: string
      validation_date: ISO8601
      status: enum                   # [passed, failed]
      evidence_file: string

chain_integrity_checks:
  automated_checks:
    - check_id: string
      name: string
      description: string
      frequency: enum                # [on_commit, daily, weekly]

      validation_query: string       # How to perform check
      last_run: ISO8601
      status: enum                   # [passed, failed]

      failures: [string]
      remediation_actions: [string]

  manual_reviews:
    - review_id: string
      name: string
      description: string
      frequency: enum                # [weekly, monthly, quarterly]

      reviewer: string
      last_review: ISO8601
      status: enum                   # [passed, failed]

      findings: [string]
      action_items: [string]

brownfield_specific:
  existing_system_linkage:
    - existing_component_id: string  # From existing-system-truth.yaml
      enhancement_id: string         # From enhancement-truth.yaml
      migration_status: enum         # [not_started, in_progress, completed]

      compatibility_maintained: boolean
      regression_tests_passed: boolean
      validation_evidence: string

  migration_validation:
    - migration_id: string
      from_state: string             # existing-system-truth reference
      to_state: string               # enhancement-truth reference

      validation_tests: [string]
      migration_tests_passed: boolean
      rollback_validated: boolean
      validation_evidence: string

metrics:
  traceability_metrics:
    - metric_name: string
      description: string
      current_value: number
      target_value: number
      trend: enum                    # [improving, degrading, stable]

  quality_metrics:
    - metric_name: string
      category: enum                 # [coverage, consistency, completeness]
      current_value: number
      threshold: number
      status: enum                   # [met, not_met]

  validation_metrics:
    - metric_name: string
      description: string
      current_value: number
      target_value: number

alerts:
  chain_breaks:
    - alert_id: string
      severity: enum                 # [critical, high, medium, low]
      description: string
      affected_chain: string         # Which part of chain is broken
      detected_date: ISO8601
      status: enum                   # [open, resolved]
      resolution: string

  coverage_degradation:
    - alert_id: string
      metric: string
      previous_value: number
      current_value: number
      threshold_violated: boolean
      detected_date: ISO8601

audit_trail:
  changes:
    - change_id: string
      change_type: enum              # [link_added, link_removed, validation_updated]
      timestamp: ISO8601
      changed_by: string
      description: string
      impact: string

reports:
  - report_id: string
    report_type: enum                # [coverage_report, gap_analysis, chain_integrity]
    generated_date: ISO8601
    report_file: string
    summary: string

linkage:
  domain_truth_file: string
  eval_criteria_file: string
  prd_file: string
  architecture_file: string
  stories_directory: string
  code_directory: string
  tests_directory: string
```

---

## Usage Guidelines

### For Validator Agent

When maintaining validation chain:

1. **Continuous Verification** - Automatically check chain integrity
2. **Detect Breaks** - Identify when links are broken or missing
3. **Gap Analysis** - Find missing implementations or orphaned code
4. **Coverage Tracking** - Monitor requirement and test coverage
5. **Alert on Issues** - Notify when chain integrity is compromised

### For Monitor Agent

When tracking metrics:

1. **Coverage Metrics** - Track requirement and test coverage
2. **Traceability Metrics** - Monitor chain completeness
3. **Quality Metrics** - Measure consistency and completeness
4. **Trend Analysis** - Identify improving or degrading metrics
5. **Dashboard Updates** - Provide real-time visibility

### For All Agents

When creating artifacts:

1. **Reference Chain** - Always link to parent artifacts
2. **Validate Links** - Ensure references are valid
3. **Update Proof** - Update validation chain when creating artifacts
4. **Test Validation** - Ensure tests validate the chain
5. **Evidence Capture** - Provide validation evidence

### Validation Requirements

Every validation-chain-proof file must:

- [ ] Cover all domain truth elements with traceability
- [ ] Identify all orphaned artifacts (code, tests, stories)
- [ ] Validate bidirectional traceability (forward and backward)
- [ ] Provide evidence for all validation claims
- [ ] Calculate and report coverage metrics
- [ ] Detect and report chain breaks
- [ ] Support automated integrity checks

---

## Examples

### Minimal Validation Chain Proof (Shopping Cart)

```yaml
metadata:
  version: "1.0.0"
  generated_date: "2025-10-04T10:00:00Z"
  project_name: "Shopping Cart System"
  validation_status: complete

traceability_matrix:
  domain_truth_coverage:
    total_requirements: 5
    implemented_requirements: 5
    validated_requirements: 5
    coverage_percentage: 100.0

  orphan_detection:
    orphaned_code: []
    orphaned_tests: []
    orphaned_stories: []

validation_chain:
  level_0_domain_truth:
    file: "domain-truth.yaml"
    version: "1.0.0"
    validated: true
    validation_method: "Eval Agent with test datasets"
    validation_evidence: "test-results/domain-validation-2025-10-04.json"

    elements:
      - id: "FR-001"
        type: functional_requirement
        status: complete

        validation:
          eval_criteria_id: "AC-001"
          test_dataset_ids: ["TEST-DATASET-005"]
          validation_passed: true
          validation_date: "2025-10-04T09:00:00Z"
          validation_evidence: "test-results/fr-001-passed.json"

        traces_to_level_1: ["PRD-EPIC-001", "ARCH-COMPONENT-001"]

  level_1_derived:
    documents:
      - type: prd
        file: "docs/prd.md"
        version: "1.0.0"

        elements:
          - id: "PRD-EPIC-001"
            type: epic
            content_summary: "Shopping Cart Management - Add/Remove Items"

            traces_from_level_0: ["FR-001", "RULE-001"]
            traces_to_level_2: ["STORY-001", "STORY-002"]

            validation:
              consistency_check: true
              semantic_validation: true
              domain_alignment: true
              validation_method: "PO Agent document alignment check"
              validation_evidence: "validation/prd-alignment-check.md"

            coverage:
              requirements_covered: ["FR-001", "RULE-001"]
              requirements_gaps: []

      - type: architecture
        file: "docs/architecture.md"
        version: "1.0.0"

        elements:
          - id: "ARCH-COMPONENT-001"
            type: component
            content_summary: "CartService - Business Logic Layer"

            traces_from_level_0: ["FR-001", "RULE-001"]
            traces_to_level_2: ["CODE-001", "CODE-002"]

            validation:
              consistency_check: true
              semantic_validation: true
              domain_alignment: true
              validation_method: "Architect Agent design validation"
              validation_evidence: "validation/architecture-validation.md"

            coverage:
              requirements_covered: ["FR-001", "RULE-001"]
              requirements_gaps: []

  level_2_implementation:
    stories:
      - id: "STORY-001"
        file: "docs/stories/cart-add-item.md"
        title: "Add Item to Cart"

        traces_from_level_1: ["PRD-EPIC-001", "ARCH-COMPONENT-001"]
        traces_from_level_0: ["FR-001"]

        implemented: true
        implementation_evidence: ["src/services/CartService.js:45-67"]

        tested: true
        test_evidence: ["src/__tests__/cart/addItem.test.js"]

        validation:
          acceptance_criteria_met: true
          test_datasets_passed: ["TEST-DATASET-005"]
          validation_date: "2025-10-04T10:00:00Z"

    code_artifacts:
      - id: "CODE-001"
        type: function
        file: "src/services/CartService.js"
        location: "src/services/CartService.js:45"

        implements_stories: ["STORY-001"]
        implements_domain_rules: ["RULE-001"]
        implements_requirements: ["FR-001"]

        covered_by_tests: ["src/__tests__/cart/addItem.test.js"]
        test_coverage_percentage: 100

        validation:
          domain_rule_compliance: true
          test_validation_passed: true
          validation_evidence: "test-results/code-001-validation.json"

    test_artifacts:
      - id: "TEST-001"
        type: unit
        file: "src/__tests__/cart/addItem.test.js"
        location: "src/__tests__/cart/addItem.test.js:10"

        validates_stories: ["STORY-001"]
        validates_code: ["CODE-001"]
        validates_domain_rules: ["RULE-001"]
        validates_requirements: ["FR-001"]

        test_dataset_id: "TEST-DATASET-005"

        execution:
          last_run: "2025-10-04T10:00:00Z"
          status: passed
          execution_evidence: "test-results/jest-results-2025-10-04.json"

coverage_analysis:
  requirement_coverage:
    - requirement_id: "FR-001"
      requirement_type: functional

      covered_by:
        prd_elements: ["PRD-EPIC-001"]
        architecture_elements: ["ARCH-COMPONENT-001"]
        stories: ["STORY-001"]
        code_artifacts: ["CODE-001"]
        tests: ["TEST-001"]

      coverage_status: fully_covered
      coverage_percentage: 100
      gaps: []

gap_analysis:
  missing_implementations: []
  orphaned_artifacts: []
  inconsistencies: []

chain_integrity_checks:
  automated_checks:
    - check_id: "CHECK-001"
      name: "Forward Traceability Check"
      description: "Verify all domain requirements trace to code"
      frequency: on_commit

      validation_query: "SELECT * FROM domain_truth WHERE id NOT IN (SELECT domain_id FROM implementation)"
      last_run: "2025-10-04T10:00:00Z"
      status: passed

      failures: []
      remediation_actions: []

metrics:
  traceability_metrics:
    - metric_name: "Forward Traceability Completeness"
      description: "% of domain requirements that trace to implementation"
      current_value: 100.0
      target_value: 100.0
      trend: stable

    - metric_name: "Backward Traceability Completeness"
      description: "% of code artifacts that trace to domain requirements"
      current_value: 100.0
      target_value: 95.0
      trend: stable

  quality_metrics:
    - metric_name: "Test Coverage"
      category: coverage
      current_value: 100.0
      threshold: 80.0
      status: met

  validation_metrics:
    - metric_name: "Requirements Validated"
      description: "% of requirements with passing test datasets"
      current_value: 100.0
      target_value: 100.0

alerts:
  chain_breaks: []
  coverage_degradation: []

linkage:
  domain_truth_file: "domain-truth.yaml"
  eval_criteria_file: "eval-criteria.yaml"
  prd_file: "docs/prd.md"
  architecture_file: "docs/architecture.md"
  stories_directory: "docs/stories/"
  code_directory: "src/"
  tests_directory: "src/__tests__/"
```

---

## Validation Chain Verification Process

### Step 1: Forward Traceability
- Start with domain truth elements
- Follow links through PRD → Architecture → Stories → Code
- Verify every element has a path to implementation
- Identify gaps (requirements without implementation)

### Step 2: Backward Traceability
- Start with code artifacts
- Trace back through Stories → Architecture → PRD → Domain Truth
- Verify every code artifact has a source requirement
- Identify orphans (code without requirements)

### Step 3: Consistency Validation
- Verify semantic alignment across chain
- Check that implementations match requirements
- Validate test datasets prove compliance
- Identify inconsistencies

### Step 4: Coverage Analysis
- Calculate requirement coverage
- Calculate test coverage
- Calculate code coverage
- Identify coverage gaps

### Step 5: Evidence Collection
- Collect test execution results
- Gather code analysis results
- Document validation results
- Create audit trail

---

## Automated Verification

The validation chain should be automatically verified by:

1. **CI/CD Pipeline** - Check chain integrity on every commit
2. **Validator Agent** - Continuous validation and gap detection
3. **Monitor Agent** - Track metrics and trends
4. **Static Analysis** - Code-level traceability verification
5. **Test Execution** - Validate test datasets prove requirements

---

## Related Schemas

- **domain-truth.yaml** - Level 0 immutable truth
- **eval-criteria.yaml** - Validation methods and test datasets
- **PRD/Architecture** - Level 1 derived documents
- **Stories/Code** - Level 2 implementation

---

## Schema Validation

This schema can be validated using:

- Traceability analysis tools
- Coverage analysis tools
- Validator Agent automated checks
- Monitor Agent metric tracking
- Audit trail verification
