'use strict';

const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');

async function createProjectStructure(config) {
  const spinner = ora('Creating project structure...').start();

  try {
    // Create directory structure
    await createDirectories(config.projectPath);

    // Copy base template files
    await copyBaseTemplate(config);

    // Apply conditional templates based on configuration
    if (config.typescript) {
      await copyTypeScriptTemplate(config);
    } else {
      await copyJavaScriptTemplate(config);
    }

    if (config.tailwind) {
      await copyTailwindTemplate(config);
    }

    if (config.router) {
      await copyRouterTemplate(config);
    }

    if (config.eslint) {
      await copyESLintTemplate(config);
    }

    if (config.macAppStore) {
      await copyMacAppStoreTemplate(config);
    }

    if (config.examples) {
      await copyExampleComponents(config);
    }

    // Generate package.json
    await generatePackageJson(config);

    spinner.succeed('Project structure created');
  } catch (error) {
    spinner.fail('Failed to create project structure');
    throw error;
  }
}

async function createDirectories(projectPath) {
  const directories = [
    'src/main',
    'src/renderer/src/components',
    'src/renderer/src/styles',
    'src/renderer/public',
    'src/shared/types',
    'build',
  ];

  for (const dir of directories) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
}

async function copyBaseTemplate(config) {
  const basePath = path.join(TEMPLATE_DIR, 'base');
  const targetPath = config.projectPath;

  await copyTemplateFiles(basePath, targetPath, config);
}

async function copyTypeScriptTemplate(config) {
  const tsPath = path.join(TEMPLATE_DIR, 'typescript');
  const targetPath = config.projectPath;

  await copyTemplateFiles(tsPath, targetPath, config);
}

async function copyJavaScriptTemplate(config) {
  const jsPath = path.join(TEMPLATE_DIR, 'javascript');
  const targetPath = config.projectPath;

  await copyTemplateFiles(jsPath, targetPath, config);
}

async function copyTailwindTemplate(config) {
  const tailwindPath = path.join(TEMPLATE_DIR, 'tailwind');
  const targetPath = config.projectPath;

  await copyTemplateFiles(tailwindPath, targetPath, config);
}

async function copyRouterTemplate(config) {
  const routerPath = path.join(TEMPLATE_DIR, 'router');
  const targetPath = config.projectPath;

  await copyTemplateFiles(routerPath, targetPath, config);
}

async function copyESLintTemplate(config) {
  const eslintPath = path.join(TEMPLATE_DIR, 'eslint');
  const targetPath = config.projectPath;

  await copyTemplateFiles(eslintPath, targetPath, config);
}

async function copyMacAppStoreTemplate(config) {
  const masPath = path.join(TEMPLATE_DIR, 'mas');
  const targetPath = config.projectPath;

  await copyTemplateFiles(masPath, targetPath, config);
}

async function copyExampleComponents(config) {
  const examplesPath = path.join(TEMPLATE_DIR, 'examples');
  const targetPath = config.projectPath;

  await copyTemplateFiles(examplesPath, targetPath, config);
}

async function copyTemplateFiles(sourcePath, targetPath, config) {
  if (!(await fs.pathExists(sourcePath))) {
    return; // Skip if template doesn't exist
  }

  const files = await fs.readdir(sourcePath, { withFileTypes: true });

  for (const file of files) {
    const sourceFilePath = path.join(sourcePath, file.name);
    const targetFilePath = path.join(targetPath, file.name);

    if (file.isDirectory()) {
      await fs.ensureDir(targetFilePath);
      await copyTemplateFiles(sourceFilePath, targetFilePath, config);
    } else {
      let content = await fs.readFile(sourceFilePath, 'utf8');

      // Replace template variables
      content = replaceTemplateVariables(content, config);

      await fs.writeFile(targetFilePath, content);
    }
  }
}

function replaceTemplateVariables(content, config) {
  const variables = {
    PROJECT_NAME: config.projectName,
    PROJECT_NAME_CAMEL: toCamelCase(config.projectName),
    PROJECT_NAME_PASCAL: toPascalCase(config.projectName),
    APP_ID: `com.${config.projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}.app`,
    YEAR: new Date().getFullYear().toString(),
    TYPESCRIPT: config.typescript ? 'Enabled' : 'Disabled',
    TAILWIND: config.tailwind ? 'Enabled' : 'Disabled',
    ROUTER: config.router ? 'Enabled' : 'Disabled',
    ESLINT: config.eslint ? 'Enabled' : 'Disabled',
    MAC_APP_STORE: config.macAppStore ? 'Enabled' : 'Disabled',
  };

  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
}

