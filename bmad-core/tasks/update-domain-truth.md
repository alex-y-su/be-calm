# Oracle Task: Update Domain Truth

**Task ID:** oracle-update-truth
**Agent:** Oracle
**Category:** Truth Evolution
**When to Use:** When domain understanding changes or new facts are discovered

---

## Purpose

Safely evolve the canonical domain truth (`domain-truth.yaml`) when:
- New domain facts are discovered
- Existing facts need clarification or correction
- Terminology needs refinement
- Domain examples need additions

**Critical:** Domain truth updates trigger cascade updates across all artifacts.

---

## Context

You are the Oracle agent, guardian of domain truth. Domain understanding evolves, and sometimes domain-truth.yaml needs updates. But this isn't a simple edit—changing domain truth ripples through PRD, Architecture, Stories, Code, and Tests.

**Your job:** Make truth updates safe, tracked, and propagated correctly.

---

## When to Update Domain Truth

### Valid Reasons

✅ **Discovery:** "We learned JWT tokens should be 15 minutes, not 30"
✅ **Refinement:** "We need to clarify what 'user' means vs 'visitor'"
✅ **New Knowledge:** "Client revealed business rule: email verification required"
✅ **Error Correction:** "Domain truth has wrong fact—needs fixing"
✅ **Brownfield Learning:** "Existing system reveals constraints we didn't know"

### Invalid Reasons

❌ **Implementation convenience:** "Let's change this because code is hard"
❌ **Ignoring constraints:** "This rule is annoying, let's remove it"
❌ **Artifact drift:** "PRD says X but truth says Y, let's just change truth"

**Rule:** Domain truth represents THE DOMAIN, not implementation preferences.

---

## Inputs Required

1. **Update type** (add_fact | modify_fact | clarify_term | add_constraint | deprecate_fact)
2. **Justification** (why is this update needed?)
3. **Affected artifacts** (what will this impact?)
4. **Current domain-truth.yaml** path

**Optional:**
- **Source of new knowledge** (meeting notes, domain expert, research)
- **Migration strategy** (for breaking changes)

---

## Update Process

### Step 1: Validate Update Request

Before changing anything:

#### 1.1 Verify Legitimacy
- Is this a real domain fact or implementation detail?
- Does this come from authoritative source?
- Is this evolution or regression?

#### 1.2 Impact Analysis
```bash
# Check what will be affected
bmad validator validate-traceability --fact {{fact_id}}
```

```yaml
impact_analysis:
  fact_id: "FACT-001"
  current_value: "JWT token expiry: 30 minutes"
  proposed_value: "JWT token expiry: 15 minutes"

  affected_artifacts:
    - prd.md: "FR-003 (session timeout)"
    - architecture.md: "COMP-002 (AuthService)"
    - stories/epic-1/story-1.1.md: "JWT implementation"
    - src/auth/jwt.service.ts: "expiresIn configuration"
    - test/auth/jwt.test.ts: "Token expiry tests"

  breaking_change: true
  migration_required: true
```

#### 1.3 Risk Assessment
```yaml
risk_assessment:
  change_type: "value_modification"
  breaking: true

  risks:
    - "Code currently implements 30 minutes"
    - "Tests expect 30-minute expiry"
    - "May affect active user sessions"

  mitigation:
    - "Update code before deploying"
    - "Update all tests"
    - "Plan session migration strategy"
```

### Step 2: Prepare Update

#### 2.1 Create Update Record

```yaml
domain_truth_update:
  update_id: "UPDATE-001"
  date: "2025-10-04"
  type: "modify_fact"

  change:
    fact_id: "FACT-001"
    category: "authentication"

    before:
      fact: "JWT tokens expire after 30 minutes"
      constraint: "Token TTL: 30 minutes"

    after:
      fact: "JWT tokens expire after 15 minutes"
      constraint: "Token TTL: 15 minutes"
      rationale: "Security best practice: shorter session timeout reduces exposure"

  justification: "Security audit recommendation: reduce token lifetime"
  source: "Security Team Review 2025-10-03"
  approved_by: "Domain Expert"

  impact:
    breaking_change: true
    affected_artifacts: 5
    migration_complexity: "medium"
```

