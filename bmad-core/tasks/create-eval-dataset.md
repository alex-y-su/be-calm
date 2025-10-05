<!-- Powered by BMAD™ Core -->

# Create Evaluation Dataset Task

## Purpose

To generate a comprehensive suite of realistic, domain-compliant synthetic datasets for testing, validation, and performance measurement. This task orchestrates the creation of multi-layered datasets (unit, integration, performance, edge cases) with proper referential integrity, domain-specific constraints, and comprehensive documentation, making them immediately usable by QA agents and development teams.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Load Configuration and Analyze Domain Context

#### 1.1 Load Core Configuration

- Load `{root}/core-config.yaml` from the project root
- If the file does not exist, HALT and inform the user: "core-config.yaml not found. This file is required. Please install BMAD or copy the configuration from bmad-core/core-config.yaml"
- Extract key configurations: `prd.*`, `architecture.*` settings

#### 1.2 Execute Domain Analysis Task

- Execute `{root}/tasks/analyze-domain-for-eval.md` to extract domain context
- This task will:
  - Attempt to auto-detect domain type from project documentation
  - Elicit domain specifications if detection fails or user confirmation needed
  - Extract entities, relationships, constraints, and business rules
  - Identify domain-specific data patterns and distributions
- Store results in temporary context for use in subsequent steps

#### 1.3 Verify Domain Understanding

- Present domain analysis summary to user for confirmation:
  - Domain Type: [detected type, e.g., e-commerce, fintech, healthcare]
  - Key Entities: [list of main entities]
  - Relationships: [primary entity relationships]
  - Domain Constraints: [critical business rules]
- Ask user: "Is this domain analysis correct? (yes/no/modify)"
- If 'modify', re-run domain analysis with user corrections
- If 'no', HALT and ask user to provide domain specifications

### 2. Initialize Evaluation Directory Structure

#### 2.1 Create Directory Hierarchy

Create the following directory structure in project root:

```
eval/
├── schemas/
├── unit/
│   ├── entities/
│   └── edge-cases/
├── integration/
│   └── workflows/
├── performance/
└── validation/
```

#### 2.2 Generate Configuration File

- Use template `{root}/templates/eval-config-tmpl.yaml`
- Populate with domain analysis results:
  - Domain type and description
  - Entity definitions
  - Relationship mappings
  - Constraint rules
  - Data volumes (defaults: 50 unit, 500 integration, 100K performance)
- Save to `eval/config.yaml`

### 3. Generate Entity Schemas

#### 3.1 Create Schema Definitions

- For each entity identified in domain analysis:
  - Define field names, types, constraints (required, unique, ranges)
  - Define relationships and foreign keys
  - Define validation rules (format, length, patterns)
  - Define realistic value distributions (normal, zipf, categorical)
- Use template `{root}/templates/dataset-schema-tmpl.yaml`
- Save individual entity schemas to `eval/schemas/{entity-name}.yaml`

#### 3.2 Create Relationships Map

- Document entity relationships (one-to-one, one-to-many, many-to-many)
- Define referential integrity rules
- Define cascade behaviors
- Save to `eval/schemas/relationships.yaml`

#### 3.3 Create Constraints Document

- Document domain-specific constraints:
  - Business rules (e.g., debit = credit for financial transactions)
  - State machine definitions (e.g., order status transitions)
  - Temporal constraints (e.g., created_at < updated_at)
  - Cross-entity validations
- Save to `eval/schemas/constraints.yaml`

### 4. Generate Unit Test Datasets

#### 4.1 Execute Unit Data Generation Task

- Execute `{root}/tasks/generate-unit-test-data.md` with parameters:
  - Domain context from Step 1
  - Entity schemas from Step 3
  - Target: 50 records per entity (configurable from eval/config.yaml)
- This task generates small, curated datasets covering happy paths and common scenarios

#### 4.2 Verify Unit Data Structure

- Ensure files created in `eval/unit/entities/{entity-name}.yaml`
- Validate YAML format and schema compliance
- Create README.md in `eval/unit/` explaining dataset purpose and usage

### 5. Generate Integration Test Datasets

#### 5.1 Execute Integration Data Generation Task

- Execute `{root}/tasks/generate-integration-test-data.md` with parameters:
  - Domain context from Step 1
  - Entity schemas and relationships from Step 3
  - Target: 500 records across entities (configurable from eval/config.yaml)
- This task generates workflow-based datasets with proper cross-entity relationships

#### 5.2 Verify Integration Data Structure

- Ensure files created in `eval/integration/workflows/`
- Validate referential integrity across related entities
- Create README.md in `eval/integration/` explaining workflow scenarios

### 6. Generate Performance Test Datasets

#### 6.1 Execute Performance Data Generation Task

- Execute `{root}/tasks/generate-performance-data.md` with parameters:
  - Domain context from Step 1
  - Entity schemas from Step 3
  - Target: 100K records per entity (configurable from eval/config.yaml)
- This task generates large bulk datasets with realistic distributions

#### 6.2 Optimize Performance Data Format

- For large datasets, use CSV format for efficiency: `eval/performance/{entity-name}.csv`
- Optionally generate SQL seed files: `eval/performance/{entity-name}.sql`
- Create README.md in `eval/performance/` explaining dataset size and usage

