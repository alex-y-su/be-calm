# Domain-Specific Constraints

## Domain Detection Patterns

### E-Commerce / Retail
**Keywords:** product, cart, checkout, order, inventory, payment, shipping, SKU, catalog, price
**Entities:** Product, Order, Customer, Cart, Payment, Inventory, Category
**Constraints:**
- Product stock >= 0
- Order total = sum(line_items) + tax + shipping
- Price > 0
- Cart items reference valid products
- Order quantity <= product stock (at order time)

### Financial / Fintech
**Keywords:** account, transaction, balance, ledger, debit, credit, payment, transfer, wallet
**Entities:** Account, Transaction, Ledger, Payment, User, Balance
**Constraints:**
- Debit amount = Credit amount (balanced transactions)
- Account balance = initial_balance + sum(credits) - sum(debits)
- Transaction immutability after posting
- Currency precision: 2-4 decimals
- No negative balances (unless overdraft allowed)

### Healthcare
**Keywords:** patient, diagnosis, prescription, treatment, appointment, medical record, provider
**Entities:** Patient, Appointment, Prescription, Diagnosis, Provider
**Constraints:**
- Valid diagnosis codes (ICD-10)
- Prescription requires licensed provider
- Patient age validation (pediatric vs adult)
- Appointment date >= today
- Prescription date >= diagnosis date

### SaaS / B2B Platform
**Keywords:** subscription, plan, tenant, organization, user, license, feature flag, usage
**Entities:** Organization, User, Subscription, Plan, Usage
**Constraints:**
- Organization user_count <= plan user_limit
- Subscription end_date > start_date
- Feature access based on plan tier
- Multi-tenancy isolation
- Usage within plan quotas

### Social / Content Platform
**Keywords:** post, comment, like, follow, feed, user, content, engagement
**Entities:** User, Post, Comment, Like, Follow
**Constraints:**
- Self-follow prevented
- Post author must exist
- Comment references valid post
- Like uniqueness (user + post)
- Follow reciprocity tracking

### Logistics / Supply Chain
**Keywords:** shipment, warehouse, delivery, tracking, route, inventory, supplier
**Entities:** Shipment, Warehouse, Order, Route, Supplier
**Constraints:**
- Shipment weight = sum(package weights)
- Delivery date >= shipment date
- Route stops in chronological order
- Inventory transfers balance

### Education / Learning
**Keywords:** course, student, instructor, assignment, grade, enrollment, curriculum
**Entities:** Student, Course, Instructor, Assignment, Enrollment
**Constraints:**
- Enrollment requires course availability
- Grade date >= assignment due date
- Prerequisites must be completed
- Student capacity per course

## State Machine Definitions

### Order Status (E-Commerce)
```
pending → confirmed → shipped → delivered
pending → cancelled
confirmed → cancelled
(no backward transitions)
```

### Subscription Status (SaaS)
```
trial → active → expired
trial → cancelled
active → cancelled
(expired/cancelled are terminal)
```

### Payment Status (Financial)
```
pending → authorized → captured
pending → failed
authorized → voided
(captured/failed/voided are terminal)
```

### Appointment Status (Healthcare)
```
scheduled → confirmed → completed
scheduled → cancelled
confirmed → no_show
```

## Business Rule Examples

### E-Commerce
- Abandoned cart: no activity for 24 hours
- Free shipping: order total > $50
- Tax calculation: varies by state/country
- Refund window: 30 days from delivery

### Financial
- Daily transfer limit: $10,000
- Minimum balance: $25 (or account closure)
- Interest accrual: daily, compounded monthly
- Overdraft fee: triggered if balance < 0

### Healthcare
- Appointment reminder: 24 hours before
- Prescription refill: 80% of previous filled
- Lab test validity: 30-90 days
- Referral expiration: 90 days

### SaaS
- Trial period: 14 days
- Grace period after expiration: 7 days
- Downgrade effective: next billing cycle
- User deactivation: 90 days inactivity
