import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Aplicar fixes no início da execução do arquivo de configuração
(function applyFixes() {
  console.log("Applying fixes for Puppeteer and Rollup...");

  // Fix para o Puppeteer
  try {
    const chromePath = '/root/.cache/puppeteer/chrome/linux-135.0.7049.114/chrome-linux64';
    const chromeExecutable = path.join(chromePath, 'chrome');

    if (!fs.existsSync(chromePath)) {
      fs.mkdirSync(chromePath, { recursive: true });
      console.log("Created Chrome directory structure");
    }
    
    if (!fs.existsSync(chromeExecutable)) {
      fs.writeFileSync(chromeExecutable, '#!/bin/sh\necho "Mock Chrome"', { mode: 0o755 });
      console.log("Created mock Chrome executable");
    }

    // Modificar diretamente o arquivo de instalação do Puppeteer
    const puppeteerInstallPath = './node_modules/puppeteer/lib/esm/puppeteer/node/install.js';
    if (fs.existsSync(puppeteerInstallPath)) {
      try {
        let content = fs.readFileSync(puppeteerInstallPath, 'utf8');
        if (!content.includes('PUPPETEER_PATCH_APPLIED')) {
          // Substituir a função downloadBrowsers por uma versão que não faz nada
          content = content.replace(
            /export async function downloadBrowsers$$$$ {/,
            `export async function downloadBrowsers() { 
              // PUPPETEER_PATCH_APPLIED
              console.log('Browser download bypassed by patch');
              return;`
          );
          fs.writeFileSync(puppeteerInstallPath, content);
          console.log("Patched Puppeteer install.js successfully");
        }
      } catch (err) {
        console.error("Error modifying Puppeteer install.js:", err);
      }
    }
  } catch (err) {
    console.warn("Warning: Failed to apply Puppeteer fix:", err);
  }

  // Fix para o Rollup - agora adequado para módulos ES
  try {
    const rollupNativePath = './node_modules/rollup/dist/native.js';
    if (fs.existsSync(rollupNativePath)) {
      // Criar um módulo ES6 que exporta as funções esperadas
      const mockContent = `
// ROLLUP_PATCH_APPLIED - ESM version
// Exportar as funções esperadas como ESM
export function parse() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export async function parseAsync() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

// Mock também a exportação padrão para compatibilidade
export default {
  isSupported: false,
  getDefaultExports() {
    return { parse, parseAsync };
  }
};
`;
      
      fs.writeFileSync(rollupNativePath, mockContent);
      console.log("Patched Rollup native.js as ESM module");
    }
  } catch (err) {
    console.warn("Warning: Failed to apply Rollup fix:", err);
  }
})();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    // Plugin para garantir que os patches sejam aplicados antes da compilação
    {
      name: 'pre-dependency-patches',
      enforce: 'pre',
      async buildStart() {
        process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
        process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

        // Patch do Rollup diretamente nas importações
        const rollupPath = './node_modules/rollup/dist/es/shared/parseAst.js';
        if (fs.existsSync(rollupPath)) {
          let content = fs.readFileSync(rollupPath, 'utf8');
          if (!content.includes('PARSEAST_PATCH_APPLIED')) {
            // Substituir a importação problemática
            content = content.replace(
              "import { parse, parseAsync } from '../../native.js';",
              `// PARSEAST_PATCH_APPLIED
// Importação corrigida para compatibilidade ESM/CommonJS
import native from '../../native.js';
const parse = native.parse || (() => ({ type: 'Program', body: [], sourceType: 'module' }));
const parseAsync = native.parseAsync || (async () => ({ type: 'Program', body: [], sourceType: 'module' }));`
            );
            fs.writeFileSync(rollupPath, content);
            console.log("Patched Rollup parseAst.js to fix import issue");
          }
        }
      }
    },
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['puppeteer', '@puppeteer/browsers', 'chromium'],
    force: true,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
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
        if (warning.code === 'MISSING_EXPORT' || 
            warning.code === 'MISSING_EXTERNAL_DEPENDENCY' ||
            warning.code === 'UNRESOLVED_IMPORT') return;
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
    'process.env.ROLLUP_SKIP_NATIVE': '"true"'
  },
}));