### 7. Generate Edge Case Datasets

#### 7.1 Execute Edge Case Generation Task

- Execute `{root}/tasks/generate-edge-case-data.md` with parameters:
  - Domain context from Step 1
  - Entity schemas and constraints from Step 3
- This task generates:
  - Boundary values (min, max, empty, null)
  - Invalid states and error conditions
  - Constraint violations for negative testing

#### 7.2 Organize Edge Cases

- Save edge cases to `eval/unit/edge-cases/{category}.yaml`:
  - boundary-values.yaml
  - invalid-states.yaml
  - constraint-violations.yaml
  - error-conditions.yaml
- Create README.md in `eval/unit/edge-cases/` explaining edge case coverage

### 8. Generate Expected Validation Results

#### 8.1 Create Expected Outcomes

- For unit test datasets, define expected results:
  - Valid operations and their outcomes
  - Expected error messages for invalid inputs
  - State transition expectations
- Use template `{root}/templates/data-profile-tmpl.yaml`
- Save to `eval/validation/expected-results.yaml`

#### 8.2 Create Test Assertions

- Define test assertions for QA agent:
  - Data integrity assertions (referential, constraints)
  - Business rule assertions (domain-specific validations)
  - Performance benchmarks (query response times, throughput)
- Save to `eval/validation/test-assertions.yaml`

### 9. Validate Dataset Integrity

#### 9.1 Execute Validation Task

- Execute `{root}/tasks/validate-dataset-integrity.md` with parameters:
  - All generated datasets
  - Schemas and constraints from Step 3
- This task validates:
  - Referential integrity (foreign keys point to existing records)
  - Domain constraint compliance (business rules satisfied)
  - Format compliance (valid YAML/CSV structure)
  - Realistic distributions (data patterns match domain expectations)

#### 9.2 Report Validation Results

- If validation errors found:
  - Log errors to `eval/validation/integrity-report.yaml`
  - Present summary to user with option to:
    1. Auto-fix issues (regenerate affected data)
    2. Review and manually fix
    3. Accept issues as intentional test cases
- If validation passes, proceed to next step

### 10. Create Master Manifest

#### 10.1 Execute Manifest Creation Task

- Execute `{root}/tasks/create-dataset-manifest.md`
- This task creates `eval/manifest.yaml` containing:
  - Dataset inventory (all files, types, sizes)
  - Schema references
  - Usage instructions per dataset type
  - QA handoff documentation
  - Domain context summary
  - Configuration settings used

#### 10.2 Create Master README

- Create `eval/README.md` with:
  - Overview of evaluation dataset suite
  - Directory structure explanation
  - Quick start guide for using datasets
  - Links to specific dataset READMEs
  - Domain context summary
  - Integration points for QA agent

### 11. Final Summary and Handoff

#### 11.1 Generate Summary Report

Present comprehensive summary to user:

```
✓ Evaluation Dataset Suite Created Successfully

Domain: [domain type]
Entities: [count] entities defined
Schemas: eval/schemas/ ([count] files)

Datasets Generated:
- Unit Test Data: eval/unit/entities/ ([count] entities, ~50 records each)
- Integration Data: eval/integration/workflows/ ([count] workflows, ~500 records)
- Performance Data: eval/performance/ ([count] entities, ~100K records each)
- Edge Cases: eval/unit/edge-cases/ ([count] categories)

Validation:
- Integrity Check: [PASSED/FAILED]
- Domain Compliance: [PASSED/FAILED]
- Format Compliance: [PASSED/FAILED]

Documentation:
- Master Manifest: eval/manifest.yaml
- Configuration: eval/config.yaml
- README: eval/README.md

Next Steps for QA:
1. Review eval/manifest.yaml for dataset inventory
2. Use eval/validation/test-assertions.yaml for test planning
3. Execute tests against unit datasets first
4. Scale to integration and performance datasets
```

#### 11.2 QA Handoff Checklist

Provide checklist to user:

- [ ] Domain analysis validated and accurate
- [ ] Entity schemas cover all required data models
- [ ] Unit datasets cover happy paths and common scenarios
- [ ] Integration datasets reflect realistic workflows
- [ ] Performance datasets sized appropriately for load testing
- [ ] Edge cases cover boundary conditions and error states
- [ ] All datasets pass integrity validation
- [ ] Documentation is comprehensive and clear
- [ ] QA agent can consume datasets without modification

#### 11.3 Store Execution Context

- Save execution log to `eval/generation-log.yaml`:
  - Timestamp
  - Configuration used
  - Domain analysis results
  - Generation statistics
  - Validation results
  - Any warnings or notes

## Error Handling

- **Missing Configuration**: HALT and guide user to install/configure
- **Domain Detection Failed**: Elicit domain specifications from user
- **Validation Failures**: Offer regeneration or manual review options
- **File Write Errors**: Check permissions, suggest alternative paths
- **Schema Conflicts**: Present conflicts to user for resolution

## Success Criteria

- [ ] All directory structure created successfully
- [ ] Entity schemas defined with complete constraints
- [ ] Unit, integration, and performance datasets generated
- [ ] Edge cases cover comprehensive error scenarios
- [ ] All datasets pass integrity validation
- [ ] Master manifest and documentation complete
- [ ] QA handoff checklist satisfied
