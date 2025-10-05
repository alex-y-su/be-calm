# Validator Task: Validate Artifact Complete

**Task ID:** validator-validate-artifact
**Agent:** Validator
**Category:** Comprehensive Validation
**When to Use:** Validate any artifact against all validation types

---

## Purpose

Perform complete validation of an artifact using all four validation types:
1. **Semantic:** Does it match domain truth?
2. **Empirical:** Does it pass eval tests?
3. **Consistency:** Does it align with other artifacts?
4. **Completeness:** Are all requirements traceable?

**This is the master validation task** - combines all validation checks.

---

## Context

You are the Validator agent. An artifact exists (PRD, Architecture, Story, Code, etc.) and needs comprehensive validation. You'll coordinate with Oracle (semantic), Eval (empirical), and run your own consistency/completeness checks.

**Output:** Complete validation report with pass/fail for each validation type.

---

## Inputs Required

1. **Artifact to validate** (file path)
2. **Artifact type** (prd | architecture | story | code | test)
3. **Domain truth file** (`domain-truth.yaml`)
4. **Eval criteria** (`eval-criteria.yaml`) - if exists

**Optional:**
- **Validation scope** (full | semantic-only | empirical-only | etc.)
- **Previous validation report** (for change tracking)

---

## Complete Validation Process

### Step 1: Load Artifact and Truth Sources

```yaml
validation_setup:
  artifact:
    path: "docs/prd.md"
    type: "prd"
    size: "142 KB"
    last_modified: "2025-10-04T09:30:00Z"

  truth_sources:
    domain_truth: "docs/domain-truth.yaml"
    eval_criteria: "docs/eval-criteria.yaml"
    existing_truth: "docs/existing-system-truth.yaml"  # If brownfield

  related_artifacts:
    - "docs/architecture.md"
    - "docs/stories/**/*.md"
    - "src/**/*"  # If code validation
```

### Step 2: Run Semantic Validation

Delegate to Oracle:

```bash
bmad oracle validate-artifact \
  --artifact docs/prd.md \
  --truth docs/domain-truth.yaml \
  --scope full
```

```yaml
semantic_validation:
  delegated_to: "Oracle"
  task: "validate-artifact-against-truth"

  result:
    status: "PASS"
    domain_facts_validated: 47
    violations: 0
    warnings: 2
    issues:
      - warning_id: "WARN-001"
        severity: "warning"
        issue: "FR-007 uses 'customer' instead of 'user'"
        fix: "Replace with canonical term"

  verdict: "PASS WITH WARNINGS ⚠️"
```

### Step 3: Run Empirical Validation

Delegate to Eval:

```bash
bmad eval run-eval-tests \
  --criteria docs/eval-criteria.yaml \
  --artifact docs/prd.md
```

```yaml
empirical_validation:
  delegated_to: "Eval"
  task: "run-eval-tests"

  result:
    status: "PASS"
    test_suites: 5
    total_tests: 89
    passed: 87
    failed: 2
    skipped: 0

    failures:
      - test_id: "FR-003-T2"
        test_name: "Invalid session timeout scenario"
        reason: "Expected 15 minutes, PRD says 30 minutes"
        severity: "critical"
        source: "domain-truth.yaml#FACT-001"

      - test_id: "FR-007-T1"
        test_name: "Email verification required"
        reason: "PRD doesn't enforce email verification"
        severity: "high"
        source: "domain-truth.yaml#FACT-002"

  verdict: "FAIL (2 critical tests failed) ❌"
```

### Step 4: Run Consistency Validation

Check alignment with other artifacts:

```yaml
consistency_validation:
  performed_by: "Validator"

  checks:
    - check_type: "cross_artifact_consistency"
      artifacts_compared:
        - "prd.md"
        - "architecture.md"
        - "stories/**/*.md"

      result:
        consistent: false
        issues:
          - issue_id: "CONS-001"
            severity: "critical"
            description: "Architecture COMP-002 says 30-minute token, PRD FR-003 says 15 minutes"
            artifacts_affected: ["prd.md:78", "architecture.md:145"]

    - check_type: "internal_consistency"
      artifact: "prd.md"

      result:
        consistent: true
        issues: []

  verdict: "FAIL (1 critical inconsistency) ❌"
```

