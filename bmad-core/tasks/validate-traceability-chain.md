# Validator Task: Validate Traceability Chain

**Task ID:** validator-validate-traceability
**Agent:** Validator
**Category:** Traceability Validation
**When to Use:** Ensure requirements flow correctly from domain truth to code to tests

---

## Purpose

Validate complete traceability chain:
```
domain-truth.yaml → PRD → Architecture → Story → Code → Tests
```

Ensure:
- Every domain fact has downstream implementation
- Every requirement traces to domain truth
- Every story implements specific requirements
- All code is traced to stories
- All tests validate requirements

**Goal:** 100% bidirectional traceability.

---

## Context

You are the Validator agent. Traceability is proof that code implements domain truth. This task validates the chain is intact and bidirectional.

---

## Inputs Required

1. **Start point** (domain fact ID, requirement ID, story ID, etc.)
2. **Direction** (forward | backward | bidirectional)
3. **Domain truth file** (`domain-truth.yaml`)

**Optional:**
- **Scope** (single-chain | full-project)
- **Depth** (how many levels to trace)

---

## Traceability Validation Process

### Step 1: Load Traceability Data

```yaml
traceability_load:
  domain_truth: "docs/domain-truth.yaml"
  prd: "docs/prd.md"
  architecture: "docs/architecture.md"
  stories: "docs/stories/**/*.md"
  code: "src/**/*"
  tests: "test/**/*"
  eval_criteria: "docs/eval-criteria.yaml"
```

### Step 2: Validate Forward Trace

From domain truth → downstream:

```yaml
forward_trace:
  fact_id: "FACT-001"
  fact: "JWT tokens expire after 15 minutes"

  trace_chain:
    level_1_requirements:
      - artifact: "prd.md"
        requirement_id: "FR-003"
        content: "User sessions must timeout after 15 minutes"
        line: 78
        traces_to: "FACT-001"
        status: "✅ FOUND"

    level_2_architecture:
      - artifact: "architecture.md"
        component_id: "COMP-002"
        content: "AuthService manages JWT with 15-minute TTL"
        line: 145
        traces_to: "FR-003"
        status: "✅ FOUND"

    level_3_stories:
      - artifact: "stories/epic-1/story-1.1.md"
        story_id: "1.1"
        title: "Implement JWT Token Management"
        traces_to: ["FR-003", "COMP-002"]
        status: "✅ FOUND"

    level_4_code:
      - artifact: "src/auth/jwt.service.ts"
        line: 42
        content: "expiresIn: '15m'"
        traces_to: "Story 1.1"
        status: "✅ FOUND"

    level_5_tests:
      - artifact: "test/auth/jwt.test.ts"
        test_id: "jwt-expiry-test"
        content: "expect(token).toExpireAfter(900000)"
        traces_to: ["FR-003", "Story 1.1"]
        status: "✅ FOUND"

      - artifact: "test-datasets/domain/authentication.csv"
        test_case_id: "DOM-001"
        content: "JWT token expiry validation"
        traces_to: "FACT-001"
        status: "✅ FOUND"

  validation_result:
    complete_chain: true
    all_levels_traced: true
    verdict: "✅ COMPLETE FORWARD TRACE"
```

### Step 3: Validate Backward Trace

From test → upstream:

```yaml
backward_trace:
  start_point:
    artifact: "test/auth/jwt.test.ts"
    test_id: "jwt-expiry-test"

  trace_chain:
    level_0_test_validates:
      code: "src/auth/jwt.service.ts:42"
      status: "✅ FOUND"

    level_1_code_implements:
      story: "stories/epic-1/story-1.1.md"
      story_id: "1.1"
      status: "✅ FOUND"

    level_2_story_implements:
      requirement: "prd.md#FR-003"
      architecture: "architecture.md#COMP-002"
      status: "✅ FOUND"

    level_3_requirement_traces_to:
      domain_fact: "domain-truth.yaml#FACT-001"
      status: "✅ FOUND"

  validation_result:
    complete_chain: true
    traces_to_domain_truth: true
    verdict: "✅ COMPLETE BACKWARD TRACE"
```

### Step 4: Identify Gaps

Find broken traces:

```yaml
traceability_gaps:
  orphaned_domain_facts:
    - fact_id: "FACT-015"
      fact: "Rate limiting: 100 requests per minute"
      issue: "No corresponding PRD requirement"
      severity: "high"
      action: "Add NFR to PRD"

  orphaned_requirements:
    - requirement_id: "FR-042"
      content: "User can export data to CSV"
      issue: "No domain truth basis"
      severity: "critical"
      action: "Add to domain truth or remove"

  orphaned_stories:
    - story_id: "2.7"
      title: "Admin dashboard"
      issue: "No PRD requirement"
      severity: "critical"
      action: "Add to PRD or remove story"

  orphaned_code:
    - file: "src/analytics/tracker.ts"
      issue: "No story or requirement"
      severity: "warning"
      action: "Document as infrastructure"

  untested_code:
    - file: "src/payments/refund.service.ts"
      issue: "No tests found"
      severity: "critical"
      action: "Create test suite"

  tests_without_requirements:
    - test: "test/utils/helper.test.ts"
      issue: "Tests utility function, no FR"
      severity: "info"
      action: "Acceptable for infrastructure code"
```

### Step 5: Calculate Traceability Metrics

```yaml
traceability_metrics:
  forward_traceability:
    domain_facts_total: 47
    with_requirements: 45 (95.7%)
    with_stories: 44 (93.6%)
    with_code: 43 (91.5%)
    with_tests: 42 (89.4%)

  backward_traceability:
    tests_total: 487
    trace_to_code: 487 (100%)
    trace_to_stories: 465 (95.5%)
    trace_to_requirements: 450 (92.4%)
    trace_to_domain: 447 (91.8%)

  orphans:
    domain_facts: 2
    requirements: 1
    stories: 1
    code_files: 1
    tests: 0

  coverage_score: 92.1%
  target_score: 100%
  gap: 7.9%
```

### Step 6: Generate Traceability Report

```markdown
# Traceability Validation Report

**Date:** 2025-10-04
**Status:** INCOMPLETE (92.1% coverage)

## Summary
- Forward Traceability: 89.4% (domain → tests)
- Backward Traceability: 91.8% (tests → domain)
- Overall Coverage: 92.1%
- **Target:** 100%

## Gaps Found

### Critical Issues (3)
1. **FR-042:** Orphan requirement (no domain truth)
2. **Story 2.7:** Orphan story (no PRD requirement)
3. **src/payments/refund.service.ts:** No tests

### High Priority (2)
1. **FACT-015:** Rate limiting fact not in PRD
2. **FACT-023:** Audit logging fact not implemented

## Recommendations

**Immediate Actions:**
1. Review FR-042 with domain expert
2. Add Story 2.7 to PRD or remove
3. Create tests for refund service
4. Add rate limiting NFR to PRD

**Target:** Achieve 100% traceability before production.
```

---

## Success Criteria

- [ ] All domain facts trace to requirements (100%)
- [ ] All requirements trace to stories (100%)
- [ ] All stories trace to code (100%)
- [ ] All code has tests (>95%)
- [ ] All tests trace to requirements (>95%)
- [ ] No orphaned artifacts
- [ ] Traceability report generated

---

## Command Signature

```bash
bmad validator validate-traceability \
  --start-fact FACT-001 \
  --direction bidirectional \
  --output docs/validation/traceability-validation.md
```

---

**Traceability = Proof of correctness.**
