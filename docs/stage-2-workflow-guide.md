# Stage 2: Workflow Orchestration Guide

**Version:** 5.0
**Date:** 2025-10-04
**Status:** Production Ready

---

## Overview

Stage 2 implements the complete truth-driven workflow state machine for both greenfield and brownfield projects. This guide covers how to use the workflow orchestration system.

## Quick Start

### Installation

The workflow orchestration system is integrated into BMAD v5.0+.

```bash
# Initialize a workflow
node bmad-core/runtime/cli.js init --type greenfield
# or
node bmad-core/runtime/cli.js init --type brownfield

# Execute the workflow
node bmad-core/runtime/cli.js execute

# Check status
node bmad-core/runtime/cli.js status
```

### Programmatic Usage

```javascript
import { WorkflowEngine } from './bmad-core/runtime/index.js';

// Initialize engine
const engine = new WorkflowEngine();
await engine.initialize('greenfield'); // or 'brownfield'

// Execute complete workflow
await engine.execute();

// Or execute single phase
await engine.executeSinglePhase('domain_research');

// Get status
const status = engine.getStatus();
console.log(status);

// Generate report
const report = await engine.generateReport();
```

---

## Workflow Phases

### Greenfield Workflow

1. **Phase 0: Domain Research** - Establish domain truth foundation
2. **Phase 1: Eval Foundation** - Create test datasets (test-first)
3. **Phase 2: Discovery** - Requirements with truth validation
4. **Phase 3: Architecture** - Design with domain alignment
5. **Phase 4: Planning** - Stories with embedded tests
6. **Phase 5: Development** - Empirically validated implementation

### Brownfield Workflow

1. **Phase -1: Codebase Discovery** - Analyze existing system
2. **Phase 0: Domain Research** - Establish domain truth
3. **Phase 1: Eval Foundation** - Create test datasets
4. **Phase 1.5: Compatibility Analysis** - Validate against existing system
5. **Phase 2: Discovery** - Requirements with migration awareness
6. **Phase 3: Architecture** - Design with compatibility
7. **Phase 4: Planning** - Stories with migration strategy
8. **Phase 5: Development** - Validated with regression gates

---

## Phase Details

### Phase -1: Codebase Discovery (Brownfield Only)

**Purpose:** Establish existing system truth before domain research

**Agents:** Compatibility, BMad Master, Oracle, Eval

**Outputs:**
- `docs/existing-system-analysis.md`
- `docs/tech-stack.md`
- `docs/api-inventory.md`
- `docs/architecture-current-state.md`
- `existing-system-truth.yaml`
- `test-datasets/regression/` (multiple regression test datasets)

**Exit Conditions:**
- Existing codebase fully documented
- Existing patterns extracted and validated
- Regression test baselines created
- Integration points mapped
- Constraints identified
- Oracle validation passed
- 100% integration point test coverage

**Human Checkpoint:** Review `existing-system-truth.yaml` for accuracy

---

### Phase 0: Domain Research

**Purpose:** Establish domain truth as foundation

**Agents:** Domain Researcher (Analyst), Oracle

**Outputs:**
- `domain-analysis.md`
- `domain-truth.yaml`

**Exit Conditions:**
- Domain analysis complete
- Oracle truth established
- Domain examples documented

**Auto-transitions to:** Phase 1 (Eval Foundation)

---

### Phase 1: Eval Foundation

**Purpose:** Create test datasets BEFORE requirements (test-first approach)

**Agents:** Eval, Oracle, Validator

**Outputs:**
- `test-datasets/domain-examples.json`
- `test-datasets/constraint-tests.yaml`
- `test-datasets/edge-cases.json`
- `eval-criteria.yaml`

**Exit Conditions:**
- All domain facts have tests
- Test datasets validated
- Oracle approved
- 100% coverage threshold met

**Critical:** This is a BLOCKING phase - cannot proceed without 100% coverage

**Auto-transitions to:**
- Phase 1.5 (Compatibility Analysis) if brownfield
- Phase 2 (Discovery) if greenfield

---

### Phase 1.5: Compatibility Analysis (Brownfield Only)

**Purpose:** Validate domain requirements against existing system constraints

**Agents:** Compatibility, Oracle, Validator, Eval

**Outputs:**
- `compatibility-conflicts.yaml`
- `migration-strategy.yaml`
- `enhancement-truth.yaml`
- `test-datasets/migration/` (phased migration tests)

**Exit Conditions:**
- All conflicts identified
- All conflicts have migration strategies
- Enhancement truth created
- Oracle validated feasibility
- Validator confirmed traceability
- Migration tests created
- No irreconcilable conflicts

**Blocking Conditions:**
- **Irreconcilable Conflict:** Halts workflow - requires human decision

**Human Checkpoint:** Review migration strategy and approve breaking changes

---

### Phase 2: Discovery

**Purpose:** Create requirements with full truth validation

