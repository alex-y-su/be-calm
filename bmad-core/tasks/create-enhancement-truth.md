# Oracle Task: Create Enhancement Truth (Brownfield)

**Task ID:** oracle-create-enhancement-truth
**Agent:** Oracle
**Category:** Brownfield Planning
**When to Use:** After domain research, to reconcile existing system with domain truth

---

## Purpose

Create `enhancement-truth.yaml` that reconciles three sources:
1. **Existing System Truth** (what IS)
2. **Domain Truth** (what SHOULD be)
3. **Enhancement Plan** (what WILL change)

This document defines the migration path from current state to ideal state.

---

## Context

You are the Oracle agent in **brownfield mode**. You have:
- `existing-system-truth.yaml` (current state from codebase analysis)
- `domain-truth.yaml` (ideal state from domain research)

Now you must create `enhancement-truth.yaml` that:
- Identifies gaps between IS and SHOULD
- Defines concrete enhancements to close gaps
- Specifies migration strategies for breaking changes
- Maintains backward compatibility during transition

**This is the reconciliation phase.**

---

## Inputs Required

1. **Existing system truth** (`existing-system-truth.yaml`)
2. **Domain truth** (`domain-truth.yaml`)
3. **Project goals** (what enhancements are desired?)

**Optional:**
- **PRD (brownfield sections)** - if already drafted
- **Stakeholder priorities** - which gaps to address first

---

## Enhancement Truth Creation Process

### Step 1: Load Both Truth Sources

```yaml
truth_reconciliation:
  existing_truth:
    file: "docs/existing-system-truth.yaml"
    facts: 27
    constraints: 8
    tech_debt: 7

  domain_truth:
    file: "docs/domain-truth.yaml"
    facts: 47
    constraints: 12

  analysis_date: "2025-10-04"
```

### Step 2: Identify Gaps

Compare existing vs domain truth to find discrepancies:

```yaml
gap_analysis:
  gaps_found: 15

  gap_examples:
    - gap_id: "GAP-001"
      category: "authentication"
      domain_truth: "FACT-001: JWT token expiry 15 minutes"
      existing_truth: "BIZ-002: JWT token expiry 30 minutes"
      gap_type: "value_mismatch"
      severity: "high"
      breaking_if_changed: true

    - gap_id: "GAP-002"
      category: "user_management"
      domain_truth: "FACT-002: Email verification required before login"
      existing_truth: "BIZ-001: Email verification NOT required"
      gap_type: "missing_constraint"
      severity: "critical"
      breaking_if_changed: true

    - gap_id: "GAP-003"
      category: "security"
      domain_truth: "CON-005: Rate limiting required (100 req/min)"
      existing_truth: "DEBT-001: No rate limiting implemented"
      gap_type: "missing_feature"
      severity: "high"
      breaking_if_changed: false  # Addition, not modification

  gaps_by_severity:
    critical: 3
    high: 7
    medium: 4
    low: 1
```

### Step 3: Define Enhancements

For each gap, define enhancement:

```yaml
enhancement_definition:
  enhancement_id: "ENH-001"
  title: "Reduce JWT token expiry to 15 minutes"
  type: "modification"
  category: "authentication"

  gap_addressed: "GAP-001"

  current_state:
    fact_id: "BIZ-002"
    source: "existing-system-truth.yaml"
    value: "JWT token expiry: 30 minutes"
    location: "src/middleware/auth.ts:42"

  target_state:
    fact_id: "FACT-001"
    source: "domain-truth.yaml"
    value: "JWT token expiry: 15 minutes"
    rationale: "Security best practice: shorter session timeout reduces exposure"

  change_details:
    what_changes: "JWT expiry configuration"
    how_to_change: "Update expiresIn parameter from '30m' to '15m'"
    affected_components:
      - "Authentication middleware"
      - "Mobile app (requires update)"
      - "Web app (dynamic refresh, no change needed)"

  impact_assessment:
    breaking_change: true
    reason: "Mobile app v2.1 hardcodes 30-minute refresh logic"
    consumers_affected:
      - name: "Mobile App v2.1"
        user_count: 50000
        impact: "Will experience unexpected logouts"
        mitigation: "Release mobile v2.2 with dynamic token handling"

  migration_strategy_ref: "MIG-001"
  migration_required: true
  backward_compatible_period: "3 months"

  priority: "high"
  estimated_effort: "medium"
  dependencies: []
```

