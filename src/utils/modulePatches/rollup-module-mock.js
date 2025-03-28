
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

// Support both CommonJS and ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createMock();
  module.exports.default = createMock();
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
export default createMock();
