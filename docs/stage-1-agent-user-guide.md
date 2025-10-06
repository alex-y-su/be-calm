# Stage 1: Agent User Guide

**Version:** 5.0
**Date:** 2025-10-04
**Agents:** Oracle, Eval (Enhanced), Validator, Compatibility

---

## Quick Start

### When to Use Which Agent

| Agent | When to Use | Key Task |
|-------|-------------|----------|
| **Oracle** | After domain research | Create domain truth |
| **Eval** | After domain truth created | Generate test datasets |
| **Validator** | After any artifact creation | Validate artifact |
| **Compatibility** | **Phase -1** (brownfield only) | Analyze existing system |

---

## Oracle Agent 🔮

### Purpose
Guardian of domain truth. Maintains canonical knowledge, validates artifacts, enforces consistency.

### Key Commands

```bash
# 1. Create domain truth (after domain research)
bmad oracle create-domain-truth \
  --input docs/domain-analysis.md \
  --output docs/domain-truth.yaml

# 2. Validate artifact against truth
bmad oracle validate-artifact \
  --artifact docs/prd.md \
  --truth docs/domain-truth.yaml

# 3. Check consistency across documents
bmad oracle check-cross-document-consistency \
  --artifacts docs/ \
  --truth docs/domain-truth.yaml

# 4. Update domain truth (when truth evolves)
bmad oracle update-truth \
  --fact-id FACT-001 \
  --new-value "15 minutes" \
  --reason "Security audit"

# 5. Check terminology
bmad oracle check-terminology \
  --artifacts docs/ \
  --auto-fix true

# 6. Resolve ambiguity
bmad oracle resolve-ambiguity \
  --term "session" \
  --strategy canonicalize
```

### Brownfield Commands

```bash
# 7. Create existing system truth (Phase -1)
bmad oracle create-existing-truth \
  --codebase /path/to/project \
  --output docs/existing-system-truth.yaml

# 8. Validate compatibility (before enhancement)
bmad oracle validate-compatibility \
  --change "Reduce JWT expiry" \
  --existing-truth docs/existing-system-truth.yaml \
  --domain-truth docs/domain-truth.yaml

# 9. Create enhancement truth
bmad oracle create-enhancement-truth \
  --existing-truth docs/existing-system-truth.yaml \
  --domain-truth docs/domain-truth.yaml \
  --output docs/enhancement-truth.yaml

# 10. Analyze migration path (for breaking changes)
bmad oracle analyze-migration-path \
  --current "30 minutes" \
  --target "15 minutes" \
  --output docs/migration-strategy-MIG-001.yaml

# 11. Validate full enhancement
bmad oracle validate-enhancement \
  --enhancement-truth docs/enhancement-truth.yaml
```

### Typical Workflows

#### Greenfield: Create Domain Truth
```bash
# 1. Analyst completes domain research
# 2. Oracle extracts canonical facts
bmad oracle create-domain-truth \
  --input docs/domain-analysis.md \
  --output docs/domain-truth.yaml

# 3. Oracle validates internal consistency
# 4. Output: domain-truth.yaml ready for use
```

#### Validate PRD
```bash
# After PM creates PRD
bmad oracle validate-artifact \
  --artifact docs/prd.md \
  --truth docs/domain-truth.yaml

# Oracle checks:
# - All FRs trace to domain facts
# - Terminology consistent
# - No contradictions
```

#### Brownfield: Create Enhancement Plan
```bash
# 1. Compatibility analyzes existing system
bmad oracle create-existing-truth --codebase .

# 2. Analyst researches domain (normal process)
bmad oracle create-domain-truth --input docs/domain-analysis.md

# 3. Oracle reconciles existing vs domain truth
bmad oracle create-enhancement-truth \
  --existing-truth docs/existing-system-truth.yaml \
  --domain-truth docs/domain-truth.yaml

# 4. For each breaking enhancement, analyze migration
bmad oracle analyze-migration-path \
  --change "Reduce JWT expiry" \
  --output docs/migration-strategy-MIG-001.yaml

# 5. Validate complete enhancement plan
bmad oracle validate-enhancement \
  --enhancement-truth docs/enhancement-truth.yaml
```

---

## Eval Agent 🧪 (Enhanced)

### Purpose
Create test datasets BEFORE code. Validate empirically. Prevent "sounds right" vs "is right" gap.

### Key Commands

```bash
# 1. Create domain test datasets (from domain truth)
bmad eval create-eval-dataset \
  --truth docs/domain-truth.yaml \
  --output test-datasets/domain/

# 2. Generate functional test data (from PRD)
bmad eval generate-functional-test-data \
  --prd docs/prd.md \
  --output test-datasets/functional/

# 3. Generate story acceptance tests
bmad eval generate-story-acceptance-tests \
  --story docs/stories/epic-1/story-1.1.md \
  --output test-datasets/stories/story-1.1-tests.yaml

# 4. Run all tests
bmad eval run-eval-tests \
  --criteria docs/eval-criteria.yaml \
  --report docs/validation/test-results.md

# 5. Validate domain coverage (100% required)
bmad eval validate-domain-coverage \
  --truth docs/domain-truth.yaml \
  --test-datasets test-datasets/
```

