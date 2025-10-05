# Stage 4: Orchestration & State Machine

**Version:** 1.0
**Date:** 2025-10-04
**Implementation Phase:** Autonomy (v5.5)
**Estimated Effort:** 3-4 weeks
**Prerequisites:** Stage 1, 2, 3 completed (Core agents + workflows + monitoring operational)

---

## Overview

Stage 4 builds the autonomous orchestration layer that enables agents to collaborate, make decisions, and navigate workflows without constant human intervention. This includes enhanced state machine management, agent collaboration protocols, and autonomous decision-making rules.

---

## Workflow State Machine Enhancement

### State Machine Engine

```yaml
state_machine:
  name: "Truth-Driven Workflow State Machine"
  version: "2.0"

  states:
    - id: codebase_discovery
      type: brownfield_only
      phase: -1
      agents: [compatibility, bmad-master, oracle, eval]

    - id: domain_research
      type: universal
      phase: 0
      agents: [domain-researcher, oracle]

    - id: eval_foundation
      type: universal
      phase: 1
      agents: [eval, oracle, validator]

    - id: compatibility_analysis
      type: brownfield_only
      phase: 1.5
      agents: [compatibility, oracle, validator, eval]

    - id: discovery
      type: universal
      phase: 2
      agents: [analyst, pm, oracle, validator, eval]

    - id: architecture
      type: universal
      phase: 3
      agents: [architect, oracle, validator, eval, monitor]

    - id: planning
      type: universal
      phase: 4
      agents: [po, sm, eval, oracle, validator]

    - id: development
      type: universal
      phase: 5
      agents: [dev, qa, eval, oracle, validator, monitor, reflection]

  state_metadata:
    each_state_tracks:
      - current_phase_id
      - active_agents
      - completion_percentage
      - exit_conditions_status
      - validation_gates_status
      - artifacts_created
      - blocking_issues
      - human_checkpoints_pending

  transitions:
    automatic:
      conditions:
        - all_exit_conditions_met: true
        - all_validation_gates_passed: true
        - no_blocking_issues: true
        - human_checkpoints_approved: true

      actions:
        - Save current state
        - Generate phase completion report
        - Notify agents of state change
        - Initialize next state
        - Load next phase agents
        - Trigger Monitor baseline update
        - Trigger Reflection phase analysis

    manual:
      allowed_actions:
        - Force transition (admin only)
        - Rollback to previous state
        - Skip state (greenfield only)
        - Pause workflow

    blocking:
      triggers:
        - Critical validation failure
        - Irreconcilable conflict (brownfield)
        - Human checkpoint rejection
        - Agent error threshold exceeded

      actions:
        - Halt state machine
        - Alert human
        - Generate failure report (Reflection)
        - Suggest corrective actions

  state_persistence:
    format: YAML
    location: .bmad-state/workflow-state.yaml
    backup: .bmad-state/backups/
    auto_save_frequency: "every_transition"

    state_file_structure:
      current_state: "development"
      project_type: "brownfield"
      state_history: []
      completion_status:
        domain_research: "complete"
        eval_foundation: "complete"
        # ...
      artifacts:
        domain_truth: "domain-truth.yaml"
        existing_truth: "existing-system-truth.yaml"
        # ...
      validation_status:
        oracle_validations: 142
        eval_tests_passed: 98
        # ...

  recovery:
    on_crash:
      - Load last saved state
      - Verify artifact integrity
      - Resume from checkpoint
      - Notify agents of recovery

    on_rollback:
      - Load target state
      - Invalidate downstream artifacts
      - Reset validation status
      - Notify agents of rollback
```

**Implementation Tasks:**
- [ ] Create state machine engine (`bmad-core/orchestration/state-machine.js`)
- [ ] Implement state persistence system
- [ ] Build state metadata tracking
- [ ] Create transition validator
- [ ] Implement automatic transition logic
- [ ] Build blocking condition handler
- [ ] Create state recovery system
- [ ] Implement state file backup system

---

## Agent Orchestration Rules

