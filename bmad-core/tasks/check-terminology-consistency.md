# Oracle Task: Check Terminology Consistency

**Task ID:** oracle-check-terminology
**Agent:** Oracle
**Category:** Validation
**When to Use:** Validate canonical term usage across all artifacts

---

## Purpose

Ensure all project artifacts use canonical terminology from `domain-truth.yaml#terminology` and avoid forbidden alternatives. Terminology consistency is critical for semantic clarity and prevents miscommunication.

---

## Context

You are the Oracle agent. Domain truth defines canonical terms, but artifacts might use alternatives, synonyms, or inconsistent language. Your job is to enforce terminology standards and detect drift.

**Example problem:** Domain truth says "user" but PRD uses "customer," Architecture uses "account," and Code uses "client." This creates semantic confusion.

---

## Inputs Required

1. **Artifacts to check** (file paths or directory)
2. **Domain truth file** (`domain-truth.yaml`)
3. **Terminology map** (`terminology-map.yaml`) - if exists

**Optional:**
- **Check scope** (strict | permissive)
- **Auto-fix** (true | false)

---

## Terminology Checking Process

### Step 1: Load Canonical Terminology

From `domain-truth.yaml`:

```yaml
terminology:
  "user": "Authenticated person with account credentials (not 'customer', 'client', or 'account holder')"
  "session": "User authentication state with defined timeout (not 'login', 'connection')"
  "token": "JWT authentication token (not 'auth key', 'credential')"
```

From `terminology-map.yaml` (if exists):

```yaml
canonical_terms:
  - term: "user"
    definition: "Authenticated person with account credentials"
    preferred: true
    alternatives_forbidden:
      - "customer"
      - "client"
      - "account holder"
    rationale: "Domain distinguishes authenticated users from unauthenticated visitors"
```

### Step 2: Scan Artifacts for Term Usage

Extract all term references:

```yaml
term_usage_analysis:
  artifact: "docs/prd.md"
  canonical_term: "user"

  found_variants:
    - term: "user"
      count: 47
      lines: [12, 15, 23, ...]
      status: "correct"

    - term: "customer"
      count: 5
      lines: [42, 87, 156, 234, 301]
      status: "violation"
      severity: "warning"

    - term: "client"
      count: 2
      lines: [199, 267]
      status: "violation"
      severity: "warning"
```

### Step 3: Classify Violations

#### 3.1 Forbidden Alternative Used

```yaml
violation:
  type: "forbidden_alternative"
  artifact: "docs/prd.md"
  line: 42
  found: "customer"
  canonical: "user"
  severity: "warning"
  auto_fixable: true
```

#### 3.2 Inconsistent Usage

```yaml
violation:
  type: "inconsistent_usage"
  artifact: "docs/architecture.md"
  concept: "authentication_state"
  inconsistency:
    - line_15: "session"
    - line_87: "login state"
    - line_142: "connection"
  canonical: "session"
  severity: "warning"
```

#### 3.3 Ambiguous Context

```yaml
violation:
  type: "ambiguous_term"
  artifact: "docs/stories/story-2.3.md"
  line: 23
  term: "user"
  context: "user clicks button"
  ambiguity: "Unclear if 'user' is authenticated or visitor"
  suggestion: "Clarify with 'authenticated user' or 'visitor'"
  severity: "info"
```

### Step 4: Generate Terminology Report

Use template: `bmad-core/templates/terminology-map-tmpl.yaml`

```yaml
terminology_validation_report:
  timestamp: "2025-10-04T10:30:00Z"
  artifacts_checked: 23

  canonical_terms_checked: 15
  violations_found: 37

  violations_by_severity:
    critical: 0
    warning: 29
    info: 8

  violations_by_type:
    forbidden_alternative: 24
    inconsistent_usage: 9
    ambiguous_term: 4

  violations:
    - violation_id: "TERM-001"
      artifact: "docs/prd.md"
      line: 42
      found: "customer"
      canonical: "user"
      type: "forbidden_alternative"
      severity: "warning"
      fix: "Replace 'customer' with 'user'"
      auto_fixable: true

    - violation_id: "TERM-002"
      artifact: "docs/architecture.md"
      line: 87
      found: "login state"
      canonical: "session"
      type: "inconsistent_usage"
      severity: "warning"
      fix: "Use 'session' consistently"
      auto_fixable: true

  summary:
    total_violations: 37
    auto_fixable: 33
    manual_review: 4
```

### Step 5: [OPTIONAL] Auto-Fix

If `--auto-fix` enabled:

```bash
# Example: Replace forbidden terms
sed -i 's/\bcustomer\b/user/g' docs/prd.md
sed -i 's/\bclient\b/user/g' docs/prd.md
```

