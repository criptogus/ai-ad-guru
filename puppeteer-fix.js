
// puppeteer-fix.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set environment variables to skip downloads
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION = 'true';
process.env.PUPPETEER_SKIP_BROWSER_DOWNLOAD = 'true';
process.env.PUPPETEER_EXECUTABLE_PATH = '/bin/true';

console.log('Starting Puppeteer fix...');

// 1. Create mock Chrome and Chrome-headless-shell executables
const createMockExecutable = (dirPath, execName) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    
    const execPath = path.join(dirPath, execName);
    if (!fs.existsSync(execPath)) {
      fs.writeFileSync(execPath, '#!/bin/sh\necho "Mock Browser"', { mode: 0o755 });
      console.log(`Created mock executable: ${execPath}`);
    }
  } catch (err) {
    console.warn(`Warning: Failed to create mock executable ${execName}:`, err);
  }
};

// Mock Chrome executable
createMockExecutable('/root/.cache/puppeteer/chrome/linux-135.0.7049.114/chrome-linux64', 'chrome');

// Mock Chrome-headless-shell executable
createMockExecutable('/root/.cache/puppeteer/chrome-headless-shell/linux-135.0.7049.114', 'chrome-headless-shell');

// 2. Patch Puppeteer files
const patchPuppeteerFile = (filePath, searchPattern, replacement) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('PUPPETEER_PATCH_APPLIED')) {
      content = `// PUPPETEER_PATCH_APPLIED\n${content.replace(searchPattern, replacement)}`;
      fs.writeFileSync(filePath, content);
      console.log(`Patched: ${filePath}`);
      return true;
    } else {
      console.log(`Already patched: ${filePath}`);
      return false;
    }
  } else {
    console.warn(`Warning: File not found: ${filePath}`);
    return false;
  }
};

// Patch BrowserFetcher.js - skip executable check
patchPuppeteerFile(
  path.resolve('./node_modules/puppeteer/lib/esm/puppeteer/node/BrowserFetcher.js'),
  /if\s*\(!\w+\.existsSync\(executablePath\)\)/g,
  'if (false)'
);

// Patch install.js - skip browser download
try {
  const installPath = path.resolve('./node_modules/puppeteer/lib/esm/puppeteer/node/install.js');
  if (fs.existsSync(installPath)) {
    let content = fs.readFileSync(installPath, 'utf8');
    
    // Replace the entire downloadBrowsers function to do nothing
    if (!content.includes('INSTALL_PATCH_APPLIED')) {
      content = content.replace(
        /export async function downloadBrowsers\(\).*?\}/s,
        `export async function downloadBrowsers() {
  // INSTALL_PATCH_APPLIED - Skip browser download
  console.log('Skipping browser download - mock applied');
  return true;
}`
      );
      
      fs.writeFileSync(installPath, content);
      console.log('Patched puppeteer install.js - disabled browser downloads');
    }
  }
} catch (err) {
  console.warn('Warning: Failed to patch puppeteer install.js:', err);
}

console.log('Puppeteer fix completed');
