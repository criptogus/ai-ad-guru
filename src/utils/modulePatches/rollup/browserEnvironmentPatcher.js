
/**
 * Browser environment patching for Rollup native modules
 */

// Apply browser-specific patches
export const patchBrowserEnvironment = (mockNativeBindings) => {
  if (typeof window === 'undefined') {
    console.log('[Rollup Patch] Skipping browser patches (window not defined)');
    return false;
  }
  
  try {
    console.log('[Rollup Patch] Applying browser environment patches');
    
    // Register all mocks on window for browser context
    Object.keys(mockNativeBindings).forEach(moduleName => {
      // Intentional window assignment
      window[moduleName] = mockNativeBindings[moduleName];
    });
    
    // Mark patch as applied on window
    window.__ROLLUP_PATCH_APPLIED__ = true;
    window.__ROLLUP_NATIVE_DISABLED__ = true;
    
    // Patch fetch if possible to intercept imports
    patchFetch();
    
    console.log('[Rollup Patch] Browser window patched successfully');
    return true;
  } catch (error) {
    console.error('[Rollup Patch] Error applying browser patches:', error);
    return false;
  }
};

// Patch window.fetch to intercept module imports
const patchFetch = () => {
  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
      if (url && (url.includes('@rollup/rollup-') || url.includes('rollup/native'))) {
        console.log(`[Rollup Patch] Intercepted fetch for ${url}`);
        return Promise.resolve(new Response('export default {};', {
          status: 200,
          headers: { 'Content-Type': 'application/javascript' }
        }));
      }
      return originalFetch.apply(this, arguments);
    };
    console.log('[Rollup Patch] Successfully patched window.fetch for import() interception');
  }
};
