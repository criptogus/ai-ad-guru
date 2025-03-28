
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
      // Alias native modules to our mock implementations
      "@rollup/rollup-linux-x64-gnu": path.resolve(__dirname, "./src/utils/modulePatches/rollupNativeModulePatch.js"),
      "@rollup/rollup-darwin-x64": path.resolve(__dirname, "./src/utils/modulePatches/rollupNativeModulePatch.js"),
      "@rollup/rollup-darwin-arm64": path.resolve(__dirname, "./src/utils/modulePatches/rollupNativeModulePatch.js"),
      "@rollup/rollup-win32-x64-msvc": path.resolve(__dirname, "./src/utils/modulePatches/rollupNativeModulePatch.js"),
    },
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-*', '@rollup/rollup-win32-*'],
    esbuildOptions: {
      // Define empty modules for native dependencies
      define: {
        'require.resolve("@rollup/rollup-linux-x64-gnu")': 'undefined',
        'require.resolve("@rollup/rollup-darwin-x64")': 'undefined',
        'require.resolve("@rollup/rollup-darwin-arm64")': 'undefined',
        'require.resolve("@rollup/rollup-win32-x64-msvc")': 'undefined',
      },
    },
  },
  build: {
    // Completely disable native addons
    rollupOptions: {
      // Use our mocks when rollup tries to import native modules
      shimMissingExports: true,
      external: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-win32-x64-msvc',
      ],
      onwarn(warning, warn) {
        const warningString = String(warning);
        if (warning.code === 'UNRESOLVED_IMPORT' && 
            (warningString.includes('@rollup/rollup-') || 
             warningString.includes('native.js'))) {
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
  },
}));
