# Oracle Task: Analyze Migration Path (Brownfield)

**Task ID:** oracle-analyze-migration-path
**Agent:** Oracle
**Category:** Brownfield Migration
**When to Use:** When breaking changes identified, design safe migration strategy

---

## Purpose

Design a safe, phased migration strategy to transition from current state (existing-system-truth) to target state (domain-truth) when changes are breaking or high-risk.

**Output:** Detailed migration strategy with phases, timelines, rollback plans, and validation criteria.

---

## Context

You are the Oracle agent in **brownfield mode**. A breaking change has been identified (e.g., change JWT expiry from 30 to 15 minutes). You need to design a migration that:
- Doesn't break production
- Maintains backward compatibility during transition
- Updates consumers safely
- Has rollback capability
- Validates success at each phase

---

## Inputs Required

1. **Current state** (from `existing-system-truth.yaml`)
2. **Target state** (from `domain-truth.yaml` or `enhancement-truth.yaml`)
3. **Breaking change details**
4. **Consumer information** (who will be affected)

**Optional:**
- **Performance baselines** (to monitor during migration)
- **Deployment constraints** (maintenance windows, etc.)

---

## Migration Path Analysis Process

### Step 1: Understand Current and Target States

```yaml
migration_analysis:
  migration_id: "MIG-001"
  purpose: "Reduce JWT token expiry from 30 to 15 minutes"

  current_state:
    fact_id: "BIZ-002"
    value: "JWT expiry: 30 minutes"
    location: "src/middleware/auth.ts:42"
    consumers:
      - "Mobile App v2.1 (50K users)"
      - "Web App v3.0 (30K users)"
      - "Admin Dashboard v1.2 (500 users)"

  target_state:
    fact_id: "FACT-001"
    value: "JWT expiry: 15 minutes"
    rationale: "Security improvement"

  change_type: "value_modification"
  breaking: true
  reason: "Mobile app v2.1 hardcodes 30-minute refresh logic"
```

### Step 2: Identify Migration Complexity

```yaml
complexity_assessment:
  technical_complexity: "medium"
  factors:
    - "Requires configuration change"
    - "Affects authentication logic"
    - "Impacts active sessions"

  consumer_complexity: "high"
  factors:
    - "Mobile app v2.1 needs update (app store approval required)"
    - "50K users affected"
    - "Cannot break existing sessions"

  deployment_complexity: "medium"
  factors:
    - "Can deploy incrementally"
    - "No database migration needed"
    - "Rollback is simple (change config back)"

  timeline_estimate:
    optimistic: "5 weeks"
    realistic: "7 weeks"
    pessimistic: "9 weeks"

  overall_complexity: "HIGH"
```

### Step 3: Design Phased Migration Strategy

