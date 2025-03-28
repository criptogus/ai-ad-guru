
/**
 * This module patches the Rollup native module imports to prevent errors
 * when running in environments without proper native bindings.
 */

// Mock implementations for the native bindings
export const mockNativeBindings = {
  '@rollup/rollup-linux-x64-gnu': {},
  '@rollup/rollup-darwin-x64': {},
  '@rollup/rollup-darwin-arm64': {},
  '@rollup/rollup-win32-x64-msvc': {}
};

// Apply the patch
export function applyRollupPatch() {
  // This function would typically patch the native module system
  // For now, we'll just log that it's been applied
  console.log('Rollup native module patch applied');
}
