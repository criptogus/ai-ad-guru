
// Import and immediately execute the module patch
import mockNativeBindings from './modulePatch';

// Apply the patch in development and production environments
if (typeof window !== 'undefined') {
  console.info('[Module Patch] Applying Rollup native module patch');
  try {
    mockNativeBindings();
  } catch (error) {
    console.warn('[Module Patch] Failed to apply patch:', error);
  }
}
