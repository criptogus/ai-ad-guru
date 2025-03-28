
/**
 * Type definitions for module patching system
 */

export interface NativeBindingMock {
  bindings: null;
  isLoaded: boolean;
  load: () => null;
  needsRebuilding: () => boolean;
  getUuid: () => string;
  loadBinding: () => null;
  createDist: () => null;
  nativeBuild: () => boolean;
  isNativeSupported: () => boolean;
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
  'rollup/dist/native': NativeBindingMock;
  'rollup/native': NativeBindingMock;
  'rollup/native.js': NativeBindingMock;
  [key: string]: NativeBindingMock;
}

export const mockNativeBindings: MockNativeBindings;
export function applyRollupPatch(): boolean;
export function patchesApplied(): boolean;

// Default export
declare const defaultMock: NativeBindingMock;
export default defaultMock;