**Agents:** Analyst, PM, Oracle, Validator, Eval

**Outputs:**
- `docs/project-brief.md`
- `docs/prd.md`
- `requirements-truth-map.yaml`
- `test-datasets/functional-tests.json`

**Exit Conditions:**
- PRD complete
- 100% requirements traced to domain
- All FRs have eval tests
- Oracle validation passed
- Validator consistency check passed

---

### Phase 3: Architecture

**Purpose:** Design architecture validated against domain constraints

**Agents:** Architect, Oracle, Validator, Eval, Monitor

**Outputs:**
- `docs/architecture.md`
- `test-datasets/integration-tests.json`
- `baselines/architecture-metrics.yaml`
- `architecture-truth-map.yaml`

**Exit Conditions:**
- Architecture complete
- Oracle validation passed
- All components have eval tests
- Integration test datasets created
- Monitor baseline established
- Validator full traceability confirmed

---

### Phase 4: Planning

**Purpose:** Create stories with embedded truth references and tests

**Agents:** PO, SM, Eval, Oracle, Validator

**Outputs:**
- `docs/epics/` (sharded epics with truth references)
- `docs/stories/` (stories with embedded acceptance tests)
- `test-datasets/story-*-tests.json` (per-story test datasets)

**Exit Conditions:**
- Stories created
- 100% stories have eval tests
- Oracle validated all stories
- Validator confirmed traceability

**Story Enhancement:**
Each story includes:
- Truth References section
- Domain fact links
- Eval test dataset path
- Oracle validation status
- Traceability chain
- Executable acceptance tests

---

### Phase 5: Development

**Purpose:** Implementation with continuous validation and multi-gate system

**Agents:** Dev, QA, Eval, Oracle, Validator, Monitor, Reflection

**Features:**
- Continuous validation during development
- Watch modes (Eval, Oracle, Validator, Monitor)
- 7-gate validation system (5 greenfield, 7 brownfield)
- Failure analysis with Reflection agent
- Validation chain proof generation

**Story Completion Gates:**

**Greenfield (5 gates):**
1. **Eval:** 100% tests passing
2. **Oracle:** Matches domain truth
3. **Validator:** Traceability chain intact
4. **Monitor:** No drift, metrics healthy
5. **QA:** Supplemental tests pass

**Brownfield (7 gates):**
0. **Regression:** No existing functionality broken (MUST PASS FIRST)
1. **Eval:** 100% new tests passing
2. **Oracle:** Matches domain truth AND respects existing truth
3. **Validator:** Traceability chain intact
4. **Monitor:** No drift, no performance degradation
5. **Compatibility:** Migration strategy adhered to
6. **QA:** Supplemental tests pass

**Gate Failure:**
- Triggers Reflection agent for failure analysis
- Generates `failure-analysis-<story-id>.md`
- Blocks story completion until resolved

**Outputs:**
- Implementation code
- `validation-chain-proof.md` (per story)
- `failure-analysis-*.md` (if gates fail)

---

## Validation Systems

### Traceability Validator

Ensures 100% traceability across artifacts:

```javascript
import { TraceabilityValidator } from './bmad-core/runtime/validators/TraceabilityValidator.js';

const validator = new TraceabilityValidator();

// Validate chain
await validator.validateChain('docs/prd.md', 'domain-truth.yaml');

// Validate 100% coverage
await validator.validate100PercentCoverage(
  'domain-truth.yaml',
  ['docs/prd.md', 'docs/architecture.md']
);

// Generate matrix
const matrix = await validator.generateMatrix([
  'domain-truth.yaml',
  'docs/prd.md',
  'docs/architecture.md'
]);
```

**Output:** `.bmad/traceability-matrix.yaml`

### Coverage Validator

Ensures 100% test coverage:

```javascript
import { CoverageValidator } from './bmad-core/runtime/validators/CoverageValidator.js';

const validator = new CoverageValidator();

// Validate domain fact coverage
await validator.validateDomainFactCoverage(
  'domain-truth.yaml',
  ['test-datasets/domain-examples.json']
);

// Validate requirement coverage
await validator.validateRequirementCoverage(
  'docs/prd.md',
  ['test-datasets/functional-tests.json']
);

// Validate integration point coverage (brownfield)
await validator.validateIntegrationPointCoverage(
  'existing-system-truth.yaml',
  ['test-datasets/regression/api-behavior.json']
);
```

**Output:** `.bmad/coverage-report.json`

### Validation Gates

Multi-gate validation system for story completion:

```javascript
import { ValidationGates } from './bmad-core/runtime/validators/ValidationGates.js';

const gates = new ValidationGates(stateMachine, agentRegistry, validators);

// Execute all gates for a story
const result = await gates.executeAll(story);

if (result.passed) {
  console.log('All gates passed!');
} else {
  console.log('Gate failures:', result.results);
}
```

---

## State Machine

### State Persistence

State is persisted to `.bmad/workflow-state.json`:

