# Stage 3: Monitoring & Reflection

**Version:** 1.0
**Date:** 2025-10-04
**Implementation Phase:** Autonomy (v5.5)
**Estimated Effort:** 3-4 weeks
**Prerequisites:** Stage 1 & 2 completed (Core agents + workflows operational)

---

## Overview

Stage 3 introduces continuous monitoring and learning capabilities through the Monitor and Reflection agents. These agents track system health, detect drift from truth, analyze failures, and enable the system to learn and improve over time.

---

## Agent Specifications

### Monitor Agent - Drift Detection & Metrics

```yaml
agent:
  name: "Monitor"
  id: monitor
  icon: 📊
  role: "Drift Detection & Health Metrics Specialist"

  responsibilities:
    - Tracks deviation from source of truth
    - Measures code quality metrics
    - Detects architectural drift
    - Alerts on threshold violations
    - Monitors agent performance
    - Tracks validation success rates

  monitors:
    - domain_drift: "Are we still solving the right problem?"
    - requirement_drift: "Do PRD and code still align?"
    - test_coverage: "Are we validating everything?"
    - quality_metrics: "Is code quality degrading?"
    - performance_metrics: "Are performance baselines maintained?"
    - validation_success_rate: "Are validation gates passing consistently?"
    - agent_effectiveness: "Are agents performing well?"

  operates:
    mode: "continuous_background"
    triggers: ["file_save", "commit", "phase_complete", "validation_gate"]
    frequency: "real_time"

  metrics_tracked:
    truth_alignment:
      - domain_truth_alignment_score: "0-100 (semantic similarity)"
      - requirements_traceability_score: "0-100 (% requirements traced)"
      - eval_test_coverage: "0-100 (% domain facts covered)"
      - validation_chain_integrity: "0-100 (% chain complete)"

    code_quality:
      - complexity_score: "Cyclomatic complexity trends"
      - duplication_rate: "Code duplication percentage"
      - test_coverage: "Unit/integration test coverage"
      - documentation_coverage: "% functions documented"

    performance:
      - response_time_p95: "95th percentile response time"
      - response_time_p99: "99th percentile response time"
      - throughput: "Requests per second"
      - error_rate: "% failed requests"
      - degradation_from_baseline: "% change from baseline"

    validation_health:
      - eval_test_pass_rate: "% eval tests passing"
      - oracle_validation_success: "% artifacts passing Oracle"
      - validator_traceability_success: "% complete chains"
      - gate_pass_rate: "% stories passing all gates"

    agent_performance:
      - oracle_accuracy: "% correct semantic validations"
      - eval_test_quality: "% useful test failures"
      - validator_false_positives: "% incorrect traceability breaks"
      - reflection_insight_quality: "% actionable recommendations"

  drift_detection:
    semantic_drift:
      method: "Compare current artifacts to domain-truth embeddings"
      threshold: 0.85  # Similarity score
      alert_when: "score < threshold"

    requirement_drift:
      method: "Track PRD changes vs code changes"
      threshold: "10% divergence"
      alert_when: "code implements features not in PRD"

    architecture_drift:
      method: "Compare implemented architecture to architecture.md"
      threshold: "5% component deviation"
      alert_when: "new components not in architecture"

    test_drift:
      method: "Track eval test coverage over time"
      threshold: "Coverage < 90%"
      alert_when: "coverage drops below threshold"

  alerting:
    severity_levels:
      - critical: "Blocks workflow, immediate action required"
      - warning: "Action recommended, not blocking"
      - info: "Informational, track trends"

    alert_rules:
      - condition: "eval_test_pass_rate < 90%"
        severity: critical
        action: "Block commit"
        message: "Eval test pass rate below threshold"

      - condition: "domain_truth_alignment_score < 85"
        severity: warning
        action: "Notify developer"
        message: "Implementation drifting from domain truth"

      - condition: "performance_degradation > 10%"
        severity: warning
        action: "Notify team"
        message: "Performance degraded beyond acceptable threshold"

      - condition: "oracle_validation_success < 95%"
        severity: info
        action: "Log for reflection"
        message: "Oracle validation success rate declining"

  outputs:
    - drift-alerts.md
    - health-dashboard.yaml
    - trend-analysis.md
    - baselines/architecture-metrics.yaml
    - baselines/performance-metrics.yaml
    - baselines/quality-metrics.yaml
    - metrics/historical-trends.json

  commands:
    - track-drift: Monitor deviation from truth
    - measure-health: Assess project health metrics
    - create-baseline: Establish metric baseline
    - analyze-trends: Identify patterns over time
    - alert-threshold-violation: Send alerts when thresholds exceeded
    - generate-health-report: Create comprehensive health report
```