### Orchestration Engine

```yaml
orchestration_engine:
  name: "Agent Orchestration & Collaboration System"
  version: "2.0"

  orchestration_rules:
    never_proceed_without:
      - oracle_validation: "All artifacts must pass Oracle"
      - eval_test_coverage: "100% domain fact coverage required"
      - validator_traceability: "Complete chain from domain to code"
      - monitor_health_check: "No critical drift detected"

    auto_blocking_conditions:
      - eval_tests_failing: "Block commit if <90% pass rate"
      - oracle_validation_failed: "Block artifact if semantic inconsistency"
      - validator_traceability_broken: "Block if chain incomplete"
      - monitor_drift_alert: "Block if critical drift detected"
      - performance_degradation: "Block if >10% slower than baseline"

    auto_recovery_flow:
      - step: agent_detects_issue
        examples: ["Eval test fails", "Oracle blocks", "Drift alert"]

      - step: reflection_analyzes
        actions:
          - Determine root cause
          - Classify issue type
          - Identify affected artifacts

      - step: oracle_determines_truth
        actions:
          - Validate domain-truth accuracy
          - Check for truth gaps
          - Confirm semantic consistency

      - step: validator_identifies_affected
        actions:
          - Trace impact through chain
          - Identify broken links
          - List affected artifacts

      - step: monitor_assesses_impact
        actions:
          - Measure degradation
          - Track affected metrics
          - Estimate recovery effort

      - step: orchestrator_routes
        decision_tree:
          - if: "Truth gap identified"
            then: "Route to Oracle for truth update"

          - if: "Code implementation error"
            then: "Route to Dev for fix"

          - if: "Test error"
            then: "Route to Eval for test update"

          - if: "Unclear requirement"
            then: "Route to human for clarification"

      - step: eval_validates_resolution
        actions:
          - Re-run affected tests
          - Verify fix completeness
          - Confirm resolution

    parallel_truth_validation:
      trigger: "every_artifact_creation"

      execution:
        primary_agent: "Creates artifact"

        background_agents:
          - agent: oracle
            task: "Validate semantic consistency"
            mode: "non-blocking"

          - agent: validator
            task: "Check traceability"
            mode: "non-blocking"

          - agent: eval
            task: "Create tests"
            mode: "non-blocking"

          - agent: monitor
            task: "Establish baseline"
            mode: "non-blocking"

        completion_gate:
          condition: "All background agents complete"
          action: "Mark artifact as 'validated'"
          if_any_fail: "Mark artifact as 'needs_review'"
```

**Implementation Tasks:**
- [ ] Create orchestration engine (`bmad-core/orchestration/orchestrator.js`)
- [ ] Implement blocking condition enforcer
- [ ] Build auto-recovery flow
- [ ] Create parallel validation coordinator
- [ ] Implement decision tree router
- [ ] Build agent invocation system
- [ ] Create completion gate enforcer

---

## Autonomous Decision Making

### Decision Making Framework

