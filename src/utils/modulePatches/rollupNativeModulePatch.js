/**
 * This module provides comprehensive mocks for Rollup native bindings 
 * to prevent errors when running in browser environments or when
 * native modules aren't available in the current platform
 */

// Complete list of all possible native bindings - explicit interface
export const mockNativeBindings = {
  '@rollup/rollup-linux-x64-gnu': { loadBinding: () => null },
  '@rollup/rollup-linux-x64-musl': { loadBinding: () => null },
  '@rollup/rollup-darwin-x64': { loadBinding: () => null },
  '@rollup/rollup-darwin-arm64': { loadBinding: () => null },
  '@rollup/rollup-win32-x64-msvc': { loadBinding: () => null },
  '@rollup/rollup-win32-ia32-msvc': { loadBinding: () => null },
  '@rollup/rollup-win32-arm64-msvc': { loadBinding: () => null },
  '@rollup/rollup-freebsd-x64': { loadBinding: () => null },
  // Add any other architectures that might be needed
};

// Standard mock object to return for any native module request
const standardMock = {
  bindings: null,
  isLoaded: false,
  load: () => null,
  needsRebuilding: () => false,
  getUuid: () => 'mocked-uuid',
  loadBinding: () => null
};

// Apply the patch 
export function applyRollupPatch() {
  try {
    console.log('[Rollup Patch] Starting Rollup native module patch application...');
    
    // Only run this code in Node.js environment (not in browser)
    if (typeof global !== 'undefined' && global.process && global.process.versions && global.process.versions.node) {
      console.log('[Rollup Patch] Detected Node.js environment, applying full patch');
      
      // Mock require for native modules (Node.js only)
      if (typeof module !== 'undefined' && module.constructor && module.constructor.prototype) {
        const Module = module.constructor;
        if (Module.prototype.require) {
          const originalRequire = Module.prototype.require;
          
          // Override require to handle native module requests
          Module.prototype.require = function(path) {
            // Check if this is a request for a Rollup native module
            if (path && (
                String(path).includes('@rollup/rollup-') || 
                String(path).endsWith('/native.js') || 
                String(path).includes('rollup/dist/native')
              )) {
              console.warn(`[Rollup Patch] Intercepting native module require: ${path}`);
              return standardMock;
            }
            
            // Otherwise, use the original require
            return originalRequire.apply(this, arguments);
          };
          
          console.log('[Rollup Patch] Node.js require() successfully patched for Rollup native modules');
        } else {
          console.log('[Rollup Patch] Module.prototype.require not found, skipping patch');
        }
      } else {
        console.log('[Rollup Patch] Module constructor not available, skipping Node.js patch');
      }
    } else {
      console.log('[Rollup Patch] Browser environment detected, using Vite aliases instead');
      
      // Set up global mocks for browser environment
      if (typeof window !== 'undefined') {
        Object.keys(mockNativeBindings).forEach(moduleName => {
          // @ts-ignore - This is intentional for browser environment
          window[moduleName] = standardMock;
        });
        console.log('[Rollup Patch] Added browser global mocks for native modules');
      }
    }
    
    console.log('[Rollup Patch] Rollup native module patch successfully applied');
    return true;
  } catch (error) {
    console.error('[Rollup Patch] Failed to apply Rollup patch:', error);
    // Try to continue even if patching fails
    return false;
  }
}
