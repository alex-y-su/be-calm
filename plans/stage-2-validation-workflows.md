# Stage 2: Validation Workflows

**Version:** 1.0
**Date:** 2025-10-04
**Implementation Phase:** Foundation (v5.0)
**Estimated Effort:** 4-6 weeks
**Prerequisites:** Stage 1 completed (Oracle, Eval, Validator, Compatibility agents operational)

---

## Overview

Stage 2 implements the complete truth-driven workflow state machine for both greenfield and brownfield projects. This includes all phases from domain research through development, with automated validation gates and empirical test execution.

---

## Workflow Phases

### Phase -1: Codebase Discovery (Brownfield Only)

```yaml
codebase_discovery:
  description: "BROWNFIELD ONLY - Establish existing system truth before domain research"
  agents: [compatibility, bmad-master, oracle, eval]
  critical: true

  purpose: |
    Extract canonical truth about the EXISTING codebase to:
    - Understand current architecture and patterns
    - Identify integration points and constraints
    - Create regression test baselines
    - Establish what CANNOT change vs what CAN change

  sequential_steps:
    - step: analyze_existing_codebase
      agent: bmad-master
      task: document-project
      outputs:
        - docs/existing-system-analysis.md
        - docs/tech-stack.md
        - docs/api-inventory.md
        - docs/architecture-current-state.md

    - step: extract_existing_patterns
      agent: compatibility
      task: analyze-existing-system
      analyzes:
        - Current architecture patterns
        - Existing constraints and limitations
        - Integration points (internal and external)
        - Tech stack capabilities and limitations
        - Performance baselines
        - Security patterns
        - Data models and schemas
      outputs:
        - existing-system-truth.yaml

    - step: oracle_validation
      agent: oracle
      mode: brownfield
      task: create-existing-truth
      validates: "Extracted facts are accurate"
      creates: "Canonical existing-system-truth.yaml"

    - step: create_regression_baselines
      agent: eval
      task: create-regression-dataset
      inputs: [existing-system-truth.yaml, api-inventory.md]
      outputs:
        - test-datasets/regression/api-behavior.json
        - test-datasets/regression/integration-points.json
        - test-datasets/regression/business-logic.json
        - test-datasets/regression/data-integrity.json

    - step: validate_regression_coverage
      agent: eval
      validates: "100% of integration points have regression tests"
      blocking: true

  exit_conditions:
    - existing_codebase_fully_documented
    - existing_patterns_extracted_and_validated
    - regression_test_baselines_created
    - integration_points_mapped
    - constraints_identified
    - oracle_validation_passed
    - 100%_integration_point_test_coverage

  auto_transition:
    next_state: domain_research
    message: "✓ Existing system truth established. Proceeding to domain research with compatibility awareness."

  human_checkpoint:
    required: true
    purpose: "Review existing-system-truth.yaml for accuracy"
    question: "Does this accurately represent the current system constraints and capabilities?"
```

**Implementation Tasks:**
- [ ] Create Phase -1 workflow orchestrator
- [ ] Implement BMad Master integration for codebase documentation
- [ ] Build Compatibility agent existing system analysis
- [ ] Create Oracle brownfield validation mode
- [ ] Implement Eval regression dataset generation
- [ ] Build integration point coverage validator
- [ ] Create human checkpoint UI
- [ ] Implement auto-transition logic to Phase 0

---

### Phase 0: Domain Research (Truth Foundation)

```yaml
domain_research:
  agents: [domain-researcher, oracle]

  parallel_execution:
    primary:
      agent: domain-researcher
      task: research-domain-context
      outputs: [domain-analysis.md]

    background:
      agent: oracle
      task: create-domain-truth
      inputs: [domain-analysis.md]
      outputs: [domain-truth.yaml]

  truth_artifacts:
    domain-truth.yaml:
      canonical_facts: []
      constraints: []
      domain_examples: []
      success_criteria: []
      terminology: {}

  exit_conditions:
    - domain_analysis_complete
    - oracle_truth_established
    - domain_examples_documented

  auto_transition:
    next_state: eval_foundation
    message: "Domain truth established. Creating empirical validation datasets..."
```

