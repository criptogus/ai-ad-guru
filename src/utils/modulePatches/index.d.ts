
/**
 * Type definitions for module patching system
 */

export { 
  NativeBindingMock, 
  MockNativeBindings,
  applyRollupPatch,
  mockNativeBindings
} from './rollup/index';

export function patchesApplied(): boolean;

// Default export
declare const defaultMock: import('./rollup/index').NativeBindingMock;
export default defaultMock;
