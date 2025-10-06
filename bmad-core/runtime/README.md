# BMAD Workflow Runtime

**Version:** 5.0.0
**Status:** Production Ready

Complete workflow orchestration system for BMAD-METHOD with truth-driven validation, state management, and multi-gate quality assurance.

---

## Quick Start

### CLI Usage

```bash
# Initialize a workflow
node bmad-core/runtime/cli.js init --type greenfield
# or
node bmad-core/runtime/cli.js init --type brownfield

# Execute the complete workflow
node bmad-core/runtime/cli.js execute

# Check workflow status
node bmad-core/runtime/cli.js status

# Generate comprehensive report
node bmad-core/runtime/cli.js report
```

### Programmatic Usage

```javascript
import { WorkflowEngine } from './bmad-core/runtime/index.js';

// Initialize workflow engine
const engine = new WorkflowEngine();
await engine.initialize('greenfield'); // or 'brownfield'

// Execute complete workflow
await engine.execute();

// Or execute single phase
await engine.executeSinglePhase('domain_research');

// Get status
const status = engine.getStatus();
console.log(`Current phase: ${status.currentState}`);
console.log(`Progress: ${status.progress}%`);

// Generate report
const report = await engine.generateReport();
```

---

## Architecture

### Core Components

```
runtime/
├── base/
│   └── WorkflowOrchestrator.js      # Base class for phase orchestrators
├── validators/
│   ├── TraceabilityValidator.js     # Ensures 100% traceability
│   ├── CoverageValidator.js         # Ensures 100% test coverage
│   └── ValidationGates.js           # Multi-gate validation system
├── phases/
│   ├── Phase-1_CodebaseDiscovery.js # Brownfield: existing system analysis
│   ├── Phase0_DomainResearch.js     # Establish domain truth
│   ├── Phase1_EvalFoundation.js     # Create tests BEFORE requirements
│   ├── Phase1.5_CompatibilityAnalysis.js # Brownfield: migration planning
│   ├── Phase2_Discovery.js          # Requirements with truth validation
│   ├── Phase3_Architecture.js       # Architecture with domain alignment
│   ├── Phase4_Planning.js           # Stories with embedded tests
│   └── Phase5_Development.js        # Validated implementation
├── StateMachine.js                  # State management & transitions
├── AgentRegistry.js                 # Agent lifecycle management
├── WorkflowEngine.js                # Main orchestration engine
├── cli.js                           # Command-line interface
└── index.js                         # Public API exports
```

---

## Workflow Paths

### Greenfield (6 phases)

```
Phase 0: Domain Research
    ↓
Phase 1: Eval Foundation (tests first!)
    ↓
Phase 2: Discovery (requirements)
    ↓
Phase 3: Architecture
    ↓
Phase 4: Planning (stories)
    ↓
Phase 5: Development (validated)
```

### Brownfield (8 phases)

```
Phase -1: Codebase Discovery
    ↓
Phase 0: Domain Research
    ↓
Phase 1: Eval Foundation
    ↓
Phase 1.5: Compatibility Analysis
    ↓
Phase 2: Discovery
    ↓
Phase 3: Architecture
    ↓
Phase 4: Planning
    ↓
Phase 5: Development (7 gates)
```

---

## Validation Systems

### 1. Traceability Validator

Ensures every artifact traces back to domain truth.

```javascript
import { TraceabilityValidator } from './validators/TraceabilityValidator.js';

const validator = new TraceabilityValidator();

// Validate chain
await validator.validateChain('docs/prd.md', 'domain-truth.yaml');

// Validate 100% coverage
await validator.validate100PercentCoverage(
  'domain-truth.yaml',
  ['docs/prd.md', 'docs/architecture.md']
);

// Generate traceability matrix
const matrix = await validator.generateMatrix([
  'domain-truth.yaml',
  'docs/prd.md',
  'docs/architecture.md'
]);
// Output: .bmad/traceability-matrix.yaml
```

### 2. Coverage Validator

Ensures 100% test coverage for all facts and requirements.

```javascript
import { CoverageValidator } from './validators/CoverageValidator.js';

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

// Generate coverage report
const report = await validator.generateCoverageReport({
  domainTruth: 'domain-truth.yaml',
  domainTests: ['test-datasets/domain-examples.json'],
  prd: 'docs/prd.md',
  requirementTests: ['test-datasets/functional-tests.json']
});
// Output: .bmad/coverage-report.json
```

### 3. Validation Gates

Multi-gate validation system for story completion.

**Greenfield (5 gates):**
1. Eval - 100% tests passing
2. Oracle - Domain truth alignment
3. Validator - Traceability intact
4. Monitor - No drift
5. QA - Supplemental tests

**Brownfield (7 gates):**
0. **Regression - No existing functionality broken** (MUST PASS FIRST)
1. Eval - 100% new tests passing
2. Oracle - Dual truth validation
3. Validator - Traceability intact
4. Monitor - No performance degradation
5. Compatibility - Migration strategy adherence
6. QA - Supplemental tests

