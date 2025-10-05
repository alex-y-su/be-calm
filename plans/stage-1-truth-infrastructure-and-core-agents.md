# Stage 1: Truth Infrastructure & Core Agents

**Version:** 1.0
**Date:** 2025-10-04
**Implementation Phase:** Foundation (v5.0)
**Estimated Effort:** 6-8 weeks
**Prerequisites:** Stage 0 completed

---

## Overview

Stage 1 establishes the foundational truth infrastructure and implements the core validation agents (Oracle, Eval, Validator, Compatibility). This stage enables empirical validation and dual-truth management for both greenfield and brownfield projects.

---

## Agent Specifications

### 1. Oracle Agent - Domain Truth Maintainer

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

**Implementation Tasks:**
- [ ] Create `bmad-core/agents/oracle.md`
- [ ] Implement domain-truth.yaml generation logic
- [ ] Build semantic consistency checker
- [ ] Create terminology enforcement system
- [ ] Implement brownfield dual-truth mode
- [ ] Build existing-truth extraction from codebase
- [ ] Create enhancement validation logic
- [ ] Implement migration path analysis

---

### 2. Eval Agent - Empirical Truth Creator (Enhanced)

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

**Implementation Tasks:**
- [ ] Enhance existing `bmad-core/agents/eval.md`
- [ ] Implement test dataset generation from domain-truth.yaml
- [ ] Create eval-criteria.yaml schema and generator
- [ ] Build test execution engine
- [ ] Implement coverage validation (100% domain fact coverage)
- [ ] Add regression test generation (brownfield)
- [ ] Create migration test generation (brownfield)
- [ ] Build compatibility test suite generator
- [ ] Implement continuous test execution (watch mode)

---

### 3. Validator Agent - Continuous Validation Engine

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

**Implementation Tasks:**
- [ ] Create `bmad-core/agents/validator.md`
- [ ] Implement traceability tracking system
- [ ] Build consistency checking engine
- [ ] Create validation-chain-proof generator
- [ ] Implement traceability-matrix.yaml format
- [ ] Build file-watch validation triggers
- [ ] Create completeness checker (100% requirement coverage)
- [ ] Implement bidirectional validation (code ↔ docs)

---

### 4. Compatibility Agent - Brownfield Integration Specialist

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

**Implementation Tasks:**
- [ ] Create `bmad-core/agents/compatibility.md`
- [ ] Implement codebase analysis for existing-system-truth extraction
- [ ] Build compatibility validation logic
- [ ] Create migration strategy generator
- [ ] Implement breaking change detector
- [ ] Build compatibility-constraints.yaml generator
- [ ] Create integration point mapper
- [ ] Implement performance baseline capture

---

## Truth Schema Specifications

### Domain Truth Schema (Greenfield & Brownfield)

```yaml
# domain-truth.yaml
domain:
  name: "Project Name"
  description: "Project description"

canonical_facts:
  - id: "FACT-001"
    category: "authentication"
    fact: "Users authenticate via JWT tokens"
    constraint: "Token expiry: 15 minutes"
    source: "domain-analysis.md#security"

terminology:
  "term": "Definition (not 'alternative')"

domain_examples:
  - example_id: "EX-001"
    scenario: "Description"
    input: {}
    expected_outcome: {}

constraints:
  - constraint_id: "CON-001"
    type: "business_rule"
    rule: "Description"
    rationale: "Why this constraint exists"
```

**Implementation Tasks:**
- [ ] Create `bmad-core/schemas/domain-truth.schema.yaml`
- [ ] Build domain-truth.yaml generator
- [ ] Implement fact extraction from domain-analysis.md
- [ ] Create terminology validator
- [ ] Build constraint validator

---

### Existing System Truth Schema (Brownfield)

```yaml
# existing-system-truth.yaml
system:
  name: "System Name"
  version: "v2.3.1"
  analysis_date: "2025-10-04"

architecture_facts:
  - fact_id: "EXIST-001"
    category: "architecture"
    fact: "REST API built with Express.js v4.18"
    location: "src/server.js"
    constraint: "Cannot migrate frameworks without major version bump"
    migration_cost: "high"
    change_risk: "critical"

integration_points:
  - point_id: "INT-001"
    type: "external_api"
    name: "Stripe Payment Processing"
    version: "v2"
    criticality: "high"
    cannot_change: true

constraints:
  - constraint_id: "CON-001"
    type: "compatibility"
    rule: "Must maintain API backward compatibility"
    rationale: "Explanation"

performance_baselines:
  - metric_id: "PERF-001"
    metric: "API response time (p95)"
    current_value: "200ms"
    acceptable_degradation: "10%"
```

