# Validator Task: Validate Empirical Tests

**Task ID:** validator-validate-empirical
**Agent:** Validator
**Category:** Empirical Validation
**When to Use:** Run eval tests against artifact/code

---

## Purpose

Delegates to Eval agent to run tests.

```bash
bmad eval run-eval-tests \
  --criteria docs/eval-criteria.yaml \
  --artifact {{artifact_path}}
```

See: `bmad-core/agents/eval.md`

---

**Ensures empirical correctness.**
