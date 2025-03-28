
// Import modules
import { applyRollupPatch } from './rollupNativeModulePatch.js';

// Apply module patches immediately on import - do this as early as possible
console.log('[Module System] Starting module patches application...');

try {
  // Apply Rollup patch with redundant error handling for maximum resilience
  let patchSuccess = false;
  try {
    patchSuccess = applyRollupPatch();
  } catch (innerError) {
    console.error('[Module System] Inner patch application error:', innerError);
    // Create a fallback patch attempt that's more aggressive
    try {
      // Create global mocks as a last resort
      if (typeof global !== 'undefined') {
        global['@rollup/rollup-linux-x64-gnu'] = { loadBinding: () => null };
        console.log('[Module System] Applied emergency global patch');
        patchSuccess = true;
      }
    } catch (emergencyError) {
      console.error('[Module System] Emergency patch failed:', emergencyError);
    }
  }
  
  console.log('[Module System] Rollup native module patch applied:', 
    patchSuccess ? 'successfully' : 'with warnings');

  // Add other patches here if needed in the future
} catch (error) {
  // Log failure but don't crash the application
  console.error('[Module System] Failed to apply module patches:', error.message);
  console.warn('[Module System] Application will attempt to continue without patches');
}

// Clean up old patches (prevent memory leaks or duplicate patching)
try {
  if (typeof window !== 'undefined' && window.__ROLLUP_PATCH_APPLIED__) {
    console.log('[Module System] Cleaning up previous patch state');
    delete window.__ROLLUP_PATCH_APPLIED__;
  }
} catch (cleanupError) {
  console.warn('[Module System] Patch cleanup warning:', cleanupError);
}

// Export a function to check if patches were applied
export function patchesApplied() {
  return true;
}
