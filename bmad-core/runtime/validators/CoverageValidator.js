/**
 * Coverage Validator
 *
 * Validates test coverage requirements:
 * - 100% domain fact coverage
 * - 100% requirement coverage
 * - 100% integration point coverage (brownfield)
 */

import { promises as fs } from 'fs';
import yaml from 'js-yaml';

export class CoverageValidator {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Validate 100% domain fact coverage
   */
  async validateDomainFactCoverage(domainTruthPath, testDatasetPaths) {
    console.log('  📊 Validating domain fact test coverage...');

    const domainTruth = await this.loadYaml(domainTruthPath);
    const facts = this.extractFacts(domainTruth);

    const allTests = await this.loadAllTests(testDatasetPaths);
    const coveredFacts = new Set();

    // Check each test to see what facts it covers
    for (const test of allTests) {
      if (test.source) {
        const factId = test.source.split('#')[1];
        if (factId) coveredFacts.add(factId);
      }
    }

    // Calculate coverage
    const totalFacts = facts.length;
    const covered = coveredFacts.size;
    const percentage = totalFacts > 0 ? (covered / totalFacts) * 100 : 0;

    console.log(`    📈 Coverage: ${covered}/${totalFacts} facts (${percentage.toFixed(1)}%)`);

    if (percentage < 100) {
      const uncovered = facts.filter(f => !coveredFacts.has(f));
      throw new Error(
        `Incomplete domain fact coverage: ${percentage.toFixed(1)}%. ` +
        `Uncovered facts: ${uncovered.join(', ')}`
      );
    }

    console.log('    ✓ 100% domain fact coverage achieved');
    return true;
  }

  /**
   * Validate 100% requirement coverage
   */
  async validateRequirementCoverage(prdPath, testDatasetPaths) {
    console.log('  📊 Validating requirement test coverage...');

    const prd = await fs.readFile(prdPath, 'utf-8');
    const requirements = this.extractRequirements(prd);

    const allTests = await this.loadAllTests(testDatasetPaths);
    const coveredRequirements = new Set();

    // Check each test to see what requirements it covers
    for (const test of allTests) {
      if (test.requirement_id) {
        coveredRequirements.add(test.requirement_id);
      }
      if (test.requirements) {
        test.requirements.forEach(req => coveredRequirements.add(req));
      }
    }

    // Calculate coverage
    const totalReqs = requirements.length;
    const covered = coveredRequirements.size;
    const percentage = totalReqs > 0 ? (covered / totalReqs) * 100 : 0;

    console.log(`    📈 Coverage: ${covered}/${totalReqs} requirements (${percentage.toFixed(1)}%)`);

    if (percentage < 100) {
      const uncovered = requirements.filter(r => !coveredRequirements.has(r));
      throw new Error(
        `Incomplete requirement coverage: ${percentage.toFixed(1)}%. ` +
        `Uncovered requirements: ${uncovered.join(', ')}`
      );
    }

    console.log('    ✓ 100% requirement coverage achieved');
    return true;
  }

  /**
   * Validate 100% integration point coverage (brownfield)
   */
  async validateIntegrationPointCoverage(existingSystemPath, regressionTestPaths) {
    console.log('  📊 Validating integration point test coverage...');

    const existingSystem = await this.loadYaml(existingSystemPath);
    const integrationPoints = this.extractIntegrationPoints(existingSystem);

    const allTests = await this.loadAllTests(regressionTestPaths);
    const coveredPoints = new Set();

    // Check each test to see what integration points it covers
    for (const test of allTests) {
      if (test.integration_point) {
        coveredPoints.add(test.integration_point);
      }
      if (test.api_endpoint) {
        coveredPoints.add(test.api_endpoint);
      }
    }

    // Calculate coverage
    const totalPoints = integrationPoints.length;
    const covered = coveredPoints.size;
    const percentage = totalPoints > 0 ? (covered / totalPoints) * 100 : 0;

    console.log(`    📈 Coverage: ${covered}/${totalPoints} integration points (${percentage.toFixed(1)}%)`);

    if (percentage < 100) {
      const uncovered = integrationPoints.filter(p => !coveredPoints.has(p));
      throw new Error(
        `Incomplete integration point coverage: ${percentage.toFixed(1)}%. ` +
        `Uncovered points: ${uncovered.join(', ')}`
      );
    }

    console.log('    ✓ 100% integration point coverage achieved');
    return true;
  }

  /**
   * Generate coverage report
   */
  async generateCoverageReport(options = {}) {
    const report = {
      generated: new Date().toISOString(),
      coverage: {}
    };

    if (options.domainTruth && options.domainTests) {
      try {
        await this.validateDomainFactCoverage(options.domainTruth, options.domainTests);
        report.coverage.domainFacts = { status: 'pass', percentage: 100 };
      } catch (error) {
        report.coverage.domainFacts = { status: 'fail', error: error.message };
      }
    }

    if (options.prd && options.requirementTests) {
      try {
        await this.validateRequirementCoverage(options.prd, options.requirementTests);
        report.coverage.requirements = { status: 'pass', percentage: 100 };
      } catch (error) {
        report.coverage.requirements = { status: 'fail', error: error.message };
      }
    }

    // Save report
    await fs.mkdir('.bmad', { recursive: true });
    await fs.writeFile('.bmad/coverage-report.json', JSON.stringify(report, null, 2));

    return report;
  }

  /**
   * Extract facts from domain truth
   */
  extractFacts(domainTruth) {
    const facts = [];

    if (domainTruth.canonical_facts) {
      domainTruth.canonical_facts.forEach((fact, index) => {
        facts.push(`fact-${index + 1}`);
      });
    }

    return facts;
  }

  /**
   * Extract requirements from PRD
   */
  extractRequirements(prdContent) {
    const requirements = [];

    // Extract FR-XXX, NFR-XXX, etc.
    const matches = prdContent.match(/(?:FR|NFR|UR|AC)-\d+/g) || [];
    matches.forEach(req => requirements.push(req));

    return [...new Set(requirements)];
  }

  /**
   * Extract integration points from existing system
   */
  extractIntegrationPoints(existingSystem) {
    const points = [];

    if (existingSystem.integration_points) {
      existingSystem.integration_points.forEach(point => {
        if (typeof point === 'string') {
          points.push(point);
        } else if (point.id) {
          points.push(point.id);
        } else if (point.endpoint) {
          points.push(point.endpoint);
        }
      });
    }

    if (existingSystem.apis) {
      existingSystem.apis.forEach(api => {
        if (api.endpoint) points.push(api.endpoint);
      });
    }

    return points;
  }

  /**
   * Load all tests from multiple dataset files
   */
  async loadAllTests(testPaths) {
    const allTests = [];

    for (const testPath of testPaths) {
      try {
        let tests;
        if (testPath.endsWith('.yaml') || testPath.endsWith('.yml')) {
          tests = await this.loadYaml(testPath);
        } else if (testPath.endsWith('.json')) {
          const content = await fs.readFile(testPath, 'utf-8');
          tests = JSON.parse(content);
        }

        if (Array.isArray(tests)) {
          allTests.push(...tests);
        } else if (tests.tests) {
          allTests.push(...tests.tests);
        } else if (tests.domain_tests) {
          allTests.push(...tests.domain_tests);
        }
      } catch (error) {
        console.warn(`Warning: Could not load tests from ${testPath}: ${error.message}`);
      }
    }

    return allTests;
  }

  /**
   * Load YAML file
   */
  async loadYaml(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return yaml.load(content);
  }
}
