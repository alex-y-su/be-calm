# Truth-Driven Autonomous AI Development

**Version:** 1.0
**Date:** 2025-10-04
**Status:** Planning

## Executive Summary

This plan transforms BMAD-METHOD from a human-orchestrated agent system into an autonomous, truth-driven AI development framework. The core innovation: **establish empirical, verifiable truth early** (via test datasets) that serves as the immutable source of truth throughout development, enabling AI agents to operate autonomously while remaining reliable and grounded.

### Key Principle
**Empirical Validation Over Document Trust** - AI trusts executable tests and validated facts, not just written documents which can be wrong, incomplete, or drift from reality.

---

## Problem Statement

### Current Limitations
1. **Manual Agent Switching** - Requires explicit `*agent`, `*exit` commands
2. **No Cross-Agent State Tracking** - Agents don't know project phase or progress
3. **Sequential, Blocking Workflows** - Everything waits for human intervention
4. **Reactive vs. Proactive Behavior** - Agents wait for commands
5. **Document-Based Truth** - AI trusts PRD/Architecture which can be incorrect
6. **No Empirical Validation** - "Sounds right" vs "Is right" gap

### Vision
AI agents that autonomously navigate development workflows, grounded in empirical truth, with minimal human intervention while maintaining reliability through continuous validation.

---

## New Agent Ecosystem

### Truth Keeper Agents

#### 0. Compatibility Agent - Brownfield Integration Specialist
```yaml
agent:
  name: "Compatibility"
  id: compatibility
  icon: 🔄
  role: "Existing System Integration & Migration Specialist"
  whenToUse: "BROWNFIELD projects - before domain research phase"

  responsibilities:
    - Analyzes existing codebase for current behavior
    - Extracts existing system truth (current architecture, patterns, constraints)
    - Validates backward compatibility of proposed changes
    - Designs migration strategies from current to target state
    - Identifies breaking changes and their impact
    - Creates compatibility validation rules

  operates:
    mode: "brownfield_only"
    phase: "pre_domain_research"
    validates: "every_change_proposal"

  outputs:
    - existing-system-truth.yaml (current state facts)
    - compatibility-analysis.md
    - breaking-changes.yaml
    - migration-strategy.yaml
    - compatibility-constraints.yaml

  commands:
    - analyze-existing-system: Extract truth from existing codebase
    - validate-compatibility: Check if change breaks existing functionality
    - validate-enhancement: Check if enhancement aligns with existing patterns
    - analyze-migration-path: Design evolution from current to target state
    - create-compatibility-rules: Generate validation rules for changes
```

#### 1. Oracle Agent - Domain Truth Maintainer (Enhanced for Brownfield)
```yaml
agent:
  name: "Oracle"
  id: oracle
  icon: 🔮
  role: "Domain Knowledge Authority & Consistency Guardian"

  responsibilities:
    - Maintains canonical domain knowledge base
    - Validates all artifacts against domain truth
    - Detects semantic drift across documents
    - Enforces consistent terminology and concepts
    - Provides authoritative answers to ambiguity
    - [BROWNFIELD] Maintains dual-truth mode (existing + domain)
    - [BROWNFIELD] Validates enhancement compatibility

  operates:
    mode: "always_on_background"
    validates: "every_artifact_creation"
    blocks: "inconsistent_changes"

  truth_modes:
    greenfield:
      sources: [domain-truth.yaml]
      validation: "domain alignment only"

    brownfield:
      sources:
        - existing-system-truth.yaml (what IS)
        - domain-truth.yaml (what SHOULD be)
        - enhancement-truth.yaml (what WILL change)
      validation: "domain + existing + compatibility"

  brownfield_validation_rules:
    - New features must align with domain-truth.yaml
    - Changes must not violate existing-system-truth.yaml constraints
    - All modifications must specify compatibility impact in enhancement-truth.yaml
    - Breaking changes require explicit migration strategy

  outputs:
    - domain-truth.yaml (canonical facts)
    - consistency-report.md
    - terminology-map.yaml
    - [BROWNFIELD] existing-system-truth.yaml
    - [BROWNFIELD] enhancement-truth.yaml
    - [BROWNFIELD] compatibility-validation.md

  commands:
    - create-domain-truth: Generate canonical truth from domain analysis
    - validate-artifact: Check artifact against domain truth
    - check-consistency: Verify cross-document consistency
    - update-truth: Handle domain truth evolution
    - [BROWNFIELD] create-existing-truth: Extract truth from current codebase
    - [BROWNFIELD] validate-compatibility: Check if change breaks existing system
    - [BROWNFIELD] validate-enhancement: Validate proposed enhancement
    - [BROWNFIELD] analyze-migration-path: Design evolution strategy
```

#### 2. Eval Agent - Empirical Truth Creator (Enhanced for Brownfield)
```yaml
agent:
  name: "Eval"
  id: eval
  icon: 🧪
  role: "Test Dataset Creator & Empirical Validator"
  whenToUse: "IMMEDIATELY after domain research - before any code"

  responsibilities:
    - Creates test datasets from domain analysis
    - Defines acceptance criteria as executable tests
    - Validates code against empirical truth
    - Prevents "sounds right" vs "is right" gap
    - [BROWNFIELD] Generates regression test datasets from existing behavior
    - [BROWNFIELD] Creates compatibility test suites
    - [BROWNFIELD] Validates migration paths

  critical_timing:
    - [BROWNFIELD] Phase -1: After codebase analysis (create regression tests)
    - Phase 1: After domain research (create domain test cases)
    - Phase 2: After PRD (create functional test datasets)
    - Phase 3: After architecture (create integration test datasets)
    - [BROWNFIELD] Phase 3.5: After migration strategy (create migration tests)
    - Phase 4: During dev (validate against all datasets)

  test_categories:
    greenfield:
      - domain_tests: "Validate domain requirements"
      - functional_tests: "Validate functional requirements"
      - integration_tests: "Validate component integration"
      - story_tests: "Validate story acceptance"

    brownfield:
      - regression_tests: "Ensure existing functionality remains intact"
      - enhancement_tests: "Validate new functionality"
      - compatibility_tests: "Validate old + new work together"
      - migration_tests: "Validate transition from old to new"

  brownfield_test_sources:
    - existing-system-truth.yaml → regression test datasets
    - domain-truth.yaml → enhancement test datasets
    - enhancement-truth.yaml → migration test datasets

  outputs:
    - test-datasets/ (CSV, JSON test data)
    - eval-criteria.yaml (pass/fail conditions)
    - validation-report.md
    - [BROWNFIELD] test-datasets/regression/ (existing behavior tests)
    - [BROWNFIELD] test-datasets/compatibility/ (integration tests)
    - [BROWNFIELD] test-datasets/migration/ (transition tests)

  commands:
    - create-eval-dataset: Generate test data from domain truth
    - generate-functional-test-data: Create FR acceptance tests
    - generate-integration-test-data: Create component integration tests
    - generate-story-acceptance-tests: Create story-level tests
    - run-eval-tests: Execute test suite validation
    - validate-dataset-integrity: Verify test coverage
    - [BROWNFIELD] create-regression-dataset: Generate from existing behavior
    - [BROWNFIELD] create-compatibility-tests: Test old + new together
    - [BROWNFIELD] create-migration-tests: Test upgrade path
    - [BROWNFIELD] validate-no-regression: Ensure existing tests still pass
```

