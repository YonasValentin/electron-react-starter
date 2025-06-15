'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const packageJson = require('../package.json');
const { runPrompts } = require('./prompts');
const { createProjectStructure } = require('./templates');
const { installDependencies } = require('./dependencies');
const { validateProjectName, checkWriteAccess } = require('./validators');
const { logIntro, logSuccess, logError, ensureCleanExit } = require('./utils');

async function run() {
  // Handle clean exit on SIGINT/SIGTERM
  ensureCleanExit();

  program
    .name('electron-react-starter')
    .description('Create a new Electron app with modern tooling')
    .version(packageJson.version)
    .argument('[project-directory]', 'directory to create the app in')
    .option('--skip-install', 'skip installing dependencies')
    .option('--skip-git', 'skip initializing git repository')
    .option('--verbose', 'print additional logs')
    .option('--template <name>', 'use a specific template')
    .parse();

  const options = program.opts();
  const [projectDirectory] = program.args;

  try {
    logIntro();

    // Get project configuration through interactive prompts
    const config = await runPrompts(projectDirectory, options);

    // Validate project setup
    await validateProjectSetup(config);

    // Create the project
    await createProject(config, options);

    logSuccess(config);
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

async function validateProjectSetup(config) {
  const { projectName, projectPath } = config;

  // Validate project name
  const nameValidation = validateProjectName(projectName);
  if (!nameValidation.valid) {
    throw new Error(`Invalid project name: ${nameValidation.problems.join(', ')}`);
  }

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    const isEmpty = (await fs.readdir(projectPath)).length === 0;
    if (!isEmpty) {
      throw new Error(
        `Directory ${chalk.cyan(projectPath)} is not empty. ` +
          `Please choose a different project name or remove the existing directory.`
      );
    }
  }

  // Check write permissions
  const hasWriteAccess = await checkWriteAccess(path.dirname(projectPath));
  if (!hasWriteAccess) {
    throw new Error(
      `Cannot create project in ${chalk.cyan(path.dirname(projectPath))}. ` + `Permission denied.`
    );
  }
}

async function createProject(config, options) {
  const { projectPath } = config;

  // Ensure project directory exists
  await fs.ensureDir(projectPath);

  // Create project structure and copy templates
  await createProjectStructure(config);

  // Install dependencies unless skipped
  if (!options.skipInstall) {
    await installDependencies(projectPath, options.verbose, config.packageManager);
  }

  // Initialize git repository unless skipped
  if (!options.skipGit) {
    await initializeGitRepository(projectPath);
  }
}

async function initializeGitRepository(projectPath) {
  const { spawn } = require('cross-spawn');

  try {
    // Check if git is available
    const gitCheck = spawn.sync('git', ['--version'], { stdio: 'ignore' });
    if (gitCheck.status !== 0) {
      console.log(chalk.yellow('Git not found, skipping repository initialization.'));
      return;
    }

    // Initialize git repository
    const gitInit = spawn.sync('git', ['init'], {
      cwd: projectPath,
      stdio: 'ignore',
      timeout: 5000, // 5 second timeout
    });

    if (gitInit.status === 0) {
      // Add initial commit
      spawn.sync('git', ['add', '.'], { 
        cwd: projectPath, 
        stdio: 'ignore',
        timeout: 10000 // 10 second timeout
      });
      
      spawn.sync('git', ['commit', '-m', 'Initial commit'], {
        cwd: projectPath,
        stdio: 'ignore',
        timeout: 10000 // 10 second timeout
      });

      console.log(chalk.green('✅ Initialized git repository'));
    }
  } catch (error) {
    console.log(chalk.yellow('Warning: Could not initialize git repository'));
    if (process.env.VERBOSE) {
      console.log(error);
    }
  }
}

// Export for testing
async function createApp(config, options = {}) {
  await validateProjectSetup(config);
  await createProject(config, options);
}

module.exports = { run, createApp };
