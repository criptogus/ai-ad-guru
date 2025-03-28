
/**
 * Vite plugin to fix native module issues during build
 */

// This plugin blocks native module imports and replaces them with our mock
const nativeModuleFixPlugin = () => {
  console.log('🔧 Native Module Fix Plugin: Activated');
  
  // List of all possible Rollup native modules
  const nativeModulePatterns = [
    '@rollup/rollup-linux-',
    '@rollup/rollup-darwin-',
    '@rollup/rollup-win32-',
    '@rollup/rollup-freebsd-',
    '@rollup/rollup-alpine-',
    '@rollup/rollup-android-',
    'rollup/dist/native',
    'rollup/native',
  ];
  
  return {
    name: 'vite:native-module-fix',
    enforce: 'pre', // Run before other plugins
    
    // Intercept module resolution
    resolveId(id, importer) {
      if (typeof id === 'string' && nativeModulePatterns.some(pattern => id.includes(pattern))) {
        console.log(`🔄 Native Module Fix: Intercepting ${id}`);
        // Return virtual module id that we'll handle in load hook
        return `\0virtual:native-module-mock:${id}`;
      }
      return null;
    },
    
    // Provide empty implementation for native modules
    load(id) {
      if (id && id.startsWith('\0virtual:native-module-mock:')) {
        console.log(`📦 Native Module Fix: Providing mock for ${id}`);
        return `
          export const bindings = null;
          export const isLoaded = false;
          export const load = () => null;
          export const needsRebuilding = () => false;
          export const getUuid = () => 'mocked-uuid';
          export const loadBinding = () => null;
          export const createDist = () => null;
          export const nativeBuild = () => true;
          export const isNativeSupported = () => false;
          export default {
            bindings: null,
            isLoaded: false,
            load: () => null,
            needsRebuilding: () => false,
            getUuid: () => 'mocked-uuid',
            loadBinding: () => null,
            createDist: () => null,
            nativeBuild: () => true,
            isNativeSupported: () => false
          };
        `;
      }
      return null;
    },
    
    // Apply global configuration to ensure ESBuild doesn't try to use native modules
    config(config) {
      // Set environment variables to disable native modules
      config.define = config.define || {};
      config.define['process.env.ROLLUP_NATIVE_DISABLE'] = JSON.stringify('1');
      config.define['global.__ROLLUP_NATIVE_DISABLED__'] = 'true';
      
      // Exclude native modules from the build process
      if (!config.build) config.build = {};
      if (!config.build.rollupOptions) config.build.rollupOptions = {};
      
      const nativeModulesToExclude = [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-win32-x64-msvc',
        'rollup/dist/native',
        'rollup/native'
      ];
      
      config.build.rollupOptions.external = [
        ...(config.build.rollupOptions.external || []),
        ...nativeModulesToExclude
      ];
      
      console.log('✅ Native Module Fix: Applied global build configuration');
      
      return config;
    }
  };
};

// Export the plugin using ESM syntax
export default nativeModuleFixPlugin;
