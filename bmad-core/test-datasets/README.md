# Test Dataset Infrastructure

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Empirical validation through executable test datasets

---

## Overview

This directory contains the **test dataset infrastructure** for BMAD-METHOD's autonomous, truth-driven AI development framework. Test datasets serve as the empirical source of truth, validating that domain requirements are correctly implemented.

### Key Principles

1. **Empirical Validation** - Tests prove requirements, not documents
2. **Complete Coverage** - Every domain rule has at least one test dataset
3. **Automation First** - All test datasets should be executable
4. **Version Control** - Test datasets versioned alongside code
5. **Clear Organization** - Structured by project, feature, and test type

---

## Directory Structure

```
test-datasets/
├── README.md                    # This file
├── templates/                   # Test dataset templates
│   ├── unit-test-dataset.json
│   ├── integration-test-dataset.json
│   ├── e2e-test-dataset.json
│   ├── performance-test-dataset.yaml
│   └── regression-test-dataset.json
├── examples/                    # Example test datasets
│   ├── cart-calculation-example.json
│   ├── api-contract-example.yaml
│   └── migration-validation-example.json
├── validators/                  # Test dataset validators
│   ├── schema-validator.js
│   ├── format-validator.js
│   └── completeness-checker.js
└── projects/                    # Actual project test datasets
    └── {project-name}/
        ├── domain-validation/   # Validates domain-truth.yaml
        ├── integration/         # Integration test datasets
        ├── regression/          # Regression test datasets
        ├── migration/           # Migration test datasets (brownfield)
        └── compatibility/       # Compatibility test datasets (brownfield)
```

---

## Test Dataset Types

### 1. Domain Validation Datasets
**Purpose:** Validate domain rules and functional requirements

**Location:** `projects/{project}/domain-validation/`

**Naming Convention:** `{domain-rule-id}-{description}-{case-number}.{format}`

**Example:** `RULE-001-cart-total-calculation-001.json`

**Structure:**
```json
{
  "dataset_id": "TEST-DATASET-001",
  "type": "domain_validation",
  "validates": {
    "domain_rule_ids": ["RULE-001"],
    "functional_requirement_ids": ["FR-001"]
  },
  "test_cases": [
    {
      "case_id": "CASE-001",
      "name": "Basic cart total with tax",
      "input": {
        "items": [{"price": 10.00, "quantity": 2}],
        "tax_rate": 0.10
      },
      "expected_output": {
        "total": 22.00
      },
      "preconditions": [],
      "postconditions": []
    }
  ]
}
```

### 2. Integration Test Datasets
**Purpose:** Validate integration points and contracts

**Location:** `projects/{project}/integration/`

**Naming Convention:** `{integration-point}-{scenario}-{case-number}.{format}`

**Example:** `payment-api-successful-charge-001.json`

**Structure:**
```json
{
  "dataset_id": "INT-TEST-001",
  "type": "integration",
  "validates": {
    "integration_point": "PaymentGateway",
    "contract_version": "v1"
  },
  "test_cases": [
    {
      "case_id": "INT-CASE-001",
      "name": "Successful payment charge",
      "mock_setup": {
        "service": "PaymentGateway",
        "endpoint": "/api/v1/charge",
        "response": {
          "status": 200,
          "body": {"transaction_id": "tx_123", "status": "success"}
        }
      },
      "input": {
        "amount": 100.00,
        "currency": "USD",
        "payment_method": "card_token_123"
      },
      "expected_behavior": {
        "api_called": true,
        "response_validated": true,
        "result": "success"
      }
    }
  ]
}
```

### 3. Regression Test Datasets
**Purpose:** Ensure existing functionality continues to work

**Location:** `projects/{project}/regression/`

**Naming Convention:** `{component}-{critical-path}-{version}.{format}`

**Example:** `cart-checkout-flow-v1.json`

**Structure:**
```json
{
  "dataset_id": "REGRESSION-001",
  "type": "regression",
  "validates": {
    "component_id": "COMP-001",
    "baseline_version": "1.0.0",
    "critical_path": "Checkout Flow"
  },
  "test_cases": [
    {
      "case_id": "REG-CASE-001",
      "name": "Standard checkout flow",
      "baseline_behavior": {
        "description": "User completes checkout successfully",
        "steps": [
          "Add items to cart",
          "Apply shipping",
          "Enter payment",
          "Confirm order"
        ]
      },
      "input": {
        "cart": [{"product": "P001", "quantity": 1}],
        "shipping": "standard",
        "payment": "card"
      },
      "expected_output": {
        "order_created": true,
        "payment_processed": true,
        "confirmation_sent": true
      }
    }
  ]
}
```

