
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
    rollupOptions: {
      // Force Rollup to use the pure JavaScript implementation
      context: 'globalThis',
      treeshake: {
        moduleSideEffects: false,
      },
      // Explicitly tell Rollup to not look for native addons
      shimMissingExports: true,
      // Set specific environment variables to ensure pure JS implementation
      output: {
        // Minimize dependencies on native extensions
        format: 'es',
        // Ensure consistent environment between different machines
        hoistTransitiveImports: false,
      }
    },
    // Specify environment variables to force pure JS implementation
    commonjsOptions: {
      transformMixedEsModules: true,
      // Prevent trying to use native modules
      requireReturnsDefault: 'auto'
    }
  },
  // Define environment variables that will prevent native module usage
  define: {
    'process.env.ROLLUP_NATIVE': 'false',
    'process.env.SKIP_OPTIONAL_DEPENDENCY_CHECK': 'true'
  },
}));