async function generatePackageJson(config) {
  const packageData = {
    name: config.projectName,
    version: '1.0.0',
    description: `${config.projectName} - An Electron application`,
    main: config.typescript ? 'dist/main.js' : 'dist/main.js',
    homepage: './',
    author: '',
    license: 'MIT',
    scripts: getScripts(config),
    devDependencies: getDevDependencies(config),
    dependencies: getDependencies(config),
  };

  if (config.macAppStore) {
    packageData.build = getBuildConfig(config);
  }

  const packagePath = path.join(config.projectPath, 'package.json');
  await fs.writeFile(packagePath, JSON.stringify(packageData, null, 2));
}

function getScripts(config) {
  const scripts = {
    start: 'electron .',
    reset: 'node scripts/reset.js',
  };

  // Add webpack scripts for both JS and TS
  scripts['dev'] = 'concurrently "npm run dev:main" "npm run dev:renderer"';
  scripts['dev:main'] = 'webpack --config webpack.main.config.js --mode development --watch';
  scripts['dev:renderer'] = 'webpack serve --config webpack.renderer.config.js --mode development';
  scripts['build'] = 'npm run build:main && npm run build:renderer';
  scripts['build:main'] = 'webpack --config webpack.main.config.js --mode production';
  scripts['build:renderer'] = 'webpack --config webpack.renderer.config.js --mode production';

  if (config.typescript) {
    scripts['type-check'] = 'tsc --noEmit';
  }

  if (config.eslint) {
    scripts['lint'] = config.typescript
      ? 'eslint src --ext .ts,.tsx --fix'
      : 'eslint src --ext .js,.jsx --fix';
  }

  if (config.macAppStore) {
    scripts['dist:mas'] = 'npm run build && electron-builder --mac mas';
    scripts['dist:mas-dev'] = 'npm run build && electron-builder --mac mas-dev';
    scripts['postinstall'] = 'electron-builder install-app-deps';
  }

  return scripts;
}

function getDevDependencies(config) {
  const deps = {
    electron: '^28.0.0',
    concurrently: '^8.2.2',
    'fs-extra': '^11.2.0',
    prompts: '^2.4.2',
    chalk: '^4.1.2',
    // Webpack dependencies for all projects
    webpack: '^5.89.0',
    'webpack-cli': '^5.1.4',
    'webpack-dev-server': '^4.15.1',
    'html-webpack-plugin': '^5.5.3',
    'babel-loader': '^9.1.3',
    '@babel/core': '^7.23.0',
    '@babel/preset-env': '^7.23.0',
    '@babel/preset-react': '^7.22.0',
  };

  if (config.typescript) {
    Object.assign(deps, {
      '@types/node': '^20.10.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      typescript: '^5.3.0',
      'ts-loader': '^9.5.1',
    });
  }

  if (config.tailwind) {
    Object.assign(deps, {
      tailwindcss: '^3.3.6',
      autoprefixer: '^10.4.16',
      postcss: '^8.4.32',
      'postcss-loader': '^7.3.3',
      'css-loader': '^6.8.1',
      'style-loader': '^3.3.3',
    });
  }

  if (config.eslint) {
    Object.assign(deps, {
      eslint: '^8.55.0',
      'eslint-plugin-react': '^7.33.0',
      'eslint-plugin-react-hooks': '^4.6.0',
    });

    if (config.typescript) {
      Object.assign(deps, {
        '@typescript-eslint/eslint-plugin': '^6.0.0',
        '@typescript-eslint/parser': '^6.0.0',
      });
    }
  }

  if (config.macAppStore) {
    deps['electron-builder'] = '^24.13.3';
  }

  return deps;
}

function getDependencies(config) {
  const deps = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
  };

  if (config.router) {
    deps['react-router-dom'] = '^6.20.0';
  }

  if (config.tailwind) {
    deps['clsx'] = '^2.0.0';
  }

  return deps;
}

function getBuildConfig(config) {
  return {
    appId: `com.${config.projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}.app`,
    productName: config.projectName,
    directories: {
      output: 'release',
      buildResources: 'build',
    },
    files: [config.typescript ? 'dist/**/*' : 'src/**/*', 'package.json'],
    mac: {
      category: 'public.app-category.productivity',
      icon: 'build/icon.icns',
      hardenedRuntime: false,
      gatekeeperAssess: false,
    },
    mas: {
      type: 'distribution',
      entitlements: 'build/entitlements.mas.plist',
      entitlementsInherit: 'build/entitlements.mas.inherit.plist',
      provisioningProfile: 'embedded.provisionprofile',
    },
  };
}

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
}

function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
}

module.exports = { createProjectStructure };
