
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log("[Vite Config] Initializing with deployment-safe configuration...");
  
  // Force disable native modules
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
  process.env.DISABLE_NATIVE_MODULES = 'true';
  
  // Create path aliases
  const aliasDefinitions: Record<string, string> = {
    "@": path.resolve(__dirname, "./src"),
  };
  
  // List all native modules to mock
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
  
  // Add native module aliases
  nativeModules.forEach(moduleName => {
    aliasDefinitions[moduleName] = path.resolve(
      __dirname,
      "./src/utils/modulePatches/rollup-module-mock.js"
    );
  });
  
  // Define environment variables
  const defineOptions: Record<string, string> = {
    'process.env.ROLLUP_NATIVE_DISABLE': '"true"',
    'global.__ROLLUP_NATIVE_DISABLED__': 'true',
    'process.env.DISABLE_NATIVE_MODULES': '"true"'
  };
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' ? componentTagger() : false,
      // Plugin to intercept native module imports
      {
        name: 'vite-plugin-mock-native-modules',
        enforce: 'pre' as const,
        resolveId(source: string) {
          if (typeof source === 'string' && 
              (source.includes('@rollup/rollup-') || 
               source.includes('rollup') && source.includes('native'))) {
            console.log(`[Vite Plugin] Intercepting module: ${source}`);
            return path.resolve(__dirname, './src/utils/modulePatches/rollup-module-mock.js');
          }
          return null;
        },
        transform(code: string, id: string) {
          if (id.includes('rollup') && id.includes('native')) {
            console.log(`[Vite Plugin] Transforming: ${id}`);
            return {
              code: `
                console.log('[Vite Transform] Using JS mock for: ${id}');
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
      rollupOptions: {
        external: nativeModules,
        onwarn(warning, warn) {
          if (warning.code === 'UNRESOLVED_IMPORT' && 
              (String(warning).includes('@rollup/rollup-') || 
               String(warning).includes('native.js'))) {
            console.log('[Build] Ignoring native module warning');
            return;
          }
          warn(warning);
        }
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    esbuild: {
      target: 'esnext',
    },
  };
});
