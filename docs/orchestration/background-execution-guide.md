# Background Execution Guide

**Component:** Background Agent Execution System v2.0
**File:** `bmad-core/orchestration/background-executor.js`

## Purpose

The Background Executor manages background execution of agents without blocking the main workflow, with concurrency management, resource monitoring, and result aggregation.

## Execution Modes

### 1. Fire-and-Forget
Start agent, don't wait for result.

**Use Case:** Monitoring, logging, non-critical tasks

```javascript
const { executionId } = await bg.fireAndForget(
  'monitor',
  'track-metrics',
  { priority: 'low' }
);
```

**Characteristics:**
- No blocking
- Result saved when complete
- Best for independent tasks

### 2. Async with Callback
Start agent, callback when done.

**Use Case:** Background processing with notification

```javascript
await bg.executeWithCallback(
  'eval',
  'generate-test-datasets',
  (err, result) => {
    if (err) {
      console.error('Failed:', err);
    } else {
      console.log('Tests generated:', result);
    }
  },
  { priority: 'medium' }
);
```

**Characteristics:**
- Non-blocking
- Callback on completion
- Error handling via callback

### 3. Watched Background
Start agent, periodic status updates.

**Use Case:** Long-running tasks with progress tracking

```javascript
const { executionId } = await bg.executeWatched(
  'qa',
  'run-full-test-suite',
  { priority: 'high' }
);

// Get status periodically
const status = bg.getExecutionStatus(executionId);
console.log(`Progress: ${status.progress}%`);
```

**Characteristics:**
- Non-blocking
- Progress updates
- Status queries

## Priority Queue

Executions prioritized by level:

```javascript
{
  critical: 5,    // Eval test execution (blocking commits)
  high: 4,        // Oracle validation (blocking artifacts)
  medium: 3,      // Validator traceability checks
  low: 2,         // Monitor metrics collection
  background: 1   // QA supplemental tests
}
```

Higher priority executions run first.

## Concurrency Management

Configure concurrency:

```javascript
const bg = new BackgroundExecutor({
  maxConcurrentAgents: 5,
  maxCpuPercent: 80,
  maxMemoryMb: 2048,
  throttleIfExceeded: true
});
```

**Limits:**
- Max concurrent agents
- CPU threshold
- Memory threshold
- Auto-throttle when exceeded

## Resource Monitoring

Built-in resource monitor:

```javascript
const resources = bg.resourceMonitor.getStatus();

console.log(`CPU: ${resources.cpu}%`);
console.log(`Memory: ${resources.memory}MB`);
console.log(`Free: ${resources.free_memory}MB`);
```

Monitor events:

```javascript
bg.resourceMonitor.on('threshold-exceeded', (data) => {
  console.log('Resource threshold exceeded:', data);
  // Auto-throttle if enabled
});
```

## Result Aggregation

Execute multiple agents and aggregate results:

```javascript
const result = await bg.executeMultiple(
  ['oracle', 'eval', 'validator'],
  'validate-artifact',
  { artifact: 'prd.md', priority: 'high' }
);

console.log('Success rate:', result.report.success_rate);
console.log('Average duration:', result.report.average_duration);
```

**Aggregation Report:**
```javascript
{
  total: 3,
  successful: 3,
  failed: 0,
  success_rate: 100,
  total_duration: 4500,
  average_duration: 1500,
  consistency: { consistent: true }
}
```

## Execution Status

Check execution status:

```javascript
const status = bg.getExecutionStatus(executionId);

if (status.found) {
  console.log('Status:', status.status);
  console.log('Progress:', status.progress);
  console.log('Duration:', status.duration);

  if (status.result) {
    console.log('Result:', status.result);
  }
}
```

**Status Values:**
- `queued` - In priority queue
- `running` - Currently executing
- `completed` - Finished successfully
- `failed` - Execution failed
- `cancelled` - Cancelled by user

## Queue Management

View queue status:

```javascript
const queue = bg.getQueueStatus();

console.log(`Queued: ${queue.queued}`);
console.log(`Running: ${queue.running}/${queue.max_concurrent}`);

queue.queue.forEach(item => {
  console.log(`- ${item.agent}: ${item.priority}`);
});
```

Get active executions:

```javascript
const active = bg.getActiveExecutions();

active.forEach(exec => {
  console.log(`${exec.agent}: ${exec.progress}%`);
});
```

## Cancellation

Cancel running execution:

```javascript
const result = await bg.cancelExecution(executionId);

if (result.success) {
  console.log('Execution cancelled');
} else {
  console.log('Cannot cancel:', result.error);
}
```

Only running executions can be cancelled.

## Events

