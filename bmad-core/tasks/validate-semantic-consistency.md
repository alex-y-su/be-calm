# Validator Task: Validate Semantic Consistency

**Task ID:** validator-validate-semantic
**Agent:** Validator
**Category:** Semantic Validation
**When to Use:** Check artifact aligns with domain truth semantically

---

## Purpose

Delegates to Oracle for semantic validation.

```bash
bmad oracle validate-artifact \
  --artifact {{artifact_path}} \
  --truth docs/domain-truth.yaml \
  --scope semantic
```

See: `bmad-core/tasks/validate-artifact-against-truth.md`

---

**Ensures domain truth compliance.**
