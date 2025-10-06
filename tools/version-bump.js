import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import chalk from 'chalk';

/**
 * Simple version bumping script for BMad-Method
 * Usage: node tools/version-bump.js [patch|minor|major]
 */

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

async function bumpVersion(type = 'patch') {

  const validTypes = ['patch', 'minor', 'major'];
  if (!validTypes.includes(type)) {
    console.error(chalk.red(`Invalid version type: ${type}. Use: ${validTypes.join(', ')}`));
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  const versionParts = currentVersion.split('.').map(Number);
  let newVersion;

  switch (type) {
    case 'major': {
      newVersion = `${versionParts[0] + 1}.0.0`;
      break;
    }
    case 'minor': {
      newVersion = `${versionParts[0]}.${versionParts[1] + 1}.0`;
      break;
    }
    case 'patch': {
      newVersion = `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;
      break;
    }
  }

  console.log(chalk.blue(`Bumping version: ${currentVersion} → ${newVersion}`));

  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');

  console.log(chalk.green(`✓ Updated package.json to ${newVersion}`));

  return newVersion;
}

async function main() {

  const type = process.argv[2] || 'patch';
  const currentVersion = getCurrentVersion();

  console.log(chalk.blue(`Current version: ${currentVersion}`));

  // Check if working directory is clean
  try {
    execSync('git diff-index --quiet HEAD --');
  } catch {
    console.error(chalk.red('❌ Working directory is not clean. Commit your changes first.'));
    process.exit(1);
  }

  const newVersion = await bumpVersion(type);

  console.log(chalk.green(`\n🎉 Version bump complete!`));
  console.log(chalk.blue(`📦 ${currentVersion} → ${newVersion}`));
}

// Check if this module is being run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { bumpVersion, getCurrentVersion };