**Implementation Tasks:**
- [ ] Create Phase 0 workflow orchestrator
- [ ] Implement Analyst (domain-researcher) → Oracle integration
- [ ] Build parallel execution framework (primary + background)
- [ ] Create domain-truth.yaml generator from domain-analysis.md
- [ ] Implement exit condition validator
- [ ] Build auto-transition to Phase 1

---

### Phase 1: Eval Foundation (Test-First)

```yaml
eval_foundation:
  description: "Create test datasets BEFORE requirements - establish empirical truth"
  agents: [eval, oracle, validator]
  critical: true

  prerequisites:
    - domain-truth.yaml must exist
    - domain-analysis.md validated

  sequential_steps:
    - step: create_domain_test_cases
      agent: eval
      task: create-eval-dataset
      inputs: [domain-truth.yaml, domain-analysis.md]
      outputs:
        - test-datasets/domain-examples.json
        - test-datasets/constraint-tests.yaml
        - test-datasets/edge-cases.json

    - step: validate_test_coverage
      agent: validator
      task: validate-dataset-integrity
      validates: "all domain facts have test cases"
      blocking: true

    - step: oracle_approval
      agent: oracle
      validates: "test datasets match domain truth"
      checkpoint: critical

  truth_artifacts:
    eval-criteria.yaml:
      domain_tests:
        - test_id: "DOM-001"
          description: "User login with valid credentials"
          input: {username: "test", password: "pass123"}
          expected_output: {success: true, token: "<valid_jwt>"}
          source: "domain-truth.yaml#authentication"

      constraint_tests:
        - test_id: "CON-001"
          description: "Max file size is 10MB"
          input: {file_size: 11000000}
          expected_output: {error: "File too large"}
          source: "domain-truth.yaml#constraints"

  exit_conditions:
    - all_domain_facts_have_tests
    - test_datasets_validated
    - oracle_approved
    - coverage_threshold: 100%  # Every domain fact must have test

  auto_transition:
    next_state: discovery  # or compatibility_analysis if brownfield
    message: "✓ Empirical truth established. All code must pass these tests."
```

**Implementation Tasks:**
- [ ] Create Phase 1 workflow orchestrator
- [ ] Implement Eval test dataset generation from domain-truth.yaml
- [ ] Build Validator dataset integrity checker (100% coverage requirement)
- [ ] Create Oracle test dataset validation
- [ ] Implement critical checkpoint system
- [ ] Build eval-criteria.yaml generator
- [ ] Create auto-transition logic (greenfield vs brownfield path)

---

### Phase 1.5: Compatibility Analysis (Brownfield Only)

