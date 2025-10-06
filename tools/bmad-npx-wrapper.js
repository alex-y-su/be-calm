#!/usr/bin/env node

/**
 * BMad Method CLI - Direct execution wrapper for npx
 * This file ensures proper execution when run via npx from GitHub
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're running in an npx temporary directory
const isNpxExecution = __dirname.includes('_npx') || __dirname.includes('.npm');

// If running via npx, we need to handle things differently
if (isNpxExecution) {
  const arguments_ = process.argv.slice(2);

  // Use the installer for all commands
  const bmadScriptPath = path.join(__dirname, 'installer', 'bin', 'bmad.js');

  if (!fs.existsSync(bmadScriptPath)) {
    console.error('Error: Could not find bmad.js at', bmadScriptPath);
    console.error('Current directory:', __dirname);
    process.exit(1);
  }

  try {
    execSync(`node "${bmadScriptPath}" ${arguments_.join(' ')}`, {
      stdio: 'inherit',
      cwd: path.dirname(__dirname),
    });
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // Local execution - use installer for all commands
  await import('./installer/bin/bmad.js');
}
