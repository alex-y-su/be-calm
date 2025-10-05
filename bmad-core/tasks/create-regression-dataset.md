# Eval Task: Create Regression Dataset (Brownfield)

**Task ID:** eval-create-regression-dataset
**Agent:** Eval
**Category:** Brownfield Testing

---

## Purpose

Generate test datasets from existing system behavior to prevent regressions.

---

## Process

```yaml
regression_dataset_generation:
  source: "existing-system-truth.yaml"
  
  extract_test_cases:
    - behavior_id: "BIZ-002"
      behavior: "JWT expiry 30 minutes"
      test_case:
        input: "Valid login"
        expected: "Token with 30-minute expiry"
        test_file: "test-datasets/regression/auth-legacy.csv"
        
  purpose: "Ensure existing behavior preserved during migration"
```

Output: `test-datasets/regression/*.csv`

---

**Prevents breaking existing functionality.**
