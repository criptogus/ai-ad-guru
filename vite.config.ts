
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
    // Avoid platform-specific modules
    rollupOptions: {
      external: [],
      onwarn(warning, warn) {
        // Skip specific warnings related to platform-specific modules
        if (
          warning.code === 'MISSING_NODE_BUILTINS' || 
          warning.code === 'SOURCEMAP_ERROR' ||
          (warning.message && (
            warning.message.includes('@rollup/rollup-linux') ||
            warning.message.includes('@rollup/rollup-darwin') ||
            warning.message.includes('@rollup/rollup-win32') ||
            warning.message.includes('Cannot find module')
          ))
        ) {
          return;
        }
        warn(warning);
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'react', 'react-dom']
  }
}));
