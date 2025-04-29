// vite.config.js - Versão extremamente simplificada
import { defineConfig } from 'vite';

export default defineConfig({
  // Configuração mínima absoluta
  build: {
    minify: false,
    rollupOptions: {
      // Desativar todos os plugins e recursos do Rollup
      treeshake: false,
      plugins: []
    }
  }
});