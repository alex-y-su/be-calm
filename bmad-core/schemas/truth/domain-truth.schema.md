# Domain Truth Schema Specification

**Version:** 1.0
**Date:** 2025-10-04
**Purpose:** Define the immutable domain requirements that serve as Level 0 truth
**Scope:** Greenfield projects (for brownfield, see existing-system-truth.schema.md)

---

## Overview

The `domain-truth.yaml` file captures **what the domain requires** in an empirically verifiable format. This is the immutable foundation that all other artifacts must trace to and validate against.

### Key Principles

1. **Empirical Validation** - All domain statements must be testable/verifiable
2. **Immutability** - Once established, domain truth doesn't change (though understanding may deepen)
3. **Traceability** - Every derived artifact must reference domain truth elements
4. **Completeness** - Sufficient detail for validation, not implementation

---

## Schema Structure

```yaml
# domain-truth.yaml

metadata:
  version: string                    # Semantic version (e.g., "1.0.0")
  created_date: ISO8601              # When domain truth was established
  last_validated: ISO8601            # Last validation check
  domain_name: string                # Clear, unique domain identifier
  project_id: string                 # Optional project identifier
  authors: [string]                  # Who defined this domain truth
  validation_status: enum            # [draft, validated, production]

domain:
  name: string                       # Domain name (e.g., "E-Commerce Checkout")
  description: string                # Clear domain description (1-3 paragraphs)
  scope:
    included: [string]               # What IS in scope
    excluded: [string]               # What is NOT in scope
    boundaries: [string]             # Domain boundaries and interfaces

  glossary:                          # Domain-specific terminology
    - term: string
      definition: string
      aliases: [string]
      validation_criteria: string    # How to verify correct usage

concepts:                            # Domain entities and their properties
  - id: string                       # Unique concept ID (e.g., "CONCEPT-001")
    name: string                     # Concept name (e.g., "Shopping Cart")
    type: enum                       # [entity, value_object, aggregate, event, service]
    description: string              # What this concept represents

    properties:
      - name: string                 # Property name
        type: string                 # Data type
        required: boolean
        constraints: [string]        # Validation rules
        validation_test_id: string   # Reference to test dataset

    relationships:
      - related_to: string           # Concept ID
        type: enum                   # [one-to-one, one-to-many, many-to-many]
        description: string
        constraints: [string]

    invariants:                      # Rules that must always be true
      - id: string                   # Invariant ID
        description: string
        validation_test_id: string   # Test that proves this invariant
        criticality: enum            # [critical, important, nice_to_have]

domain_rules:                        # Business logic and constraints
  - id: string                       # Rule ID (e.g., "RULE-001")
    name: string
    description: string
    type: enum                       # [business_logic, validation, calculation, workflow]

    preconditions: [string]          # What must be true before rule applies
    postconditions: [string]         # What must be true after rule executes

    formula: string                  # Optional: mathematical or logical formula
    examples:                        # Concrete examples
      - input: object
        expected_output: object
        test_dataset_id: string      # Reference to test dataset

    exceptions:                      # Edge cases and error conditions
      - condition: string
        handling: string
        test_dataset_id: string

    criticality: enum                # [critical, important, nice_to_have]
    validation_test_ids: [string]    # Tests that prove this rule

functional_requirements:             # What the system must do
  - id: string                       # FR ID (e.g., "FR-001")
    name: string
    description: string
    rationale: string                # Why this is required

    actors: [string]                 # Who interacts with this
    preconditions: [string]
    postconditions: [string]

    main_flow:                       # Happy path
      - step: string
        validation_point: string

    alternate_flows:                 # Variations
      - name: string
        steps: [string]

    exception_flows:                 # Error handling
      - condition: string
        steps: [string]

    acceptance_criteria:             # How to verify implementation
      - criterion: string
        test_dataset_id: string
        validation_method: enum      # [automated_test, manual_test, inspection]

    dependencies: [string]           # Other FR IDs this depends on
    priority: enum                   # [critical, high, medium, low]
    validation_test_ids: [string]

quality_attributes:                  # Non-functional requirements
  - category: enum                   # [performance, security, usability, reliability, etc.]
    attribute: string
    requirement: string
    measurement: string              # How to measure
    target: string                   # Target value/range
    validation_test_id: string
    priority: enum                   # [critical, high, medium, low]

constraints:                         # Limitations and boundaries
  - id: string
    type: enum                       # [technical, business, regulatory, resource]
    description: string
    impact: string
    mitigation: string               # Optional: how to work within constraint
    validation_method: string

assumptions:                         # Stated assumptions about domain
  - id: string
    description: string
    validation_status: enum          # [assumed, validated, invalidated]
    validation_test_id: string       # Optional: test that validates assumption
    risk_if_invalid: string

validation_linkage:
  eval_criteria_file: string         # Path to eval-criteria.yaml
  test_datasets_dir: string          # Path to test-datasets/
  validation_chain_file: string      # Path to validation-chain-proof.yaml

traceability:
  traces_to:                         # External domain authorities
    - source: string                 # e.g., "ISO 8601", "GDPR Article 17"
      description: string
      verification: string

  traced_by:                         # What artifacts derive from this
    - artifact_type: enum            # [prd, architecture, story, code]
      artifact_path: string
      elements: [string]             # Specific domain IDs referenced
```

