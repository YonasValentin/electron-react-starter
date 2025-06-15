'use strict';

const chalk = require('chalk');

function logIntro() {
  console.log();
  console.log(chalk.cyan('✨ Welcome to create-electron-app!'));
  console.log();
  console.log('This utility will walk you through creating a new Electron application.');
  console.log('Press ^C at any time to quit.');
  console.log();
}

function logSuccess(config) {
  const { projectName, projectPath } = config;

  console.log();
  console.log(
    chalk.green('✨ Success!'),
    `Created ${chalk.cyan(projectName)} at ${chalk.cyan(projectPath)}`
  );
  console.log();
  console.log('Inside that directory, you can run several commands:');
  console.log();

  if (config.typescript) {
    console.log(chalk.cyan('  npm run dev'));
    console.log('    Starts the development servers with hot reload');
    console.log();
    console.log(chalk.cyan('  npm run build'));
    console.log('    Builds the app for production');
    console.log();
  }

  console.log(chalk.cyan('  npm start'));
  console.log('    Starts Electron with the built app');
  console.log();

  if (config.eslint) {
    console.log(chalk.cyan('  npm run lint'));
    console.log('    Lints and fixes code style issues');
    console.log();
  }

  if (config.macAppStore) {
    console.log(chalk.cyan('  npm run dist:mas'));
    console.log('    Builds and packages for Mac App Store');
    console.log();
  }

  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), projectName);
  console.log(chalk.cyan('  npm run dev'));
  console.log();
  console.log(chalk.green('Happy coding! 🚀'));
  console.log();
}

function logError(error) {
  console.log();
  console.error(chalk.red('Error:'), error.message);
  console.log();
}

function ensureCleanExit() {
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\nOperation cancelled.'));
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log(chalk.yellow('\nOperation terminated.'));
    process.exit(0);
  });
}

module.exports = {
  logIntro,
  logSuccess,
  logError,
  ensureCleanExit,
};
