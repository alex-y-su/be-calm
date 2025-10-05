# Eval Task: Create Compatibility Tests (Brownfield)

**Task ID:** eval-create-compatibility-tests
**Agent:** Eval
**Category:** Compatibility Testing

---

## Purpose

Create tests validating old and new systems work together during migration.

---

## Process

```yaml
compatibility_tests:
  enhancement_id: "ENH-001"
  
  test_scenarios:
    - scenario: "Old client authenticates"
      input: "Login with mobile v2.1"
      expected: "Token with appropriate expiry for old client"
      compatibility_check: "Old client still functional"
      
    - scenario: "New client authenticates"
      input: "Login with mobile v2.2"
      expected: "Token with 15-minute expiry"
      compatibility_check: "New client gets enhanced behavior"
      
    - scenario: "Concurrent old and new clients"
      input: "Multiple client versions active"
      expected: "All clients functional simultaneously"
      compatibility_check: "No conflicts between versions"
```

Output: `test-datasets/compatibility/ENH-001-tests.yaml`

---

**Ensures backward compatibility during migration.**