### 4. Performance Test Datasets
**Purpose:** Validate performance characteristics

**Location:** `projects/{project}/performance/`

**Naming Convention:** `{component}-{metric}-benchmark.yaml`

**Example:** `cart-api-response-time-benchmark.yaml`

**Structure:**
```yaml
dataset_id: PERF-TEST-001
type: performance
validates:
  component: CartAPI
  metric: response_time

test_scenarios:
  - scenario_id: PERF-SCENARIO-001
    name: "Cart API under load"
    load_profile:
      concurrent_users: 1000
      duration: "5m"
      ramp_up: "30s"

    requests:
      - endpoint: "/api/v1/cart"
        method: POST
        body:
          items: [{product_id: "P001", quantity: 1}]

    success_criteria:
      - metric: "p95_response_time"
        threshold: "< 150ms"
      - metric: "error_rate"
        threshold: "< 0.1%"
```

### 5. Migration Test Datasets (Brownfield)
**Purpose:** Validate data migrations and transitions

**Location:** `projects/{project}/migration/`

**Naming Convention:** `{migration-id}-{phase}-validation.json`

**Example:** `MIG-001-schema-change-validation.json`

**Structure:**
```json
{
  "dataset_id": "MIG-TEST-001",
  "type": "migration",
  "validates": {
    "migration_id": "MIG-001",
    "migration_type": "schema_change"
  },
  "test_cases": [
    {
      "case_id": "MIG-CASE-001",
      "name": "Schema migration validation",
      "pre_migration_data": {
        "table": "cart",
        "records": [
          {"id": 1, "items": "[...]", "total": 100.00}
        ]
      },
      "migration_operation": "ADD COLUMN discount_amount DECIMAL(10,2)",
      "post_migration_validation": {
        "schema_valid": true,
        "data_intact": true,
        "backward_compatible": true,
        "expected_records": [
          {"id": 1, "items": "[...]", "total": 100.00, "discount_amount": null}
        ]
      }
    }
  ]
}
```

### 6. Compatibility Test Datasets (Brownfield)
**Purpose:** Validate backward compatibility

**Location:** `projects/{project}/compatibility/`

**Naming Convention:** `{api-version}-{compatibility-type}.json`

**Example:** `api-v1-backward-compatibility.json`

**Structure:**
```json
{
  "dataset_id": "COMPAT-TEST-001",
  "type": "compatibility",
  "validates": {
    "api_version": "v1",
    "compatibility_type": "backward"
  },
  "test_cases": [
    {
      "case_id": "COMPAT-CASE-001",
      "name": "Old client can still make requests",
      "old_client_request": {
        "endpoint": "/api/v1/cart",
        "method": "POST",
        "body": {
          "items": [{"product_id": "P001", "quantity": 1}]
        }
      },
      "expected_response": {
        "status": 200,
        "body_contains": ["cartId", "total", "items"],
        "backward_compatible": true
      }
    }
  ]
}
```

---

## Supported Formats

### JSON (.json)
- **Use for:** Structured test data, API contracts, most test cases
- **Pros:** Easy to parse, widely supported, human-readable
- **Cons:** No comments, verbose for large datasets

### YAML (.yaml, .yml)
- **Use for:** Complex configurations, performance tests, multi-scenario tests
- **Pros:** More readable, supports comments, less verbose
- **Cons:** Indentation-sensitive, parsing can be slower

### CSV (.csv)
- **Use for:** Tabular data, bulk test data, data migration tests
- **Pros:** Compact, easy to generate, works with spreadsheets
- **Cons:** Limited structure, no nested data

### SQL (.sql)
- **Use for:** Database migration tests, data setup scripts
- **Pros:** Direct database operations, familiar to DBAs
- **Cons:** Database-specific, not portable

---

## Naming Conventions

### Test Dataset Files
Format: `{identifier}-{description}-{case-number}.{format}`

Examples:
- `RULE-001-cart-total-basic-001.json`
- `FR-005-user-login-success-001.yaml`
- `INT-001-payment-gateway-failure-002.json`

