# Oracle Task: Check Cross-Document Consistency

**Task ID:** oracle-check-consistency
**Agent:** Oracle
**Category:** Validation
**When to Use:** After multiple artifacts exist to ensure they tell the same story

---

## Purpose

Validate that all project artifacts (PRD, Architecture, Stories, Code, Tests) are semantically consistent with each other and with domain truth. This catches contradictions, semantic drift, and misalignment across the documentation chain.

---

## Context

You are the Oracle agent. Multiple artifacts exist in the project, and each makes claims about the system. Your job is to ensure these claims don't contradict each other and all align with the canonical domain truth.

**Critical principle:** If PRD says X, Architecture says Y, and Story says Z, they must all be compatible and traceable to domain truth.

---

## Inputs Required

1. **Artifacts to check** (list of file paths or directory)
2. **Domain truth file** (`domain-truth.yaml`)
3. **Check scope** (full | requirements | architecture | stories | code)

**Optional:**
- **Traceability matrix** (if exists)
- **Previous consistency report** (for trend analysis)

---

## Consistency Checking Process

### Step 1: Load All Artifacts

```yaml
artifacts_to_validate:
  domain_truth: "docs/domain-truth.yaml"
  prd: "docs/prd.md"
  architecture: "docs/architecture.md"
  ux_spec: "docs/ux-spec.md"  # Optional
  epics: "docs/epics/*.md"
  stories: "docs/stories/**/*.md"
  code: "src/**/*"  # Optional
  tests: "test/**/*"  # Optional
```

### Step 2: Build Concept Graph

Extract all domain concepts, requirements, and constraints from each artifact:

```yaml
concept_graph:
  "user_authentication":
    domain_truth:
      - FACT-001: "JWT tokens expire after 15 minutes"
    prd:
      - FR-003: "User sessions timeout after 15 minutes"
    architecture:
      - COMP-002: "AuthService manages JWT with 15-minute TTL"
    story:
      - Story 1.1: "Implement 15-minute JWT expiry"
    code:
      - src/auth/jwt.service.ts:42: "expiresIn: '15m'"
```

### Step 3: Detect Contradictions

For each concept, check if all artifacts agree:

#### 3.1 Direct Contradictions

```yaml
# Example contradiction
concept: "token_expiry"
contradiction:
  domain_truth: "15 minutes (FACT-001)"
  prd: "15 minutes (FR-003)" ✅
  architecture: "30 minutes (COMP-002)" ❌ CONTRADICTION
  story: "15 minutes (Story 1.1)" ✅

violation:
  severity: "critical"
  issue: "Architecture contradicts domain truth and PRD"
  affected: ["docs/architecture.md:line_78"]
  fix: "Update architecture to use 15-minute expiry"
```

#### 3.2 Semantic Drift

```yaml
# Example drift
concept: "user_authentication"
drift:
  domain_truth: "Users authenticate via JWT tokens"
  prd: "Users log in with credentials to receive token"
  architecture: "OAuth2 flow with JWT bearer tokens"
  story: "User provides username/password for authentication"

assessment:
  issue: "Architecture introduces OAuth2 not mentioned in domain truth"
  severity: "warning"
  question: "Is OAuth2 the intended implementation of 'JWT authentication'?"
  action: "Clarify or update domain truth"
```

#### 3.3 Missing Traceability

```yaml
# Example orphan
orphaned_requirement:
  artifact: "docs/stories/epic-2/story-2.3.md"
  claim: "Implement password reset via email"
  traces_to_prd: false ❌
  traces_to_domain_truth: false ❌

violation:
  severity: "critical"
  issue: "Story implements feature not in PRD or domain truth"
  action: "Either remove story or add to PRD/domain-truth"
```

### Step 4: Validate Requirement Flow

Check that requirements flow correctly:

```
domain-truth.yaml (FACT-001)
    ↓
prd.md (FR-003) ← must reference FACT-001
    ↓
architecture.md (COMP-002) ← must reference FR-003
    ↓
story-1.1.md ← must reference FR-003 + COMP-002
    ↓
code (src/auth/jwt.service.ts) ← implements Story 1.1
    ↓
test (test/auth/jwt.test.ts) ← validates code
```

**Check at each level:**
- Does child reference parent?
- Are values consistent?
- Is terminology the same?

### Step 5: Terminology Consistency Check

Ensure canonical terms are used consistently:

```yaml
terminology_check:
  canonical_term: "user"

  usage_in_artifacts:
    domain_truth: "user" ✅
    prd: "user" (98%), "customer" (2%) ⚠️
    architecture: "user" ✅
    stories: "user" (100%) ✅
    code: "user" (variable names) ✅

  violations:
    - artifact: "docs/prd.md"
      lines: [42, 87, 156]
      found: "customer"
      should_be: "user"
      severity: "warning"
```

### Step 6: Constraint Propagation Check

Verify constraints are respected across all artifacts:

```yaml
constraint_propagation:
  constraint_id: "CON-001"
  rule: "Email verification required before login"

  validation:
    domain_truth: "Defined in constraints section" ✅
    prd: "NFR-002 requires email verification" ✅
    architecture: "AuthService checks email_verified flag" ✅
    story: "Story 1.2 implements verification check" ✅
    code: "src/auth/login.ts validates emailVerified" ✅
    test: "test/auth/login.test.ts tests unverified rejection" ✅

  status: "CONSISTENT ✅"
```