```yaml
migration_strategy:
  strategy_id: "MIG-001"
  strategy_type: "phased_rollout_with_compatibility_layer"
  total_phases: 4
  total_duration: "7 weeks"

  phases:
    - phase_number: 1
      name: "Add Configurable Expiry (Backward Compatible)"
      duration: "2 weeks"
      objective: "Make token expiry configurable without breaking existing clients"

      actions:
        - "Add 'token_expiry' field to auth API response"
        - "Keep default at 30 minutes"
        - "Update server to support dynamic expiry configuration"
        - "Add monitoring for token refresh patterns"

      technical_changes:
        - file: "src/middleware/auth.ts"
          change: "Add configurable expiresIn from environment variable"
          code: |
            const tokenExpiry = process.env.JWT_EXPIRY || '30m';
            const token = jwt.sign(payload, secret, { expiresIn: tokenExpiry });

        - file: "src/controllers/auth.controller.ts"
          change: "Include expiry in response"
          code: |
            return {
              token,
              expiresIn: parseExpiry(tokenExpiry), // seconds
              expiresAt: Date.now() + parseExpiry(tokenExpiry) * 1000
            };

      deliverables:
        - "Updated auth service with configurable expiry"
        - "API response includes expiry info"
        - "Monitoring dashboard for token metrics"

      success_criteria:
        - "API returns token_expiry in response"
        - "Existing clients still work (30-minute default)"
        - "No increase in auth errors"

      rollback_plan:
        trigger: "Auth error rate > 1%"
        action: "Remove expiry field from response, revert to hardcoded 30m"
        time_to_rollback: "< 5 minutes"

      backward_compatible: true ✅

    - phase_number: 2
      name: "Update Mobile App (Client Migration)"
      duration: "4 weeks"
      objective: "Release mobile app v2.2 with dynamic token refresh"
      prerequisite: "Phase 1 deployed and stable"

      actions:
        - "Update mobile app to read expiresIn from API response"
        - "Implement dynamic token refresh logic"
        - "Test with various expiry values"
        - "Submit to app stores"
        - "Monitor adoption rate"

      technical_changes:
        - component: "Mobile App AuthService"
          change: "Read expiry from server response"
          pseudo_code: |
            const { token, expiresIn } = await loginAPI();
            scheduleRefresh(expiresIn - 60); // Refresh 1 min before expiry

      deliverables:
        - "Mobile app v2.2 released"
        - "App store approval obtained"
        - "Progressive rollout to users"

      success_criteria:
        - "Mobile v2.2 handles variable token expiry"
        - "80% users on v2.2+ within 4 weeks"
        - "No increase in auth failures"

      monitoring:
        - metric: "Mobile app version distribution"
          threshold: "80% on v2.2+"
          check_frequency: "daily"

      rollback_plan:
        trigger: "Auth failure rate > 2% on v2.2"
        action: "Pause rollout, fix issue, resubmit"

      backward_compatible: true ✅

    - phase_number: 3
      name: "Gradual Expiry Reduction (Soft Launch)"
      duration: "1 week"
      objective: "Change default to 15 minutes for new sessions"
      prerequisite: "80% users on mobile v2.2+"

      actions:
        - "Change JWT_EXPIRY environment variable to '15m'"
        - "Deploy to staging first"
        - "Canary deploy to 10% production"
        - "Monitor metrics closely"
        - "Full production rollout if metrics good"

      deployment_strategy:
        type: "canary"
        stages:
          - "Staging: 100%"
          - "Production Canary: 10% traffic"
          - "Production: 50% traffic"
          - "Production: 100% traffic"
        progression_criteria: "No increase in errors, <1% complaint rate"

      success_criteria:
        - "15-minute expiry active"
        - "Old clients (mobile v2.1) still work"
        - "New clients (mobile v2.2) work correctly"
        - "Auth error rate < 0.5%"
        - "Token refresh rate increases (expected)"

      monitoring:
        - metric: "Auth error rate"
          threshold: "< 0.5%"
          alert: "Rollback if exceeded"

        - metric: "Token refresh rate"
          expected: "2x increase (15min vs 30min)"
          alert: "Alert if > 3x (indicates issues)"

      rollback_plan:
        trigger: "Auth errors > 0.5% OR user complaints > 50"
        action: "Set JWT_EXPIRY back to '30m'"
        time_to_rollback: "< 2 minutes (config change)"

      backward_compatible: true ✅

    - phase_number: 4
      name: "Hard Cutover (Remove 30-minute Support)"
      duration: "1 week"
      objective: "Remove backward compatibility layer"
      prerequisite: "95% users on mobile v2.2+, 99% using 15-minute tokens"

      actions:
        - "Force mobile v2.1 users to upgrade"
        - "Remove 30-minute configuration option"
        - "Clean up compatibility code"

      technical_changes:
        - file: "src/middleware/auth.ts"
          change: "Hardcode 15-minute expiry"
          code: |
            const tokenExpiry = '15m'; // Hardcoded, no fallback

      success_criteria:
        - "100% tokens use 15-minute expiry"
        - "Mobile v2.1 no longer supported"
        - "Compatibility code removed"

      rollback_plan:
        trigger: "Critical auth failures"
        action: "Re-enable 30-minute option temporarily"
        time_to_rollback: "< 10 minutes (code revert)"

      backward_compatible: false ❌
      acceptable: true  # Acceptable after 95% migration
```

### Step 4: Define Rollback Strategy

```yaml
rollback_strategy:
  per_phase_rollback: true

  phase_1_rollback:
    complexity: "low"
    action: "Remove expiry field from API response"
    data_loss: false
    time_required: "< 5 minutes"

  phase_2_rollback:
    complexity: "medium"
    action: "Pause app rollout, keep server at Phase 1"
    data_loss: false
    time_required: "immediate (pause rollout button)"

  phase_3_rollback:
    complexity: "low"
    action: "Change JWT_EXPIRY back to '30m'"
    data_loss: false
    time_required: "< 2 minutes"
    impact: "Users remain logged in"

  phase_4_rollback:
    complexity: "medium"
    action: "Revert code to Phase 3 (re-enable 30m)"
    data_loss: false
    time_required: "< 10 minutes (deploy)"
    impact: "Temporary auth disruption"

  emergency_full_rollback:
    action: "Revert all changes, restore 30-minute hardcoded expiry"
    time_required: "< 15 minutes"
```

### Step 5: Define Success Metrics

