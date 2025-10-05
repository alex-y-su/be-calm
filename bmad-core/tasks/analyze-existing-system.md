# Compatibility Task: Analyze Existing System

**Task ID:** compatibility-analyze-system
**Agent:** Compatibility
**Category:** Brownfield Analysis  
**When to Use:** Phase -1 of brownfield - initial codebase analysis

---

## Purpose

Comprehensive analysis of existing system to create `existing-system-truth.yaml`.

Delegates to Oracle `create-existing-system-truth` task.

```bash
bmad oracle create-existing-system-truth \
  --codebase /path/to/project \
  --output docs/existing-system-truth.yaml
```

See: `bmad-core/tasks/create-existing-system-truth.md`

---

**Foundation for all brownfield work.**
