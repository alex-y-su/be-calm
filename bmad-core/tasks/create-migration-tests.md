# Eval Task: Create Migration Tests (Brownfield)

**Task ID:** eval-create-migration-tests
**Agent:** Eval
**Category:** Migration Testing

---

## Purpose

Create tests validating migration from old to new behavior.

---

## Process

```yaml
migration_tests:
  migration_id: "MIG-001"
  
  test_scenarios:
    - scenario: "Old client with new server"
      test: "30-minute token still supported"
      phase: "Phase 1-3"
      
    - scenario: "New client with new server"
      test: "15-minute token works"
      phase: "All phases"
      
    - scenario: "Mixed clients"
      test: "Both token types coexist"
      phase: "Phase 2-3"
```

Output: `test-datasets/migration/MIG-001-tests.yaml`

---

**Validates safe migration.**