#### 2.2 Plan Cascade Updates

```yaml
cascade_plan:
  step_1:
    artifact: "domain-truth.yaml"
    action: "Update FACT-001 value"

  step_2:
    artifact: "prd.md"
    action: "Update FR-003 to reflect 15-minute timeout"
    trigger: "PM agent validate-against-truth"

  step_3:
    artifact: "architecture.md"
    action: "Update COMP-002 JWT TTL specification"
    trigger: "Architect agent validate-against-truth"

  step_4:
    artifacts: ["stories/epic-1/story-1.1.md"]
    action: "Update story acceptance criteria"
    trigger: "SM agent regenerate story context"

  step_5:
    artifact: "src/auth/jwt.service.ts"
    action: "Change expiresIn from '30m' to '15m'"
    trigger: "Dev agent implement update"

  step_6:
    artifacts: ["test/auth/jwt.test.ts"]
    action: "Update test expectations"
    trigger: "QA agent update test datasets"
```

### Step 3: Execute Update

#### 3.1 Update domain-truth.yaml

```yaml
# OLD
canonical_facts:
  - id: "FACT-001"
    category: "authentication"
    fact: "JWT tokens expire after 30 minutes"
    constraint: "Token TTL: 30 minutes"
    source: "domain-analysis.md#security"

# NEW
canonical_facts:
  - id: "FACT-001"
    category: "authentication"
    fact: "JWT tokens expire after 15 minutes"
    constraint: "Token TTL: 15 minutes"
    source: "domain-analysis.md#security"
    last_updated: "2025-10-04"
    update_reason: "Security audit recommendation"
```

#### 3.2 Record Change History

Append to domain-truth.yaml:

```yaml
change_history:
  - update_id: "UPDATE-001"
    date: "2025-10-04"
    fact_id: "FACT-001"
    change_type: "modify_value"
    previous_value: "30 minutes"
    new_value: "15 minutes"
    reason: "Security audit recommendation"
    approved_by: "Security Team"
    affected_artifacts: 5
```

#### 3.3 Create Migration Document

If breaking change:

```markdown
# Domain Truth Update: FACT-001 Migration

## Change Summary
JWT token expiry reduced from 30 to 15 minutes.

## Affected Artifacts
- prd.md (FR-003)
- architecture.md (COMP-002)
- story-1.1.md
- src/auth/jwt.service.ts
- test/auth/jwt.test.ts

## Migration Steps
1. Update domain-truth.yaml ✅
2. Update PRD (PM agent)
3. Update Architecture (Architect agent)
4. Update Stories (SM agent)
5. Update Code (Dev agent)
6. Update Tests (QA agent)

## Validation
Run: bmad oracle check-consistency
```

### Step 4: Trigger Cascade Updates

Notify affected agents:

```yaml
notifications:
  - agent: "pm"
    task: "validate-artifact-against-truth"
    artifact: "docs/prd.md"
    reason: "Domain truth FACT-001 updated"

  - agent: "architect"
    task: "validate-artifact-against-truth"
    artifact: "docs/architecture.md"
    reason: "Domain truth FACT-001 updated"

  - agent: "validator"
    task: "validate-traceability"
    scope: "FACT-001"
    reason: "Verify all references updated"
```

### Step 5: Validate Propagation

After updates cascade:

```bash
# Run consistency check
bmad oracle check-consistency \
  --artifacts docs/ \
  --truth docs/domain-truth.yaml
```

**Ensure:**
- ✅ All artifacts updated
- ✅ No contradictions remain
- ✅ Tests pass
- ✅ Traceability intact

---

## Update Types

### Add New Fact

