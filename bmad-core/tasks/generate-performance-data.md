<!-- Powered by BMAD™ Core -->

# Generate Performance Test Data Task

## Purpose

To generate large-scale synthetic datasets (100K+ records per entity) optimized for performance, load, and stress testing. Uses a seed-based multiplication approach: AI generates high-quality seed data and TypeScript multiplication script, then executes script to produce bulk datasets efficiently within context limits.

## Input Parameters

- `domain_context`: Domain analysis results from analyze-domain-for-eval task
- `entity_schemas`: Entity schema definitions from eval/schemas/
- `target_count`: Number of records per entity (default: 100,000)

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Initialize Performance Data Generation

#### 1.1 Load Configuration

- Load `eval/config.yaml` for generation settings
- Extract target record count per entity (default: 100,000)
- Load entity schemas from `eval/schemas/*.yaml`
- Load relationships from `eval/schemas/relationships.yaml`
- Load constraints from `eval/schemas/constraints.yaml`

#### 1.2 Determine Generation Strategy

Based on target count:
- **If target_count ≤ 10,000**: Generate directly in YAML/CSV (fits in context)
- **If target_count > 10,000**: Use seed + multiplication script approach

For this task, assume **seed + multiplication approach** (standard for 100K+ records).

#### 1.3 Create Performance Data Directory

- Ensure `eval/performance/` directory exists
- Create subdirectories:
  - `eval/performance/seeds/` - Seed data files
  - `eval/performance/configs/` - Multiplication config files
  - `eval/performance/scripts/` - Generated TS scripts
  - `eval/performance/output/` - Final bulk CSV files

### 2. Generate Seed Data for Each Entity

#### 2.1 Create High-Quality Seed Dataset

For each entity, generate **100 seed records** in YAML format:

**Seed Characteristics:**
- Diverse patterns (all variations from unit/integration tests)
- Representative distributions (normal, zipf, categorical)
- Edge cases included (min/max values, special characters)
- Relationship examples (all foreign key patterns)

**Example Seed Structure:**

```yaml
# eval/performance/seeds/users_seed.yaml
entity: User
seed_count: 100
target_multiplication: 100000
generated_at: 2024-01-15T12:00:00Z

# Seed patterns metadata
patterns:
  age:
    distribution: normal
    mean: 35
    stddev: 12
    min: 18
    max: 80

  email:
    template: "{first_name}.{last_name}{n}@{domain}"
    domains: [example.com, test.org, demo.net, sample.io]

  name:
    first_names: [Alice, Bob, Carol, David, Eve, ...]  # From seed
    last_names: [Johnson, Smith, Williams, Jones, ...]  # From seed

  created_at:
    distribution: uniform
    range: [-730d, now]  # Last 2 years

records:
  - id: 550e8400-e29b-41d4-a716-446655440000
    email: alice.johnson@example.com
    first_name: Alice
    last_name: Johnson
    age: 32
    created_at: 2023-06-15T08:22:11Z
    updated_at: 2023-11-20T14:35:22Z

  - id: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
    email: bob.smith@test.org
    first_name: Bob
    last_name: Smith
    age: 45
    created_at: 2023-02-08T11:45:33Z
    updated_at: 2024-01-10T09:12:05Z

  # ... 98 more seed records
```

#### 2.2 Extract Pattern Metadata from Seeds

Analyze seed records to extract:
- Value ranges (min/max for numeric fields)
- Distribution types (normal, zipf, uniform, categorical)
- Value pools (first_names, domains, categories from seed data)
- Temporal patterns (date ranges, time gaps)
- Relationship cardinalities (foreign key distributions)

Store metadata in seed file's `patterns` section for script to use.

#### 2.3 Save Seed Files

For each entity:
- Save to `eval/performance/seeds/{entity_name}_seed.yaml`
- Ensure 100 diverse, high-quality records
- Include pattern metadata section
- Validate YAML syntax

### 3. Generate Multiplication Configuration

#### 3.1 Create Multiplication Config for Each Entity

**eval/performance/configs/users_multiply.yaml:**

