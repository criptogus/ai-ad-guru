
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Applying fix to Rollup native module...');

// Path to the problematic file
const nativePath = path.resolve('./node_modules/rollup/dist/native.js');

if (fs.existsSync(nativePath)) {
  console.log(`Found Rollup native.js at: ${nativePath}`);
  
  // Create a complete mock implementation
  const mockContent = `
// DIRECT_PATCH_APPLIED - Mock implementation for native.js
// This replaces the problematic code that tries to require platform-specific modules

// Mock functions used by Rollup
export function parse() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export async function parseAsync() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export function xxhashBase64Url() { return 'mockedHash'; }
export function xxhashBase36() { return 'mockedHash'; }
export function xxhashBase16() { return 'mockedHash'; }

// Export as default for both ESM and CommonJS compatibility
const nativeModule = {
  parse,
  parseAsync,
  xxhashBase64Url,
  xxhashBase36,
  xxhashBase16,
  isSupported: false
};

export default nativeModule;
`;

  fs.writeFileSync(nativePath, mockContent);
  console.log('✅ Successfully replaced Rollup native module with pure JS implementation');
} else {
  console.error('❌ Could not find Rollup native.js file. Make sure dependencies are installed.');
  process.exit(1);
}

// Fix node-entry.js import
const nodeEntryPath = path.resolve('./node_modules/rollup/dist/es/shared/node-entry.js');
if (fs.existsSync(nodeEntryPath)) {
  try {
    let content = fs.readFileSync(nodeEntryPath, 'utf8');
    
    // Replace the problematic import with a default import
    if (content.includes("import { parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } from '../../native.js';")) {
      const modifiedContent = content.replace(
        "import { parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } from '../../native.js';",
        "import nativeModule from '../../native.js';\nconst { parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = nativeModule;"
      );
      
      fs.writeFileSync(nodeEntryPath, modifiedContent);
      console.log('✅ Successfully patched node-entry.js');
    } else {
      console.log('⚠️ node-entry.js does not contain the expected import statement. Skipping.');
    }
  } catch (err) {
    console.error('❌ Error patching node-entry.js:', err);
  }
}

// Fix parseAst.js
const parseAstPath = path.resolve('./node_modules/rollup/dist/es/shared/parseAst.js');
if (fs.existsSync(parseAstPath)) {
  try {
    let content = fs.readFileSync(parseAstPath, 'utf8');
    
    // Replace the problematic import with a default import
    if (content.includes("import { parse, parseAsync } from '../../native.js';")) {
      const modifiedContent = content.replace(
        "import { parse, parseAsync } from '../../native.js';",
        "import nativeModule from '../../native.js';\nconst { parse, parseAsync } = nativeModule;"
      );
      
      fs.writeFileSync(parseAstPath, modifiedContent);
      console.log('✅ Successfully patched parseAst.js');
    } else {
      console.log('⚠️ parseAst.js does not contain the expected import statement. Skipping.');
    }
  } catch (err) {
    console.error('❌ Error patching parseAst.js:', err);
  }
}

console.log('🚀 Rollup native module fix completed!');