#### 3. Validator Agent - Continuous Validation Engine
```yaml
agent:
  name: "Validator"
  id: validator
  icon: ✅
  role: "Real-time Artifact Validation Specialist"

  responsibilities:
    - Validates every artifact against Oracle truth
    - Runs eval datasets against code continuously
    - Checks requirements traceability
    - Ensures bidirectional consistency (code ↔ docs)

  operates:
    mode: "background_continuous"
    triggers: ["file_save", "commit", "artifact_update"]

  validation_types:
    - semantic: "Does this match domain truth?"
    - empirical: "Does this pass eval tests?"
    - consistency: "Does this align with other artifacts?"
    - completeness: "Are all requirements traceable?"

  outputs:
    - validation-chain-proof.md
    - traceability-matrix.yaml
    - consistency-report.md

  commands:
    - validate-artifact: Check artifact validity
    - validate-traceability: Verify requirement chain
    - validate-consistency: Check cross-artifact alignment
    - create-traceability-proof: Generate evidence chain
```

#### 4. Monitor Agent - Drift Detection & Metrics
```yaml
agent:
  name: "Monitor"
  id: monitor
  icon: 📊
  role: "Drift Detection & Health Metrics Specialist"

  responsibilities:
    - Tracks deviation from source of truth
    - Measures code quality metrics
    - Detects architectural drift
    - Alerts on threshold violations

  monitors:
    - domain_drift: "Are we still solving the right problem?"
    - requirement_drift: "Do PRD and code still align?"
    - test_coverage: "Are we validating everything?"
    - quality_metrics: "Is code quality degrading?"

  outputs:
    - drift-alerts.md
    - health-dashboard.yaml
    - trend-analysis.md
    - baselines/architecture-metrics.yaml

  commands:
    - track-drift: Monitor deviation from truth
    - measure-health: Assess project health metrics
    - create-baseline: Establish metric baseline
    - analyze-trends: Identify patterns over time
```

#### 5. Reflection Agent - Learning & Improvement
```yaml
agent:
  name: "Reflection"
  id: reflection
  icon: 🪞
  role: "Meta-Analysis & Learning Specialist"

  responsibilities:
    - Reviews decisions against outcomes
    - Learns from eval failures
    - Identifies improvement patterns
    - Updates agent strategies

  operates:
    triggers: ["story_complete", "sprint_end", "eval_failure"]

  outputs:
    - lessons-learned.md
    - pattern-library.yaml
    - agent-improvements.md
    - improvement-recommendations.md

  commands:
    - analyze-failure: Root cause analysis of failures
    - extract-lessons: Capture learnings from sprint
    - suggest-improvements: Recommend process enhancements
    - update-strategies: Evolve agent behaviors
```

---

## Truth-Driven Workflow State Machine

### BROWNFIELD-SPECIFIC PHASES

#### Phase -1: Codebase Discovery (Brownfield Only)

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

  truth_artifacts:
    existing-system-truth.yaml:
      architecture_facts:
        - fact_id: "EXIST-001"
          category: "architecture"
          fact: "REST API built with Express.js v4.18"
          constraint: "Cannot migrate frameworks without major version"
          migration_cost: "high"

        - fact_id: "EXIST-002"
          category: "authentication"
          fact: "JWT authentication with 30min expiry"
          constraint: "Active sessions depend on this timing"
          migration_cost: "medium"

      integration_points:
        - point_id: "INT-001"
          type: "external_api"
          name: "Stripe Payment Processing"
          version: "v2"
          criticality: "high"
          cannot_change: true

        - point_id: "INT-002"
          type: "database"
          name: "PostgreSQL with Sequelize ORM"
          version: "14.x"
          criticality: "high"
          schema_migration_required: true

      constraints:
        - constraint_id: "CON-001"
          type: "compatibility"
          rule: "Must maintain API backward compatibility"
          rationale: "Mobile apps in production depend on v1 API"

        - constraint_id: "CON-002"
          type: "data"
          rule: "Cannot drop existing database columns"
          rationale: "Legacy data migration unfeasible"

      performance_baselines:
        - metric: "API response time (p95)"
          current_value: "200ms"
          acceptable_degradation: "10%"

        - metric: "Database query time (avg)"
          current_value: "50ms"
          acceptable_degradation: "5%"

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

**Key Innovation:** Establishes immutable facts about existing system BEFORE domain research, preventing incompatible requirements.

---

### GREENFIELD & BROWNFIELD PHASES

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

**Key Innovation:** Oracle extracts canonical facts from domain research into structured, queryable truth base.

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
    next_state: discovery
    message: "✓ Empirical truth established. All code must pass these tests."
```

**Key Innovation:** Test datasets created BEFORE requirements. This becomes the immutable source of truth.

---

#### Phase 1.5: Compatibility Analysis (Brownfield Only)

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
      example_output: |
        conflicts:
          - conflict_id: "CONF-001"
            existing: "JWT expiry 30min (EXIST-002)"
            domain: "JWT expiry 15min (FACT-001)"
            type: "breaking_change"
            impact: "Will invalidate existing user sessions"
            migration_required: true

    - step: design_migration_strategy
      agent: compatibility
      task: analyze-migration-path
      for_each_conflict: true
      outputs:
        - migration-strategy.yaml
      example_output: |
        migration_strategies:
          - conflict_id: "CONF-001"
            strategy: "Gradual Migration"
            phases:
              - phase_1: "Add refresh token endpoint (new capability)"
              - phase_2: "Support both 30min and 15min tokens (transition)"
              - phase_3: "Deprecate 30min tokens (cleanup)"
            timeline: "3 sprints"
            risk: "medium"

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
      content: |
        # What WILL change (reconciliation of existing + domain)
        enhancements:
          - enhancement_id: "ENH-001"
            what_changes: "JWT token expiry"
            from_value: "30min"
            to_value: "15min"
            migration_strategy: "CONF-001"
            breaking_change: true
            backward_compatible_period: "3 months"

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

  truth_artifacts:
    enhancement-truth.yaml:
      purpose: "Reconciles existing-system-truth with domain-truth"
      structure:
        compatible_enhancements: "Domain requirements that align with existing system"
        conflicting_enhancements: "Require migration strategy"
        breaking_changes: "Impact existing behavior"
        migration_phases: "Sequenced implementation plan"

    compatibility-analysis.md:
      sections:
        - compatibility_matrix: "Which domain requirements are compatible?"
        - conflict_analysis: "Where do existing and domain clash?"
        - migration_roadmap: "How to evolve from current to target state"
        - risk_assessment: "What could go wrong during migration?"

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

**Key Innovation:** Prevents incompatible requirements from reaching PRD. All conflicts identified and resolved with migration strategy BEFORE development planning.

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

**Key Innovation:** Requirements cannot proceed without tracing to domain truth AND having eval tests.

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

**Key Innovation:** Architecture must demonstrably support all eval test scenarios and domain constraints.

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

**Key Innovation:** Stories are self-contained with embedded eval tests and truth references.

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
      validates: "full traceability chain intact (domain → code for greenfield, existing → enhancement → code for brownfield)"
      blocking: true

    gate_4_monitor:
      agent: monitor
      validates: "no drift detected, metrics healthy, no performance degradation from baseline"
      blocking: true

    gate_5_compatibility:  # BROWNFIELD ONLY
      agent: compatibility
      mode: brownfield_only
      validates: "migration strategy adhered to, breaking changes documented, backward compatibility maintained per plan"
      blocking: true

    gate_6_qa:
      agent: qa
      validates: "supplemental tests pass"
      blocking: true

  truth_artifacts:
    story-truth-proof.md:
      story_id: "2.3"
      domain_truth_source: "domain-truth.yaml#authentication"
      existing_system_source: "[BROWNFIELD] existing-system-truth.yaml#authentication"
      enhancement_source: "[BROWNFIELD] enhancement-truth.yaml#ENH-001"

      regression_tests_status:  # BROWNFIELD
        - REG-001: PASS (existing login still works)
        - REG-002: PASS (30min tokens still valid during transition)
        - REG-003: PASS (existing API endpoints unchanged)

      eval_tests_status:
        - AC-2.3-001: PASS (15min token generation)
        - AC-2.3-002: PASS (refresh token endpoint)

      migration_tests_status:  # BROWNFIELD
        - MIG-001: PASS (both 15min and 30min tokens accepted)
        - MIG-002: PASS (refresh flow works)

      oracle_validation:
        greenfield: PASS
        brownfield: PASS (domain + existing truth validated)

      validator_traceability:
        greenfield: VERIFIED (domain → code)
        brownfield: VERIFIED (existing → enhancement → code)

      compatibility_validation:  # BROWNFIELD
        backward_compatible: VERIFIED
        migration_phase: "Phase 1 of 3"
        breaking_changes: DOCUMENTED

      monitor_health: GREEN
      performance_baseline: NO_DEGRADATION

      qa_assessment: PASS

      empirical_proof:
        greenfield: "Code demonstrably implements domain truth"
        brownfield: "Code demonstrably implements domain truth WHILE preserving existing functionality and following migration strategy"
```