```yaml
autonomous_decisions:
  decision_levels:
    - level: fully_automatic
      description: "Execute without human approval"
      examples:
        - Run eval tests on file save
        - Generate test datasets from domain-truth
        - Validate traceability chains
        - Track metrics and trends
        - Generate reports

    - level: automatic_with_notification
      description: "Execute automatically, notify human"
      examples:
        - Transition to next workflow phase
        - Create functional test datasets
        - Generate validation chain proof
        - Update baselines

    - level: automatic_with_preview
      description: "Show preview, auto-execute if no objection"
      examples:
        - Create enhancement-truth.yaml (brownfield)
        - Generate migration strategy
        - Update domain-truth based on learnings

    - level: require_approval
      description: "Require explicit human approval"
      examples:
        - Accept breaking changes (brownfield)
        - Modify domain-truth.yaml
        - Override blocking validation
        - Force state transition

  agent_autonomous_capabilities:
    dev_agent:
      can_auto_proceed_when:
        - eval_tests_pass: true
        - oracle_validated: true
        - validator_traceability_confirmed: true
        - monitor_health_green: true
        - no_blocking_issues: true

      requires_approval_for:
        - Merge to main branch
        - Deploy to production
        - Breaking API changes

    pm_agent:
      can_auto_create_requirements_when:
        - traces_to_domain_truth: true
        - eval_tests_generated: true
        - oracle_approved: true
        - no_conflicts_with_existing: true

      requires_approval_for:
        - Major scope changes
        - New constraints not in domain
        - Deprecated features

    architect_agent:
      can_auto_design_when:
        - domain_constraints_satisfied: true
        - eval_test_scenarios_supported: true
        - oracle_consistency_verified: true
        - no_major_tech_changes: true

      requires_approval_for:
        - New technology stack
        - Major architectural changes
        - Security model changes

    oracle_agent:
      can_auto_validate: true
      can_auto_block_inconsistencies: true

      requires_approval_for:
        - Domain-truth.yaml updates
        - Terminology changes
        - Constraint relaxation

    eval_agent:
      can_auto_generate_tests: true
      can_auto_run_tests: true
      can_auto_block_commits: true

      requires_approval_for:
        - Lower test coverage threshold
        - Disable test categories
        - Skip tests

    validator_agent:
      can_auto_check_traceability: true
      can_auto_block_broken_chains: true

      requires_approval_for:
        - Relax traceability requirements
        - Override traceability failures

    monitor_agent:
      can_auto_track_metrics: true
      can_auto_alert: true
      can_auto_establish_baselines: true

      requires_approval_for:
        - Change alert thresholds
        - Disable monitoring
        - Reset baselines

    reflection_agent:
      can_auto_analyze: true
      can_auto_generate_recommendations: true

      requires_approval_for:
        - Apply recommendations automatically
        - Modify agent strategies
        - Update validation rules

  confidence_scoring:
    method: "Each autonomous decision has confidence score"
    scale: "0.0 - 1.0"

    decision_routing:
      - if: "confidence >= 0.95"
        then: "Execute automatically"

      - if: "0.80 <= confidence < 0.95"
        then: "Execute with notification"

      - if: "0.65 <= confidence < 0.80"
        then: "Show preview, auto-execute after delay"

      - if: "confidence < 0.65"
        then: "Require human approval"

    confidence_factors:
      - similar_pattern_success_rate: 0.3
      - oracle_validation_strength: 0.25
      - eval_test_coverage: 0.2
      - historical_accuracy: 0.15
      - complexity_factor: 0.1
```

**Implementation Tasks:**
- [ ] Create decision framework (`bmad-core/orchestration/decision-engine.js`)
- [ ] Implement decision level router
- [ ] Build confidence scoring system
- [ ] Create agent capability definitions
- [ ] Implement approval requirement checker
- [ ] Build preview system (with timeout auto-execute)
- [ ] Create notification system

---

## Agent Collaboration Protocol

### Collaboration Framework

