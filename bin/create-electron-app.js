#!/usr/bin/env node

'use strict';

// Check Node.js version first
const semver = require('semver');
const chalk = require('chalk');
const packageJson = require('../package.json');

const currentNodeVersion = process.versions.node;
const requiredNodeVersion = packageJson.engines.node;

if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
  console.error(
    chalk.red(
      `You are running Node ${currentNodeVersion}.\n` +
        `create-electron-app requires Node ${requiredNodeVersion}.\n` +
        `Please update your version of Node.`
    )
  );
  process.exit(1);
}

// Import and run main function
require('../lib/create-app')
  .run()
  .catch((error) => {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  });
