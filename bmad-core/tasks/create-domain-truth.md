<!-- Powered by BMAD™ Core -->

# Create Domain Truth Task

## Purpose

Generate `domain-truth.yaml` from domain analysis - the canonical business knowledge foundation that all artifacts must align with. Focus on BUSINESS requirements, not technical implementation.

## Task Workflow

### 1. Load and Validate Inputs

**Load Configuration:**
- Load `{root}/core-config.yaml`
- If missing, HALT: "core-config.yaml not found. Please install BMAD."

**Locate Domain Analysis:**
Check these paths (in order):
1. User-specified path
2. `docs/domain-analysis.md`
3. `docs/research/domain-analysis.md`
4. `domain-analysis.md`

If not found, HALT: "Where is the domain analysis document?"

**Verify Quality:**
Domain analysis must include:
- Domain description and scope
- Business concepts/entities
- Business rules and constraints
- Concrete examples

If insufficient, HALT and list missing elements.

### 2. Extract Business Domain Knowledge

**Domain Scope:**
- Domain name and business description
- What business problems this solves (included scope)
- What's explicitly out of scope (excluded scope)

**Key Business Terms:**
- Identify domain-specific terminology
- Define each term in business language
- Note forbidden alternatives (for consistency)

**Business Concepts:**
For each concept:
- Name and business description (what it represents)
- Key attributes (essential business information)
- Business rules that must always be true
- Link to test reference (e.g., "TEST-001")

Use BUSINESS language, not technical patterns (no "entity/value_object/aggregate" - just describe what it is).

**Business Rules:**
For each rule:
- What happens (the rule)
- When it applies (conditions)
- Why it matters (business justification)
- Concrete example: given scenario → expected outcome
- Test reference
- Priority

**CRITICAL:** Every rule needs a concrete business example with test reference.

**Requirements:**
For each requirement:
- What user needs
- Why it matters (business value)
- How to verify (acceptance criteria)
- Test reference
- Priority

**Quality Goals:**
Business-driven quality expectations:
- What quality goal (e.g., "fast response time")
- Why it impacts business
- Measurable target
- Test reference

**Constraints:**
Real business/regulatory constraints:
- What the constraint is
- Why it exists
- What it limits

### 3. Generate domain-truth.yaml

**Load Template:**
- Load `{root}/templates/domain-truth-tmpl.yaml`
- If missing, HALT: "Template not found. Check BMAD installation."

**Populate Sections:**
Fill template with extracted business knowledge:
- Metadata (version, date, domain name, status: "draft")
- Domain scope and key terms
- Business concepts with attributes and rules
- Business rules with examples
- Requirements with acceptance criteria
- Quality goals
- Constraints
- Validation settings

**Validate Completeness:**
Before saving, verify:
- [ ] Every business rule has concrete example
- [ ] Every rule has test reference
- [ ] Every requirement has acceptance criteria
- [ ] Scope clearly defined (what we solve / don't solve)
- [ ] Key terms defined with forbidden alternatives
- [ ] Uses BUSINESS language, not technical jargon

If ANY check fails, HALT and fix.

**Save File:**
- Save to: `domain-truth.yaml` (project root or per core-config)
- Status: "draft"

### 4. Generate Supporting Files

**Terminology Map:**
Create `terminology-map.yaml`:
- Terms → Business definitions
- Forbidden alternatives → Canonical terms
- Keep it simple and scannable

**Initial Report:**
Create brief `consistency-report.md`:
- Summary: domain truth created
- Counts: concepts, rules, requirements
- List of test references needed
- Status: DRAFT

### 5. Inform User

Present completion summary:

```
✅ Domain truth created!

File: domain-truth.yaml
Status: DRAFT
Business Concepts: [count]
Business Rules: [count]
Requirements: [count]
Test References: [count] needed

NEXT STEPS:
1. Review domain-truth.yaml for business accuracy
2. Create test datasets for all test references
3. Run: *validate-artifact to check consistency
4. Update status from "draft" to "validated"

domain-truth.yaml is now the foundation - all artifacts must align with it.
```

---

## Error Handling

**Missing domain analysis:** HALT, request path or suggest running Analyst agent first

**Insufficient analysis:** List missing elements, request enhancement

**Missing template:** HALT, suggest checking BMAD installation

**Validation fails:** List failures, provide fix guidance, do not save until resolved

---

## Key Principles

- Focus on BUSINESS knowledge, not technical implementation
- Use business language (avoid "entity", "aggregate", "value object")
- Every rule needs concrete business example
- Keep it minimal - only essential business knowledge
- This is WHAT the business needs, not HOW to build it
