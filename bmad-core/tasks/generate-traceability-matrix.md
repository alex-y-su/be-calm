# Validator Task: Generate Traceability Matrix

**Task ID:** validator-generate-matrix
**Agent:** Validator
**Category:** Traceability Mapping
**When to Use:** Create comprehensive traceability matrix for entire project

---

## Purpose

Generate complete traceability matrix showing how every domain fact flows through the system. Output as YAML and visual formats.

---

## Process

Delegates to Oracle `generate-traceability-map` task.

```bash
bmad oracle generate-traceability-map \
  --truth docs/domain-truth.yaml \
  --artifacts docs/,src/,test/ \
  --output docs/validation/traceability-matrix.yaml
```

See: `bmad-core/tasks/generate-traceability-map.md`

---

## Output

- `traceability-matrix.yaml` (machine-readable)
- `traceability-map.md` (human-readable)
- `traceability-diagram.mmd` (visual)

---

**Traceability matrix = Project-wide proof of correctness.**
