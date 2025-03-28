
/**
 * Rollup native module patching system
 * Provides comprehensive mocks for all Rollup native bindings to prevent errors
 */

import { createAllMockBindings } from './createMocks.js';
import { patchNodeEnvironment } from './nodeEnvironmentPatcher.js';
import { patchBrowserEnvironment } from './browserEnvironmentPatcher.js';
import { setupEnvironmentVariables, patchEsmEnvironment } from './environmentSetup.js';

// Create all mock bindings
export const mockNativeBindings = createAllMockBindings();

// Apply multiple layers of patches for maximum compatibility
export function applyRollupPatch() {
  console.log('[Rollup Patch] Applying aggressive Rollup native module patching...');
  
  try {
    // 1. Setup environment variables
    setupEnvironmentVariables();
    
    // 2. Apply Node.js environment patches
    patchNodeEnvironment(mockNativeBindings);
    
    // 3. Apply browser environment patches
    patchBrowserEnvironment(mockNativeBindings);
    
    // 4. Apply ESM environment patches
    patchEsmEnvironment();
    
    console.log('[Rollup Patch] Patch application complete');
    return true;
  } catch (fatalError) {
    console.error('[Rollup Patch] Fatal error during patch application:', fatalError);
    return false;
  }
}

// Immediately self-execute when imported to ensure the patch is applied as early as possible
try {
  applyRollupPatch();
} catch (e) {
  console.warn('[Rollup Patch] Self-execution failed:', e);
}

// Add additional module.exports for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockNativeBindings['@rollup/rollup-linux-x64-gnu'];
  module.exports.mockNativeBindings = mockNativeBindings;
  module.exports.applyRollupPatch = applyRollupPatch;
}

// Default export using ESM syntax
export default mockNativeBindings['@rollup/rollup-linux-x64-gnu'];