**Key Innovation:**
- Greenfield: 5-gate validation ensures code is empirically proven correct
- Brownfield: 7-gate validation ensures code is correct AND preserves existing system integrity

### Phase 6: Continuous Reflection

```yaml
continuous_reflection:
  agent: reflection
  mode: always_on

  triggers:
    - every_story_complete
    - every_eval_failure
    - every_sprint_end
    - on_domain_truth_update

  analyzes:
    - eval_failure_patterns
    - oracle_validation_trends
    - validator_consistency_issues
    - monitor_drift_causes

  learns:
    - "Which requirements were unclear?"
    - "Which domain facts were missing?"
    - "Which tests were most valuable?"
    - "Which agents need improvement?"

  outputs:
    - improvement-recommendations.md
    - agent-tuning-suggestions.yaml
    - domain-truth-updates.md
    - process-optimizations.md

  feedback_loop:
    updates:
      - oracle: "Enhanced domain truth"
      - eval: "Improved test coverage"
      - validator: "Stricter validation rules"
      - monitor: "Better drift detection"
```

---

## Truth Propagation System

### Truth Hierarchy

#### Greenfield Truth Hierarchy
```yaml
greenfield_truth_hierarchy:
  level_0_immutable:
    - domain-truth.yaml (what domain requires)
    - eval-criteria.yaml (how to validate domain)

  level_1_derived:
    - prd.md (must trace to level_0)
    - architecture.md (must trace to level_0)

  level_2_implementation:
    - stories (must trace to level_1)
    - code (must pass level_0 tests)
```

#### Brownfield Truth Hierarchy
```yaml
brownfield_truth_hierarchy:
  level_0_immutable:
    - existing-system-truth.yaml (what IS - current state)
    - domain-truth.yaml (what SHOULD be - domain requirements)
    - regression-test-datasets/ (how to validate existing behavior)

  level_0.5_reconciliation:
    - enhancement-truth.yaml (what WILL change - reconciliation)
    - compatibility-constraints.yaml (what CANNOT change)
    - migration-strategy.yaml (HOW to evolve from IS to SHOULD)
    - migration-test-datasets/ (how to validate transition)

  level_1_derived:
    - prd.md (must trace to level_0 AND respect level_0.5)
    - architecture.md (must trace to level_0 AND provide migration path)

  level_2_implementation:
    - stories (must trace to level_1 AND include compatibility checks)
    - code (must pass regression tests + new tests + migration tests)

  validation_chain:
    - Code must NOT break existing-system-truth
    - Code must IMPLEMENT domain-truth where compatible
    - Code must FOLLOW migration-strategy for conflicts
    - All changes must TRACE through enhancement-truth
```

### Validation Chain

```yaml
validation_chain:
  forward_validation:
    domain_truth → eval_tests → requirements → architecture → stories → code

  backward_validation:
    code → eval_tests_pass → story_complete → epic_done → PRD_implemented → domain_truth_realized

  continuous_validation:
    - Every artifact change triggers validator
    - Oracle checks semantic consistency
    - Monitor tracks drift from truth
    - Eval tests provide empirical proof
```

### Truth Update Protocol

```yaml
truth_update_protocol:
  when_domain_truth_changes:
    - Oracle marks affected artifacts
    - Validator re-validates entire chain
    - Eval updates test datasets
    - Monitor tracks ripple effects
    - Reflection analyzes impact
    - Agents auto-update affected work

  when_eval_test_fails:
    - Reflection analyzes: code wrong OR truth wrong OR test wrong?
    - Oracle validates domain truth accuracy
    - Validator checks requirement alignment
    - Decision tree:
      - If truth wrong → Update domain-truth.yaml → Cascade updates
      - If code wrong → Dev fixes implementation
      - If test wrong → Eval updates test dataset
```

---

## Autonomous Orchestration

### Agent Orchestration Rules

```yaml
orchestration_rules:

  never_proceed_without:
    - oracle_validation
    - eval_test_coverage
    - validator_traceability

  auto_blocking_conditions:
    - eval_tests_failing
    - oracle_validation_failed
    - validator_traceability_broken
    - monitor_drift_alert

  auto_recovery_flow:
    - Agent detects issue
    - Reflection analyzes root cause
    - Oracle determines truth status
    - Validator identifies affected artifacts
    - Monitor assesses impact
    - Orchestrator routes to correct agent
    - Eval validates resolution

  parallel_truth_validation:
    every_artifact_creation:
      - Primary agent creates artifact
      - Oracle validates (background)
      - Validator checks consistency (background)
      - Eval creates tests (background)
      - Monitor establishes baseline (background)
      - All must pass before artifact "complete"
```

### Autonomous Decision Making

```yaml
autonomous_decision_making:
  dev_agent:
    can_auto_proceed_when:
      - eval_tests_pass: true
      - oracle_validated: true
      - validator_traceability_confirmed: true
      - monitor_health_green: true

  pm_agent:
    can_auto_create_requirements_when:
      - traces_to_domain_truth: true
      - eval_tests_generated: true
      - oracle_approved: true

  architect_agent:
    can_auto_design_when:
      - domain_constraints_satisfied: true
      - eval_test_scenarios_supported: true
      - oracle_consistency_verified: true
```

