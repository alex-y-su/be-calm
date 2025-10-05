<!-- Powered by BMAD™ Core -->

# Generate Integration Test Data Task

## Purpose

To generate medium-sized synthetic datasets (500 records across entities) optimized for integration and workflow testing. These datasets emphasize realistic cross-entity relationships, multi-step workflows, and state transitions while maintaining referential integrity and domain compliance. Outputs are in YAML format for readability.

## Input Parameters

- `domain_context`: Domain analysis results from analyze-domain-for-eval task
- `entity_schemas`: Entity schema definitions from eval/schemas/
- `target_count`: Number of records across entities (default: 500 total)

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Initialize Integration Data Generation

#### 1.1 Load Configuration

- Load `eval/config.yaml` for generation settings
- Extract target record count (default: 500 across all entities)
- Load entity schemas from `eval/schemas/*.yaml`
- Load relationships from `eval/schemas/relationships.yaml`
- Load constraints from `eval/schemas/constraints.yaml`

#### 1.2 Load Data Generation Patterns

- Load `{root}/data/data-generation-patterns.md` for workflow patterns
- Load `{root}/data/domain-constraints.md` for domain-specific workflows
- Load unit test data from `eval/unit/entities/*.yaml` as reference for consistency

#### 1.3 Identify Key Workflows

Based on domain type, identify primary workflows:

**E-Commerce:**
- User Registration → Product Browse → Add to Cart → Checkout → Order Fulfillment
- Product Search → View Details → Add Review → Purchase

**Financial:**
- Account Creation → Deposit → Transfer → Withdrawal → Balance Check
- Loan Application → Approval → Disbursement → Repayment

**Healthcare:**
- Patient Registration → Appointment Booking → Diagnosis → Prescription → Follow-up

**SaaS:**
- User Signup → Onboarding → Feature Usage → Upgrade → Renewal
- Organization Creation → User Invitation → Role Assignment → Collaboration

### 2. Allocate Record Counts for Workflow Coverage

#### 2.1 Calculate Entity Distribution

From total 500 records, distribute based on relationship cardinality:

**Example E-Commerce Allocation:**
- Users: 100 (base entities)
- Products: 100 (base entities)
- Orders: 150 (1.5 orders per user avg)
- OrderItems: 300 (2 items per order avg)
- Reviews: 80 (some users leave reviews)
- CartItems: 50 (abandoned carts)

**Allocation Strategy:**
- Base entities: 15-20% of total each
- Dependent entities: 30-40% of total (based on cardinality ratios)
- Junction tables: 10-15% of total

#### 2.2 Define Workflow Scenarios

Create specific workflow scenarios to test:

**Scenario 1: Complete Purchase Flow (40% of data)**
- User → Browse Products → Add to Cart → Checkout → Order → Delivery

**Scenario 2: Partial Cart Abandonment (20% of data)**
- User → Browse Products → Add to Cart → [Abandon]

**Scenario 3: Review After Purchase (20% of data)**
- User → Order → Receive → Leave Review

**Scenario 4: Multi-Step Decision (20% of data)**
- User → Browse → Compare → Wishlist → Purchase Later

### 3. Generate Workflow-Based Data

#### 3.1 Generate Base Entities for Workflows

**Create User Personas for Different Workflow Paths:**
- New users (30%): Just registered, minimal activity
- Active users (50%): Multiple orders, reviews, cart activity
- Power users (15%): High order count, frequent reviews, wishlist usage
- Inactive users (5%): Registered but no purchases

**Create Product Variations:**
- Popular products (20%): High order count, many reviews
- Standard products (60%): Moderate activity
- Niche products (15%): Few orders, specific category
- New products (5%): Recently added, no orders yet

#### 3.2 Generate Workflow Execution Data

**For Each Workflow Scenario:**

