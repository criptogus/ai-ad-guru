/**
 * This module provides robust mocks for Rollup native bindings 
 * to prevent errors when running in browser environments or when
 * native modules aren't available in the current platform
 */

// Complete list of all possible native bindings
export const mockNativeBindings = {
  '@rollup/rollup-linux-x64-gnu': {},
  '@rollup/rollup-linux-x64-musl': {},
  '@rollup/rollup-darwin-x64': {},
  '@rollup/rollup-darwin-arm64': {},
  '@rollup/rollup-win32-x64-msvc': {},
  '@rollup/rollup-win32-ia32-msvc': {},
  '@rollup/rollup-win32-arm64-msvc': {},
  '@rollup/rollup-freebsd-x64': {},
  // Add any other architectures that might be needed
};

// Apply the patch 
export function applyRollupPatch() {
  try {
    console.log('[Rollup Patch] Starting Rollup native module patch application...');
    
    // Only run this code in Node.js environment (not in browser)
    if (typeof global !== 'undefined' && global.process && global.process.versions && global.process.versions.node) {
      console.log('[Rollup Patch] Detected Node.js environment, applying full patch');
      
      // Mock require for native modules (Node.js only)
      const Module = module.constructor;
      const originalRequire = Module.prototype.require;
      
      // Override require to handle native module requests
      Module.prototype.require = function(path) {
        // Check if this is a request for a Rollup native module
        if (path.includes('@rollup/rollup-') || path.endsWith('/native.js')) {
          console.warn(`[Rollup Patch] Intercepting native module require: ${path}`);
          
          // Return a minimal mock that provides the essential functionality
          return { 
            bindings: null,
            isLoaded: false,
            load: () => null,
            needsRebuilding: () => false,
            getUuid: () => 'mocked-uuid',
            // Add other functions that might be called by rollup
            loadBinding: () => null
          };
        }
        
        // Otherwise, use the original require
        return originalRequire.apply(this, arguments);
      };
      
      console.log('[Rollup Patch] Node.js require() successfully patched for Rollup native modules');
    } else {
      console.log('[Rollup Patch] Browser environment detected, using Vite aliases instead');
    }
    
    console.log('[Rollup Patch] Rollup native module patch successfully applied');
    return true;
  } catch (error) {
    console.error('[Rollup Patch] Failed to apply Rollup patch:', error);
    // Try to continue even if patching fails
    return false;
  }
}
