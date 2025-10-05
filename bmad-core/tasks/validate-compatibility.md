# Oracle Task: Validate Compatibility (Brownfield)

**Task ID:** oracle-validate-compatibility
**Agent:** Oracle
**Category:** Brownfield Validation
**When to Use:** Before implementing enhancements to existing systems

---

## Purpose

Validate that proposed changes to an existing system:
- Don't break existing functionality
- Maintain backward compatibility
- Respect existing constraints
- Align with migration strategy

**Dual-truth validation:** Check against BOTH `existing-system-truth.yaml` AND `domain-truth.yaml`.

---

## Context

You are the Oracle agent in **brownfield mode**. You have three sources of truth:
1. **existing-system-truth.yaml** - What IS (current state)
2. **domain-truth.yaml** - What SHOULD be (ideal state)
3. **enhancement-truth.yaml** - What WILL change (migration path)

Your job: Ensure proposed changes respect existing truth while moving toward domain truth.

---

## Inputs Required

1. **Proposed change** (artifact, code, requirement)
2. **Existing system truth** (`existing-system-truth.yaml`)
3. **Domain truth** (`domain-truth.yaml`)
4. **Enhancement truth** (`enhancement-truth.yaml`) - if exists

**Optional:**
- **Migration strategy** (if defined)
- **Compatibility constraints** (API contracts, etc.)

---

## Compatibility Validation Process

### Step 1: Classify Change Type

```yaml
change_classification:
  change_id: "CHANGE-001"
  description: "Reduce JWT token expiry from 30 to 15 minutes"

  type:
    category: "modification"
    scope: "authentication"

  affects:
    - "Authentication middleware"
    - "Session management"
    - "Active user sessions"

  analysis:
    breaking_change: true
    backward_compatible: false
    migration_required: true
```

### Step 2: Validate Against Existing System Truth

Check if change violates existing constraints:

```yaml
existing_truth_validation:
  change: "Reduce JWT expiry to 15 minutes"

  existing_fact:
    fact_id: "BIZ-002"
    current_value: "JWT token expiry: 30 minutes"
    location: "src/middleware/auth.ts:42"
    constraint: "Mobile app v2.1 expects 30-minute sessions"

  compatibility_check:
    violates_constraint: true
    constraint_id: "CON-001"
    issue: "Mobile app v2.1 hardcodes 30-minute refresh logic"
    impact: "Users will be logged out unexpectedly"

  verdict: "BREAKING CHANGE - Migration required"
```

### Step 3: Validate Against Domain Truth

Check if change aligns with desired state:

```yaml
domain_truth_validation:
  change: "Reduce JWT expiry to 15 minutes"

  domain_fact:
    fact_id: "FACT-001"
    target_value: "JWT token expiry: 15 minutes"
    rationale: "Security best practice"

  alignment_check:
    matches_domain_truth: true
    correct_direction: true

  verdict: "ALIGNS with domain truth ✅"
```

### Step 4: Check Compatibility Constraints

```yaml
constraint_validation:
  constraints_to_check:
    - constraint_id: "CON-001"
      rule: "Must maintain API backward compatibility"
      applies_to: "Authentication endpoints"

      impact_analysis:
        endpoint: "POST /api/auth/login"
        current_behavior: "Returns token with 30-minute expiry"
        proposed_behavior: "Returns token with 15-minute expiry"
        breaking: true
        client_impact: "Mobile app v2.1 will fail"

      verdict: "VIOLATES CON-001 ❌"

    - constraint_id: "CON-002"
      rule: "Performance must not degrade"

      impact_analysis:
        metric: "API response time"
        current: "p95: 180ms"
        projected: "p95: 175ms (no change)"
        degradation: "0%"

      verdict: "COMPLIES ✅"
```

### Step 5: Assess Breaking Change Impact

```yaml
breaking_change_assessment:
  change_id: "CHANGE-001"
  breaking: true

  consumers_affected:
    - consumer: "Mobile App v2.1"
      type: "mobile_client"
      impact: "critical"
      issue: "Hardcoded 30-minute refresh logic will fail"
      users_affected: 50000
      mitigation_required: true

    - consumer: "Web App v3.0"
      type: "web_client"
      impact: "none"
      reason: "Already uses dynamic token refresh"

    - consumer: "Admin Dashboard v1.2"
      type: "internal_tool"
      impact: "low"
      issue: "Users will need to re-login more frequently"
      mitigation: "Update UI messaging"

  total_impact:
    critical: 1
    high: 0
    medium: 0
    low: 1
    none: 1

  overall_risk: "HIGH"
```

### Step 6: Validate Migration Strategy

If breaking change, verify migration plan exists:

