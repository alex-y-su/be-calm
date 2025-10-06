/**
 * Validation Gates
 *
 * Implements the multi-gate validation system for story completion:
 * - Gate 0: Regression (brownfield only)
 * - Gate 1: Eval tests
 * - Gate 2: Oracle validation
 * - Gate 3: Validator traceability
 * - Gate 4: Monitor metrics
 * - Gate 5: Compatibility (brownfield only)
 * - Gate 6: QA supplemental
 */

export class ValidationGates {
  constructor(stateMachine, agentRegistry, validators) {
    this.stateMachine = stateMachine;
    this.agentRegistry = agentRegistry;
    this.validators = validators;
    this.isBrownfield = stateMachine.projectType === 'brownfield';
  }

  /**
   * Execute all validation gates
   */
  async executeAll(story) {
    console.log('\n🚧 Executing validation gates...\n');

    const results = [];

    // Gate 0: Regression (brownfield only)
    if (this.isBrownfield) {
      results.push(await this.gate0Regression(story));
    }

    // Gate 1: Eval tests
    results.push(await this.gate1Eval(story));

    // Gate 2: Oracle validation
    results.push(await this.gate2Oracle(story));

    // Gate 3: Validator traceability
    results.push(await this.gate3Validator(story));

    // Gate 4: Monitor metrics
    results.push(await this.gate4Monitor(story));

    // Gate 5: Compatibility (brownfield only)
    if (this.isBrownfield) {
      results.push(await this.gate5Compatibility(story));
    }

    // Gate 6: QA supplemental
    results.push(await this.gate6QA(story));

    const allPassed = results.every(r => r.passed);

    if (allPassed) {
      console.log('\n✅ All validation gates passed!\n');
    } else {
      console.log('\n❌ Some validation gates failed\n');
      const failures = results.filter(r => !r.passed);
      failures.forEach(f => {
        console.log(`  ❌ Gate ${f.gate}: ${f.reason}`);
      });
      throw new Error('Validation gates failed');
    }

    return { passed: allPassed, results };
  }

  /**
   * Gate 0: Regression tests (brownfield only)
   */
  async gate0Regression(story) {
    console.log('Gate 0 [REGRESSION] Running regression tests...');

    try {
      const evalAgent = this.agentRegistry.getAgent('eval');
      const result = await evalAgent.execute({
        task: 'run-regression-tests',
        inputs: ['test-datasets/regression/'],
        mode: 'brownfield_only'
      });

      if (result.success) {
        console.log('  ✓ Gate 0 passed: No existing functionality broken\n');
        return { gate: 0, name: 'regression', passed: true };
      } else {
        return {
          gate: 0,
          name: 'regression',
          passed: false,
          reason: 'Regression tests failed - existing functionality broken'
        };
      }
    } catch (error) {
      return {
        gate: 0,
        name: 'regression',
        passed: false,
        reason: error.message
      };
    }
  }

  /**
   * Gate 1: Eval tests
   */
  async gate1Eval(story) {
    console.log('Gate 1 [EVAL] Running eval tests...');

    try {
      const evalAgent = this.agentRegistry.getAgent('eval');
      const result = await evalAgent.execute({
        task: 'run-eval-tests',
        inputs: [story.testDataset || `test-datasets/story-${story.id}-tests.json`]
      });

      if (result.success) {
        console.log('  ✓ Gate 1 passed: 100% eval tests passing\n');
        return { gate: 1, name: 'eval', passed: true };
      } else {
        return {
          gate: 1,
          name: 'eval',
          passed: false,
          reason: '100% eval tests must pass'
        };
      }
    } catch (error) {
      return {
        gate: 1,
        name: 'eval',
        passed: false,
        reason: error.message
      };
    }
  }

