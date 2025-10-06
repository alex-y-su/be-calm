/**
 * Collaboration Framework Tests
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import CollaborationFramework from '../../bmad-core/orchestration/collaboration.js';

describe('CollaborationFramework', () => {
  let collab;

  beforeEach(async () => {
    collab = new CollaborationFramework();
    await collab.initialize();

    // Mock sendTaskToAgent to return immediate responses
    collab.sendTaskToAgent = jest.fn().mockImplementation(async (agent, task, options) => {
      return {
        success: true,
        result: {
          agent,
          task,
          output: `Result from ${agent}`,
          score: Math.random() * 100
        }
      };
    });
  });

  describe('Initialization', () => {
    it('should initialize successfully', () => {
      expect(collab.collaborationModes).toBeDefined();
      expect(collab.dependencyGraph).toBeDefined();
    });

    it('should build dependency graph', () => {
      expect(collab.dependencyGraph.oracle).toBeDefined();
      expect(collab.dependencyGraph.oracle.depends_on).toEqual([]);
      expect(collab.dependencyGraph.eval.depends_on).toContain('oracle');
    });
  });

  describe('Sequential Execution', () => {
    it('should execute agents sequentially', async () => {
      const result = await collab.executeSequential(
        ['analyst', 'oracle', 'eval'],
        'domain-research',
        { initialInput: 'project brief' }
      );

      expect(result.success).toBe(true);
      expect(result.mode).toBe('sequential');
      expect(result.results).toHaveLength(3);
    });

    it('should pass output between agents', async () => {
      const result = await collab.executeSequential(
        ['agent1', 'agent2'],
        'task'
      );

      // Each agent should have received previous output
      expect(result.final_output).toBeDefined();
    });

    it('should fail on agent error', async () => {
      // Mock agent failure
      collab.sendTaskToAgent = jest.fn()
        .mockResolvedValueOnce({ success: true, result: 'ok' })
        .mockResolvedValueOnce({ success: false, error: 'failed' });

      const result = await collab.executeSequential(
        ['agent1', 'agent2'],
        'task'
      );

      expect(result.success).toBe(false);
      expect(result.failed_at).toBe('agent2');
    });
  });

  describe('Parallel Execution', () => {
    it('should execute agents in parallel', async () => {
      const result = await collab.executeParallel(
        ['oracle', 'eval', 'validator'],
        'validate-artifact'
      );

      expect(result.mode).toBe('parallel');
      expect(result.results.length).toBeGreaterThan(0);
    });

    it('should handle partial failures', async () => {
      collab.sendTaskToAgent = jest.fn()
        .mockResolvedValueOnce({ success: true, result: 'ok' })
        .mockResolvedValueOnce({ success: false, error: 'failed' })
        .mockResolvedValueOnce({ success: true, result: 'ok' });

      const result = await collab.executeParallel(
        ['agent1', 'agent2', 'agent3'],
        'task'
      );

      expect(result.failures.length).toBe(1);
    });
  });

  describe('Collaborative Execution', () => {
    it('should execute collaborative mode', async () => {
      const result = await collab.executeCollaborative(
        'dev',
        'eval',
        'implement-feature'
      );

      expect(result.mode).toBe('collaborative');
      expect(result.primary_result).toBeDefined();
      expect(result.supporting_feedback).toBeDefined();
    });
  });

  describe('Competitive Execution', () => {
    it('should execute competitive mode', async () => {
      const result = await collab.executeCompetitive(
        ['architect1', 'architect2', 'architect3'],
        'design-system'
      );

      expect(result.mode).toBe('competitive');
      expect(result.solutions.length).toBeGreaterThan(0);
      expect(result.winner).toBeDefined();
    });

    it('should score and rank solutions', async () => {
      const result = await collab.executeCompetitive(
        ['agent1', 'agent2'],
        'task'
      );

      expect(result.solutions[0].score).toBeGreaterThanOrEqual(
        result.solutions[1].score
      );
    });
  });

  describe('Dependency Resolution', () => {
    it('should perform topological sort', () => {
      const sorted = collab.topologicalSort(['dev', 'eval', 'oracle']);

      const oracleIndex = sorted.indexOf('oracle');
      const evalIndex = sorted.indexOf('eval');
      const devIndex = sorted.indexOf('dev');

      expect(oracleIndex).toBeLessThan(evalIndex);
      expect(evalIndex).toBeLessThan(devIndex);
    });

    it('should group agents by dependency level', () => {
      const sorted = collab.topologicalSort(['dev', 'eval', 'oracle', 'validator']);
      const levels = collab.groupByDependencyLevel(sorted);

      // Oracle has no dependencies (level 0)
      expect(levels[0]).toContain('oracle');

      // Eval depends on Oracle (level 1)
      expect(levels[1]).toContain('eval');
    });

    it('should execute with dependencies', async () => {
      const result = await collab.executeWithDependencies(
        ['dev', 'eval', 'oracle'],
        'task'
      );

      expect(result.success).toBe(true);
      expect(result.execution_order).toBeDefined();
    });
  });

  describe('Conflict Resolution', () => {
    it('should resolve conflicts by priority', async () => {
      const resolution = await collab.resolveConflict({
        agents: ['oracle', 'validator'],
        issue: 'disagreement',
        contexts: {
          oracle: { confidence: 0.9 },
          validator: { confidence: 0.8 }
        }
      });

      expect(resolution.resolved).toBeDefined();
      expect(resolution.winner).toBe('oracle'); // Higher priority
    });

    it('should escalate low-confidence conflicts', async () => {
      const resolution = await collab.resolveConflict({
        agents: ['dev', 'qa'],
        issue: 'disagreement',
        contexts: {
          dev: { confidence: 0.5 },
          qa: { confidence: 0.4 }
        }
      });

      expect(resolution.escalated).toBe(true);
    });
  });

  describe('Handoffs', () => {
    it('should perform explicit handoff', async () => {
      const result = await collab.handoff(
        'analyst',
        'oracle',
        { domainAnalysis: 'data' }
      );

      expect(result.success).toBe(true);
      expect(result.from).toBe('analyst');
      expect(result.to).toBe('oracle');
    });

    it('should validate handoff data if requested', async () => {
      const result = await collab.handoff(
        'agent1',
        'agent2',
        { data: 'test' },
        { validate: true }
      );

      expect(result).toBeDefined();
    });
  });

  describe('Message Bus', () => {
    it('should send and receive messages', async () => {
      const messageBus = collab.messageBus;

      const message = {
        type: 'task_request',
        from: 'test',
        to: 'oracle',
        payload: { task_id: 'test-123', task: 'validate' }
      };

      const responsePromise = messageBus.send(message, 1000);

      // Simulate response
      messageBus.emit('task-response', {
        payload: {
          task_id: 'test-123',
          status: 'complete',
          result: { valid: true }
        }
      });

      const response = await responsePromise;
      expect(response.status).toBe('complete');
    });

    it('should timeout on no response', async () => {
      const messageBus = collab.messageBus;

      const message = {
        type: 'task_request',
        from: 'test',
        to: 'oracle',
        payload: { task_id: 'timeout-test', task: 'validate' }
      };

      await expect(
        messageBus.send(message, 100)
      ).rejects.toThrow('Message timeout');
    });
  });

  describe('Status', () => {
    it('should get framework status', () => {
      const status = collab.getStatus();

      expect(status.active_collaborations).toBeDefined();
      expect(status.message_bus_status).toBeDefined();
    });

    it('should track active collaborations', async () => {
      // Start collaboration (don't await)
      collab.executeParallel(['agent1', 'agent2'], 'task');

      const active = collab.getActiveCollaborations();
      // May or may not have active (depends on timing)
      expect(Array.isArray(active)).toBe(true);
    });
  });
});