**Complete Purchase Workflow (200 records):**
```yaml
# Workflow instance 1
- user: user_001
  steps:
    1. browse_session:
        products_viewed: [prod_045, prod_102, prod_233]
        duration: 15min
        timestamp: 2024-01-10T14:22:00Z

    2. cart_addition:
        product: prod_045
        quantity: 2
        timestamp: 2024-01-10T14:28:00Z

    3. checkout:
        cart_id: cart_001
        payment_method: credit_card
        timestamp: 2024-01-10T14:35:00Z

    4. order_creation:
        order_id: order_001
        status: confirmed
        total: 129.98
        timestamp: 2024-01-10T14:35:30Z

    5. fulfillment:
        order_id: order_001
        status: shipped → delivered
        timestamp: 2024-01-12T10:00:00Z → 2024-01-15T16:30:00Z
```

Generate entities for each workflow step:
- BrowseSession records (products viewed)
- CartItem records (items added)
- Order records (checkout completed)
- OrderItem records (order line items)
- Shipment records (fulfillment tracking)

#### 3.3 Maintain Temporal Consistency

Ensure realistic time progressions:

**Timestamps Must Follow Logical Sequence:**
- user.created_at < cart.created_at < order.created_at < shipment.created_at
- session.start_time < cart_item.added_at (user must browse before adding to cart)
- order.confirmed_at < shipment.shipped_at < shipment.delivered_at

**Realistic Time Gaps:**
- Browse → Add to Cart: 30 seconds to 30 minutes
- Cart → Checkout: 1 minute to 24 hours (abandoned carts > 24h)
- Order → Shipment: 1-3 business days
- Shipment → Delivery: 2-7 days

### 4. Generate Cross-Entity Relationships

#### 4.1 Create Realistic Relationship Patterns

**User-Order Relationship:**
- Link orders to users following persona patterns
- New users: 0-1 orders
- Active users: 2-8 orders (distributed over time)
- Power users: 10-25 orders

**Order-Product Relationship (via OrderItems):**
- Small orders: 1-2 items (50%)
- Medium orders: 3-5 items (35%)
- Large orders: 6-12 items (15%)
- Product popularity: 80/20 rule (20% of products in 80% of orders)

**User-Review Relationship:**
- Review rate: 20% of orders result in reviews
- Higher rate for extreme experiences (very good or very bad products)
- Review timing: 3-30 days after delivery

#### 4.2 Generate Junction Table Data (Many-to-Many)

**User-Wishlist-Product:**
- 40% of users have wishlists
- Wishlist size: 3-15 items (avg 7)
- Wishlist → Purchase conversion: 25% of wishlist items eventually purchased

**User-Following-User (Social Features):**
- Follow graph: Power users have 20-100 followers
- Active users: 5-20 followers
- New users: 0-2 followers
- Reciprocal follows: 30% of relationships

### 5. Apply Domain-Specific Workflow Rules

#### 5.1 E-Commerce Workflows

**Cart Abandonment Rules:**
- 30% of carts never convert to orders
- Abandoned cart value: Higher value carts more likely abandoned (price sensitivity)
- Cart expiry: Items removed after 30 days

**Inventory Updates:**
- Product.stock decrements when OrderItem created
- Stock updates are sequential (no negative stock)
- Popular products occasionally go out-of-stock

**Pricing Consistency:**
- OrderItem.price = Product.price at order time (historical pricing)
- Order.total = sum(OrderItem.price * OrderItem.quantity) + tax + shipping
- Discounts applied before tax calculation

#### 5.2 Financial Workflows

**Transaction Flow:**
- Account must exist before transaction
- Debit transaction: source_account.balance decreases
- Credit transaction: destination_account.balance increases
- Transfer: Debit source, Credit destination (atomic pair)
- Balance validation: balance = initial_balance + sum(credits) - sum(debits)

**Approval Workflows:**
- Loan application → Pending → Under Review → Approved/Rejected
- Approved loans → Disbursement → Repayment schedule created
- Repayment: Multiple payment records linked to loan

#### 5.3 Healthcare Workflows

**Patient Journey:**
- Patient Registration → Appointment Scheduled
- Appointment → Diagnosis Created
- Diagnosis → Prescription Written
- Prescription → Dispensed by Pharmacy
- Follow-up Appointment Scheduled (30% of diagnoses)

