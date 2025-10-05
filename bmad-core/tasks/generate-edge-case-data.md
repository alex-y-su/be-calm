<!-- Powered by BMAD™ Core -->

# Generate Edge Case Data Task

## Purpose

To generate comprehensive edge case datasets for boundary testing, error handling validation, and negative test scenarios. These datasets include boundary values, invalid states, constraint violations, and error conditions to ensure robust application behavior under unusual or incorrect inputs.

## Input Parameters

- `domain_context`: Domain analysis results from analyze-domain-for-eval task
- `entity_schemas`: Entity schema definitions from eval/schemas/
- `constraints`: Constraint definitions from eval/schemas/constraints.yaml

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Initialize Edge Case Generation

#### 1.1 Load Configuration

- Load `eval/config.yaml` for generation settings
- Load entity schemas from `eval/schemas/*.yaml`
- Load constraints from `eval/schemas/constraints.yaml`
- Load domain-specific rules from `{root}/data/domain-constraints.md`

#### 1.2 Load Edge Case Patterns

- Load `{root}/data/synthetic-data-best-practices.md` for edge case patterns
- Identify common edge case categories:
  - Boundary values
  - Invalid states
  - Constraint violations
  - Type mismatches
  - Missing required fields
  - Malformed data

### 2. Generate Boundary Value Edge Cases

#### 2.1 Identify Boundary Conditions

For each field with constraints, identify boundary values:

**Numeric Fields:**
- Minimum valid value
- Minimum valid value - 1 (invalid)
- Maximum valid value
- Maximum valid value + 1 (invalid)
- Zero (if applicable)
- Negative (if invalid)

**String Fields:**
- Empty string ("")
- Single character ("a")
- Maximum length string
- Maximum length + 1 (invalid)
- Null value (if optional)

**Date/DateTime Fields:**
- Minimum valid date (e.g., 1900-01-01)
- Maximum valid date (e.g., 2099-12-31)
- Current date
- Future date (if invalid)
- Past date beyond range (invalid)
- Invalid formats ("2024-13-01", "2024-02-30")

**Email/URL Fields:**
- Valid minimal format ("a@b.c")
- Missing @ symbol (invalid)
- Missing domain (invalid)
- Special characters
- Very long email (255 chars)

#### 2.2 Create Boundary Value Dataset

**eval/unit/edge-cases/boundary-values.yaml:**

```yaml
edge_case_type: Boundary Values
description: Test data at the edges of valid ranges
generated_at: 2024-01-15T13:00:00Z

test_cases:
  # Numeric boundaries
  - entity: User
    field: age
    scenario: minimum_valid
    value: 18
    expected: valid
    description: Minimum valid age

  - entity: User
    field: age
    scenario: below_minimum
    value: 17
    expected: invalid
    error_expected: "Age must be at least 18"

  - entity: User
    field: age
    scenario: maximum_valid
    value: 120
    expected: valid

  - entity: User
    field: age
    scenario: above_maximum
    value: 121
    expected: invalid
    error_expected: "Age must be at most 120"

  # String boundaries
  - entity: Product
    field: name
    scenario: empty_string
    value: ""
    expected: invalid
    error_expected: "Product name is required"

  - entity: Product
    field: name
    scenario: single_character
    value: "A"
    expected: valid

  - entity: Product
    field: name
    scenario: max_length
    value: "A" * 255  # 255 characters
    expected: valid

  - entity: Product
    field: name
    scenario: exceeds_max_length
    value: "A" * 256  # 256 characters
    expected: invalid
    error_expected: "Product name must be at most 255 characters"

  # Decimal/Currency boundaries
  - entity: Order
    field: total
    scenario: zero_value
    value: 0.00
    expected: invalid
    error_expected: "Order total must be greater than 0"

  - entity: Order
    field: total
    scenario: minimum_valid
    value: 0.01
    expected: valid

  - entity: Order
    field: total
    scenario: precision_overflow
    value: 99.999
    expected: invalid
    error_expected: "Order total must have at most 2 decimal places"

  # Date boundaries
  - entity: User
    field: created_at
    scenario: minimum_valid_date
    value: "1900-01-01T00:00:00Z"
    expected: valid

  - entity: User
    field: created_at
    scenario: future_date
    value: "2099-12-31T23:59:59Z"
    expected: invalid
    error_expected: "Created date cannot be in the future"

  - entity: User
    field: birthdate
    scenario: invalid_date_format
    value: "2024-02-30"
    expected: invalid
    error_expected: "Invalid date format"
```

### 3. Generate Invalid State Edge Cases

#### 3.1 Identify Invalid State Combinations

Based on state machines and business rules:

