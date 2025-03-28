
// Import all patches
import { applyRollupPatch } from './rollupNativeModulePatch.js';

// Apply patches
try {
  console.log('Applying module patches...');
  applyRollupPatch();
  console.log('Module patches applied successfully');
} catch (error) {
  console.error('Failed to apply module patches:', error);
}