```yaml
entity: User
seed_file: ../seeds/users_seed.yaml
output_file: ../output/users_bulk.csv
target_count: 100000
batch_size: 10000  # Write in batches for memory efficiency

# Field multiplication strategies
field_strategies:
  id:
    strategy: uuid_v4
    description: Generate new UUID for each record

  email:
    strategy: template
    template: "{first_name}.{last_name}{index}@{domain}"
    sources:
      first_name: seed_pool  # Draw from seed's first_name values
      last_name: seed_pool
      domain: seed_pool
    unique: true

  first_name:
    strategy: seed_pool_weighted
    distribution: zipf  # Some names more popular (realistic)
    alpha: 1.5  # Zipf parameter

  last_name:
    strategy: seed_pool_weighted
    distribution: zipf

  age:
    strategy: normal_distribution
    mean: 35
    stddev: 12
    min: 18
    max: 80
    type: integer

  created_at:
    strategy: distribute_range
    range_start: 2022-01-01T00:00:00Z
    range_end: 2024-01-15T12:00:00Z
    distribution: linear  # Steady growth over time

  updated_at:
    strategy: derive_from_field
    base_field: created_at
    operation: add_random_duration
    min_duration: 0d
    max_duration: 365d
    constraint: ">= created_at"  # Must be after created_at

# Validation rules
validations:
  - field: updated_at
    rule: ">= created_at"
  - field: email
    rule: unique
  - field: age
    rule: ">= 18 AND <= 80"
```

#### 3.2 Handle Relationship-Based Multiplication

For dependent entities (with foreign keys):

**eval/performance/configs/orders_multiply.yaml:**

```yaml
entity: Order
seed_file: ../seeds/orders_seed.yaml
output_file: ../output/orders_bulk.csv
target_count: 100000

# Foreign key reference strategies
field_strategies:
  id:
    strategy: uuid_v4

  user_id:
    strategy: foreign_key_reference
    reference_file: ../output/users_bulk.csv
    reference_field: id
    distribution: zipf  # 80/20 rule: 20% of users get 80% of orders
    alpha: 1.2

  status:
    strategy: categorical_weighted
    values:
      delivered: 0.70
      shipped: 0.15
      confirmed: 0.10
      pending: 0.04
      cancelled: 0.01

  total:
    strategy: normal_distribution
    mean: 150.00
    stddev: 75.00
    min: 10.00
    max: 5000.00
    precision: 2  # Currency precision

  created_at:
    strategy: distribute_range
    range_start: 2022-01-01T00:00:00Z
    range_end: 2024-01-15T12:00:00Z
    distribution: exponential  # More recent orders

  # Must be after user.created_at
  validations:
    - field: created_at
      rule: ">= user.created_at"
      reference_entity: User
      reference_field: created_at
```

#### 3.3 Save Multiplication Configs

- Save config for each entity to `eval/performance/configs/{entity}_multiply.yaml`
- Ensure all foreign key references defined
- Include all validation rules
- Specify output format (CSV for bulk data)

### 4. Generate TypeScript Multiplication Script

#### 4.1 Create Main Generator Script

Generate `eval/performance/scripts/generate.ts`:

```typescript
#!/usr/bin/env ts-node
/**
 * Performance Dataset Generator
 * Auto-generated by BMAD Eval Agent
 *
 * Multiplies seed data to create large-scale performance test datasets
 * Uses streaming writes to handle 100K+ records within memory limits
 */

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
interface SeedData {
  entity: string;
  seed_count: number;
  patterns: Record<string, any>;
  records: Record<string, any>[];
}

interface MultiplyConfig {
  entity: string;
  seed_file: string;
  output_file: string;
  target_count: number;
  batch_size: number;
  field_strategies: Record<string, FieldStrategy>;
  validations?: ValidationRule[];
}

interface FieldStrategy {
  strategy: string;
  [key: string]: any;
}

interface ValidationRule {
  field: string;
  rule: string;
}

// Utility: Load YAML file
function loadYaml<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content) as T;
}

// Utility: Generate value based on strategy
function generateValue(
  strategy: FieldStrategy,
  index: number,
  seed: SeedData,
  context: Record<string, any> = {}
): any {
  switch (strategy.strategy) {
    case 'uuid_v4':
      return uuidv4();

    case 'template':
      return interpolateTemplate(strategy.template, index, seed, strategy.sources);

    case 'seed_pool_weighted':
      return selectFromPool(seed, strategy.field_name, strategy.distribution, strategy.alpha);

    case 'normal_distribution':
      return normalRandom(strategy.mean, strategy.stddev, strategy.min, strategy.max, strategy.type);

    case 'distribute_range':
      return distributeInRange(index, strategy.target_count, strategy.range_start, strategy.range_end, strategy.distribution);

    case 'derive_from_field':
      return deriveFromField(context[strategy.base_field], strategy);

    case 'foreign_key_reference':
      return selectForeignKey(strategy.reference_file, strategy.reference_field, strategy.distribution, strategy.alpha);

    case 'categorical_weighted':
      return selectCategorical(strategy.values);

    default:
      throw new Error(`Unknown strategy: ${strategy.strategy}`);
  }
}

// Strategy: Interpolate template string
function interpolateTemplate(
  template: string,
  index: number,
  seed: SeedData,
  sources: Record<string, string>
): string {
  let result = template;

  for (const [key, source] of Object.entries(sources)) {
    if (source === 'seed_pool') {
      const pool = seed.records.map(r => r[key]).filter(Boolean);
      const value = pool[Math.floor(Math.random() * pool.length)];
      result = result.replace(`{${key}}`, value);
    }
  }

  result = result.replace('{index}', String(index));
  return result;
}

// Strategy: Select from seed pool with distribution
function selectFromPool(
  seed: SeedData,
  fieldName: string,
  distribution: string,
  alpha: number
): any {
  const pool = seed.records.map(r => r[fieldName]).filter(Boolean);

  if (distribution === 'zipf') {
    const rank = zipfRandom(pool.length, alpha);
    return pool[rank];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Strategy: Normal distribution random
function normalRandom(
  mean: number,
  stddev: number,
  min: number,
  max: number,
  type?: string
): number {
  let value: number;
  do {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    value = mean + stddev * z;
  } while (value < min || value > max);

  return type === 'integer' ? Math.round(value) : Number(value.toFixed(2));
}

// Strategy: Distribute values across date range
function distributeInRange(
  index: number,
  totalCount: number,
  rangeStart: string,
  rangeEnd: string,
  distribution: string
): string {
  const start = new Date(rangeStart).getTime();
  const end = new Date(rangeEnd).getTime();
  const range = end - start;

  let ratio: number;
  if (distribution === 'linear') {
    ratio = index / totalCount;
  } else if (distribution === 'exponential') {
    // More weight toward recent dates
    ratio = Math.pow(index / totalCount, 2);
  } else {
    ratio = Math.random();
  }

  const timestamp = start + range * ratio;
  return new Date(timestamp).toISOString();
}

// Strategy: Derive value from another field
function deriveFromField(baseValue: any, strategy: FieldStrategy): any {
  if (strategy.operation === 'add_random_duration') {
    const baseDate = new Date(baseValue).getTime();
    const minDuration = parseDuration(strategy.min_duration);
    const maxDuration = parseDuration(strategy.max_duration);
    const randomDuration = minDuration + Math.random() * (maxDuration - minDuration);
    return new Date(baseDate + randomDuration).toISOString();
  }

  return baseValue;
}

// Strategy: Select foreign key with distribution
const foreignKeyCache: Record<string, any[]> = {};

function selectForeignKey(
  referenceFile: string,
  referenceField: string,
  distribution: string,
  alpha: number
): any {
  // Load reference data (cached)
  if (!foreignKeyCache[referenceFile]) {
    const csvContent = fs.readFileSync(referenceFile, 'utf8');
    const lines = csvContent.split('\n').slice(1); // Skip header
    foreignKeyCache[referenceFile] = lines
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        return values[0]; // Assume first column is ID
      });
  }

  const pool = foreignKeyCache[referenceFile];

  if (distribution === 'zipf') {
    const rank = zipfRandom(pool.length, alpha);
    return pool[rank];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Strategy: Select categorical value with weights
function selectCategorical(values: Record<string, number>): string {
  const random = Math.random();
  let cumulative = 0;

  for (const [value, weight] of Object.entries(values)) {
    cumulative += weight;
    if (random <= cumulative) {
      return value;
    }
  }

  return Object.keys(values)[0];
}

// Utility: Zipf distribution random rank
function zipfRandom(n: number, alpha: number): number {
  const harmonicSum = Array.from({ length: n }, (_, i) => 1 / Math.pow(i + 1, alpha))
    .reduce((a, b) => a + b, 0);

  const random = Math.random() * harmonicSum;
  let cumulative = 0;

  for (let i = 0; i < n; i++) {
    cumulative += 1 / Math.pow(i + 1, alpha);
    if (random <= cumulative) {
      return i;
    }
  }

  return 0;
}

// Utility: Parse duration string (e.g., "30d", "2h")
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([dhms])$/);
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
    default: return 0;
  }
}

// Main: Process entity
async function processEntity(configPath: string): Promise<void> {
  console.log(`Processing: ${configPath}`);

  const config = loadYaml<MultiplyConfig>(configPath);
  const seed = loadYaml<SeedData>(config.seed_file);

  // Prepare CSV writer
  const headers = Object.keys(seed.records[0]).map(key => ({ id: key, title: key }));
  const csvWriter = createObjectCsvWriter({
    path: config.output_file,
    header: headers
  });

  // Generate records in batches
  const batchSize = config.batch_size || 10000;
  let recordsGenerated = 0;

  while (recordsGenerated < config.target_count) {
    const batch: Record<string, any>[] = [];
    const currentBatchSize = Math.min(batchSize, config.target_count - recordsGenerated);

    for (let i = 0; i < currentBatchSize; i++) {
      const record: Record<string, any> = {};
      const context: Record<string, any> = {};

      // Generate each field
      for (const [fieldName, strategy] of Object.entries(config.field_strategies)) {
        const value = generateValue(
          { ...strategy, field_name: fieldName, target_count: config.target_count },
          recordsGenerated + i,
          seed,
          context
        );
        record[fieldName] = value;
        context[fieldName] = value;
      }

      // Apply validations (basic)
      if (config.validations) {
        // Validation logic here if needed
      }

      batch.push(record);
    }

    // Write batch to CSV
    await csvWriter.writeRecords(batch);
    recordsGenerated += batch.length;

    console.log(`  Generated ${recordsGenerated}/${config.target_count} records`);
  }

  console.log(`✓ Completed: ${config.entity} (${recordsGenerated} records)`);
}

// Main: Process all entities
async function main(): Promise<void> {
  const configDir = './eval/performance/configs';
  const configFiles = fs.readdirSync(configDir).filter(f => f.endsWith('_multiply.yaml'));

  console.log(`\nGenerating Performance Test Data...\n`);

  for (const configFile of configFiles) {
    await processEntity(`${configDir}/${configFile}`);
  }

  console.log(`\n✓ All datasets generated successfully\n`);
}

// Execute
main().catch(error => {
  console.error('Generation failed:', error);
  process.exit(1);
});
```