### Brownfield Commands

```bash
# 6. Create regression test datasets
bmad eval create-regression-dataset \
  --existing-truth docs/existing-system-truth.yaml \
  --output test-datasets/regression/

# 7. Validate no regression
bmad eval validate-no-regression \
  --regression-tests test-datasets/regression/

# 8. Create compatibility tests
bmad eval create-compatibility-tests \
  --enhancement docs/enhancement-truth.yaml \
  --output test-datasets/compatibility/

# 9. Create migration tests
bmad eval create-migration-tests \
  --migration docs/migration-strategy-MIG-001.yaml \
  --output test-datasets/migration/
```

### Typical Workflows

#### Create Test Datasets (Greenfield)
```bash
# Phase 1: After domain truth created
bmad eval create-eval-dataset \
  --truth docs/domain-truth.yaml \
  --output test-datasets/domain/

# Phase 2: After PRD created
bmad eval generate-functional-test-data \
  --prd docs/prd.md \
  --output test-datasets/functional/

# Phase 3: After Architecture created
bmad eval generate-integration-test-data \
  --architecture docs/architecture.md \
  --output test-datasets/integration/

# Phase 4: Before development (per story)
bmad eval generate-story-acceptance-tests \
  --story docs/stories/epic-1/story-1.1.md

# Phase 5: During development
bmad eval run-eval-tests --watch-mode true
```

#### Brownfield: Prevent Regressions
```bash
# 1. Generate regression tests from existing behavior
bmad eval create-regression-dataset \
  --existing-truth docs/existing-system-truth.yaml

# 2. Run regression tests before any changes
bmad eval validate-no-regression

# 3. During migration
bmad eval create-compatibility-tests
bmad eval create-migration-tests

# 4. Run ALL tests (regression + new functionality)
bmad eval run-eval-tests --scope all
```

---

## Validator Agent ✅

### Purpose
Continuous validation. Ensures semantic, empirical, consistency, and completeness at all times.

### Key Commands

```bash
# 1. Complete validation (all four types)
bmad validator validate-artifact \
  --artifact docs/prd.md \
  --type prd

# 2. Validate traceability chain
bmad validator validate-traceability \
  --start-fact FACT-001 \
  --direction bidirectional

# 3. Create traceability proof (for story/feature)
bmad validator create-traceability-proof \
  --story 1.1 \
  --output docs/validation/proof-story-1.1.md

# 4. Generate traceability matrix (full project)
bmad validator generate-traceability-matrix \
  --output docs/validation/traceability-matrix.yaml

# 5. Validate entire project
bmad validator validate-entire-project \
  --output docs/validation/project-validation-report.md

# 6. Watch artifacts for changes (continuous validation)
bmad validator watch \
  --path docs/ \
  --validate-on-change true

# 7. Validate on commit (git hook)
bmad validator validate-on-commit

# 8. Generate validation report
bmad validator generate-validation-report \
  --scope full-project
```

### Typical Workflows

#### Validate PRD
```bash
bmad validator validate-artifact \
  --artifact docs/prd.md \
  --type prd

# Runs:
# - Semantic validation (Oracle)
# - Empirical validation (Eval)
# - Consistency check
# - Completeness check

# Output: Pass/Fail + detailed report
```

#### Continuous Validation (Watch Mode)
```bash
# Run in background during development
bmad validator watch \
  --path docs/ \
  --validate-on-change true

# Auto-validates on file save:
# - Detects artifact type
# - Runs appropriate validation
# - Shows real-time feedback
```

#### Before Release
```bash
# Full project validation
bmad validator validate-entire-project

# Checks:
# - All artifacts validated
# - 100% traceability
# - All tests passing
# - No inconsistencies

# Gate: Cannot release if validation fails
```

---

## Compatibility Agent 🔄 (Brownfield Only)

### Purpose
Brownfield integration specialist. Analyzes existing systems, validates compatibility, designs migrations.

### Key Commands

```bash
# 1. Analyze existing system (Phase -1)
bmad compatibility analyze-existing-system \
  --codebase /path/to/project \
  --output docs/existing-system-truth.yaml

# 2. Analyze architecture
bmad compatibility analyze-existing-architecture \
  --output docs/existing-system-truth.yaml

# 3. Capture performance baseline
bmad compatibility capture-performance-baseline \
  --output docs/existing-system-truth.yaml#performance_baselines

# 4. Validate compatibility of change
bmad compatibility validate-change-compatibility \
  --change "Reduce JWT expiry" \
  --existing-truth docs/existing-system-truth.yaml

# 5. Identify breaking changes
bmad compatibility identify-breaking-changes \
  --proposed-change docs/enhancement-truth.yaml

# 6. Assess consumer impact
bmad compatibility assess-consumer-impact \
  --breaking-change "JWT expiry change"

# 7. Create migration strategy
bmad compatibility create-migration-strategy \
  --change "JWT expiry" \
  --output docs/migration-strategy-MIG-001.yaml

# 8. Design compatibility layer
bmad compatibility design-compatibility-layer \
  --migration MIG-001

# 9. Generate regression tests
bmad compatibility generate-regression-tests \
  --existing-truth docs/existing-system-truth.yaml
```