**Implementation Tasks:**
- [ ] Create `bmad-core/schemas/existing-system-truth.schema.yaml`
- [ ] Build codebase analyzer for fact extraction
- [ ] Implement integration point detector
- [ ] Create performance baseline capture tool
- [ ] Build technical debt identifier

---

### Enhancement Truth Schema (Brownfield)

```yaml
# enhancement-truth.yaml
project:
  name: "Enhancement Name"
  type: "brownfield_enhancement"

reconciliation_source:
  existing_truth: "existing-system-truth.yaml"
  domain_truth: "domain-truth.yaml"
  compatibility_analysis: "compatibility-analysis.md"
  migration_strategy: "migration-strategy.yaml"

enhancements:
  - enhancement_id: "ENH-001"
    title: "Description"
    type: "modification"

    current_state:
      fact_id: "EXIST-002"
      value: "Current value"

    target_state:
      fact_id: "FACT-D001"
      value: "Target value"
      rationale: "Why this change"

    migration_strategy_ref: "CONF-001"
    breaking_change: true
    backward_compatible_period: "3 months"
```

**Implementation Tasks:**
- [ ] Create `bmad-core/schemas/enhancement-truth.schema.yaml`
- [ ] Build reconciliation analyzer (existing + domain → enhancement)
- [ ] Implement breaking change classifier
- [ ] Create migration requirement generator

---

### Eval Criteria Schema

```yaml
# eval-criteria.yaml
test_suites:
  domain_tests:
    - test_id: "DOM-001"
      name: "Valid user login"
      source: "domain-truth.yaml#FACT-001"
      input:
        username: "user@example.com"
        password: "SecurePass123!"
      expected_output:
        status: 200
        token: "<valid_jwt>"
        token_expiry: 900  # 15 minutes

  functional_tests:
    - test_id: "FR-001-T1"
      name: "Feature test"
      source: "prd.md#FR-001"
      traces_to: "domain-truth.yaml#FACT-002"
      input: {}
      expected_output: {}

  integration_tests:
    - test_id: "INT-001"
      name: "End-to-end test"
      source: "architecture.md#component"
      traces_to: ["FR-001", "FR-003"]
      steps: []
      expected_outcome: {}
```

**Implementation Tasks:**
- [ ] Create `bmad-core/schemas/eval-criteria.schema.yaml`
- [ ] Build test case generator from domain-truth
- [ ] Implement test dataset formatter (JSON, CSV, YAML)
- [ ] Create test execution framework integration

---

### Validation Chain Proof Schema

```yaml
# validation-chain-proof.md
story_id: "2.3"
story_title: "Story Title"

traceability_chain:
  - level: "domain"
    artifact: "domain-truth.yaml#FACT-001"
    content: "Fact description"

  - level: "requirements"
    artifact: "prd.md#FR-001"
    content: "Requirement description"
    traces_to: "FACT-001"

  - level: "code"
    artifact: "src/service.ts"
    implements: "Story 1.1"

eval_validation:
  tests_passed: ["DOM-001", "FR-001-T1"]
  coverage: 100%

oracle_validation:
  semantic_check: "PASS"
  consistency_check: "PASS"

empirical_proof: "Code demonstrably implements domain truth"
```

**Implementation Tasks:**
- [ ] Create `bmad-core/schemas/validation-chain-proof.schema.yaml`
- [ ] Build traceability chain generator
- [ ] Implement proof document formatter

---

## Truth Propagation System

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

**Implementation Tasks:**
- [ ] Build truth change detector
- [ ] Implement cascade update system
- [ ] Create affected artifact tracker
- [ ] Build decision tree for eval failures
- [ ] Implement auto-update propagation

---

## Integration with Existing BMAD Workflow

### Enhanced Agent Behaviors

