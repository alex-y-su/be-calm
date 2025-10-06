# Stage 2: Workflow Runtime - Quick Reference

**Version:** 5.0.0 | **Date:** 2025-10-04

---

## 🚀 Quick Start

```bash
# Initialize
node bmad-core/runtime/cli.js init --type greenfield

# Execute
node bmad-core/runtime/cli.js execute

# Status
node bmad-core/runtime/cli.js status
```

---

## 📊 Workflow Paths

### Greenfield (6 phases)
```
0. domain_research → 1. eval_foundation → 2. discovery →
3. architecture → 4. planning → 5. development
```

### Brownfield (8 phases)
```
-1. codebase_discovery → 0. domain_research → 1. eval_foundation →
1.5. compatibility_analysis → 2. discovery → 3. architecture →
4. planning → 5. development
```

---

## 🎯 Phase Outputs

| Phase | Key Outputs |
|-------|-------------|
| **-1** (brownfield) | `existing-system-truth.yaml`, `test-datasets/regression/` |
| **0** | `domain-truth.yaml`, `domain-analysis.md` |
| **1** | `eval-criteria.yaml`, `test-datasets/domain-examples.json` |
| **1.5** (brownfield) | `migration-strategy.yaml`, `enhancement-truth.yaml` |
| **2** | `docs/prd.md`, `requirements-truth-map.yaml` |
| **3** | `docs/architecture.md`, `architecture-truth-map.yaml` |
| **4** | `docs/stories/*.md`, `test-datasets/story-*-tests.json` |
| **5** | Implementation code, `validation-chain-proof.md` |

---

## ✅ Validation Gates

### Greenfield (5 gates)
1. ✓ Eval - 100% tests passing
2. ✓ Oracle - Domain truth aligned
3. ✓ Validator - Traceability intact
4. ✓ Monitor - No drift
5. ✓ QA - Supplemental tests pass

### Brownfield (7 gates)
0. ✓ **Regression - No existing functionality broken**
1. ✓ Eval - 100% new tests passing
2. ✓ Oracle - Dual truth validation
3. ✓ Validator - Traceability intact
4. ✓ Monitor - No performance degradation
5. ✓ Compatibility - Migration strategy adhered
6. ✓ QA - Supplemental tests pass

---

## 💻 Programmatic API

```javascript
import { WorkflowEngine } from './bmad-core/runtime/index.js';

const engine = new WorkflowEngine();
await engine.initialize('greenfield');
await engine.execute();
const status = engine.getStatus();
const report = await engine.generateReport();
```

### Validators

```javascript
import {
  TraceabilityValidator,
  CoverageValidator,
  ValidationGates
} from './bmad-core/runtime/index.js';

// Traceability
const traceValidator = new TraceabilityValidator();
await traceValidator.validateChain('docs/prd.md', 'domain-truth.yaml');

// Coverage
const coverageValidator = new CoverageValidator();
await coverageValidator.validateDomainFactCoverage(
  'domain-truth.yaml',
  ['test-datasets/domain-examples.json']
);
```

---

## 📁 Generated Files

```
.bmad/
├── workflow-state.json
├── workflow-report.json
├── traceability-matrix.yaml
└── coverage-report.json

domain-truth.yaml
eval-criteria.yaml
requirements-truth-map.yaml
architecture-truth-map.yaml
validation-chain-proof.md

docs/
├── domain-analysis.md
├── prd.md
├── architecture.md
├── epics/*.md
└── stories/*.md

test-datasets/
├── domain-examples.json
├── functional-tests.json
├── integration-tests.json
└── story-*-tests.json
```

---

## 🛠️ CLI Commands

| Command | Description |
|---------|-------------|
| `init --type <type>` | Initialize workflow (greenfield/brownfield) |
| `execute` | Execute complete workflow |
| `phase <name>` | Execute single phase |
| `status` | Show workflow status |
| `report` | Generate comprehensive report |
| `reset --confirm` | Reset workflow to initial state |
| `resume` | Resume halted workflow |
| `list-phases` | List all available phases |

---

## 🔍 Troubleshooting

### Workflow stuck?
```bash
node bmad-core/runtime/cli.js status
# Check .bmad/workflow-state.json
```

### Validation failure?
```bash
node bmad-core/runtime/cli.js report
# Review .bmad/coverage-report.json
```

### Gate failures?
```
Check failure-analysis-*.md files
```

### Reset workflow?
```bash
node bmad-core/runtime/cli.js reset --confirm
```

---

## ⚡ Key Features

- ✅ Truth-driven workflow
- ✅ Test-first approach (Phase 1 before 2)
- ✅ 100% traceability enforcement
- ✅ 100% test coverage enforcement
- ✅ Dual-path (greenfield/brownfield)
- ✅ Multi-gate validation
- ✅ Human checkpoints
- ✅ Blocking conditions
- ✅ State persistence
- ✅ Continuous validation

---

## 📚 Documentation

- **Full Guide:** `docs/stage-2-workflow-guide.md`
- **Implementation:** `plans/stage-2-implementation-complete.md`
- **Runtime README:** `bmad-core/runtime/README.md`

---

## 🎓 Best Practices

1. **Don't skip phases** - Each builds on the previous
2. **Trust test-first** - Phase 1 creates tests BEFORE requirements
3. **Maintain 100% coverage** - Every fact needs a test
4. **Review checkpoints carefully** - Your approval matters
5. **Document actual behavior** - Especially in brownfield

---

## 📊 Statistics

- **Total Files:** 20 JavaScript files + 3 documentation files
- **Lines of Code:** ~5,300
- **Phases:** 8 (greenfield: 6, brownfield: 8)
- **Validators:** 3 systems
- **Gates:** 7 (greenfield: 5, brownfield: 7)
- **Test Suites:** 2 (26 integration tests)

---

**Status:** ✅ Production Ready
**Version:** 5.0.0
**Next:** Stage 3 - Monitoring & Reflection
