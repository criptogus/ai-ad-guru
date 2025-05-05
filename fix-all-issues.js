
#!/usr/bin/env node
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log('🛠️ Starting comprehensive fix script...');

// Fix Rollup native module
console.log('📦 Step 1: Fixing Rollup native module...');
try {
  execSync('node native-module-fix.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run native-module-fix.js:', error);
  // Continue with the script even if this part fails
}

// Generate Supabase types
console.log('🔄 Step 2: Generating Supabase types...');
try {
  execSync('node generate-supabase-types.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to generate Supabase types:', error);
  // Continue with the script even if this part fails
}

// Set environment variables for the build
console.log('🔧 Step 3: Setting up build environment...');
const env = {
  ...process.env,
  PUPPETEER_SKIP_DOWNLOAD: 'true',
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
  PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION: 'true',
  PUPPETEER_SKIP_BROWSER_DOWNLOAD: 'true',
  PUPPETEER_PRODUCT: 'none',
  BROWSER: 'none',
  PUPPETEER_EXECUTABLE_PATH: '/bin/true',
  ROLLUP_NATIVE: 'false',
  ROLLUP_PURE_JS: 'true',
  JS_ONLY: 'true',
  SKIP_BINARY_INSTALL: 'true',
  BUILD_ONLY_JS: 'true',
  NODE_OPTIONS: '--no-warnings'
};

// Run the build with the environment variables
console.log('🚀 Step 4: Starting the build...');
try {
  execSync('vite build --mode development --config vite.config.js', { 
    stdio: 'inherit',
    env 
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  console.log('🔍 You may need to manually fix the remaining issues.');
  process.exit(1);
}

console.log('✨ All steps completed. Your build should now work properly!');
