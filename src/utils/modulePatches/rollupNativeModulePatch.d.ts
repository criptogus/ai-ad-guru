
export interface NativeBindingMock {
  bindings?: any | null;
  isLoaded?: boolean;
  load?: () => any | null;
  needsRebuilding?: () => boolean;
  getUuid?: () => string;
  loadBinding?: () => any | null;
  [key: string]: any;
}

export interface MockNativeBindings {
  '@rollup/rollup-linux-x64-gnu': NativeBindingMock;
  '@rollup/rollup-linux-x64-musl': NativeBindingMock;
  '@rollup/rollup-darwin-x64': NativeBindingMock;
  '@rollup/rollup-darwin-arm64': NativeBindingMock;
  '@rollup/rollup-win32-x64-msvc': NativeBindingMock;
  '@rollup/rollup-win32-ia32-msvc': NativeBindingMock;
  '@rollup/rollup-win32-arm64-msvc': NativeBindingMock;
  '@rollup/rollup-freebsd-x64': NativeBindingMock;
  [key: string]: NativeBindingMock;
}

export const mockNativeBindings: MockNativeBindings;
export function applyRollupPatch(): boolean;
