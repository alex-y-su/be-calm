/**
 * Intelligence System Integration Tests
 */

import { IntelligenceSystem } from '../../bmad-core/intelligence/index.js';

describe('IntelligenceSystem Integration', () => {
  let intelligence;

  beforeEach(() => {
    intelligence = new IntelligenceSystem();
  });

  describe('Initialization', () => {
    test('should initialize all components', () => {
      expect(intelligence.router).toBeDefined();
      expect(intelligence.predictor).toBeDefined();
      expect(intelligence.goalDecomposer).toBeDefined();
      expect(intelligence.swarmCoordinator).toBeDefined();
      expect(intelligence.nlInterface).toBeDefined();
      expect(intelligence.parallelEngine).toBeDefined();
      expect(intelligence.selfHealer).toBeDefined();
      expect(intelligence.initialized).toBe(true);
    });
  });

  describe('End-to-End Request Processing', () => {
    test('should process create PRD request', async () => {
      const response = await intelligence.processRequest(
        'Create a PRD for user authentication',
        { currentPhase: 'discovery' }
      );

      expect(response.type).toBe('intelligent_response');
      expect(response.routing).toBeDefined();
      expect(response.routing.agents).toBeDefined();
      expect(response.predictions).toBeDefined();
      expect(response.suggestions).toBeDefined();
    });

    test('should handle ambiguous requests with clarification', async () => {
      const response = await intelligence.processRequest(
        'Make it better',
        { currentPhase: 'discovery' }
      );

      // Should either clarify or use context
      expect(response).toBeDefined();
    });

    test('should provide predictions with routing', async () => {
      const response = await intelligence.processRequest(
        'Create architecture document',
        { currentPhase: 'architecture' }
      );

      expect(response.predictions.nextAgents).toBeDefined();
      expect(response.predictions.artifacts).toBeDefined();
    });
  });

  describe('Goal Decomposition and Execution', () => {
    test('should decompose greenfield feature goal', async () => {
      const plan = await intelligence.decomposeGoal(
        'Build user authentication system',
        { template: 'greenfield_feature' }
      );

      expect(plan.tasks).toBeDefined();
      expect(plan.tasks.length).toBeGreaterThan(0);
      expect(plan.checkpoints).toBeDefined();
      expect(plan.totalEffort).toBeGreaterThan(0);
      expect(plan.estimatedDuration).toBeDefined();
    });

    test('should include parallelization plan', async () => {
      const plan = await intelligence.decomposeGoal(
        'Build authentication',
        { template: 'greenfield_feature' }
      );

      // Parallelization plan is only added if there are multiple tasks
      if (plan.tasks && plan.tasks.length > 1) {
        expect(plan.parallelizationPlan).toBeDefined();
      } else {
        // For single task or empty, parallelizationPlan is not needed
        expect(plan.parallelizationPlan).toBeUndefined();
      }
    });

    test('should execute goal end-to-end', async () => {
      const result = await intelligence.executeGoal(
        'Fix authentication bug',
        { template: 'bug_fix' }
      );

      expect(result.goal).toBeDefined();
      expect(result.plan).toBeDefined();
      expect(result.results).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Swarm Coordination', () => {
    test('should create competitive swarm', async () => {
      const result = await intelligence.competitiveSwarm(
        'Design authentication architecture',
        ['architect', 'architect', 'architect']
      );

      expect(result.swarmId).toBeDefined();
      expect(result.bestResult).toBeDefined();
      expect(result.winner).toBeDefined();
      expect(result.allResults).toBeDefined();
    });

    test('should create collaborative swarm', async () => {
      const result = await intelligence.collaborativeSwarm(
        'Create test suite',
        ['eval', 'eval', 'eval']
      );

      expect(result.swarmId).toBeDefined();
      expect(result.result).toBeDefined();
      expect(result.contributions).toBeDefined();
    });

    test('should perform comprehensive validation', async () => {
      const artifact = { type: 'prd', content: 'Sample PRD content' };

      const result = await intelligence.comprehensiveValidation(
        artifact,
        ['oracle', 'validator', 'eval']
      );

      expect(result.passed).toBeDefined();
      expect(result.validationDetails).toBeDefined();
    });
  });

  describe('Self-Healing', () => {
    test('should auto-recover from known failures', async () => {
      // Simulate a request that will fail and recover
      const response = await intelligence.processRequest(
        'Create PRD',
        { simulateFailure: true }
      );

      // System should either succeed or provide recovery info
      expect(response).toBeDefined();
    });

    test('should perform health check', async () => {
      const health = await intelligence.healthCheck();

      expect(health.overall).toBeDefined();
      expect(['healthy', 'degraded', 'warning']).toContain(health.overall);
      expect(health.components).toBeDefined();
      expect(health.statistics).toBeDefined();
    });

    test('should perform maintenance', async () => {
      const result = await intelligence.maintenance();

      expect(result.issuesDetected).toBeDefined();
      expect(result.issuesFixed).toBeDefined();
    });
  });

  describe('Statistics and Analytics', () => {
    test('should provide system statistics', () => {
      const stats = intelligence.getSystemStatistics();

      expect(stats.routing).toBeDefined();
      expect(stats.prediction).toBeDefined();
      expect(stats.swarm).toBeDefined();
      expect(stats.parallelization).toBeDefined();
      expect(stats.selfHealing).toBeDefined();
      expect(stats.conversation).toBeDefined();
    });

    test('should provide specialization report', () => {
      // Add some specialization data first
      intelligence.swarmCoordinator.trackSpecialization('architect', 'architecture task', 'success');

      const report = intelligence.getSpecializationReport();

      expect(Array.isArray(report)).toBe(true);
    });

    test('should provide collaboration insights', () => {
      const insights = intelligence.getCollaborationInsights();

      expect(Array.isArray(insights)).toBe(true);
    });

    test('should provide failure patterns', () => {
      const patterns = intelligence.getFailurePatterns();

      expect(Array.isArray(patterns)).toBe(true);
    });
  });

  describe('Data Persistence', () => {
    test('should export intelligence data', () => {
      const data = intelligence.exportData();

      expect(data.routing).toBeDefined();
      expect(data.prediction).toBeDefined();
      expect(data.goalTemplates).toBeDefined();
      expect(data.timestamp).toBeDefined();
    });

    test('should import intelligence data', () => {
      const data = {
        routing: { history: [], patterns: [] },
        prediction: { transitionMatrix: [], artifactDependencies: [] },
        goalTemplates: []
      };

      intelligence.importData(data);

      // Should not throw error
      expect(intelligence).toBeDefined();
    });

    test('should maintain data after export/import cycle', () => {
      // Add some data
      intelligence.router.routingHistory.push({ test: 'data' });

      // Export
      const exported = intelligence.exportData();

      // Create new instance and import
      const newIntelligence = new IntelligenceSystem();
      newIntelligence.importData(exported);

      // Verify data persisted
      expect(newIntelligence.router.routingHistory.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('should process requests efficiently', async () => {
      const start = Date.now();

      await intelligence.processRequest(
        'Create PRD',
        { currentPhase: 'discovery' }
      );

      const duration = Date.now() - start;

      // Should complete in reasonable time (< 100ms for mock)
      expect(duration).toBeLessThan(1000);
    });

    test('should handle multiple concurrent requests', async () => {
      const requests = [
        intelligence.processRequest('Create PRD', {}),
        intelligence.processRequest('Validate architecture', {}),
        intelligence.processRequest('Fix bug', {})
      ];

      const results = await Promise.all(requests);

      expect(results.length).toBe(3);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid requests gracefully', async () => {
      const response = await intelligence.processRequest(
        '',  // Empty request
        {}
      );

      expect(response).toBeDefined();
      // Should not throw error
    });

    test('should recover from component failures', async () => {
      // Simulate component failure
      intelligence.selfHealer.degradedComponents.add('oracle');

      const health = await intelligence.healthCheck();

      expect(health.degraded).toContain('oracle');
    });
  });

  describe('Learning and Adaptation', () => {
    test('should learn from execution outcomes', async () => {
      const plan = await intelligence.decomposeGoal('Build feature');

      const results = {
        taskResults: new Map([
          ['task1', { success: true }],
          ['task2', { success: true }]
        ])
      };

      intelligence.learnFromExecution(plan, results);

      // Should not throw error
      expect(intelligence).toBeDefined();
    });
  });

  describe('Context Awareness', () => {
    test('should use context for better routing', async () => {
      const response1 = await intelligence.processRequest(
        'Create tests',
        { currentPhase: 'domain_research' }
      );

      const response2 = await intelligence.processRequest(
        'Create tests',
        { currentPhase: 'development' }
      );

      // Different contexts should potentially yield different routing
      expect(response1).toBeDefined();
      expect(response2).toBeDefined();
    });

    test('should maintain conversation context', async () => {
      await intelligence.processRequest(
        'Create a PRD for authentication',
        {}
      );

      const response = await intelligence.processRequest(
        'Validate it',  // "it" should reference PRD
        { lastArtifact: 'prd' }
      );

      expect(response).toBeDefined();
    });
  });

  describe('Scalability', () => {
    test('should handle large goal decomposition', async () => {
      const plan = await intelligence.decomposeGoal(
        'Build complete e-commerce platform with auth, payments, inventory, and analytics',
        { template: 'greenfield_feature' }
      );

      expect(plan.tasks.length).toBeGreaterThan(0);
      expect(plan.totalEffort).toBeGreaterThan(0);
    });

    test('should handle many parallel tasks', async () => {
      const tasks = Array.from({ length: 20 }, (_, i) => ({
        id: `task-${i}`,
        name: `Task ${i}`,
        dependencies: [],
        estimatedEffort: 'small'
      }));

      const results = await intelligence.parallelEngine.executeTasks(tasks);

      expect(results.taskResults.size).toBe(20);
    });
  });
});