**Analyst (Domain Researcher):**
- Output fed directly to Oracle for domain-truth.yaml generation
- Oracle validates domain analysis for consistency

**PM (Product Manager):**
- Every requirement validated by Oracle against domain-truth
- Eval generates functional test datasets for each FR
- Validator ensures 100% traceability to domain-truth

**Architect:**
- Design validated by Oracle for domain constraint compliance
- Eval generates integration test datasets
- Validator ensures architecture ↔ PRD ↔ domain-truth alignment

**PO (Product Owner):**
- Enhanced sharding includes truth references
- Epics/stories include domain-truth.yaml fact IDs

**SM (Scrum Master):**
- Stories automatically include eval acceptance tests
- Truth references embedded in story files

**Dev (Developer):**
- Continuous eval test execution on file save
- Oracle watches for semantic drift
- Validator ensures traceability maintained

**QA:**
- Supplements eval tests with exploratory/security testing
- Eval handles core functional validation

---

## Deliverables for Stage 1

### Agent Files
- [ ] `bmad-core/agents/oracle.md`
- [ ] `bmad-core/agents/eval.md` (enhanced)
- [ ] `bmad-core/agents/validator.md`
- [ ] `bmad-core/agents/compatibility.md`

### Schema Files
- [ ] `bmad-core/schemas/domain-truth.schema.yaml`
- [ ] `bmad-core/schemas/existing-system-truth.schema.yaml`
- [ ] `bmad-core/schemas/enhancement-truth.schema.yaml`
- [ ] `bmad-core/schemas/eval-criteria.schema.yaml`
- [ ] `bmad-core/schemas/validation-chain-proof.schema.yaml`
- [ ] `bmad-core/schemas/compatibility-analysis.schema.yaml`
- [ ] `bmad-core/schemas/migration-strategy.schema.yaml`

### Templates
- [ ] `bmad-core/templates/domain-truth.template.yaml`
- [ ] `bmad-core/templates/existing-system-truth.template.yaml`
- [ ] `bmad-core/templates/enhancement-truth.template.yaml`
- [ ] `bmad-core/templates/eval-criteria.template.yaml`
- [ ] `bmad-core/templates/validation-chain-proof.template.md`

### Infrastructure
- [ ] Test dataset directory structure (`test-datasets/`)
- [ ] Truth propagation engine
- [ ] Validation chain tracker
- [ ] Background agent execution framework

### Documentation
- [ ] Agent user guides
- [ ] Schema documentation
- [ ] Truth propagation guide
- [ ] Integration guide for existing agents

---

## Testing & Validation

### Unit Tests
- [ ] Oracle: domain-truth generation from domain-analysis
- [ ] Oracle: semantic consistency validation
- [ ] Oracle: dual-truth mode (brownfield)
- [ ] Eval: test dataset generation from domain-truth
- [ ] Eval: regression test generation (brownfield)
- [ ] Validator: traceability chain validation
- [ ] Compatibility: existing-system-truth extraction

### Integration Tests
- [ ] Analyst → Oracle → domain-truth.yaml flow
- [ ] Oracle → Eval → test datasets flow
- [ ] PM → Oracle + Eval + Validator validation
- [ ] Truth update propagation
- [ ] Brownfield: Compatibility → Oracle → Eval flow

### Pilot Projects
- [ ] **Greenfield Pilot:** Small web service (auth system)
  - Test domain-truth generation
  - Test eval dataset creation
  - Test validation chain

- [ ] **Brownfield Pilot:** Enhance existing service (add feature)
  - Test existing-system-truth extraction
  - Test compatibility analysis
  - Test migration strategy generation
  - Test regression test creation

---

## Success Criteria

- [ ] All 4 core agents implemented and tested
- [ ] All truth schemas defined and validated
- [ ] Truth propagation system functional
- [ ] Greenfield pilot completes successfully
- [ ] Brownfield pilot completes successfully
- [ ] 100% domain fact → eval test coverage achieved
- [ ] Validation chain proof generated successfully
- [ ] Documentation complete

---

## Next Stage

**Stage 2: Validation Workflows**
- Implement Phases -1, 0, 1, 1.5, 2-5 workflows
- Story completion gates
- End-to-end flow examples
