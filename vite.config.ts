
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
  optimizeDeps: {
    exclude: ['puppeteer'], // Exclude puppeteer from optimization
  },
  build: {
    rollupOptions: {
      // Force pure JavaScript implementation
      context: 'globalThis',
      treeshake: {
        moduleSideEffects: false,
      },
      output: {
        format: 'es',
        hoistTransitiveImports: false,
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto'
    }
  },
  // Define environment variables that will prevent native module usage
  define: {
    'process.env.ROLLUP_NATIVE': '"false"',
    'process.env.SKIP_OPTIONAL_DEPENDENCY_CHECK': '"true"',
    'process.env.ROLLUP_PURE_JS': '"true"',
    'process.env.PUPPETEER_SKIP_DOWNLOAD': '"true"',
    'process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD': '"true"'
  },
}));
