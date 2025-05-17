// vite.config.js - Versão extremamente simplificada para evitar qualquer problema com módulos nativos
import { defineConfig } from 'vite';
import path from 'path';

// Configuração otimizada para evitar problemas com módulos nativos no Netlify
export default defineConfig({
  // Desabilitar completamente a minificação para evitar problemas
  build: {
    minify: false,
    sourcemap: false,
    // Configurações do Rollup para evitar módulos nativos
    rollupOptions: {
      // Marcar explicitamente todos os módulos nativos como externos
      external: [
        '@rollup/rollup-linux-x64-gnu', 
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-win32-x64-msvc',
        '@swc/core-linux-x64-gnu',
        '@swc/core-win32-x64-msvc',
        '@swc/core-darwin-x64',
        'puppeteer',
        '@puppeteer/browsers',
        // Adicionar mais módulos nativos que possam causar problemas
        'fsevents',
        'esbuild',
        'node-gyp',
        'node-pre-gyp'
      ],
      // Desabilitar tree-shaking para evitar problemas com módulos nativos
      treeshake: false,
      // Usar configurações simplificadas
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    }
  },
  // Resolver aliases para caminhos absolutos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Definir variáveis de ambiente para desabilitar recursos problemáticos
  define: {
    'process.env.ROLLUP_NATIVE': '"false"',
    'process.env.ROLLUP_SKIP_NATIVE': '"true"',
    'process.env.ROLLUP_NATIVE_SKIP': '"true"',
    'process.env.PUPPETEER_SKIP_DOWNLOAD': '"true"',
    'process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD': '"true"',
    'process.env.NODE_OPTIONS': '"--no-warnings --no-node-snapshot"',
    // Forçar modo de produção para evitar verificações adicionais
    'process.env.NODE_ENV': '"production"'
  },
  // Desabilitar otimizações que possam causar problemas
  optimizeDeps: {
    disabled: true
  }
});
