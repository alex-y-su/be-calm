# Lessons Learned - {{period}}

**Sprint:** {{sprint}}
**Period:** {{start_date}} to {{end_date}}
**Generated:** {{generated_at}}
**Project:** {{project_name}}

---

## Sprint Overview

**Stories Completed:** {{stories_completed}}
**Stories Failed:** {{stories_failed}}
**Overall Success Rate:** {{success_rate}}%

**Key Metrics:**
- Eval Test Pass Rate: {{eval_pass_rate}}%
- Oracle Validation Success: {{oracle_success_rate}}%
- Gate Pass Rate: {{gate_pass_rate}}%
- Time to Complete per Story: {{avg_story_time}}h

---

## What Went Well ✅

### Successes

{{#each successes}}
#### {{success_title}}

{{success_description}}

**Why it worked:**
{{#each why_it_worked}}
- {{reason}}
{{/each}}

**Key factors:**
{{#each key_factors}}
- {{factor}}
{{/each}}

**Repeat in future:** {{should_repeat}}

---
{{/each}}

### Best Practices Identified

{{#each best_practices}}
- **{{practice_title}}**
  - What: {{what}}
  - Why: {{why}}
  - When to use: {{when}}
  - Impact: {{impact}}
{{/each}}

### Agent Collaboration Wins

{{#each agent_wins}}
- **{{agents_involved}}**: {{collaboration_description}}
  - Outcome: {{outcome}}
  - Lesson: {{lesson}}
{{/each}}

---

## What Didn't Go Well ❌

### Failures and Challenges

{{#each failures}}
#### {{failure_title}}

{{failure_description}}

**Root cause:**
{{root_cause}}

**Impact:**
- Time lost: {{time_lost_hours}}h
- Rework required: {{rework_required}}
- Lessons: {{lessons}}

**Prevention strategy:**
{{prevention_strategy}}

**Related Failure Analysis:** `{{failure_analysis_id}}`

---
{{/each}}

### Bottlenecks Identified

{{#each bottlenecks}}
- **{{bottleneck_location}}**
  - Impact: {{impact_description}}
  - Average delay: {{avg_delay_hours}}h
  - Recommended solution: {{solution}}
{{/each}}

### Validation Issues

{{#each validation_issues}}
- **{{validation_type}}**
  - Issue: {{issue_description}}
  - Frequency: {{occurrence_count}} times
  - Resolution: {{resolution}}
{{/each}}

---

## Key Learnings

### About the Domain

{{#each domain_learnings}}
#### {{learning_title}}

{{learning_description}}

**Impact on domain-truth.yaml:**
{{truth_update_recommendation}}

{{/each}}

### About the Process

{{#each process_learnings}}
#### {{learning_title}}

{{learning_description}}

**Workflow adjustment:**
{{workflow_adjustment}}

{{/each}}

### About the Agents

{{#each agent_learnings}}
#### {{agent_name}} Agent

**What we learned:**
{{what_learned}}

**Accuracy this sprint:** {{accuracy_percentage}}%
**Improvement from last sprint:** {{improvement}}%

**Tuning needed:**
{{#each tuning_needs}}
- {{tuning_description}}
{{/each}}

{{/each}}

---

## Recurring Patterns

{{#if recurring_patterns}}
{{#each recurring_patterns}}
### Pattern: {{pattern_title}}

**Pattern ID:** `{{pattern_id}}`
**Occurrences this sprint:** {{occurrence_count}}
**Total occurrences:** {{total_occurrences}}

**Description:**
{{pattern_description}}

**Status:**
{{#if resolution_implemented}}
✅ Resolution implemented: {{resolution_description}}
{{else}}
⏳ Pending resolution
{{/if}}

**Related recommendations:** {{recommendation_ids}}

---
{{/each}}
{{else}}
_No significant recurring patterns detected this sprint._
{{/if}}

---

## Truth Quality Insights

### Domain Truth Completeness

**Current completeness:** {{domain_truth_completeness}}%
**Gaps identified:** {{gaps_count}}

{{#each truth_gaps}}
- **{{gap_category}}**: {{gap_description}}
  - Recommendation: {{recommendation}}
{{/each}}

### Eval Test Coverage

**Current coverage:** {{eval_coverage}}%
**Target coverage:** 100%

**Uncovered facts:** {{uncovered_facts_count}}

{{#each major_coverage_gaps}}
- `{{fact_id}}`: {{fact_description}}
{{/each}}

### Validation Effectiveness

**Oracle accuracy:** {{oracle_accuracy}}%
**Validator accuracy:** {{validator_accuracy}}%

**Areas for improvement:**
{{#each validation_improvements}}
- {{improvement}}
{{/each}}

---

## Metrics Evolution

### Trend Analysis

{{#each metric_trends}}
#### {{metric_name}}

**Current:** {{current_value}}
**Previous sprint:** {{previous_value}}
**Change:** {{change_percentage}}%
**Trend:** {{trend}}

{{#if concerning}}
⚠️ **Concerning trend** - {{concern_description}}
{{/if}}

{{/each}}

### Performance

**Response time P95:** {{p95_current}}ms (baseline: {{p95_baseline}}ms, {{p95_change}}%)
**Throughput:** {{throughput_current}} req/s (baseline: {{throughput_baseline}} req/s, {{throughput_change}}%)
**Error rate:** {{error_rate}}%

{{#if performance_degradation}}
⚠️ Performance degradation detected: {{degradation_description}}
{{/if}}

---

## Action Items for Next Sprint

### High Priority

{{#each high_priority_actions}}
- [ ] **{{action_title}}**
  - Rationale: {{rationale}}
  - Owner: {{owner}}
  - Estimated effort: {{effort_hours}}h
  - Expected impact: {{impact}}
{{/each}}

### Medium Priority

{{#each medium_priority_actions}}
- [ ] **{{action_title}}**
  - Rationale: {{rationale}}
  - Estimated effort: {{effort_hours}}h
{{/each}}

### Truth Updates Needed

{{#each truth_updates}}
- [ ] Update `{{artifact}}`: {{update_description}}
{{/each}}

### Process Improvements

{{#each process_improvements}}
- [ ] **{{improvement_title}}**: {{improvement_description}}
  - Expected benefit: {{benefit}}
{{/each}}

---

## Knowledge Gained

### Technical Insights

{{#each technical_insights}}
- **{{insight_title}}**: {{insight_description}}
{{/each}}

### Workflow Insights

{{#each workflow_insights}}
- **{{insight_title}}**: {{insight_description}}
{{/each}}

### Team Insights

{{#each team_insights}}
- **{{insight_title}}**: {{insight_description}}
{{/each}}

---

## Success Stories

{{#each success_stories}}
### {{story_title}}

{{story_description}}

**What made it successful:**
{{#each success_factors}}
- {{factor}}
{{/each}}

**Lessons to apply:**
{{#each lessons}}
- {{lesson}}
{{/each}}

---
{{/each}}

---

## Retrospective Summary

### Top 3 Things to Continue

1. {{continue_1}}
2. {{continue_2}}
3. {{continue_3}}

### Top 3 Things to Improve

1. {{improve_1}}
2. {{improve_2}}
3. {{improve_3}}

### Top 3 Things to Start

1. {{start_1}}
2. {{start_2}}
3. {{start_3}}

---

## Sprint Health Score

**Overall Health:** {{overall_health_score}}/100

**Breakdown:**
- Truth Alignment: {{truth_alignment_score}}/100
- Code Quality: {{code_quality_score}}/100
- Validation Health: {{validation_health_score}}/100
- Agent Performance: {{agent_performance_score}}/100
- Process Efficiency: {{process_efficiency_score}}/100

---

## Related Documents

- **Improvement Recommendations:** `reflections/improvement-recommendations.md`
- **Pattern Library:** `reflections/pattern-library.yaml`
- **Health Dashboard:** `baselines/health-dashboard.yaml`
- **Failure Analyses:** `reflections/failures/`

---

## Next Sprint Focus

{{next_sprint_focus}}

**Key goals:**
{{#each next_sprint_goals}}
- {{goal}}
{{/each}}

**Risks to watch:**
{{#each risks_to_watch}}
- {{risk}}: {{mitigation}}
{{/each}}

---

[[LLM: When generating lessons learned:
1. Be honest about failures - they're learning opportunities
2. Identify actionable patterns, not just observations
3. Connect learnings to specific improvements
4. Celebrate wins and understand why they worked
5. Ensure action items are specific, measurable, and assigned
6. Track metric trends to identify early warning signs
7. Balance optimism with realistic assessment of challenges

The goal is continuous improvement through honest reflection.]]
