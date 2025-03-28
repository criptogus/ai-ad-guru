
// Import modules
import { applyRollupPatch } from './rollupNativeModulePatch.js';

// Apply module patches
console.log('Applying module patches...');
const patchSuccess = applyRollupPatch();
console.log('Module patches applied:', patchSuccess ? 'successfully' : 'with warnings');

// Export a dummy function for module system
export function patchesApplied() {
  return true;
}
