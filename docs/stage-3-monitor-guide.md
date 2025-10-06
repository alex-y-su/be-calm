# Monitor Agent User Guide

**Version:** 1.0
**Stage:** 3 (Monitoring & Reflection)
**Agent:** Monitor 📊

---

## Overview

The Monitor agent provides continuous oversight of your project's health, detecting drift from source of truth, tracking quality metrics, monitoring performance baselines, and alerting when thresholds are violated.

---

## Quick Start

### 1. Initialize Monitor

```bash
# Monitor runs automatically, but you can trigger manually
bmad monitor measure-health
```

### 2. Check Health Dashboard

```bash
# View current health
cat baselines/health-dashboard.yaml
```

### 3. Review Active Alerts

```bash
# Check for drift alerts
cat baselines/drift-alerts.yaml
```

---

## Core Functions

### Track Drift

**When:** Continuous (file save, commit, validation gate)
**Purpose:** Detect deviation from source of truth

```bash
bmad monitor track-drift
```

**What it monitors:**
- Semantic drift from domain-truth.yaml
- Requirement drift from PRD
- Architecture drift from architecture.md
- Test drift (eval coverage)

**Alerts:**
- 🚨 Critical: Blocks commit
- ⚠️ Warning: Notifies developer
- ℹ️ Info: Logs for review

---

### Measure Health

**When:** Story complete, sprint end, on-demand
**Purpose:** Comprehensive health assessment

```bash
bmad monitor measure-health
```

**Metrics tracked:**
- **Truth Alignment** (30% weight)
  - Domain truth alignment: 87/100
  - Requirements traceability: 96%
  - Eval test coverage: 92%
  - Validation chain integrity: 98%

- **Code Quality** (20% weight)
  - Complexity: 6.2 avg
  - Duplication: 4.5%
  - Test coverage: 78%
  - Documentation: 81%

- **Performance** (20% weight)
  - Response time P95: 125ms
  - Response time P99: 185ms
  - Throughput: 145 req/s
  - Error rate: 0.8%

- **Validation Health** (20% weight)
  - Eval test pass rate: 94%
  - Oracle validation success: 96%
  - Validator traceability: 99%
  - Gate pass rate: 88%

- **Agent Performance** (10% weight)
  - Oracle accuracy: 93%
  - Eval test quality: 86%
  - Validator false positives: 4.2%
  - Reflection insight quality: 78%

**Output:** `baselines/health-dashboard.yaml`

---

### Create Baseline

**When:** Phase -1 (Codebase Discovery), Phase 3 (Architecture)
**Purpose:** Establish performance/quality baselines

```bash
bmad monitor create-baseline architecture
bmad monitor create-baseline performance
bmad monitor create-baseline quality
```

**Baselines created:**
- `baselines/architecture-metrics.yaml`
- `baselines/performance-metrics.yaml`
- `baselines/quality-metrics.yaml`

---

### Analyze Trends

**When:** Sprint end, phase complete
**Purpose:** Identify patterns over time

```bash
bmad monitor analyze-trends
```

**Outputs:**
- Trend analysis report
- Historical metrics chart
- Degradation warnings

---

## Understanding Alerts

### Critical Alerts 🚨

**Block workflow until resolved**

- Eval test pass rate < 90%
- Test coverage < 90%

**Action:** Fix immediately before proceeding

### Warning Alerts ⚠️

**Recommend action, not blocking**

- Domain alignment < 85
- Performance degradation > 10%
- Requirement drift detected

**Action:** Address soon, log for review

### Info Alerts ℹ️

**Track trends, informational**

- Oracle success rate < 95%
- Agent performance declining

**Action:** Monitor, no immediate action

---

## Drift Detection

### Semantic Drift

**What:** Code diverging from domain truth

**Example:**
```
⚠️ Semantic Drift Detected
Domain Truth: "User authentication requires email verification"
Implementation: Using phone verification instead
Alignment Score: 78 (threshold: 85)

Action: Review src/auth/login.js against FACT-007
```

### Requirement Drift

**What:** Code implementing features not in PRD

**Example:**
```
⚠️ Requirement Drift Detected
Feature: Admin dashboard analytics
Location: src/admin/analytics.js:45
PRD Reference: None

Action: Add to PRD or remove from code
```

### Architecture Drift

**What:** Components not in architecture.md

**Example:**
```
⚠️ Architecture Drift Detected
New Component: CacheManager
Location: src/services/cache.js
Dependencies: Redis, MemoryStore

Action: Update architecture.md
```

### Test Drift

**What:** Eval test coverage declining

**Example:**
```
🚨 Test Drift Critical
Eval Coverage: 87% (was 93%)
Drop: -6%
Uncovered Facts: FACT-012, FACT-018

Action: Add eval tests for uncovered facts
```

---

## Health Dashboard

### Overall Health Score

