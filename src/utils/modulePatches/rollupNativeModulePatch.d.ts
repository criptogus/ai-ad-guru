
declare const mockNativeBindings: {
  '@rollup/rollup-linux-x64-gnu': any;
  '@rollup/rollup-linux-x64-musl': any;
  '@rollup/rollup-darwin-x64': any;
  '@rollup/rollup-darwin-arm64': any;
  '@rollup/rollup-win32-x64-msvc': any;
  '@rollup/rollup-win32-ia32-msvc': any;
  '@rollup/rollup-win32-arm64-msvc': any;
  '@rollup/rollup-freebsd-x64': any;
  [key: string]: any;
};

declare function applyRollupPatch(): boolean;

export { mockNativeBindings, applyRollupPatch };