```yaml
# Add new domain fact
canonical_facts:
  - id: "FACT-027"  # New ID
    category: "notifications"
    fact: "Email notifications sent within 5 minutes of trigger event"
    constraint: "Max delay: 5 minutes"
    source: "domain-analysis.md#notifications"
    added_date: "2025-10-04"
```

**Cascade:** Likely new requirements in PRD

### Modify Existing Fact

```yaml
# Change fact value (as shown above)
# Triggers: Update all dependent artifacts
```

### Clarify Terminology

```yaml
terminology:
  "user":
    old: "Person using the system"
    new: "Authenticated person with account credentials (not 'visitor', 'customer', or 'client')"
    clarification_reason: "Distinguish from unauthenticated visitors"
```

**Cascade:** Terminology validation in all artifacts

### Add Constraint

```yaml
constraints:
  - id: "CON-008"  # New constraint
    type: "business_rule"
    rule: "Users must change password every 90 days"
    rationale: "Compliance requirement"
    added_date: "2025-10-04"
```

**Cascade:** New NFR in PRD, architecture implications

### Deprecate Fact

```yaml
canonical_facts:
  - id: "FACT-015"
    fact: "Sessions persist indefinitely"
    status: "deprecated"
    deprecated_date: "2025-10-04"
    reason: "Replaced by FACT-001 (session timeout policy)"
    replaced_by: "FACT-001"
```

**Cascade:** Remove references from all artifacts

---

## Output Format

### Update Record

**File:** `docs/domain-truth-updates/UPDATE-{{id}}.md`

```markdown
# Domain Truth Update: UPDATE-001

**Date:** 2025-10-04
**Type:** Modify Fact
**Breaking:** Yes

## Change
**Fact ID:** FACT-001
**Before:** JWT tokens expire after 30 minutes
**After:** JWT tokens expire after 15 minutes

## Justification
Security audit recommendation: shorter session timeout.

## Impact Analysis
- 5 artifacts affected
- Breaking change
- Migration required

## Cascade Plan
1. ✅ domain-truth.yaml updated
2. ⏳ PRD (FR-003) needs update
3. ⏳ Architecture (COMP-002) needs update
4. ⏳ Story 1.1 needs update
5. ⏳ Code needs update
6. ⏳ Tests need update

## Validation
Run consistency check after all updates.
```

---

## Success Criteria

- [ ] Domain truth updated with clear justification
- [ ] Change history recorded
- [ ] Impact analysis completed
- [ ] Cascade plan created
- [ ] All affected artifacts notified
- [ ] Consistency validation passed

---

## Examples

### Example 1: Add New Domain Fact

**Scenario:** Client reveals new business rule

**Input:**
```yaml
Update: add_fact
New Fact: "Free tier users limited to 100 API calls per day"
Category: "rate_limiting"
Source: "Client requirements meeting 2025-10-04"
```

**Process:**
1. Add FACT-028 to domain-truth.yaml
2. Alert PM: Add rate limiting to PRD
3. Alert Architect: Design rate limiting component
4. Alert QA: Create rate limit test datasets

**Output:**
```markdown
# New Domain Fact Added: FACT-028

Rate limiting for free tier users.

## Cascades Required
- PRD: Add FR for rate limiting
- Architecture: Add RateLimiter component
- Tests: Add rate limit test datasets
```

---

## Integration Points

**Called by:**
- Oracle agent (when discovering inconsistencies)
- PM agent (when new requirements surface)
- Analyst agent (when domain research reveals new facts)
- User (manual truth evolution)

**Triggers:**
- `check-cross-document-consistency` (validate cascade)
- `validate-artifact-against-truth` (for each affected artifact)
- Validator `validate-traceability` (ensure links maintained)

---

## Command Signature

```bash
bmad oracle update-truth \
  --type modify_fact \
  --fact-id FACT-001 \
  --new-value "15 minutes" \
  --reason "Security audit" \
  --cascade-plan yes
```

---

**Domain truth evolution is CHANGE MANAGEMENT. Handle with care.**