---

## Example: End-to-End Truth-Driven Flow

### 1. Domain Research
```
Domain Researcher: "Let's understand the domain..."
→ Creates domain-analysis.md

Oracle (background): "Creating canonical domain truth..."
→ Creates domain-truth.yaml with FACTS:
  - authentication_method: "JWT"
  - token_expiry: "15min"
  - max_file_size: "10MB"
  - supported_formats: ["jpg", "png", "pdf"]
```

### 2. Eval Foundation (NEW PHASE!)
```
Eval: "Creating test datasets from domain truth..."
→ Generates 50 test cases from domain facts:
  - DOM-001: Login with valid credentials
  - DOM-002: Token expires after 15min
  - DOM-003: File upload with 11MB file (should fail)
  - DOM-004: Upload .exe file (should fail)

Validator: "Verifying 100% domain fact coverage..."
→ PASS: Every fact has test

Oracle: "Validating test datasets match truth..."
→ PASS: Tests are accurate

📊 SOURCE OF TRUTH ESTABLISHED:
   - 50 domain test cases
   - 100% fact coverage
   - Oracle validated
   - Immutable until domain changes
```

### 3. Discovery
```
PM: "Creating PRD..."
→ Writes FR-001: "User authentication"

Oracle (auto): "Checking FR-001 against domain truth..."
→ PASS: Traces to domain-truth.yaml#authentication

Eval (auto): "Creating functional tests for FR-001..."
→ Generates 10 test cases from FR-001

Validator (auto): "Verifying traceability chain..."
→ PASS: FR-001 → domain-truth.yaml#authentication → eval tests

✅ Requirement VALIDATED before proceeding
```

### 4. Architecture
```
Architect: "Designing auth service..."
→ Proposes JWT with 30min expiry

Oracle (auto): "❌ BLOCKED! Domain truth specifies 15min expiry"
→ Architect corrects to 15min

Eval (auto): "Creating integration tests..."
→ Generates token expiry test cases

Monitor (auto): "Establishing architecture baseline..."
→ Metrics captured

✅ Architecture EMPIRICALLY VALIDATED
```

### 5. Development
```
SM: "Creating Story 1.1: Implement auth..."
→ Story includes eval test dataset

Dev: "Implementing auth endpoint..."
→ Writes code

Eval (watch): "Running eval tests on save..."
→ ❌ Test AC-1.1-003 FAILED: Token expiry 30min (expected 15min)

Dev: "Oops, fixing expiry..."
→ Updates to 15min

Eval (watch): "Re-running tests..."
→ ✅ All 10 eval tests PASS

Oracle (auto): "Validating implementation..."
→ ✅ Matches domain truth

Validator (auto): "Checking traceability..."
→ ✅ Code → Story → Epic → PRD → Domain Truth: VERIFIED

Monitor (auto): "Health check..."
→ ✅ No drift, metrics healthy

QA: "Running supplemental tests..."
→ ✅ Security tests pass

Reflection: "Story 1.1 complete. Learning: Domain truth caught error early."

✅ Story EMPIRICALLY PROVEN CORRECT
```

**Result:** Code is DEMONSTRABLY correct, not just "looks right"

---

## Example 2: End-to-End Brownfield Flow

### Phase -1: Codebase Discovery
```
BMad Master: "Analyzing existing codebase..."
→ Discovers Express.js API, PostgreSQL, JWT auth (30min expiry)
→ Creates docs/existing-system-analysis.md

Compatibility Agent: "Extracting existing system truth..."
→ Creates existing-system-truth.yaml with FACTS:
  - EXIST-001: "JWT auth with 30min expiry"
  - EXIST-002: "PostgreSQL with Sequelize ORM"
  - EXIST-003: "Stripe payment integration (cannot change)"

Oracle: "Validating existing truth extraction..."
→ PASS: Facts are accurate

Eval: "Creating regression test baselines..."
→ Generates 150 regression tests:
  - REG-001: Login with 30min token works
  - REG-002: Existing API endpoints unchanged
  - REG-003: Stripe integration functional

📊 EXISTING SYSTEM TRUTH ESTABLISHED:
   - 150 regression tests
   - 100% integration point coverage
   - Oracle validated
```

### Phase 0: Domain Research
```
Domain Researcher: "Industry best practice: JWT 15min expiry"

Oracle: "Creating domain-truth.yaml..."
→ FACT-D001: "JWT expiry should be 15min"

⚠️ POTENTIAL CONFLICT DETECTED:
   Existing: 30min (EXIST-001)
   Domain: 15min (FACT-D001)
```

### Phase 1: Eval Foundation
```
Eval: "Creating test datasets from domain truth..."
→ Generates 50 domain test cases:
  - DOM-001: Login with 15min token
  - DOM-002: Token expires after 15min
  - DOM-003: Refresh token flow
```

### Phase 1.5: Compatibility Analysis
```
Compatibility Agent: "Analyzing conflicts..."
→ CONFLICT IDENTIFIED: JWT expiry (30min vs 15min)
→ Impact: Breaking change - will invalidate active sessions
→ Migration strategy required

Compatibility Agent: "Designing migration strategy..."
→ Creates migration-strategy.yaml:
  Phase 1: Add refresh token endpoint (non-breaking)
  Phase 2: Support both 15min and 30min (transition)
  Phase 3: Deprecate 30min after 3 months

Oracle (brownfield mode): "Creating enhancement-truth.yaml..."
→ ENH-001: "Migrate from 30min to 15min tokens"
→ Migration: 3-phase gradual rollout
→ Breaking change: YES (mitigated by transition period)

Eval: "Creating migration test datasets..."
→ Generates migration tests:
  - MIG-001: Phase 1 - refresh endpoint works
  - MIG-002: Phase 2 - both token types accepted
  - MIG-003: Phase 3 - only 15min tokens work

Validator: "Verifying migration feasibility..."
→ PASS: Strategy is sound

✅ COMPATIBILITY CHECKPOINT:
   Human review: "Accept 3-phase migration strategy?"
   User: "Approved"
```

### Phase 2: Discovery
```
PM: "Creating PRD..."
→ Writes FR-001: "Implement 15min JWT tokens with refresh"

Oracle (dual-truth mode): "Validating FR-001..."
→ ✅ Aligns with domain-truth (FACT-D001)
→ ✅ Respects existing-system-truth constraints
→ ✅ Follows enhancement-truth migration plan (ENH-001)

Eval: "Creating functional tests..."
→ Links to migration-strategy phases

Validator: "Checking traceability..."
→ ✅ existing → enhancement → FR-001 → domain: COMPLETE
```

### Phase 3: Architecture
```
Architect: "Designing refresh token service..."

Oracle (auto): "Validating architecture..."
→ ✅ Supports migration strategy
→ ✅ Maintains backward compatibility during transition

Monitor: "Establishing baseline metrics..."
→ Current: p95 response time 200ms
→ Acceptable degradation: 10% (220ms max)
```

