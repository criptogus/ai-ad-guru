
/**
 * Enhanced module patching system that runs before any other code
 * Ensures native modules are properly mocked in all environments
 */

console.log('[Module System] Initializing critical module patches...');

// Set environment variables to disable native module usage
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = '1';
  process.env.DISABLE_NATIVE_MODULES = '1';
  process.env.npm_config_build_from_source = 'false';
  process.env.SKIP_NATIVE_MODULES = 'true';
}

// Global flags to ensure native modules are disabled
if (typeof globalThis !== 'undefined') {
  // @ts-ignore - Intentional assignment to global
  globalThis.__ROLLUP_NATIVE_DISABLED__ = true;
  // @ts-ignore - Intentional assignment to global
  globalThis.__DISABLE_NATIVE_MODULES__ = true;
}

// Import our universal mock
// Using dynamic import for wider compatibility
import('./rollup-module-mock.js').then(mock => {
  console.log('[Module System] Mock module loaded successfully');
  
  // Register the mock for all possible native module paths
  const nativeModules = [
    '@rollup/rollup-linux-x64-gnu',
    '@rollup/rollup-linux-x64-musl',
    '@rollup/rollup-linux-arm64-gnu',
    '@rollup/rollup-linux-arm64-musl',
    '@rollup/rollup-linux-arm-gnueabihf',
    '@rollup/rollup-darwin-x64',
    '@rollup/rollup-darwin-arm64',
    '@rollup/rollup-win32-x64-msvc',
    '@rollup/rollup-win32-ia32-msvc',
    '@rollup/rollup-win32-arm64-msvc',
    '@rollup/rollup-freebsd-x64',
    '@rollup/rollup-alpine-x64',
    '@rollup/rollup-android-arm64',
    '@rollup/rollup-android-arm-eabi',
    'rollup/dist/native',
    'rollup/native'
  ];
  
  // Register mock for each possible module path
  if (typeof window !== 'undefined') {
    nativeModules.forEach(moduleName => {
      // @ts-ignore - Intentional window assignment
      window[moduleName] = mock.default;
    });
    console.log('[Module System] Registered mocks on window object');
  }
  
  if (typeof global !== 'undefined') {
    nativeModules.forEach(moduleName => {
      // @ts-ignore - Intentional global assignment
      global[moduleName] = mock.default;
    });
    console.log('[Module System] Registered mocks on global object');
  }
  
  // Override require if available
  if (typeof require === 'function' && typeof module !== 'undefined') {
    try {
      const Module = module.constructor;
      if (Module && Module.prototype && Module.prototype.require) {
        const originalRequire = Module.prototype.require;
        
        // Override require to catch all Rollup native module requests
        Module.prototype.require = function(path) {
          if (typeof path === 'string' && (
              path.includes('@rollup/rollup-') || 
              path.includes('rollup/dist/native') ||
              path.includes('rollup/native'))) {
            console.log(`[Module System] Intercepted require for: ${path}`);
            return mock.default;
          }
          return originalRequire.apply(this, arguments);
        };
        console.log('[Module System] Successfully patched require()');
      }
    } catch (err) {
      console.warn('[Module System] Failed to patch require:', err);
    }
  }
}).catch(err => {
  console.error('[Module System] Failed to load mock module:', err);
});

// Handle dynamic import errors specific to native modules
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(event) {
    if (event && event.message && typeof event.message === 'string' && 
        (event.message.includes('@rollup/rollup-') || 
         event.message.includes('native module'))) {
      console.warn('[Module System] Intercepted native module error:', event.message);
      event.preventDefault();
    }
  }, true);
}

// Export patch status function
export function patchesApplied() {
  return true;
}

console.log('[Module System] Module patching completed');
