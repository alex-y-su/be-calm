# Synthetic Data Best Practices

## Data Quality Principles

### 1. Realism
- Use realistic value distributions (not uniform random)
- Apply domain-specific patterns (80/20 rule)
- Include temporal consistency
- Mirror production data characteristics

### 2. Coverage
- Happy paths (60-70%)
- Edge cases (20-30%)
- Error scenarios (10%)
- Boundary values at limits

### 3. Referential Integrity
- All foreign keys must resolve
- Maintain relationship cardinality
- Respect cascade rules
- No orphaned records (except for negative tests)

### 4. Domain Compliance
- Follow business rules
- Respect state machines
- Apply constraints consistently
- Use valid domain values

## Edge Case Categories

### Boundary Values
- Minimum valid values
- Maximum valid values
- Just below minimum (invalid)
- Just above maximum (invalid)
- Zero / empty / null

### Invalid States
- Illegal state transitions
- Inconsistent state combinations
- Missing required relationships
- Conflicting data

### Constraint Violations
- Unique constraint duplicates
- Foreign key orphans
- Check constraint failures
- Temporal violations

### Security Tests
- SQL injection payloads (sanitization)
- XSS payloads (escaping)
- Path traversal attempts
- Malformed input (buffer overflow patterns)

## Data Volume Guidelines

### Unit Tests
- 10-50 records per entity
- Cover main scenarios
- YAML format for readability
- Manual inspection friendly

### Integration Tests
- 100-500 records total
- Complete workflows
- Cross-entity relationships
- YAML format

### Performance Tests
- 10K-1M+ records per entity
- Realistic distributions
- CSV/SQL format for efficiency
- Seed + multiplication approach

## Format Selection

**Use YAML when:**
- Small datasets (< 1000 records)
- Human readability important
- Complex nested structures
- Manual inspection needed

**Use CSV when:**
- Large datasets (> 10K records)
- Flat structure
- Database import needed
- Performance critical

**Use SQL when:**
- Direct database seeding
- Complex relationships
- Transaction support needed
- Database-specific features

## Generation Strategies

### Direct Generation
- For datasets < 10K records
- AI generates all data
- Full control over quality
- Limited by context window

### Seed + Multiplication
- For datasets > 10K records
- AI generates 100 high-quality seeds
- Script multiplies to target count
- Preserves patterns from seeds

### Faker/Generator Config
- For very large datasets
- AI defines rules, not data
- External tool generates
- Minimal AI token usage

## Validation Checklist

- [ ] All required fields populated
- [ ] All foreign keys resolve
- [ ] All unique constraints satisfied
- [ ] All state transitions valid
- [ ] All business rules met
- [ ] Distributions realistic
- [ ] Temporal order correct
- [ ] Format syntax valid
- [ ] Documentation complete
- [ ] Security tests included
