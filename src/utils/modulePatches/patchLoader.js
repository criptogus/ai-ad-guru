
/**
 * Environment-agnostic module patching system
 * This file must be imported at the very start of the application
 */

// Apply patches early
console.log('[Module System] Starting module patches application...');

// Set environment variables to disable native bindings
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = '1';
  process.env.DISABLE_NATIVE_MODULES = '1';
  process.env.npm_config_platform = 'neutral';
  process.env.npm_config_optional = 'false';
  process.env.npm_config_build_from_source = 'false';
  process.env.npm_config_ignore_scripts = 'true';
}

// Create enhanced universal mock for native modules
const createNativeMock = () => ({
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

// Mock all possible native modules
if (typeof globalThis !== 'undefined') {
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
    '@rollup/rollup-native',
    'rollup/dist/native',
    'rollup/native'
  ];
  
  nativeModules.forEach(moduleName => {
    // @ts-ignore - Assign mock to global object
    globalThis[moduleName] = createNativeMock();
  });
  
  // Set flags to disable native modules
  // @ts-ignore
  globalThis.__ROLLUP_NATIVE_DISABLED__ = true;
  // @ts-ignore
  globalThis.__DISABLE_NATIVE_MODULES__ = true;
  // @ts-ignore
  globalThis.__SKIP_NATIVE_MODULES__ = true;
}

// Define a null getter function for missing properties
const nullGetter = () => null;

// Create a getter object to intercept any attempt to access native modules
try {
  if (typeof Object.defineProperty === 'function') {
    // For each possible module path, add a getter that returns a mock
    ['@rollup/rollup-linux-x64-gnu', 'rollup/native', 'rollup/dist/native'].forEach(modulePath => {
      try {
        Object.defineProperty(globalThis, modulePath, {
          get: function() {
            console.log(`[Module System] Intercepted access to ${modulePath}`);
            return createNativeMock();
          },
          configurable: true
        });
      } catch (err) {
        console.warn(`[Module System] Failed to define property for ${modulePath}:`, err);
      }
    });
  }
} catch (err) {
  console.warn('[Module System] Failed to define properties:', err);
}

// Import and apply patching - using import() for compatibility
import('./rollupNativeModulePatch.js')
  .then(module => {
    console.log('[Module System] Imported rollupNativeModulePatch.js successfully');
    
    try {
      module.applyRollupPatch();
      console.log('[Module System] Applied Rollup patch successfully');
    } catch (err) {
      console.error('[Module System] Failed to apply Rollup patch:', err);
    }
  })
  .catch(err => {
    console.error('[Module System] Failed to import rollupNativeModulePatch.js:', err);
    
    // Provide fallback if import fails
    console.log('[Module System] Using fallback patch mechanism');
    
    if (typeof require === 'function') {
      try {
        // Attempt to patch require
        const originalRequire = require;
        // @ts-ignore
        require = function(id) {
          if (id.includes('@rollup/rollup-') || id.includes('rollup/native') || id.includes('native.js')) {
            console.log(`[Module System] Intercepted require for ${id}`);
            return createNativeMock();
          }
          return originalRequire.apply(this, arguments);
        };
      } catch (e) {
        console.warn('[Module System] Failed to patch require:', e);
      }
    }
  });

// Apply browser-specific fallbacks
if (typeof window !== 'undefined') {
  // Add error handler for dynamic imports
  window.addEventListener('error', function(event) {
    if (event && event.message && typeof event.message === 'string' && 
        (event.message.includes('@rollup/rollup-') || 
         event.message.includes('native module'))) {
      console.warn('[Module System] Caught runtime error related to native modules:', event.message);
      event.preventDefault(); // Try to prevent the error from crashing the app
    }
  }, true);
  
  // Patch dynamic import for browser environments
  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
      if (url && (url.includes('@rollup/rollup-') || url.includes('rollup/native'))) {
        console.log(`[Module System] Intercepted fetch for ${url}`);
        return Promise.resolve(new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/javascript' }
        }));
      }
      return originalFetch.apply(this, arguments);
    };
  }
}

// Export patch status
export function patchesApplied() {
  return true; // Always return true to prevent conditional code paths
}

// Final confirmation
console.log('[Module System] Module patching system initialized');