### Test Dataset IDs
Format: `{TYPE}-{PROJECT}-{NUMBER}`

Examples:
- `TEST-CART-001` - Domain validation for cart
- `INT-PAYMENT-001` - Integration test for payment
- `REGRESSION-CHECKOUT-001` - Regression test for checkout
- `MIG-SCHEMA-001` - Migration test for schema
- `COMPAT-API-001` - Compatibility test for API

---

## Test Dataset Lifecycle

### 1. Creation
- Created by Eval Agent during domain truth establishment
- Each domain rule gets at least one test dataset
- Linked to specific domain truth elements

### 2. Validation
- Test datasets validated for correctness
- Schema validation using validators/
- Completeness check (all required fields)

### 3. Execution
- Run by Validator Agent continuously
- Integrated into CI/CD pipeline
- Results tracked and reported

### 4. Maintenance
- Updated when domain truth evolves
- Versioned alongside code
- Deprecated when requirements change

### 5. Evidence
- Execution results stored as validation evidence
- Results linked to validation-chain-proof.yaml
- Used for traceability

---

## Integration with CI/CD

### Pre-commit
```yaml
# .github/workflows/test-validation.yml
name: Test Dataset Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Validate Test Datasets
        run: npm run validate:test-datasets

      - name: Execute Domain Validation Tests
        run: npm run test:domain-validation

      - name: Execute Regression Tests
        run: npm run test:regression
```

### Deployment Gates
- All critical path test datasets must pass
- Performance benchmarks must be met
- Regression tests must pass
- Compatibility tests must pass (brownfield)

---

## Best Practices

### 1. Coverage
- Every domain rule: minimum 1 positive test
- Every domain rule: minimum 1 negative test
- Every domain rule: edge cases covered
- Every API endpoint: contract test
- Every critical path: regression test

### 2. Maintainability
- Keep test datasets small and focused
- Use descriptive names
- Document expected behavior
- Link to domain truth elements
- Version test datasets

### 3. Automation
- All test datasets should be executable
- Integrate into CI/CD pipeline
- Automatic validation on commit
- Report results to dashboard

### 4. Organization
- Group by project
- Separate by test type
- Use consistent naming
- Maintain README per project

---

## Validation Tools

### Schema Validator
```bash
# Validate test dataset structure
node validators/schema-validator.js <test-dataset-file>
```

### Format Validator
```bash
# Validate test dataset format (JSON/YAML/CSV)
node validators/format-validator.js <test-dataset-file>
```

### Completeness Checker
```bash
# Check test dataset coverage
node validators/completeness-checker.js <project-dir>
```

---

## Example Usage

### Creating a New Test Dataset

1. **Identify Requirement**
   - Review domain-truth.yaml
   - Identify domain rule or FR to validate
   - Determine test type needed

2. **Choose Template**
   ```bash
   cp templates/unit-test-dataset.json projects/my-project/domain-validation/
   ```

3. **Populate Test Data**
   - Fill in test cases
   - Define input and expected output
   - Link to domain truth IDs

4. **Validate**
   ```bash
   node validators/schema-validator.js projects/my-project/domain-validation/my-test.json
   ```

5. **Link to Domain Truth**
   - Update eval-criteria.yaml
   - Reference test dataset ID
   - Define pass criteria

6. **Execute**
   ```bash
   npm run test:execute projects/my-project/domain-validation/my-test.json
   ```

---

## Troubleshooting

### Test Dataset Won't Validate
- Check schema using schema-validator.js
- Ensure all required fields present
- Verify format (JSON/YAML) is valid
- Check test dataset ID is unique

### Test Execution Fails
- Verify test implementation exists
- Check test dataset paths are correct
- Ensure environment is configured
- Review execution logs

### Coverage Gaps
- Run completeness checker
- Review domain-truth.yaml
- Identify missing test datasets
- Create test datasets for gaps

---

## Related Documentation

- **eval-criteria.yaml** - Defines validation approach using test datasets
- **domain-truth.yaml** - Domain requirements that test datasets validate
- **validation-chain-proof.yaml** - Proof that test datasets validate requirements
- **Test Implementation Guide** - How to implement test code

---

## Support

For questions or issues with test datasets:
1. Check this README
2. Review example test datasets in `examples/`
3. Consult eval-criteria schema documentation
4. Contact Eval Agent or Validator Agent team
