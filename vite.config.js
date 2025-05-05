
// vite.config.js - Simplified version without platform-specific dependencies
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      external: [
        '@rollup/rollup-linux-x64-gnu', 
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-win32-x64-msvc',
        '@swc/core-linux-x64-gnu',
        '@swc/core-win32-x64-msvc',
        '@swc/core-darwin-x64',
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
    'process.env.NODE_OPTIONS': '"--no-warnings"',
  }
});
