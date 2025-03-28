
/**
 * This module provides complete mocks for Rollup native bindings 
 * to prevent errors when running in browser environments
 */

// Mock implementations for all possible native bindings
export const mockNativeBindings = {
  '@rollup/rollup-linux-x64-gnu': {},
  '@rollup/rollup-darwin-x64': {},
  '@rollup/rollup-darwin-arm64': {},
  '@rollup/rollup-win32-x64-msvc': {},
  // Add other architectures if needed
};

// Apply the patch
export function applyRollupPatch() {
  try {
    // In a browser environment, we don't need to do anything special
    // The Vite aliases will handle the mocking
    console.log('Rollup native module patch successfully applied');
    return true;
  } catch (error) {
    console.error('Failed to apply Rollup patch:', error);
    return false;
  }
}