```yaml
compatibility_analysis:
  description: "BROWNFIELD ONLY - Validate domain requirements against existing system constraints"
  agents: [compatibility, oracle, validator, eval]
  critical: true

  purpose: |
    Determine if domain requirements can be met within existing system constraints.
    Create migration strategy for conflicts between domain truth and existing truth.

  prerequisites:
    - existing-system-truth.yaml must exist (from Phase -1)
    - domain-truth.yaml must exist (from Phase 0)
    - eval test datasets must exist (from Phase 1)

  parallel_analysis:
    - analysis: constraint_compatibility
      agent: compatibility
      task: validate-compatibility
      compares:
        - existing-system-truth.yaml constraints
        - domain-truth.yaml requirements
      identifies:
        - Compatible requirements (can implement without changes)
        - Conflicting requirements (existing vs domain mismatch)
        - Breaking changes required
        - Migration complexity

    - analysis: oracle_validation
      agent: oracle
      mode: brownfield
      validates:
        - Domain requirements against existing capabilities
        - Proposed changes against existing constraints
        - Terminology consistency across existing and domain
      blocks_if: "Irreconcilable conflict detected"

    - analysis: test_compatibility
      agent: eval
      validates:
        - Can new tests coexist with regression tests?
        - Are there test conflicts (same input, different expected output)?
        - Migration test scenarios feasible?

  sequential_steps:
    - step: identify_conflicts
      agent: compatibility
      outputs:
        - compatibility-conflicts.yaml

    - step: design_migration_strategy
      agent: compatibility
      task: analyze-migration-path
      for_each_conflict: true
      outputs:
        - migration-strategy.yaml

    - step: create_enhancement_truth
      agent: oracle
      mode: brownfield
      task: validate-enhancement
      inputs:
        - existing-system-truth.yaml
        - domain-truth.yaml
        - migration-strategy.yaml
      outputs:
        - enhancement-truth.yaml

    - step: validate_feasibility
      agent: validator
      validates:
        - All conflicts have migration strategies
        - Migration strategies are technically feasible
        - No irreconcilable conflicts exist
        - Traceability: existing → domain → enhancement
      blocking: true

    - step: create_migration_tests
      agent: eval
      task: create-migration-tests
      inputs: [enhancement-truth.yaml, migration-strategy.yaml]
      outputs:
        - test-datasets/migration/phase-1-tests.json
        - test-datasets/migration/phase-2-tests.json
        - test-datasets/migration/phase-3-tests.json

  exit_conditions:
    - all_conflicts_identified
    - all_conflicts_have_migration_strategies
    - enhancement_truth_created
    - oracle_validated_feasibility
    - validator_confirmed_traceability
    - migration_tests_created
    - no_irreconcilable_conflicts

  auto_transition:
    next_state: discovery
    message: "✓ Compatibility validated. Enhancement strategy established. Proceeding to requirements with migration awareness."

  human_checkpoint:
    required: true
    purpose: "Review migration strategy and approve breaking changes"
    questions:
      - "Is the migration strategy acceptable?"
      - "Are breaking changes justified and manageable?"
      - "Is the timeline realistic?"

  blocking_conditions:
    irreconcilable_conflict:
      action: "HALT workflow"
      message: "Domain requirement conflicts with existing system constraint. Human decision required: modify domain requirement OR accept major refactor."
```

**Implementation Tasks:**
- [ ] Create Phase 1.5 workflow orchestrator (brownfield-specific)
- [ ] Implement Compatibility conflict analyzer
- [ ] Build migration strategy generator
- [ ] Create Oracle brownfield enhancement validation
- [ ] Implement enhancement-truth.yaml generator
- [ ] Build Validator migration feasibility checker
- [ ] Create Eval migration test dataset generator
- [ ] Implement human checkpoint with multi-question support
- [ ] Build blocking condition handler (irreconcilable conflicts)

---

### Phase 2: Discovery (Requirements Validated)

```yaml
discovery:
  agents: [analyst, pm, oracle, validator, eval]

  truth_validation:
    every_requirement_must:
      - trace_to_domain_fact: true
      - have_eval_test: true
      - pass_oracle_validation: true

  sequential_steps:
    - step: create_brief
      agent: analyst
      task: create-project-brief

      validation:
        agent: oracle
        checks:
          - "All features trace to domain-truth.yaml"
          - "No invented features outside domain"
          - "Terminology matches domain vocabulary"
        blocking: true

    - step: create_prd
      agent: pm
      task: create-prd

      parallel_validation:
        - agent: oracle
          validates: "consistency with domain truth"

        - agent: eval
          task: generate-functional-test-data
          creates: "test-datasets/functional-tests.json"
          validates: "every FR has executable test"

        - agent: validator
          validates: "PRD ↔ domain-truth traceability"

  truth_artifacts:
    requirements-truth-map.yaml:
      FR-001:
        description: "User authentication"
        domain_source: "domain-truth.yaml#authentication"
        eval_tests: ["DOM-001", "DOM-002"]
        oracle_validated: true

  exit_conditions:
    - prd_complete
    - 100%_requirements_traced_to_domain
    - all_FRs_have_eval_tests
    - oracle_validation_passed
    - validator_consistency_check_passed
```

