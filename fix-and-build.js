
// fix-and-build.js
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define as variáveis de ambiente
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

console.log('Applying Puppeteer fix...');
import('./puppeteer-fix.js').catch(err => {
  console.error('Error applying Puppeteer fix:', err);
});

console.log('Applying Rollup fix...');
import('./rollup-fix.js').catch(err => {
  console.error('Error applying Rollup fix:', err);
});

console.log('Starting build process...');
try {
  execSync('npm run build:dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed even after fixes. Additional debugging may be required.');
  process.exit(1);
}
