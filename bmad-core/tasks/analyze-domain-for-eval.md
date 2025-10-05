<!-- Powered by BMAD™ Core -->

# Analyze Domain for Evaluation Task

## Purpose

To extract comprehensive domain context from project documentation (Project Brief, PRD, Architecture) for generating realistic synthetic datasets. This task identifies domain type, entities, relationships, constraints, and business rules through automated pattern detection, falling back to user elicitation when necessary.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Locate and Load Project Documentation

#### 1.1 Load Core Configuration

- Load `{root}/core-config.yaml`
- Extract document locations:
  - `prdFile` or `prdShardedLocation/index.md`
  - `architectureFile` or `architectureShardedLocation/index.md`
- Note: Project brief typically at `docs/project-brief.md` (fallback check)

#### 1.2 Load Available Documentation

Load documents in priority order (stop when domain context is sufficient):

1. **Project Brief** (`docs/project-brief.md`)
   - Read sections: Domain, Problem Statement, Target Users, Use Cases

2. **PRD** (from core-config location)
   - Read sections: Overview, Functional Requirements, User Stories, Data Models

3. **Architecture** (from core-config location)
   - If sharded: Read `data-models.md`, `database-schema.md`, `rest-api-spec.md`
   - If monolithic: Read Data Models and Database sections

#### 1.3 Aggregate Content for Analysis

- Combine all loaded content into analysis context
- Track which documents were found and loaded
- Note any missing documents for later user elicitation if needed

### 2. Auto-Detect Domain Type

#### 2.1 Apply Domain Pattern Matching

Load `{root}/data/domain-constraints.md` for domain patterns.

Search documentation for domain-specific indicators:

**E-Commerce/Retail:**
- Keywords: product, cart, checkout, order, inventory, payment, shipping, SKU, catalog
- Entities: Product, Order, Customer, Cart, Payment, Inventory
- Patterns: Product → Cart → Order workflow

**Financial/Fintech:**
- Keywords: account, transaction, balance, ledger, debit, credit, payment, transfer, wallet
- Entities: Account, Transaction, Ledger, Payment, User, Balance
- Patterns: Double-entry accounting, transaction logs

**Healthcare:**
- Keywords: patient, diagnosis, prescription, treatment, appointment, medical record, provider
- Entities: Patient, Appointment, Prescription, Diagnosis, Provider
- Patterns: Patient → Appointment → Diagnosis → Treatment

**SaaS/B2B:**
- Keywords: subscription, plan, tenant, organization, user, license, feature flag, usage
- Entities: Organization, User, Subscription, Plan, Usage
- Patterns: Multi-tenancy, subscription lifecycle

**Social/Content Platform:**
- Keywords: post, comment, like, follow, feed, user, content, engagement
- Entities: User, Post, Comment, Like, Follow
- Patterns: User-generated content, social graph

**Logistics/Supply Chain:**
- Keywords: shipment, warehouse, delivery, tracking, route, inventory, supplier
- Entities: Shipment, Warehouse, Order, Route, Supplier
- Patterns: Order → Fulfillment → Delivery

**Education/Learning:**
- Keywords: course, student, instructor, assignment, grade, enrollment, curriculum
- Entities: Student, Course, Instructor, Assignment, Enrollment
- Patterns: Enrollment → Course → Assessment

**General/Custom:**
- Keywords: entity, model, resource, object, data
- Entities: Extracted from data models section
- Patterns: Generic CRUD operations

#### 2.2 Calculate Domain Confidence Score

For each domain type:
- Count keyword matches (weight: 1 point each)
- Count entity matches (weight: 2 points each)
- Count pattern matches (weight: 3 points each)
- Calculate total score

**Decision Rules:**
- If highest score ≥ 15 points: High confidence detection
- If highest score 8-14 points: Medium confidence (confirm with user)
- If highest score < 8 points: Low confidence (elicit from user)

#### 2.3 Present Detection Results

**If High Confidence:**
- Present: "Domain Type Detected: [domain] (confidence: high)"
- List: Key indicators found (top 5 keywords/entities)
- Ask: "Is this domain type correct? (yes/no)"
- If 'yes', proceed to Step 3
- If 'no', proceed to Step 2.4