```yaml
success_metrics:
  phase_1_metrics:
    - metric: "API response includes expiresIn field"
      target: "100%"
      measurement: "API response validation"

    - metric: "Auth error rate"
      target: "< 0.1% (no increase from baseline)"
      measurement: "Error monitoring dashboard"

  phase_2_metrics:
    - metric: "Mobile v2.2 adoption"
      target: "80% within 4 weeks"
      measurement: "App version analytics"

    - metric: "Auth errors on v2.2"
      target: "< 0.5%"
      measurement: "Client error logs"

  phase_3_metrics:
    - metric: "Token refresh rate"
      target: "2x baseline (expected)"
      measurement: "Auth service metrics"

    - metric: "User complaints"
      target: "< 1% of active users"
      measurement: "Support ticket tracking"

  phase_4_metrics:
    - metric: "All tokens use 15-minute expiry"
      target: "100%"
      measurement: "Token audit log"

  overall_success:
    - "Migration completes in 7 weeks"
    - "Zero data loss"
    - "Auth availability > 99.9%"
    - "User satisfaction maintained"
```

### Step 6: Generate Migration Strategy Document

Use template: `bmad-core/templates/migration-strategy.yaml`

```yaml
# migration-strategy.yaml

migration_strategy:
  strategy_id: "MIG-001"
  # ... (full strategy as designed above)
```

---

## Migration Strategy Types

### Type 1: Phased Rollout
Gradual introduction over time (used above)

### Type 2: Dual-Run
Run old and new in parallel, switch traffic gradually

```yaml
dual_run_example:
  phase_1: "Deploy new system alongside old"
  phase_2: "Route 10% traffic to new"
  phase_3: "Route 50% traffic to new"
  phase_4: "Route 100% traffic to new"
  phase_5: "Decommission old system"
```

### Type 3: Big Bang (Avoid if Possible)
Single cutover at scheduled maintenance

```yaml
big_bang_example:
  suitable_for: "Low-risk changes, non-production systems"
  requires: "Maintenance window, full rollback plan"
  risk: "HIGH"
```

### Type 4: Feature Flag
Toggle new behavior with runtime flag

```yaml
feature_flag_example:
  implementation: "Use feature flag library"
  phase_1: "Deploy code with flag OFF"
  phase_2: "Enable for internal users"
  phase_3: "Enable for 10% users"
  phase_4: "Enable for 100% users"
  phase_5: "Remove flag, clean up code"
```

---

## Output Format

**File:** `docs/migration-strategy-{{migration_id}}.yaml`

**Structure:**
1. **Migration Overview** (current/target state, complexity)
2. **Phased Strategy** (phases with details)
3. **Rollback Plans** (per-phase and emergency)
4. **Success Metrics** (validation criteria)
5. **Timeline** (Gantt chart or schedule)
6. **Risk Assessment** (risks and mitigations)

---

## Success Criteria

- [ ] Current and target states clearly defined
- [ ] Migration complexity assessed
- [ ] Phased strategy designed
- [ ] Each phase has clear objectives
- [ ] Rollback plans defined
- [ ] Success metrics specified
- [ ] Timeline realistic
- [ ] Risk assessment complete
- [ ] Migration strategy document generated

---

## Examples

### Example 1: Low-Risk Migration

**Change:** Add optional field to API response

```yaml
Migration: Single-phase deployment
  Phase 1: Deploy new field (optional, backward compatible)
  Rollback: Remove field if issues
  Duration: 1 week
  Risk: LOW
```

### Example 2: High-Risk Migration

**Change:** Replace authentication system

```yaml
Migration: Multi-phase with dual-run
  Phase 1: Deploy new auth alongside old
  Phase 2: Migrate internal users
  Phase 3: Migrate 10% production users
  Phase 4: Migrate 50% production users
  Phase 5: Migrate 100% users
  Phase 6: Decommission old auth
  Duration: 12 weeks
  Risk: HIGH
```

---

## Integration Points

**Called by:**
- Oracle `validate-compatibility` (when breaking change detected)
- Oracle `validate-enhancement` (if migration missing)
- Compatibility agent
- User (manual migration planning)

**Uses:**
- `existing-system-truth.yaml`
- `domain-truth.yaml`
- `enhancement-truth.yaml`

**Outputs to:**
- `migration-strategy.yaml`
- Enhancement validation
- Deployment plan

---

## Command Signature

```bash
bmad oracle analyze-migration-path \
  --current "JWT expiry: 30 minutes" \
  --target "JWT expiry: 15 minutes" \
  --consumers "mobile_v2.1, web_v3.0" \
  --output docs/migration-strategy-MIG-001.yaml
```

---

**Safe migrations = No broken production = Happy users.**
