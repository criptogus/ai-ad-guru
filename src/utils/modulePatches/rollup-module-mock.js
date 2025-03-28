
/**
 * Universal mock for all Rollup native modules
 * This file provides compatibility in all deployment environments
 */

// Create a standard mock that satisfies all possible Rollup native module interfaces
const createMock = () => ({
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

// Create a mock for each possible module path
const mockNativeBindings = {
  '@rollup/rollup-linux-x64-gnu': createMock(),
  '@rollup/rollup-linux-x64-musl': createMock(),
  '@rollup/rollup-linux-arm64-gnu': createMock(),
  '@rollup/rollup-linux-arm64-musl': createMock(),
  '@rollup/rollup-linux-arm-gnueabihf': createMock(),
  '@rollup/rollup-darwin-x64': createMock(),
  '@rollup/rollup-darwin-arm64': createMock(),
  '@rollup/rollup-win32-x64-msvc': createMock(),
  '@rollup/rollup-win32-ia32-msvc': createMock(),
  '@rollup/rollup-win32-arm64-msvc': createMock(),
  '@rollup/rollup-freebsd-x64': createMock(),
  '@rollup/rollup-alpine-x64': createMock(),
  '@rollup/rollup-android-arm64': createMock(),
  '@rollup/rollup-android-arm-eabi': createMock(),
  'rollup/dist/native': createMock(),
  'rollup/native': createMock()
};

// Support both CommonJS and ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createMock();
  module.exports.default = createMock();
}

// ESM exports for native binding properties
export const bindings = null;
export const isLoaded = false;
export const load = () => null;
export const needsRebuilding = () => false;
export const getUuid = () => 'mocked-uuid';
export const loadBinding = () => null;
export const createDist = () => null;
export const nativeBuild = () => true;
export const isNativeSupported = () => false;

// Default export
export default createMock();
