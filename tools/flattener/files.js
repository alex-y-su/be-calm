import path from 'node:path';
import * as discovery from './discovery.js';
import * as ignoreRules from './ignoreRules.js';
import { isBinaryFile } from './binary.js';
import { aggregateFileContents } from './aggregate.js';

// Backward-compatible signature; delegate to central loader
async function parseGitignore(gitignorePath) {
  return await ignoreRules.parseGitignore(gitignorePath);
}

async function discoverFiles(rootDir) {
  try {
    // Delegate to discovery module which respects .gitignore and defaults
    return await discovery.discoverFiles(rootDir, { preferGit: true });
  } catch (error) {
    console.error('Error discovering files:', error.message);
    return [];
  }
}

async function filterFiles(files, rootDir) {
  const { filter } = await ignoreRules.loadIgnore(rootDir);
  const relativeFiles = files.map((f) => path.relative(rootDir, f));
  const filteredRelative = relativeFiles.filter((p) => filter(p));
  return filteredRelative.map((p) => path.resolve(rootDir, p));
}

export { parseGitignore, discoverFiles, isBinaryFile, aggregateFileContents, filterFiles };
