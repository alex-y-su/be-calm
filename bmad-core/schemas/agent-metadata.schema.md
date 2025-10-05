# Agent Metadata Schema with Validation Rules

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Define agent metadata format including validation rules for autonomous operation
**Scope:** Truth Keeper Agents, Enhanced BMAD Agents, Agent behaviors and constraints

---

## Overview

The agent metadata format defines how AI agents are configured, what validation rules they must follow, and how they interact with the truth infrastructure. This enables autonomous operation while maintaining reliability through validation constraints.

### Key Principles

1. **Validation Rules** - Every agent has explicit validation rules
2. **Truth Grounding** - Agents must reference truth schemas
3. **Traceability** - All agent actions are traceable
4. **Bounded Autonomy** - Agents operate within defined constraints
5. **Evidence Required** - Agents must provide validation evidence

---

## Agent Metadata Schema

```yaml
# agent-metadata.yaml

metadata:
  agent_id: string                   # Unique agent identifier
  agent_name: string                 # Human-readable name
  version: string                    # Agent version (semantic versioning)
  created_date: ISO8601
  last_updated: ISO8601
  status: enum                       # [active, deprecated, experimental]

agent_profile:
  type: enum                         # [truth_keeper, developer, planner, validator]
  category: enum                     # [oracle, eval, validator, monitor, compatibility, reflection, analyst, pm, architect, etc.]

  description: string                # What this agent does
  purpose: string                    # Why this agent exists
  scope: [string]                    # What this agent is responsible for

  capabilities:
    - capability_id: string
      name: string
      description: string
      automation_level: enum         # [fully_automated, semi_automated, human_in_loop]

  limitations:
    - limitation_id: string
      description: string
      impact: string
      mitigation: string

truth_integration:
  primary_truth_sources:             # Truth schemas this agent works with
    - schema_type: enum              # [domain_truth, eval_criteria, existing_system_truth, enhancement_truth]
      schema_path: string
      usage: string                  # How agent uses this schema
      required: boolean

  truth_creation:                    # Can this agent create truth?
    can_create: boolean
    creates: [string]                # What truth schemas it can create
    validation_required: boolean
    approval_required: boolean
    approvers: [string]

  truth_validation:                  # How agent validates truth
    validates: [string]              # What truth schemas it validates
    validation_method: string
    test_dataset_usage: boolean
    evidence_required: boolean

  truth_consumption:                 # How agent consumes truth
    consumes: [string]               # What truth schemas it reads
    must_trace_to: [string]          # Required traceability
    validation_frequency: enum       # [real_time, periodic, on_demand]

validation_rules:
  input_validation:
    - rule_id: string
      name: string
      description: string
      validation_type: enum          # [schema, semantic, consistency, completeness]

      validation_logic: string       # How to validate
      error_handling: string         # What to do on validation failure
      blocking: boolean              # Does failure block agent action?

      test_dataset_id: string        # Test that proves this validation works

  output_validation:
    - rule_id: string
      name: string
      description: string
      must_satisfy: [string]         # Requirements output must satisfy

      validation_checks: [string]
      evidence_type: enum            # [test_results, traceability_proof, approval, metrics]
      evidence_location: string

  process_validation:
    - rule_id: string
      name: string
      description: string
      process_step: string

      validation_method: string
      checkpoint_frequency: enum     # [per_step, per_phase, end_to_end]

  consistency_rules:
    - rule_id: string
      description: string
      scope: [string]                # What must be consistent

      validation_query: string       # How to check consistency
      resolution_strategy: string    # How to resolve inconsistencies

  traceability_rules:
    - rule_id: string
      description: string
      from_artifact: string
      to_artifact: string

      required_links: [string]
      validation_method: string
      evidence_required: boolean

behavioral_constraints:
  autonomy_level:
    level: enum                      # [fully_autonomous, semi_autonomous, supervised, manual]
    description: string

    can_execute_without_approval: [string]   # What actions don't need approval
    requires_approval: [string]              # What actions need approval
    approval_workflow: string

  decision_making:
    decision_framework: string       # How agent makes decisions
    decision_criteria: [string]      # What criteria are used

    escalation_triggers: [string]    # When to escalate to human
    escalation_path: [string]        # Who to escalate to

    decision_logging: boolean        # Must log all decisions
    decision_evidence_required: boolean

  error_handling:
    error_detection: [string]        # How agent detects errors
    error_recovery: [string]         # How agent recovers from errors

    rollback_capability: boolean
    rollback_procedure: string

    human_intervention_triggers: [string]

  collaboration_rules:
    can_invoke_agents: [string]      # What agents this agent can invoke
    must_coordinate_with: [string]   # What agents this must coordinate with

    data_sharing_rules: [string]
    communication_protocol: string

agent_workflows:
  primary_workflows:
    - workflow_id: string
      name: string
      description: string
      trigger: enum                  # [manual, automatic, event_based, scheduled]

      phases:
        - phase_id: string
          name: string
          description: string
          order: integer

          steps:
            - step_id: string
              name: string
              action: string
              validation_rule_ids: [string]   # Validation rules for this step

              inputs_required: [string]
              outputs_produced: [string]

              success_criteria: [string]
              failure_handling: string

          validation_gate:
            gate_id: string
            criteria: [string]
            approval_required: boolean

      success_definition: [string]
      failure_definition: [string]

  agent_interactions:
    - interaction_id: string
      with_agent: string
      interaction_type: enum         # [invoke, coordinate, validate, inform]

      trigger_condition: string
      data_exchanged: [string]
      validation_required: boolean

knowledge_base:
  domain_knowledge:
    - knowledge_id: string
      domain: string
      description: string
      source: string
      last_updated: ISO8601

  technical_knowledge:
    - knowledge_id: string
      category: string
      description: string
      source: string

  validation_knowledge:
    - validation_pattern: string
      description: string
      when_to_use: string
      test_dataset_example: string

quality_gates:
  input_gates:
    - gate_id: string
      name: string
      criteria: [string]
      validation_rules: [string]
      blocking: boolean

  output_gates:
    - gate_id: string
      name: string
      criteria: [string]
      validation_rules: [string]
      evidence_required: [string]

  process_gates:
    - gate_id: string
      phase: string
      criteria: [string]
      approval_required: boolean

monitoring_and_metrics:
  performance_metrics:
    - metric_name: string
      description: string
      measurement_method: string
      target_value: string
      alert_threshold: string

  quality_metrics:
    - metric_name: string
      description: string
      measurement_method: string
      target_value: string

  validation_metrics:
    - metric_name: string
      description: string
      measurement_method: string
      target_value: string

  health_checks:
    - check_name: string
      description: string
      frequency: string
      alert_on_failure: boolean

execution_environment:
  runtime: string                    # Where agent executes (IDE, CLI, Web, etc.)
  dependencies: [string]             # What the agent needs to run

  resource_requirements:
    cpu: string
    memory: string
    storage: string

  environment_variables: [string]

  configuration_files: [string]

audit_and_compliance:
  audit_trail:
    enabled: boolean
    log_location: string
    retention_period: string

    events_to_log:
      - event_type: string
        detail_level: enum           # [summary, detailed, verbose]

  compliance_requirements:
    - requirement_id: string
      description: string
      validation_method: string
      evidence_location: string

  security_constraints:
    - constraint_id: string
      description: string
      enforcement_method: string

evidence_and_reporting:
  evidence_types:
    - type: enum                     # [test_results, validation_proof, traceability_proof, approval, metrics]
      storage_location: string
      retention_period: string
      format: string

  report_generation:
    - report_type: enum              # [validation_report, traceability_report, quality_report, audit_report]
      generation_trigger: enum       # [on_completion, on_request, scheduled]
      format: enum                   # [markdown, html, json, pdf]
      distribution: [string]

learning_and_improvement:
  feedback_loops:
    - feedback_type: enum            # [success_rate, error_patterns, efficiency]
      measurement_method: string
      improvement_trigger: string

  knowledge_updates:
    frequency: enum                  # [continuous, periodic, manual]
    update_source: [string]
    validation_required: boolean

  performance_optimization:
    - optimization_type: string
      trigger_condition: string
      validation_method: string

configuration:
  settings:
    - setting_name: string
      setting_value: any
      description: string
      configurable_by: enum          # [user, admin, system, agent]

  feature_flags:
    - flag_name: string
      default_state: boolean
      description: string
      impact: string

versioning:
  version_history:
    - version: string
      release_date: ISO8601
      changes: [string]
      breaking_changes: [string]
      migration_guide: string

  compatibility:
    backward_compatible_with: [string]  # Version ranges
    requires_migration_from: [string]   # Version ranges requiring migration

linkage:
  related_agents: [string]
  invokes_agents: [string]
  invoked_by_agents: [string]

  truth_schemas_used: [string]
  test_datasets_used: [string]
  validation_rules_used: [string]
```

