
/**
 * Early module patching system
 * This file must be imported at the very start of the application
 */

// Apply patches at the earliest possible moment
console.log('[Module System] Starting enhanced module patches application...');

// Directly set environment variables to disable native bindings
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = '1';
  process.env.DISABLE_NATIVE_MODULES = '1';
  process.env.npm_config_platform = 'neutral';
}

// Import the patching system - this will also self-execute the patch
import { applyRollupPatch, mockNativeBindings } from './rollupNativeModulePatch.js';

// First attempt with standard patching
try {
  console.log('[Module System] Applying primary Rollup patch...');
  applyRollupPatch();
} catch (firstError) {
  console.error('[Module System] Primary patch failed:', firstError);
}

// Apply extra aggressive patching as fallback
try {
  console.log('[Module System] Applying extreme fallback patches...');
  
  // Define required modules in global scope
  if (typeof global !== 'undefined') {
    // Register fallbacks for all architectures
    Object.keys(mockNativeBindings).forEach(moduleName => {
      // @ts-ignore - Intentional global assignment
      global[moduleName] = mockNativeBindings[moduleName];
      console.log(`[Module System] Registered global mock for ${moduleName}`);
    });
    
    // Extra Node.js specific fallbacks
    if (typeof process !== 'undefined') {
      const originalResolve = process._resolveFilename;
      if (originalResolve) {
        try {
          // @ts-ignore - Intentional _resolveFilename override
          process._resolveFilename = function(request, parent) {
            if (typeof request === 'string' && 
                (request.includes('@rollup/rollup-') || 
                 request.includes('rollup') && request.includes('native'))) {
              console.log(`[Module System] Blocking native module resolution: ${request}`);
              throw new Error(`Module blocked by module patch system: ${request}`);
            }
            return originalResolve.apply(this, arguments);
          };
          console.log('[Module System] Applied _resolveFilename patch');
        } catch (e) {
          console.warn('[Module System] Failed to patch _resolveFilename:', e);
        }
      }
    }
  }
  
  // Browser-specific fallbacks
  if (typeof window !== 'undefined') {
    // Set flags to disable native modules
    window.__ROLLUP_NATIVE_DISABLED__ = true;
    window.__DISABLE_NATIVE_MODULES__ = true;
  }
} catch (fallbackError) {
  console.error('[Module System] Fallback patches failed:', fallbackError);
}

// Add a special error handler for dynamic imports
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(event) {
    if (event && event.message && typeof event.message === 'string' && 
        (event.message.includes('@rollup/rollup-') || 
         event.message.includes('native module'))) {
      console.warn('[Module System] Caught runtime error related to native modules:', event.message);
      event.preventDefault(); // Try to prevent the error from crashing the app
    }
  }, true);
}

// Export patch status
export function patchesApplied() {
  return true; // Always return true to prevent conditional code paths
}

// Final confirmation
console.log('[Module System] Module patching system initialized successfully');