  /**
   * Gate 2: Oracle validation
   */
  async gate2Oracle(story) {
    console.log('Gate 2 [ORACLE] Validating against domain truth...');

    try {
      const oracleAgent = this.agentRegistry.getAgent('oracle');
      const result = await oracleAgent.execute({
        task: 'validate-implementation',
        inputs: [story.implementation, 'domain-truth.yaml'],
        mode: this.isBrownfield ? 'dual_truth_validation' : 'standard',
        validates: 'implementation matches domain truth AND respects existing truth'
      });

      if (result.success) {
        console.log('  ✓ Gate 2 passed: Implementation matches domain truth\n');
        return { gate: 2, name: 'oracle', passed: true };
      } else {
        return {
          gate: 2,
          name: 'oracle',
          passed: false,
          reason: 'Implementation does not match domain truth'
        };
      }
    } catch (error) {
      return {
        gate: 2,
        name: 'oracle',
        passed: false,
        reason: error.message
      };
    }
  }

  /**
   * Gate 3: Validator traceability
   */
  async gate3Validator(story) {
    console.log('Gate 3 [VALIDATOR] Checking traceability chain...');

    try {
      const validatorAgent = this.agentRegistry.getAgent('validator');
      const result = await validatorAgent.execute({
        task: 'validate-traceability-chain',
        inputs: [story.id],
        validates: 'full traceability chain intact'
      });

      if (result.success) {
        console.log('  ✓ Gate 3 passed: Full traceability chain intact\n');
        return { gate: 3, name: 'validator', passed: true };
      } else {
        return {
          gate: 3,
          name: 'validator',
          passed: false,
          reason: 'Traceability chain broken'
        };
      }
    } catch (error) {
      return {
        gate: 3,
        name: 'validator',
        passed: false,
        reason: error.message
      };
    }
  }

  /**
   * Gate 4: Monitor metrics
   */
  async gate4Monitor(story) {
    console.log('Gate 4 [MONITOR] Checking metrics and drift...');

    try {
      const monitorAgent = this.agentRegistry.getAgent('monitor');
      const result = await monitorAgent.execute({
        task: 'validate-metrics',
        validates: 'no drift detected, metrics healthy, no performance degradation'
      });

      if (result.success) {
        console.log('  ✓ Gate 4 passed: Metrics healthy, no drift\n');
        return { gate: 4, name: 'monitor', passed: true };
      } else {
        return {
          gate: 4,
          name: 'monitor',
          passed: false,
          reason: 'Metrics unhealthy or drift detected'
        };
      }
    } catch (error) {
      return {
        gate: 4,
        name: 'monitor',
        passed: false,
        reason: error.message
      };
    }
  }

  /**
   * Gate 5: Compatibility (brownfield only)
   */
  async gate5Compatibility(story) {
    console.log('Gate 5 [COMPATIBILITY] Validating migration strategy adherence...');

    try {
      const compatibilityAgent = this.agentRegistry.getAgent('compatibility');
      const result = await compatibilityAgent.execute({
        task: 'validate-migration-adherence',
        mode: 'brownfield_only',
        validates: 'migration strategy adhered to, breaking changes documented'
      });

      if (result.success) {
        console.log('  ✓ Gate 5 passed: Migration strategy adhered to\n');
        return { gate: 5, name: 'compatibility', passed: true };
      } else {
        return {
          gate: 5,
          name: 'compatibility',
          passed: false,
          reason: 'Migration strategy not adhered to'
        };
      }
    } catch (error) {
      return {
        gate: 5,
        name: 'compatibility',
        passed: false,
        reason: error.message
      };
    }
  }

  /**
   * Gate 6: QA supplemental
   */
  async gate6QA(story) {
    console.log('Gate 6 [QA] Running supplemental tests...');

    try {
      const qaAgent = this.agentRegistry.getAgent('qa');
      const result = await qaAgent.execute({
        task: 'run-supplemental-tests',
        inputs: [story.id],
        validates: 'supplemental tests pass'
      });

      if (result.success) {
        console.log('  ✓ Gate 6 passed: Supplemental tests passing\n');
        return { gate: 6, name: 'qa', passed: true };
      } else {
        return {
          gate: 6,
          name: 'qa',
          passed: false,
          reason: 'Supplemental tests failed'
        };
      }
    } catch (error) {
      return {
        gate: 6,
        name: 'qa',
        passed: false,
        reason: error.message
      };
    }
  }
}