```javascript
import { ValidationGates } from './validators/ValidationGates.js';

const gates = new ValidationGates(stateMachine, agentRegistry, validators);

const result = await gates.executeAll(story);
// All gates must pass to complete story
```

---

## State Management

State is persisted to `.bmad/workflow-state.json`:

```json
{
  "currentState": "eval_foundation",
  "projectType": "greenfield",
  "stateHistory": [...],
  "completedPhases": ["domain_research"],
  "validationStatus": {
    "oracle": true,
    "validator": true,
    "eval": true
  },
  "halted": false,
  "lastUpdated": "2025-10-04T..."
}
```

### State Transitions

Automatic transitions when exit conditions are met:
- All prerequisites satisfied
- All validation gates pass
- All exit conditions met

### Blocking Conditions

Workflow halts if:
- Irreconcilable conflict detected (Phase 1.5)
- Critical validation failure
- Human checkpoint rejected

Resume with:
```bash
node bmad-core/runtime/cli.js resume
```

---

## CLI Commands

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

# List all phases
bmad-workflow list-phases
```

---

## Outputs

After running the workflow, your project will contain:

```
.bmad/
├── workflow-state.json          # Current state
├── workflow-report.json         # Comprehensive report
├── traceability-matrix.yaml     # Full traceability
└── coverage-report.json         # Test coverage

domain-truth.yaml                # Canonical domain truth
eval-criteria.yaml               # Test criteria
requirements-truth-map.yaml      # Requirement traceability
architecture-truth-map.yaml      # Architecture traceability
validation-chain-proof.md        # Validation proof

docs/
├── domain-analysis.md
├── project-brief.md
├── prd.md
├── architecture.md
├── epics/*.md                   # With truth references
└── stories/*.md                 # With embedded tests

test-datasets/
├── domain-examples.json
├── constraint-tests.yaml
├── functional-tests.json
├── integration-tests.json
└── story-*-tests.json

# Brownfield only:
existing-system-truth.yaml
enhancement-truth.yaml
migration-strategy.yaml
compatibility-conflicts.yaml
test-datasets/regression/
test-datasets/migration/
```

---

## Testing

### Run Integration Tests

```bash
# Greenfield flow test
node --test bmad-core/runtime/tests/greenfield-flow.test.js

# Brownfield flow test
node --test bmad-core/runtime/tests/brownfield-flow.test.js

# All tests
node --test bmad-core/runtime/tests/*.test.js
```

---

## Key Features

### ✅ Truth-Driven Workflow
- Domain truth as immutable foundation
- Test-first approach (Phase 1 before Phase 2)
- 100% traceability enforcement
- 100% test coverage enforcement

### ✅ Dual-Path Support
- Greenfield: 6 phases
- Brownfield: 8 phases with compatibility analysis

### ✅ Brownfield-Specific
- Existing system analysis
- Regression test baselines
- Compatibility analysis
- Migration strategy generation
- Dual truth system (existing + domain)
- 7-gate validation

### ✅ Continuous Validation
- Watch modes during development
- Real-time drift detection
- Continuous traceability checking
- Performance monitoring

### ✅ Human Checkpoints
- Review existing system truth (Phase -1)
- Review migration strategy (Phase 1.5)
- Multi-question support

### ✅ Blocking Conditions
- Irreconcilable conflicts halt workflow
- Require human decision
- Resume capability

---

## Best Practices

1. **Trust the process** - Don't skip phases or bypass gates
2. **Test-first** - Phase 1 creates tests BEFORE requirements (intentional!)
3. **100% coverage** - Every fact, requirement, and integration point must have tests
4. **Human checkpoints** - Review carefully, question inconsistencies
5. **Brownfield honesty** - Document actual behavior, not ideal behavior
6. **Maintain traceability** - Every artifact traces to domain truth

---

## Documentation

- **User Guide:** `docs/stage-2-workflow-guide.md`
- **Implementation Summary:** `plans/stage-2-implementation-complete.md`
- **Original Spec:** `plans/stage-2-validation-workflows.md`

---

## Integration with BMAD

This runtime integrates with BMAD v4.x and v5.x:

- Uses existing agents from `bmad-core/agents/`
- Uses existing templates from `bmad-core/templates/`
- Compatible with existing workflows
- Adds orchestration layer on top

---

## Future Enhancements

- Real LLM integration for agent execution
- Web UI for human checkpoints
- Real-time file system watchers
- Distributed execution
- Cloud state persistence
- Advanced analytics

---

## Support

For issues or questions:
1. Check the comprehensive guide: `docs/stage-2-workflow-guide.md`
2. Review implementation summary: `plans/stage-2-implementation-complete.md`
3. Report issues in project tracker

---

**Status:** ✅ Production Ready
**Next:** Stage 3 - Monitoring & Reflection
