# Validator Task: Validate Entire Project

**Task ID:** validator-validate-project
**Agent:** Validator
**Category:** Project-Wide Validation
**When to Use:** Comprehensive validation of all project artifacts

---

## Purpose

Validate entire project:
- All artifacts (PRD, Architecture, Stories, Code, Tests)
- Complete traceability
- Consistency across all documents
- Empirical validation of all domain facts

---

## Process

### Step 1: Validate All Artifacts

```bash
# Validate PRD
bmad validator validate-artifact --artifact docs/prd.md

# Validate Architecture
bmad validator validate-artifact --artifact docs/architecture.md

# Validate all Stories
for story in docs/stories/**/*.md; do
  bmad validator validate-artifact --artifact $story
done

# Validate code (sample)
bmad validator validate-artifact --artifact src/
```

### Step 2: Validate Traceability

```bash
bmad validator validate-traceability \
  --scope full-project \
  --output docs/validation/project-traceability.md
```

### Step 3: Check Consistency

```bash
bmad oracle check-cross-document-consistency \
  --artifacts docs/ \
  --output docs/validation/consistency-report.md
```

### Step 4: Run All Tests

```bash
bmad eval run-eval-tests \
  --criteria docs/eval-criteria.yaml \
  --scope all
```

### Step 5: Aggregate Results

```yaml
project_validation:
  artifacts_validated: 247
  artifacts_passed: 240
  artifacts_failed: 7

  traceability_coverage: 95.2%
  consistency_score: 96.8%
  test_pass_rate: 94.3%

  overall_score: 95.1%
  status: "PASS WITH WARNINGS"

  blockers: 0
  critical_issues: 0
  warnings: 7
```

---

## Output

**Report:** `docs/validation/project-validation-report.md`

---

## Success Criteria

- [ ] All artifacts validated
- [ ] Traceability >95%
- [ ] Consistency >95%
- [ ] Tests >90% pass
- [ ] No critical issues

---

**Project validation = Release readiness.**
