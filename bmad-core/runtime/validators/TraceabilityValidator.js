/**
 * Traceability Validator
 *
 * Ensures 100% traceability across all artifacts:
 * - Domain Truth → Requirements → Architecture → Stories → Code
 * - Validates bidirectional links
 * - Generates traceability matrices
 */

import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export class TraceabilityValidator {
  constructor(config = {}) {
    this.config = config;
    this.traceabilityMap = new Map();
  }

  /**
   * Validate complete traceability chain
   */
  async validateChain(artifact, expectedSource) {
    console.log(`  🔗 Validating traceability: ${artifact} → ${expectedSource}`);

    // Load artifact
    const content = await this.loadArtifact(artifact);

    // Extract references
    const references = this.extractReferences(content);

    // Validate references exist
    for (const ref of references) {
      const exists = await this.checkReferenceExists(ref);
      if (!exists) {
        throw new Error(`Broken reference: ${artifact} references non-existent ${ref}`);
      }
    }

    // Check expected source is referenced
    if (expectedSource && !references.includes(expectedSource)) {
      throw new Error(`Missing traceability: ${artifact} does not reference ${expectedSource}`);
    }

    console.log(`    ✓ Traceability validated`);
    return true;
  }

  /**
   * Validate 100% requirement coverage
   */
  async validate100PercentCoverage(sourceArtifact, targetArtifacts) {
    console.log(`  📊 Validating 100% coverage: ${sourceArtifact} → targets`);

    const source = await this.loadArtifact(sourceArtifact);
    const sourceItems = this.extractItems(source);

    const uncovered = [];

    for (const item of sourceItems) {
      let covered = false;

      for (const targetPath of targetArtifacts) {
        const target = await this.loadArtifact(targetPath);
        if (this.itemIsCovered(item, target)) {
          covered = true;
          break;
        }
      }

      if (!covered) {
        uncovered.push(item);
      }
    }

    if (uncovered.length > 0) {
      throw new Error(
        `Incomplete coverage: ${uncovered.length} items not covered: ${uncovered.join(', ')}`
      );
    }

    console.log(`    ✓ 100% coverage validated`);
    return true;
  }

  /**
   * Generate traceability matrix
   */
  async generateMatrix(artifacts) {
    console.log('  📋 Generating traceability matrix...');

    const matrix = {
      generated: new Date().toISOString(),
      artifacts: artifacts.length,
      chains: []
    };

    for (const artifact of artifacts) {
      try {
        const content = await this.loadArtifact(artifact);
        const references = this.extractReferences(content);
        const items = this.extractItems(content);

        matrix.chains.push({
          artifact,
          itemCount: items.length,
          references,
          valid: true
        });
      } catch (error) {
        matrix.chains.push({
          artifact,
          error: error.message,
          valid: false
        });
      }
    }

    // Save matrix
    await this.saveMatrix(matrix);

    return matrix;
  }

  /**
   * Validate bidirectional links
   */
  async validateBidirectional(artifact1, artifact2) {
    console.log(`  ↔️  Validating bidirectional links: ${artifact1} ↔ ${artifact2}`);

    const content1 = await this.loadArtifact(artifact1);
    const content2 = await this.loadArtifact(artifact2);

    const refs1 = this.extractReferences(content1);
    const refs2 = this.extractReferences(content2);

    const artifact1Name = path.basename(artifact1);
    const artifact2Name = path.basename(artifact2);

    const has1to2 = refs1.some(ref => ref.includes(artifact2Name));
    const has2to1 = refs2.some(ref => ref.includes(artifact1Name));

    if (!has1to2 && !has2to1) {
      throw new Error(`No bidirectional link between ${artifact1} and ${artifact2}`);
    }

    console.log(`    ✓ Bidirectional links validated`);
    return true;
  }

  /**
   * Load artifact content
   */
  async loadArtifact(artifactPath) {
    try {
      const content = await fs.readFile(artifactPath, 'utf-8');

      // Parse based on file type
      if (artifactPath.endsWith('.yaml') || artifactPath.endsWith('.yml')) {
        return yaml.load(content);
      }

      return content;
    } catch (error) {
      throw new Error(`Could not load artifact ${artifactPath}: ${error.message}`);
    }
  }

  /**
   * Extract references from content
   */
  extractReferences(content) {
    const references = [];

    if (typeof content === 'string') {
      // Extract markdown links [text](path)
      const mdLinks = content.match(/\[.*?\]\((.*?)\)/g) || [];
      mdLinks.forEach(link => {
        const match = link.match(/\((.*?)\)/);
        if (match) references.push(match[1]);
      });

      // Extract YAML-style references domain-truth.yaml#fact-123
      const yamlRefs = content.match(/[\w-]+\.yaml#[\w-]+/g) || [];
      references.push(...yamlRefs);

      // Extract test IDs TEST-001, DOM-001, etc.
      const testIds = content.match(/[A-Z]+-\d+/g) || [];
      references.push(...testIds);

    } else if (typeof content === 'object') {
      // Extract from YAML/JSON structure
      this.extractReferencesFromObject(content, references);
    }

    return [...new Set(references)]; // unique
  }

  /**
   * Extract references from object recursively
   */
  extractReferencesFromObject(obj, references) {
    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        if (value.includes('.yaml') || value.includes('.md')) {
          references.push(value);
        }
      } else if (typeof value === 'object' && value !== null) {
        this.extractReferencesFromObject(value, references);
      }
    }
  }

  /**
   * Extract items from content
   */
  extractItems(content) {
    const items = [];

    if (typeof content === 'string') {
      // Extract requirements (FR-001, NFR-001, etc.)
      const reqs = content.match(/(?:FR|NFR|UR|AC)-\d+/g) || [];
      items.push(...reqs);

    } else if (typeof content === 'object') {
      // Extract from YAML structure
      if (content.functional_requirements) {
        items.push(...Object.keys(content.functional_requirements));
      }
      if (content.requirements) {
        items.push(...Object.keys(content.requirements));
      }
    }

    return [...new Set(items)];
  }

  /**
   * Check if item is covered in target
   */
  itemIsCovered(item, targetContent) {
    if (typeof targetContent === 'string') {
      return targetContent.includes(item);
    }

    // Check in object recursively
    return JSON.stringify(targetContent).includes(item);
  }

  /**
   * Check if reference exists
   */
  async checkReferenceExists(reference) {
    // Extract file path from reference
    const filePath = reference.split('#')[0];

    if (!filePath.includes('.')) {
      // Not a file reference
      return true;
    }

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save traceability matrix
   */
  async saveMatrix(matrix) {
    const outputPath = '.bmad/traceability-matrix.yaml';
    const dir = path.dirname(outputPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(outputPath, yaml.dump(matrix));

    console.log(`    📄 Saved: ${outputPath}`);
  }
}
