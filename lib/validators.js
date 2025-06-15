'use strict';

const fs = require('fs-extra');
const validatePackageName = require('validate-npm-package-name');

function validateProjectName(name) {
  const validation = validatePackageName(name);

  if (!validation.validForNewPackages) {
    return {
      valid: false,
      problems: [...(validation.errors || []), ...(validation.warnings || [])],
    };
  }

  // Additional checks
  const problems = [];

  if (name.length === 0) {
    problems.push('Project name cannot be empty');
  }

  if (name.match(/[A-Z]/)) {
    problems.push('Project name cannot contain uppercase letters');
  }

  if (name.startsWith('.') || name.startsWith('_')) {
    problems.push('Project name cannot start with . or _');
  }

  if (name.match(/\s/)) {
    problems.push('Project name cannot contain spaces');
  }

  return {
    valid: problems.length === 0,
    problems,
  };
}

async function checkWriteAccess(directory) {
  try {
    await fs.access(directory, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  validateProjectName,
  checkWriteAccess,
};