**If Medium Confidence:**
- Present: "Possible Domain Type: [domain] (confidence: medium)"
- Present: Top 2-3 candidate domains with scores
- Ask: "Select domain type: 1) [option 1] 2) [option 2] 3) [option 3] 4) Other (specify)"
- Proceed to Step 3 with selected domain

**If Low Confidence:**
- Present: "Could not auto-detect domain type"
- Proceed directly to Step 2.4 for user elicitation

#### 2.4 Elicit Domain Type from User

Execute `{root}/tasks/advanced-elicitation.md` with prompt:

```
I need to understand your project's domain to generate realistic test datasets.

Please specify your domain type:

1. E-Commerce/Retail
2. Financial/Fintech
3. Healthcare
4. SaaS/B2B Platform
5. Social/Content Platform
6. Logistics/Supply Chain
7. Education/Learning
8. Other (please describe)

Your selection: [number or description]
```

- Parse user response
- If 'Other', ask for domain description and key characteristics
- Store domain type for subsequent steps

### 3. Extract Entities and Data Models

#### 3.1 Identify Core Entities

**From PRD/Architecture Data Models:**
- Extract entity names from:
  - Data Models section
  - Database Schema section
  - Entity-Relationship diagrams (if present)
  - API specifications (resource types)

**Pattern-Based Extraction:**
- Look for: "entity", "model", "table", "resource", "object"
- Extract nouns following these keywords
- Identify capitalized terms in technical sections

**Domain-Specific Entities:**
- Load expected entities from `{root}/data/domain-constraints.md` for detected domain
- Cross-reference with found entities
- Flag expected entities that are missing (may need user confirmation)

#### 3.2 Extract Entity Attributes

For each identified entity:

**From Database Schema sections:**
- Field names
- Data types (string, integer, boolean, date, etc.)
- Constraints (required, unique, indexed)
- Default values

**From Data Models sections:**
- Property definitions
- Validation rules (min/max, regex patterns)
- Relationships to other entities

**From API Specifications:**
- Request/response fields
- Required vs optional fields
- Field formats and examples

#### 3.3 Compile Entity Definitions

Create structured entity definition for each:

```yaml
entity_name: User
attributes:
  - name: id
    type: uuid
    required: true
    unique: true
  - name: email
    type: string
    required: true
    unique: true
    format: email
  - name: created_at
    type: datetime
    required: true
    default: now
```

### 4. Extract Relationships

#### 4.1 Identify Relationship Types

**One-to-One:**
- Keywords: "has one", "belongs to one", "unique reference"
- Example: User has one Profile

**One-to-Many:**
- Keywords: "has many", "contains multiple", "array of"
- Example: User has many Orders

**Many-to-Many:**
- Keywords: "many-to-many", "junction table", "association table"
- Example: Users follow many Users (self-referential)

#### 4.2 Extract Foreign Key Relationships

From database schema:
- Identify foreign key constraints
- Extract: source table, target table, cascade rules

From data models:
- Identify reference fields (user_id, product_id, etc.)
- Infer relationships from naming conventions

#### 4.3 Create Relationship Map

```yaml
relationships:
  - from: Order
    to: User
    type: many-to-one
    foreign_key: user_id
    cascade: restrict

  - from: Order
    to: OrderItem
    type: one-to-many
    foreign_key: order_id
    cascade: delete
```

### 5. Extract Domain Constraints and Business Rules

#### 5.1 Identify Data Constraints

**From validation rules:**
- Value ranges (age 18-120, quantity > 0)
- Format requirements (phone, email, postal code)
- Enumerated values (status: pending|approved|rejected)

**From business logic:**
- Conditional requirements (if premium, then feature_limit = null)
- Cross-field validations (end_date > start_date)
- State machine rules (order status transitions)

#### 5.2 Extract Domain-Specific Rules

Load patterns from `{root}/data/domain-constraints.md`:

**Financial Domain:**
- Debit = Credit (balanced transactions)
- Transaction immutability after posting
- Currency precision (2 decimals)

**E-Commerce:**
- Stock levels ≥ 0
- Order total = sum(line items) + tax + shipping
- Price > 0

**Healthcare:**
- Valid diagnosis codes (ICD-10)
- Prescription requires licensed provider
- Patient age validation for pediatric records

#### 5.3 Identify Temporal Constraints

