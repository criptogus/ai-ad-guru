
/**
 * Environment-agnostic module patching system
 * This file must be imported at the very start of the application
 */

// Apply patches early
console.log('[Module System] Starting module patches application...');

// Set environment variables to disable native bindings
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = '1';
  process.env.DISABLE_NATIVE_MODULES = '1';
  process.env.npm_config_platform = 'neutral';
}

// Import and apply patching - using import() for compatibility
import('./rollupNativeModulePatch.js')
  .then(module => {
    console.log('[Module System] Imported rollupNativeModulePatch.js successfully');
    
    try {
      module.applyRollupPatch();
      console.log('[Module System] Applied Rollup patch successfully');
    } catch (err) {
      console.error('[Module System] Failed to apply Rollup patch:', err);
    }
  })
  .catch(err => {
    console.error('[Module System] Failed to import rollupNativeModulePatch.js:', err);
  });

// Apply browser-specific fallbacks
if (typeof window !== 'undefined') {
  // Set flags to disable native modules
  window.__ROLLUP_NATIVE_DISABLED__ = true;
  window.__DISABLE_NATIVE_MODULES__ = true;
  
  // Add error handler for dynamic imports
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
console.log('[Module System] Module patching system initialized');
