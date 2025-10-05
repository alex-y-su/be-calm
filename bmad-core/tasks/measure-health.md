# Measure Project Health

**Agent:** Monitor
**Phase:** All Phases
**Trigger:** On-demand, story_complete, sprint_end

---

## Objective

Assess comprehensive project health across truth alignment, code quality, performance, validation effectiveness, and agent performance metrics.

---

## Inputs

- Current codebase
- Test results (eval, unit, integration)
- Validation gate results
- Performance benchmarks
- Baselines (architecture, performance, quality)
- Historical metrics

---

## Process

### 1. Measure Truth Alignment

#### Domain Truth Alignment Score (0-100)
- Compare code semantics to domain-truth.yaml embeddings
- Target: ≥ 90
- Alert: < 85

#### Requirements Traceability Score (0-100)
- Validate PRD → Epic → Story → Code links
- Target: 100%
- Alert: < 95%

#### Eval Test Coverage (0-100)
- Map eval tests to domain facts
- Target: 100%
- Alert: < 90%

#### Validation Chain Integrity (0-100)
- Trace validation paths
- Target: 100%
- Alert: < 95%

---

### 2. Measure Code Quality

#### Complexity Score
- Run cyclomatic complexity analysis
- Target: < 10 per function
- Alert: Increasing trend over 3 commits

#### Duplication Rate (%)
- Token-based duplication detection
- Target: < 5%
- Alert: > 10%

#### Test Coverage (%)
- Unit + integration coverage
- Target: ≥ 80%
- Alert: < 70%

#### Documentation Coverage (%)
- Function documentation percentage
- Target: ≥ 90%
- Alert: < 75%

---

### 3. Measure Performance

Compare to established baselines:

#### Response Time P95
- Target: Within 10% of baseline
- Alert: > 10% degradation

#### Response Time P99
- Target: Within 15% of baseline
- Alert: > 15% degradation

#### Throughput
- Target: Within 10% of baseline
- Alert: < 10% of baseline

#### Error Rate
- Target: < 1%
- Alert: > 2%

---

### 4. Measure Validation Health

#### Eval Test Pass Rate
- Target: 100%
- Alert (Critical): < 90%

#### Oracle Validation Success
- Target: ≥ 95%
- Alert (Info): < 95%

#### Validator Traceability Success
- Target: 100%
- Alert (Warning): < 98%

#### Gate Pass Rate
- Target: ≥ 90%
- Alert (Warning): < 85%

---

### 5. Measure Agent Performance

#### Oracle Accuracy
- Correct semantic validations
- Target: ≥ 95%
- Alert: < 90%

#### Eval Test Quality
- Useful test failures
- Target: ≥ 90%
- Alert: < 80%

#### Validator False Positives
- Incorrect traceability breaks
- Target: < 5%
- Alert: > 10%

#### Reflection Insight Quality
- Actionable recommendations
- Target: ≥ 80%
- Alert: < 70%

---

### 6. Calculate Overall Health

Weighted average:
- Truth Alignment: 30%
- Code Quality: 20%
- Performance: 20%
- Validation Health: 20%
- Agent Performance: 10%

**Health Levels:**
- 90-100: Healthy ✅
- 70-89: Warning ⚠️
- < 70: Critical 🚨

---

## Outputs

### health-dashboard.yaml

```yaml
health_dashboard:
  metadata:
    generated_at: "2024-10-05T10:30:00Z"
    generated_by: "Monitor Agent"
    project: "MyProject"
    sprint: 12
    phase: "Phase 5 - Development"

  overall_health:
    status: "healthy"
    score: 87
    summary: "System health is good with minor warnings"

  truth_alignment:
    domain_truth_alignment_score:
      value: 87
      threshold: 85
      status: "ok"
      trend: "stable"

    requirements_traceability_score:
      value: 96
      threshold: 95
      status: "ok"
      trend: "improving"

  code_quality:
    overall_score: 82
    status: "ok"
    complexity_score:
      average: 6.2
      max: 12
      threshold: 10
      status: "ok"

  performance:
    overall_status: "ok"
    degradation_from_baseline: 3.2
    response_time_p95:
      current: 125
      baseline: 120
      degradation: 4.2
      status: "ok"

  validation_health:
    eval_test_pass_rate:
      value: 94
      threshold: 90.0
      status: "ok"

  agent_performance:
    oracle_accuracy:
      value: 93
      threshold: 90.0
      status: "ok"

  alerts:
    critical: []
    warning: []
    info: []

  trends:
    overall_health_trend: "stable"
    metrics_improving:
      - metric_name: "requirements_traceability"
        improvement: 2.5
    metrics_degrading: []

  recommendations:
    immediate_action_required: []
    suggested_improvements:
      - recommendation: "Improve test coverage in auth module"
        reason: "Coverage at 68%"
        priority: "medium"
```

