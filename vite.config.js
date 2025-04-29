// vite.config.js - Versão ultrassimplificada
import { defineConfig } from 'vite';
import path from 'path';

// Definir variáveis de ambiente críticas
process.env.SWC_BINARY_PLATFORM = 'browser';
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

export default defineConfig({
  // Configuração mínima para fazer o build funcionar
  server: {
    host: '::',
    port: 8080,
  },
  
  // Não usamos plugins que dependam de módulos nativos
  plugins: [],
  
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  
  // Configurações para evitar dependências problemáticas
  optimizeDeps: {
    exclude: ['puppeteer', '@puppeteer/browsers', 'chromium', '@swc/core', '@rollup/rollup-linux-x64-gnu'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  
  build: {
    // Configurações básicas de build
    target: 'esnext',
    
    // Evitar usar recursos avançados problemáticos
    minify: 'terser',
    sourcemap: true,
    
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu', '@swc/core-linux-x64-gnu'],
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
  },
  
  // Definições de ambiente para evitar módulos nativos
  define: {
    'process.env.ROLLUP_NATIVE': JSON.stringify('false'),
    'process.env.PUPPETEER_SKIP_DOWNLOAD': JSON.stringify('true'),
    'process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD': JSON.stringify('true'),
    'process.env.SWC_BINARY_PLATFORM': JSON.stringify('browser'),
  },
});