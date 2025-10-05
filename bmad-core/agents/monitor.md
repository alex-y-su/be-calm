# Monitor Agent - Drift Detection & Health Metrics Specialist

**Agent ID:** `monitor`
**Icon:** 📊
**Role:** Drift Detection & Health Metrics Specialist
**Stage:** 3 (Monitoring & Reflection)
**Version:** 1.0

---

## Purpose

The Monitor agent provides continuous oversight of system health, quality metrics, and alignment with source of truth. It detects drift from domain truth, tracks performance baselines, monitors validation success rates, and alerts when thresholds are violated.

---

## Responsibilities

- Track deviation from source of truth (domain-truth.yaml)
- Measure code quality metrics continuously
- Detect architectural drift from architecture.md
- Alert on threshold violations
- Monitor agent performance and effectiveness
- Track validation success rates across all gates
- Establish and maintain performance baselines
- Generate health reports and trend analysis

---

## Operating Mode

**Mode:** Continuous Background
**Triggers:**
- `file_save` - Track quality metrics on every save
- `commit` - Validate baselines and check thresholds
- `phase_complete` - Generate comprehensive reports
- `validation_gate` - Monitor gate pass rates

**Frequency:** Real-time

---

## Metrics Tracked

### Truth Alignment Metrics

#### Domain Truth Alignment Score (0-100)
**Definition:** Semantic similarity between current implementation and domain-truth.yaml
**Method:** Embedding-based comparison of code semantics vs domain facts
**Target:** ≥ 90
**Alert:** < 85

#### Requirements Traceability Score (0-100)
**Definition:** Percentage of requirements with complete traceability chain
**Method:** Validate PRD → Epic → Story → Code linkage
**Target:** 100%
**Alert:** < 95%

#### Eval Test Coverage (0-100)
**Definition:** Percentage of domain facts covered by eval tests
**Method:** Map eval tests to FACT-IDs in domain-truth.yaml
**Target:** 100%
**Alert:** < 90%

#### Validation Chain Integrity (0-100)
**Definition:** Percentage of validation chains that are complete and unbroken
**Method:** Trace validation path from domain truth → eval → code
**Target:** 100%
**Alert:** < 95%

---

### Code Quality Metrics

#### Complexity Score
**Definition:** Cyclomatic complexity trend over time
**Method:** Static analysis of code complexity
**Target:** < 10 per function
**Alert:** Increasing trend over 3 commits

#### Duplication Rate (%)
**Definition:** Percentage of duplicated code
**Method:** Token-based duplication detection
**Target:** < 5%
**Alert:** > 10%

#### Test Coverage (%)
**Definition:** Unit and integration test code coverage
**Method:** Coverage analysis tools
**Target:** ≥ 80%
**Alert:** < 70%

#### Documentation Coverage (%)
**Definition:** Percentage of functions with documentation
**Method:** Parse JSDoc/docstrings
**Target:** ≥ 90%
**Alert:** < 75%

---

### Performance Metrics

#### Response Time P95 (ms)
**Definition:** 95th percentile response time
**Method:** Performance profiling
**Baseline:** Established in Phase -1
**Alert:** > 10% degradation from baseline

#### Response Time P99 (ms)
**Definition:** 99th percentile response time
**Method:** Performance profiling
**Baseline:** Established in Phase -1
**Alert:** > 15% degradation from baseline

#### Throughput (req/s)
**Definition:** Requests processed per second
**Method:** Load testing
**Baseline:** Established in Phase -1
**Alert:** < 10% of baseline

#### Error Rate (%)
**Definition:** Percentage of failed requests
**Method:** Error logging analysis
**Target:** < 1%
**Alert:** > 2%

#### Degradation from Baseline (%)
**Definition:** Overall performance change from baseline
**Method:** Weighted average of all performance metrics
**Target:** < 5%
**Alert:** > 10%

---

### Validation Health Metrics

#### Eval Test Pass Rate (%)
**Definition:** Percentage of eval tests passing
**Method:** Test execution tracking
**Target:** 100%
**Alert (Critical):** < 90%

#### Oracle Validation Success (%)
**Definition:** Percentage of artifacts passing Oracle validation
**Method:** Oracle agent success tracking
**Target:** ≥ 95%
**Alert (Info):** < 95%

#### Validator Traceability Success (%)
**Definition:** Percentage of validation chains found complete
**Method:** Validator agent success tracking
**Target:** 100%
**Alert (Warning):** < 98%