**Invalid State Transitions:**
- Order: delivered → pending (cannot go backwards)
- Subscription: expired → trial (cannot reactivate expired as trial)
- Payment: captured → pending (finalized states cannot revert)

**Invalid State Data:**
- Order status="shipped" but shipment_id=null
- Subscription status="active" but end_date in past
- User status="deleted" but has active orders

#### 3.2 Create Invalid States Dataset

**eval/unit/edge-cases/invalid-states.yaml:**

```yaml
edge_case_type: Invalid States
description: Test data with logically invalid state combinations
generated_at: 2024-01-15T13:00:00Z

test_cases:
  # Invalid state transitions
  - entity: Order
    scenario: invalid_status_transition
    record:
      id: "edge_order_001"
      status: "delivered"
      previous_status: "pending"
    operation: update_status
    new_status: "pending"
    expected: invalid
    error_expected: "Cannot transition from delivered to pending"

  - entity: Subscription
    scenario: expired_to_trial
    record:
      id: "edge_sub_001"
      status: "expired"
    operation: update_status
    new_status: "trial"
    expected: invalid
    error_expected: "Cannot reactivate expired subscription as trial"

  # Invalid state data combinations
  - entity: Order
    scenario: shipped_without_shipment
    record:
      id: "edge_order_002"
      status: "shipped"
      shipment_id: null
    expected: invalid
    error_expected: "Shipped orders must have a shipment_id"

  - entity: Subscription
    scenario: active_with_past_end_date
    record:
      id: "edge_sub_002"
      status: "active"
      end_date: "2023-01-01T00:00:00Z"
    expected: invalid
    error_expected: "Active subscription cannot have past end_date"

  - entity: User
    scenario: deleted_user_with_active_orders
    record:
      id: "edge_user_001"
      status: "deleted"
      active_order_count: 3
    expected: invalid
    error_expected: "Deleted users cannot have active orders"

  - entity: Payment
    scenario: failed_payment_with_transaction_id
    record:
      id: "edge_payment_001"
      status: "failed"
      transaction_id: "txn_123456"
    expected: invalid
    error_expected: "Failed payments should not have transaction_id"
```

### 4. Generate Constraint Violation Edge Cases

#### 4.1 Identify Constraint Types

From schemas and domain rules:

**Unique Constraints:**
- Duplicate email addresses
- Duplicate SKU/product codes
- Duplicate order numbers

**Foreign Key Constraints:**
- Reference to non-existent parent (orphaned record)
- Cascade delete violations

**Check Constraints:**
- start_date > end_date (temporal violation)
- quantity < 0 (negative stock)
- debit ≠ credit (financial balance violation)

#### 4.2 Create Constraint Violations Dataset

**eval/unit/edge-cases/constraint-violations.yaml:**

```yaml
edge_case_type: Constraint Violations
description: Test data that violates database and business constraints
generated_at: 2024-01-15T13:00:00Z

test_cases:
  # Unique constraint violations
  - entity: User
    scenario: duplicate_email
    record:
      id: "edge_user_002"
      email: "existing.user@example.com"  # Already exists
    expected: invalid
    error_expected: "Email already exists"

  - entity: Product
    scenario: duplicate_sku
    record:
      id: "edge_product_001"
      sku: "PROD-12345"  # Already exists
    expected: invalid
    error_expected: "SKU must be unique"

  # Foreign key constraint violations
  - entity: Order
    scenario: invalid_user_reference
    record:
      id: "edge_order_003"
      user_id: "00000000-0000-0000-0000-000000000000"  # Non-existent
    expected: invalid
    error_expected: "User does not exist"

  - entity: OrderItem
    scenario: orphaned_order_item
    record:
      id: "edge_item_001"
      order_id: "99999999-9999-9999-9999-999999999999"  # Non-existent
      product_id: "valid_product_id"
    expected: invalid
    error_expected: "Order does not exist"

  # Temporal constraint violations
  - entity: Subscription
    scenario: end_before_start
    record:
      id: "edge_sub_003"
      start_date: "2024-01-15T00:00:00Z"
      end_date: "2024-01-10T00:00:00Z"  # Before start
    expected: invalid
    error_expected: "End date must be after start date"

  - entity: Event
    scenario: updated_before_created
    record:
      id: "edge_event_001"
      created_at: "2024-01-15T10:00:00Z"
      updated_at: "2024-01-15T09:00:00Z"  # Before created
    expected: invalid
    error_expected: "Updated date cannot be before created date"

  # Business rule violations
  - entity: Transaction
    scenario: unbalanced_transaction
    record:
      id: "edge_txn_001"
      debit_amount: 100.00
      credit_amount: 95.00  # Mismatch
    expected: invalid
    error_expected: "Debit and credit amounts must match"

  - entity: Product
    scenario: negative_stock
    record:
      id: "edge_product_002"
      stock: -5
    expected: invalid
    error_expected: "Stock cannot be negative"

  - entity: Order
    scenario: total_mismatch
    record:
      id: "edge_order_004"
      items_total: 100.00
      tax: 10.00
      shipping: 5.00
      total: 110.00  # Should be 115.00
    expected: invalid
    error_expected: "Order total must equal items + tax + shipping"
```

