
/**
 * This file imports and executes all module patches
 * to ensure proper application functionality in different environments
 */

// Import and immediately execute the Rollup native module patch
import './rollupNativeModulePatch.js';

console.info('[Module Patches] All patches loaded successfully');

// Export a dummy function for modules that might need to import something
export const patchesLoaded = true;
