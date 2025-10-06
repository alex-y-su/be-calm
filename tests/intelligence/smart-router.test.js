/**
 * Smart Router Unit Tests
 */

import SmartRouter from '../../bmad-core/intelligence/smart-router.js';

describe('SmartRouter', () => {
  let router;

  beforeEach(() => {
    router = new SmartRouter();
  });

  describe('Intent Parsing', () => {
    test('should extract create intent', () => {
      const intents = router.extractIntents('create a prd for authentication');
      expect(intents).toContain('create');
    });

    test('should extract validate intent', () => {
      const intents = router.extractIntents('validate the architecture document');
      expect(intents).toContain('validate');
    });

    test('should extract fix intent', () => {
      const intents = router.extractIntents('fix the failing test');
      expect(intents).toContain('fix');
    });

    test('should extract multiple intents', () => {
      const intents = router.extractIntents('create and validate the prd');
      expect(intents).toContain('create');
      expect(intents).toContain('validate');
    });
  });

  describe('Entity Extraction', () => {
    test('should extract PRD entity', () => {
      const entities = router.extractEntities('create a prd document');
      expect(entities).toContain('prd');
    });

    test('should extract architecture entity', () => {
      const entities = router.extractEntities('validate the architecture');
      expect(entities).toContain('architecture');
    });

    test('should extract multiple entities', () => {
      const entities = router.extractEntities('create prd and architecture documents');
      expect(entities).toContain('prd');
      expect(entities).toContain('architecture');
    });
  });

  describe('Routing', () => {
    test('should route create PRD to PM agent', async () => {
      const routing = await router.route('create a PRD for user authentication');

      const pmAgent = routing.agents.find(a => a.agent === 'pm');
      expect(pmAgent).toBeDefined();
      expect(pmAgent.finalRole).toBe('primary');
    });

    test('should route validate to Oracle', async () => {
      const routing = await router.route('validate the architecture document');

      const oracleAgent = routing.agents.find(a => a.agent === 'oracle');
      expect(oracleAgent).toBeDefined();
      expect(oracleAgent.finalRole).toBe('primary');
    });

    test('should route fix bug to Dev and Reflection', async () => {
      const routing = await router.route('fix the authentication bug');

      const devAgent = routing.agents.find(a => a.agent === 'dev');
      const reflectionAgent = routing.agents.find(a => a.agent === 'reflection');

      expect(devAgent).toBeDefined();
      expect(reflectionAgent).toBeDefined();
    });

    test('should include context in routing decision', async () => {
      const routing = await router.route('create tests', {
        currentPhase: 'development'
      });

      expect(routing.agents.length).toBeGreaterThan(0);
    });
  });

  describe('Confidence Scoring', () => {
    test('should have high confidence for clear intent', async () => {
      const routing = await router.route('create a PRD for authentication');

      expect(routing.confidence).toBeGreaterThan(0.7);
    });

    test('should have lower confidence for vague intent', async () => {
      const routing = await router.route('make it better');

      expect(routing.confidence).toBeLessThan(0.7);
    });
  });

  describe('Learning', () => {
    test('should record routing in history', async () => {
      await router.route('create a PRD');

      expect(router.routingHistory.length).toBe(1);
    });

    test('should update routing outcome', () => {
      router.routingHistory.push({
        input: 'create prd',
        agents: 'pm',
        outcome: null
      });

      router.updateRoutingOutcome(0, 'success');

      expect(router.routingHistory[0].outcome).toBe('success');
    });

    test('should learn from successful outcomes', () => {
      router.routingHistory.push({
        input: 'create prd',
        agents: 'pm',
        outcome: null
      });

      router.updateRoutingOutcome(0, 'success');

      expect(router.patterns.size).toBeGreaterThan(0);
    });
  });

  describe('Statistics', () => {
    test('should calculate routing statistics', () => {
      router.routingHistory = [
        { outcome: 'success', confidence: 0.9 },
        { outcome: 'success', confidence: 0.8 },
        { outcome: 'failure', confidence: 0.6 }
      ];

      const stats = router.getStatistics();

      expect(stats.totalRoutings).toBe(3);
      expect(stats.successful).toBe(2);
      expect(stats.successRate).toBeCloseTo(0.67, 1);
    });
  });

  describe('Pattern-Based Routing', () => {
    test('should detect repeated failures pattern', async () => {
      const routing = await router.route('fix issue', {
        recentFailures: ['eval-fail', 'eval-fail', 'eval-fail']
      });

      const reflectionAgent = routing.agents.find(a => a.agent === 'reflection');
      expect(reflectionAgent).toBeDefined();
    });
  });

  describe('Export/Import', () => {
    test('should export routing data', () => {
      router.routingHistory = [{ input: 'test', agents: 'pm' }];
      router.patterns.set('test', { strength: 0.8 });

      const data = router.exportData();

      expect(data.history).toBeDefined();
      expect(data.patterns).toBeDefined();
      expect(data.statistics).toBeDefined();
    });

    test('should import routing data', () => {
      const data = {
        history: [{ input: 'test', agents: 'pm' }],
        patterns: [['test', { strength: 0.8 }]]
      };

      router.importData(data);

      expect(router.routingHistory.length).toBe(1);
      expect(router.patterns.size).toBe(1);
    });
  });
});
