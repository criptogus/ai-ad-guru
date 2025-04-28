
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
  build: {
    // Fix Rollup build issues by avoiding platform-specific modules
    rollupOptions: {
      context: 'window',
      external: [],
      onwarn(warning, warn) {
        // Ignore certain warnings that break the build
        if (warning.code === 'MISSING_NODE_BUILTINS') return;
        if (warning.code === 'SOURCEMAP_ERROR') return;
        if (warning.message && warning.message.includes('@rollup/rollup-')) return;
        warn(warning);
      },
      // Force avoiding native extensions completely
      treeshake: {
        moduleSideEffects: false,
      }
    },
    commonjsOptions: {
      // Prevent issues with platform-specific optional dependencies
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
}));