### Phase 4: Development - Story 1.1 (Phase 1 of Migration)
```
SM: "Creating Story 1.1: Add refresh token endpoint"
→ Story includes:
  - Migration context: "Phase 1 of 3"
  - Compatibility: "Must not affect existing 30min tokens"
  - Tests: MIG-001 + regression tests

Dev: "Implementing refresh endpoint..."
→ Writes code

Eval (watch): "Running tests on save..."
→ ✅ REGRESSION TESTS: All 150 pass (Gate 0)
   - REG-001: PASS (existing login still works)
   - REG-002: PASS (30min tokens still valid)

→ ✅ MIGRATION TESTS: Phase 1 tests pass (Gate 1)
   - MIG-001: PASS (refresh endpoint works)

→ ✅ NEW FUNCTIONALITY: Enhancement tests pass
   - Refresh token generation works
   - Refresh flow functional

Oracle (dual-truth watch): "Validating implementation..."
→ ✅ Respects existing-truth (30min tokens unchanged)
→ ✅ Implements enhancement-truth (refresh added)
→ ✅ Aligns with domain-truth (preparing for 15min)

Validator (auto): "Checking traceability..."
→ ✅ Code → Story 1.1 → ENH-001 → EXIST-001 + FACT-D001: VERIFIED

Compatibility (auto): "Validating migration adherence..."
→ ✅ Phase 1 strategy followed
→ ✅ No breaking changes introduced
→ ✅ Backward compatibility maintained

Monitor (auto): "Performance check..."
→ ✅ Response time: 205ms (within 10% threshold)
→ ✅ No regression from baseline

QA: "Running supplemental tests..."
→ ✅ Security: Refresh token properly secured
→ ✅ Error handling: Edge cases covered

✅ STORY 1.1 COMPLETE - 7 GATES PASSED:
   Gate 0: Regression ✅ (existing functionality intact)
   Gate 1: Eval ✅ (new functionality works)
   Gate 2: Oracle ✅ (dual-truth validated)
   Gate 3: Validator ✅ (traceability verified)
   Gate 4: Monitor ✅ (no performance degradation)
   Gate 5: Compatibility ✅ (migration strategy followed)
   Gate 6: QA ✅ (supplemental tests pass)

📊 EMPIRICAL PROOF GENERATED:
   - 150 regression tests pass (no existing functionality broken)
   - 15 migration tests pass (Phase 1 complete)
   - 20 new feature tests pass (refresh works)
   - Performance within acceptable range
   - Backward compatibility maintained
   - Migration strategy Phase 1 validated
```

### Stories 1.2 and 1.3 (Phases 2 & 3)
```
[Similar rigorous validation continues through remaining migration phases...]
```

**Result:**
- Existing system integrity PROVEN (all regression tests pass)
- Domain requirement PROVEN implemented (all new tests pass)
- Migration strategy PROVEN followed (all migration tests pass)
- Zero regression, zero breaking changes, empirically validated enhancement

**Key Difference from Greenfield:**
- Greenfield: 5 gates validate "code matches domain truth"
- Brownfield: 7 gates validate "code matches domain truth WHILE preserving existing behavior"

---

## Implementation Roadmap

### Phase 1: Foundation (v5.0) - Q4 2025
**Duration:** 6-8 weeks

#### Week 1-2: Core Truth Infrastructure
- [ ] Create Oracle agent specification (with dual-truth mode)
- [ ] Implement domain-truth.yaml schema
- [ ] Implement existing-system-truth.yaml schema (brownfield)
- [ ] Implement enhancement-truth.yaml schema (brownfield)
- [ ] Build truth validation engine (greenfield + brownfield modes)
- [ ] Create truth propagation system
- [ ] Create Compatibility agent specification (brownfield)

#### Week 3-4: Eval Enhancement
- [ ] Enhance existing eval agent for test-first workflow
- [ ] Implement test dataset generation (domain tests)
- [ ] Implement regression test dataset generation (brownfield)
- [ ] Implement migration test dataset generation (brownfield)
- [ ] Create eval-criteria.yaml schema
- [ ] Build eval test execution engine (with brownfield gates)

#### Week 5-6: Validator Agent
- [ ] Create Validator agent specification
- [ ] Implement traceability tracking
- [ ] Build consistency checking engine
- [ ] Create validation-chain-proof system

#### Week 7-8: Integration & Testing
- [ ] Integrate Oracle + Eval + Validator + Compatibility
- [ ] Test truth propagation flow (greenfield + brownfield)
- [ ] Test Phase -1 (Codebase Discovery) workflow
- [ ] Test Phase 1.5 (Compatibility Analysis) workflow
- [ ] Create documentation
- [ ] Run pilot greenfield project
- [ ] Run pilot brownfield project

**Deliverables:**
- Oracle agent (bmad-core/agents/oracle.md) - with dual-truth mode
- Compatibility agent (bmad-core/agents/compatibility.md) - brownfield specialist
- Enhanced Eval agent - with regression/migration test capabilities
- Validator agent (bmad-core/agents/validator.md)
- Truth propagation system (greenfield + brownfield)
- Phase -1: Codebase Discovery workflow (brownfield)
- Phase 1.5: Compatibility Analysis workflow (brownfield)
- Eval foundation phase workflow
- Brownfield truth schemas (existing, enhancement, migration)

### Phase 2: Autonomy (v5.5) - Q1 2026
**Duration:** 6-8 weeks

#### Week 1-2: Monitor Agent
- [ ] Create Monitor agent specification
- [ ] Implement drift detection algorithms
- [ ] Build health metrics dashboard
- [ ] Create alerting system

#### Week 3-4: Reflection Agent
- [ ] Create Reflection agent specification
- [ ] Implement failure analysis engine
- [ ] Build learning loop system
- [ ] Create improvement recommendation engine

#### Week 5-6: State Machine
- [ ] Implement workflow state machine
- [ ] Create state persistence system
- [ ] Build auto-transition logic
- [ ] Implement checkpoint system

#### Week 7-8: Agent Collaboration
- [ ] Create agent collaboration protocol
- [ ] Implement agent invocation system
- [ ] Build parallel execution framework
- [ ] Test multi-agent coordination

**Deliverables:**
- Monitor agent (bmad-core/agents/monitor.md)
- Reflection agent (bmad-core/agents/reflection.md)
- Workflow state machine
- Agent collaboration protocol
- Background execution system

### Phase 3: Intelligence (v6.0) - Q2 2026
**Duration:** 8-10 weeks

#### Week 1-3: Intelligent Routing
- [ ] Create routing rules engine
- [ ] Implement context-aware switching
- [ ] Build fuzzy matching system
- [ ] Create confidence scoring

#### Week 4-6: Predictive Orchestration
- [ ] Design prediction engine
- [ ] Implement ML/heuristic models
- [ ] Build auto-suggestion system
- [ ] Create preview system

#### Week 7-10: Goal-Oriented Execution
- [ ] Create goal templates
- [ ] Implement goal decomposition engine
- [ ] Build autonomous execution system
- [ ] Create checkpoint management

**Deliverables:**
- Intelligent router (bmad-core/routing/)
- Predictive orchestration engine
- Goal-oriented autonomy system
- Full autonomous workflow

---

## Success Metrics