```yaml
agent_collaboration:
  collaboration_modes:
    sequential:
      description: "Agents execute one after another"
      example: "Analyst → Oracle → Eval (domain research flow)"
      implementation:
        - Agent A completes task
        - Output becomes input for Agent B
        - Agent B starts when A finishes

    parallel:
      description: "Agents execute simultaneously"
      example: "Oracle + Eval + Validator (PRD validation)"
      implementation:
        - All agents start together
        - Execute independently
        - Orchestrator waits for all to complete

    collaborative:
      description: "Agents work together on same task"
      example: "Dev + Eval (continuous testing during development)"
      implementation:
        - Primary agent (Dev) executes
        - Supporting agent (Eval) watches and validates
        - Continuous feedback loop

    competitive:
      description: "Multiple agents solve same problem, best wins"
      example: "Multiple architecture proposals (future)"
      implementation:
        - Multiple agents generate solutions
        - Validator/Oracle score solutions
        - Best solution selected

  communication_protocol:
    agent_to_agent:
      format: "Structured messages (JSON)"
      channel: "Agent message bus"

      message_types:
        - task_request:
            from: "Requesting agent"
            to: "Target agent"
            payload:
              task_id: "unique_id"
              task_type: "validate-artifact"
              inputs: {artifact: "prd.md"}
              priority: "high"

        - task_response:
            from: "Executing agent"
            to: "Requesting agent"
            payload:
              task_id: "unique_id"
              status: "complete"
              result: {validated: true}
              metadata: {confidence: 0.95}

        - notification:
            from: "Notifying agent"
            to: "all_agents"
            payload:
              event: "domain_truth_updated"
              affected_artifacts: ["prd.md", "architecture.md"]

        - alert:
            from: "Alerting agent"
            to: "orchestrator"
            payload:
              severity: "critical"
              issue: "eval_test_fail_rate_high"
              details: {}

    agent_to_human:
      format: "Human-readable messages (Markdown)"
      channel: "User interface / CLI output"

      message_types:
        - status_update: "Agent progress notifications"
        - approval_request: "Human decision needed"
        - alert: "Critical issues requiring attention"
        - report: "Analysis results, recommendations"

  dependency_management:
    agent_dependencies:
      oracle:
        depends_on: []
        required_by: [eval, validator, pm, architect, dev]

      eval:
        depends_on: [oracle]
        required_by: [dev, qa, validator]

      validator:
        depends_on: [oracle, eval]
        required_by: [orchestrator]

      monitor:
        depends_on: [validator]
        required_by: [reflection, orchestrator]

      reflection:
        depends_on: [monitor, validator, eval, oracle]
        required_by: [orchestrator]

    dependency_resolution:
      - Build dependency graph
      - Topological sort for execution order
      - Parallel execution where no dependencies
      - Sequential where dependencies exist

  conflict_resolution:
    when_agents_disagree:
      example: "Oracle says 'valid', Validator says 'broken chain'"

      resolution_rules:
        - priority_1: "Truth-keeper agents (Oracle, Eval) have highest authority"
        - priority_2: "Validator overrides on traceability issues"
        - priority_3: "Monitor provides data for human decision"
        - priority_4: "Reflection analyzes conflict pattern"
        - default: "Route to human for decision"

    tie_breaking:
      - Check agent confidence scores
      - Review historical accuracy
      - Analyze conflict context
      - If still unresolved → human decision

  agent_handoff:
    explicit_handoff:
      example: "Analyst completes domain-analysis.md → Hands off to Oracle"
      protocol:
        - Agent A signals completion
        - Agent A packages outputs
        - Orchestrator validates outputs
        - Orchestrator invokes Agent B
        - Agent B acknowledges receipt
        - Agent B begins work

    implicit_handoff:
      example: "Dev saves file → Eval automatically triggered"
      protocol:
        - Event occurs (file save)
        - Orchestrator detects event
        - Orchestrator determines relevant agents
        - Agents auto-invoked
        - No explicit handoff needed
```

**Implementation Tasks:**
- [ ] Create collaboration framework (`bmad-core/orchestration/collaboration.js`)
- [ ] Implement agent message bus
- [ ] Build message routing system
- [ ] Create dependency graph builder
- [ ] Implement parallel execution coordinator
- [ ] Build conflict resolution engine
- [ ] Create agent handoff protocol
- [ ] Implement event-driven triggers

---

## Background Agent Execution

### Background Execution System