**Implementation Tasks:**
- [ ] Create Phase 2 workflow orchestrator
- [ ] Implement Analyst → Oracle validation integration
- [ ] Build PM → Oracle + Eval + Validator parallel validation
- [ ] Create requirements-truth-map.yaml generator
- [ ] Implement 100% traceability validator
- [ ] Build eval functional test generator for each FR
- [ ] Create Oracle consistency checker for PRD

---

### Phase 3: Architecture (Design Validated)

```yaml
architecture:
  agents: [architect, oracle, validator, eval, monitor]

  truth_validation:
    architecture_decisions_must:
      - align_with_domain_constraints: true
      - support_eval_test_execution: true
      - pass_oracle_consistency_check: true

  sequential_steps:
    - step: create_architecture
      agent: architect
      task: create-architecture

      parallel_validation:
        - agent: oracle
          validates:
            - "Tech stack supports domain constraints"
            - "Architecture enables eval test execution"
            - "No contradictions with domain truth"

        - agent: eval
          task: generate-integration-test-data
          creates: "test-datasets/integration-tests.json"
          validates: "architecture supports all eval scenarios"

        - agent: validator
          validates:
            - "Architecture ↔ PRD consistency"
            - "Architecture ↔ domain-truth alignment"
            - "All NFRs addressable"

        - agent: monitor
          task: create-architecture-health-baseline
          creates: "baselines/architecture-metrics.yaml"

  truth_artifacts:
    architecture-truth-map.yaml:
      component_auth_service:
        implements: ["FR-001", "FR-002"]
        domain_constraint: "JWT with 15min expiry"
        eval_tests: ["INT-001", "INT-002"]
        oracle_validated: true

  exit_conditions:
    - architecture_complete
    - oracle_validation_passed
    - all_components_have_eval_tests
    - integration_test_datasets_created
    - monitor_baseline_established
    - validator_full_traceability_confirmed
```

**Implementation Tasks:**
- [ ] Create Phase 3 workflow orchestrator
- [ ] Implement Architect → Oracle validation (domain constraint compliance)
- [ ] Build Eval integration test dataset generator
- [ ] Create Validator architecture ↔ PRD consistency checker
- [ ] Implement Monitor baseline establishment
- [ ] Build architecture-truth-map.yaml generator

---

### Phase 4: Planning (Stories with Truth)

```yaml
planning:
  agents: [po, sm, eval, oracle, validator]

  truth_validation:
    every_story_must:
      - have_eval_acceptance_tests: true
      - trace_to_domain_truth: true
      - pass_oracle_consistency: true

  sequential_steps:
    - step: shard_with_truth
      agent: po
      task: shard-doc

      enhancement:
        inject_into_epics:
          - domain_truth_references
          - eval_test_ids
          - oracle_validation_status

    - step: create_stories_with_tests
      agent: sm
      task: create-next-story

      parallel_validation:
        - agent: eval
          task: generate-story-acceptance-tests
          for_each_story: true
          creates: "test-datasets/story-{id}-tests.json"

        - agent: oracle
          validates: "story aligns with domain truth"

        - agent: validator
          validates: "story ↔ epic ↔ PRD ↔ domain-truth chain"

  story_enhancement:
    every_story_includes:
      - section: "Truth References"
        content:
          - domain_facts: ["domain-truth.yaml#fact-123"]
          - eval_tests: ["test-datasets/story-2.3-tests.json"]
          - oracle_validation: "passed"
          - traceability_chain: "FR-001 → Epic-2 → Story-2.3"

      - section: "Acceptance Tests (Executable)"
        content: |
          # Auto-generated from eval agent
          Test ID: AC-2.3-001
          Input: {user_id: 123, action: "login"}
          Expected: {status: 200, token: "<jwt>"}
          Validation: Must pass eval test suite

  exit_conditions:
    - stories_created
    - 100%_stories_have_eval_tests
    - oracle_validated_all_stories
    - validator_confirmed_traceability
```

