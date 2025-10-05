# Data Generation Patterns

## Common Realistic Data Patterns

### Distribution Types

**Normal Distribution (Gaussian)**
- Age, height, weight, measurements
- Order values (around median price)
- Response times
- Parameters: mean, standard deviation, min, max

**Power Law (Zipf) Distribution**
- User activity (80/20 rule)
- Product popularity
- Content engagement
- Website traffic
- Parameters: alpha (typically 1.2-2.0)

**Categorical Distribution**
- Status values with weights
- Gender, country, category
- Feature flags
- Parameters: value → probability map

**Uniform Distribution**
- Random dates within range
- Random selection from pool
- Evenly distributed values

**Exponential Distribution**
- Time between events
- Recent activity weighted
- Decay over time

### Temporal Patterns

**Chronological Constraints**
- created_at < updated_at
- start_date ≤ end_date
- order_date < ship_date < delivery_date

**Realistic Time Gaps**
- Browse → Cart: 30 seconds - 30 minutes
- Cart → Checkout: 1 minute - 24 hours
- Order → Shipment: 1-3 business days
- Shipment → Delivery: 2-7 days

**Date Distributions**
- Linear: Steady growth over time
- Exponential: More recent activity
- Seasonal: Peaks during specific periods
- Business hours: 9am-5pm weighted

### Value Generation Patterns

**Names**
- First name + Last name pools
- Locale-appropriate (US, EU, Asia)
- Weighted by popularity (common names more frequent)

**Emails**
- Template: {first}.{last}{n}@{domain}
- Domains: example.com, test.org, demo.net
- Ensure uniqueness with index/UUID

**Addresses**
- Valid postal codes per country
- Realistic city-state-country combinations
- Format per locale

**Phone Numbers**
- Valid format per country code
- Area code realism

**Prices**
- Psychological pricing: $9.99, $19.95, $49.00
- Currency precision: 2 decimals
- Realistic ranges per product category

**Quantities**
- Most orders: 1-2 items (60%)
- Medium orders: 3-5 items (30%)
- Large orders: 6-15 items (10%)

### Relationship Patterns

**One-to-Many Cardinality**
- New users: 0-1 orders (70%)
- Active users: 2-5 orders (25%)
- Power users: 6-20 orders (5%)

**Many-to-Many (Junction Tables)**
- Sparse: 80% have 1 relationship, 20% have multiple
- Dense: Most entities have 3-5 relationships
- Social graph: Follow patterns (reciprocal 30%)

**Referential Integrity**
- All foreign keys must reference existing parent IDs
- Use Zipf distribution for popularity (80/20 rule)
- Orphaned records only for negative testing
