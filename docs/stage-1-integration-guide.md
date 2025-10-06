# Stage 1 Integration Guide

**Version:** 5.0
**Date:** 2025-10-04
**Purpose:** Integrate truth infrastructure with existing BMAD agents

---

## Overview

Stage 1 adds truth infrastructure to BMAD v4. This guide shows how existing agents integrate with Oracle, Eval, Validator, and Compatibility agents.

---

## Enhanced Agent Workflows

### Analyst (Domain Researcher)

**NEW behavior:**

```yaml
analyst_workflow:
  phase_0_domain_research:
    output: "domain-analysis.md"

  phase_0.5_create_domain_truth:
    trigger: "After domain analysis complete"
    agent: "Oracle"
    task: "create-domain-truth"
    input: "domain-analysis.md"
    output: "domain-truth.yaml"

  validation:
    agent: "Oracle"
    task: "check-consistency"
    ensures: "Domain analysis internally consistent"
```

**Integration point:**
- Analyst output fed directly to Oracle
- Oracle extracts canonical facts
- Domain truth becomes source for all downstream work

---

### PM (Product Manager)

**NEW behavior:**

```yaml
pm_workflow:
  create_prd:
    - Draft PRD from domain-truth.yaml
    - Every FR traces to domain fact

  validate_prd:
    agent: "Oracle"
    task: "validate-artifact-against-truth"
    artifact: "prd.md"
    blocks_on_fail: true

  generate_functional_tests:
    agent: "Eval"
    task: "generate-functional-test-data"
    input: "prd.md FRs"
    output: "test-datasets/functional/*.csv"

  traceability_check:
    agent: "Validator"
    task: "validate-traceability"
    scope: "prd"
    ensures: "100% FR → domain fact traceability"
```

**New PRD requirements:**
- Every FR must reference domain fact ID
- Example: `FR-003: User sessions timeout after 15 minutes (traces to FACT-001)`
- NFRs must reference domain constraints

---

### Architect

**NEW behavior:**

```yaml
architect_workflow:
  create_architecture:
    - Design components based on PRD + domain truth
    - Validate against domain constraints

  validate_architecture:
    agent: "Oracle"
    task: "validate-artifact-against-truth"
    artifact: "architecture.md"

  validate_consistency:
    agent: "Oracle"
    task: "check-cross-document-consistency"
    artifacts: ["prd.md", "architecture.md"]
    ensures: "Architecture implements PRD correctly"

  generate_integration_tests:
    agent: "Eval"
    task: "generate-integration-test-data"
    input: "architecture.md components"
    output: "test-datasets/integration/*.csv"
```

**New Architecture requirements:**
- Components reference FRs they implement
- Technical decisions reference domain constraints

---

### PO (Product Owner)

**NEW behavior:**

```yaml
po_workflow:
  shard_documents:
    - Shard PRD into epics
    - Shard epics into stories
    - Embed truth references in story files

  enhanced_story_metadata:
    truth_references:
      domain_fact_id: "FACT-001"
      requirement_id: "FR-003"
      architecture_component: "COMP-002"

  validate_sharding:
    agent: "Validator"
    task: "validate-traceability"
    ensures: "All stories trace to PRD and domain truth"
```

---

### SM (Scrum Master)

**NEW behavior:**

```yaml
sm_workflow:
  create_story_file:
    - Include truth references
    - Include eval acceptance tests
    - Include traceability chain

  story_structure:
    metadata:
      domain_fact: "FACT-001"
      requirement: "FR-003"
      architecture: "COMP-002"

    acceptance_criteria:
      - criterion: "JWT generated with 15-minute expiry"
        test_ref: "DOM-001"  # References eval test dataset

    eval_tests:
      - test_id: "STORY-1.1-T1"
        scenario: "Generate valid JWT"
        expected: "Token with 15-minute expiry"

  validate_story:
    agent: "Validator"
    task: "validate-artifact"
    artifact: "story-1.1.md"
    checks: ["semantic", "empirical", "completeness"]
```

**New story template:**
```markdown
# Story 1.1: Implement JWT Token Management

**Traces to:**
- Domain Fact: FACT-001 (JWT 15-minute expiry)
- Requirement: FR-003 (Session timeout)
- Architecture: COMP-002 (AuthService)

**Acceptance Criteria:**
- [ ] JWT generated with 15-minute expiry (Test: DOM-001)
- [ ] Token includes expiration timestamp (Test: STORY-1.1-T1)

**Eval Tests:** See test-datasets/stories/story-1.1-tests.yaml
```

---

### Dev (Developer)

**NEW behavior:**