**Schema:** `bmad-core/schemas/health-dashboard.schema.yaml`
**Template:** `bmad-core/templates/health-dashboard.template.yaml`
**Location:** `baselines/health-dashboard.yaml`

---

### health-report.md

Human-readable summary:

```markdown
# Health Report - Sprint 12

**Generated:** 2024-10-05 10:30 UTC
**Overall Health:** 87/100 ✅ Healthy

## Summary

System health is good with minor warnings. Truth alignment and validation
health are strong. Code quality and performance are acceptable.

## Metrics

| Category | Score | Status | Trend |
|----------|-------|--------|-------|
| Truth Alignment | 87/100 | ✅ OK | → Stable |
| Code Quality | 82/100 | ✅ OK | → Stable |
| Performance | OK | ✅ OK | → Stable |
| Validation Health | 94/100 | ✅ OK | ↗ Improving |
| Agent Performance | 93/100 | ✅ OK | → Stable |

## Recommendations

- **Medium Priority:** Improve test coverage in auth module (68%)

## Trends

**Improving:**
- Requirements Traceability (+2.5%)

No degrading metrics detected.
```

---

## When to Measure

### On-Demand
- Developer requests health check
- Before major milestones
- During troubleshooting

### Story Complete
- After each story finishes
- Validate no degradation
- Update trends

### Sprint End
- Comprehensive health assessment
- Compare to sprint start
- Generate sprint health report

### Phase Complete
- Major health milestone
- Establish new baselines if needed
- Document phase health

---

## Integration with Reflection

After health measurement:
1. Monitor generates health-dashboard.yaml
2. Reflection analyzes health trends
3. If degrading trends → Generate recommendations
4. Update improvement-recommendations.md

---

## Best Practices

1. **Measure regularly** - At least once per story
2. **Track trends** - Monitor changes over time
3. **Act on warnings** - Don't wait for critical
4. **Update baselines** - After major changes
5. **Review dashboard weekly** - Team health review
6. **Automate measurement** - Run on CI/CD

---

## Example Output

```
📊 Measuring Project Health...

Truth Alignment
  ✓ Domain Truth Alignment: 87 (threshold: 85)
  ✓ Requirements Traceability: 96 (threshold: 95)
  ✓ Eval Test Coverage: 92 (threshold: 90)
  ✓ Validation Chain Integrity: 98 (threshold: 95)

Code Quality
  ✓ Complexity: 6.2 avg (threshold: 10)
  ✓ Duplication: 4.5% (threshold: 10%)
  ✓ Test Coverage: 78% (threshold: 70%)
  ✓ Documentation: 81% (threshold: 75%)

Performance
  ✓ Response Time P95: 125ms (baseline: 120ms, +4.2%)
  ✓ Response Time P99: 185ms (baseline: 180ms, +2.8%)
  ✓ Throughput: 145 req/s (baseline: 150 req/s, -3.3%)
  ✓ Error Rate: 0.8% (threshold: 2%)

Validation Health
  ✓ Eval Test Pass Rate: 94% (threshold: 90%)
  ✓ Oracle Validation: 96% (threshold: 95%)
  ✓ Validator Traceability: 99% (threshold: 98%)
  ✓ Gate Pass Rate: 88% (threshold: 85%)

Agent Performance
  ✓ Oracle Accuracy: 93% (threshold: 90%)
  ✓ Eval Test Quality: 86% (threshold: 80%)
  ✓ Validator False Positives: 4.2% (threshold: 10%)
  ✓ Reflection Insight Quality: 78% (threshold: 70%)

Overall Health: 87/100 ✅ Healthy

📊 Health dashboard saved: baselines/health-dashboard.yaml
```

---

## Related

- **Agent:** `bmad-core/agents/monitor.md`
- **Schema:** `bmad-core/schemas/health-dashboard.schema.yaml`
- **Tasks:**
  - `track-drift.md`
  - `create-baseline.md`
  - `analyze-trends.md`