### Step 4: Classify Enhancement Types

```yaml
enhancement_types:
  modifications: 7
    # Changes to existing behavior
    # Examples: ENH-001 (token expiry), ENH-005 (email verification)

  additions: 5
    # New features not in existing system
    # Examples: ENH-003 (rate limiting), ENH-007 (audit logging)

  removals: 1
    # Deprecated features to remove
    # Examples: ENH-012 (remove legacy auth endpoint)

  refactorings: 2
    # Technical debt resolution
    # Examples: ENH-010 (externalize config), ENH-011 (split monolith auth)

  total: 15
```

### Step 5: Prioritize Enhancements

```yaml
prioritization:
  must_have:
    # Critical security/compliance fixes
    - ENH-002: "Fix authentication vulnerability"
    - ENH-005: "Require email verification (compliance)"

  should_have:
    # High-value domain alignment
    - ENH-001: "Reduce token expiry (security improvement)"
    - ENH-003: "Add rate limiting (prevent abuse)"

  could_have:
    # Nice-to-have improvements
    - ENH-007: "Add audit logging"
    - ENH-010: "Externalize configuration"

  wont_have_now:
    # Deferred to future phase
    - ENH-012: "Remove legacy endpoint (after full migration)"
```

### Step 6: Define Migration Strategies

For each breaking enhancement:

```yaml
migration_planning:
  enhancement_id: "ENH-001"

  migration_strategy:
    strategy_id: "MIG-001"
    strategy_type: "phased_rollout"
    phases: 4
    duration: "7 weeks"
    backward_compatible: true  # During phases 1-3

    summary:
      - "Phase 1: Make expiry configurable (2 weeks)"
      - "Phase 2: Update mobile app (4 weeks)"
      - "Phase 3: Change default to 15 min (1 week)"
      - "Phase 4: Remove 30-min support (1 week)"

    full_details: "See migration-strategy-MIG-001.yaml"

  rollback_plan:
    supported: true
    complexity: "low"
    max_rollback_time: "< 5 minutes per phase"
```

### Step 7: Map Enhancements to PRD

Link enhancements to PRD requirements:

```yaml
prd_mapping:
  enhancement_id: "ENH-001"

  maps_to_prd:
    - requirement_id: "NFR-003"
      section: "Security Requirements"
      content: "Session timeout must be 15 minutes for security"

  creates_new_requirement: false  # Already in PRD

---

enhancement_id: "ENH-003"

  maps_to_prd:
    - requirement_id: "NFR-007"
      section: "Performance & Security"
      content: "API must enforce rate limiting (100 req/min per user)"

  creates_new_requirement: true  # New requirement, add to PRD
  suggested_fr_id: "NFR-007"
```

### Step 8: Generate enhancement-truth.yaml

Use template: `bmad-core/templates/enhancement-truth-tmpl.yaml`

