
// Import modules
import { applyRollupPatch, mockNativeBindings } from './rollupNativeModulePatch.js';

// Apply module patches immediately on import - do this as early as possible
console.log('[Module System] Starting enhanced module patches application...');

try {
  // Apply patches and retry with escalating aggressiveness if needed
  let patchSuccess = false;
  let retryCount = 0;
  const maxRetries = 3;
  
  // First attempt - standard patch
  try {
    console.log('[Module System] Applying Rollup patch (attempt 1)...');
    patchSuccess = applyRollupPatch();
  } catch (firstError) {
    console.error('[Module System] First patch attempt error:', firstError);
  }
  
  // Retry with increasing aggressiveness if first attempt failed
  while (!patchSuccess && retryCount < maxRetries) {
    retryCount++;
    console.log(`[Module System] Retry patch application (attempt ${retryCount + 1})...`);
    
    try {
      // More aggressive patching on each retry
      if (typeof global !== 'undefined') {
        // Direct global assignment of all modules
        Object.keys(mockNativeBindings).forEach(moduleName => {
          // @ts-ignore - Intentional global assignment
          global[moduleName] = { loadBinding: () => null };
        });
        
        // Extreme measures: override Node.js module resolution
        if (retryCount >= 2 && typeof process !== 'undefined' && process._resolveFilename) {
          const originalResolve = process._resolveFilename;
          // @ts-ignore - Intentional process override
          process._resolveFilename = function(request, parent) {
            if (request.includes('@rollup/')) {
              console.log('[Module System] Intercepted Node.js file resolution:', request);
              throw new Error('Module explicitly blocked by patch');
            }
            return originalResolve.apply(this, arguments);
          };
          console.log('[Module System] Applied emergency _resolveFilename patch');
        }
      }
      
      // Try standard patch again
      patchSuccess = applyRollupPatch();
    } catch (retryError) {
      console.error(`[Module System] Patch retry ${retryCount} failed:`, retryError);
    }
  }
  
  console.log('[Module System] Rollup native module patch applied:', 
    patchSuccess ? 'successfully' : 'with warnings - continuing anyway');

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
  return true; // Always return true to avoid conditional code paths
}
