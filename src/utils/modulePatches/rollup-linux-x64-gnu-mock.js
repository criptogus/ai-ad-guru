
/**
 * Pure ESM mock for @rollup/rollup-linux-x64-gnu
 * This mock is designed to work in any environment without native dependencies
 */

console.log('[Mock] ESM @rollup/rollup-linux-x64-gnu mock loaded');

// Create a standard mock implementation
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
  }
};

// Handle both CommonJS and ESM exports
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = mockModule;
  module.exports.default = mockModule;
  module.exports.bindings = mockModule.bindings;
  module.exports.isLoaded = mockModule.isLoaded;
  module.exports.load = mockModule.load;
  module.exports.needsRebuilding = mockModule.needsRebuilding;
  module.exports.getUuid = mockModule.getUuid;
  module.exports.loadBinding = mockModule.loadBinding;
}

// ESM exports
export const bindings = mockModule.bindings;
export const isLoaded = mockModule.isLoaded;
export const load = mockModule.load;
export const needsRebuilding = mockModule.needsRebuilding;
export const getUuid = mockModule.getUuid;
export const loadBinding = mockModule.loadBinding;

// Default export
export default mockModule;