### 5. Generate Error Condition Edge Cases

#### 5.1 Identify Error Scenarios

Common error conditions:

**Missing Required Fields:**
- User without email
- Order without user_id
- Product without price

**Type Mismatches:**
- String value in numeric field
- Invalid date format
- Boolean as string

**Malformed Data:**
- Invalid JSON structure
- Corrupt file uploads
- SQL injection attempts (sanitization tests)
- XSS payloads (escaping tests)

#### 5.2 Create Error Conditions Dataset

**eval/unit/edge-cases/error-conditions.yaml:**

```yaml
edge_case_type: Error Conditions
description: Test data for error handling and validation
generated_at: 2024-01-15T13:00:00Z

test_cases:
  # Missing required fields
  - entity: User
    scenario: missing_email
    record:
      id: "edge_user_003"
      name: "John Doe"
      # email is missing
    expected: invalid
    error_expected: "Email is required"

  - entity: Order
    scenario: missing_user_id
    record:
      id: "edge_order_005"
      total: 99.99
      # user_id is missing
    expected: invalid
    error_expected: "User ID is required"

  # Type mismatches
  - entity: Product
    scenario: string_price
    record:
      id: "edge_product_003"
      name: "Widget"
      price: "not-a-number"
    expected: invalid
    error_expected: "Price must be a number"

  - entity: User
    scenario: invalid_date_type
    record:
      id: "edge_user_004"
      email: "user@example.com"
      created_at: "not-a-date"
    expected: invalid
    error_expected: "Invalid date format"

  # Malformed data / Security tests
  - entity: User
    scenario: sql_injection_attempt
    record:
      id: "edge_user_005"
      email: "'; DROP TABLE users;--"
      name: "Malicious User"
    expected: invalid_or_sanitized
    error_expected: "Invalid email format"
    security_note: "Should be sanitized/escaped, not executed"

  - entity: Product
    scenario: xss_payload
    record:
      id: "edge_product_004"
      name: "<script>alert('XSS')</script>"
      description: "Normal description"
    expected: sanitized
    error_expected: null
    security_note: "Should be escaped when rendered, not execute script"

  - entity: Review
    scenario: excessively_long_content
    record:
      id: "edge_review_001"
      content: "A" * 100000  # 100K characters
    expected: invalid
    error_expected: "Review content exceeds maximum length"
```

### 6. Generate Domain-Specific Edge Cases

#### 6.1 E-Commerce Edge Cases

```yaml
# eval/unit/edge-cases/domain-ecommerce.yaml
edge_case_type: E-Commerce Domain Edge Cases

test_cases:
  - scenario: cart_with_zero_items
    record:
      cart_id: "edge_cart_001"
      items_count: 0
    expected: invalid
    error_expected: "Cart must contain at least one item"

  - scenario: product_with_zero_price
    record:
      product_id: "edge_prod_005"
      price: 0.00
    expected: invalid
    error_expected: "Product price must be greater than zero"

  - scenario: order_quantity_exceeds_stock
    record:
      order_item_id: "edge_item_002"
      product_stock: 5
      quantity: 10
    expected: invalid
    error_expected: "Insufficient stock"
```

#### 6.2 Financial Edge Cases

```yaml
# eval/unit/edge-cases/domain-financial.yaml
edge_case_type: Financial Domain Edge Cases

test_cases:
  - scenario: transaction_with_mismatched_currency
    record:
      transaction_id: "edge_txn_002"
      source_currency: "USD"
      destination_currency: "EUR"
      exchange_rate: null
    expected: invalid
    error_expected: "Exchange rate required for cross-currency transactions"

  - scenario: negative_account_balance
    record:
      account_id: "edge_acc_001"
      balance: -100.00
    expected: invalid
    error_expected: "Insufficient funds"

  - scenario: duplicate_transaction_id
    record:
      transaction_id: "TXN-12345"  # Already exists
    expected: invalid
    error_expected: "Duplicate transaction"
```

### 7. Create Edge Case Index and Documentation

#### 7.1 Create Index File

**eval/unit/edge-cases/index.yaml:**