### Step 7: Generate Consistency Report

Use template: `bmad-core/templates/consistency-report-tmpl.md`

```yaml
consistency_report:
  timestamp: "2025-10-04T10:30:00Z"
  artifacts_checked: 47
  concepts_validated: 89

  status: "FAIL"

  contradictions:
    critical: 2
    warnings: 5
    info: 3

  orphaned_requirements: 1
  semantic_drift_detected: 3
  terminology_violations: 7

  details:
    - See consistency-report.md
```

---

## Output Format

**Report:** `docs/validation/consistency-report-{{timestamp}}.md`

**Structure:**
1. **Executive Summary**
   - Overall status (PASS/FAIL)
   - Total contradictions
   - Critical issues count

2. **Contradictions by Category**
   - Domain fact contradictions
   - Requirement misalignment
   - Architecture drift
   - Story orphans

3. **Terminology Issues**
   - Forbidden terms used
   - Inconsistent usage

4. **Missing Traceability**
   - Requirements without domain truth link
   - Code without story link
   - Tests without requirement link

5. **Recommendations**
   - Priority fixes
   - Suggested updates
   - Truth evolution needed

---

## Consistency Checks by Artifact Type

### PRD → Domain Truth
- ✅ Every FR traces to domain fact or constraint
- ✅ No PRD requirements contradict domain truth
- ✅ Terminology matches canonical terms

### Architecture → PRD
- ✅ Every component implements specific FRs
- ✅ No architectural decisions violate PRD NFRs
- ✅ Technical choices align with domain constraints

### Stories → PRD + Architecture
- ✅ Every story implements FR or architectural component
- ✅ Story acceptance criteria match domain examples
- ✅ No story implements unspecified features

### Code → Stories
- ✅ Code implements story requirements
- ✅ No code implements unspecified functionality
- ✅ Variables/functions use canonical terminology

### Tests → All
- ✅ Tests validate domain examples
- ✅ Test cases cover PRD functional requirements
- ✅ Test data matches domain-truth examples

---

## Advanced Checks

### Semantic Equivalence Detection

Detect when different words mean the same thing:

```yaml
# PRD: "User session expires after 15 minutes"
# Architecture: "JWT token has 15-minute TTL"
# Story: "Implement 15-minute timeout"

semantic_analysis:
  concept: "authentication_timeout"
  variants:
    - "session expiry"
    - "token TTL"
    - "timeout"
  assessment: "Semantically equivalent ✅"
  recommendation: "Standardize on 'session expiry' per domain truth"
```

### Implied Requirements Detection

Find requirements implied but not stated:

```yaml
# PRD says: "User can reset password"
# This implies:
#   - Password reset endpoint
#   - Email service
#   - Token generation
#   - Token expiry (security)

implied_requirements:
  explicit: "FR-007: Password reset"
  implied:
    - "Email service integration" ← missing from Architecture ❌
    - "Reset token expiry policy" ← missing from domain truth ❌

  violation:
    severity: "warning"
    issue: "FR-007 has unspecified dependencies"
    action: "Add email service to Architecture, define token expiry in domain truth"
```

---

## Success Criteria

- [ ] All artifacts checked against domain truth
- [ ] No critical contradictions
- [ ] 100% requirement traceability
- [ ] Terminology consistent across all artifacts
- [ ] All constraints propagated correctly
- [ ] Consistency report generated

---

## Examples

### Example 1: Full Project Check

**Input:**
```bash
Artifacts: docs/**/*.md, src/**/*.ts
Domain Truth: docs/domain-truth.yaml
Scope: full
```

**Output:**
```markdown
# Consistency Report

## Status: FAIL (3 critical issues)

### Contradictions
1. Architecture COMP-002 conflicts with FR-003
   - FR-003: "15-minute session"
   - COMP-002: "30-minute TTL"
   - Fix: Update architecture.md:78

2. Story 2.3 not in PRD
   - Story implements password reset
   - No corresponding FR in PRD
   - Fix: Add FR or remove story

3. Code uses "customer" (forbidden term)
   - Found in: src/user/service.ts:15
   - Should use: "user"
   - Fix: Rename variable
```

---

## Edge Cases

### Brownfield Projects

Check three truth sources:
- `existing-system-truth.yaml` (what IS)
- `domain-truth.yaml` (what SHOULD be)
- `enhancement-truth.yaml` (what WILL change)

Validate:
- Enhancements don't break existing truth
- Migration strategy exists for conflicts
- Backward compatibility maintained

### Evolving Domain Truth

If contradictions suggest domain truth is wrong:
1. Flag for review
2. Suggest domain truth update
3. Trigger `update-domain-truth` task

---

## Integration Points

**Called by:**
- PO agent (after document sharding)
- Validator agent (continuous validation)
- User (manual check)

**Calls:**
- `validate-artifact-against-truth` (for individual artifacts)
- `update-domain-truth` (if truth needs evolution)

**Outputs to:**
- Validator agent (for traceability matrix)
- Monitor agent (for trend tracking)

---

## Command Signature

```bash
bmad oracle check-consistency \
  --artifacts docs/ \
  --truth docs/domain-truth.yaml \
  --scope full \
  --output docs/validation/consistency-report.md
```

---

**This task ensures your entire project tells one coherent, consistent story.**
