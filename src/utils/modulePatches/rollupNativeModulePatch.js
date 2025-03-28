
/**
 * This module provides a comprehensive mock for @rollup native bindings
 * to prevent errors during build in environments without native module support
 */

// Mock object to return for native module imports
const createMockBinding = (moduleName) => ({
  name: moduleName,
  isLoaded: false,
  load: () => null,
  needsRebuilding: () => false,
  bindings: null,
  getUuid: () => 'mocked-uuid-for-' + moduleName,
  loadBinding: () => null,
  generate: () => ({ output: [] }),
  rollup: () => ({
    generate: () => Promise.resolve({ output: [] }),
    write: () => Promise.resolve({ output: [] }),
    close: () => Promise.resolve()
  })
});

// List of all Rollup native modules to mock
const NATIVE_MODULE_PATTERNS = [
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64',
  '@rollup/rollup-win32-x64-msvc',
  'rollup/dist/native',
  // Add other patterns as needed
];

// Apply the patch to module loading system
const applyRollupPatch = () => {
  if (typeof window === 'undefined' && typeof module !== 'undefined') {
    try {
      // Only patch in Node.js environment
      const originalRequire = module.constructor.prototype.require;
      
      module.constructor.prototype.require = function patchedRequire(modulePath) {
        // Check if the requested module matches any of our patterns
        if (NATIVE_MODULE_PATTERNS.some(pattern => 
          typeof modulePath === 'string' && modulePath.includes(pattern)
        )) {
          console.warn(`[Module Patch] Bypassing native module load attempt: ${modulePath}`);
          return createMockBinding(modulePath);
        }
        
        // Default behavior for all other modules
        return originalRequire.apply(this, arguments);
      };
      
      console.info('[Module Patch] Successfully applied Rollup native module patch');
    } catch (error) {
      console.warn('[Module Patch] Failed to apply patch:', error);
    }
  }
};

// Export a module patch that can be used by rollup.config.js
exports.mockNativeBindings = {
  '@rollup/rollup-linux-x64-gnu': createMockBinding('@rollup/rollup-linux-x64-gnu'),
  '@rollup/rollup-darwin-x64': createMockBinding('@rollup/rollup-darwin-x64'),
  '@rollup/rollup-darwin-arm64': createMockBinding('@rollup/rollup-darwin-arm64'),
  '@rollup/rollup-win32-x64-msvc': createMockBinding('@rollup/rollup-win32-x64-msvc')
};

// Apply the patch immediately when this module is loaded
applyRollupPatch();

// Also export the function for explicit usage
exports.applyRollupPatch = applyRollupPatch;
