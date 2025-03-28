
/**
 * Environment setup for Rollup patching
 */

// Setup environment variables to disable native modules
export const setupEnvironmentVariables = () => {
  console.log('[Rollup Patch] Setting up environment variables');
  
  try {
    // Set environment variable to disable native modules
    if (typeof process !== 'undefined' && process.env) {
      process.env.ROLLUP_NATIVE_DISABLE = '1';
      process.env.DISABLE_NATIVE_MODULES = '1';
      process.env.npm_config_build_from_source = 'false';
    }
    
    // Set global flags
    if (typeof globalThis !== 'undefined') {
      globalThis.__ROLLUP_NATIVE_DISABLED__ = true;
      globalThis.ROLLUP_NATIVE_DISABLE = true;
    }
    
    console.log('[Rollup Patch] Environment variables configured');
    return true;
  } catch (error) {
    console.error('[Rollup Patch] Error setting up environment variables:', error);
    return false;
  }
};

// Apply ESM environment patches
export const patchEsmEnvironment = () => {
  if (typeof import === 'function' && typeof import.meta === 'object') {
    try {
      console.log('[Rollup Patch] Applying ESM environment patches');
      
      // Nothing specific to do here since we can't override import() directly
      // The other patches should catch most issues
      
      console.log('[Rollup Patch] ESM patches applied as much as possible');
      return true;
    } catch (esmError) {
      console.warn('[Rollup Patch] ESM patch attempt failed:', esmError);
      return false;
    }
  }
  return false;
};