**Implementation Tasks:**

#### Core Monitoring Infrastructure
- [ ] Create `bmad-core/agents/monitor.md`
- [ ] Implement metrics collection system
- [ ] Build drift detection algorithms
- [ ] Create baseline establishment system
- [ ] Implement real-time metrics tracking

#### Truth Alignment Monitoring
- [ ] Build domain-truth alignment scorer (semantic similarity)
- [ ] Implement requirements traceability tracker
- [ ] Create eval test coverage monitor
- [ ] Build validation chain integrity checker

#### Code Quality Monitoring
- [ ] Integrate cyclomatic complexity analyzer
- [ ] Implement code duplication detector
- [ ] Create test coverage tracker
- [ ] Build documentation coverage analyzer

#### Performance Monitoring
- [ ] Implement response time tracking
- [ ] Create throughput monitor
- [ ] Build error rate tracker
- [ ] Implement baseline comparison system

#### Drift Detection
- [ ] Build semantic drift detector (embedding comparison)
- [ ] Implement requirement drift tracker
- [ ] Create architecture drift detector
- [ ] Build test coverage drift monitor

#### Alerting System
- [ ] Create alert rule engine
- [ ] Implement severity-based routing
- [ ] Build threshold violation detector
- [ ] Create notification system (log, email, UI)

#### Outputs
- [ ] Create health-dashboard.yaml generator
- [ ] Build drift-alerts.md formatter
- [ ] Implement trend-analysis.md generator
- [ ] Create historical trends tracker (JSON)
- [ ] Build baseline snapshot system

---

### Reflection Agent - Learning & Improvement

```yaml
agent:
  name: "Reflection"
  id: reflection
  icon: 🪞
  role: "Meta-Analysis & Learning Specialist"

  responsibilities:
    - Reviews decisions against outcomes
    - Learns from eval failures
    - Identifies improvement patterns
    - Updates agent strategies
    - Analyzes workflow efficiency
    - Recommends process improvements

  operates:
    mode: "event_driven"
    triggers:
      - story_complete
      - sprint_end
      - eval_failure
      - oracle_validation_failure
      - gate_blocked
      - phase_complete
      - weekly_review

  analysis_types:
    failure_analysis:
      when: "eval test fails OR oracle validation fails"
      analyzes:
        - "Why did this fail?"
        - "Was domain truth incomplete?"
        - "Was requirement unclear?"
        - "Was implementation wrong?"
        - "Was test wrong?"
      outputs: "failure-analysis.md"

    success_pattern_analysis:
      when: "story completes successfully"
      analyzes:
        - "What contributed to success?"
        - "Which validation gates were most valuable?"
        - "What agent interactions worked well?"
      outputs: "success-patterns.md"

    agent_performance_analysis:
      when: "sprint_end OR phase_complete"
      analyzes:
        - "Which agents are most/least accurate?"
        - "Where are validation bottlenecks?"
        - "Which agents need tuning?"
        - "Are agents collaborating effectively?"
      outputs: "agent-performance-report.md"

    process_efficiency_analysis:
      when: "sprint_end"
      analyzes:
        - "Which phases take longest?"
        - "Where do workflows stall?"
        - "Which validation gates fail most?"
        - "Are human checkpoints optimally placed?"
      outputs: "process-efficiency-report.md"

    truth_quality_analysis:
      when: "weekly_review"
      analyzes:
        - "Is domain-truth.yaml complete?"
        - "Are eval tests catching real issues?"
        - "Are validation rules too strict/loose?"
        - "Is traceability providing value?"
      outputs: "truth-quality-report.md"

  learning_loops:
    eval_failure_loop:
      trigger: "Eval test fails"
      analyze:
        - Root cause (code bug OR truth gap OR test error)
        - Pattern (is this failure recurring?)
        - Impact (what was affected?)
      learn:
        - If truth gap → Recommend domain-truth update
        - If recurring → Recommend eval test improvement
        - If pattern → Recommend preventive measure
      update:
        - Add to failure-pattern-library.yaml
        - Update agent strategies if needed

    oracle_validation_loop:
      trigger: "Oracle blocks artifact"
      analyze:
        - Why did Oracle block?
        - Was block correct?
        - Could this be prevented earlier?
      learn:
        - Identify terminology issues
        - Find domain truth gaps
        - Improve Oracle rules
      update:
        - Update terminology-map.yaml
        - Refine Oracle validation rules

    gate_failure_loop:
      trigger: "Story fails validation gate"
      analyze:
        - Which gate failed?
        - Was failure valid?
        - Why wasn't it caught earlier?
      learn:
        - Identify upstream validation gaps
        - Recommend earlier validation
        - Suggest gate threshold tuning
      update:
        - Adjust gate thresholds
        - Add preventive validations

    workflow_efficiency_loop:
      trigger: "Sprint end"
      analyze:
        - Story completion velocity
        - Average time per phase
        - Validation gate pass rates
        - Human intervention frequency
      learn:
        - Identify bottlenecks
        - Find optimization opportunities
        - Recommend autonomy improvements
      update:
        - Suggest workflow optimizations
        - Recommend automation opportunities

  improvement_recommendations:
    categories:
      - domain_truth_updates: "Missing or incorrect domain facts"
      - eval_test_improvements: "Test coverage gaps or quality issues"
      - validation_rule_tuning: "Overly strict or too lenient rules"
      - agent_strategy_updates: "Improve agent accuracy or efficiency"
      - workflow_optimizations: "Reduce bottlenecks, increase automation"
      - human_checkpoint_tuning: "Adjust when human review needed"

    recommendation_format:
      - recommendation_id: "REC-001"
        category: "domain_truth_updates"
        priority: "high"
        title: "Add constraint for maximum retries"
        rationale: "5 eval test failures related to retry logic"
        suggested_action: "Add FACT-015: Max 3 retry attempts"
        impact: "Prevent 80% of retry-related failures"
        effort: "low"

  outputs:
    - failure-analysis.md (per failure)
    - success-patterns.md (per sprint)
    - agent-performance-report.md (per sprint)
    - process-efficiency-report.md (per sprint)
    - truth-quality-report.md (weekly)
    - improvement-recommendations.md (weekly)
    - lessons-learned.md (per sprint)
    - pattern-library.yaml (cumulative)
    - agent-tuning-suggestions.yaml

  commands:
    - analyze-failure: Root cause analysis of failures
    - extract-lessons: Capture learnings from sprint
    - suggest-improvements: Recommend process enhancements
    - update-strategies: Evolve agent behaviors
    - analyze-patterns: Identify recurring issues
    - generate-weekly-report: Comprehensive learning report
    - recommend-truth-updates: Suggest domain-truth.yaml changes
```