### Step 5: Run Completeness Validation

Check traceability:

```yaml
completeness_validation:
  performed_by: "Validator"

  traceability_checks:
    - level: "domain_truth_to_requirements"
      check: "All domain facts have corresponding requirements"

      result:
        total_domain_facts: 47
        traced_to_requirements: 45
        orphaned_facts: 2

        orphans:
          - fact_id: "FACT-015"
            fact: "Rate limiting: 100 requests per minute"
            issue: "No corresponding NFR in PRD"
            severity: "high"

          - fact_id: "FACT-023"
            fact: "Audit logging required for all user actions"
            issue: "No FR or NFR for audit logging"
            severity: "medium"

      verdict: "INCOMPLETE (2 domain facts not in PRD) ⚠️"

    - level: "requirements_without_domain_trace"
      check: "All requirements trace to domain truth"

      result:
        total_requirements: 89
        traced_to_domain: 87
        orphaned_requirements: 2

        orphans:
          - requirement_id: "FR-042"
            content: "User can export data to CSV"
            issue: "No corresponding domain fact"
            severity: "critical"

      verdict: "INCOMPLETE (1 orphan requirement) ❌"

  overall_verdict: "INCOMPLETE ⚠️"
```

### Step 6: Aggregate Results

Combine all validation results:

```yaml
complete_validation_result:
  artifact: "docs/prd.md"
  validation_date: "2025-10-04T10:30:00Z"

  validation_types:
    semantic:
      status: "PASS WITH WARNINGS"
      score: 95/100
      issues: 2 warnings

    empirical:
      status: "FAIL"
      score: 77/100
      issues: 2 critical test failures

    consistency:
      status: "FAIL"
      score: 80/100
      issues: 1 critical inconsistency

    completeness:
      status: "INCOMPLETE"
      score: 85/100
      issues: 2 orphaned facts, 1 orphaned requirement

  overall_status: "FAIL"
  overall_score: 84/100

  critical_issues: 4
  high_issues: 1
  warnings: 2

  ready_for_next_phase: false
  blockers:
    - "Fix empirical test failures (FR-003-T2, FR-007-T1)"
    - "Resolve architecture/PRD inconsistency (CONS-001)"
    - "Remove or justify orphan requirement FR-042"
```

### Step 7: Generate Validation Report

Use template: `bmad-core/templates/validation-chain-proof-tmpl.md`

```markdown
# Complete Validation Report: PRD

**Artifact:** docs/prd.md
**Validated:** 2025-10-04T10:30:00Z
**Status:** FAIL (4 critical issues)
**Overall Score:** 84/100

## Validation Summary

| Type | Status | Score | Issues |
|------|--------|-------|--------|
| Semantic | ⚠️ PASS WITH WARNINGS | 95/100 | 2 warnings |
| Empirical | ❌ FAIL | 77/100 | 2 critical |
| Consistency | ❌ FAIL | 80/100 | 1 critical |
| Completeness | ⚠️ INCOMPLETE | 85/100 | 3 issues |
| **OVERALL** | **❌ FAIL** | **84/100** | **4 critical** |

## Critical Issues (Must Fix)

### 1. Empirical Test Failure: FR-003-T2
**Test:** Invalid session timeout scenario
**Issue:** Expected 15 minutes (per domain truth), PRD says 30 minutes
**Source:** domain-truth.yaml#FACT-001
**Fix:** Update FR-003 to specify 15-minute timeout

### 2. Empirical Test Failure: FR-007-T1
**Test:** Email verification required
**Issue:** PRD doesn't enforce email verification
**Source:** domain-truth.yaml#FACT-002
**Fix:** Add NFR requiring email verification before login

### 3. Architecture Inconsistency: CONS-001
**Issue:** Architecture says 30-minute JWT, PRD says 15 minutes
**Affected:** prd.md:78, architecture.md:145
**Fix:** Update architecture to match PRD (or vice versa)

### 4. Orphan Requirement: FR-042
**Issue:** "Export to CSV" requirement has no domain truth basis
**Fix:** Either add to domain-truth.yaml or remove from PRD

## Warnings (Should Fix)

1. **WARN-001:** FR-007 uses 'customer' instead of 'user'
2. **FACT-015 not in PRD:** Rate limiting fact has no requirement

## Recommendations

**Immediate Actions:**
1. Fix FR-003 to match domain truth (15 minutes)
2. Add email verification NFR
3. Resolve PRD/Architecture inconsistency
4. Review FR-042 with domain expert

**Before Proceeding:**
- All critical issues must be resolved
- Re-run validation to achieve PASS status

**Next Steps:**
```bash
# Fix issues, then re-validate
bmad validator validate-artifact --artifact docs/prd.md
```
```