**Auto-fix rules:**
- Only fix exact term replacements
- Preserve code variable names (unless specified)
- Ask before fixing ambiguous cases

---

## Output Format

**Report:** `docs/validation/terminology-report-{{timestamp}}.md`

```markdown
# Terminology Consistency Report

**Date:** 2025-10-04
**Status:** FAIL (37 violations)

## Summary
- Artifacts Checked: 23
- Canonical Terms Validated: 15
- Violations Found: 37 (29 warnings, 8 info)

## Violations

### Forbidden Alternatives (24)
| Artifact | Line | Found | Should Be | Auto-Fix |
|----------|------|-------|-----------|----------|
| prd.md | 42 | customer | user | ✅ |
| prd.md | 87 | customer | user | ✅ |
| architecture.md | 156 | client | user | ✅ |

### Inconsistent Usage (9)
| Artifact | Lines | Variants | Canonical | Fix |
|----------|-------|----------|-----------|-----|
| architecture.md | 15, 87, 142 | session, login state, connection | session | Standardize to 'session' |

### Ambiguous Terms (4)
| Artifact | Line | Term | Issue | Recommendation |
|----------|------|------|-------|----------------|
| story-2.3.md | 23 | user | Unclear if authenticated | Specify 'authenticated user' |

## Recommendations

**High Priority:**
1. Run auto-fix to replace forbidden alternatives (33 instances)
2. Manually review 4 ambiguous cases
3. Update terminology-map.yaml with new clarifications

**Actions:**
```bash
bmad oracle check-terminology --auto-fix
```
```

---

## Terminology Validation Modes

### Strict Mode (Default)

- Forbid all alternatives
- Flag any deviation from canonical terms
- Require exact terminology match

### Permissive Mode

- Allow synonyms in natural language sections
- Strict in technical specs (PRD FRs, Architecture components)
- Lenient in user stories and code comments

### Code Mode

- Check variable/function names
- Enforce canonical terms in public APIs
- Allow abbreviations if documented

---

## Success Criteria

- [ ] All canonical terms validated across artifacts
- [ ] No forbidden alternatives in use
- [ ] Terminology usage is consistent
- [ ] Ambiguities resolved or documented
- [ ] Terminology report generated

---

## Examples

### Example 1: PRD Terminology Check

**Input:**
```bash
Artifact: docs/prd.md
Domain Truth: docs/domain-truth.yaml
Mode: strict
Auto-fix: false
```

**Output:**
```markdown
# Terminology Report: PRD

## Status: FAIL (5 violations)

### Violations
1. Line 42: "customer" → should be "user"
2. Line 87: "customer" → should be "user"
3. Line 156: "client" → should be "user"
4. Line 234: "account holder" → should be "user"
5. Line 301: "login" → should be "session"

**Recommendation:** Run auto-fix
```

### Example 2: Code Terminology Check

**Input:**
```bash
Artifact: src/auth/user.service.ts
Mode: code
```

**Output:**
```markdown
# Terminology Report: Code

## Status: PASS WITH WARNINGS

### Public API: ✅ Correct
- `getUserSession()` ✅
- `authenticateUser()` ✅

### Internal: ⚠️ Warnings
- Variable `customerData` → suggest `userData`
- Function `getClientInfo()` → suggest `getUserInfo()`

**Note:** Internal naming is permissive, but consider aligning for consistency.
```

---

## Edge Cases

### Domain-Specific Overrides

If term has different meaning in specific context:

```yaml
# domain-truth.yaml
terminology:
  "client":
    general: "FORBIDDEN (use 'user')"
    api_context: "ALLOWED (API client application)"
    rationale: "Distinguish human users from API clients"

# This is OK in API docs:
"API client sends requests..." ✅

# This is NOT OK in user stories:
"Client logs in..." ❌ Should be "User logs in..."
```

### Code Variable Names

```javascript
// Permissive: Allow abbreviations
const usr = getUser(); // OK if documented

// Strict: Public API must be canonical
export function getUserSession() {} // ✅
export function getClientSession() {} // ❌ Forbidden
```

---

## Integration Points

**Called by:**
- Oracle `validate-artifact-against-truth` (as sub-check)
- Oracle `check-cross-document-consistency` (terminology section)
- User (manual terminology audit)

**Uses:**
- `domain-truth.yaml#terminology`
- `terminology-map.yaml` (if exists)

**Outputs to:**
- Consistency report
- Terminology map updates

---

## Command Signature

```bash
bmad oracle check-terminology \
  --artifacts docs/ \
  --truth docs/domain-truth.yaml \
  --mode strict \
  --auto-fix false \
  --output docs/validation/terminology-report.md
```

---

**Consistent terminology = Clear communication = Better software.**
