<!-- Powered by BMAD™ Core -->

# Generate Unit Test Data Task

## Purpose

To generate small, curated synthetic datasets (50 records per entity) optimized for unit testing. These datasets cover happy paths, common scenarios, and basic variations while maintaining referential integrity and domain compliance. Outputs are in YAML format for readability and manual inspection.

## Input Parameters

- `domain_context`: Domain analysis results from analyze-domain-for-eval task
- `entity_schemas`: Entity schema definitions from eval/schemas/
- `target_count`: Number of records per entity (default: 50)

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Initialize Unit Data Generation

#### 1.1 Load Configuration

- Load `eval/config.yaml` for generation settings
- Extract target record count (default: 50 per entity)
- Load entity schemas from `eval/schemas/*.yaml`
- Load relationships from `eval/schemas/relationships.yaml`
- Load constraints from `eval/schemas/constraints.yaml`

#### 1.2 Load Data Generation Patterns

- Load `{root}/data/data-generation-patterns.md` for realistic value generation
- Load `{root}/data/domain-constraints.md` for domain-specific rules
- Prepare value generators for common types (names, emails, dates, etc.)

#### 1.3 Determine Entity Generation Order

- Analyze entity relationships
- Create dependency graph (entities with no foreign keys first)
- Determine generation order to satisfy referential integrity:
  1. Independent entities (no foreign keys)
  2. Dependent entities (has foreign keys to independent)
  3. Junction tables (many-to-many relationships)

### 2. Generate Independent Entity Data

#### 2.1 For Each Independent Entity

Process entities in dependency order (independent first):

**Initialize Record Set:**
- Create empty list for entity records
- Set target count from config (default: 50)

**Generate Happy Path Records (60% of dataset):**
- For each record (1 to target_count * 0.6):
  - Generate all required fields with valid values
  - Generate optional fields (50% probability)
  - Apply realistic value distributions from patterns
  - Ensure uniqueness for unique constraints
  - Example: User with valid email, name, age 25-45 (normal distribution)

**Generate Edge-Of-Valid Records (30% of dataset):**
- Boundary values that are still valid:
  - Minimum valid values (age: 18, quantity: 1)
  - Maximum valid values (age: 120, length: max_length)
  - Empty strings for optional text fields
  - Minimum date ranges (today, start of year)
  - Special characters in text (apostrophes, accents, unicode)

**Generate Variation Records (10% of dataset):**
- Valid but unusual combinations:
  - All optional fields populated
  - All optional fields null
  - Mixed case variations
  - Different locale formats (dates, numbers)

#### 2.2 Apply Domain-Specific Patterns

Load domain patterns from `{root}/data/domain-constraints.md`:

**E-Commerce:**
- Product prices: Normal distribution around median, 2 decimal precision
- Categories: Realistic distribution (80/20 rule for popular categories)
- Inventory: Mostly in stock (90%), some low stock (8%), few out of stock (2%)

**Financial:**
- Account numbers: Valid format per domain rules
- Balances: Realistic distribution (most moderate, few high-value)
- Transaction amounts: Power law distribution

**Healthcare:**
- Patient ages: Bimodal (pediatric peak, elderly peak)
- Diagnosis codes: Valid ICD-10 codes
- Medications: Real drug names with proper dosages

**SaaS:**
- User roles: Admin (5%), Manager (15%), User (80%)
- Subscription tiers: Free (60%), Pro (30%), Enterprise (10%)
- Feature flags: Realistic adoption curves

#### 2.3 Ensure Data Realism

Apply realistic constraints:

**Temporal Realism:**
- created_at: Distributed over past 1-2 years
- updated_at: >= created_at, recent activity weighted toward recent dates
- Birthdays: Valid age ranges, no future dates

**Geographic Realism:**
- Country codes: From actual list, weighted by population
- Postal codes: Valid format per country
- Phone numbers: Valid format per country

**Text Realism:**
- Names: From realistic name lists (locale-appropriate)
- Emails: Derived from names + common domains
- Descriptions: Varied length (50-500 chars), realistic content