```javascript
// Execution lifecycle
bg.on('execution-started', (data) => {});
bg.on('execution-completed', (data) => {});
bg.on('execution-failed', (data) => {});
bg.on('execution-cancelled', (data) => {});

// Queue events
bg.on('execution-queued', (data) => {});
bg.on('queue-throttled', (data) => {});

// Progress events (watched mode)
bg.on('progress-update', (data) => {});

// Aggregation events
bg.on('aggregation-started', (data) => {});
bg.on('aggregation-completed', (data) => {});

// Resource events
bg.on('resource-threshold-exceeded', (data) => {});
```

## Configuration

Configure in constructor:

```javascript
const bg = new BackgroundExecutor({
  maxConcurrentAgents: 5,
  maxCpuPercent: 80,
  maxMemoryMb: 2048,
  throttleIfExceeded: true,
  priorityLevels: {
    critical: 5,
    high: 4,
    medium: 3,
    low: 2,
    background: 1
  }
});
```

## API Reference

### Initialize
```javascript
const bg = new BackgroundExecutor(config);
await bg.initialize();
```

### Fire-and-Forget
```javascript
const { executionId } = await bg.fireAndForget(agent, task, options);
```

### Async with Callback
```javascript
await bg.executeWithCallback(agent, task, callback, options);
```

### Watched Execution
```javascript
const { executionId } = await bg.executeWatched(agent, task, options);
```

### Execute Multiple
```javascript
const result = await bg.executeMultiple(agents, task, options);
```

### Get Execution Status
```javascript
const status = bg.getExecutionStatus(executionId);
```

### Cancel Execution
```javascript
const result = await bg.cancelExecution(executionId);
```

### Get Queue Status
```javascript
const queue = bg.getQueueStatus();
```

### Get Active Executions
```javascript
const active = bg.getActiveExecutions();
```

### Get Status
```javascript
const status = bg.getStatus();
```

### Shutdown
```javascript
await bg.shutdown();
```

## Best Practices

1. **Choose right mode**: Match execution mode to use case
2. **Set appropriate priority**: Critical tasks get higher priority
3. **Monitor resources**: Watch CPU/memory usage
4. **Handle failures**: Implement error callbacks
5. **Limit concurrency**: Don't overwhelm system
6. **Track progress**: Use watched mode for long tasks
7. **Clean up**: Shutdown executor when done

## Example Integration

```javascript
import BackgroundExecutor from './bmad-core/orchestration/background-executor.js';

const bg = new BackgroundExecutor({
  maxConcurrentAgents: 5,
  maxCpuPercent: 80
});

await bg.initialize();

// Continuous monitoring (fire-and-forget)
await bg.fireAndForget('monitor', 'track-metrics', {
  priority: 'background'
});

// Generate tests with notification
await bg.executeWithCallback(
  'eval',
  'generate-tests',
  (err, result) => {
    if (!err) {
      console.log('Tests ready:', result.tests.length);
    }
  },
  { priority: 'medium' }
);

// Long-running QA with progress
const { executionId } = await bg.executeWatched(
  'qa',
  'run-full-suite',
  { priority: 'high' }
);

bg.on('progress-update', ({ executionId: id, progress }) => {
  if (id === executionId) {
    console.log(`QA Progress: ${progress}%`);
  }
});

// Parallel validation
const validation = await bg.executeMultiple(
  ['oracle', 'eval', 'validator'],
  'validate-prd',
  { artifact: 'prd.md', priority: 'critical' }
);

console.log(`Validation: ${validation.report.success_rate}% passed`);

// Monitor resources
bg.on('resource-threshold-exceeded', ({ cpu, memory }) => {
  console.log(`Resources high - CPU: ${cpu}%, Memory: ${memory}MB`);
});

// Cleanup on exit
process.on('SIGINT', async () => {
  await bg.shutdown();
  process.exit(0);
});
```

## Troubleshooting

### Queue not processing
- Check concurrency: `bg.getQueueStatus()`
- Check resources: `bg.resourceMonitor.getStatus()`
- Verify throttling not active

### High resource usage
- Reduce `maxConcurrentAgents`
- Lower priority of background tasks
- Enable throttling

### Executions timing out
- Increase timeout in options
- Check agent implementation
- Review resource availability

## Integration with Orchestrator

Background executor integrates with orchestrator for parallel validation:

```javascript
orchestrator.on('artifact-created', async ({ artifact }) => {
  // Validate in background
  await bg.executeMultiple(
    ['oracle', 'eval', 'validator'],
    'validate-artifact',
    { artifact, priority: 'high' }
  );
});
```

See [Orchestration System Guide](./orchestration-system-guide.md) for complete integration.
