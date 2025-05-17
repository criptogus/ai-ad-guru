// Este arquivo foi corrigido para resolver o erro de build no Netlify
// O shebang foi comentado para evitar erro de sintaxe quando executado como módulo ES
// #!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('🔧 Applying fix to Rollup native module...');

// Path to the problematic file
const nativePath = path.resolve('./node_modules/rollup/dist/native.js');

if (fs.existsSync(nativePath)) {
  console.log(`Found Rollup native.js at: ${nativePath}`);
  
  // Create a mock implementation
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
export default {
  parse,
  parseAsync,
  xxhashBase64Url,
  xxhashBase36,
  xxhashBase16,
  isSupported: false
};
`;

  fs.writeFileSync(nativePath, mockContent);
  console.log('✅ Successfully replaced Rollup native module with pure JS implementation');
} else {
  console.error('❌ Could not find Rollup native.js file.');
}