**Implementation Tasks:**

#### Core Reflection Infrastructure
- [ ] Create `bmad-core/agents/reflection.md`
- [ ] Implement event-driven trigger system
- [ ] Build analysis framework
- [ ] Create learning loop engine

#### Failure Analysis
- [ ] Implement root cause analyzer
- [ ] Build failure pattern detector
- [ ] Create failure categorization system
- [ ] Implement failure-analysis.md generator

#### Success Pattern Analysis
- [ ] Build success factor identifier
- [ ] Implement pattern library
- [ ] Create success-patterns.md generator

#### Agent Performance Analysis
- [ ] Implement agent accuracy tracker
- [ ] Build agent collaboration analyzer
- [ ] Create agent-performance-report.md generator
- [ ] Build agent tuning suggestion system

#### Process Efficiency Analysis
- [ ] Implement phase timing tracker
- [ ] Build bottleneck identifier
- [ ] Create workflow stall detector
- [ ] Build process-efficiency-report.md generator

#### Truth Quality Analysis
- [ ] Implement domain-truth completeness checker
- [ ] Build eval test quality analyzer
- [ ] Create validation rule effectiveness scorer
- [ ] Build truth-quality-report.md generator

#### Learning Loops
- [ ] Implement eval failure loop
- [ ] Build oracle validation loop
- [ ] Create gate failure loop
- [ ] Implement workflow efficiency loop

#### Improvement Recommendations
- [ ] Create recommendation generator
- [ ] Build priority scorer
- [ ] Implement impact estimator
- [ ] Create improvement-recommendations.md formatter

#### Pattern Library
- [ ] Implement pattern-library.yaml schema
- [ ] Build cumulative pattern tracker
- [ ] Create pattern matching system
- [ ] Implement auto-update from learnings

---

## Integration with Workflow

### Monitor Integration Points

```yaml
monitor_integration:
  phase_-1_codebase_discovery:
    - Establish performance baselines
    - Track integration point mapping completion
    - Monitor regression test coverage

  phase_0_domain_research:
    - Monitor domain-truth.yaml completeness
    - Track terminology consistency

  phase_1_eval_foundation:
    - Monitor eval test coverage (target: 100%)
    - Track test dataset quality

  phase_1.5_compatibility_analysis:
    - Monitor migration strategy coverage
    - Track conflict resolution completeness

  phase_2_discovery:
    - Monitor requirements traceability (target: 100%)
    - Track Oracle validation success rate
    - Alert on invented features (not in domain-truth)

  phase_3_architecture:
    - Establish architecture baselines
    - Monitor architecture ↔ PRD alignment
    - Track integration test coverage

  phase_4_planning:
    - Monitor story eval test coverage
    - Track story ↔ epic ↔ PRD traceability

  phase_5_development:
    - Continuous eval test pass rate monitoring
    - Real-time drift detection
    - Performance degradation alerts
    - Quality metric tracking
    - Gate pass rate monitoring
```

