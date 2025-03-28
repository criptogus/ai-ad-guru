import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Import the rollup patch directly from the JS file
import { mockNativeBindings } from "./src/utils/modulePatches/rollupNativeModulePatch.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Comprehensive aliasing for all possible Rollup native modules
      ...Object.keys(mockNativeBindings).reduce((aliases, moduleName) => {
        aliases[moduleName] = path.resolve(__dirname, "./src/utils/modulePatches/rollupNativeModulePatch.js");
        return aliases;
      }, {}),
    },
  },
  optimizeDeps: {
    exclude: Object.keys(mockNativeBindings),
    esbuildOptions: {
      // Define empty modules for ALL native dependencies
      define: Object.keys(mockNativeBindings).reduce((defines, moduleName) => {
        defines[`require.resolve("${moduleName}")`] = '"undefined"';
        return defines;
      }, {}),
    },
  },
  build: {
    // Completely disable native addons
    rollupOptions: {
      // Use our mocks when rollup tries to import native modules
      shimMissingExports: true,
      external: Object.keys(mockNativeBindings),
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
}));