---

## Validation Scoring

```yaml
scoring_criteria:
  semantic:
    max_score: 100
    deductions:
      critical_violation: -10
      warning: -2
      terminology_issue: -1

  empirical:
    max_score: 100
    calculation: "(passed_tests / total_tests) * 100"
    bonus: "+5 if all domain facts have tests"

  consistency:
    max_score: 100
    deductions:
      critical_inconsistency: -15
      warning_inconsistency: -5

  completeness:
    max_score: 100
    deductions:
      orphaned_fact: -5
      orphaned_requirement: -10
      missing_traceability: -3

  overall:
    calculation: "average(semantic, empirical, consistency, completeness)"
    pass_threshold: 90
```

---

## Output Format

**Report:** `docs/validation/complete-validation-{{artifact_name}}-{{timestamp}}.md`

**Structure:**
1. **Summary** (status, score, issue count)
2. **Validation Results by Type**
3. **Critical Issues** (must fix)
4. **Warnings** (should fix)
5. **Recommendations**
6. **Next Steps**

---

## Success Criteria

- [ ] All four validation types completed
- [ ] Semantic validation: PASS (>90%)
- [ ] Empirical validation: PASS (>90%)
- [ ] Consistency validation: PASS (no critical issues)
- [ ] Completeness validation: COMPLETE (100% traceability)
- [ ] Overall score: >90%
- [ ] Validation report generated

---

## Examples

### Example 1: PRD Validation (PASS)

```yaml
Artifact: docs/prd.md

Results:
  Semantic: PASS (98%)
  Empirical: PASS (95%)
  Consistency: PASS (100%)
  Completeness: COMPLETE (100%)
  Overall: PASS (98%)

Decision: ✅ Ready for next phase
```

### Example 2: Story Validation (FAIL)

```yaml
Artifact: docs/stories/epic-2/story-2.3.md

Results:
  Semantic: PASS (92%)
  Empirical: FAIL (60% - tests not written)
  Consistency: PASS (95%)
  Completeness: INCOMPLETE (no traceability to PRD)
  Overall: FAIL (75%)

Blockers:
  - Write acceptance tests
  - Add traceability to PRD requirement

Decision: ❌ Not ready - fix issues first
```

---

## Integration Points

**Called by:**
- User (manual validation)
- CI/CD (automated validation)
- PO agent (before sharding)
- SM agent (before story approval)
- Dev agent (before code merge)

**Calls:**
- Oracle `validate-artifact-against-truth` (semantic)
- Eval `run-eval-tests` (empirical)
- Validator `validate-consistency` (consistency check)
- Validator `validate-traceability` (completeness check)

---

## Command Signature

```bash
bmad validator validate-artifact \
  --artifact docs/prd.md \
  --type prd \
  --truth docs/domain-truth.yaml \
  --eval-criteria docs/eval-criteria.yaml \
  --output docs/validation/complete-validation-prd.md
```

---

**Complete validation = Confidence in artifact quality.**
