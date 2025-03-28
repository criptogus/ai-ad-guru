
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
    // Use the pure JS build of Rollup to avoid native module issues
    rollupOptions: {
      // This ensures Rollup doesn't try to use native modules
      context: 'globalThis',
      // Explicitly disable native module usage
      external: ['@rollup/rollup-linux-x64-gnu'],
    },
    // Ensure sourcemaps are properly handled
    sourcemap: true,
    // Optimize chunks to avoid native module issues
    target: 'es2015',
  },
}));
