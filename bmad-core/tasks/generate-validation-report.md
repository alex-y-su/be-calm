# Validator Task: Generate Validation Report

**Task ID:** validator-generate-report
**Agent:** Validator
**Category:** Reporting
**When to Use:** Create summary report of all validations

---

## Purpose

Generate comprehensive validation report.

---

## Process

```yaml
validation_report:
  date: "2025-10-04"
  scope: "full_project"
  
  summary:
    artifacts_validated: 247
    artifacts_passed: 240
    artifacts_failed: 7
    
  by_type:
    semantic: "PASS (96%)"
    empirical: "PASS (94%)"
    consistency: "PASS (97%)"
    completeness: "INCOMPLETE (92%)"
    
  traceability:
    coverage: "95.2%"
    gaps: 12
    
  recommendations:
    - Fix 7 failed artifacts
    - Address 12 traceability gaps
    - Achieve 100% coverage
```

---

**Report shows project health.**
