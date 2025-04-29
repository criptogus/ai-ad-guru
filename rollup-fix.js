
// rollup-fix.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set environment variables
process.env.ROLLUP_PURE_JS = 'true';
process.env.ROLLUP_NATIVE = 'false';

console.log('Starting Rollup fix...');

// Caminho para o arquivo do Rollup que está causando o erro
const rollupNativePath = path.resolve('./node_modules/rollup/dist/native.js');

try {
  if (fs.existsSync(rollupNativePath)) {
    // Completely replace the native.js file with a mock implementation
    const mockContent = `// ROLLUP_PATCH_APPLIED
/**
 * This is a mock implementation to avoid native module errors
 */

const mockNative = {
  isSupported: false,
  getDefaultExports() {
    return {};
  }
};

// Export the mock implementation
module.exports = mockNative;
`;
    
    // Write the mock content to the file
    fs.writeFileSync(rollupNativePath, mockContent);
    console.log('Replaced Rollup native module with mock implementation');
  } else {
    console.warn('Warning: Rollup native.js file not found');
  }
} catch (err) {
  console.error('Error patching Rollup:', err);
}

console.log('Rollup fix completed');