**Numeric Realism:**
- Prices: Psychological pricing ($9.99, $19.95)
- Quantities: Whole numbers, realistic ranges
- Percentages: 0-100, common values (0, 25, 50, 75, 100)

### 3. Generate Dependent Entity Data

#### 3.1 For Each Dependent Entity

Process entities with foreign keys:

**Generate Foreign Key References:**
- For each dependent record:
  - Select valid parent record from already-generated data
  - Use realistic distribution (80/20 rule: 20% of parents get 80% of children)
  - Ensure foreign key exists in parent table
  - Example: 80% of orders belong to 20% of users (power users)

**Apply Cascade Rules:**
- Honor cascade delete constraints (if parent deleted, children removed)
- Honor restrict constraints (ensure parent exists)
- Honor set null constraints (allow null foreign keys where specified)

**Maintain Relationship Cardinality:**
- One-to-one: Each child has exactly one parent, each parent max one child
- One-to-many: Each child has one parent, parents can have multiple children
- Many-to-many: Junction table created with valid pairs

#### 3.2 Generate Realistic Relationship Patterns

**User-Order Relationship (one-to-many):**
- New users: 0-1 orders (70% of users)
- Active users: 2-5 orders (25% of users)
- Power users: 6-20 orders (5% of users)

**Order-OrderItem Relationship (one-to-many):**
- Small orders: 1-2 items (60%)
- Medium orders: 3-5 items (30%)
- Large orders: 6-15 items (10%)

**User-Role Relationship (many-to-many):**
- Single role: 80% of users
- Multiple roles: 20% of users (2-3 roles)

### 4. Apply Domain Constraints and Business Rules

#### 4.1 Validate Business Rules

For each generated record set:

**Financial Domain:**
- Ensure debits = credits for transactions
- Balance = sum(credits) - sum(debits)
- Currency precision: 2 decimals

**E-Commerce:**
- Order.total = sum(OrderItem.price * OrderItem.quantity) + tax + shipping
- Product.stock >= 0
- Order.quantity <= Product.stock (at order time)

**Healthcare:**
- Prescription.date >= Diagnosis.date
- Patient.age valid for pediatric/adult medications
- Provider has valid license_number

**SaaS:**
- User.plan determines feature access
- Organization.user_limit >= Organization.active_users
- Subscription.end_date > Subscription.start_date

#### 4.2 Validate State Machines

Ensure valid state transitions:

**Order Status:**
- Sequence: pending → confirmed → shipped → delivered
- Allow: pending → cancelled, confirmed → cancelled
- Disallow: shipped → pending, delivered → confirmed

**Subscription Status:**
- Sequence: trial → active → expired/cancelled
- trial: start_date is recent, end_date in near future
- active: billing current, no end_date
- expired: end_date in past

### 5. Format and Save Data

#### 5.1 Format as YAML

For each entity, create YAML structure:

```yaml
# eval/unit/entities/users.yaml
entity: User
count: 50
generated_at: 2024-01-15T10:30:00Z

records:
  - id: 550e8400-e29b-41d4-a716-446655440000
    email: alice.johnson@example.com
    name: Alice Johnson
    age: 32
    created_at: 2023-03-15T08:22:11Z
    updated_at: 2023-11-20T14:35:22Z

  - id: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
    email: bob.smith@example.com
    name: Bob Smith
    age: 45
    created_at: 2023-01-08T11:45:33Z
    updated_at: 2024-01-10T09:12:05Z
```

#### 5.2 Save Entity Files

- Save each entity to: `eval/unit/entities/{entity_name}.yaml`
- Ensure proper YAML formatting and indentation
- Include metadata: entity name, count, generation timestamp
- Validate YAML syntax before saving

#### 5.3 Create Cross-Reference Index

Create `eval/unit/entities/index.yaml`:

