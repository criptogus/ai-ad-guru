
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Aplicar fixes imediatamente quando este arquivo é carregado
(function applyFixes() {
  console.log("Applying fixes for Puppeteer and Rollup...");

  // Fix para o Puppeteer - criar diretórios e executáveis mock
  try {
    // Chrome regular
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

    // Chrome headless shell
    const headlessPath = '/root/.cache/puppeteer/chrome-headless-shell/linux-135.0.7049.114';
    const headlessExecutable = path.join(headlessPath, 'chrome-headless-shell');
    
    if (!fs.existsSync(headlessPath)) {
      fs.mkdirSync(headlessPath, { recursive: true });
      console.log("Created Chrome-headless-shell directory structure");
    }
    
    if (!fs.existsSync(headlessExecutable)) {
      fs.writeFileSync(headlessExecutable, '#!/bin/sh\necho "Mock Chrome-Headless-Shell"', { mode: 0o755 });
      console.log("Created mock Chrome-headless-shell executable");
    }

    // Modificar diretamente o arquivo de instalação do Puppeteer
    const puppeteerInstallPath = './node_modules/puppeteer/lib/esm/puppeteer/node/install.js';
    if (fs.existsSync(puppeteerInstallPath)) {
      try {
        let content = fs.readFileSync(puppeteerInstallPath, 'utf8');
        if (!content.includes('PUPPETEER_PATCH_APPLIED')) {
          // Substituir a função downloadBrowsers por uma versão que não faz nada
          content = content.replace(
            /export async function downloadBrowsers.*?\{/s,
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

    // Patch BrowserFetcher.js para evitar verificação do executável
    const browserFetcherPath = './node_modules/puppeteer/lib/esm/puppeteer/node/BrowserFetcher.js';
    if (fs.existsSync(browserFetcherPath)) {
      try {
        let content = fs.readFileSync(browserFetcherPath, 'utf8');
        if (!content.includes('BROWSER_FETCHER_PATCH_APPLIED')) {
          // Substituir verificação de existência do executável
          content = content.replace(
            /if\s*\(!\w+\.existsSync\(executablePath\)\)/g,
            `if (false) // BROWSER_FETCHER_PATCH_APPLIED`
          );
          fs.writeFileSync(browserFetcherPath, content);
          console.log("Patched BrowserFetcher.js successfully");
        }
      } catch (err) {
        console.error("Error modifying BrowserFetcher.js:", err);
      }
    }
  } catch (err) {
    console.warn("Warning: Failed to apply Puppeteer fix:", err);
  }

  // Fix para o Rollup - criar um mock ESM para o módulo nativo
  try {
    const rollupNativePath = './node_modules/rollup/dist/native.js';
    if (fs.existsSync(rollupNativePath)) {
      // Verificar se já está corrigido
      const content = fs.readFileSync(rollupNativePath, 'utf8');
      if (!content.includes('ROLLUP_PATCH_APPLIED')) {
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
      } else {
        console.log("Rollup native.js already patched");
      }
    }

    // Patch também o arquivo que importa o native.js
    const parseAstPath = './node_modules/rollup/dist/es/shared/parseAst.js';
    if (fs.existsSync(parseAstPath)) {
      const content = fs.readFileSync(parseAstPath, 'utf8');
      if (!content.includes('PARSEAST_PATCH_APPLIED')) {
        // Substituir a importação problemática
        const newContent = content.replace(
          "import { parse, parseAsync } from '../../native.js';",
          `// PARSEAST_PATCH_APPLIED
// Importação corrigida para compatibilidade ESM/CommonJS
import pkg from '../../native.js';
const parse = pkg.parse || ((code) => ({ type: 'Program', body: [], sourceType: 'module' }));
const parseAsync = pkg.parseAsync || (async (code) => ({ type: 'Program', body: [], sourceType: 'module' }));`
        );
        fs.writeFileSync(parseAstPath, newContent);
        console.log("Patched parseAst.js to fix import issue");
      } else {
        console.log("parseAst.js already patched");
      }
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
    // Plugin para garantir que os patches são aplicados antes da compilação
    {
      name: 'mock-problematic-dependencies',
      enforce: 'pre',
      resolveId(id) {
        // Interceptar módulos específicos
        if (id.includes('@rollup/rollup-linux-x64-gnu') || 
            id === '../../native.js' ||
            id === 'native.js' ||
            id.endsWith('/native.js')) {
          return 'virtual:mocked-native-module';
        }

        // Interceptar módulos do Puppeteer relacionados ao download do Chrome
        if (id.includes('puppeteer') && (
            id.includes('/install.js') || 
            id.includes('/browser.js') || 
            id.includes('/BrowserFetcher.js'))) {
          return `virtual:mocked-puppeteer-${id.split('/').pop()}`;
        }
        
        return null;
      },
      
      load(id) {
        // Módulo nativo do Rollup
        if (id === 'virtual:mocked-native-module') {
          console.log('Providing mock for Rollup native module');
          return `
            export function parse() { return { type: 'Program', body: [], sourceType: 'module' }; }
            export async function parseAsync() { return { type: 'Program', body: [], sourceType: 'module' }; }
            export default { isSupported: false, getDefaultExports() { return { parse, parseAsync }; } };
          `;
        }
        
        // Módulos do Puppeteer
        if (id.startsWith('virtual:mocked-puppeteer-')) {
          const moduleType = id.replace('virtual:mocked-puppeteer-', '');
          console.log(`Providing mock for Puppeteer ${moduleType}`);
          
          if (moduleType === 'install.js') {
            return `export async function downloadBrowsers() { console.log('Mocked downloadBrowsers'); return; }`;
          }
          
          if (moduleType === 'BrowserFetcher.js') {
            return `
              export class BrowserFetcher {
                constructor() {}
                static createBrowserFetcher() { return new BrowserFetcher(); }
                download() { return Promise.resolve({ executablePath: '/bin/true' }); }
                localRevisions() { return Promise.resolve(['mock-revision']); }
                revisionInfo() { return { executablePath: '/bin/true', local: true }; }
              }
            `;
          }
          
          return '// Mocked Puppeteer module';
        }
        
        return null;
      }
    },
    
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@rollup/rollup-linux-x64-gnu': path.resolve(__dirname, 'src/mocks/empty-module.js'),
      [path.resolve('node_modules/rollup/dist/native.js')]: path.resolve(__dirname, 'src/mocks/empty-module.js'),
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
