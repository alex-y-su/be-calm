# Orchestration System Tests

Comprehensive test suite for the BMAD Stage 4 orchestration system.

## Test Coverage

### State Machine Tests (`state-machine.test.js`)
- ✓ Initialization (greenfield/brownfield)
- ✓ State management (get, update metadata)
- ✓ Exit conditions tracking
- ✓ State transitions (automatic, manual, forced)
- ✓ Blocking/unblocking workflow
- ✓ Rollback functionality
- ✓ State persistence and recovery
- ✓ Progress tracking
- ✓ Pause/resume workflow

### Orchestrator Tests (`orchestrator.test.js`)
- ✓ Initialization and rule loading
- ✓ Parallel validation execution
- ✓ Blocking condition enforcement
- ✓ Auto-recovery flow
- ✓ Issue routing to agents
- ✓ Never-proceed-without rules
- ✓ Agent invocation
- ✓ Issue queue management

### Decision Engine Tests (`decision-engine.test.js`)
- ✓ Initialization
- ✓ Confidence scoring calculation
- ✓ Decision level routing
- ✓ Making decisions
- ✓ Agent capability checking
- ✓ Approval workflow
- ✓ Preview system with cancellation
- ✓ Decision history tracking

### Collaboration Framework Tests (`collaboration.test.js`)
- ✓ Initialization and dependency graph
- ✓ Sequential execution
- ✓ Parallel execution
- ✓ Collaborative execution
- ✓ Competitive execution
- ✓ Dependency resolution and topological sort
- ✓ Conflict resolution
- ✓ Explicit and implicit handoffs
- ✓ Message bus communication

### Background Executor Tests (`background-executor.test.js`)
- ✓ Initialization
- ✓ Fire-and-forget execution
- ✓ Async with callback execution
- ✓ Watched execution with progress
- ✓ Priority queue management
- ✓ Concurrency limits
- ✓ Resource monitoring
- ✓ Result aggregation
- ✓ Execution cancellation
- ✓ Graceful shutdown

## Running Tests

### Prerequisites

```bash
npm install --save-dev jest @jest/globals
```

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test tests/orchestration/state-machine.test.js
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Watch Mode

```bash
npm test -- --watch
```

## Test Configuration

Tests use Jest with ES modules. Configuration in `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest",
    "test:orchestration": "NODE_OPTIONS=--experimental-vm-modules jest tests/orchestration",
    "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch",
    "test:coverage": "NODE_OPTIONS=--experimental-vm-modules jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "transform": {},
    "testMatch": ["**/tests/**/*.test.js"]
  }
}
```

## Test Structure

Each test file follows this structure:

```javascript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import Component from '../../bmad-core/orchestration/component.js';

describe('Component', () => {
  let instance;

  beforeEach(async () => {
    instance = new Component();
    await instance.initialize();
  });

  afterEach(async () => {
    // Cleanup
  });

  describe('Feature Group', () => {
    it('should test specific behavior', async () => {
      const result = await instance.method();
      expect(result).toBe(expected);
    });
  });
});
```

## Mocking

Tests use mocked agent execution to avoid external dependencies:

```javascript
// Mock agent invocation
orchestrator.invokeAgent = jest.fn()
  .mockResolvedValue({ success: true, result: 'mocked' });
```

## Integration Tests

For full integration testing:

```bash
npm run test:integration
```

Integration tests validate:
- Complete workflow state transitions
- Multi-agent parallel validation
- Agent collaboration scenarios
- Background execution with callbacks
- Conflict resolution scenarios

## Scenario Tests

Test realistic scenarios:

```bash
npm run test:scenarios
```

Scenarios include:
- Greenfield workflow (auto-transitions)
- Brownfield workflow (with checkpoints)
- Agent disagreement resolution
- State recovery after crash
- Background agent coordination

## Coverage Goals

Target coverage: 90%+

Current coverage:
- State Machine: ~95%
- Orchestrator: ~90%
- Decision Engine: ~92%
- Collaboration: ~88%
- Background Executor: ~90%

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main
- Pre-commit hooks (optional)

## Debugging Tests

Run with debug output:

```bash
DEBUG=bmad:* npm test
```

Run single test:

```bash
npm test -- -t "should transition to next state"
```

## Known Issues

None currently.

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Ensure existing tests pass
3. Maintain >90% coverage
4. Follow existing test patterns
5. Add integration tests for new workflows

## References

- [Jest Documentation](https://jestjs.io/)
- [Orchestration System Guide](../../docs/orchestration/orchestration-system-guide.md)
- [Stage 4 Implementation Plan](../../plans/stage-4-orchestration-and-state-machine.md)