**90-100:** ✅ Healthy
**70-89:** ⚠️ Warning
**< 70:** 🚨 Critical

**Weighted Calculation:**
```
Score = (
  Truth_Alignment × 0.30 +
  Code_Quality × 0.20 +
  Performance × 0.20 +
  Validation_Health × 0.20 +
  Agent_Performance × 0.10
)
```

### Reading the Dashboard

```yaml
overall_health:
  status: "healthy"     # ✅
  score: 87            # Good
  summary: "System health is good with minor warnings"

truth_alignment:
  domain_truth_alignment_score:
    value: 87           # Current
    threshold: 85       # Minimum acceptable
    status: "ok"        # ✅ Above threshold
    trend: "stable"     # → No change

alerts:
  critical: []          # None - good!
  warning:
    - "Test coverage low in auth module (68%)"
  info: []

trends:
  overall_health_trend: "stable"
  metrics_improving:
    - "requirements_traceability: +2.5%"
  metrics_degrading: []
```

---

## Integration with Workflow

### Continuous Monitoring

**File Save:**
- Quick semantic check
- Log metrics
- Update trends

**Commit:**
- Full drift analysis
- Baseline comparison
- Alert on violations
- Block if critical

**Validation Gate:**
- Comprehensive health check
- Generate drift report
- Update health dashboard

---

### Phase Integration

**Phase -1: Codebase Discovery**
- Establish performance baselines
- Track integration mapping
- Monitor regression coverage

**Phase 0: Domain Research**
- Monitor domain-truth.yaml completeness
- Track terminology consistency

**Phase 1: Eval Foundation**
- Monitor eval coverage (target: 100%)
- Track test quality

**Phase 2: Discovery**
- Monitor requirements traceability
- Track Oracle success
- Alert on invented features

**Phase 3: Architecture**
- Establish architecture baselines
- Monitor PRD ↔ architecture alignment
- Track integration coverage

**Phase 4: Planning**
- Monitor story eval coverage
- Track story ↔ epic ↔ PRD traceability

**Phase 5: Development**
- Continuous eval pass rate monitoring
- Real-time drift detection
- Performance alerts
- Quality tracking
- Gate pass monitoring

---

## Common Workflows

### Weekly Health Review

```bash
# 1. Generate health report
bmad monitor measure-health

# 2. Review dashboard
cat baselines/health-dashboard.yaml

# 3. Check alerts
cat baselines/drift-alerts.yaml

# 4. Review trends
bmad monitor analyze-trends

# 5. Address warnings
# Fix any warning-level alerts
```

### Pre-Commit Check

```bash
# 1. Track drift
bmad monitor track-drift

# 2. Check for blocks
# If critical alerts → Fix before committing

# 3. Commit if clear
git commit -m "Feature implementation"
```

### Sprint End Health Check

```bash
# 1. Full health assessment
bmad monitor measure-health

# 2. Analyze sprint trends
bmad monitor analyze-trends

# 3. Generate report
# Review health-dashboard.yaml

# 4. Send to Reflection
# Reflection analyzes for improvements
```

---

## Best Practices

1. **Review health weekly** - Check dashboard every sprint
2. **Address warnings promptly** - Don't let them accumulate
3. **Monitor trends** - Watch for degrading metrics
4. **Update baselines** - After major architecture changes
5. **Tune thresholds** - Adjust based on project needs
6. **Act on critical alerts** - Fix immediately
7. **Integrate with CI/CD** - Automate monitoring

---

## Troubleshooting

### High False Positive Rate

**Problem:** Too many false alerts

**Solution:**
- Review thresholds in `core-config.yaml`
- Tune sensitivity based on project
- Work with Reflection to optimize

### Missing Baselines

**Problem:** "No baseline found" errors

**Solution:**
```bash
bmad monitor create-baseline architecture
bmad monitor create-baseline performance
bmad monitor create-baseline quality
```

### Drift Not Detected

**Problem:** Known drift not alerting

**Solution:**
- Check threshold configuration
- Verify domain-truth.yaml up to date
- Review embedding generation

---

## Configuration

Edit `bmad-core/core-config.yaml`:

```yaml
monitoring:
  enabled: true
  continuous_mode: true

  thresholds:
    domain_truth_alignment: 85
    eval_test_pass_rate: 90
    test_coverage: 70
    performance_degradation: 10
    oracle_validation_success: 95

  alerts:
    enabled: true
    block_on_critical: true

  baselines:
    auto_create: true
    update_on_phase_complete: true
```

---

## Related Resources

- **Agent Spec:** `bmad-core/agents/monitor.md`
- **Tasks:** `bmad-core/tasks/track-drift.md`, `measure-health.md`
- **Schemas:** `bmad-core/schemas/health-dashboard.schema.yaml`
- **Templates:** `bmad-core/templates/health-dashboard.template.yaml`
- **Reflection Guide:** `docs/stage-3-reflection-guide.md`
