# Oracle Task: Create Existing System Truth (Brownfield)

**Task ID:** oracle-create-existing-truth
**Agent:** Oracle
**Category:** Brownfield Analysis
**When to Use:** **Phase -1** of brownfield projects - BEFORE domain research

---

## Purpose

Extract and document the current state of an existing system into `existing-system-truth.yaml`. This file represents "what IS" (as opposed to domain-truth.yaml which represents "what SHOULD be").

**Critical for brownfield:** You can't safely enhance a system without knowing its current truth.

---

## Context

You are the Oracle agent in **brownfield mode**. A codebase exists with its own architecture, patterns, constraints, and technical debt. Your job is to analyze it and create a canonical document of its current state.

**This is Phase -1:** Happens BEFORE domain research, BEFORE domain-truth.yaml creation.

---

## Inputs Required

1. **Existing codebase** (path to project)
2. **Codebase type** (web app, API, monolith, microservices, etc.)
3. **Tech stack** (languages, frameworks, databases)

**Optional:**
- **Existing documentation** (if any)
- **Architecture diagrams** (if any)
- **Deployment info** (servers, containers, etc.)

---

## Existing System Truth Extraction Process

### Step 1: Analyze Codebase Structure

#### 1.1 Project Layout
```bash
# Scan directory structure
tree -L 3

# Identify:
- Entry points (main.ts, index.js, app.py, etc.)
- Module organization
- Configuration files
- Dependencies
```

```yaml
project_structure:
  type: "web_application"
  architecture: "MVC monolith"
  entry_point: "src/server.ts"

  directories:
    src:
      - controllers/
      - models/
      - services/
      - middleware/
      - utils/

  configuration:
    - package.json (Node.js dependencies)
    - tsconfig.json (TypeScript config)
    - .env.example (environment variables)
```

#### 1.2 Technology Stack
```yaml
tech_stack:
  language: "TypeScript"
  runtime: "Node.js v18"
  framework: "Express.js v4.18"
  database: "PostgreSQL v14"
  orm: "TypeORM v0.3"
  authentication: "Passport.js (JWT strategy)"
  testing: "Jest v29"
  build: "Webpack v5"
```

### Step 2: Extract Architecture Facts

#### 2.1 Core Components
```yaml
architecture_facts:
  - fact_id: "EXIST-001"
    category: "architecture"
    fact: "REST API built with Express.js v4.18"
    location: "src/server.ts"
    constraint: "Cannot migrate frameworks without major version bump"
    migration_cost: "high"
    change_risk: "critical"

  - fact_id: "EXIST-002"
    category: "data_layer"
    fact: "Uses TypeORM with PostgreSQL"
    location: "src/models/*.ts"
    constraint: "Database schema migrations managed via TypeORM"
    migration_cost: "medium"
    change_risk: "high"

  - fact_id: "EXIST-003"
    category: "authentication"
    fact: "JWT authentication with Passport.js"
    location: "src/middleware/auth.ts"
    current_implementation: "Token expiry: 30 minutes (hardcoded)"
    constraint: "Changing auth strategy requires user migration"
    migration_cost: "high"
    change_risk: "critical"
```

#### 2.2 Integration Points
```yaml
integration_points:
  - point_id: "INT-001"
    type: "external_api"
    name: "Stripe Payment Processing"
    version: "v2"
    location: "src/services/payment.service.ts"
    criticality: "high"
    cannot_change: true
    rationale: "External dependency, no control"

  - point_id: "INT-002"
    type: "external_api"
    name: "SendGrid Email Service"
    version: "v3"
    location: "src/services/email.service.ts"
    criticality: "medium"
    can_replace: true
    replacement_cost: "low"

  - point_id: "INT-003"
    type: "database"
    name: "PostgreSQL"
    version: "14.2"
    location: "src/config/database.ts"
    criticality: "critical"
    cannot_change: true
    constraint: "Schema must remain backward compatible"
```

### Step 3: Extract Business Logic

#### 3.1 Current Business Rules
```yaml
business_logic_facts:
  - fact_id: "BIZ-001"
    category: "user_management"
    rule: "Email verification NOT required before login"
    location: "src/controllers/auth.controller.ts:67"
    note: "Different from best practice, but current behavior"

  - fact_id: "BIZ-002"
    category: "session_management"
    rule: "JWT token expiry: 30 minutes"
    location: "src/middleware/auth.ts:42"
    implementation: "expiresIn: '30m'"
    note: "Hardcoded value, not configurable"

  - fact_id: "BIZ-003"
    category: "rate_limiting"
    rule: "No rate limiting implemented"
    location: "N/A"
    note: "Security gap, potential vulnerability"
```

### Step 4: Identify Constraints

#### 4.1 Technical Constraints
```yaml
constraints:
  - constraint_id: "CON-001"
    type: "compatibility"
    rule: "Must maintain API backward compatibility"
    rationale: "Mobile app v2.1 in production depends on current API structure"
    affected_endpoints:
      - "POST /api/auth/login"
      - "GET /api/users/profile"
    cannot_break: true

  - constraint_id: "CON-002"
    type: "performance"
    rule: "API response time p95 < 200ms"
    current_performance: "p95: 180ms, p99: 350ms"
    baseline: "Performance must not degrade"

  - constraint_id: "CON-003"
    type: "data"
    rule: "User table has 500K records, migration must be non-blocking"
    rationale: "Cannot afford downtime"
```

### Step 5: Capture Performance Baselines