- created_at < updated_at
- Event sequences (order_date < ship_date < delivery_date)
- Validity periods (start_date ≤ today ≤ end_date)
- Audit trail requirements

#### 5.4 Compile Constraint Rules

```yaml
constraints:
  entity: Order
  rules:
    - field: total
      constraint: "total = sum(order_items.price * order_items.quantity)"
    - field: status
      constraint: "status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')"
      state_machine:
        - from: pending
          to: [confirmed, cancelled]
        - from: confirmed
          to: [shipped, cancelled]
        - from: shipped
          to: [delivered]
```

### 6. Determine Data Distributions and Patterns

#### 6.1 Identify Value Distributions

Load patterns from `{root}/data/data-generation-patterns.md`:

**Power Law (Zipf) Distributions:**
- User activity (80% from 20% of users)
- Product popularity
- Content engagement

**Normal Distributions:**
- Age, height, weight
- Order values (with median and std dev)
- Response times

**Categorical Distributions:**
- Gender, status, category (with probabilities)
- Geographic distribution (by region, country)

**Temporal Patterns:**
- Weekday vs weekend activity
- Seasonal variations
- Business hours vs off-hours

#### 6.2 Extract Sample Data Hints

From documentation:
- Example values provided
- Test data references
- User story scenarios (typical values mentioned)

From API specifications:
- Example request/response bodies
- Sample data in schemas

### 7. Compile Domain Analysis Results

#### 7.1 Create Domain Context Structure

```yaml
domain_analysis:
  domain_type: [detected or user-specified domain]
  confidence: [high|medium|low]
  detection_method: [auto|user_specified]

  entities:
    - name: [entity name]
      attributes: [...]
      primary_key: [field]
      indices: [...]

  relationships:
    - from: [entity]
      to: [entity]
      type: [one-to-one|one-to-many|many-to-many]
      foreign_key: [field]
      cascade: [delete|restrict|set_null]

  constraints:
    - entity: [entity]
      rules: [constraint definitions]

  business_rules:
    - rule: [description]
      entities: [affected entities]
      validation: [validation logic]

  data_patterns:
    - entity: [entity]
      field: [field]
      distribution: [normal|zipf|categorical|uniform]
      parameters: [mean, stddev, etc.]

  domain_specific:
    [domain-specific metadata, e.g., currency codes, region lists, etc.]
```

#### 7.2 Validate Completeness

Check that domain analysis includes:
- [ ] At least 3 core entities identified
- [ ] Attributes defined for each entity
- [ ] Relationships mapped between entities
- [ ] At least 5 domain constraints identified
- [ ] Data distributions suggested for key fields
- [ ] Domain-specific rules captured

#### 7.3 Flag Gaps for User Input

If critical information missing:
- List missing elements
- Execute `{root}/tasks/advanced-elicitation.md` to gather:
  - Missing entity attributes
  - Unclear relationships
  - Undefined constraints

### 8. Return Domain Context

#### 8.1 Present Summary to User

```
Domain Analysis Complete

Domain Type: [type]
Confidence: [high/medium/low]

Entities Identified: [count]
- [entity 1], [entity 2], [entity 3], ...

Relationships: [count]
- [relationship summary]

Constraints: [count]
- [key constraint examples]

Data Patterns:
- [distribution patterns identified]

Ready for dataset generation.
```

#### 8.2 Store Analysis Results

- Save to temporary context variable: `domain_context`
- Available for subsequent task calls
- Optionally save to `eval/domain-analysis.yaml` for reference

#### 8.3 Return Status

- Return: SUCCESS with domain_context
- If critical gaps remain: Return PARTIAL with domain_context + gap list
- If analysis failed: Return FAILED with error details

## Error Handling

- **No Documentation Found**: Elicit all domain information from user
- **Ambiguous Domain**: Present top candidates, ask user to select
- **Missing Entity Details**: Elicit specific attributes from user
- **Conflicting Rules**: Present conflicts, ask user to resolve

## Success Criteria

- [ ] Domain type identified (auto-detected or user-specified)
- [ ] At least 3 core entities extracted with attributes
- [ ] Entity relationships mapped
- [ ] Domain constraints and business rules captured
- [ ] Data distribution patterns identified
- [ ] Analysis results structured and ready for dataset generation
