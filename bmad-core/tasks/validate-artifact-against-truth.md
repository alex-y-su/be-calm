# Oracle Task: Validate Artifact Against Domain Truth

**Task ID:** oracle-validate-artifact
**Agent:** Oracle
**Category:** Validation
**When to Use:** After any artifact creation or update to ensure domain truth compliance

---

## Purpose

Validate that an artifact (PRD, Architecture, Story, Code, etc.) aligns with the canonical domain truth defined in `domain-truth.yaml`. This task ensures semantic consistency and catches drift from established domain knowledge.

---

## Context

You are the Oracle agent, guardian of domain truth. Your role is to ensure every artifact in the project maintains semantic consistency with the canonical domain knowledge base. You validate meaning, terminology, constraints, and domain facts.

---

## Inputs Required

1. **Artifact to validate** (file path or content)
2. **Domain truth file** (`domain-truth.yaml`)
3. **Artifact type** (PRD, Architecture, Story, Code, etc.)
4. **Validation scope** (full | terminology | facts | constraints)

**Optional:**
- **Brownfield mode:** Also validate against `existing-system-truth.yaml` and `enhancement-truth.yaml`
- **Previous validation report:** For change tracking

---

## Validation Process

### Step 1: Load Truth Sources

```yaml
# Load canonical truth
domain_truth: "{{domain_truth_file}}"

# [BROWNFIELD] Load additional truths
existing_truth: "{{existing_system_truth_file}}"  # Optional
enhancement_truth: "{{enhancement_truth_file}}"    # Optional
```

### Step 2: Extract Artifact Claims

Analyze the artifact and extract:
- **Domain concepts used**
- **Terminology employed**
- **Facts stated or implied**
- **Constraints referenced or created**
- **Business rules mentioned**

### Step 3: Validate Against Domain Truth

For each extracted claim, check:

#### 3.1 Terminology Validation
- Does the artifact use canonical terms from `domain-truth.yaml#terminology`?
- Are forbidden alternatives used?
- Are terms used consistently with their definitions?

**Check:**
```yaml
# Example from domain-truth.yaml
terminology:
  "user": "Authenticated person with account credentials (not 'customer', 'client')"

# Artifact uses "customer" → FLAG as violation
```

#### 3.2 Domain Fact Validation
- Do stated facts align with `domain-truth.yaml#canonical_facts`?
- Are there contradictions?
- Are new facts introduced that conflict with existing truth?

**Check:**
```yaml
# Example from domain-truth.yaml
canonical_facts:
  - id: "FACT-001"
    fact: "JWT token expiry is 15 minutes"

# Artifact says "token expires after 30 minutes" → FLAG as violation
```

#### 3.3 Constraint Validation
- Does the artifact violate any domain constraints?
- Are business rules correctly applied?

**Check:**
```yaml
# Example from domain-truth.yaml
constraints:
  - id: "CON-001"
    type: "business_rule"
    rule: "Users must verify email before login"

# Artifact allows login without verification → FLAG as violation
```

#### 3.4 Domain Example Validation
- If artifact includes examples, do they match `domain-truth.yaml#domain_examples`?
- Are edge cases handled correctly?

### Step 4: [BROWNFIELD] Additional Validation

If brownfield project:

#### 4.1 Existing System Compliance
- Does change violate `existing-system-truth.yaml` constraints?
- Is existing functionality preserved?

#### 4.2 Enhancement Alignment
- Does artifact implement `enhancement-truth.yaml` correctly?
- Are migration strategies followed?

### Step 5: Generate Validation Report

Create a structured report:

```yaml
validation_result:
  artifact: "{{artifact_path}}"
  artifact_type: "{{type}}"
  validation_date: "{{timestamp}}"
  overall_status: "PASS | FAIL | WARNING"

  violations:
    critical:
      - violation_id: "VIO-001"
        category: "domain_fact_contradiction"
        severity: "critical"
        location: "{{artifact}}:line_42"
        issue: "States token expiry as 30 minutes"
        expected: "15 minutes per FACT-001"
        source: "domain-truth.yaml#FACT-001"
        action_required: "Update to 15 minutes"

    warnings:
      - violation_id: "VIO-002"
        category: "terminology_inconsistency"
        severity: "warning"
        location: "{{artifact}}:line_15"
        issue: "Uses 'customer' instead of canonical 'user'"
        expected: "user"
        source: "domain-truth.yaml#terminology"
        action_required: "Replace 'customer' with 'user'"

  summary:
    total_checks: 47
    passed: 45
    failed: 2
    warnings: 3
```

### Step 6: Provide Actionable Feedback