```yaml
dev_workflow:
  before_coding:
    - Read story with embedded truth references
    - Review eval acceptance tests
    - Understand domain constraints

  during_coding:
    - Implement according to story
    - Run eval tests continuously (watch mode)
    - Oracle validates semantic consistency in background

  continuous_validation:
    agent: "Validator"
    mode: "watch"
    on_save: "Run semantic + empirical validation"

  before_commit:
    agent: "Validator"
    task: "validate-on-commit"
    checks: "Ensure code passes all tests"
    blocks_commit: true (if validation fails)

  create_traceability_proof:
    agent: "Validator"
    task: "create-traceability-proof"
    story: "1.1"
    output: "validation-chain-proof-story-1.1.md"
```

**Dev receives:**
- Story with complete context
- Eval acceptance tests (must pass)
- Domain truth references
- Real-time validation feedback

---

### QA

**NEW behavior:**

```yaml
qa_workflow:
  eval_handles_functional_testing:
    - Eval generates test datasets
    - Eval runs automated tests
    - QA supplements with exploratory testing

  qa_focus:
    - Security testing
    - Performance testing
    - Edge case testing
    - User experience testing

  qa_validation:
    agent: "Validator"
    task: "validate-entire-project"
    before_release: true

  regression_testing:
    agent: "Eval"
    task: "validate-no-regression"
    scope: "All regression test datasets"
```

**QA collaboration with Eval:**
- Eval: Automated functional validation
- QA: Exploratory, security, performance

---

## Brownfield Enhancements

### Phase -1: Compatibility Analysis

**NEW phase** (before domain research):

```yaml
phase_minus_1:
  trigger: "Brownfield project identified"

  step_1_analyze_existing:
    agent: "Compatibility"
    task: "analyze-existing-system"
    output: "existing-system-truth.yaml"

  step_2_extract_truths:
    agent: "Oracle"
    task: "create-existing-truth"
    input: "Codebase analysis"
    output: "existing-system-truth.yaml"

  step_3_baseline:
    agent: "Compatibility"
    task: "capture-performance-baseline"
    output: "existing-system-truth.yaml#performance_baselines"
```

### Dual-Truth Mode

```yaml
brownfield_workflow:
  truths:
    existing: "existing-system-truth.yaml" (what IS)
    domain: "domain-truth.yaml" (what SHOULD be)
    enhancement: "enhancement-truth.yaml" (what WILL change)

  oracle_behavior:
    mode: "dual-truth"
    validates_against: ["existing", "domain"]
    reconciles_via: "enhancement"

  migration_required:
    agent: "Oracle"
    task: "analyze-migration-path"
    for: "All breaking changes"
```

---

## Validation Gates

### Gate 1: PRD Approval

```yaml
prd_gate:
  checks:
    - Oracle semantic validation: PASS
    - Eval functional tests generated: YES
    - Validator traceability: 100%

  approval:
    required: true
    blocker: "Cannot proceed to architecture without PRD validation"
```

### Gate 2: Architecture Approval

```yaml
architecture_gate:
  checks:
    - Oracle semantic validation: PASS
    - Oracle consistency (PRD ↔ Architecture): PASS
    - Eval integration tests generated: YES

  approval:
    required: true
    blocker: "Cannot shard without architecture validation"
```

### Gate 3: Story Ready for Dev

```yaml
story_gate:
  checks:
    - Validator traceability complete: YES
    - Eval acceptance tests exist: YES
    - Oracle semantic validation: PASS

  approval:
    required: true
    blocker: "Dev cannot start without story validation"
```

### Gate 4: Code Ready for Merge

```yaml
code_gate:
  checks:
    - Eval acceptance tests: PASS
    - Validator empirical validation: PASS
    - Oracle semantic consistency: PASS
    - Traceability proof: GENERATED

  approval:
    required: true
    blocker: "Cannot merge without validation"
```

---

## Tool Integration

### Git Hooks

```bash
# .git/hooks/pre-commit
bmad validator validate-on-commit

# Blocks commit if validation fails
```

### CI/CD Pipeline

```yaml
ci_pipeline:
  step_1_validate_artifacts:
    run: "bmad validator validate-entire-project"

  step_2_run_tests:
    run: "bmad eval run-eval-tests --scope all"

  step_3_check_traceability:
    run: "bmad validator validate-traceability --scope full"

  step_4_generate_proof:
    run: "bmad validator create-traceability-proof"

  deploy_gate:
    condition: "All validations PASS"
```

### IDE Integration

```yaml
vscode_settings:
  bmad.validator.watchMode: true
  bmad.eval.autoRunTests: true
  bmad.oracle.backgroundValidation: true
```

---

## Summary

**Key integration points:**
1. **Analyst → Oracle:** Domain analysis becomes domain truth
2. **Oracle → PM/Architect:** Truth validates requirements and design
3. **Eval → All agents:** Test datasets created at every phase
4. **Validator → All agents:** Continuous validation enforcement
5. **Compatibility → Oracle:** Brownfield dual-truth management

**Result:**
- Empirical validation (tests before code)
- Semantic consistency (Oracle enforces truth)
- Complete traceability (Validator proves correctness)
- Safe brownfield migrations (Compatibility ensures compatibility)

**Next:** Proceed to Stage 2 (Validation Workflows)