```json
{
  "currentState": "eval_foundation",
  "projectType": "greenfield",
  "stateHistory": [...],
  "completedPhases": ["domain_research"],
  "validationStatus": {
    "oracle": true,
    "validator": false,
    "eval": true
  },
  "halted": false,
  "lastUpdated": "2025-10-04T..."
}
```

### State Transitions

Transitions are automatic when exit conditions are met:

```
Greenfield:
domain_research → eval_foundation → discovery → architecture → planning → development

Brownfield:
codebase_discovery → domain_research → eval_foundation → compatibility_analysis →
discovery → architecture → planning → development
```

### Blocking Conditions

Certain conditions can halt the workflow:

- **Irreconcilable conflict** (Phase 1.5)
- **Critical validation failure** (Any phase)
- **Human checkpoint rejection** (Phases -1, 1.5)

To resume:

```bash
node bmad-core/runtime/cli.js resume
```

---

## CLI Reference

```bash
# Initialize workflow
bmad-workflow init --type <greenfield|brownfield>

# Execute complete workflow
bmad-workflow execute

# Execute single phase
bmad-workflow phase <phase-name>

# Check status
bmad-workflow status

# Generate report
bmad-workflow report

# Reset workflow
bmad-workflow reset --confirm

# Resume halted workflow
bmad-workflow resume

# List phases
bmad-workflow list-phases
```

---

## File Structure

After running the workflow, your project will have:

```
project/
├── .bmad/
│   ├── workflow-state.json          # Current workflow state
│   ├── workflow-report.json         # Comprehensive report
│   ├── traceability-matrix.yaml     # Traceability matrix
│   └── coverage-report.json         # Coverage report
├── domain-truth.yaml                # Canonical domain truth
├── existing-system-truth.yaml       # Brownfield only
├── enhancement-truth.yaml           # Brownfield only
├── compatibility-conflicts.yaml     # Brownfield only
├── migration-strategy.yaml          # Brownfield only
├── eval-criteria.yaml               # Evaluation criteria
├── requirements-truth-map.yaml      # Requirement traceability
├── architecture-truth-map.yaml      # Architecture traceability
├── validation-chain-proof.md        # Validation proof
├── docs/
│   ├── existing-system-analysis.md  # Brownfield only
│   ├── tech-stack.md               # Brownfield only
│   ├── api-inventory.md            # Brownfield only
│   ├── architecture-current-state.md # Brownfield only
│   ├── domain-analysis.md
│   ├── project-brief.md
│   ├── prd.md
│   ├── architecture.md
│   ├── epics/
│   │   └── *.md
│   └── stories/
│       └── *.md
├── test-datasets/
│   ├── domain-examples.json
│   ├── constraint-tests.yaml
│   ├── edge-cases.json
│   ├── functional-tests.json
│   ├── integration-tests.json
│   ├── story-*-tests.json
│   ├── regression/                  # Brownfield only
│   │   ├── api-behavior.json
│   │   ├── integration-points.json
│   │   ├── business-logic.json
│   │   └── data-integrity.json
│   └── migration/                   # Brownfield only
│       ├── phase-1-tests.json
│       ├── phase-2-tests.json
│       └── phase-3-tests.json
└── baselines/
    └── architecture-metrics.yaml
```

---

## Best Practices

### 1. Trust the Process

- Don't skip phases
- Don't bypass validation gates
- Let the system enforce 100% coverage

### 2. Human Checkpoints

- Take time to review carefully
- Question inconsistencies
- Provide meaningful feedback

### 3. Brownfield Projects

- Be honest about existing system state
- Document actual behavior, not ideal behavior
- Create comprehensive regression tests
- Expect compatibility conflicts

### 4. Test-First Approach

- Phase 1 creates tests BEFORE requirements
- This is intentional - tests define truth
- Code must pass tests, not vice versa

### 5. Validation Chain

- Every artifact traces back to domain truth
- Breaking the chain breaks the system
- Maintain bidirectional links

---

## Troubleshooting

### Workflow Stuck

Check status:
```bash
bmad-workflow status
```

If halted, check `.bmad/workflow-state.json` for reason.

### Validation Failure

Generate report:
```bash
bmad-workflow report
```

Review `.bmad/coverage-report.json` and `.bmad/traceability-matrix.yaml`.

### Gate Failures

Check `failure-analysis-*.md` files for detailed analysis.

### State Corruption

Reset and restart:
```bash
bmad-workflow reset --confirm
bmad-workflow execute
```

---

## Next Steps

After completing Stage 2:

- **Stage 3:** Monitor & Reflection agents for continuous drift detection
- **Stage 4:** Learning loops and adaptation
- **Stage 5:** Full autonomous operation

---

## Support

- **Documentation:** `docs/`
- **Issues:** Report workflow issues in project tracker
- **Questions:** Consult Stage 2 implementation summary

---

**End of Guide**
