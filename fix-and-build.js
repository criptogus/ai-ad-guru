
// fix-and-build.js
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define environment variables
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION = 'true';
process.env.PUPPETEER_SKIP_BROWSER_DOWNLOAD = 'true';
process.env.PUPPETEER_PRODUCT = 'none';
process.env.BROWSER = 'none';
process.env.PUPPETEER_EXECUTABLE_PATH = '/bin/true';
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_PURE_JS = 'true';
process.env.JS_ONLY = 'true';
process.env.SKIP_BINARY_INSTALL = 'true';
process.env.BUILD_ONLY_JS = 'true';

console.log('📋 Starting build fix process...');

// Apply Puppeteer fix first
console.log('\n🔧 Step 1: Applying Puppeteer fix...');
try {
  await import('./puppeteer-fix.js');
  console.log('✅ Puppeteer fix applied successfully');
} catch (err) {
  console.error('❌ Error applying Puppeteer fix:', err);
}

// Apply a short delay to ensure file operations complete
await new Promise(resolve => setTimeout(resolve, 500));

// Apply Rollup fix second
console.log('\n🔧 Step 2: Applying Rollup fix...');
try {
  await import('./rollup-fix.js');
  console.log('✅ Rollup fix applied successfully');
} catch (err) {
  console.error('❌ Error applying Rollup fix:', err);
}

// Apply a short delay to ensure file operations complete
await new Promise(resolve => setTimeout(resolve, 500));

// Start build process
console.log('\n🚀 Step 3: Starting build process...');
try {
  execSync('cross-env PUPPETEER_SKIP_DOWNLOAD=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm run build:dev', { 
    stdio: 'inherit',
    env: {
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
      BUILD_ONLY_JS: 'true'
    }
  });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed even after fixes:', error);
  process.exit(1);
}