**Implementation Tasks:**
- [ ] Create Phase 4 workflow orchestrator
- [ ] Enhance PO sharding to inject truth references
- [ ] Implement SM story creation with embedded eval tests
- [ ] Build Eval story-level acceptance test generator
- [ ] Create Oracle story validation
- [ ] Implement Validator full traceability chain checker
- [ ] Build story template enhancement (truth references section)

---

### Phase 5: Development (Empirically Validated)

```yaml
development:
  agents: [dev, qa, eval, oracle, validator, monitor, reflection]

  truth_validation_continuous:
    before_story_start:
      - eval_tests_exist: true
      - oracle_truth_current: true
      - validator_baseline_established: true

    during_implementation:
      - monitor_tracks_drift: true
      - validator_checks_consistency: true

    before_story_complete:
      - eval_tests_pass: 100%
      - oracle_validates_implementation: true
      - validator_confirms_traceability: true

  parallel_execution:
    primary:
      agent: dev
      task: develop-story

    continuous_validation:
      - agent: eval
        mode: watch
        triggers: [file_save, commit]
        task: run-eval-tests
        blocks_commit_if: "tests_fail"

      - agent: oracle
        mode: watch
        triggers: [code_change]
        validates: "implementation matches domain truth"
        alerts_if: "semantic_drift_detected"

      - agent: validator
        mode: continuous
        validates:
          - "Code implements story requirements"
          - "Story traces to PRD"
          - "PRD traces to domain truth"
        creates: "validation-chain-proof.md"

      - agent: monitor
        mode: continuous
        tracks:
          - eval_test_pass_rate
          - domain_truth_alignment_score
          - code_quality_metrics
          - drift_indicators
        alerts_on:
          - eval_failures > threshold
          - drift_detected
          - quality_degradation

      - agent: qa
        mode: background
        supplements_eval_with:
          - exploratory_testing
          - nfr_validation
          - security_testing

    on_failure:
      agent: reflection
      triggers: [eval_test_fail, oracle_validation_fail]
      analyzes:
        - "Why did eval test fail?"
        - "Is domain truth wrong?"
        - "Is implementation wrong?"
        - "Is test wrong?"
      outputs: "failure-analysis.md"
      suggests: "correction_path"

  story_completion_gates:
    gate_0_regression:  # BROWNFIELD ONLY
      agent: eval
      mode: brownfield_only
      validates: "100% regression tests still pass (no existing functionality broken)"
      blocking: true
      critical: "MUST pass before any other gates"

    gate_1_eval:
      agent: eval
      validates: "100% eval tests pass (new functionality works)"
      blocking: true

    gate_2_oracle:
      agent: oracle
      validates: "implementation matches domain truth AND respects existing truth"
      mode: "dual_truth_validation"  # Brownfield validates both
      blocking: true

    gate_3_validator:
      agent: validator
      validates: "full traceability chain intact"
      blocking: true

    gate_4_monitor:
      agent: monitor
      validates: "no drift detected, metrics healthy, no performance degradation"
      blocking: true

    gate_5_compatibility:  # BROWNFIELD ONLY
      agent: compatibility
      mode: brownfield_only
      validates: "migration strategy adhered to, breaking changes documented"
      blocking: true

    gate_6_qa:
      agent: qa
      validates: "supplemental tests pass"
      blocking: true
```

**Implementation Tasks:**
- [ ] Create Phase 5 workflow orchestrator
- [ ] Implement Dev agent with continuous validation integration
- [ ] Build Eval watch mode (file save triggers)
- [ ] Create Oracle watch mode (code change semantic validation)
- [ ] Implement Validator continuous traceability checking
- [ ] Build Monitor continuous metrics tracking
- [ ] Create QA background supplemental testing
- [ ] Implement Reflection failure analysis
- [ ] Build 7-gate validation system (5 for greenfield, 7 for brownfield)
- [ ] Create validation-chain-proof.md generator
- [ ] Implement commit blocker when tests fail

---

## Workflow State Machine

### State Transitions

