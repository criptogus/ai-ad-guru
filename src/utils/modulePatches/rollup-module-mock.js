
/**
 * Universal mock for all Rollup native modules
 */

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

// Create a single mock instance to export
const mockInstance = createMock();

// Support both CommonJS and ESM
if (typeof module !== 'undefined' && module.exports) {
  try {
    module.exports = mockInstance;
    module.exports.default = mockInstance;
  } catch (e) {
    console.warn('Module export failed (CommonJS)', e);
  }
}

// ESM exports
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
export default mockInstance;