### Typical Workflow (Brownfield)

#### Phase -1: Initial Analysis
```bash
# 1. Analyze existing codebase
bmad compatibility analyze-existing-system \
  --codebase . \
  --output docs/existing-system-truth.yaml

# Extracts:
# - Current architecture
# - Business logic
# - Integration points
# - Performance baselines
# - Technical debt
```

#### Before Enhancement
```bash
# 1. Validate proposed change won't break existing system
bmad compatibility validate-change-compatibility \
  --change "Reduce JWT expiry" \
  --existing-truth docs/existing-system-truth.yaml

# 2. If breaking, identify impact
bmad compatibility assess-consumer-impact \
  --breaking-change "JWT expiry"

# 3. Design migration strategy
bmad compatibility create-migration-strategy \
  --output docs/migration-strategy-MIG-001.yaml

# 4. Create compatibility layer if needed
bmad compatibility design-compatibility-layer \
  --migration MIG-001
```

---

## Common Patterns

### Pattern 1: Greenfield Project Start

```bash
# 1. Analyst: Domain research
# (Creates domain-analysis.md)

# 2. Oracle: Create domain truth
bmad oracle create-domain-truth \
  --input docs/domain-analysis.md

# 3. Eval: Create domain test datasets
bmad eval create-eval-dataset \
  --truth docs/domain-truth.yaml

# 4. PM: Create PRD (with Oracle validation)
bmad oracle validate-artifact --artifact docs/prd.md

# 5. Eval: Generate functional tests
bmad eval generate-functional-test-data --prd docs/prd.md

# 6. Validator: Validate traceability
bmad validator validate-traceability --scope prd

# 7. Proceed to Architecture...
```

### Pattern 2: Brownfield Project Start

```bash
# Phase -1: Analyze existing system
bmad compatibility analyze-existing-system --codebase .

# Phase 0: Domain research (normal)
# (Analyst creates domain-analysis.md)

# Phase 0.5: Reconcile existing vs domain
bmad oracle create-domain-truth --input docs/domain-analysis.md
bmad oracle create-enhancement-truth \
  --existing-truth docs/existing-system-truth.yaml \
  --domain-truth docs/domain-truth.yaml

# Phase 0.6: Plan migrations
bmad oracle analyze-migration-path (for each breaking change)

# Phase 0.7: Generate regression tests
bmad eval create-regression-dataset \
  --existing-truth docs/existing-system-truth.yaml

# Phase 1: Proceed with enhancement (normal workflow + migration)
```

### Pattern 3: Story Development

```bash
# Before coding:
# 1. SM creates story with truth references
# 2. Eval generates acceptance tests
bmad eval generate-story-acceptance-tests --story story-1.1.md

# 3. Validator validates story
bmad validator validate-artifact --artifact story-1.1.md

# During coding:
# 4. Dev implements with watch mode
bmad eval run-eval-tests --watch-mode true

# After coding:
# 5. Validator creates proof
bmad validator create-traceability-proof --story 1.1

# 6. Ready for merge ✅
```

---

## Troubleshooting

### "Validation failed - semantic inconsistency"
**Cause:** Artifact contradicts domain truth
**Fix:** Update artifact OR update domain truth (if truth is wrong)

### "Eval tests failing"
**Cause:** Code doesn't match domain truth OR truth is wrong OR test is wrong
**Fix:** Analyze root cause, update appropriate artifact

### "Traceability incomplete"
**Cause:** Orphan requirements or missing domain facts
**Fix:** Add missing traceability links

### "Brownfield: Breaking change detected"
**Cause:** Enhancement breaks existing functionality
**Fix:** Create migration strategy before proceeding

---

## Best Practices

### ✅ DO:
- Create domain truth FIRST (before PRD)
- Generate test datasets BEFORE code
- Validate at every phase
- Use watch mode during development
- Create traceability proofs for completed work

### ❌ DON'T:
- Write code without tests
- Skip validation
- Ignore inconsistencies
- Change code without updating truth
- Make breaking changes without migration strategy

---

## Summary

**Oracle:** Truth guardian
**Eval:** Test-first validation
**Validator:** Continuous quality assurance
**Compatibility:** Brownfield safety net

**Result:** Empirically validated, semantically consistent, fully traceable software.
