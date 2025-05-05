
// fix-build.js
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define environment variables to skip problematic dependencies
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION = 'true';
process.env.ROLLUP_NATIVE = 'false';

// Import and run the node modules patch
console.log('Running Node modules patch...');
import('./node_modules_patch.js')
  .then(() => {
    console.log('Patch applied successfully, starting build...');
    
    // Run the build
    try {
      execSync('npm run build:dev', {
        stdio: 'inherit',
        env: {
          ...process.env,
          PUPPETEER_SKIP_DOWNLOAD: 'true',
          PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
          PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION: 'true',
          ROLLUP_NATIVE: 'false',
          NODE_OPTIONS: '--no-warnings'
        }
      });
      console.log('Build completed successfully!');
    } catch (error) {
      console.error('Build failed:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Error applying patch:', error);
    process.exit(1);
  });
