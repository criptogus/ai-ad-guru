
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption, Plugin, ConfigEnv, ResolvedConfig, UserConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log("[Vite Config] Initializing with enhanced configuration...");
  
  // Set environment variables to disable native modules
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
  process.env.DISABLE_NATIVE_MODULES = 'true';
  
  // Create aliasDefinitions object with proper typing
  const aliasDefinitions: Record<string, string> = {
    "@": path.resolve(__dirname, "./src"),
  };
  
  // Add rollup native module aliases
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
    '@rollup/rollup-native'
  ];
  
  nativeModules.forEach(moduleName => {
    aliasDefinitions[moduleName] = path.resolve(
      __dirname,
      "./src/utils/modulePatches/rollup-linux-x64-gnu-mock.js"
    );
    console.log(`[Vite Config] Added alias for: ${moduleName}`);
  });
  
  // Create define object with proper typing
  const defineOptions: Record<string, string> = {
    'process.env.ROLLUP_NATIVE_DISABLE': '"true"',
    'global.__ROLLUP_NATIVE_DISABLED__': 'true'
  };
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' ? componentTagger() : false,
      // Enhanced plugin to intercept Rollup module resolution attempts
      {
        name: 'vite-plugin-rollup-native-patch',
        enforce: 'pre' as const,
        resolveId(source: string) {
          if (typeof source === 'string' && 
              (source.includes('@rollup/rollup-') || 
               source.includes('rollup') && source.includes('native'))) {
            console.log(`[Vite Plugin] Intercepted Rollup native module: ${source}`);
            return path.resolve(__dirname, './src/utils/modulePatches/rollup-linux-x64-gnu-mock.js');
          }
          return null;
        },
        transform(code: string, id: string) {
          if (id.includes('rollup') && id.includes('native')) {
            console.log(`[Vite Plugin] Transforming native module code: ${id}`);
            return {
              code: `
                console.log('[Vite Transform] Using pure JS implementation for: ${id}');
                export default {}; 
                export const bindings = null;
                export const isLoaded = false;
                export const load = () => null;
                export const needsRebuilding = () => false;
                export const getUuid = () => 'mocked-uuid';
                export const loadBinding = () => null;
              `,
              map: null
            };
          }
          return null;
        }
      },
      // Add new plugin to prevent errors during builds
      {
        name: 'vite-plugin-handle-missing-rollup-native',
        configResolved(config: ResolvedConfig) {
          console.log('[Vite Plugin] Config resolved with Rollup patching enabled');
        },
        buildStart() {
          console.log('[Vite Plugin] Build starting with Rollup native module patching');
        },
        resolveImport(importInfo: { importee: string; importer: string }) {
          const { importee } = importInfo;
          if (importee && importee.includes('@rollup/rollup-')) {
            return { id: path.resolve(__dirname, './src/utils/modulePatches/rollup-linux-x64-gnu-mock.js') };
          }
          return null;
        }
      }
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: aliasDefinitions,
    },
    optimizeDeps: {
      exclude: nativeModules,
      esbuildOptions: {
        define: defineOptions,
      },
    },
    build: {
      // Completely disable native addons
      rollupOptions: {
        // Use our mocks when rollup tries to import native modules
        shimMissingExports: true,
        external: nativeModules,
        onwarn(warning, warn) {
          // Enhanced warning filter
          if (warning.code === 'UNRESOLVED_IMPORT' && 
              (String(warning).includes('@rollup/rollup-') || 
               String(warning).includes('native.js'))) {
            console.log('[Build] Suppressing native module warning:', String(warning));
            return; // Suppress native module warnings
          }
          warn(warning);
        },
      },
      // Use ES modules only to avoid native dependencies
      modulePreload: {
        polyfill: false,
      },
      // Set platform-neutral targets
      target: 'esnext',
      // Avoid minification issues with native code
      minify: 'esbuild',
      // Keep sourcemap for debugging
      sourcemap: true,
    },
    // Force JS runtime compatibility
    esbuild: {
      target: 'esnext',
      logOverride: {
        // Suppress specific esbuild warnings
        'unsupported-jsx-comment': 'silent',
        'empty-import-meta': 'silent',
      },
    },
  };
});
