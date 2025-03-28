
/**
 * Pure ESM mock for @rollup/rollup-linux-x64-gnu
 * This mock is designed to work in any environment without native dependencies
 */

console.log('[Mock] ESM @rollup/rollup-linux-x64-gnu mock loaded');

// Create a more comprehensive mock implementation
const mockModule = {
  bindings: null,
  isLoaded: false,
  
  load: function() {
    console.log('[Mock] Native module load() called - using JavaScript fallback');
    return null;
  },
  
  needsRebuilding: function() {
    return false;
  },
  
  getUuid: function() {
    return 'mocked-uuid-00000000-0000-0000-0000-000000000000';
  },
  
  loadBinding: function() {
    console.log('[Mock] Native module loadBinding() called - using JavaScript fallback');
    return null;
  },
  
  // Add additional methods that might be expected by newer Rollup versions
  createDist: function() {
    console.log('[Mock] Native module createDist() called - using JavaScript fallback');
    return null;
  },
  
  nativeBuild: function() {
    console.log('[Mock] Native module nativeBuild() called - using JavaScript fallback');
    return true; // Pretend success
  },
  
  isNativeSupported: function() {
    return false; // Tell Rollup native is not supported
  }
};

// Handle both CommonJS and ESM exports
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = mockModule;
  module.exports.default = mockModule;
  Object.assign(module.exports, mockModule);
}

// ESM exports
export const bindings = mockModule.bindings;
export const isLoaded = mockModule.isLoaded;
export const load = mockModule.load;
export const needsRebuilding = mockModule.needsRebuilding;
export const getUuid = mockModule.getUuid;
export const loadBinding = mockModule.loadBinding;
export const createDist = mockModule.createDist;
export const nativeBuild = mockModule.nativeBuild;
export const isNativeSupported = mockModule.isNativeSupported;

// Default export
export default mockModule;
