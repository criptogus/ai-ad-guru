
declare const mockNativeBindings: {
  '@rollup/rollup-linux-x64-gnu': any;
  '@rollup/rollup-darwin-x64': any;
  '@rollup/rollup-darwin-arm64': any;
  '@rollup/rollup-win32-x64-msvc': any;
};

declare function applyRollupPatch(): void;

export { mockNativeBindings, applyRollupPatch };
