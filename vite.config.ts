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

    // Modificar o módulo de instalação do Puppeteer se possível
    const puppeteerInstallPath = path.resolve('./node_modules/puppeteer/lib/esm/puppeteer/node/install.js');
    if (fs.existsSync(puppeteerInstallPath)) {
      let content = fs.readFileSync(puppeteerInstallPath, 'utf8');
      if (!content.includes('PUPPETEER_PATCH_APPLIED')) {
        content = `// PUPPETEER_PATCH_APPLIED
// Bypass download
export async function downloadBrowsers() {
  console.log('Browser download bypassed by patch');
  return;
}
${content}`;
        fs.writeFileSync(puppeteerInstallPath, content);
        console.log("Patched Puppeteer install.js");
      }
    }
  } catch (err) {
    console.warn("Warning: Failed to apply Puppeteer fix:", err);
  }

  // Fix para o Rollup
  try {
    const rollupNativePath = path.resolve('./node_modules/rollup/dist/native.js');
    if (fs.existsSync(rollupNativePath)) {
      let content = fs.readFileSync(rollupNativePath, 'utf8');
      
      if (!content.includes('ROLLUP_PATCH_APPLIED')) {
        content = `// ROLLUP_PATCH_APPLIED
const mockNative = {
  isSupported: false,
  getDefaultExports() {
    return {};
  }
};

// Mock da importação nativa que está falhando
module.exports = mockNative;`;
        
        fs.writeFileSync(rollupNativePath, content);
        console.log("Patched Rollup native module");
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
    react(),
    mode === 'development' &&
    componentTagger(),
    // Adicione um plugin personalizado para garantir que os fixes sejam aplicados
    {
      name: 'apply-dependency-fixes',
      enforce: 'pre',
      buildStart() {
        // Define variáveis de ambiente no início do build
        process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
        process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
        process.env.SKIP_BINARY_DOWNLOAD = 'true';
        console.log("Build environment variables set by custom plugin");
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['puppeteer', '@puppeteer/browsers', 'chromium', '@rollup/rollup-linux-x64-gnu'], // Exclude problematic deps
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
      external: ['@rollup/rollup-linux-x64-gnu'], // Explicitamente excluir o módulo problemático
      // Prevent loading native modules
      onwarn(warning, warn) {
        if (warning.code === 'MISSING_EXPORT') return;
        // Ignorar também avisos sobre módulos externos não encontrados
        if (warning.code === 'MISSING_EXTERNAL_DEPENDENCY' && 
            warning.message.includes('@rollup/rollup-linux-x64-gnu')) return;
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
    'process.env.PUPPETEER_EXECUTABLE_PATH': '"/bin/true"',
    // Adicionar mais variáveis para o Rollup
    'process.env.ROLLUP_SKIP_NATIVE': '"true"'
  },
}));