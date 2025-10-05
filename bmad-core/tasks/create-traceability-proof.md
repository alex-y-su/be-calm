# Validator Task: Create Traceability Proof

**Task ID:** validator-create-proof
**Agent:** Validator
**Category:** Proof Generation
**When to Use:** Generate proof that story/code implements domain truth

---

## Purpose

Create validation-chain-proof document showing complete trace from domain truth through requirements, architecture, story, code, to tests. This is proof of correctness.

---

## Context

You are the Validator agent. A story or feature is complete. You must generate proof that it correctly implements domain truth by showing the complete traceability chain with validation evidence.

---

## Inputs Required

1. **Story ID** or **Feature ID**
2. **Domain truth file**
3. **All related artifacts**

---

## Proof Generation Process

### Step 1: Identify Complete Chain

```yaml
proof_chain:
  story_id: "1.1"
  story_title: "Implement JWT Token Management"

  chain:
    domain: "FACT-001"
    requirement: "FR-003"
    architecture: "COMP-002"
    story: "1.1"
    code: "src/auth/jwt.service.ts"
    tests: ["test/auth/jwt.test.ts", "DOM-001"]
```

### Step 2: Extract Evidence

```yaml
evidence:
  domain_level:
    artifact: "domain-truth.yaml"
    fact_id: "FACT-001"
    content: "JWT tokens expire after 15 minutes"
    constraint: "Token TTL: 15 minutes"

  requirement_level:
    artifact: "prd.md"
    requirement_id: "FR-003"
    content: "User sessions must timeout after 15 minutes of inactivity"
    traces_to: "FACT-001"
    validation: "Semantic match ✅"

  architecture_level:
    artifact: "architecture.md"
    component_id: "COMP-002"
    content: "AuthService: JWT generation with 15-minute TTL"
    traces_to: "FR-003"
    validation: "Implements requirement ✅"

  story_level:
    artifact: "stories/epic-1/story-1.1.md"
    story_id: "1.1"
    acceptance_criteria:
      - "JWT token generated with 15-minute expiry"
      - "Token includes expiration timestamp"
    traces_to: ["FR-003", "COMP-002"]
    validation: "Complete acceptance criteria ✅"

  code_level:
    artifact: "src/auth/jwt.service.ts"
    line: 42
    code: "expiresIn: '15m'"
    implements: "Story 1.1"
    validation: "Correct implementation ✅"

  test_level:
    empirical_tests:
      - test: "test/auth/jwt.test.ts"
        test_name: "JWT token expires after 15 minutes"
        result: "PASS ✅"
        validates: "Code implementation"

      - test: "test-datasets/domain/authentication.csv#DOM-001"
        test_name: "Domain fact validation: JWT expiry"
        result: "PASS ✅"
        validates: "FACT-001"

  oracle_validation:
    semantic_check: "PASS"
    consistency_check: "PASS"
    validation_date: "2025-10-04"
```

### Step 3: Generate Proof Document

Use template: `bmad-core/templates/validation-chain-proof-tmpl.md`

```markdown
# Validation Chain Proof: Story 1.1

**Story:** 1.1 - Implement JWT Token Management
**Status:** ✅ VALIDATED
**Date:** 2025-10-04

---

## Traceability Chain

### Domain Truth
**Source:** domain-truth.yaml#FACT-001
**Content:** "JWT tokens expire after 15 minutes"
**Constraint:** Token TTL: 15 minutes

### Requirements
**Source:** prd.md#FR-003 (line 78)
**Content:** "User sessions must timeout after 15 minutes of inactivity"
**Traces to:** FACT-001
**Validation:** ✅ Semantic match

### Architecture
**Source:** architecture.md#COMP-002 (line 145)
**Content:** "AuthService: JWT generation with 15-minute TTL"
**Traces to:** FR-003
**Validation:** ✅ Implements requirement

### Story
**Source:** stories/epic-1/story-1.1.md
**Title:** Implement JWT Token Management
**Acceptance Criteria:**
- JWT token generated with 15-minute expiry ✅
- Token includes expiration timestamp ✅

**Traces to:** FR-003, COMP-002
**Validation:** ✅ Complete acceptance criteria

### Code
**Source:** src/auth/jwt.service.ts:42
**Implementation:**
```typescript
const token = jwt.sign(payload, secret, {
  expiresIn: '15m'
});
```
**Implements:** Story 1.1
**Validation:** ✅ Correct implementation

### Tests
**Unit Test:** test/auth/jwt.test.ts
```typescript
it('JWT token expires after 15 minutes', () => {
  const token = generateToken(user);
  expect(token).toExpireAfter(900000); // 15 min
});
```
**Result:** ✅ PASS

**Domain Test:** test-datasets/domain/authentication.csv#DOM-001
**Test:** Domain fact validation: JWT expiry
**Result:** ✅ PASS

---

## Validation Results

### Semantic Validation (Oracle)
**Status:** ✅ PASS
**Checks:**
- Domain truth alignment: ✅
- Terminology consistency: ✅
- Constraint compliance: ✅

### Empirical Validation (Eval)
**Status:** ✅ PASS
**Tests Passed:** 2/2 (100%)
- Unit test: ✅ PASS
- Domain test: ✅ PASS

### Consistency Validation
**Status:** ✅ PASS
**Checks:**
- PRD ↔ Architecture: ✅ Consistent
- Story ↔ Code: ✅ Consistent

### Completeness Validation
**Status:** ✅ COMPLETE
**Traceability:** 100%
- Domain → Requirements: ✅
- Requirements → Story: ✅
- Story → Code: ✅
- Code → Tests: ✅

---

## Proof Statement

**Story 1.1 demonstrably implements domain truth FACT-001.**

**Evidence:**
1. Domain truth defines 15-minute JWT expiry
2. PRD requirement FR-003 specifies 15-minute timeout
3. Architecture component COMP-002 designs JWT with 15-minute TTL
4. Story 1.1 acceptance criteria require 15-minute expiry
5. Code implements 15-minute expiry (`expiresIn: '15m'`)
6. Tests validate 15-minute expiry (unit + domain tests PASS)

**Validation chain is complete and verified. ✅**

---

## Approval

**Validated by:** Validator Agent
**Oracle Check:** ✅ PASS
**Eval Check:** ✅ PASS
**Date:** 2025-10-04

**Ready for production: YES ✅**
```

---

## Success Criteria

- [ ] Complete trace from domain truth to tests
- [ ] All validations pass (semantic, empirical, consistency, completeness)
- [ ] Proof document generated
- [ ] Evidence documented
- [ ] Approval granted

---

## Command Signature

```bash
bmad validator create-traceability-proof \
  --story 1.1 \
  --output docs/validation/proof-story-1.1.md
```

---

**Proof = Confidence. Deploy with proof.**