```yaml
# enhancement-truth.yaml

project:
  name: "Auth System Enhancement"
  type: "brownfield_enhancement"
  analysis_date: "2025-10-04"

reconciliation_source:
  existing_truth: "existing-system-truth.yaml"
  domain_truth: "domain-truth.yaml"
  gap_analysis: "gap-analysis-2025-10-04.md"

gaps_identified:
  total: 15
  critical: 3
  high: 7
  medium: 4
  low: 1

enhancements:
  - enhancement_id: "ENH-001"
    title: "Reduce JWT token expiry to 15 minutes"
    type: "modification"
    priority: "high"

    current_state:
      fact_id: "BIZ-002"
      value: "30 minutes"
      source: "existing-system-truth.yaml"

    target_state:
      fact_id: "FACT-001"
      value: "15 minutes"
      source: "domain-truth.yaml"
      rationale: "Security improvement"

    gap_addressed: "GAP-001"

    impact:
      breaking_change: true
      consumers_affected: ["Mobile App v2.1"]
      user_count: 50000

    migration_strategy_ref: "MIG-001"
    backward_compatible_period: "3 months"

    estimated_effort: "medium"
    dependencies: []

  - enhancement_id: "ENH-002"
    # ... (similar structure)

  # ... (all 15 enhancements)

migration_strategies:
  - strategy_id: "MIG-001"
    enhancement_id: "ENH-001"
    type: "phased_rollout"
    phases: 4
    duration: "7 weeks"
    details: "See migration-strategy-MIG-001.yaml"

  - strategy_id: "MIG-002"
    # ...

implementation_roadmap:
  phase_1:
    name: "Critical Security Fixes"
    duration: "8 weeks"
    enhancements: ["ENH-002", "ENH-005"]

  phase_2:
    name: "Security Improvements"
    duration: "7 weeks"
    enhancements: ["ENH-001", "ENH-003"]

  phase_3:
    name: "Technical Debt & Polish"
    duration: "4 weeks"
    enhancements: ["ENH-007", "ENH-010"]

validation:
  oracle_validation: "pending"
  compatibility_validation: "pending"
  enhancement_validation: "pending"
```

---

## Output Format

**File:** `docs/enhancement-truth.yaml`

**Structure:**
1. **Project Overview** (name, type, reconciliation sources)
2. **Gap Analysis Summary**
3. **Enhancements List** (detailed for each)
4. **Migration Strategies** (references)
5. **Implementation Roadmap** (phases)
6. **Validation Status**

**Companion Document:** `docs/gap-analysis-{{date}}.md`
- Detailed gap descriptions
- Rationale for each enhancement
- Risk analysis

---

## Success Criteria

- [ ] Both truth sources loaded
- [ ] All gaps identified and analyzed
- [ ] Enhancements defined for critical/high gaps
- [ ] Migration strategies created for breaking changes
- [ ] Enhancements prioritized
- [ ] PRD mapping complete
- [ ] Implementation roadmap created
- [ ] enhancement-truth.yaml generated

---

## Examples

### Example 1: Authentication Enhancement

```yaml
Gap: Token expiry mismatch (30min vs 15min)

Enhancement:
  ID: ENH-001
  Type: Modification
  Breaking: Yes
  Migration: MIG-001 (4 phases, 7 weeks)
  Priority: High
```

### Example 2: Missing Feature

```yaml
Gap: No rate limiting (missing vs required)

Enhancement:
  ID: ENH-003
  Type: Addition
  Breaking: No (new feature)
  Migration: Not required
  Priority: High
```

---

## Integration Points

**Called by:**
- Oracle (after domain research complete)
- User (manual enhancement planning)

**Requires:**
- `existing-system-truth.yaml` (from `create-existing-system-truth`)
- `domain-truth.yaml` (from `create-domain-truth`)

**Triggers:**
- Oracle `analyze-migration-path` (for each breaking enhancement)
- Oracle `validate-enhancement` (validate complete plan)

**Outputs to:**
- PM agent (for PRD enhancement section)
- Architect agent (for architecture updates)
- Eval agent (for regression test creation)

---

## Command Signature

```bash
bmad oracle create-enhancement-truth \
  --existing-truth docs/existing-system-truth.yaml \
  --domain-truth docs/domain-truth.yaml \
  --output docs/enhancement-truth.yaml
```

---

**Enhancement truth = The bridge from IS to SHOULD BE.**
