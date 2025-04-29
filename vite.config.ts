import { defineConfig } from "vite";
// Substitua o plugin react-swc pelo react padrão
import react from "@vitejs/plugin-react"; // <-- Alteração aqui
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), // Usando o plugin React padrão em vez do SWC
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['puppeteer', '@puppeteer/browsers', 'chromium', '@swc/core'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu', '@swc/core-linux-x64-gnu'],
      context: 'globalThis',
      treeshake: {
        moduleSideEffects: false,
      },
      output: {
        format: 'es',
        hoistTransitiveImports: false,
        inlineDynamicImports: true,
      },
      onwarn(warning, warn) {
        // Ignorar avisos específicos
        if (warning.code === 'MISSING_EXPORT' || 
            warning.code === 'MISSING_EXTERNAL_DEPENDENCY' ||
            warning.code === 'UNRESOLVED_IMPORT') {
          return;
        }
        warn(warning);
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto',
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  },
  define: {
    'process.env.ROLLUP_NATIVE': '"false"',
    'process.env.SKIP_OPTIONAL_DEPENDENCY_CHECK': '"true"',
    'process.env.ROLLUP_PURE_JS': '"true"',
    'process.env.PUPPETEER_SKIP_DOWNLOAD': '"true"',
    'process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD': '"true"',
    'process.env.PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION': '"true"',
    'process.env.BROWSER': '"none"',
    'process.env.JS_ONLY': '"true"',
    'process.env.SKIP_BINARY_INSTALL': '"true"',
    'process.env.BUILD_ONLY_JS': '"true"',
    'process.env.PUPPETEER_EXECUTABLE_PATH': '"/bin/true"',
    'process.env.SWC_BINARY_PLATFORM': '"browser"'
  },
}));