### Autonomy Metrics
- **Agent Switch Automation:** 80% of transitions automated
- **Human Intervention Rate:** <20% (down from 100%)
- **Workflow Completion Time:** 50% reduction
- **Agent Utilization:** 70% parallel execution

### Truth & Reliability Metrics
- **Domain Coverage:** 100% domain facts have eval tests
- **Traceability:** 100% code traces to domain truth
- **Eval Pass Rate:** 95%+ before human review
- **Drift Detection:** <5% false positives
- **Oracle Accuracy:** 90%+ semantic validation accuracy

### Quality Metrics
- **Bug Escape Rate:** <10% (down from typical 30%)
- **Requirements Defects:** <5% (down from 20%)
- **Architectural Drift:** <2% deviation from design
- **Test Coverage:** 90%+ (via eval datasets)

### Learning Metrics
- **Reflection Insights:** 10+ actionable improvements per sprint
- **Process Optimization:** 20% efficiency gain per quarter
- **Agent Improvement:** Measurable accuracy increase over time

---

## Risk Mitigation

### Technical Risks

**Risk:** Oracle creates incorrect domain truth
- **Mitigation:** Human checkpoint after domain research
- **Mitigation:** Reflection agent reviews Oracle accuracy
- **Mitigation:** Version control for domain-truth.yaml

**Risk:** Eval tests become maintenance burden
- **Mitigation:** Generate tests from domain truth (single source)
- **Mitigation:** Reflection agent identifies redundant tests
- **Mitigation:** Auto-update tests when domain truth changes

**Risk:** Too many background agents slow system
- **Mitigation:** Configurable parallelism limits
- **Mitigation:** Agent priority/scheduling system
- **Mitigation:** Performance monitoring and throttling

### Process Risks

**Risk:** Users resist autonomous agents
- **Mitigation:** Gradual autonomy levels (conservative → aggressive)
- **Mitigation:** Always show preview before auto-execution
- **Mitigation:** Easy override/manual mode

**Risk:** Over-reliance on automation causes skill atrophy
- **Mitigation:** "Explain" mode shows reasoning
- **Mitigation:** Learning insights from Reflection agent
- **Mitigation:** Human checkpoints at critical phases

### Adoption Risks

**Risk:** Complex system intimidates new users
- **Mitigation:** Simple default configuration
- **Mitigation:** Progressive disclosure of features
- **Mitigation:** Excellent documentation and tutorials

**Risk:** Breaking changes for existing users
- **Mitigation:** Backward compatibility mode
- **Mitigation:** Migration tooling
- **Mitigation:** Phased rollout

---

## Configuration & Control

### Autonomy Levels

```yaml
# .bmad-config/autonomy-settings.yaml
autonomy:
  level: "balanced"  # conservative | balanced | aggressive | full_auto

  auto_agent_switching:
    enabled: true
    require_confirmation: true
    confidence_threshold: 0.85

  background_agents:
    enabled: true
    max_concurrent: 2

  auto_command_execution:
    enabled: false  # Requires explicit opt-in
    whitelist: ["*shard-doc", "*draft"]
    blacklist: ["*develop-story"]

  predictive_suggestions:
    enabled: true
    preview_time: 5  # seconds

  goal_mode:
    enabled: true
    checkpoint_approval: "major_milestones_only"

  truth_validation:
    oracle_blocking: true
    eval_blocking: true
    validator_warnings: true
    monitor_alerts: true
```

### Truth Configuration

```yaml
# .bmad-config/truth-settings.yaml
truth:
  domain_truth:
    auto_create: true
    require_approval: true
    update_protocol: "reflection_reviewed"

  eval_datasets:
    auto_generate: true
    coverage_threshold: 0.90
    update_on_truth_change: true

  validation:
    oracle_validation: "blocking"
    validator_traceability: "blocking"
    monitor_drift: "warning"

  propagation:
    cascade_updates: true
    impact_analysis: true
    require_approval: "major_changes_only"
```

---

## Appendix

### A. Domain Truth Schema (Greenfield & Brownfield)

```yaml
# domain-truth.yaml
domain:
  name: "E-Commerce Platform"
  description: "Online marketplace for handmade goods"

canonical_facts:
  - id: "FACT-001"
    category: "authentication"
    fact: "Users authenticate via JWT tokens"
    constraint: "Token expiry: 15 minutes"
    source: "domain-analysis.md#security"

  - id: "FACT-002"
    category: "file_handling"
    fact: "Product images support JPG, PNG formats"
    constraint: "Max file size: 10MB"
    source: "domain-analysis.md#product-management"

terminology:
  "product": "Handmade item listed for sale"
  "vendor": "User who sells products (not 'seller')"
  "buyer": "User who purchases products (not 'customer')"

domain_examples:
  - example_id: "EX-001"
    scenario: "Vendor uploads product image"
    input:
      file_type: "image/jpeg"
      file_size: 8000000
    expected_outcome:
      status: "success"
      image_url: "https://cdn.example.com/products/123.jpg"

constraints:
  - constraint_id: "CON-001"
    type: "business_rule"
    rule: "Vendors must verify email before listing products"
    rationale: "Prevent spam and ensure accountability"

  - constraint_id: "CON-002"
    type: "technical"
    rule: "All API responses must be JSON"
    rationale: "Consistent client-side parsing"
```

### B. Eval Criteria Schema

```yaml
# eval-criteria.yaml
test_suites:
  domain_tests:
    - test_id: "DOM-001"
      name: "Valid user login"
      source: "domain-truth.yaml#FACT-001"
      input:
        username: "vendor@example.com"
        password: "SecurePass123!"
      expected_output:
        status: 200
        token: "<valid_jwt>"
        token_expiry: 900  # 15 minutes

  functional_tests:
    - test_id: "FR-001-T1"
      name: "Upload product image (valid)"
      source: "prd.md#FR-001"
      traces_to: "domain-truth.yaml#FACT-002"
      input:
        file: "test-images/product.jpg"
        size: 8000000
      expected_output:
        status: 201
        image_url: "<cdn_url>"

  integration_tests:
    - test_id: "INT-001"
      name: "End-to-end product creation"
      source: "architecture.md#product-service"
      traces_to: ["FR-001", "FR-003", "FR-005"]
      steps:
        - authenticate: {user: "vendor@example.com"}
        - create_product: {name: "Handmade Mug"}
        - upload_image: {file: "mug.jpg"}
        - publish: {product_id: "<created_id>"}
      expected_outcome:
        product_visible: true
        search_indexed: true
```

### C. Validation Chain Proof Schema

