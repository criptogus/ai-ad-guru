
// Import modules
import { applyRollupPatch } from './rollupNativeModulePatch.js';

// Apply module patches
console.log('Applying module patches...');
applyRollupPatch();
console.log('Module patches applied successfully');

// Export a dummy function for module system
export function patchesApplied() {
  return true;
}
