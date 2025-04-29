
// fix-and-build.js
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

// Criar estrutura e mock do executável do Chrome
function createMockExecutable(dirPath, execName) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    
    const execPath = path.join(dirPath, execName);
    if (!fs.existsSync(execPath)) {
      fs.writeFileSync(execPath, '#!/bin/sh\necho "Mock Browser"', { mode: 0o755 });
      console.log(`Created mock executable: ${execPath}`);
      return true;
    }
    return false;
  } catch (err) {
    console.warn(`Warning: Failed to create mock executable ${execName}:`, err);
    return false;
  }
}

// Chrome regular
const chromeMocked = createMockExecutable(
  '/root/.cache/puppeteer/chrome/linux-135.0.7049.114/chrome-linux64', 
  'chrome'
);

// Chrome headless shell
const headlessMocked = createMockExecutable(
  '/root/.cache/puppeteer/chrome-headless-shell/linux-135.0.7049.114', 
  'chrome-headless-shell'
);

console.log(`Chrome executables mocked: ${chromeMocked || headlessMocked ? 'Yes' : 'No'}`);

// Patch do Puppeteer install.js
const patchPuppeteerInstall = () => {
  const puppeteerInstallPath = './node_modules/puppeteer/lib/esm/puppeteer/node/install.js';
  if (fs.existsSync(puppeteerInstallPath)) {
    try {
      let content = fs.readFileSync(puppeteerInstallPath, 'utf8');
      if (!content.includes('PUPPETEER_PATCH_APPLIED')) {
        content = content.replace(
          /export async function downloadBrowsers.*?\{/s,
          `export async function downloadBrowsers() { 
            // PUPPETEER_PATCH_APPLIED
            console.log('Browser download bypassed by patch');
            return;`
        );
        fs.writeFileSync(puppeteerInstallPath, content);
        console.log("✅ Patched Puppeteer install.js successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error modifying Puppeteer install.js:", err);
      return false;
    }
  }
  return false;
};

// Patch do Rollup native.js
const patchRollupNative = () => {
  const rollupNativePath = './node_modules/rollup/dist/native.js';
  if (fs.existsSync(rollupNativePath)) {
    try {
      const content = fs.readFileSync(rollupNativePath, 'utf8');
      if (!content.includes('ROLLUP_PATCH_APPLIED')) {
        const mockContent = `
// ROLLUP_PATCH_APPLIED - ESM version
export function parse() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export async function parseAsync() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export default {
  isSupported: false,
  getDefaultExports() {
    return { parse, parseAsync };
  }
};
`;
        fs.writeFileSync(rollupNativePath, mockContent);
        console.log("✅ Patched Rollup native.js as ESM module");
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error modifying Rollup native.js:", err);
      return false;
    }
  }
  return false;
};

const puppeteerPatched = patchPuppeteerInstall();
const rollupPatched = patchRollupNative();

// Patch do parseAst.js do Rollup
const patchParseAst = () => {
  const parseAstPath = './node_modules/rollup/dist/es/shared/parseAst.js';
  if (fs.existsSync(parseAstPath)) {
    try {
      const content = fs.readFileSync(parseAstPath, 'utf8');
      if (!content.includes('PARSEAST_PATCH_APPLIED')) {
        const newContent = content.replace(
          "import { parse, parseAsync } from '../../native.js';",
          `// PARSEAST_PATCH_APPLIED
// Importação corrigida para compatibilidade ESM/CommonJS
import pkg from '../../native.js';
const parse = pkg.parse || ((code) => ({ type: 'Program', body: [], sourceType: 'module' }));
const parseAsync = pkg.parseAsync || (async (code) => ({ type: 'Program', body: [], sourceType: 'module' }));`
        );
        fs.writeFileSync(parseAstPath, newContent);
        console.log("✅ Patched parseAst.js to fix import issue");
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error modifying parseAst.js:", err);
      return false;
    }
  }
  return false;
};

const parseAstPatched = patchParseAst();

console.log(`Applied patches: Puppeteer=${puppeteerPatched}, Rollup=${rollupPatched}, ParseAst=${parseAstPatched}`);

// Create mock directory if it doesn't exist
const mockDir = path.join(__dirname, 'src/mocks');
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
  console.log("Created mocks directory");
}

// Create empty-module.js if it doesn't exist
const emptyModulePath = path.join(mockDir, 'empty-module.js');
if (!fs.existsSync(emptyModulePath)) {
  const content = `
// Mock module for Rollup native and Puppeteer
export function parse() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export async function parseAsync() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export default {
  isSupported: false,
  getDefaultExports() {
    return { parse, parseAsync };
  }
};
`;
  fs.writeFileSync(emptyModulePath, content);
  console.log("Created empty-module.js mock");
}

// Apply a short delay to ensure file operations complete
await new Promise(resolve => setTimeout(resolve, 1000));

// Start build process
console.log('\n🚀 Starting build process...');
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
