# Stage 6 Tests

Test suite for Stage 6: Configuration & Deployment components.

## Running Tests

```bash
# Run all Stage 6 tests
npm test tests/stage6/

# Run specific test file
npm test tests/stage6/integration.test.js

# Run with coverage
npm test -- --coverage tests/stage6/
```

## Test Structure

```
tests/stage6/
├── README.md                      # This file
├── integration.test.js            # Integration tests
├── configuration.test.js          # Configuration system tests (TODO)
├── metrics.test.js                # Metrics collection tests (TODO)
├── dashboard.test.js              # Dashboard tests (TODO)
├── safety.test.js                 # Safety systems tests (TODO)
├── cli.test.js                    # CLI command tests (TODO)
├── notifications.test.js          # Notification system tests (TODO)
├── health.test.js                 # Health check tests (TODO)
└── migration.test.js              # Migration tool tests (TODO)
```

## Test Categories

### 1. Integration Tests (`integration.test.js`) ✅

Tests the complete Stage 6 integration:
- System initialization
- Component wiring
- Event handling
- Cross-component interactions

### 2. Configuration Tests (TODO)

Should test:
- Loading/saving configurations
- Validation rules
- Runtime overrides
- Autonomy level changes
- Configuration migration

### 3. Metrics Tests (TODO)

Should test:
- Metric recording (single and batch)
- Statistics calculation
- Alert triggering
- Storage and retrieval
- Export functionality
- Cleanup and retention

### 4. Dashboard Tests (TODO)

Should test:
- Server startup/shutdown
- API endpoints
- Data accuracy
- Real-time updates
- Multiple client connections

### 5. Safety Tests (TODO)

Should test:
- Emergency stop execution
- State preservation
- Resume functionality
- Rollback system
- Checkpoint creation
- Safe mode activation
- Audit logging

### 6. CLI Tests (TODO)

Should test:
- Command parsing
- User prompts
- Error handling
- Integration with systems
- Output formatting

### 7. Notification Tests (TODO)

Should test:
- Multi-channel delivery
- Notification levels
- Quiet hours
- Channel preferences
- Event triggering

### 8. Health Check Tests (TODO)

Should test:
- All 11 health checks
- Score calculation
- Status categorization
- Periodic scheduling
- Failure handling

### 9. Migration Tests (TODO)

Should test:
- v4 → v6 migration
- v5 → v6 migration
- Backup creation
- Rollback functionality
- File transformations

## Test Coverage Goals

- **Unit Tests**: 90%+ coverage for individual components
- **Integration Tests**: 80%+ coverage for cross-component interactions
- **E2E Tests**: Key workflows tested end-to-end

## Writing Tests

### Example Test Structure

```javascript
describe('ComponentName', () => {
  let component;

  beforeEach(async () => {
    // Setup
    component = await setupComponent();
  });

  afterEach(async () => {
    // Cleanup
    await component.cleanup();
  });

  describe('Feature', () => {
    test('should do something', async () => {
      // Arrange
      const input = { test: 'data' };

      // Act
      const result = await component.doSomething(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});
```

## Test Utilities

Create test utilities in `tests/stage6/utils/`:
- Mock configuration
- Mock metrics data
- Test fixtures
- Helper functions

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main
- Release branches

## Known Issues

- Tests currently use real file system (consider mocking)
- Some async operations may need longer timeouts
- Dashboard tests need headless browser setup

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure >90% coverage
3. Update this README
4. Run all tests before committing

## Resources

- Jest Documentation: https://jestjs.io/docs/getting-started
- Testing Best Practices: See `/docs/testing-guide.md`
- Stage 6 Documentation: See `/docs/stage-6-user-guide.md`
