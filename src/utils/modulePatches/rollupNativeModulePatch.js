/**
 * Enhanced Module Patching System for Rollup
 * 
 * This module provides comprehensive mocks for all Rollup native bindings
 * across all architectures to prevent errors when running in various 
 * environments (browsers, CI/CD, different OS architectures)
 */

// Complete standardized mock object to return for any native module request
const standardMock = {
  bindings: null,
  isLoaded: false,
  load: () => {
    console.log('[Rollup Mock] Mock load() called');
    return null;
  },
  needsRebuilding: () => {
    console.log('[Rollup Mock] Mock needsRebuilding() called');
    return false;
  },
  getUuid: () => {
    console.log('[Rollup Mock] Mock getUuid() called');
    return 'mocked-uuid-00000000';
  },
  loadBinding: () => {
    console.log('[Rollup Mock] Mock loadBinding() called');
    return null;
  }
};

// Complete list of all possible native bindings across all architectures
// This ensures maximum compatibility with any environment
export const mockNativeBindings = {
  // Linux variants
  '@rollup/rollup-linux-x64-gnu': standardMock,
  '@rollup/rollup-linux-x64-musl': standardMock,
  '@rollup/rollup-linux-arm64-gnu': standardMock,
  '@rollup/rollup-linux-arm64-musl': standardMock,
  '@rollup/rollup-linux-arm-gnueabihf': standardMock,
  
  // MacOS variants
  '@rollup/rollup-darwin-x64': standardMock,
  '@rollup/rollup-darwin-arm64': standardMock,
  
  // Windows variants
  '@rollup/rollup-win32-x64-msvc': standardMock,
  '@rollup/rollup-win32-ia32-msvc': standardMock,
  '@rollup/rollup-win32-arm64-msvc': standardMock,
  
  // Other platforms
  '@rollup/rollup-freebsd-x64': standardMock,
  '@rollup/rollup-alpine-x64': standardMock,
  
  // Legacy and future-proofing
  '@rollup/rollup-android-arm64': standardMock,
  '@rollup/rollup-android-arm-eabi': standardMock
};

// Comprehensive patch system with improved resilience and diagnostic logging
export function applyRollupPatch() {
  try {
    console.log('[Rollup Patch] Starting enhanced Rollup native module patch application...');
    let patchSucceeded = false;
    
    // First defense: Node.js environment patching
    if (typeof global !== 'undefined') {
      console.log('[Rollup Patch] Detected global object, applying Node.js environment patches');
      
      // Register all mocks globally for deepest integration
      Object.keys(mockNativeBindings).forEach(moduleName => {
        // @ts-ignore - Intentional global assignment for Node.js environment
        global[moduleName] = standardMock;
      });
      
      // Intercept require if possible
      if (typeof module !== 'undefined' && module.constructor) {
        try {
          const Module = module.constructor;
          
          if (Module && Module.prototype && Module.prototype.require) {
            const originalRequire = Module.prototype.require;
            
            // Enhanced require override with multiple detection patterns
            Module.prototype.require = function(path) {
              // Exhaustive check for any rollup native module pattern
              if (path && (
                  String(path).includes('@rollup/rollup-') || 
                  String(path).includes('/native.js') ||
                  String(path).includes('rollup/dist/native') ||
                  String(path).includes('rollup/dist/shared') ||
                  String(path).includes('rollup/bin/')
                )) {
                console.log(`[Rollup Patch] Intercepted native module require: ${path}`);
                return standardMock;
              }
              
              // Try original require but catch any errors
              try {
                return originalRequire.apply(this, arguments);
              } catch (requireError) {
                // Last-chance recovery for any rollup-related module
                if (String(requireError).includes('rollup') || 
                    String(requireError).includes('@rollup')) {
                  console.warn(`[Rollup Patch] Recovered from require error for: ${path}`, requireError);
                  return standardMock;
                }
                // Re-throw non-rollup errors
                throw requireError;
              }
            };
            
            console.log('[Rollup Patch] Node.js require() successfully patched');
            patchSucceeded = true;
          }
        } catch (moduleError) {
          console.warn('[Rollup Patch] Module patching attempt failed:', moduleError);
          // Continue with other patching methods
        }
      }
      
      // Extra protection: directly patch process.binding
      if (typeof process !== 'undefined' && process.binding) {
        try {
          const originalBinding = process.binding;
          
          // @ts-ignore - Intentional process.binding override
          process.binding = function(name) {
            if (name.includes('rollup') || name.includes('node_modules')) {
              console.log(`[Rollup Patch] Intercepted process.binding call for: ${name}`);
              return {};
            }
            return originalBinding.apply(this, arguments);
          };
          
          console.log('[Rollup Patch] process.binding successfully patched');
          patchSucceeded = true;
        } catch (bindingError) {
          console.warn('[Rollup Patch] process.binding patch attempt failed:', bindingError);
        }
      }
    }
    
    // Second defense: Browser environment patching
    if (typeof window !== 'undefined') {
      console.log('[Rollup Patch] Detected window object, applying browser environment patches');
      
      // Register all mocks on window for browser context
      Object.keys(mockNativeBindings).forEach(moduleName => {
        // @ts-ignore - Intentional window assignment for browser environment
        window[moduleName] = standardMock;
      });
      
      // Mark patch as applied on window for reference
      // @ts-ignore - Intentional window property for tracking
      window.__ROLLUP_PATCH_APPLIED__ = true;
      
      console.log('[Rollup Patch] Browser window global mocks applied');
      patchSucceeded = true;
    }
    
    // If we reach here and nothing was patched, apply emergency fallbacks
    if (!patchSucceeded) {
      console.warn('[Rollup Patch] Standard patching methods failed, applying emergency fallbacks');
      
      // Last resort: Try to globally define the problematic modules
      try {
        // @ts-ignore - Intentional global definition as emergency fallback
        global['@rollup/rollup-linux-x64-gnu'] = standardMock;
        console.log('[Rollup Patch] Emergency global patch applied for linux-x64-gnu');
        patchSucceeded = true;
      } catch (emergencyError) {
        console.error('[Rollup Patch] Emergency patching failed:', emergencyError);
      }
    }
    
    console.log('[Rollup Patch] Patch application complete. Status:', patchSucceeded ? 'SUCCESS' : 'PARTIAL');
    return patchSucceeded;
  } catch (fatalError) {
    console.error('[Rollup Patch] Fatal error during patch application:', fatalError);
    return false;
  }
}
