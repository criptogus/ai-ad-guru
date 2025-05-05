
// vite.config.js - Ultra simplified version for fallback
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      external: [
        '@rollup/rollup-linux-x64-gnu', 
        '@swc/core-linux-x64-gnu',
        'puppeteer',
        '@puppeteer/browsers'
      ],
      treeshake: false,
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.ROLLUP_NATIVE': '"false"',
    'process.env.PUPPETEER_SKIP_DOWNLOAD': '"true"',
    'process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD': '"true"',
  }
});