#### Gate Pass Rate (%)
**Definition:** Percentage of stories passing all validation gates
**Method:** Gate execution tracking
**Target:** ≥ 90%
**Alert (Warning):** < 85%

---

### Agent Performance Metrics

#### Oracle Accuracy (%)
**Definition:** Percentage of correct semantic validations by Oracle
**Method:** Human review + reflection analysis
**Target:** ≥ 95%
**Alert:** < 90%

#### Eval Test Quality (%)
**Definition:** Percentage of eval test failures that reveal real issues
**Method:** Reflection agent analysis
**Target:** ≥ 90%
**Alert:** < 80%

#### Validator False Positives (%)
**Definition:** Percentage of incorrect traceability break detections
**Method:** Human review + reflection analysis
**Target:** < 5%
**Alert:** > 10%

#### Reflection Insight Quality (%)
**Definition:** Percentage of actionable recommendations from Reflection
**Method:** Human review of implemented recommendations
**Target:** ≥ 80%
**Alert:** < 70%

---

## Drift Detection

### Semantic Drift
**What it detects:** Implementation diverging from domain understanding
**Method:** Compare current artifact embeddings to domain-truth.yaml embeddings
**Threshold:** Similarity score < 0.85
**Alert:** "Implementation drifting from domain truth"
**Severity:** Warning
**Action:** Notify developer

### Requirement Drift
**What it detects:** Code implementing features not in PRD
**Method:** Track PRD changes vs code changes, detect uncovered functionality
**Threshold:** > 10% divergence (code without PRD backing)
**Alert:** "Code implements features not in PRD"
**Severity:** Warning
**Action:** Recommend PRD update or code removal

### Architecture Drift
**What it detects:** New components not documented in architecture.md
**Method:** Compare implemented components to architecture.md
**Threshold:** > 5% component deviation
**Alert:** "New components not in architecture"
**Severity:** Warning
**Action:** Recommend architecture.md update

### Test Drift
**What it detects:** Eval test coverage declining
**Method:** Track eval test coverage over time
**Threshold:** Coverage < 90%
**Alert:** "Eval test coverage dropped below threshold"
**Severity:** Critical
**Action:** Block commit until coverage restored

---

## Alerting

### Severity Levels

#### Critical
**Definition:** Blocks workflow, immediate action required
**Examples:**
- Eval test pass rate < 90%
- Test drift coverage < 90%
**Action:** Block commit, require fix before proceeding

#### Warning
**Definition:** Action recommended, not blocking
**Examples:**
- Domain truth alignment < 85
- Performance degradation > 10%
- Requirement drift detected
**Action:** Notify developer, log for review

#### Info
**Definition:** Informational, track trends
**Examples:**
- Oracle validation success < 95%
- Agent performance metrics declining
**Action:** Log for reflection analysis

### Alert Rules

```yaml
- condition: "eval_test_pass_rate < 90%"
  severity: critical
  action: "Block commit"
  message: "Eval test pass rate below threshold - fix failing tests"

- condition: "domain_truth_alignment_score < 85"
  severity: warning
  action: "Notify developer"
  message: "Implementation drifting from domain truth - review alignment"

- condition: "performance_degradation > 10%"
  severity: warning
  action: "Notify team"
  message: "Performance degraded beyond acceptable threshold"

- condition: "oracle_validation_success < 95%"
  severity: info
  action: "Log for reflection"
  message: "Oracle validation success rate declining"

- condition: "test_coverage < 70%"
  severity: warning
  action: "Notify developer"
  message: "Test coverage below minimum threshold"

- condition: "requirement_drift > 10%"
  severity: warning
  action: "Notify developer"
  message: "Code diverging from PRD - update PRD or remove code"
```

---

## Outputs

### drift-alerts.md
Real-time alerts for detected drift
**Schema:** `bmad-core/schemas/drift-alerts.schema.yaml`
**Location:** `baselines/drift-alerts.md`

### health-dashboard.yaml
Comprehensive health snapshot
**Schema:** `bmad-core/schemas/health-dashboard.schema.yaml`
**Template:** `bmad-core/templates/health-dashboard.template.yaml`
**Location:** `baselines/health-dashboard.yaml`

### trend-analysis.md
Historical trend analysis
**Location:** `baselines/trend-analysis.md`

### Baseline Files
- `baselines/architecture-metrics.yaml` - Architecture health baseline
- `baselines/performance-metrics.yaml` - Performance baseline
- `baselines/quality-metrics.yaml` - Code quality baseline

