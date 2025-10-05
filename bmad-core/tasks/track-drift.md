# Track Drift from Source of Truth

**Agent:** Monitor
**Phase:** Continuous (All Phases)
**Trigger:** file_save, commit, validation_gate

---

## Objective

Monitor and detect deviation from source of truth (domain-truth.yaml, PRD, Architecture) in real-time to catch alignment issues before they become problems.

---

## Inputs

- **Domain Truth:** `domain-truth.yaml`
- **PRD:** `docs/prd.md`
- **Architecture:** `docs/architecture.md`
- **Current Code:** All implementation files
- **Eval Tests:** Test suite
- **Baselines:** Previously established metric baselines

---

## Process

### 1. Semantic Drift Detection

**What:** Compare current implementation semantics to domain-truth.yaml

**How:**
1. Extract semantic embeddings from current code
2. Load domain-truth.yaml embeddings (or generate)
3. Calculate similarity scores for each domain fact
4. Identify divergence points where similarity < 0.85

**Alert if:**
- Overall alignment score < 85
- Any critical domain fact has score < 0.80

**Example:**
```yaml
drift_detected:
  type: semantic_drift
  fact_id: FACT-007
  fact: "User authentication requires email verification"
  alignment_score: 0.78
  divergence: "Code implements phone verification instead"
  action: "Review implementation against domain truth"
```

---

### 2. Requirement Drift Detection

**What:** Detect code implementing features not in PRD

**How:**
1. Parse PRD for all functional requirements
2. Analyze codebase for implemented features
3. Map features to requirements
4. Identify unmapped features (potential drift)

**Alert if:**
- > 10% of code features have no PRD backing
- Critical functionality added without requirement

**Example:**
```yaml
drift_detected:
  type: requirement_drift
  uncovered_functionality:
    - feature: "Admin dashboard analytics"
      location: "src/admin/analytics.js:45"
      prd_reference: null
  action: "Add to PRD or remove from code"
```

---

### 3. Architecture Drift Detection

**What:** Find components not documented in architecture.md

**How:**
1. Parse architecture.md for component list
2. Scan codebase for actual components
3. Compare lists
4. Identify new/missing components

**Alert if:**
- > 5% component deviation
- New critical components undocumented

**Example:**
```yaml
drift_detected:
  type: architecture_drift
  new_components:
    - component: "CacheManager"
      location: "src/services/cache.js"
      dependencies: ["Redis", "MemoryStore"]
  action: "Update architecture.md with new component"
```

---

### 4. Test Drift Detection

**What:** Track eval test coverage declining over time

**How:**
1. Count total domain facts in domain-truth.yaml
2. Count eval tests covering each fact
3. Calculate coverage percentage
4. Compare to previous coverage

**Alert if:**
- Coverage < 90%
- Coverage dropped > 5% from last check

**Example:**
```yaml
drift_detected:
  type: test_drift
  eval_coverage: 87%
  previous_coverage: 93%
  drop: -6%
  uncovered_facts:
    - FACT-012: "Password must contain special character"
    - FACT-018: "Session timeout after 30 minutes"
  action: "Add eval tests for uncovered facts"
```

---

## Outputs

### drift-alerts.md

```markdown
# Drift Alerts

## Active Alerts

### ALERT-2024-10-05-001 - Semantic Drift Detected

**Severity:** Warning
**Category:** semantic_drift
**Metric:** domain_truth_alignment_score
**Value:** 82
**Threshold:** 85

**Details:**
Implementation drifting from domain truth in authentication module.

**Affected Facts:**
- FACT-007: User authentication (score: 0.78)

**Recommended Action:**
Review `src/auth/login.js` against domain truth FACT-007
```

**Schema:** `bmad-core/schemas/drift-alerts.schema.yaml`
**Location:** `baselines/drift-alerts.md`

---

## Alert Actions

### Critical Severity
- **Block commit** - Prevent code from being committed
- **Require fix** - Must be addressed before proceeding
- **Example:** Eval test coverage < 90%

### Warning Severity
- **Notify developer** - Alert via console/log
- **Recommend action** - Suggest specific fix
- **Example:** Domain alignment < 85

### Info Severity
- **Log for review** - Record for later analysis
- **Track trend** - Monitor over time
- **Example:** Oracle success rate < 95%

---

## Continuous Monitoring

### On File Save
- Quick semantic check
- Log metrics
- Update trends

### On Commit
- Full drift analysis
- Baseline comparison
- Alert on violations
- Block if critical

### On Validation Gate
- Comprehensive health check
- Generate drift report
- Update health dashboard

---

## Integration with Reflection

When drift detected:
1. Monitor logs drift alert
2. If recurring → Reflection analyzes pattern
3. Reflection generates recommendation
4. Update domain truth or code based on recommendation

---

## Best Practices

1. **Establish baselines early** - Set initial metrics in Phase -1
2. **Monitor continuously** - Run on every commit
3. **Act on warnings** - Don't ignore non-critical alerts
4. **Update truth proactively** - Keep domain-truth.yaml current
5. **Review trends weekly** - Check historical-trends.json
6. **Tune thresholds** - Adjust based on project needs

---

## Example Workflow

```bash
# Developer commits code
git add .
git commit -m "Add retry logic"

# Monitor detects commit event
📊 Monitor: Tracking drift...

# Drift analysis runs
✓ Semantic drift: OK (score: 87)
✓ Requirement drift: OK (0% uncovered)
✓ Architecture drift: OK (0% deviation)
✗ Test drift: ALERT (coverage: 88%)

# Alert generated
🚨 CRITICAL: Eval test coverage dropped to 88%
Blocking commit until coverage restored.

# Developer adds missing tests
# Re-runs commit
✓ All drift checks passed
Commit allowed.
```

---

## Related

- **Agent:** `bmad-core/agents/monitor.md`
- **Schema:** `bmad-core/schemas/drift-alerts.schema.yaml`
- **Tasks:**
  - `measure-health.md`
  - `create-baseline.md`
  - `analyze-trends.md`