For each violation:
1. **Explain** what's wrong
2. **Show** the conflict (artifact vs truth)
3. **Recommend** specific fix
4. **Reference** truth source (domain-truth.yaml#FACT-ID)

---

## Output Format

Use the template: `bmad-core/templates/consistency-report-tmpl.md`

**Key sections:**
1. **Executive Summary** (pass/fail, issue count)
2. **Critical Violations** (must fix)
3. **Warnings** (should fix)
4. **Recommendations** (how to fix)
5. **Traceability** (which truth facts were checked)

**Save to:** `docs/validation/consistency-report-{{artifact_name}}-{{timestamp}}.md`

---

## Validation Scope Options

### Full Validation
Check everything: terminology, facts, constraints, examples

### Terminology Only
Focus on canonical term usage

### Facts Only
Check domain fact alignment

### Constraints Only
Verify business rule compliance

---

## Success Criteria

- [ ] All domain facts in artifact align with domain-truth.yaml
- [ ] Terminology is consistent (no forbidden alternatives)
- [ ] No constraint violations
- [ ] [BROWNFIELD] No existing-truth violations
- [ ] Validation report generated with actionable feedback

---

## Examples

### Example 1: Validate PRD

**Input:**
```bash
Artifact: docs/prd.md
Domain Truth: docs/domain-truth.yaml
Scope: full
```

**Process:**
1. Load domain-truth.yaml
2. Extract all claims from PRD
3. Check each FR against domain facts
4. Validate terminology in user stories
5. Check NFRs against constraints
6. Generate report

**Output:**
```markdown
# Consistency Report: PRD

## Status: FAIL (2 critical issues)

### Critical Issues
1. **FR-003 violates FACT-001**
   - States: "Token expiry 30 minutes"
   - Expected: "15 minutes"
   - Fix: Update FR-003 line 42

2. **Terminology violation**
   - Uses: "customer" (7 occurrences)
   - Should use: "user"
   - Fix: Replace all instances
```

### Example 2: Validate Story

**Input:**
```bash
Artifact: docs/stories/epic-1/story-1.1.md
Domain Truth: docs/domain-truth.yaml
Scope: full
```

**Process:**
1. Load domain-truth.yaml
2. Extract story acceptance criteria
3. Validate against domain examples
4. Check implementation notes against constraints
5. Verify terminology

**Output:**
```markdown
# Consistency Report: Story 1.1

## Status: PASS ✅

All domain facts validated.
Terminology consistent.
No constraint violations.
```

---

## Edge Cases

### New Facts Introduced

If artifact introduces facts not in domain-truth.yaml:
1. **Flag as potential addition**
2. **Ask:** Should this be added to domain truth?
3. **Recommend:** Update domain-truth.yaml if legitimate

### Ambiguous Terminology

If term usage is unclear:
1. **Flag for resolution**
2. **Trigger:** resolve-domain-ambiguity task
3. **Add to:** terminology-map.yaml

### Brownfield Conflicts

If enhancement contradicts existing-truth:
1. **Flag as compatibility issue**
2. **Trigger:** validate-compatibility task
3. **Require:** migration strategy

---

## Integration Points

**Called by:**
- PM agent (after PRD creation)
- Architect agent (after architecture design)
- SM agent (after story creation)
- Dev agent (after code implementation)
- Validator agent (continuous validation)

**Triggers:**
- `check-cross-document-consistency` (if multiple violations)
- `resolve-domain-ambiguity` (if terminology unclear)
- `update-domain-truth` (if new facts discovered)

**Outputs to:**
- Validator agent (for traceability tracking)
- Monitor agent (for tracking drift over time)

---

## Tips for Oracle Agent

1. **Be strict but helpful** - Violations matter, but explain clearly
2. **Provide examples** - Show correct vs incorrect usage
3. **Reference source** - Always cite domain-truth.yaml fact IDs
4. **Suggest fixes** - Don't just identify problems, solve them
5. **Track patterns** - If same violation repeats, suggest truth update
6. **Context matters** - Understand artifact type (PRD vs Code requires different validation)
7. **Brownfield awareness** - Know when to check existing-truth vs domain-truth

---

## Command Signature

When user invokes via BMAD CLI:

```bash
bmad oracle validate-artifact \
  --artifact docs/prd.md \
  --truth docs/domain-truth.yaml \
  --scope full \
  --output docs/validation/consistency-report-prd.md
```

When agent auto-invokes:
```yaml
task: validate-artifact-against-truth
inputs:
  artifact: "{{artifact_path}}"
  scope: "{{validation_scope}}"
```

---

**This task is critical for maintaining semantic consistency throughout the project lifecycle.**
