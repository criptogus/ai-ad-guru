
// This file provides a mock for @rollup/rollup-linux-x64-gnu and other native bindings
// to prevent errors during build in environments without native module support

const mockNativeBindings = () => {
  // Mock the require function for specific paths to prevent native module loading
  const originalRequire = module.constructor.prototype.require;
  module.constructor.prototype.require = function(modulePath) {
    if (modulePath.includes('@rollup/rollup-') || modulePath.endsWith('/native.js')) {
      console.warn(`[Module Patch] Bypassing native module load attempt: ${modulePath}`);
      // Return a minimal mock that provides the essential functionality
      return { 
        bindings: null,
        isLoaded: false,
        load: () => null,
        needsRebuilding: () => false,
        getUuid: () => 'mocked-uuid',
        // Add other functions that might be called by rollup
        loadBinding: () => null
      };
    }
    return originalRequire.apply(this, arguments);
  };
};

export default mockNativeBindings;
