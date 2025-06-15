'use strict';

const prompts = require('prompts');
const chalk = require('chalk');
const path = require('path');
const { validateProjectName } = require('./validators');

async function runPrompts(initialProjectDirectory, _options = {}) {
  console.log();

  const questions = [
    // Project name
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project named?',
      initial: initialProjectDirectory || 'my-electron-app',
      validate: (value) => {
        const validation = validateProjectName(value);
        return validation.valid || validation.problems[0];
      },
      format: (value) => value.trim(),
    },

    // TypeScript
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      initial: true,
    },

    // Tailwind CSS
    {
      type: 'confirm',
      name: 'tailwind',
      message: 'Would you like to use Tailwind CSS?',
      initial: true,
    },

    // React Router
    {
      type: 'confirm',
      name: 'router',
      message: 'Would you like to use React Router?',
      initial: false,
    },

    // ESLint
    {
      type: 'confirm',
      name: 'eslint',
      message: 'Would you like to use ESLint?',
      initial: true,
    },

    // Mac App Store
    {
      type: 'confirm',
      name: 'macAppStore',
      message: 'Would you like to include Mac App Store configuration?',
      initial: true,
    },

    // Example components
    {
      type: 'confirm',
      name: 'examples',
      message: 'Would you like to include example components?',
      initial: true,
    },

    // Package manager
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager would you like to use?',
      choices: [
        { title: 'npm', value: 'npm', description: 'Fast, reliable, and secure' },
        { title: 'yarn', value: 'yarn', description: 'Fast, reliable, and secure alternative' },
        { title: 'pnpm', value: 'pnpm', description: 'Fast, disk space efficient' },
      ],
      initial: 0,
    },
  ];

  // Handle Ctrl+C gracefully
  const onCancel = () => {
    console.log(chalk.yellow('\nOperation cancelled.'));
    process.exit(0);
  };

  const answers = await prompts(questions, { onCancel });

  // Construct configuration object
  const config = {
    projectName: answers.projectName,
    projectPath: path.resolve(answers.projectName),
    typescript: answers.typescript,
    tailwind: answers.tailwind,
    router: answers.router,
    eslint: answers.eslint,
    macAppStore: answers.macAppStore,
    examples: answers.examples,
    packageManager: answers.packageManager,
  };

  console.log();
  console.log(chalk.cyan('Creating your Electron app with the following configuration:'));
  console.log();
  console.log(`  ${chalk.bold('Project:')} ${config.projectName}`);
  console.log(`  ${chalk.bold('TypeScript:')} ${config.typescript ? 'Yes' : 'No'}`);
  console.log(`  ${chalk.bold('Tailwind CSS:')} ${config.tailwind ? 'Yes' : 'No'}`);
  console.log(`  ${chalk.bold('React Router:')} ${config.router ? 'Yes' : 'No'}`);
  console.log(`  ${chalk.bold('ESLint:')} ${config.eslint ? 'Yes' : 'No'}`);
  console.log(`  ${chalk.bold('Mac App Store:')} ${config.macAppStore ? 'Yes' : 'No'}`);
  console.log(`  ${chalk.bold('Examples:')} ${config.examples ? 'Yes' : 'No'}`);
  console.log(`  ${chalk.bold('Package Manager:')} ${config.packageManager}`);
  console.log();

  return config;
}

module.exports = { runPrompts };
