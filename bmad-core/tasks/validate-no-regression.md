# Eval Task: Validate No Regression (Brownfield)

**Task ID:** eval-validate-no-regression
**Agent:** Eval
**Category:** Regression Testing

---

## Purpose

Run regression tests to ensure existing functionality still works.

---

## Process

```bash
bmad eval run-eval-tests \
  --test-suite test-datasets/regression/ \
  --expect-pass-rate 100%
```

Fail build if ANY regression test fails.

---

**Zero tolerance for regressions.**
