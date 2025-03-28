/**
 * Mock creation utilities for Rollup native modules
 */

// Define a standardized mock object that satisfies Rollup's expectations
export const createStandardMock = (moduleName) => ({
  bindings: null,
  isLoaded: false,
  load: () => {
    console.log(`[Rollup Mock] ${moduleName} load() called - using pure JS implementation`);
    return null;
  },
  needsRebuilding: () => false,
  getUuid: () => 'mocked-uuid-00000000-0000-0000-0000-000000000000',
  loadBinding: () => {
    console.log(`[Rollup Mock] ${moduleName} loadBinding() called - using pure JS implementation`);
    return null;
  },
  createDist: () => {
    console.log(`[Rollup Mock] ${moduleName} createDist() called - using pure JS implementation`);
    return null;
  },
  nativeBuild: () => {
    console.log(`[Rollup Mock] ${moduleName} nativeBuild() called - using pure JS implementation`);
    return true; // Pretend success
  },
  isNativeSupported: () => false // Explicitly tell Rollup native is not supported
});

// Create the collection of all mock bindings
export const createAllMockBindings = () => {
  // Complete list of ALL possible native bindings across all architectures
  return {
    // Linux variants
    '@rollup/rollup-linux-x64-gnu': createStandardMock('@rollup/rollup-linux-x64-gnu'),
    '@rollup/rollup-linux-x64-musl': createStandardMock('@rollup/rollup-linux-x64-musl'),
    '@rollup/rollup-linux-arm64-gnu': createStandardMock('@rollup/rollup-linux-arm64-gnu'),
    '@rollup/rollup-linux-arm64-musl': createStandardMock('@rollup/rollup-linux-arm64-musl'),
    '@rollup/rollup-linux-arm-gnueabihf': createStandardMock('@rollup/rollup-linux-arm-gnueabihf'),
    
    // macOS variants
    '@rollup/rollup-darwin-x64': createStandardMock('@rollup/rollup-darwin-x64'),
    '@rollup/rollup-darwin-arm64': createStandardMock('@rollup/rollup-darwin-arm64'),
    
    // Windows variants
    '@rollup/rollup-win32-x64-msvc': createStandardMock('@rollup/rollup-win32-x64-msvc'),
    '@rollup/rollup-win32-ia32-msvc': createStandardMock('@rollup/rollup-win32-ia32-msvc'),
    '@rollup/rollup-win32-arm64-msvc': createStandardMock('@rollup/rollup-win32-arm64-msvc'),
    
    // Other architectures
    '@rollup/rollup-freebsd-x64': createStandardMock('@rollup/rollup-freebsd-x64'),
    '@rollup/rollup-alpine-x64': createStandardMock('@rollup/rollup-alpine-x64'),
    '@rollup/rollup-android-arm64': createStandardMock('@rollup/rollup-android-arm64'),
    '@rollup/rollup-android-arm-eabi': createStandardMock('@rollup/rollup-android-arm-eabi'),
    
    // Generic paths that might be used to access native functionality
    '@rollup/rollup-native': createStandardMock('@rollup/rollup-native'),
    'rollup/dist/native': createStandardMock('rollup/dist/native'),
    'rollup/native': createStandardMock('rollup/native'),
    'rollup/native.js': createStandardMock('rollup/native.js')
  };
};
