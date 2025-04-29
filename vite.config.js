// vite.config.js - Vanilla extremamente básico
import { defineConfig } from 'vite';

export default defineConfig({
  // Quase sem configurações, apenas o mínimo necessário
  build: {
    // Para o modo de desenvolvimento
    minify: false,
    sourcemap: true,
  }
});