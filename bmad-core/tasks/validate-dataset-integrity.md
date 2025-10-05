<!-- Powered by BMAD™ Core -->

# Validate Dataset Integrity Task

## Purpose

To validate the integrity, consistency, and quality of generated evaluation datasets. Ensures referential integrity, domain constraint compliance, format validity, and realistic data distributions before datasets are used for testing.

## Input Parameters

- `domain_context`: Domain analysis results
- `datasets`: All generated datasets (unit, integration, performance, edge cases)
- `schemas`: Entity schemas and constraints

## Validation Checks

### 1. Referential Integrity
- All foreign keys reference existing parent records
- No orphaned records
- Cascade rules respected

### 2. Domain Constraints
- Business rules satisfied (e.g., debit = credit)
- State machine compliance
- Temporal constraints (created_at < updated_at)

### 3. Format Validation
- YAML/CSV syntax valid
- Data types match schema
- Required fields populated
- Unique constraints satisfied

### 4. Distribution Validation
- Data patterns match expected distributions
- Realistic value ranges
- Appropriate variations

## Execution

1. Load all datasets from `eval/` directory
2. Load schemas and constraints from `eval/schemas/`
3. Run validation checks
4. Generate integrity report: `eval/validation/integrity-report.yaml`
5. Present results to user with pass/fail summary

## Success Criteria

- [ ] All foreign keys resolve to existing records
- [ ] All domain constraints satisfied
- [ ] All formats valid (YAML/CSV parseable)
- [ ] All unique constraints honored
- [ ] Distributions match expectations (sampled)