```yaml
# validation-chain-proof.md
story_id: "2.3"
story_title: "User Authentication API"

traceability_chain:
  - level: "domain"
    artifact: "domain-truth.yaml#FACT-001"
    content: "Users authenticate via JWT tokens (15min expiry)"

  - level: "requirements"
    artifact: "prd.md#FR-001"
    content: "System shall provide JWT-based authentication"
    traces_to: "FACT-001"

  - level: "architecture"
    artifact: "architecture.md#auth-service"
    content: "Auth microservice issues JWT tokens via /api/auth/login"
    implements: "FR-001"

  - level: "epic"
    artifact: "docs/prd/epic-1.md"
    content: "Epic 1: User Authentication System"
    implements: ["FR-001", "FR-002"]

  - level: "story"
    artifact: "docs/stories/1.1.story.md"
    content: "Story 1.1: Implement JWT authentication endpoint"
    implements: "FR-001"

  - level: "code"
    artifact: "src/services/auth.service.ts"
    implements: "Story 1.1"

eval_validation:
  tests_passed:
    - DOM-001: "Valid user login" ✅
    - FR-001-T1: "JWT generation" ✅
    - INT-001: "End-to-end auth flow" ✅
  coverage: 100%

oracle_validation:
  semantic_check: ✅ PASS
  consistency_check: ✅ PASS
  domain_alignment: ✅ PASS

validator_verification:
  traceability: ✅ COMPLETE
  requirements_coverage: ✅ 100%
  no_drift: ✅ VERIFIED

monitor_assessment:
  code_quality: ✅ A
  performance: ✅ GREEN
  security: ✅ PASS

empirical_proof: |
  Code in src/services/auth.service.ts demonstrably implements
  domain-truth.yaml#FACT-001 as evidenced by passing all eval tests
  (DOM-001, FR-001-T1, INT-001) and validated by Oracle, Validator,
  and Monitor agents.

  Chain: domain-truth → PRD → Architecture → Story → Code ✅
```

### D. Brownfield-Specific Truth Schemas

#### D.1 Existing System Truth Schema

```yaml
# existing-system-truth.yaml
# BROWNFIELD ONLY - Canonical facts about CURRENT system state

system:
  name: "E-Commerce API"
  version: "v2.3.1"
  analysis_date: "2025-10-04"
  analyzed_by: "compatibility-agent"

architecture_facts:
  - fact_id: "EXIST-001"
    category: "architecture"
    fact: "REST API built with Express.js v4.18"
    location: "src/server.js"
    constraint: "Cannot migrate frameworks without major version bump"
    migration_cost: "high"
    change_risk: "critical"

  - fact_id: "EXIST-002"
    category: "authentication"
    fact: "JWT authentication with 30min expiry"
    location: "src/middleware/auth.js"
    constraint: "Active user sessions depend on this timing"
    migration_cost: "medium"
    change_risk: "high"
    current_usage: "10,000 active sessions daily"

integration_points:
  - point_id: "INT-001"
    type: "external_api"
    name: "Stripe Payment Processing"
    version: "v2"
    location: "src/services/payment.service.js"
    criticality: "high"
    cannot_change: true
    rationale: "PCI compliance certification based on this version"

  - point_id: "INT-002"
    type: "database"
    name: "PostgreSQL with Sequelize ORM"
    version: "14.x / Sequelize 6.x"
    location: "src/models/"
    criticality: "high"
    schema_migration_required: true
    current_tables: 47
    current_relationships: 89

constraints:
  - constraint_id: "CON-001"
    type: "compatibility"
    rule: "Must maintain API backward compatibility for mobile apps"
    rationale: "10,000+ devices running v1 mobile app in production"
    affected_endpoints: ["/api/v1/*"]
    deprecation_timeline: "6 months minimum"

  - constraint_id: "CON-002"
    type: "data"
    rule: "Cannot drop existing database columns without migration"
    rationale: "Historical data required for auditing"
    affected_tables: ["users", "orders", "payments"]

performance_baselines:
  - metric_id: "PERF-001"
    metric: "API response time (p95)"
    current_value: "200ms"
    measurement_date: "2025-10-04"
    acceptable_degradation: "10%"
    max_threshold: "220ms"

  - metric_id: "PERF-002"
    metric: "Database query time (avg)"
    current_value: "50ms"
    measurement_date: "2025-10-04"
    acceptable_degradation: "5%"
    max_threshold: "52.5ms"

technical_debt:
  - debt_id: "DEBT-001"
    description: "Hardcoded database connection strings in 3 files"
    severity: "medium"
    location: ["src/config/db.js", "src/scripts/migrate.js"]
    fix_required_before_enhancement: false

  - debt_id: "DEBT-002"
    description: "Missing error handling in payment webhook"
    severity: "high"
    location: "src/webhooks/stripe.js"
    fix_required_before_enhancement: true

capabilities:
  can_implement:
    - "New REST endpoints following existing patterns"
    - "Database schema additions (with migrations)"
    - "New middleware components"
    - "Additional authentication methods"

  cannot_implement_without_major_refactor:
    - "GraphQL API (requires new framework layer)"
    - "Real-time websockets (Express not configured)"
    - "Microservices split (monolith architecture)"

  high_risk_changes:
    - "Authentication mechanism changes"
    - "Database ORM migration"
    - "Payment processing modifications"
```

#### D.2 Enhancement Truth Schema

```yaml
# enhancement-truth.yaml
# BROWNFIELD ONLY - Reconciliation of existing-system-truth + domain-truth

project:
  name: "JWT Token Expiry Enhancement"
  type: "brownfield_enhancement"
  created_date: "2025-10-04"
  created_by: "oracle-agent (brownfield mode)"

reconciliation_source:
  existing_truth: "existing-system-truth.yaml"
  domain_truth: "domain-truth.yaml"
  compatibility_analysis: "compatibility-analysis.md"
  migration_strategy: "migration-strategy.yaml"

enhancements:
  - enhancement_id: "ENH-001"
    title: "Migrate JWT expiry from 30min to 15min"
    type: "modification"

    current_state:
      fact_id: "EXIST-002"
      value: "30min token expiry"
      location: "src/middleware/auth.js"

    target_state:
      fact_id: "FACT-D001"
      value: "15min token expiry with refresh capability"
      rationale: "Industry best practice for security"

    migration_strategy_ref: "CONF-001"
    breaking_change: true
    backward_compatible_period: "3 months"
    migration_phases: 3

    compatibility_impact:
      - affected_component: "Authentication middleware"
        impact_type: "breaking"
        mitigation: "Gradual migration with dual-support period"

      - affected_component: "User sessions"
        impact_type: "user_experience"
        mitigation: "Automatic refresh token implementation"

  - enhancement_id: "ENH-002"
    title: "Add refresh token endpoint"
    type: "addition"

    current_state:
      exists: false

    target_state:
      new_capability: "Refresh token endpoint"
      location: "src/routes/auth/refresh.js"
      rationale: "Enable shorter-lived tokens without UX degradation"

    migration_strategy_ref: "CONF-001-Phase-1"
    breaking_change: false
    backward_compatible: true

compatible_enhancements:
  # These can be implemented without migration strategy
  - enhancement_id: "ENH-003"
    title: "Add OAuth2 login option"
    aligns_with_existing: true
    aligns_with_domain: true
    no_conflicts: true

conflicting_enhancements:
  # These require migration strategy
  - enhancement_id: "ENH-001"
    conflict_type: "value_mismatch"
    resolution: "Phased migration (3 phases, 3 months)"

migration_requirements:
  code_changes:
    - file: "src/middleware/auth.js"
      change_type: "modify"
      migration_phase: 2

    - file: "src/routes/auth/refresh.js"
      change_type: "add"
      migration_phase: 1

  database_changes:
    - table: "user_sessions"
      change_type: "add_column"
      column: "refresh_token_hash"
      migration_phase: 1

  configuration_changes:
    - setting: "JWT_EXPIRY"
      from: "30m"
      to: "15m"
      migration_phase: 3
      requires_restart: true

validation_criteria:
  must_pass:
    - "All regression tests pass (existing behavior intact)"
    - "All migration tests pass (transition works)"
    - "All enhancement tests pass (new functionality works)"
    - "Performance within acceptable thresholds"
    - "No breaking changes before deprecation period"
```

