#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const prompts = require('prompts');

const filesToRemove = [
  'src/renderer/src/App.jsx',
  'src/renderer/src/App.tsx',
  'src/renderer/src/components',
  'README.md'
];

const cleanAppTemplate = `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hello World
        </h1>
        <p className="text-gray-600">
          Start building your Electron app here!
        </p>
      </div>
    </div>
  );
}

export default App;`;

const cleanReadme = `# {{PROJECT_NAME}}

A clean Electron application.

## Getting Started

\`\`\`bash
npm run dev
\`\`\`
`;

async function resetProject() {
  console.log(chalk.cyan('🧹 Reset Project'));
  console.log();
  console.log('This will remove example code and give you a clean slate to start building.');
  console.log();

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Are you sure you want to reset the project?',
    initial: false
  });

  if (!confirm) {
    console.log(chalk.yellow('Reset cancelled.'));
    return;
  }

  try {
    console.log(chalk.blue('Removing example files...'));
    
    // Remove example components directory if it exists
    const componentsDir = path.join(process.cwd(), 'src/renderer/src/components');
    if (await fs.pathExists(componentsDir)) {
      await fs.remove(componentsDir);
      console.log(chalk.gray('  ✓ Removed example components'));
    }

    // Check if using TypeScript or JavaScript
    const tsAppPath = path.join(process.cwd(), 'src/renderer/src/App.tsx');
    const jsAppPath = path.join(process.cwd(), 'src/renderer/src/App.jsx');
    const isTypeScript = await fs.pathExists(tsAppPath);
    
    // Replace App component with clean version
    const appPath = isTypeScript ? tsAppPath : jsAppPath;
    const appExtension = isTypeScript ? 'tsx' : 'jsx';
    
    if (await fs.pathExists(appPath)) {
      const cleanApp = cleanAppTemplate.replace('App.jsx', `App.${appExtension}`);
      await fs.writeFile(appPath, cleanApp);
      console.log(chalk.gray('  ✓ Reset App component'));
    }

    // Replace README with clean version
    const readmePath = path.join(process.cwd(), 'README.md');
    if (await fs.pathExists(readmePath)) {
      // Try to get project name from package.json
      let projectName = 'My Electron App';
      try {
        const packageJson = await fs.readJson(path.join(process.cwd(), 'package.json'));
        projectName = packageJson.name || projectName;
      } catch (e) {
        // Ignore error
      }
      
      const cleanReadmeContent = cleanReadme.replace('{{PROJECT_NAME}}', projectName);
      await fs.writeFile(readmePath, cleanReadmeContent);
      console.log(chalk.gray('  ✓ Reset README.md'));
    }

    console.log();
    console.log(chalk.green('✨ Project reset successfully!'));
    console.log();
    console.log('Your project is now clean and ready for development.');
    console.log(chalk.cyan('Run npm run dev to start building!'));
    console.log();

  } catch (error) {
    console.error(chalk.red('Error resetting project:'), error.message);
    process.exit(1);
  }
}

resetProject();