```yaml
background_execution:
  description: "Run agents in background without blocking main workflow"

  background_capable_agents:
    - oracle: "Validate artifacts in background"
    - eval: "Generate test datasets in background"
    - validator: "Check traceability in background"
    - monitor: "Continuous metrics tracking"
    - qa: "Supplemental testing while dev continues"

  execution_modes:
    fire_and_forget:
      description: "Start agent, don't wait for result"
      use_case: "Monitor tracking metrics"
      implementation:
        - Start agent in separate process
        - Agent runs independently
        - Results saved when complete
        - No blocking

    async_with_callback:
      description: "Start agent, callback when done"
      use_case: "Eval generating test datasets"
      implementation:
        - Start agent in background
        - Register callback function
        - Continue main workflow
        - Callback invoked on completion

    watched_background:
      description: "Start agent, periodically check status"
      use_case: "Long-running QA tests"
      implementation:
        - Start agent in background
        - Periodic status checks
        - Display progress
        - Alert when complete

  concurrency_management:
    max_concurrent_agents: 5
    priority_queue: true

    priority_levels:
      - critical: "Eval test execution (blocking commits)"
      - high: "Oracle validation (blocking artifact approval)"
      - medium: "Validator traceability checks"
      - low: "Monitor metrics collection"
      - background: "QA supplemental tests"

    resource_limits:
      max_cpu_percent: 80
      max_memory_mb: 2048
      throttle_if_exceeded: true

  result_aggregation:
    when_all_complete:
      - Collect results from all background agents
      - Validate result consistency
      - Generate aggregate report
      - Invoke completion callback

    partial_results:
      - Allow checking results before all complete
      - Stream results as they arrive
      - Update UI progressively
```

**Implementation Tasks:**
- [ ] Create background execution engine (`bmad-core/orchestration/background-executor.js`)
- [ ] Implement process manager (spawn, monitor, kill)
- [ ] Build priority queue system
- [ ] Create resource monitor and throttler
- [ ] Implement callback system
- [ ] Build result aggregator
- [ ] Create progress tracking UI
- [ ] Implement concurrency limiter

---

## Deliverables for Stage 4

### Orchestration Components
- [ ] State machine engine
- [ ] Orchestration engine
- [ ] Decision engine
- [ ] Collaboration framework
- [ ] Background execution engine

### Core Files
- [ ] `bmad-core/orchestration/state-machine.js`
- [ ] `bmad-core/orchestration/orchestrator.js`
- [ ] `bmad-core/orchestration/decision-engine.js`
- [ ] `bmad-core/orchestration/collaboration.js`
- [ ] `bmad-core/orchestration/background-executor.js`

### Configuration
- [ ] `bmad-core/config/orchestration-rules.yaml`
- [ ] `bmad-core/config/decision-levels.yaml`
- [ ] `bmad-core/config/agent-capabilities.yaml`
- [ ] `bmad-core/config/collaboration-modes.yaml`

### State Management
- [ ] State persistence system
- [ ] State file structure (`.bmad-state/`)
- [ ] Backup system
- [ ] Recovery system
- [ ] State visualization

### Agent Communication
- [ ] Agent message bus
- [ ] Message routing system
- [ ] Dependency graph builder
- [ ] Conflict resolution engine

### Documentation
- [ ] Orchestration system guide
- [ ] State machine documentation
- [ ] Decision framework guide
- [ ] Collaboration protocol documentation
- [ ] Background execution guide

---

## Testing & Validation

### Unit Tests
- [ ] State machine transitions
- [ ] Decision routing logic
- [ ] Confidence scoring
- [ ] Agent message passing
- [ ] Background process management

### Integration Tests
- [ ] Complete workflow state transitions
- [ ] Multi-agent parallel validation
- [ ] Agent collaboration scenarios
- [ ] Background execution with callbacks
- [ ] Conflict resolution scenarios

### Scenario Tests
- [ ] Greenfield workflow (auto-transitions)
- [ ] Brownfield workflow (with checkpoints)
- [ ] Agent disagreement resolution
- [ ] State recovery after crash
- [ ] Background agent coordination

---

## Success Criteria

- [ ] State machine operational
- [ ] Automatic state transitions working
- [ ] State persistence and recovery functional
- [ ] Decision engine routing correctly
- [ ] Agent collaboration protocol working
- [ ] Background execution system operational
- [ ] Dependency management working
- [ ] Conflict resolution functional
- [ ] All orchestration rules enforced
- [ ] Documentation complete

---

## Next Stage

**Stage 5: Intelligence & Optimization**
- Intelligent routing
- Predictive orchestration
- Goal-oriented execution
- Advanced autonomy features
