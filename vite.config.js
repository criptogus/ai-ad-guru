
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// Aplicar correções no início
try {
  // Fix para Puppeteer
  process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
  process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
  process.env.PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION = 'true';
  process.env.PUPPETEER_PRODUCT = 'none';
  process.env.BROWSER = 'none';
  
  // Fix para Rollup
  const rollupNativePath = path.resolve('./node_modules/rollup/dist/native.js');
  if (fs.existsSync(rollupNativePath)) {
    fs.writeFileSync(rollupNativePath, `
// ROLLUP_PATCH_APPLIED
/**
 * This is a mock implementation to avoid native module errors
 */

const mockNative = {
  isSupported: false,
  getDefaultExports() {
    return {};
  }
};

// Export the mock implementation
module.exports = mockNative;
`);
    console.log('Patched Rollup native module');
  }
} catch (err) {
  console.warn('Failed to apply fixes:', err);
}

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
    exclude: ['puppeteer', '@puppeteer/browsers', 'chromium'], // Exclude puppeteer from optimization
    force: true, // Force dependencies to be bundled
  },
  build: {
    target: 'esnext', // Using modern target for better compatibility
    rollupOptions: {
      // Force pure JavaScript implementation
      context: 'globalThis',
      treeshake: {
        moduleSideEffects: false,
      },
      output: {
        format: 'es',
        hoistTransitiveImports: false,
        inlineDynamicImports: true,
      },
      // Prevent loading native modules
      onwarn(warning, warn) {
        if (warning.code === 'MISSING_EXPORT') return;
        warn(warning);
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto',
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  },
  // Define environment variables that will prevent native module usage
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
    'process.env.PUPPETEER_EXECUTABLE_PATH': '"/bin/true"'
  },
}));
