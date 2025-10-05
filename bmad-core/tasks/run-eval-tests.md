# Eval Task: Run Eval Tests

**Task ID:** eval-run-tests
**Agent:** Eval
**Category:** Test Execution

---

## Purpose

Execute all eval test suites (domain, functional, integration, regression, compatibility).

---

## Process

```bash
bmad eval run-eval-tests \
  --criteria docs/eval-criteria.yaml \
  --report docs/validation/test-results.md
```

Returns: Pass/fail status, detailed results.

---

**Empirical validation of correctness.**
