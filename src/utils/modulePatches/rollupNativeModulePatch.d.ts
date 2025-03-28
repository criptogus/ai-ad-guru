
declare module './rollupNativeModulePatch' {
  export const mockNativeBindings: {
    '@rollup/rollup-linux-x64-gnu': any;
    '@rollup/rollup-darwin-x64': any;
    '@rollup/rollup-darwin-arm64': any;
    '@rollup/rollup-win32-x64-msvc': any;
  };
  export function applyRollupPatch(): void;
}
