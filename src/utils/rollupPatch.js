
// This is a rollup-specific patch that can be used by the build system
module.exports = {
  // Mock empty module for native bindings
  '@rollup/rollup-linux-x64-gnu': {},
  '@rollup/rollup-darwin-x64': {},
  '@rollup/rollup-darwin-arm64': {},
  '@rollup/rollup-win32-x64-msvc': {}
};