#### 4.2 Create Package Configuration

Generate `eval/performance/scripts/package.json`:

```json
{
  "name": "bmad-eval-performance-generator",
  "version": "1.0.0",
  "description": "Performance dataset generator",
  "scripts": {
    "generate": "ts-node generate.ts"
  },
  "dependencies": {
    "csv-writer": "^1.6.0",
    "js-yaml": "^4.1.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/js-yaml": "^4.0.5",
    "@types/uuid": "^9.0.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.0"
  }
}
```

Generate `eval/performance/scripts/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Execute TypeScript Generation Script

#### 5.1 Install Dependencies

Execute via Bash tool:

```bash
cd eval/performance/scripts && npm install
```

- Wait for installation to complete
- Verify no errors in npm install output

#### 5.2 Run Generation Script

Execute via Bash tool:

```bash
cd eval/performance/scripts && npm run generate
```

**Monitor Output:**
- Track progress: "Generated X/100000 records"
- Verify completion: "✓ Completed: User (100000 records)"
- Check for errors

**Expected Output:**
```
Generating Performance Test Data...

Processing: ./eval/performance/configs/users_multiply.yaml
  Generated 10000/100000 records
  Generated 20000/100000 records
  ...
  Generated 100000/100000 records
✓ Completed: User (100000 records)

Processing: ./eval/performance/configs/products_multiply.yaml
  ...
✓ Completed: Product (100000 records)

✓ All datasets generated successfully
```

#### 5.3 Verify Output Files

Check that CSV files created in `eval/performance/output/`:
- `users_bulk.csv` (100,000 records)
- `products_bulk.csv` (100,000 records)
- `orders_bulk.csv` (100,000 records)
- ... (other entities)

Verify file sizes:
- Typical: 5-20 MB per 100K records (depending on column count)
- Check first few rows for data quality

### 6. Create Performance Test README

#### 6.1 Generate Documentation

Create `eval/performance/README.md`:

```markdown
# Performance Test Datasets

Large-scale bulk datasets for performance, load, and stress testing (100K+ records per entity).

## Contents

