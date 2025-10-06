/**
 * Migration Tool
 * Handles migration between BMAD versions and configuration updates
 */

import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'js-yaml';
import { EventEmitter } from 'node:events';

class MigrationTool extends EventEmitter {
  constructor() {
    super();
    this.migrations = new Map();
    this.registerMigrations();
  }

  /**
   * Register all migrations
   */
  registerMigrations() {
    // Register version migrations
    this.registerMigration('4.x', '6.0', this.migrateV4ToV6.bind(this));
    this.registerMigration('5.x', '6.0', this.migrateV5ToV6.bind(this));
  }

  /**
   * Register a migration
   */
  registerMigration(from, to, migrateFn) {
    const key = `${from}->${to}`;
    this.migrations.set(key, migrateFn);
    this.emit('migration-registered', { from, to });
  }

  /**
   * Run migration
   * @param {string} from - Source version
   * @param {string} to - Target version
   * @param {string} projectRoot - Project root directory
   */
  async migrate(from, to, projectRoot = process.cwd()) {
    const key = `${from}->${to}`;
    const migrateFn = this.migrations.get(key);

    if (!migrateFn) {
      throw new Error(`No migration found from ${from} to ${to}`);
    }

    this.emit('migration-started', { from, to });

    // Create backup before migration
    await this.createBackup(projectRoot);

    try {
      const result = await migrateFn(projectRoot);

      this.emit('migration-completed', { from, to, result });

      return {
        success: true,
        from,
        to,
        result
      };
    } catch (error) {
      this.emit('migration-failed', { from, to, error });

      throw new Error(`Migration failed: ${error.message}`);
    }
  }

  /**
   * Migrate from v4.x to v6.0
   */
  async migrateV4ToV6(projectRoot) {
    const changes = [];

    // 1. Convert agent definitions
    const agentChanges = await this.convertAgentDefinitions(projectRoot);
    changes.push(...agentChanges);

    // 2. Update workflow files
    const workflowChanges = await this.updateWorkflowFiles(projectRoot);
    changes.push(...workflowChanges);

    // 3. Migrate configuration
    const configChanges = await this.migrateConfigurationFiles(projectRoot);
    changes.push(...configChanges);

    // 4. Create truth schemas
    const truthChanges = await this.createTruthSchemas(projectRoot);
    changes.push(...truthChanges);

    // 5. Update package.json if exists
    await this.updatePackageJson(projectRoot);

    return {
      changes,
      totalChanges: changes.length
    };
  }

  /**
   * Migrate from v5.x to v6.0
   */
  async migrateV5ToV6(projectRoot) {
    const changes = [];

    // v5 to v6 migration (similar but fewer changes)
    const configChanges = await this.migrateConfigurationFiles(projectRoot);
    changes.push(...configChanges);

    return {
      changes,
      totalChanges: changes.length
    };
  }

  /**
   * Convert agent definitions to v6 format
   */
  async convertAgentDefinitions(projectRoot) {
    const changes = [];
    const agentsDir = path.join(projectRoot, 'bmad-core', 'agents');

    if (!await fs.pathExists(agentsDir)) {
      return changes;
    }

    const files = await fs.readdir(agentsDir);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(agentsDir, file);
      let content = await fs.readFile(filePath, 'utf8');

      // Update agent definition format (placeholder - would have actual transformations)
      const updated = content;

      if (updated !== content) {
        await fs.writeFile(filePath, updated, 'utf8');
        changes.push({
          type: 'agent-definition',
          file,
          action: 'converted'
        });
      }
    }

