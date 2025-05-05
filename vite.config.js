
// vite.config.js - Versão extremamente simplificada
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Configuração mínima absoluta
  build: {
    minify: false,
    rollupOptions: {
      // Desativar todos os plugins e recursos do Rollup
      treeshake: false,
      plugins: []
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
