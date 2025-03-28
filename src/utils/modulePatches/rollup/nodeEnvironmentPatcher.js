
/**
 * Node.js environment patching for Rollup native modules
 */

// Apply Node.js specific patches
export const patchNodeEnvironment = (mockNativeBindings) => {
  console.log('[Rollup Patch] Applying Node.js global environment patches');
  
  if (typeof global === 'undefined') {
    console.log('[Rollup Patch] Skipping Node.js patches (global not defined)');
    return false;
  }
  
  try {
    // Register all mocks globally
    Object.keys(mockNativeBindings).forEach(moduleName => {
      // Intentional global assignment
      global[moduleName] = mockNativeBindings[moduleName];
    });
    
    // Set global flags used by Rollup to check for native support
    global.__ROLLUP_NATIVE_DISABLED__ = true;
    global.ROLLUP_NATIVE_DISABLE = true;
    
    // Override require if possible to intercept all module resolution
    if (typeof module !== 'undefined' && module.constructor) {
      patchNodeRequire(mockNativeBindings);
    }
    
    // Additional protection: patch process.binding
    patchProcessBinding();
    
    // Super aggressive patching: override Node.js module resolution
    patchModuleResolution();
    
    console.log('[Rollup Patch] Node.js environment patches completed');
    return true;
  } catch (error) {
    console.error('[Rollup Patch] Error applying Node.js patches:', error);
    return false;
  }
};

// Patch Node.js require system
const patchNodeRequire = (mockNativeBindings) => {
  try {
    const Module = module.constructor;
    
    if (Module && Module.prototype && Module.prototype.require) {
      const originalRequire = Module.prototype.require;
      
      // Override require to catch all Rollup native module requests
      Module.prototype.require = function(path) {
        // Comprehensive check for any Rollup native module
        if (typeof path === 'string' && (
            path.includes('@rollup/rollup-') || 
            path.includes('rollup/dist/native') ||
            path.includes('rollup/native') ||
            path.includes('/native.js')
          )) {
          console.log(`[Rollup Patch] Intercepted require for native module: ${path}`);
          
          // Return our mock for the specific architecture
          for (const nativeModule of Object.keys(mockNativeBindings)) {
            if (path.includes(nativeModule)) {
              return mockNativeBindings[nativeModule];
            }
          }
          
          // Default fallback for any unrecognized pattern
          return mockNativeBindings['@rollup/rollup-linux-x64-gnu'];
        }
        
        // For non-Rollup modules, use the original require but catch errors
        try {
          return originalRequire.apply(this, arguments);
        } catch (requireError) {
          // Special handling for Rollup-related errors
          if (String(requireError).includes('rollup') || 
              String(requireError).includes('@rollup')) {
            console.warn(`[Rollup Patch] Recovered from require error: ${path}`, requireError);
            return mockNativeBindings['@rollup/rollup-linux-x64-gnu'];
          }
          throw requireError; // Re-throw non-Rollup errors
        }
      };
      
      console.log('[Rollup Patch] Successfully patched Node.js require()');
    }
  } catch (moduleError) {
    console.warn('[Rollup Patch] Module patching attempt failed:', moduleError);
  }
};

// Patch process.binding
const patchProcessBinding = () => {
  if (typeof process !== 'undefined' && process.binding) {
    try {
      const originalBinding = process.binding;
      
      // Intentional process.binding override
      process.binding = function(name) {
        if (name.includes('rollup') || name.includes('native')) {
          console.log(`[Rollup Patch] Intercepted process.binding call: ${name}`);
          return {};
        }
        return originalBinding.apply(this, arguments);
      };
      
      console.log('[Rollup Patch] Successfully patched process.binding');
    } catch (bindingError) {
      console.warn('[Rollup Patch] process.binding patch attempt failed:', bindingError);
    }
  }
};

// Patch Node.js module resolution
const patchModuleResolution = () => {
  if (typeof process !== 'undefined' && process._resolveFilename) {
    try {
      const originalResolve = process._resolveFilename;
      
      // Intentional process._resolveFilename override
      process._resolveFilename = function(request, parent) {
        if (typeof request === 'string' && request.includes('@rollup/')) {
          console.log(`[Rollup Patch] Intercepted _resolveFilename: ${request}`);
          
          // Force resolution to our mock implementation
          return require.resolve('./rollup-linux-x64-gnu-mock.js');
        }
        return originalResolve.apply(this, arguments);
      };
      
      console.log('[Rollup Patch] Successfully patched process._resolveFilename');
    } catch (resolveError) {
      console.warn('[Rollup Patch] _resolveFilename patch attempt failed:', resolveError);
    }
  }
};
