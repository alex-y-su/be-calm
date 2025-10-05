<!-- Powered by BMAD™ Core -->

# Create Domain Truth Task

## Purpose

To generate the canonical domain truth file (`domain-truth.yaml`) from domain analysis documentation. This file establishes the immutable foundation that all other artifacts (PRD, Architecture, Stories, Code) must trace to and validate against. Every domain assertion must be empirically testable through eval datasets.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Load Configuration and Locate Domain Analysis

#### 1.1 Load Core Configuration

- Load `{root}/core-config.yaml` from the project root
- If the file does not exist, HALT and inform the user: "core-config.yaml not found. This file is required. Please install BMAD or copy the configuration from bmad-core/core-config.yaml"
- Extract key configurations: `prd.*`, `architecture.*`, `truth.*` settings

#### 1.2 Locate Domain Analysis Document

- Check for domain analysis document in these locations (in order):
  1. Path specified in user prompt
  2. `docs/domain-analysis.md`
  3. `docs/research/domain-analysis.md`
  4. `domain-analysis.md`
- If not found, HALT and ask user: "Where is the domain analysis document? Please provide the path."
- Load the domain analysis document

#### 1.3 Verify Domain Analysis Quality

Check that domain analysis contains:
- Clear domain description and scope
- Domain concepts/entities identified
- Domain rules and constraints
- Examples or scenarios

If analysis is insufficient, HALT and inform user: "Domain analysis lacks sufficient detail. Please ensure it includes concepts, rules, constraints, and examples."

### 2. Extract Domain Scope and Boundaries

#### 2.1 Identify Domain Scope

Extract and formalize:
- **Domain Name:** Clear, concise identifier for this domain
- **Description:** 1-3 paragraph summary of what this domain encompasses
- **Included Scope:** List of what IS in this domain's responsibility
- **Excluded Scope:** List of what is NOT in this domain (clear boundaries)
- **Domain Boundaries:** Interfaces with other domains/systems

#### 2.2 Build Domain Glossary

Extract all domain-specific terminology:
- Identify terms that have specific meaning in this domain
- Define each term unambiguously
- List aliases or alternative names
- Specify validation criteria for correct term usage

**Critical Rule:** Terms must be used consistently across ALL artifacts.

### 3. Extract Domain Concepts

#### 3.1 Identify Core Concepts

For each concept/entity in the domain:
- Extract concept name
- Classify type: [entity, value_object, aggregate, event, service]
- Write clear description
- Assign unique ID (e.g., "CONCEPT-001")

#### 3.2 Define Concept Properties

For each concept, extract properties:
- Property name
- Data type
- Required vs. optional
- Constraints (validation rules)
- Link to test dataset that will validate this property

#### 3.3 Define Concept Relationships

For each relationship between concepts:
- Identify related concept
- Classify type: [one-to-one, one-to-many, many-to-many]
- Describe relationship meaning
- List constraints on the relationship

#### 3.4 Define Concept Invariants

Identify invariants (rules that must ALWAYS be true):
- Write clear invariant description
- Assign unique ID (e.g., "INV-001")
- Specify criticality: [critical, important, nice_to_have]
- **CRITICAL:** Link to test dataset ID that will prove this invariant

**Rule:** Every invariant MUST have a test dataset reference.

### 4. Extract Domain Rules

#### 4.1 Identify Domain Rules

Extract all business logic and constraints:
- Rule name and unique ID (e.g., "RULE-001")
- Clear description of the rule
- Classify type: [business_logic, validation, calculation, workflow]
- Specify criticality: [critical, important, nice_to_have]

#### 4.2 Formalize Rule Specifications

For each rule:
- **Preconditions:** What must be true before rule applies
- **Postconditions:** What must be true after rule executes
- **Formula:** Mathematical or logical formula (if applicable)

#### 4.3 Provide Concrete Examples

**CRITICAL REQUIREMENT:** Every rule MUST have at least one concrete example:
- Define example input (specific values)
- Define expected output (specific values)
- Link to test dataset ID (e.g., "TEST-DATASET-003")

**Rule:** Abstract rules without examples are NOT ALLOWED.

#### 4.4 Define Exceptions

For each rule, identify exception cases:
- Exception condition
- How exception should be handled
- Link to test dataset ID for exception scenario

### 5. Extract Functional Requirements

#### 5.1 Identify Domain-Level FRs

Extract high-level functional requirements from domain:
- Unique ID (e.g., "FR-001")
- Requirement name
- Clear description
- Rationale (why this is required)
- Priority: [critical, high, medium, low]

#### 5.2 Define Actors and Flows

For each FR:
- List actors (who interacts with this)
- Define preconditions
- Define postconditions
- Document main flow (happy path steps)
- Document alternate flows (variations)
- Document exception flows (error handling)

#### 5.3 Define Acceptance Criteria

**CRITICAL REQUIREMENT:** Every FR MUST have acceptance criteria:
- Clear, testable criterion
- Validation method: [automated_test, manual_test, inspection]
- **Link to test dataset ID**

**Rule:** All acceptance criteria must be testable via eval datasets.

### 6. Define Quality Attributes

#### 6.1 Extract Non-Functional Requirements

Identify quality attributes required by the domain:
- Category: [performance, security, usability, reliability, etc.]
- Specific attribute name
- Requirement description
- How to measure (measurement method)
- Target value/range
- Priority: [critical, high, medium, low]

