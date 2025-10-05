# Validator Task: Check Bidirectional Links

**Task ID:** validator-check-bidirectional
**Agent:** Validator
**Category:** Traceability
**When to Use:** Verify links work both ways (forward and backward)

---

## Purpose

Ensure traceability is bidirectional:
- Forward: domain truth → code
- Backward: code → domain truth

---

## Process

```yaml
bidirectional_check:
  forward:
    domain_fact: "FACT-001"
    trace_to: ["FR-003", "Story 1.1", "src/auth/jwt.service.ts"]
    
  backward:
    code: "src/auth/jwt.service.ts"
    trace_to: ["Story 1.1", "FR-003", "FACT-001"]
    
  validation:
    forward_complete: true
    backward_complete: true
    bidirectional: true
```

---

**Bidirectional traceability = Complete proof.**
