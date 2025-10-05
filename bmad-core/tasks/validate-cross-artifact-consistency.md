# Validator Task: Validate Cross-Artifact Consistency

**Task ID:** validator-validate-consistency
**Agent:** Validator
**Category:** Consistency Validation
**When to Use:** Check artifacts don't contradict each other

---

## Purpose

Delegates to Oracle for consistency checking.

```bash
bmad oracle check-cross-document-consistency \
  --artifacts docs/ \
  --truth docs/domain-truth.yaml
```

See: `bmad-core/tasks/check-cross-document-consistency.md`

---

**Ensures project tells one coherent story.**