#### 6.2 Link to Validation

For each quality attribute:
- Specify how it will be measured
- Link to test dataset ID for validation

### 7. Document Constraints and Assumptions

#### 7.1 Identify Constraints

Extract limitations and boundaries:
- Constraint type: [technical, business, regulatory, resource]
- Description
- Impact on the domain
- Mitigation strategy (if applicable)
- How to validate compliance

#### 7.2 Document Assumptions

Extract stated or implicit assumptions:
- Clear assumption description
- Validation status: [assumed, validated, invalidated]
- Risk if assumption proves invalid
- Link to test dataset for validation (if assumption is testable)

### 8. Establish Validation Linkage

#### 8.1 Link to Eval Criteria

Specify linkage to validation infrastructure:
- Path to `eval-criteria.yaml` (will be generated by Eval agent)
- Path to `test-datasets/` directory
- Path to `validation-chain-proof.yaml` (generated by Validator)

#### 8.2 Link to External Authorities

If domain traces to external standards:
- Source (e.g., "ISO 8601", "GDPR Article 17", industry standard)
- Description of what is traced
- How to verify compliance

### 9. Generate domain-truth.yaml File

#### 9.1 Load Template

- Load template: `{root}/templates/domain-truth-tmpl.yaml`

#### 9.2 Populate All Sections

Fill in all template sections with extracted data:
- Metadata (version, dates, authors, validation status)
- Domain (name, description, scope, glossary)
- Concepts (with properties, relationships, invariants)
- Domain Rules (with examples, exceptions)
- Functional Requirements (with acceptance criteria)
- Quality Attributes
- Constraints and Assumptions
- Validation Linkage
- Traceability

#### 9.3 Validate Completeness

**CRITICAL VALIDATION CHECKS:**
- [ ] Every domain rule has at least one concrete example
- [ ] Every domain rule has at least one test dataset reference
- [ ] Every FR has acceptance criteria
- [ ] Every acceptance criterion has a test dataset reference
- [ ] Every invariant has a test dataset reference
- [ ] Glossary defines all domain-specific terms
- [ ] Scope is clearly defined (included/excluded)
- [ ] All validation_test_ids are specified (format: "TEST-DATASET-XXX")

If ANY check fails, HALT and fix before proceeding.

#### 9.4 Save File

- Save to: `domain-truth.yaml` (project root, or path from core-config)
- Set validation_status to "draft"
- Record creation date and version

### 10. Generate Supporting Documentation

#### 10.1 Create Terminology Map

- Generate `terminology-map.yaml` mapping:
  - Terms → Definitions
  - Aliases → Canonical terms
  - Context where each term applies

#### 10.2 Create Initial Consistency Report

- Generate `consistency-report.md` with:
  - Summary of domain truth created
  - List of concepts extracted
  - List of rules formalized
  - List of test datasets needed (all TEST-DATASET-XXX references)
  - Validation status: DRAFT (not yet validated)

### 11. Coordinate with Eval Agent

#### 11.1 Identify Required Test Datasets

Extract all test dataset references from domain-truth.yaml:
- Collect all `test_dataset_id` values
- Collect all `validation_test_ids` arrays
- Create master list of required datasets

#### 11.2 Inform User of Next Steps

Present to user:

```
Domain truth created successfully!

File: domain-truth.yaml
Status: DRAFT (not yet validated)
Concepts: [count]
Domain Rules: [count]
Functional Requirements: [count]

NEXT STEPS REQUIRED:
1. Run Eval agent command: *create-eval-dataset
   - Eval will generate [count] test datasets to validate domain truth
   - All domain rules and FRs will have concrete test cases

2. After eval datasets created, run Oracle command: *validate-artifact
   - This will validate domain-truth.yaml for consistency

3. Change validation_status from "draft" to "validated" when ready

Required Test Datasets:
[List all TEST-DATASET-XXX IDs that Eval needs to create]
```

### 12. Task Completion

#### 12.1 Verify Deliverables

Confirm these files exist:
- [ ] `domain-truth.yaml`
- [ ] `terminology-map.yaml`
- [ ] `consistency-report.md`

#### 12.2 Mark Truth as Foundation

Inform user:

```
domain-truth.yaml is now the FOUNDATION for this project.

All other artifacts (PRD, Architecture, Stories, Code) MUST:
- Trace to elements in this file
- Maintain consistency with domain truth
- Validate against the test datasets

Oracle agent will enforce consistency.
Validator agent will verify traceability.
Eval agent will provide empirical validation.
```

#### 12.3 Complete Task

Return control to Oracle agent with success status.

---

## Error Handling

### If Domain Analysis Missing
- HALT and request path to domain analysis document
- Suggest running Analyst agent first if no analysis exists

### If Domain Analysis Insufficient
- List missing elements
- Request user to enhance analysis
- Provide specific guidance on what to add

### If Template Not Found
- HALT with error: "domain-truth-tmpl.yaml not found at {root}/templates/"
- Suggest checking BMAD installation

### If Validation Fails
- List all validation failures
- Do NOT generate file until all checks pass
- Provide guidance on fixing each issue

---

## Notes

- This task creates Level 0 truth - the immutable foundation
- Every assertion must be empirically testable
- No abstract rules without concrete examples
- Test dataset references are MANDATORY, not optional
- Domain truth should rarely change (understanding may deepen, but truth doesn't change)
- For brownfield projects, use `create-existing-system-truth` task instead/in addition