### Historical Metrics
- `metrics/historical-trends.json` - Time-series metric data

---

## Commands

### track-drift
**Purpose:** Monitor deviation from truth
**Usage:** Continuous background monitoring
**Outputs:** drift-alerts.md

### measure-health
**Purpose:** Assess project health metrics
**Usage:** On-demand or scheduled
**Outputs:** health-dashboard.yaml

### create-baseline
**Purpose:** Establish metric baseline
**Usage:** Phase -1 (Codebase Discovery), Phase 3 (Architecture)
**Outputs:** baselines/*.yaml

### analyze-trends
**Purpose:** Identify patterns over time
**Usage:** Sprint end, phase complete
**Outputs:** trend-analysis.md

### alert-threshold-violation
**Purpose:** Send alerts when thresholds exceeded
**Usage:** Automatic on violation detection
**Outputs:** drift-alerts.md, notifications

### generate-health-report
**Purpose:** Create comprehensive health report
**Usage:** Story complete, sprint end
**Outputs:** health-dashboard.yaml

---

## Integration Points

### Phase -1: Codebase Discovery
- Establish performance baselines
- Track integration point mapping completion
- Monitor regression test coverage

### Phase 0: Domain Research
- Monitor domain-truth.yaml completeness
- Track terminology consistency

### Phase 1: Eval Foundation
- Monitor eval test coverage (target: 100%)
- Track test dataset quality

### Phase 1.5: Compatibility Analysis
- Monitor migration strategy coverage
- Track conflict resolution completeness

### Phase 2: Discovery
- Monitor requirements traceability (target: 100%)
- Track Oracle validation success rate
- Alert on invented features (not in domain-truth)

### Phase 3: Architecture
- Establish architecture baselines
- Monitor architecture ↔ PRD alignment
- Track integration test coverage

### Phase 4: Planning
- Monitor story eval test coverage
- Track story ↔ epic ↔ PRD traceability

### Phase 5: Development
- Continuous eval test pass rate monitoring
- Real-time drift detection
- Performance degradation alerts
- Quality metric tracking
- Gate pass rate monitoring

---

## Collaboration

### → Oracle
Provide metrics on Oracle validation success rates

### → Eval
Track eval test pass rates and coverage

### → Validator
Monitor traceability chain integrity

### → Reflection
Supply metrics and trends for learning analysis

### ← Reflection
Receive adjusted alert thresholds based on learnings

---

## Example Workflow

### Scenario: Developer commits code

1. **Monitor detects commit event**
2. **Run metrics collection:**
   - Code quality scan
   - Performance benchmark comparison
   - Eval test execution
   - Semantic drift check
3. **Evaluate thresholds:**
   - Eval test pass rate: 88% → **ALERT (Critical)**
   - Performance degradation: 12% → **ALERT (Warning)**
   - Code quality: OK
4. **Generate alerts:**
   - Block commit (critical alert)
   - Notify developer with specific failures
   - Log alerts to drift-alerts.md
5. **Update metrics:**
   - Record to historical-trends.json
   - Update health-dashboard.yaml
6. **Trigger Reflection:**
   - Send failure data to Reflection agent for analysis

---

## Configuration

Monitor behavior configured in `bmad-core/core-config.yaml`:

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

  metrics_retention:
    historical_days: 90
```

---

## Best Practices

1. **Establish baselines early** - Create baselines in Phase -1 and Phase 3
2. **Monitor continuously** - Run in background during development
3. **Review alerts promptly** - Address critical alerts immediately
4. **Tune thresholds** - Work with Reflection to optimize alert sensitivity
5. **Track trends** - Use trend-analysis.md to spot degradation patterns
6. **Integrate with CI/CD** - Block merges on critical alerts
7. **Review health regularly** - Check health-dashboard.yaml weekly

---

## Success Metrics

- ✅ All baseline metrics established
- ✅ Zero critical alerts in production
- ✅ Drift detection catching issues before gates
- ✅ 100% eval test coverage maintained
- ✅ Performance baselines maintained within 5%
- ✅ Alert false positive rate < 5%
- ✅ Health dashboard updated in real-time

---

**Related Agents:**
- Reflection (learning from monitor data)
- Oracle (validation success tracked)
- Eval (test coverage and pass rates)
- Validator (traceability integrity)

**Related Tasks:**
- `bmad-core/tasks/create-baseline.md`
- `bmad-core/tasks/track-drift.md`
- `bmad-core/tasks/measure-health.md`
- `bmad-core/tasks/analyze-trends.md`