```yaml
performance_baselines:
  - metric_id: "PERF-001"
    metric: "API response time (p95)"
    current_value: "180ms"
    measurement_date: "2025-10-04"
    acceptable_degradation: "10%"
    max_acceptable: "198ms"

  - metric_id: "PERF-002"
    metric: "Database query time (p95)"
    current_value: "45ms"
    acceptable_degradation: "15%"
    max_acceptable: "52ms"

  - metric_id: "PERF-003"
    metric: "Memory usage (average)"
    current_value: "512MB"
    acceptable_increase: "20%"
    max_acceptable: "614MB"
```

### Step 6: Identify Technical Debt

```yaml
technical_debt:
  - debt_id: "DEBT-001"
    category: "security"
    issue: "No rate limiting on authentication endpoints"
    severity: "high"
    location: "src/controllers/auth.controller.ts"
    recommendation: "Add rate limiting middleware"
    effort: "medium"

  - debt_id: "DEBT-002"
    category: "maintainability"
    issue: "Configuration hardcoded in source files"
    severity: "medium"
    location: "src/middleware/auth.ts:42, src/config/database.ts:15"
    recommendation: "Move to environment variables"
    effort: "low"

  - debt_id: "DEBT-003"
    category: "testing"
    issue: "Authentication logic has 0% test coverage"
    severity: "critical"
    location: "src/middleware/auth.ts"
    recommendation: "Add comprehensive auth tests"
    effort: "high"
```

### Step 7: Document Data Models

```yaml
data_models:
  - model_id: "MODEL-001"
    entity: "User"
    table: "users"
    location: "src/models/user.entity.ts"

    schema:
      - field: "id"
        type: "uuid"
        constraints: "PRIMARY KEY"
        cannot_change: true

      - field: "email"
        type: "varchar(255)"
        constraints: "UNIQUE, NOT NULL"
        indexed: true
        cannot_change: true  # Breaking change

      - field: "password_hash"
        type: "varchar(255)"
        constraints: "NOT NULL"

      - field: "email_verified"
        type: "boolean"
        default: false
        note: "Currently not enforced in login logic"

    relationships:
      - target: "sessions"
        type: "one-to-many"
        constraint: "User can have multiple sessions"

    record_count: 500000
    migration_complexity: "high"
```

### Step 8: Generate existing-system-truth.yaml

Use template: `bmad-core/templates/existing-system-truth-tmpl.yaml`

```yaml
# existing-system-truth.yaml

system:
  name: "Legacy Auth System"
  version: "v2.3.1"
  analysis_date: "2025-10-04"
  project_type: "brownfield"

architecture_facts:
  - fact_id: "EXIST-001"
    # ... (as extracted above)

integration_points:
  - point_id: "INT-001"
    # ...

business_logic_facts:
  - fact_id: "BIZ-001"
    # ...

constraints:
  - constraint_id: "CON-001"
    # ...

performance_baselines:
  - metric_id: "PERF-001"
    # ...

technical_debt:
  - debt_id: "DEBT-001"
    # ...

data_models:
  - model_id: "MODEL-001"
    # ...
```

---

## Analysis Methods

### Static Code Analysis
- Read source files
- Parse configuration
- Extract API routes
- Identify database schemas

### Dynamic Analysis (Optional)
- Run application
- Observe runtime behavior
- Measure performance
- Test API endpoints

### Documentation Review
- Existing docs
- README files
- API specs (OpenAPI/Swagger)
- Architecture diagrams

### Dependency Analysis
```bash
npm list --depth=0  # or pip freeze, composer show, etc.
```

---

## Output Format

**File:** `docs/existing-system-truth.yaml`

**Structure:**
1. **System Overview** (name, version, type)
2. **Architecture Facts** (components, frameworks, patterns)
3. **Integration Points** (external services, APIs)
4. **Business Logic Facts** (current rules)
5. **Constraints** (what can't change)
6. **Performance Baselines** (current metrics)
7. **Technical Debt** (known issues)
8. **Data Models** (schemas, relationships)

---

## Success Criteria

- [ ] Entire codebase analyzed
- [ ] All core components documented
- [ ] Integration points identified
- [ ] Business rules extracted
- [ ] Constraints clearly defined
- [ ] Performance baselines captured
- [ ] Technical debt catalogued
- [ ] existing-system-truth.yaml generated

---

## Examples

### Example 1: Analyze Express.js API

**Input:**
```bash
Codebase: /projects/legacy-api
Type: REST API
Stack: Node.js, Express, PostgreSQL
```

**Output:**
```yaml
# existing-system-truth.yaml

system:
  name: "Legacy User API"
  version: "v2.3.1"
  tech_stack: "Node.js 18, Express 4.18, PostgreSQL 14"

architecture_facts:
  - fact_id: "EXIST-001"
    fact: "MVC architecture with Express.js"
    location: "src/"

business_logic_facts:
  - fact_id: "BIZ-001"
    rule: "No email verification required"
    location: "src/controllers/auth.controller.ts:67"

constraints:
  - constraint_id: "CON-001"
    rule: "API must remain backward compatible"
    rationale: "Mobile app v2.1 depends on current endpoints"
```

---

## Integration Points

**Precedes:**
- Analyst (domain research)
- Oracle `create-domain-truth` (greenfield approach)
- Compatibility `validate-compatibility`

**Outputs to:**
- Oracle (for dual-truth management)
- Compatibility agent (for compatibility analysis)
- Eval agent (for regression test generation)

---

## Command Signature

```bash
bmad oracle create-existing-truth \
  --codebase /projects/legacy-api \
  --tech-stack node,express,postgresql \
  --output docs/existing-system-truth.yaml
```

---

**Know what IS before defining what SHOULD be. Brownfield starts here.**
