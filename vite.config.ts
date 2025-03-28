
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { RollupLog } from 'rollup';

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
    },
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-*', '@rollup/rollup-win32-*'],
  },
  build: {
    commonjsOptions: {
      // Ensure CommonJS modules don't try to use native dependencies
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      // This ensures Rollup doesn't try to use native modules
      context: 'globalThis',
      // Explicitly disable native module usage
      external: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-win32-x64-msvc'
      ],
      // Don't try to bundle native modules
      onwarn(warning: RollupLog, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('@rollup/rollup-')) {
          // Suppress warnings about unresolved native modules
          return;
        }
        warn(warning);
      },
    },
    // Ensure sourcemaps are properly handled
    sourcemap: true,
    // Optimize chunks to avoid native module issues
    target: 'es2015',
    // Don't try to handle native modules
    ssr: false,
  },
}));
