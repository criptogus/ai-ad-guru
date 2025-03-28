
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";
import nativeModuleFixPlugin from "./vite.native-module-fix.js";

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
      // Apply the native module fix plugin first, before anything else
      nativeModuleFixPlugin(),
      react(),
      mode === 'development' ? componentTagger() : false,
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: aliasDefinitions,
    },
    optimizeDeps: {
      exclude: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-win32-x64-msvc',
        'rollup/dist/native',
        'rollup/native'
      ],
      esbuildOptions: {
        define: defineOptions,
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    esbuild: {
      target: 'esnext',
    },
  };
});
