'use strict';

const spawn = require('cross-spawn');
const chalk = require('chalk');
const ora = require('ora');

async function installDependencies(projectPath, verbose = false, packageManager = 'npm') {
  const spinner = ora(`Installing dependencies with ${packageManager}...`).start();

  return new Promise((resolve, reject) => {
    const commands = {
      npm: ['install'],
      yarn: ['install'],
      pnpm: ['install'],
    };

    const command = packageManager;
    const args = commands[packageManager] || commands.npm;

    const child = spawn(command, args, {
      cwd: projectPath,
      stdio: verbose ? 'inherit' : 'pipe',
      env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' },
    });

    let output = '';

    if (!verbose) {
      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        output += data.toString();
      });
    }

    child.on('close', (code) => {
      if (code === 0) {
        spinner.succeed(`Dependencies installed successfully with ${packageManager}`);
        resolve();
      } else {
        spinner.fail(`Failed to install dependencies with ${packageManager}`);
        if (!verbose && output) {
          console.error(chalk.red(`${packageManager} output:`));
          console.error(output);
        }
        reject(new Error(`${packageManager} install failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      spinner.fail(`Failed to start ${packageManager}`);
      reject(error);
    });
  });
}

module.exports = { installDependencies };