```yaml
unit_test_data:
  generated_at: 2024-01-15T10:30:00Z
  total_entities: 5
  total_records: 250

  entities:
    - name: User
      file: users.yaml
      count: 50
      primary_key: id

    - name: Product
      file: products.yaml
      count: 50
      primary_key: id

    - name: Order
      file: orders.yaml
      count: 50
      foreign_keys:
        - field: user_id
          references: User.id
```

### 6. Create Unit Test README

#### 6.1 Generate Usage Documentation

Create `eval/unit/README.md`:

```markdown
# Unit Test Datasets

Small, curated datasets for unit testing (50 records per entity).

## Contents

- **entities/**: Individual entity datasets
  - users.yaml (50 users)
  - products.yaml (50 products)
  - orders.yaml (50 orders)
  - ...

## Data Characteristics

- **Coverage**: Happy paths (60%), edge-of-valid (30%), variations (10%)
- **Realism**: Domain-compliant data with realistic distributions
- **Integrity**: All foreign keys reference valid parent records
- **Format**: YAML for readability and manual inspection

## Usage

```python
# Python example
import yaml

with open('eval/unit/entities/users.yaml') as f:
    data = yaml.safe_load(f)
    users = data['records']

# Use in tests
def test_user_creation():
    user_data = users[0]
    user = User.create(**user_data)
    assert user.email == user_data['email']
```

## Data Scenarios

### Happy Path Examples
- Standard user with all required fields
- Active order with valid items
- In-stock product with positive inventory

### Edge Cases Included
- Users at minimum age (18)
- Products at minimum price ($0.01)
- Orders with single item
- Optional fields null vs populated

### Validation Points
- All emails unique and valid format
- All timestamps chronological (created_at < updated_at)
- All foreign keys reference existing records
- All business rules satisfied
```

#### 6.2 Include Data Statistics

Add statistics section to README:

```markdown
## Dataset Statistics

| Entity | Count | Relationships | Constraints |
|--------|-------|---------------|-------------|
| User | 50 | → Orders | email unique |
| Product | 50 | → OrderItems | stock >= 0 |
| Order | 50 | → User, → OrderItems | total calculated |
| OrderItem | 150 | → Order, → Product | qty > 0 |

**Distribution Highlights:**
- Users: 70% new (0-1 orders), 25% active (2-5 orders), 5% power (6+ orders)
- Products: 80/20 category distribution
- Orders: 60% small (1-2 items), 30% medium (3-5 items), 10% large (6+ items)
```

### 7. Validation and Summary

#### 7.1 Validate Generated Data

- Check record counts match target (50 per entity)
- Verify all required fields populated
- Verify all foreign keys resolve
- Verify all unique constraints satisfied
- Verify all domain constraints met
- Verify YAML syntax valid

#### 7.2 Generate Summary Report

Present to user:

```
✓ Unit Test Data Generated Successfully

Entities: [count]
Total Records: [count]

Files Created:
- eval/unit/entities/users.yaml (50 records)
- eval/unit/entities/products.yaml (50 records)
- eval/unit/entities/orders.yaml (50 records)
- ... (additional entities)
- eval/unit/entities/index.yaml (cross-reference)
- eval/unit/README.md (documentation)

Data Characteristics:
- Happy Paths: 60%
- Edge-of-Valid: 30%
- Variations: 10%

Validation:
- Referential Integrity: ✓ PASSED
- Domain Constraints: ✓ PASSED
- Unique Constraints: ✓ PASSED
- YAML Format: ✓ PASSED
```

## Error Handling

- **Missing Schema**: HALT, request schema definition
- **Circular Dependencies**: Detect and break with nullable foreign keys
- **Constraint Conflicts**: Report conflict, ask user to resolve
- **Value Generation Failure**: Fallback to safe default values

## Success Criteria

- [ ] 50 records generated per entity (or configured count)
- [ ] All required fields populated with valid values
- [ ] All foreign keys reference existing parent records
- [ ] All unique constraints satisfied (no duplicates)
- [ ] All domain constraints and business rules met
- [ ] YAML format valid and readable
- [ ] Documentation complete with usage examples
