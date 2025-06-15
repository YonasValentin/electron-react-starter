const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');
const { createApp } = require('../../lib/create-app');

describe('create-electron-app integration', () => {
  let tmpDir;
  
  beforeEach(() => {
    tmpDir = tmp.dirSync({ unsafeCleanup: true });
  });
  
  afterEach(() => {
    tmpDir.removeCallback();
  });
  
  test('creates TypeScript + Tailwind project', async () => {
    const projectPath = path.join(tmpDir.name, 'test-app');
    
    // Direct function call with config instead of interactive prompts
    const config = {
      projectName: 'test-app',
      projectPath: projectPath,
      typescript: true,
      tailwind: true,
      router: false,
      eslint: true,
      macAppStore: true,
      examples: true,
      packageManager: 'npm'
    };
    
    // Create the app directly
    await createApp(config, { skipInstall: true, skipGit: true });
    
    // Verify files were created
    expect(fs.existsSync(path.join(projectPath, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'tsconfig.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'tailwind.config.js'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'src/main/main.ts'))).toBe(true);
    
    // Verify package.json content
    const packageJson = fs.readJsonSync(path.join(projectPath, 'package.json'));
    expect(packageJson.name).toBe('test-app');
    expect(packageJson.devDependencies.typescript).toBeDefined();
    expect(packageJson.devDependencies.tailwindcss).toBeDefined();
  }, 30000);
});