**Referral Workflows:**
- Primary Care Appointment → Specialist Referral → Specialist Appointment
- Referral expiry: 90 days if not used

### 6. Format and Save Workflow Data

#### 6.1 Organize by Workflow Scenarios

Create workflow-specific YAML files:

**eval/integration/workflows/complete-purchase.yaml:**
```yaml
workflow: Complete Purchase Flow
scenario_count: 80
total_records: 320  # users, carts, orders, items

scenarios:
  - id: wf_001
    user_id: user_001
    started_at: 2024-01-10T14:22:00Z
    completed_at: 2024-01-15T16:30:00Z

    entities_created:
      - type: BrowseSession
        id: session_001
        products_viewed: [prod_045, prod_102]

      - type: CartItem
        id: cart_item_001
        product_id: prod_045
        quantity: 2
        added_at: 2024-01-10T14:28:00Z

      - type: Order
        id: order_001
        user_id: user_001
        status: delivered
        total: 129.98
        created_at: 2024-01-10T14:35:30Z

      - type: OrderItem
        id: order_item_001
        order_id: order_001
        product_id: prod_045
        quantity: 2
        price: 64.99
```

**eval/integration/workflows/cart-abandonment.yaml:**
```yaml
workflow: Cart Abandonment Flow
scenario_count: 40
total_records: 120

scenarios:
  - id: wf_abn_001
    user_id: user_025
    started_at: 2024-01-08T10:15:00Z
    abandoned_at: 2024-01-08T10:45:00Z

    entities_created:
      - type: Cart
        id: cart_025
        user_id: user_025
        status: abandoned

      - type: CartItem
        id: cart_item_045
        cart_id: cart_025
        product_id: prod_112
        quantity: 1
```

#### 6.2 Save Cross-Reference Indexes

Create `eval/integration/workflows/index.yaml`:

```yaml
integration_test_data:
  generated_at: 2024-01-15T11:00:00Z
  total_workflows: 5
  total_scenarios: 200
  total_records: 500

  workflows:
    - name: Complete Purchase Flow
      file: complete-purchase.yaml
      scenario_count: 80
      entities: [User, BrowseSession, Cart, CartItem, Order, OrderItem, Shipment]

    - name: Cart Abandonment Flow
      file: cart-abandonment.yaml
      scenario_count: 40
      entities: [User, Cart, CartItem]

    - name: Product Review Flow
      file: product-review.yaml
      scenario_count: 40
      entities: [User, Order, Delivery, Review]
```

### 7. Validate Workflow Integrity

#### 7.1 Validate Temporal Sequences

For each workflow:
- Verify timestamps in chronological order
- Ensure realistic time gaps between steps
- Check no future dates beyond generation time

#### 7.2 Validate State Transitions

- Order status follows valid state machine: pending → confirmed → shipped → delivered
- Cart status: active → [checked_out | abandoned]
- Payment status: pending → authorized → captured
- No invalid transitions (e.g., delivered → pending)

#### 7.3 Validate Cross-Entity Consistency

- All foreign keys resolve to existing entities
- Calculated fields match (order.total = sum of order_items)
- Inventory updates are consistent (product.stock >= 0)
- Balance calculations correct (account.balance reflects transactions)

### 8. Create Integration Test README

#### 8.1 Generate Documentation

Create `eval/integration/README.md`:

```markdown
# Integration Test Datasets

Medium-sized workflow-based datasets for integration testing (500 records total).

## Contents

- **workflows/**: Workflow scenario datasets
  - complete-purchase.yaml (80 scenarios)
  - cart-abandonment.yaml (40 scenarios)
  - product-review.yaml (40 scenarios)
  - multi-step-decision.yaml (40 scenarios)

## Data Characteristics

- **Coverage**: End-to-end workflows, multi-entity interactions
- **Realism**: Temporal consistency, realistic state transitions
- **Scale**: 500 records across 5-10 entities
- **Relationships**: Complete relationship graphs for workflows

## Workflow Scenarios

### 1. Complete Purchase Flow (80 scenarios)
Tests full e-commerce flow from browse to delivery.

**Steps:**
1. User browses products
2. Adds items to cart
3. Proceeds to checkout
4. Order confirmed
5. Shipment created
6. Order delivered

**Entities Involved:** User, BrowseSession, Cart, CartItem, Order, OrderItem, Shipment

**Test Coverage:**
- Cart-to-order conversion
- Inventory deduction
- Order total calculation
- Shipment tracking
- Multi-item orders

### 2. Cart Abandonment Flow (40 scenarios)
Tests incomplete purchase workflows.

**Steps:**
1. User browses products
2. Adds items to cart
3. Abandons cart (no checkout)

**Test Coverage:**
- Cart expiration logic
- Abandoned cart value analysis
- Re-marketing triggers

## Usage Examples

```typescript
// Load workflow data
import { readFileSync } from 'fs';
import { parse } from 'yaml';

const workflow = parse(
  readFileSync('eval/integration/workflows/complete-purchase.yaml', 'utf8')
);

// Test complete purchase flow
describe('Complete Purchase Workflow', () => {
  it('should process order from cart to delivery', async () => {
    const scenario = workflow.scenarios[0];

    // Create user
    const user = await User.create(scenario.user_id);

    // Simulate browse session
    const session = await BrowseSession.create(scenario.entities_created[0]);

    // Add to cart
    const cartItem = await CartItem.create(scenario.entities_created[1]);

    // Checkout
    const order = await Order.create(scenario.entities_created[2]);

    // Verify order total
    expect(order.total).toBe(129.98);
  });
});
```
```

#### 8.2 Include Workflow Diagrams

Add workflow visualization to README:

```markdown
## Workflow State Diagrams

### Complete Purchase Flow
```
User → Browse → Cart → Checkout → Order → Shipment → Delivery
        ↓        ↓                    ↓          ↓
   Products  CartItems           OrderItems  Tracking
```

### Cart Abandonment Flow
```
User → Browse → Cart → [Abandoned]
        ↓        ↓
   Products  CartItems (status: abandoned)
```
```

### 9. Validation and Summary

#### 9.1 Validate Generated Workflows

- Check workflow count matches target (200 scenarios)
- Verify all workflows have complete entity graphs
- Verify all timestamps chronological
- Verify all state transitions valid
- Verify all foreign keys resolve
- Verify YAML syntax valid

#### 9.2 Generate Summary Report

Present to user:

```
✓ Integration Test Data Generated Successfully

Workflows: 5
Scenarios: 200
Total Records: 500

Files Created:
- eval/integration/workflows/complete-purchase.yaml (80 scenarios, 320 records)
- eval/integration/workflows/cart-abandonment.yaml (40 scenarios, 120 records)
- eval/integration/workflows/product-review.yaml (40 scenarios, 100 records)
- eval/integration/workflows/multi-step-decision.yaml (40 scenarios, 80 records)
- eval/integration/workflows/index.yaml (cross-reference)
- eval/integration/README.md (documentation)

Validation:
- Temporal Consistency: ✓ PASSED
- State Transitions: ✓ PASSED
- Referential Integrity: ✓ PASSED
- Business Rules: ✓ PASSED
- YAML Format: ✓ PASSED

Coverage:
- End-to-end workflows: 100%
- Multi-entity interactions: ✓
- State machine transitions: ✓
- Cross-entity validations: ✓
```

## Error Handling

- **Missing Workflow Patterns**: Use generic CRUD workflows as fallback
- **Circular Dependencies**: Break with nullable relationships
- **State Machine Conflicts**: Report invalid transitions, ask user to resolve
- **Timestamp Conflicts**: Adjust time gaps to maintain sequence

## Success Criteria

- [ ] 500 records generated across all entities
- [ ] All workflows represent realistic business scenarios
- [ ] All timestamps chronologically consistent
- [ ] All state transitions follow valid state machines
- [ ] All foreign keys reference existing entities
- [ ] All calculated fields (totals, balances) accurate
- [ ] YAML format valid and readable
- [ ] Documentation includes usage examples