#### D.3 Migration Strategy Schema

```yaml
# migration-strategy.yaml
# BROWNFIELD ONLY - Detailed migration plan for conflicting changes

migration:
  id: "CONF-001-Migration"
  title: "JWT Token Expiry Migration Strategy"
  conflict_id: "CONF-001"
  type: "gradual_migration"
  risk_level: "medium"
  estimated_duration: "3 sprints"

phases:
  - phase_id: "PHASE-1"
    name: "Add Refresh Capability (Non-Breaking)"
    duration: "Sprint 1"
    objective: "Introduce refresh token endpoint without changing existing behavior"

    changes:
      - Add refresh token endpoint
      - Add refresh_token_hash column to user_sessions
      - Generate refresh tokens alongside existing 30min access tokens
      - No change to existing 30min expiry

    validation:
      - Existing 30min tokens still work
      - New refresh endpoint functional
      - No regression in existing auth flow

    rollback_plan: "Drop refresh token endpoint, remove database column"

  - phase_id: "PHASE-2"
    name: "Dual-Support Transition"
    duration: "Sprint 2"
    objective: "Support both 15min and 30min tokens simultaneously"

    changes:
      - Modify auth middleware to accept both token types
      - New tokens issued with 15min expiry
      - Existing 30min tokens still valid
      - Add migration flag in configuration

    validation:
      - Both 15min and 30min tokens accepted
      - New logins get 15min tokens
      - Existing sessions continue working
      - Refresh flow working for new tokens

    rollback_plan: "Revert to issuing 30min tokens, keep dual-support"

  - phase_id: "PHASE-3"
    name: "Complete Migration"
    duration: "Sprint 3 (after 3-month transition)"
    objective: "Deprecate 30min tokens, full migration to 15min"

    changes:
      - Remove dual-support code
      - Only issue and accept 15min tokens
      - Remove migration flag
      - Update documentation

    validation:
      - Only 15min tokens accepted
      - All users migrated to refresh token flow
      - No active 30min tokens in system

    rollback_plan: "Re-enable dual-support (requires code deployment)"

transition_criteria:
  phase_1_to_phase_2:
    - All PHASE-1 validation tests pass
    - Refresh endpoint in production for 2 weeks
    - No critical issues reported
    - Human approval

  phase_2_to_phase_3:
    - Dual-support active for minimum 3 months
    - <1% active 30min tokens remaining
    - Mobile app v2 adoption >95%
    - Human approval

monitoring:
  metrics:
    - "Percentage of 30min vs 15min tokens active"
    - "Refresh token usage rate"
    - "Authentication failure rate"
    - "User session duration"

  alerts:
    - "Auth failure rate >5% (rollback trigger)"
    - "Refresh token errors >10% (investigate)"

communication_plan:
  phase_1:
    - Internal team notification
    - API documentation update (new refresh endpoint)

  phase_2:
    - Mobile app team notification (update required)
    - Email to API consumers (deprecation notice)
    - Documentation: migration guide

  phase_3:
    - Final deprecation notice (30 days before)
    - Mobile app enforcement (v1 blocked)
```

#### D.4 Compatibility Analysis Schema

```yaml
# compatibility-analysis.md

## Compatibility Analysis Report
**Date:** 2025-10-04
**Analyzed by:** Compatibility Agent
**Project:** JWT Token Expiry Enhancement

### 1. Compatibility Matrix

| Domain Requirement | Existing Constraint | Status | Resolution |
|-------------------|-------------------|---------|------------|
| JWT 15min expiry (FACT-D001) | JWT 30min expiry (EXIST-002) | ❌ CONFLICT | Migration required |
| Refresh token support | Not implemented | ✅ COMPATIBLE | Add new feature |
| OAuth2 login option | Not implemented | ✅ COMPATIBLE | Add new feature |

### 2. Conflict Analysis

#### CONF-001: JWT Expiry Mismatch
- **Existing:** 30min token expiry (EXIST-002)
- **Domain:** 15min token expiry (FACT-D001)
- **Type:** Breaking change
- **Impact:** Will invalidate existing user sessions
- **Affected Users:** ~10,000 active sessions daily
- **Migration Required:** Yes (3-phase gradual rollout)
- **Risk:** Medium
- **Resolution:** See migration-strategy.yaml#CONF-001-Migration

### 3. Migration Roadmap

```
Current State (30min tokens)
        ↓
Phase 1: Add refresh endpoint (Sprint 1)
    - Non-breaking addition
    - Existing 30min tokens unchanged
        ↓
Phase 2: Dual-support period (Sprint 2 + 3 months)
    - Both 15min and 30min tokens valid
    - Gradual user migration
        ↓
Phase 3: Complete migration (Sprint 3)
    - Only 15min tokens accepted
    - Full domain requirement compliance
```

### 4. Risk Assessment

**High Risk:**
- Session invalidation during cutover
- Mobile app compatibility issues

**Mitigation:**
- 3-month transition period
- Dual-support for both token types
- Proactive communication to API consumers

**Rollback Triggers:**
- Auth failure rate >5%
- Critical security issue
- Major user complaints
```

---

## Conclusion

This truth-driven autonomous AI development framework transforms BMAD-METHOD from a manual, document-based system into an intelligent, self-validating platform where:

1. **Empirical truth** (test datasets) is established early and maintained throughout
2. **AI agents operate autonomously** but grounded in verifiable facts
3. **Multi-agent validation** ensures reliability without human intervention
4. **Continuous learning** improves the system over time
5. **Code is provably correct**, not just "looks right"
6. **Brownfield support** enables safe enhancement of existing systems through:
   - Dual-truth validation (existing + domain)
   - Regression prevention (existing functionality protected)
   - Migration strategies (safe evolution paths)
   - Compatibility analysis (breaking changes identified early)

### Key Results by Project Type

**Greenfield Projects:**
- AI develops software from scratch with 5-gate validation
- Domain truth → Requirements → Architecture → Stories → Code
- Empirical validation ensures "code matches requirements"

**Brownfield Projects:**
- AI enhances existing systems with 7-gate validation
- Existing truth + Domain truth → Compatibility analysis → Migration strategy → Code
- Empirical validation ensures "code matches requirements AND preserves existing functionality"

The result: **AI can develop AND enhance software with minimal human intervention while maintaining high reliability through empirical validation in both greenfield and brownfield contexts.**

---

**Next Steps:**
1. Review and refine this plan with stakeholders
2. Begin Phase 1 implementation (Oracle + Eval + Validator + Compatibility)
3. Create pilot greenfield project to validate approach
4. Create pilot brownfield project to validate enhancement workflow
5. Iterate based on learnings from both project types