- **seeds/**: High-quality seed data (100 records per entity)
- **configs/**: Multiplication configuration files
- **scripts/**: TypeScript generation script
- **output/**: Bulk CSV datasets (100K records)

## Generated Datasets

| Entity | Format | Records | Size | File |
|--------|--------|---------|------|------|
| User | CSV | 100,000 | ~12 MB | users_bulk.csv |
| Product | CSV | 100,000 | ~8 MB | products_bulk.csv |
| Order | CSV | 100,000 | ~15 MB | orders_bulk.csv |
| OrderItem | CSV | 300,000 | ~25 MB | order_items_bulk.csv |

## Data Characteristics

- **Scale**: 100K records per entity
- **Realism**: Realistic distributions (Zipf, normal, categorical)
- **Relationships**: Foreign keys follow power law (80/20 rule)
- **Format**: CSV for efficient loading
- **Quality**: Generated from verified seed data

## Regeneration

To regenerate datasets with different parameters:

1. Modify multiplication config: `eval/performance/configs/{entity}_multiply.yaml`
2. Run generation script:
   ```bash
   cd eval/performance/scripts
   npm run generate
   ```

## Usage Examples

### Load Testing
```bash
# Import to PostgreSQL
psql -d testdb -c "\copy users FROM 'output/users_bulk.csv' CSV HEADER"
```

### Performance Benchmarking
```typescript
// Measure query performance
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

const users = parse(readFileSync('eval/performance/output/users_bulk.csv'), {
  columns: true,
  skip_empty_lines: true
});

console.time('Filter 100K records');
const activeUsers = users.filter(u => u.status === 'active');
console.timeEnd('Filter 100K records');
// Expected: < 100ms
```

### Stress Testing
```bash
# Generate load with Apache Bench
ab -n 10000 -c 100 -T 'application/json' \
  -p payload.json \
  http://localhost:3000/api/users
```

## Distribution Details

### User Entity
- Age: Normal distribution (mean=35, stddev=12)
- Email: Unique, template-based generation
- Created dates: Linear distribution over 2 years
- Updated dates: Derived from created_at + random offset

### Order Entity
- User references: Zipf distribution (20% of users = 80% of orders)
- Status: Weighted categorical (70% delivered, 15% shipped, ...)
- Total: Normal distribution (mean=$150, stddev=$75)
- Created dates: Exponential (more recent orders)

### OrderItem Entity
- Order references: 1-to-many (avg 3 items per order)
- Product references: Zipf distribution (popular products)
- Quantity: Weighted (70% qty=1, 20% qty=2-3, 10% qty=4+)
```

### 7. Validation and Summary

#### 7.1 Validate Generated Data

Sample validation checks:
- Row count matches target (100,000 per entity)
- CSV format valid (parseable, consistent columns)
- Foreign keys exist in reference files
- No duplicates for unique constraints
- Distributions match expected patterns (spot check 1000 random records)

#### 7.2 Generate Summary Report

Present to user:

```
✓ Performance Test Data Generated Successfully

Generation Method: Seed + TypeScript Multiplication
Seed Quality: 100 records per entity
Target Scale: 100,000 records per entity

Files Created:
Seeds:
- eval/performance/seeds/users_seed.yaml (100 records)
- eval/performance/seeds/products_seed.yaml (100 records)
- ... (all entities)

Configs:
- eval/performance/configs/users_multiply.yaml
- eval/performance/configs/products_multiply.yaml
- ... (all entities)

Scripts:
- eval/performance/scripts/generate.ts
- eval/performance/scripts/package.json

Output (Bulk Data):
- eval/performance/output/users_bulk.csv (100,000 records, ~12 MB)
- eval/performance/output/products_bulk.csv (100,000 records, ~8 MB)
- eval/performance/output/orders_bulk.csv (100,000 records, ~15 MB)
- eval/performance/output/order_items_bulk.csv (300,000 records, ~25 MB)

Total Records Generated: 500,000
Total Data Size: ~60 MB

Generation Time: ~8 seconds

Validation:
- CSV Format: ✓ PASSED
- Foreign Keys: ✓ PASSED (sampled)
- Distributions: ✓ PASSED (verified against config)
- Unique Constraints: ✓ PASSED
```

## Error Handling

- **npm install fails**: Check Node.js version (require v18+), retry with --legacy-peer-deps
- **TypeScript errors**: Ensure ts-node installed, check tsconfig.json
- **Out of memory**: Reduce batch_size in multiply config (default 10000 → 5000)
- **Foreign key reference missing**: Ensure parent entity generated before dependent
- **CSV write errors**: Check disk space, file permissions

## Success Criteria

- [ ] Seed data generated (100 records per entity)
- [ ] Multiplication configs created for all entities
- [ ] TypeScript script generated and valid
- [ ] Dependencies installed successfully
- [ ] Script executed without errors
- [ ] Output CSV files created with target record counts
- [ ] CSV files parseable and valid format
- [ ] Foreign keys reference existing records (sampled)
- [ ] Distributions match expected patterns
- [ ] Documentation complete with usage examples
