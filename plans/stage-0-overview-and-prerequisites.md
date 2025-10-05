# Stage 0: Overview & Prerequisites

**Version:** 1.0
**Date:** 2025-10-04
**Implementation Phase:** Planning & Setup
**Estimated Effort:** 1-2 weeks

---

## Executive Summary

This plan transforms BMAD-METHOD from a human-orchestrated agent system into an autonomous, truth-driven AI development framework. The core innovation: **establish empirical, verifiable truth early** (via test datasets) that serves as the immutable source of truth throughout development, enabling AI agents to operate autonomously while remaining reliable and grounded.

### Key Principle
**Empirical Validation Over Document Trust** - AI trusts executable tests and validated facts, not just written documents which can be wrong, incomplete, or drift from reality.

---

## Problem Statement

### Current Limitations
1. **Manual Agent Switching** - Requires explicit `*agent`, `*exit` commands
2. **No Cross-Agent State Tracking** - Agents don't know project phase or progress
3. **Sequential, Blocking Workflows** - Everything waits for human intervention
4. **Reactive vs. Proactive Behavior** - Agents wait for commands
5. **Document-Based Truth** - AI trusts PRD/Architecture which can be incorrect
6. **No Empirical Validation** - "Sounds right" vs "Is right" gap

### Vision
AI agents that autonomously navigate development workflows, grounded in empirical truth, with minimal human intervention while maintaining reliability through continuous validation.

---

## Architecture Overview

### Truth Hierarchy

#### Greenfield Projects
```yaml
level_0_immutable:
  - domain-truth.yaml (what domain requires)
  - eval-criteria.yaml (how to validate domain)

level_1_derived:
  - prd.md (must trace to level_0)
  - architecture.md (must trace to level_0)

level_2_implementation:
  - stories (must trace to level_1)
  - code (must pass level_0 tests)
```

#### Brownfield Projects
```yaml
level_0_immutable:
  - existing-system-truth.yaml (what IS - current state)
  - domain-truth.yaml (what SHOULD be - domain requirements)
  - regression-test-datasets/ (how to validate existing behavior)

level_0.5_reconciliation:
  - enhancement-truth.yaml (what WILL change - reconciliation)
  - compatibility-constraints.yaml (what CANNOT change)
  - migration-strategy.yaml (HOW to evolve from IS to SHOULD)
  - migration-test-datasets/ (how to validate transition)

level_1_derived:
  - prd.md (must trace to level_0 AND respect level_0.5)
  - architecture.md (must trace to level_0 AND provide migration path)

level_2_implementation:
  - stories (must trace to level_1 AND include compatibility checks)
  - code (must pass regression tests + new tests + migration tests)
```

---

## Agent Ecosystem Overview

### Truth Keeper Agents (New)
1. **Compatibility Agent** - Brownfield integration specialist
2. **Oracle Agent** - Domain truth maintainer
3. **Eval Agent** (Enhanced) - Empirical truth creator
4. **Validator Agent** - Continuous validation engine
5. **Monitor Agent** - Drift detection & metrics
6. **Reflection Agent** - Learning & improvement

### Existing BMAD Agents (Enhanced)
- **Analyst** - Domain research (feeds Oracle)
- **PM** - Requirements (validated by Oracle + Eval)
- **Architect** - Design (validated by Oracle + Eval)
- **PO** - Document sharding (enhanced with truth references)
- **SM** - Story creation (enhanced with eval tests)
- **Dev** - Implementation (validated by Eval + Oracle)
- **QA** - Supplemental testing (complements Eval)

---

## Prerequisites

### Technical Infrastructure Needed

#### 1. Schema Definitions
- [ ] `domain-truth.yaml` schema specification
- [ ] `existing-system-truth.yaml` schema specification (brownfield)
- [ ] `enhancement-truth.yaml` schema specification (brownfield)
- [ ] `eval-criteria.yaml` schema specification
- [ ] `validation-chain-proof.yaml` schema specification
- [ ] `compatibility-analysis.yaml` schema specification (brownfield)
- [ ] `migration-strategy.yaml` schema specification (brownfield)

#### 2. Test Dataset Infrastructure
- [ ] Test dataset directory structure (`test-datasets/`)
- [ ] Dataset format standards (JSON, CSV, YAML)
- [ ] Dataset validation tools
- [ ] Test execution engine integration

#### 3. Agent Implementation Framework
- [ ] Agent metadata format (enhanced with validation rules)
- [ ] Agent invocation protocol
- [ ] Background agent execution system
- [ ] Agent-to-agent communication protocol
- [ ] Agent state persistence

#### 4. Validation Infrastructure
- [ ] Traceability tracking system
- [ ] Consistency checking engine
- [ ] Semantic validation framework
- [ ] Empirical test execution system

---

## Implementation Phases Overview

### Phase 1: Foundation (v5.0) - Stage 1 & 2
**Duration:** 6-8 weeks
**Focus:** Truth infrastructure, core validation agents
**Deliverables:**
- Oracle, Eval (enhanced), Validator, Compatibility agents
- Truth schemas and propagation system
- Basic workflows (Phases -1, 0, 1, 1.5, 2-5)

### Phase 2: Autonomy (v5.5) - Stage 3 & 4
**Duration:** 6-8 weeks
**Focus:** Monitoring, reflection, orchestration
**Deliverables:**
- Monitor and Reflection agents
- Workflow state machine
- Agent collaboration protocol
- Autonomous decision-making

### Phase 3: Intelligence (v6.0) - Stage 5
**Duration:** 8-10 weeks
**Focus:** Advanced autonomy and optimization
**Deliverables:**
- Intelligent routing
- Predictive orchestration
- Goal-oriented execution

### Configuration & Deployment - Stage 6
**Duration:** 2-3 weeks
**Focus:** User control, metrics, deployment
**Deliverables:**
- Autonomy level configuration
- Success metrics dashboard
- Risk mitigation tools

---

## Success Criteria for Stage 0

- [ ] All prerequisite infrastructure identified
- [ ] Schema specifications drafted
- [ ] Agent ecosystem architecture validated
- [ ] Implementation phases clearly defined
- [ ] Technical dependencies mapped
- [ ] Team alignment on approach
- [ ] Resource allocation confirmed
- [ ] Pilot project selected (greenfield + brownfield)

---

## Next Steps

1. **Review & Refine:** Stakeholder review of overall approach
2. **Schema Design:** Begin detailed schema specifications (Stage 1)
3. **Agent Specifications:** Detail Oracle, Eval, Validator, Compatibility agents (Stage 1)
4. **Pilot Selection:** Choose greenfield and brownfield pilot projects
5. **Infrastructure Setup:** Prepare development environment

---

## Related Stages

- **Stage 1:** Truth Infrastructure & Core Agents
- **Stage 2:** Validation Workflows
- **Stage 3:** Monitoring & Reflection
- **Stage 4:** Orchestration & State Machine
- **Stage 5:** Intelligence & Optimization
- **Stage 6:** Configuration & Deployment
