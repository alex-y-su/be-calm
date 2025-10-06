/**
 * State Machine Tests
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import StateMachine from '../../bmad-core/orchestration/state-machine.js';

describe('StateMachine', () => {
  let sm;
  const testStateFile = '.bmad-state-test/workflow-state.yaml';
  const testBackupDir = '.bmad-state-test/backups';

  beforeEach(async () => {
    // Clean up test directory first
    await fs.remove('.bmad-state-test');

    sm = new StateMachine({
      stateFile: testStateFile,
      backupDir: testBackupDir,
      autoSave: false  // Disable auto-save for tests to avoid timing issues
    });
  });

  afterEach(async () => {
    await fs.remove('.bmad-state-test');
  });

  describe('Initialization', () => {
    it('should initialize with greenfield project', async () => {
      await sm.initialize('greenfield');

      expect(sm.currentState).toBe('domain_research');
      expect(sm.projectType).toBe('greenfield');
    });

    it('should initialize with brownfield project', async () => {
      await sm.initialize('brownfield');

      expect(sm.currentState).toBe('codebase_discovery');
      expect(sm.projectType).toBe('brownfield');
    });

    it('should emit initialized event', async () => {
      const handler = jest.fn();
      sm.on('initialized', handler);

      await sm.initialize('greenfield');

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    beforeEach(async () => {
      await sm.initialize('greenfield');
    });

    it('should get current state', () => {
      const state = sm.getCurrentState();

      expect(state.id).toBe('domain_research');
      expect(state.type).toBe('universal');
      expect(state.phase).toBe(0);
    });

    it('should update metadata', () => {
      sm.updateMetadata({ completion_percentage: 50 });

      const metadata = sm.getMetadata();
      expect(metadata.completion_percentage).toBe(50);
    });

    it('should track exit conditions', () => {
      sm.markExitCondition('domain_truth_created', true);

      const { conditions } = sm.checkExitConditions();
      expect(conditions.domain_truth_created).toBe(true);
    });

    it('should detect when all exit conditions are met', () => {
      const state = sm.getCurrentState();

      state.exitConditions.forEach(condition => {
        sm.markExitCondition(condition, true);
      });

      const { met } = sm.checkExitConditions();
      expect(met).toBe(true);
    });
  });

  describe('Transitions', () => {
    beforeEach(async () => {
      await sm.initialize('greenfield');
    });

    it('should transition to next state', async () => {
      const state = await sm.transitionTo('eval_foundation', 'manual', true);

      expect(sm.currentState).toBe('eval_foundation');
      expect(state.id).toBe('eval_foundation');
    });

    it('should record state history', async () => {
      await sm.transitionTo('eval_foundation', 'manual', true);

      expect(sm.stateHistory).toHaveLength(2); // init + transition
      expect(sm.stateHistory[1].from).toBe('domain_research');
      expect(sm.stateHistory[1].to).toBe('eval_foundation');
    });

    it('should emit transition event', async () => {
      const handler = jest.fn();
      sm.on('transition', handler);

      await sm.transitionTo('eval_foundation', 'manual', true);

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'domain_research',
          to: 'eval_foundation'
        })
      );
    });

    it('should prevent invalid transitions without force', async () => {
      await expect(
        sm.transitionTo('development', 'automatic', false)
      ).rejects.toThrow();
    });

    it('should allow brownfield-only states for brownfield projects', async () => {
      // Clean up state from previous test and create fresh state machine
      await fs.remove('.bmad-state-test');
      sm = new StateMachine({
        stateFile: testStateFile,
        backupDir: testBackupDir
      });

      await sm.initialize('brownfield');

      const state = sm.getCurrentState();
      expect(state.id).toBe('codebase_discovery');
      expect(state.type).toBe('brownfield_only');
    });
  });

  describe('Blocking', () => {
    beforeEach(async () => {
      await sm.initialize('greenfield');
    });

    it('should block workflow', () => {
      sm.block('test_failure', { message: 'Tests failing' });

      const metadata = sm.getMetadata();
      expect(metadata.blocked).toBe(true);
      expect(metadata.blocking_issues).toHaveLength(1);
    });

    it('should emit workflow-blocked event', () => {
      const handler = jest.fn();
      sm.on('workflow-blocked', handler);

      sm.block('test_failure', { message: 'Tests failing' });

      expect(handler).toHaveBeenCalled();
    });

    it('should unblock workflow', () => {
      sm.block('test_failure');
      sm.unblock('tests_fixed');

      const metadata = sm.getMetadata();
      expect(metadata.blocked).toBe(false);
      expect(metadata.blocking_issues).toHaveLength(0);
    });
  });

  describe('Rollback', () => {
    beforeEach(async () => {
      await sm.initialize('greenfield');
      await sm.transitionTo('eval_foundation', 'manual', true);
      await sm.transitionTo('discovery', 'manual', true);
    });

    it('should rollback to previous state', async () => {
      await sm.rollback();

      expect(sm.currentState).toBe('eval_foundation');
    });

    it('should rollback to specific state', async () => {
      await sm.rollback('domain_research');

      expect(sm.currentState).toBe('domain_research');
    });

    it('should emit rollback event', async () => {
      const handler = jest.fn();
      sm.on('rollback', handler);

      await sm.rollback();

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Persistence', () => {
    beforeEach(async () => {
      await sm.initialize('greenfield');
    });

    it('should save state to file', async () => {
      await sm.saveState();

      const exists = await fs.pathExists(testStateFile);
      expect(exists).toBe(true);
    });

    it('should load state from file', async () => {
      await sm.transitionTo('eval_foundation', 'manual', true);
      await sm.saveState();

      const newSm = new StateMachine({
        stateFile: testStateFile,
        backupDir: testBackupDir
      });

      await newSm.loadState();

      expect(newSm.currentState).toBe('eval_foundation');
      expect(newSm.projectType).toBe('greenfield');
    });

    it('should create backups on save', async () => {
      await sm.saveState();
      await sm.transitionTo('eval_foundation', 'manual', true);
      await sm.saveState();

      const backups = await fs.readdir(testBackupDir);
      expect(backups.length).toBeGreaterThan(0);
    });
  });

  describe('Progress Tracking', () => {
    beforeEach(async () => {
      await sm.initialize('greenfield');
    });

    it('should calculate workflow progress', () => {
      const progress = sm.getProgress();

      expect(progress.current_state.id).toBe('domain_research');
      expect(progress.progress_percentage).toBeGreaterThan(0);
      expect(progress.completed_states).toEqual([]);
    });

    it('should track completed states', async () => {
      await sm.transitionTo('eval_foundation', 'manual', true);
      await sm.transitionTo('discovery', 'manual', true);

      const progress = sm.getProgress();

      expect(progress.completed_states).toContain('domain_research');
      expect(progress.completed_states).toContain('eval_foundation');
    });
  });

  describe('Recovery', () => {
    it('should recover from saved state', async () => {
      await sm.initialize('greenfield');
      await sm.transitionTo('eval_foundation', 'manual', true);
      await sm.saveState();

      const newSm = new StateMachine({
        stateFile: testStateFile,
        backupDir: testBackupDir
      });

      await newSm.recover();

      expect(newSm.currentState).toBe('eval_foundation');
    });

    it('should recover from backup if main file corrupted', async () => {
      await sm.initialize('greenfield');
      await sm.saveState();

      // Corrupt main file
      await fs.writeFile(testStateFile, 'invalid yaml {]');

      const newSm = new StateMachine({
        stateFile: testStateFile,
        backupDir: testBackupDir
      });

      // Should recover from backup
      const recovered = await newSm.recoverFromBackup();
      expect(recovered).toBe(true);
    });
  });

  describe('Pause/Resume', () => {
    beforeEach(async () => {
      await sm.initialize('greenfield');
    });

    it('should pause workflow', () => {
      sm.pause('manual_review');

      const metadata = sm.getMetadata();
      expect(metadata.paused).toBe(true);
    });

    it('should resume workflow', () => {
      sm.pause('manual_review');
      sm.resume('review_complete');

      const metadata = sm.getMetadata();
      expect(metadata.paused).toBe(false);
    });
  });
});