```yaml
workflow_state_machine:
  states:
    - codebase_discovery      # Brownfield Phase -1
    - domain_research         # Phase 0
    - eval_foundation         # Phase 1
    - compatibility_analysis  # Brownfield Phase 1.5
    - discovery              # Phase 2
    - architecture           # Phase 3
    - planning               # Phase 4
    - development            # Phase 5

  transitions:
    greenfield_path:
      - domain_research → eval_foundation
      - eval_foundation → discovery
      - discovery → architecture
      - architecture → planning
      - planning → development

    brownfield_path:
      - codebase_discovery → domain_research
      - domain_research → eval_foundation
      - eval_foundation → compatibility_analysis
      - compatibility_analysis → discovery
      - discovery → architecture
      - architecture → planning
      - planning → development

  transition_rules:
    automatic:
      - When all exit_conditions met
      - When validation gates pass
      - When agents approve

    blocking:
      - When critical validation fails
      - When human checkpoint required
      - When irreconcilable conflict detected
```

**Implementation Tasks:**
- [ ] Create workflow state machine engine
- [ ] Implement state persistence
- [ ] Build transition validator
- [ ] Create automatic transition logic
- [ ] Implement blocking condition handler
- [ ] Build state recovery system (resume from checkpoint)

---

## End-to-End Flow Examples

### Greenfield Flow Example

See original document Section "Example: End-to-End Truth-Driven Flow"

**Implementation Tasks:**
- [ ] Create greenfield flow integration test
- [ ] Implement example project generator
- [ ] Build flow validation test suite

### Brownfield Flow Example

See original document Section "Example 2: End-to-End Brownfield Flow"

**Implementation Tasks:**
- [ ] Create brownfield flow integration test
- [ ] Implement example existing codebase
- [ ] Build enhancement scenario test
- [ ] Create migration validation test

---

## Deliverables for Stage 2

### Workflow Orchestrators
- [ ] Phase -1: Codebase Discovery (brownfield)
- [ ] Phase 0: Domain Research
- [ ] Phase 1: Eval Foundation
- [ ] Phase 1.5: Compatibility Analysis (brownfield)
- [ ] Phase 2: Discovery
- [ ] Phase 3: Architecture
- [ ] Phase 4: Planning
- [ ] Phase 5: Development

### Workflow State Machine
- [ ] State machine engine
- [ ] State persistence system
- [ ] Transition validator
- [ ] Automatic transition logic
- [ ] Blocking condition handler
- [ ] Recovery system

### Validation Systems
- [ ] 100% traceability validator
- [ ] 100% test coverage validator
- [ ] 7-gate validation system (greenfield: 5 gates, brownfield: 7 gates)
- [ ] Continuous validation framework
- [ ] Commit blocker integration

### Documentation
- [ ] Workflow phase documentation
- [ ] State machine guide
- [ ] Validation gate documentation
- [ ] Greenfield workflow guide
- [ ] Brownfield workflow guide

---

## Testing & Validation

### Unit Tests
- [ ] Each phase orchestrator
- [ ] State transition logic
- [ ] Validation gate enforcement
- [ ] Checkpoint system

### Integration Tests
- [ ] Complete greenfield flow (Phase 0 → 5)
- [ ] Complete brownfield flow (Phase -1 → 5)
- [ ] State persistence and recovery
- [ ] Multi-agent parallel validation

### End-to-End Tests
- [ ] Greenfield pilot project
- [ ] Brownfield pilot project (enhancement)
- [ ] Validation chain proof generation
- [ ] All gates passing scenario
- [ ] Blocking scenario (gate failure)

---

## Success Criteria

- [ ] All 8 workflow phases implemented
- [ ] State machine operational
- [ ] Greenfield flow completes end-to-end
- [ ] Brownfield flow completes end-to-end
- [ ] All validation gates functional
- [ ] Human checkpoints working
- [ ] Blocking conditions properly halt workflow
- [ ] Validation chain proof generated successfully
- [ ] Continuous validation operational
- [ ] Documentation complete

---

## Next Stage

**Stage 3: Monitoring & Reflection**
- Monitor Agent implementation
- Reflection Agent implementation
- Continuous drift detection
- Learning loops
- Failure analysis