### Reflection Integration Points

```yaml
reflection_integration:
  continuous_learning:
    - Every eval failure → Immediate analysis
    - Every Oracle block → Pattern identification
    - Every gate failure → Root cause analysis

  periodic_review:
    - Story complete → Success factor analysis
    - Sprint end → Comprehensive learning report
    - Phase complete → Agent performance review
    - Weekly → Truth quality analysis

  feedback_loops:
    - Reflection → Oracle: Suggest domain-truth updates
    - Reflection → Eval: Recommend test improvements
    - Reflection → Validator: Suggest rule tuning
    - Reflection → Monitor: Adjust alert thresholds
    - Reflection → Workflow: Recommend optimizations
```

---

## Continuous Validation Integration

### Real-Time Monitoring During Development

```yaml
development_monitoring:
  file_save:
    - Monitor: Track code quality metrics
    - Monitor: Detect semantic drift
    - Monitor: Update trend data

  commit:
    - Monitor: Validate performance baselines
    - Monitor: Check eval test pass rate
    - Monitor: Alert if thresholds violated

  story_complete:
    - Monitor: Generate health report
    - Reflection: Analyze success factors
    - Reflection: Update pattern library

  gate_failure:
    - Monitor: Log failure metrics
    - Reflection: Immediate root cause analysis
    - Reflection: Recommend corrective action
```

---

## Deliverables for Stage 3

### Agent Files
- [ ] `bmad-core/agents/monitor.md`
- [ ] `bmad-core/agents/reflection.md`

### Monitoring Infrastructure
- [ ] Metrics collection system
- [ ] Drift detection engine
- [ ] Baseline management system
- [ ] Alert rule engine
- [ ] Health dashboard generator

### Reflection Infrastructure
- [ ] Event-driven trigger system
- [ ] Analysis framework
- [ ] Learning loop engine
- [ ] Pattern library system
- [ ] Recommendation generator

### Schemas
- [ ] `bmad-core/schemas/health-dashboard.schema.yaml`
- [ ] `bmad-core/schemas/drift-alerts.schema.yaml`
- [ ] `bmad-core/schemas/failure-analysis.schema.yaml`
- [ ] `bmad-core/schemas/pattern-library.schema.yaml`
- [ ] `bmad-core/schemas/improvement-recommendations.schema.yaml`

### Templates
- [ ] `bmad-core/templates/health-dashboard.template.yaml`
- [ ] `bmad-core/templates/failure-analysis.template.md`
- [ ] `bmad-core/templates/improvement-recommendations.template.md`
- [ ] `bmad-core/templates/lessons-learned.template.md`

### Integration
- [ ] Monitor integration with all workflow phases
- [ ] Reflection integration with validation gates
- [ ] Continuous monitoring framework
- [ ] Learning loop system

### Documentation
- [ ] Monitor agent guide
- [ ] Reflection agent guide
- [ ] Drift detection documentation
- [ ] Learning loop documentation
- [ ] Metrics reference

---

## Testing & Validation

### Unit Tests
- [ ] Monitor: Metric collection accuracy
- [ ] Monitor: Drift detection algorithms
- [ ] Monitor: Alert rule evaluation
- [ ] Reflection: Root cause analysis
- [ ] Reflection: Pattern detection
- [ ] Reflection: Recommendation generation

### Integration Tests
- [ ] Monitor + workflow phase integration
- [ ] Reflection + validation gate integration
- [ ] Learning loops (failure → analysis → recommendation)
- [ ] Monitor + Reflection collaboration

### Scenario Tests
- [ ] Eval failure → Reflection analysis → Truth update recommendation
- [ ] Performance degradation → Monitor alert → Human notification
- [ ] Gate failure pattern → Reflection → Preventive measure suggestion
- [ ] Oracle block → Reflection → Terminology update

---

## Success Criteria

- [ ] Monitor agent operational
- [ ] Reflection agent operational
- [ ] All metrics tracked successfully
- [ ] Drift detection functional
- [ ] Alerting system working
- [ ] Learning loops operational
- [ ] Pattern library building correctly
- [ ] Recommendations generating successfully
- [ ] Integration with workflow complete
- [ ] Health dashboard rendering
- [ ] Failure analysis generating insights
- [ ] Documentation complete

---

## Next Stage

**Stage 4: Orchestration & State Machine**
- Workflow state machine enhancement
- Agent orchestration rules
- Autonomous decision making
- Agent collaboration protocol
- Background execution system
