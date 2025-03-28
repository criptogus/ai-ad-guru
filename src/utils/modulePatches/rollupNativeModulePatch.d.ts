
// Type definitions for rollupNativeModulePatch.js

/**
 * Mock bindings for Rollup native modules
 */
export const mockNativeBindings: {
  '@rollup/rollup-linux-x64-gnu': any;
  '@rollup/rollup-darwin-x64': any;
  '@rollup/rollup-darwin-arm64': any;
  '@rollup/rollup-win32-x64-msvc': any;
};

/**
 * Apply the rollup module patch to prevent native module loading errors
 */
export function applyRollupPatch(): void;
