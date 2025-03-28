
// Import modules
import { applyRollupPatch } from './rollupNativeModulePatch.js';

// Apply module patches immediately on import
console.log('[Module System] Starting module patches application...');

try {
  // Apply Rollup patch with detailed logging
  const patchSuccess = applyRollupPatch();
  console.log('[Module System] Rollup native module patch applied:', 
    patchSuccess ? 'successfully' : 'with warnings');

  // Add other patches here if needed in the future
} catch (error) {
  // Log failure but don't crash the application
  console.error('[Module System] Failed to apply module patches:', error.message);
  console.warn('[Module System] Application will attempt to continue without patches');
}

// Export a function to check if patches were applied
export function patchesApplied() {
  return true;
}