```yaml
migration_strategy_validation:
  change_id: "CHANGE-001"
  migration_required: true

  proposed_strategy:
    strategy_id: "MIG-001"
    type: "phased_rollout"

    phases:
      - phase: 1
        name: "Add configurable expiry"
        action: "Make token expiry configurable via API response"
        duration: "2 weeks"
        backward_compatible: true

      - phase: 2
        name: "Update mobile app"
        action: "Release mobile v2.2 with dynamic token handling"
        duration: "4 weeks (app store approval)"
        prerequisite: "Phase 1 complete"

      - phase: 3
        name: "Change default to 15 minutes"
        action: "Update server default, old clients still work"
        duration: "1 week"
        prerequisite: "80% users on mobile v2.2+"

      - phase: 4
        name: "Hard cutover"
        action: "Remove 30-minute support"
        duration: "1 week"
        prerequisite: "95% users on mobile v2.2+"

  validation:
    has_backward_compatible_phase: true ✅
    has_client_update_phase: true ✅
    has_monitoring_plan: true ✅
    has_rollback_plan: true ✅

  verdict: "MIGRATION STRATEGY VALID ✅"
```

### Step 7: Generate Compatibility Report

Use template: `bmad-core/templates/compatibility-validation-tmpl.md`

```yaml
compatibility_report:
  change_id: "CHANGE-001"
  change: "Reduce JWT token expiry to 15 minutes"

  compatibility_status: "BREAKING - Migration Required"

  validation_results:
    existing_truth: "VIOLATES BIZ-002"
    domain_truth: "ALIGNS FACT-001"
    constraints: "VIOLATES CON-001"
    migration_strategy: "VALID"

  breaking_changes:
    - Mobile app v2.1 incompatible

  risk_level: "HIGH"

  recommended_action:
    proceed: "YES - with migration"
    strategy: "MIG-001 (4-phase rollout)"
    timeline: "7 weeks"

  approval_required:
    - "Product Owner (consumer impact)"
    - "Mobile Team Lead (client update)"
    - "Security Team (verify security benefit)"
```

---

## Validation Rules

### ✅ Change is COMPATIBLE if:
- Doesn't violate existing constraints
- Has migration strategy (if breaking)
- Aligns with domain truth
- Maintains performance baselines
- Has rollback plan

### ❌ Change is INCOMPATIBLE if:
- Violates critical constraints (CON-xxx)
- Breaks existing functionality without migration
- Impacts production consumers without plan
- Degrades performance beyond acceptable limits
- No rollback plan

### ⚠️ Change is RISKY if:
- Breaking but migration exists
- Performance degradation acceptable
- Technical debt reduction (short-term pain, long-term gain)

---

## Output Format

**Report:** `docs/validation/compatibility-validation-{{change_id}}.md`

**Structure:**
1. **Executive Summary** (breaking/compatible, risk level)
2. **Existing System Analysis** (what will break)
3. **Domain Truth Alignment** (correct direction?)
4. **Constraint Validation** (which constraints violated)
5. **Consumer Impact** (who is affected)
6. **Migration Strategy** (how to implement safely)
7. **Recommendation** (proceed/revise/reject)

---

## Success Criteria

- [ ] Change classified (modification, addition, removal)
- [ ] Existing truth validated
- [ ] Domain truth alignment checked
- [ ] All constraints validated
- [ ] Breaking changes identified
- [ ] Consumer impact assessed
- [ ] Migration strategy validated (if needed)
- [ ] Compatibility report generated

---

## Examples

### Example 1: Non-Breaking Enhancement

**Change:** Add optional field to User model

```yaml
compatibility_validation:
  change: "Add 'phone_number' field to User model"

  existing_truth: "User model has 5 fields"
  proposed: "User model will have 6 fields (added: phone_number, optional)"

  breaking_change: false
  reason: "Optional field, backward compatible"

  constraints_check:
    - CON-001 (API compatibility): ✅ PASS (optional field)
    - CON-003 (Database migration): ✅ PASS (non-blocking ALTER)

  verdict: "COMPATIBLE - Safe to proceed ✅"
```

### Example 2: Breaking Change with Migration

**Change:** Require email verification before login

```yaml
compatibility_validation:
  change: "Enforce email verification before login"

  existing_truth:
    fact_id: "BIZ-001"
    current: "Email verification NOT required"

  domain_truth:
    fact_id: "FACT-002"
    target: "Email verification required"

  breaking_change: true
  impact: "Existing unverified users cannot login"

  consumers_affected:
    - "500K existing users (email_verified = false)"

  migration_strategy:
    - Phase 1: Add verification emails
    - Phase 2: Grace period (30 days warning)
    - Phase 3: Enforce requirement

  verdict: "BREAKING - Proceed with MIG-002 ⚠️"
```

---

## Integration Points

**Called by:**
- Oracle (when validating brownfield changes)
- Compatibility agent
- PM agent (when updating brownfield PRD)
- Architect agent (when modifying brownfield architecture)

**Uses:**
- `existing-system-truth.yaml`
- `domain-truth.yaml`
- `enhancement-truth.yaml`

**Triggers:**
- `analyze-migration-path` (if breaking)
- `validate-enhancement` (full enhancement validation)

---

## Command Signature

```bash
bmad oracle validate-compatibility \
  --change "Reduce JWT expiry to 15 minutes" \
  --existing-truth docs/existing-system-truth.yaml \
  --domain-truth docs/domain-truth.yaml \
  --output docs/validation/compatibility-validation-CHANGE-001.md
```

---

**Compatibility = Respect what IS while moving toward what SHOULD be.**
