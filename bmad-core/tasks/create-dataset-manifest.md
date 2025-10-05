<!-- Powered by BMAD™ Core -->

# Create Dataset Manifest Task

## Purpose

To generate a comprehensive master manifest documenting all evaluation datasets, their purpose, structure, and usage. Provides QA agents and developers with complete dataset inventory and integration guidelines.

## Input Parameters

- `domain_context`: Domain analysis results
- `all_datasets`: All generated datasets metadata

## Manifest Structure

```yaml
eval_dataset_manifest:
  version: 1.0.0
  generated_at: 2024-01-15T14:00:00Z
  domain: [domain_type]

  summary:
    total_entities: [count]
    total_records: [count]
    total_size: [MB]

  datasets:
    unit:
      location: eval/unit/
      purpose: Unit testing (happy paths, common scenarios)
      record_count: [count]
      format: YAML

    integration:
      location: eval/integration/
      purpose: Integration testing (workflows, multi-entity)
      record_count: [count]
      format: YAML

    performance:
      location: eval/performance/
      purpose: Performance/load testing
      record_count: [count]
      format: CSV

    edge_cases:
      location: eval/unit/edge-cases/
      purpose: Negative testing (boundaries, errors)
      test_cases: [count]
      format: YAML

  entities:
    - name: User
      schema: eval/schemas/users.yaml
      datasets:
        unit: eval/unit/entities/users.yaml (50 records)
        integration: eval/integration/workflows/*.yaml
        performance: eval/performance/output/users_bulk.csv (100K records)

  qa_handoff:
    test_assertions: eval/validation/test-assertions.yaml
    expected_results: eval/validation/expected-results.yaml
    usage_guide: eval/README.md
```

## Execution

1. Collect metadata from all generated datasets
2. Generate master manifest at `eval/manifest.yaml`
3. Create root README at `eval/README.md`
4. Present summary to user

## Success Criteria

- [ ] Master manifest complete with all datasets
- [ ] Entity inventory accurate
- [ ] QA handoff documentation included
- [ ] Usage instructions clear