---

## Usage Guidelines

### For Agent Developers

When creating new agents:

1. **Define Validation Rules** - Specify input, output, and process validation
2. **Establish Truth Integration** - Define how agent interacts with truth schemas
3. **Set Behavioral Constraints** - Define autonomy level and constraints
4. **Create Quality Gates** - Define validation gates for agent workflow
5. **Link to Test Datasets** - Validate agent behavior with test datasets

### For Agent Operators

When deploying agents:

1. **Review Validation Rules** - Understand what agent validates
2. **Configure Constraints** - Set autonomy level appropriately
3. **Enable Monitoring** - Set up metrics and alerts
4. **Audit Trail** - Ensure audit logging is enabled
5. **Evidence Collection** - Configure evidence storage

### For Validator Agent

When validating other agents:

1. **Check Metadata** - Verify agent metadata is complete
2. **Validate Rules** - Ensure validation rules are sufficient
3. **Test Behavior** - Execute agent with test datasets
4. **Verify Evidence** - Confirm agent produces required evidence
5. **Monitor Compliance** - Track agent adherence to rules

---

## Examples

### Oracle Agent Metadata

```yaml
metadata:
  agent_id: AGENT-ORACLE-001
  agent_name: Oracle Agent
  version: 1.0.0
  created_date: 2025-10-04T00:00:00Z
  status: active

agent_profile:
  type: truth_keeper
  category: oracle

  description: Maintains domain truth as the immutable source of truth
  purpose: Establish and validate domain requirements empirically
  scope:
    - Domain truth creation and maintenance
    - Requirement validation
    - Truth consistency verification

  capabilities:
    - capability_id: CAP-001
      name: Domain Truth Creation
      description: Create and maintain domain-truth.yaml
      automation_level: semi_automated

    - capability_id: CAP-002
      name: Truth Validation
      description: Validate domain truth with test datasets
      automation_level: fully_automated

truth_integration:
  primary_truth_sources:
    - schema_type: domain_truth
      schema_path: bmad-core/schemas/truth/domain-truth.schema.md
      usage: Creates and maintains
      required: true

  truth_creation:
    can_create: true
    creates: [domain_truth, eval_criteria]
    validation_required: true
    approval_required: true
    approvers: [Product Manager, Tech Lead]

  truth_validation:
    validates: [domain_truth]
    validation_method: Test dataset execution
    test_dataset_usage: true
    evidence_required: true

  truth_consumption:
    consumes: [analyst_research]
    must_trace_to: [business_requirements, domain_research]
    validation_frequency: real_time

validation_rules:
  input_validation:
    - rule_id: VAL-ORACLE-001
      name: Business Requirement Validation
      description: Validate business requirements are complete and testable
      validation_type: completeness

      validation_logic: |
        1. Check all requirements have acceptance criteria
        2. Verify acceptance criteria are measurable
        3. Ensure requirements are testable
      error_handling: Request clarification from PM
      blocking: true

      test_dataset_id: TEST-ORACLE-VAL-001

  output_validation:
    - rule_id: VAL-ORACLE-002
      name: Domain Truth Completeness
      description: Ensure domain truth has test datasets for all rules
      must_satisfy:
        - Every domain rule has at least one test dataset
        - Every FR has acceptance criteria
        - All concepts have invariants defined

      validation_checks:
        - Test dataset coverage >= 100%
        - Acceptance criteria defined for all FRs
        - Invariants validated with tests

      evidence_type: test_results
      evidence_location: test-results/domain-validation/

  consistency_rules:
    - rule_id: CONS-ORACLE-001
      description: Domain truth must be consistent with eval criteria
      scope: [domain_truth, eval_criteria]

      validation_query: |
        SELECT dt.rule_id
        FROM domain_truth dt
        LEFT JOIN eval_criteria ec ON dt.rule_id = ANY(ec.validates.domain_rule_ids)
        WHERE ec.dataset_id IS NULL

      resolution_strategy: Create missing test datasets

  traceability_rules:
    - rule_id: TRACE-ORACLE-001
      description: All domain rules must trace to business requirements
      from_artifact: domain_truth.domain_rules
      to_artifact: business_requirements

      required_links: [business_requirement_id]
      validation_method: Link validation query
      evidence_required: true

behavioral_constraints:
  autonomy_level:
    level: semi_autonomous
    description: Oracle can create domain truth but requires approval

    can_execute_without_approval:
      - Draft domain truth
      - Create test datasets
      - Validate existing domain truth

    requires_approval:
      - Finalize domain truth
      - Publish domain truth as immutable
      - Modify approved domain truth

    approval_workflow: PM approval → Tech Lead review → Publish

  decision_making:
    decision_framework: Empirical validation driven
    decision_criteria:
      - Is requirement testable?
      - Can we create a test dataset?
      - Does test prove requirement?

    escalation_triggers:
      - Cannot make requirement testable
      - Conflicting requirements detected
      - Approval timeout exceeded

    escalation_path: [Product Manager, Tech Lead, Engineering Manager]

    decision_logging: true
    decision_evidence_required: true

agent_workflows:
  primary_workflows:
    - workflow_id: WF-ORACLE-001
      name: Domain Truth Creation
      description: Create domain truth from business requirements
      trigger: manual

      phases:
        - phase_id: PHASE-1
          name: Requirement Analysis
          order: 1

          steps:
            - step_id: STEP-1-1
              name: Extract Domain Concepts
              action: Analyze business requirements to extract domain concepts
              validation_rule_ids: [VAL-ORACLE-001]

              inputs_required: [business_requirements, domain_research]
              outputs_produced: [domain_concepts]

              success_criteria: [All concepts identified, Concepts are testable]
              failure_handling: Request clarification from PM

            - step_id: STEP-1-2
              name: Define Domain Rules
              action: Extract and formalize domain rules
              validation_rule_ids: [VAL-ORACLE-001]

              inputs_required: [domain_concepts, business_logic]
              outputs_produced: [domain_rules]

              success_criteria: [All rules testable, Rules have examples]
              failure_handling: Work with PM to refine rules

          validation_gate:
            gate_id: GATE-1
            criteria:
              - All concepts defined
              - All rules testable
              - Approval from PM
            approval_required: true

        - phase_id: PHASE-2
          name: Test Dataset Creation
          order: 2

          steps:
            - step_id: STEP-2-1
              name: Create Test Datasets
              action: Create test datasets for each domain rule
              validation_rule_ids: [VAL-ORACLE-002]

              inputs_required: [domain_rules]
              outputs_produced: [test_datasets]

              success_criteria: [100% rule coverage, All tests executable]
              failure_handling: Refine rule or create additional tests

          validation_gate:
            gate_id: GATE-2
            criteria:
              - All rules have test datasets
              - All tests pass
              - Coverage >= 100%
            approval_required: false

        - phase_id: PHASE-3
          name: Domain Truth Finalization
          order: 3

          steps:
            - step_id: STEP-3-1
              name: Link to Eval Criteria
              action: Link domain truth to eval criteria
              validation_rule_ids: [CONS-ORACLE-001, TRACE-ORACLE-001]

              inputs_required: [domain_truth_draft, test_datasets]
              outputs_produced: [domain_truth_final, eval_criteria]

              success_criteria: [All links valid, Traceability complete]
              failure_handling: Fix missing links

            - step_id: STEP-3-2
              name: Publish Domain Truth
              action: Publish domain truth as immutable
              validation_rule_ids: [VAL-ORACLE-002]

              inputs_required: [domain_truth_final, approvals]
              outputs_produced: [domain_truth_published]

              success_criteria: [All validations pass, Approvals received]
              failure_handling: Address validation failures

          validation_gate:
            gate_id: GATE-3
            criteria:
              - All validation rules pass
              - Tech Lead approval
              - Traceability complete
            approval_required: true

      success_definition:
        - Domain truth created
        - All rules testable
        - All test datasets pass
        - Traceability established

monitoring_and_metrics:
  performance_metrics:
    - metric_name: Domain Truth Creation Time
      description: Time to create domain truth from requirements
      measurement_method: Workflow duration
      target_value: < 2 days
      alert_threshold: > 5 days

  quality_metrics:
    - metric_name: Test Dataset Coverage
      description: Percentage of domain rules with test datasets
      measurement_method: (rules with tests / total rules) * 100
      target_value: 100%

  validation_metrics:
    - metric_name: Domain Truth Validation Pass Rate
      description: Percentage of validation checks that pass
      measurement_method: (passed validations / total validations) * 100
      target_value: 100%

evidence_and_reporting:
  evidence_types:
    - type: test_results
      storage_location: test-results/oracle/
      retention_period: indefinite
      format: JSON

    - type: validation_proof
      storage_location: validation-proofs/oracle/
      retention_period: indefinite
      format: YAML

    - type: traceability_proof
      storage_location: traceability/oracle/
      retention_period: indefinite
      format: YAML

  report_generation:
    - report_type: validation_report
      generation_trigger: on_completion
      format: markdown
      distribution: [Product Manager, Tech Lead, Engineering Team]

linkage:
  related_agents: [Eval Agent, Validator Agent, PM Agent]
  invokes_agents: [Eval Agent]
  invoked_by_agents: [PM Agent, Analyst Agent]

  truth_schemas_used: [domain_truth, eval_criteria]
  test_datasets_used: [domain_validation]
  validation_rules_used: [VAL-ORACLE-001, VAL-ORACLE-002, CONS-ORACLE-001]
```

---

## Validation Rules Library

### Common Validation Rules for All Agents

#### Input Validation Rules
- Schema validation
- Completeness checks
- Format validation
- Semantic validation
- Consistency checks

#### Output Validation Rules
- Traceability verification
- Coverage analysis
- Quality gate checks
- Evidence generation
- Approval validation

#### Process Validation Rules
- Workflow compliance
- Checkpoint validation
- State consistency
- Error handling verification
- Rollback capability

---

## Related Documentation

- **Truth Schemas** - domain-truth.yaml, eval-criteria.yaml, etc.
- **Agent Workflows** - Detailed workflow specifications
- **Validation Infrastructure** - Validation tools and frameworks
- **Test Datasets** - Test datasets for agent validation

---

## Schema Validation

Agent metadata can be validated using:

- Schema validators
- Agent behavior tests
- Workflow simulation
- Validation rule execution
- Evidence verification