```yaml
edge_case_datasets:
  generated_at: 2024-01-15T13:00:00Z
  total_categories: 6
  total_test_cases: 45

  categories:
    - name: Boundary Values
      file: boundary-values.yaml
      test_count: 12
      purpose: Test limits and ranges

    - name: Invalid States
      file: invalid-states.yaml
      test_count: 8
      purpose: Test state machine violations

    - name: Constraint Violations
      file: constraint-violations.yaml
      test_count: 10
      purpose: Test database and business constraints

    - name: Error Conditions
      file: error-conditions.yaml
      test_count: 8
      purpose: Test error handling and validation

    - name: E-Commerce Domain
      file: domain-ecommerce.yaml
      test_count: 3
      purpose: Test e-commerce specific edge cases

    - name: Financial Domain
      file: domain-financial.yaml
      test_count: 4
      purpose: Test financial domain edge cases
```

#### 7.2 Create README

**eval/unit/edge-cases/README.md:**

```markdown
# Edge Case Test Data

Comprehensive edge cases for boundary, error, and negative testing.

## Categories

### 1. Boundary Values
Tests data at the edges of valid ranges.
- Minimum/maximum values
- Empty/null values
- Length limits
- Precision limits

### 2. Invalid States
Tests logically invalid state combinations.
- Invalid state transitions
- Inconsistent state data
- Missing required relationships

### 3. Constraint Violations
Tests database and business constraints.
- Unique constraint violations
- Foreign key violations
- Temporal constraint violations
- Business rule violations

### 4. Error Conditions
Tests error handling and validation.
- Missing required fields
- Type mismatches
- Malformed data
- Security payloads (XSS, SQL injection)

### 5. Domain-Specific Edge Cases
Tests domain-specific error scenarios.
- E-commerce: cart, inventory, pricing
- Financial: transactions, balances, currencies

## Usage

```typescript
import { readFileSync } from 'fs';
import { parse } from 'yaml';

const boundaryTests = parse(
  readFileSync('eval/unit/edge-cases/boundary-values.yaml', 'utf8')
);

describe('Boundary Value Tests', () => {
  boundaryTests.test_cases.forEach(testCase => {
    it(`should handle ${testCase.scenario}`, async () => {
      const result = await validateEntity(testCase.entity, testCase.record);

      if (testCase.expected === 'invalid') {
        expect(result.isValid).toBe(false);
        expect(result.error).toContain(testCase.error_expected);
      } else {
        expect(result.isValid).toBe(true);
      }
    });
  });
});
```

## Test Coverage

| Category | Test Cases | Coverage |
|----------|------------|----------|
| Boundary Values | 12 | Numeric, string, date, email limits |
| Invalid States | 8 | State machines, data consistency |
| Constraint Violations | 10 | Unique, FK, temporal, business rules |
| Error Conditions | 8 | Missing fields, types, security |
| Domain-Specific | 7 | E-commerce, financial rules |

**Total: 45 edge case scenarios**
```

### 8. Validation and Summary

#### 8.1 Validate Edge Cases

- Verify all edge cases have expected outcomes defined
- Ensure error messages are descriptive
- Check security test cases are marked appropriately
- Validate YAML syntax

#### 8.2 Generate Summary Report

Present to user:

```
✓ Edge Case Data Generated Successfully

Categories: 6
Total Test Cases: 45

Files Created:
- eval/unit/edge-cases/boundary-values.yaml (12 cases)
- eval/unit/edge-cases/invalid-states.yaml (8 cases)
- eval/unit/edge-cases/constraint-violations.yaml (10 cases)
- eval/unit/edge-cases/error-conditions.yaml (8 cases)
- eval/unit/edge-cases/domain-ecommerce.yaml (3 cases)
- eval/unit/edge-cases/domain-financial.yaml (4 cases)
- eval/unit/edge-cases/index.yaml (catalog)
- eval/unit/edge-cases/README.md (documentation)

Coverage:
- Boundary Values: ✓ Numeric, string, date, email
- Invalid States: ✓ State transitions, data consistency
- Constraint Violations: ✓ Unique, FK, temporal, business
- Error Handling: ✓ Missing fields, types, malformed data
- Security: ✓ SQL injection, XSS payloads
- Domain-Specific: ✓ E-commerce, financial rules

Format: YAML
Usage: Negative testing, error handling validation
```

## Error Handling

- **Missing Constraints**: Generate generic edge cases only
- **Unknown Domain**: Omit domain-specific edge cases
- **Security Tests**: Include sanitization expectations

## Success Criteria

- [ ] Boundary value tests cover all numeric, string, date fields
- [ ] Invalid state tests cover all state machines
- [ ] Constraint violation tests cover unique, FK, and business rules
- [ ] Error condition tests cover missing fields and type mismatches
- [ ] Security tests include XSS and SQL injection scenarios
- [ ] Domain-specific edge cases included
- [ ] All test cases have expected outcomes defined
- [ ] YAML format valid
- [ ] Documentation complete with usage examples
