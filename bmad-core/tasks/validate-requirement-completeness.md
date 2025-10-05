# Validator Task: Validate Requirement Completeness

**Task ID:** validator-validate-completeness
**Agent:** Validator
**Category:** Completeness Validation
**When to Use:** Ensure all requirements are traceable and complete

---

## Purpose

Check that:
- All domain facts have requirements
- All requirements trace to domain truth  
- All stories implement requirements
- All code implements stories
- All code has tests

---

## Process

```yaml
completeness_checks:
  domain_to_requirements: "Check all domain facts in PRD"
  requirements_to_stories: "Check all FRs have stories"
  stories_to_code: "Check all stories implemented"
  code_to_tests: "Check all code tested"
  
  orphan_detection:
    - Orphan domain facts (no PRD)
    - Orphan requirements (no domain truth)
    - Orphan stories (no PRD)
    - Orphan code (no story)
    - Untested code
```

---

**Ensures 100% coverage and traceability.**
