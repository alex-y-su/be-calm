#!/usr/bin/env node

/**
 * BMAD Workflow CLI
 *
 * Command-line interface for the workflow orchestration system.
 * Provides commands to initialize, execute, and manage workflows.
 */

import { Command } from 'commander';
import { WorkflowEngine } from './WorkflowEngine.js';

const program = new Command();

program
  .name('bmad-workflow')
  .description('BMAD Workflow Orchestration System')
  .version('5.0.0');

/**
 * Initialize workflow
 */
program
  .command('init')
  .description('Initialize a new workflow')
  .option('-t, --type <type>', 'Project type (greenfield|brownfield)', 'greenfield')
  .action(async (options) => {
    console.log(`Initializing ${options.type} workflow...`);

    const engine = new WorkflowEngine();
    await engine.initialize(options.type);

    const status = engine.getStatus();
    console.log(`\nInitial state: ${status.currentState}`);
    console.log(`Progress: ${status.progress}%\n`);
  });

/**
 * Execute workflow
 */
program
  .command('execute')
  .description('Execute the workflow from current state to completion')
  .action(async () => {
    const engine = new WorkflowEngine();
    await engine.initialize(); // Load existing state

    await engine.execute();
  });

/**
 * Execute a single phase
 */
program
  .command('phase <name>')
  .description('Execute a specific phase')
  .action(async (name) => {
    const engine = new WorkflowEngine();
    await engine.initialize(); // Load existing state

    await engine.executeSinglePhase(name);
  });

/**
 * Get workflow status
 */
program
  .command('status')
  .description('Show workflow status')
  .action(async () => {
    const engine = new WorkflowEngine();
    await engine.initialize(); // Load existing state

    const status = engine.getStatus();

    console.log('\n📊 Workflow Status\n');
    console.log(`Project Type: ${status.projectType}`);
    console.log(`Current State: ${status.currentState}`);
    console.log(`Progress: ${status.progress}%`);
    console.log(`Halted: ${status.halted ? 'Yes' : 'No'}`);

    console.log(`\nCompleted Phases (${status.completedPhases.length}):`);
    status.completedPhases.forEach(phase => {
      console.log(`  ✓ ${phase}`);
    });

    console.log(`\nNext Phases (${status.validTransitions.length}):`);
    status.validTransitions.forEach(phase => {
      console.log(`  → ${phase}`);
    });

    console.log('');
  });

/**
 * Generate report
 */
program
  .command('report')
  .description('Generate comprehensive workflow report')
  .action(async () => {
    const engine = new WorkflowEngine();
    await engine.initialize(); // Load existing state

    await engine.generateReport();
  });

/**
 * Reset workflow
 */
program
  .command('reset')
  .description('Reset workflow to initial state')
  .option('--confirm', 'Confirm reset')
  .action(async (options) => {
    if (!options.confirm) {
      console.log('⚠️  This will reset the workflow to initial state.');
      console.log('   Use --confirm to proceed.');
      return;
    }

    const engine = new WorkflowEngine();
    await engine.initialize(); // Load existing state

    await engine.reset();
  });

/**
 * Resume halted workflow
 */
program
  .command('resume')
  .description('Resume a halted workflow')
  .action(async () => {
    const engine = new WorkflowEngine();
    await engine.initialize(); // Load existing state

    await engine.resume();
  });

/**
 * List available phases
 */
program
  .command('list-phases')
  .description('List all available workflow phases')
  .action(() => {
    console.log('\n📋 Available Workflow Phases\n');

    console.log('Greenfield Path:');
    console.log('  0. domain_research');
    console.log('  1. eval_foundation');
    console.log('  2. discovery');
    console.log('  3. architecture');
    console.log('  4. planning');
    console.log('  5. development');

    console.log('\nBrownfield Path:');
    console.log(' -1. codebase_discovery');
    console.log('  0. domain_research');
    console.log('  1. eval_foundation');
    console.log('1.5. compatibility_analysis');
    console.log('  2. discovery');
    console.log('  3. architecture');
    console.log('  4. planning');
    console.log('  5. development');

    console.log('');
  });

program.parse();
