
/**
 * Type definitions for enhanced Rollup native module patching system
 */

export interface NativeBindingMock {
  bindings: null;
  isLoaded: boolean;
  load: () => null;
  needsRebuilding: () => boolean;
  getUuid: () => string;
  loadBinding: () => null;
  [key: string]: any;
}

export interface MockNativeBindings {
  '@rollup/rollup-linux-x64-gnu': NativeBindingMock;
  '@rollup/rollup-linux-x64-musl': NativeBindingMock;
  '@rollup/rollup-linux-arm64-gnu': NativeBindingMock;
  '@rollup/rollup-linux-arm64-musl': NativeBindingMock;
  '@rollup/rollup-linux-arm-gnueabihf': NativeBindingMock;
  '@rollup/rollup-darwin-x64': NativeBindingMock;
  '@rollup/rollup-darwin-arm64': NativeBindingMock;
  '@rollup/rollup-win32-x64-msvc': NativeBindingMock;
  '@rollup/rollup-win32-ia32-msvc': NativeBindingMock;
  '@rollup/rollup-win32-arm64-msvc': NativeBindingMock;
  '@rollup/rollup-freebsd-x64': NativeBindingMock;
  '@rollup/rollup-alpine-x64': NativeBindingMock;
  '@rollup/rollup-android-arm64': NativeBindingMock;
  '@rollup/rollup-android-arm-eabi': NativeBindingMock;
  '@rollup/rollup-native': NativeBindingMock;
  [key: string]: NativeBindingMock;
}

export const mockNativeBindings: MockNativeBindings;
export function applyRollupPatch(): boolean;
