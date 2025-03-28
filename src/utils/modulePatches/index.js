
/**
 * This module serves as the central export point for all module patches
 * Ensures consistent access to patch functionality
 */

// Export all patch functions with improved naming
export { 
  applyRollupPatch,
  mockNativeBindings
} from './rollup/index.js';

export { patchesApplied } from './patchLoader.js';

// Force immediate patch execution
import './patchLoader.js';
import './rollup/index.js';

console.log('[Module Patches] All patches loaded and ready for use');
