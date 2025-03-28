
/**
 * Direct mock for @rollup/rollup-linux-x64-gnu
 * This file gets directly loaded when the native module is required
 */

console.log('[Mock] @rollup/rollup-linux-x64-gnu mock loaded');

// Export a standard mock that satisfies Rollup's expectations
const mockModule = {
  // Core native binding interface
  bindings: null,
  isLoaded: false,
  
  // Standard methods expected by Rollup
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
  
  // Required for native functionality
  loadBinding: function() {
    console.log('[Mock] Native module loadBinding() called - using JavaScript fallback');
    return null;
  }
};

// Use ESM exports
export const bindings = mockModule.bindings;
export const isLoaded = mockModule.isLoaded;
export const load = mockModule.load;
export const needsRebuilding = mockModule.needsRebuilding;
export const getUuid = mockModule.getUuid;
export const loadBinding = mockModule.loadBinding;

// Default export for compatibility
export default mockModule;
