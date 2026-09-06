#!/usr/bin/env node

/**
 * SafetyHub Setup Verification Script
 * Checks all prerequisites and configurations before deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description} - NOT FOUND`, 'red');
    return false;
  }
}

function checkCommand(command, description) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    log(`✓ ${description}`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${description} - NOT INSTALLED`, 'red');
    return false;
  }
}

function checkEnvVariable(variable, description) {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    if (content.includes(variable)) {
      log(`✓ ${description}`, 'green');
      return true;
    }
  }
  log(`✗ ${description} - NOT SET`, 'red');
  return false;
}

function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         SafetyHub - Setup Verification Script              ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  let allChecks = true;

  // System Requirements
  log('📋 System Requirements:', 'blue');
  allChecks &= checkCommand('node', 'Node.js');
  allChecks &= checkCommand('npm', 'npm');
  log('');

  // Project Files
  log('📁 Project Files:', 'blue');
  allChecks &= checkFile('package.json', 'package.json');
  allChecks &= checkFile('next.config.js', 'next.config.js');
  allChecks &= checkFile('tailwind.config.js', 'tailwind.config.js');
  allChecks &= checkFile('app/page.js', 'app/page.js (Main component)');
  allChecks &= checkFile('app/layout.js', 'app/layout.js (Layout)');
  allChecks &= checkFile('app/api/[[...path]]/route.js', 'API routes');
  log('');

  // Environment Configuration
  log('⚙️  Environment Configuration:', 'blue');
  allChecks &= checkFile('.env.local', '.env.local file');
  allChecks &= checkEnvVariable('MONGO_URL', 'MONGO_URL');
  allChecks &= checkEnvVariable('DB_NAME', 'DB_NAME');
  allChecks &= checkEnvVariable('JWT_SECRET', 'JWT_SECRET');
  log('');

  // Dependencies
  log('📦 Dependencies:', 'blue');
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log('✓ node_modules directory exists', 'green');
  } else {
    log('✗ node_modules directory NOT FOUND - Run: npm install', 'red');
    allChecks = false;
  }
  log('');

  // Summary
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  if (allChecks) {
    log('║                  ✓ ALL CHECKS PASSED                       ║', 'cyan');
    log('║                                                            ║', 'cyan');
    log('║  You can now start the development server:                ║', 'cyan');
    log('║                                                            ║', 'cyan');
    log('║              npm run dev                                   ║', 'cyan');
    log('║                                                            ║', 'cyan');
    log('║  Then open: http://localhost:3000                         ║', 'cyan');
  } else {
    log('║              ✗ SOME CHECKS FAILED                         ║', 'cyan');
    log('║                                                            ║', 'cyan');
    log('║  Please fix the issues above before proceeding.           ║', 'cyan');
    log('║  See DEPLOYMENT_GUIDE.md for detailed instructions.       ║', 'cyan');
  }
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  process.exit(allChecks ? 0 : 1);
}

main();
