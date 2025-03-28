
/**
 * Create mock implementations of Rollup native bindings
 */

// Define the basic mock structure
export const createMockBinding = () => ({
  bindings: null,
  isLoaded: false,
  load: () => null,
  needsRebuilding: () => false,
  getUuid: () => 'mocked-uuid',
  loadBinding: () => null,
  createDist: () => null,
  nativeBuild: () => true,
  isNativeSupported: () => false
});

// Generate mock instances for all known Rollup native modules
export const createAllMockBindings = () => {
  const mockBindings = {};
  
  // Create mock for each possible architecture
  const architectures = [
    '@rollup/rollup-linux-x64-gnu',
    '@rollup/rollup-linux-x64-musl',
    '@rollup/rollup-linux-arm64-gnu',
    '@rollup/rollup-linux-arm64-musl',
    '@rollup/rollup-linux-arm-gnueabihf',
    '@rollup/rollup-darwin-x64',
    '@rollup/rollup-darwin-arm64',
    '@rollup/rollup-win32-x64-msvc',
    '@rollup/rollup-win32-ia32-msvc',
    '@rollup/rollup-win32-arm64-msvc',
    '@rollup/rollup-freebsd-x64',
    '@rollup/rollup-alpine-x64',
    '@rollup/rollup-android-arm64',
    '@rollup/rollup-android-arm-eabi'
  ];
  
  architectures.forEach(arch => {
    mockBindings[arch] = createMockBinding();
  });
  
  // Add Rollup-specific native paths
  mockBindings['rollup/dist/native'] = createMockBinding();
  mockBindings['rollup/native'] = createMockBinding();
  
  return mockBindings;
};