    return changes;
  }

  /**
   * Update workflow files
   */
  async updateWorkflowFiles(projectRoot) {
    const changes = [];
    const workflowDir = path.join(projectRoot, 'bmad-core', 'workflows');

    if (!await fs.pathExists(workflowDir)) {
      return changes;
    }

    const files = await fs.readdir(workflowDir);

    for (const file of files) {
      if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;

      const filePath = path.join(workflowDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const workflow = yaml.load(content);

      // Update workflow format for v6
      // (Add new fields, update structure, etc.)

      const updated = yaml.dump(workflow, { indent: 2 });

      if (updated !== content) {
        await fs.writeFile(filePath, updated, 'utf8');
        changes.push({
          type: 'workflow',
          file,
          action: 'updated'
        });
      }
    }

    return changes;
  }

  /**
   * Migrate configuration files
   */
  async migrateConfigurationFiles(projectRoot) {
    const changes = [];
    const configDir = path.join(projectRoot, '.bmad-config');

    // Create config directory if it doesn't exist
    await fs.ensureDir(configDir);

    // Create new v6 configuration files
    const configs = [
      'autonomy-settings.yaml',
      'truth-settings.yaml',
      'metrics-config.yaml',
      'deployment-config.yaml',
      'notification-config.yaml'
    ];

    for (const configFile of configs) {
      const filePath = path.join(configDir, configFile);

      if (!await fs.pathExists(filePath)) {
        // Copy default configuration
        const defaultPath = path.join(__dirname, '..', 'config', 'defaults', configFile);

        if (await fs.pathExists(defaultPath)) {
          await fs.copy(defaultPath, filePath);
          changes.push({
            type: 'configuration',
            file: configFile,
            action: 'created'
          });
        }
      }
    }

    return changes;
  }

  /**
   * Create truth schemas
   */
  async createTruthSchemas(projectRoot) {
    const changes = [];
    const truthDir = path.join(projectRoot, '.bmad-truth');

    await fs.ensureDir(truthDir);

    // Create basic truth schema files
    const schemas = {
      'domain-truth.yaml': {
        version: '1.0',
        facts: [],
        relationships: [],
        constraints: []
      },
      'eval-criteria.yaml': {
        version: '1.0',
        criteria: [],
        test_cases: []
      }
    };

    for (const [file, schema] of Object.entries(schemas)) {
      const filePath = path.join(truthDir, file);

      if (!await fs.pathExists(filePath)) {
        const content = yaml.dump(schema, { indent: 2 });
        await fs.writeFile(filePath, content, 'utf8');

        changes.push({
          type: 'truth-schema',
          file,
          action: 'created'
        });
      }
    }

    return changes;
  }

  /**
   * Update package.json
   */
  async updatePackageJson(projectRoot) {
    const pkgPath = path.join(projectRoot, 'package.json');

    if (!await fs.pathExists(pkgPath)) {
      return;
    }

    const pkg = await fs.readJson(pkgPath);

    // Update bmad-method dependency version
    if (pkg.dependencies?.['bmad-method']) {
      pkg.dependencies['bmad-method'] = '^6.0.0';
    }

    if (pkg.devDependencies?.['bmad-method']) {
      pkg.devDependencies['bmad-method'] = '^6.0.0';
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  /**
   * Create backup before migration
   */
  async createBackup(projectRoot) {
    const backupDir = path.join(projectRoot, '.bmad-backups');
    await fs.ensureDir(backupDir);

    const timestamp = Date.now();
    const backupPath = path.join(backupDir, `backup-${timestamp}`);

    // Backup configuration and important files
    const filesToBackup = [
      '.bmad-config',
      'bmad-core/agents',
      'bmad-core/workflows',
      'package.json'
    ];

    for (const file of filesToBackup) {
      const sourcePath = path.join(projectRoot, file);
      if (await fs.pathExists(sourcePath)) {
        const destPath = path.join(backupPath, file);
        await fs.copy(sourcePath, destPath);
      }
    }

    this.emit('backup-created', { path: backupPath });

    return backupPath;
  }

  /**
   * Rollback migration using backup
   */
  async rollback(backupPath, projectRoot = process.cwd()) {
    if (!await fs.pathExists(backupPath)) {
      throw new Error(`Backup not found: ${backupPath}`);
    }

    this.emit('rollback-started', { backupPath });

    // Restore files from backup
    await fs.copy(backupPath, projectRoot, { overwrite: true });

    this.emit('rollback-completed', { backupPath });

    return {
      success: true,
      restoredFrom: backupPath
    };
  }

  /**
   * List available backups
   */
  async listBackups(projectRoot = process.cwd()) {
    const backupDir = path.join(projectRoot, '.bmad-backups');

    if (!await fs.pathExists(backupDir)) {
      return [];
    }

    const dirs = await fs.readdir(backupDir);
    const backups = [];

    for (const dir of dirs) {
      if (dir.startsWith('backup-')) {
        const timestamp = parseInt(dir.replace('backup-', ''));
        backups.push({
          path: path.join(backupDir, dir),
          timestamp,
          date: new Date(timestamp).toISOString()
        });
      }
    }

    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Clean up old backups
   */
  async cleanupBackups(projectRoot = process.cwd(), keepLast = 5) {
    const backups = await this.listBackups(projectRoot);

    if (backups.length <= keepLast) {
      return { deleted: 0 };
    }

    const toDelete = backups.slice(keepLast);

    for (const backup of toDelete) {
      await fs.remove(backup.path);
    }

    this.emit('backups-cleaned', { deleted: toDelete.length });

    return { deleted: toDelete.length };
  }
}

// Singleton instance
let instance = null;

export default {
  MigrationTool,
  getInstance: () => {
    if (!instance) {
      instance = new MigrationTool();
    }
    return instance;
  }
};