---

## Usage Guidelines

### For Oracle Agent

When creating/maintaining domain truth:

1. **Establish Clear Scope** - Define boundaries explicitly
2. **Use Concrete Examples** - Every rule needs test cases
3. **Link to Validation** - Every assertion must be testable
4. **Capture Invariants** - What must ALWAYS be true
5. **Document Assumptions** - Make implicit knowledge explicit

### For Other Agents

When referencing domain truth:

1. **PM Agent** - PRD must trace FRs to domain FRs
2. **Architect Agent** - Design must satisfy domain rules and constraints
3. **SM Agent** - Stories must reference domain concepts and rules
4. **Dev Agent** - Code must implement domain rules correctly
5. **Eval Agent** - Tests must validate domain rules hold

### Validation Requirements

Every domain truth file must:

- [ ] Have at least one test dataset for each domain rule
- [ ] Link to eval-criteria.yaml for validation methods
- [ ] Provide concrete examples for all abstract rules
- [ ] Define clear acceptance criteria for all FRs
- [ ] Establish traceability to external authorities (if any)

---

## Examples

### Minimal Domain Truth (E-Commerce Cart)

```yaml
metadata:
  version: "1.0.0"
  created_date: "2025-10-04T10:00:00Z"
  domain_name: "Shopping Cart Management"
  validation_status: validated

domain:
  name: "Shopping Cart Management"
  description: "Manages shopping cart lifecycle from creation to checkout"
  scope:
    included:
      - "Add/remove items from cart"
      - "Calculate totals with tax"
      - "Apply discount codes"
    excluded:
      - "Payment processing"
      - "Inventory management"

concepts:
  - id: "CONCEPT-001"
    name: "ShoppingCart"
    type: entity
    description: "Container for items user intends to purchase"
    properties:
      - name: "items"
        type: "List<CartItem>"
        required: true
        constraints:
          - "items.length >= 0"
          - "items.length <= 100"
        validation_test_id: "TEST-DATASET-001"
    invariants:
      - id: "INV-001"
        description: "Cart total must equal sum of item totals plus tax"
        validation_test_id: "TEST-DATASET-002"
        criticality: critical

domain_rules:
  - id: "RULE-001"
    name: "Cart Total Calculation"
    description: "Calculate cart total including items, tax, and discounts"
    type: calculation
    formula: "total = sum(item.price * item.quantity) * (1 + tax_rate) - discount"
    examples:
      - input: {items: [{price: 10, qty: 2}], tax: 0.1, discount: 0}
        expected_output: {total: 22.00}
        test_dataset_id: "TEST-DATASET-003"
    criticality: critical
    validation_test_ids: ["TEST-DATASET-003", "TEST-DATASET-004"]

functional_requirements:
  - id: "FR-001"
    name: "Add Item to Cart"
    description: "User can add a product to their shopping cart"
    acceptance_criteria:
      - criterion: "Item appears in cart with correct quantity and price"
        test_dataset_id: "TEST-DATASET-005"
        validation_method: automated_test
    priority: critical
    validation_test_ids: ["TEST-DATASET-005"]

validation_linkage:
  eval_criteria_file: "eval-criteria.yaml"
  test_datasets_dir: "test-datasets/cart-management/"
  validation_chain_file: "validation-chain-proof.yaml"
```

---

## Migration from Existing PRDs

If you have existing requirements documents:

1. **Extract Domain Concepts** - Identify core entities
2. **Formalize Rules** - Convert narrative to testable rules
3. **Create Test Datasets** - Provide concrete examples
4. **Establish Traceability** - Link to validation
5. **Validate Completeness** - Ensure all requirements covered

---

## Related Schemas

- **eval-criteria.yaml** - Defines HOW to validate domain truth
- **validation-chain-proof.yaml** - Proves derived artifacts trace to domain truth
- **existing-system-truth.yaml** - For brownfield projects (what IS)
- **enhancement-truth.yaml** - For brownfield projects (what WILL change)

---

## Schema Validation

This schema can be validated using:

- YAML schema validators (JSON Schema)
- Custom validation tools (to be built in Stage 1)
- Oracle Agent validation checks
- Validator Agent continuous validation
