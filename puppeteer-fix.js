
// puppeteer-fix.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verifica se o diretório do Chrome existe e cria um mock do executável
const chromePath = '/root/.cache/puppeteer/chrome/linux-135.0.7049.114/chrome-linux64';
const chromeExecutable = path.join(chromePath, 'chrome');

try {
  if (!fs.existsSync(chromePath)) {
    fs.mkdirSync(chromePath, { recursive: true });
  }
  
  if (!fs.existsSync(chromeExecutable)) {
    // Criar um arquivo executável vazio ou um script simples
    fs.writeFileSync(chromeExecutable, '#!/bin/sh\necho "Mock Chrome"', { mode: 0o755 });
    console.log('Created mock Chrome executable');
  }
} catch (err) {
  console.warn('Warning: Failed to create mock Chrome executable:', err);
}

// Modificar o módulo do Puppeteer para usar o chrome-headless-shell que já foi baixado
try {
  const puppeteerPath = path.resolve('./node_modules/puppeteer/lib/esm/puppeteer/node/BrowserFetcher.js');
  if (fs.existsSync(puppeteerPath)) {
    let content = fs.readFileSync(puppeteerPath, 'utf8');
    
    // Substituir a verificação do executável do Chrome
    if (!content.includes('MOCK_PATCH_APPLIED')) {
      content = `// MOCK_PATCH_APPLIED\n${content.replace(
        /if\s*\(!\w+\.existsSync\(executablePath\)\)/g, 
        'if (false)'
      )}`;
      
      fs.writeFileSync(puppeteerPath, content);
      console.log('Patched Puppeteer BrowserFetcher');
    }
  }
} catch (err) {
  console.warn('Warning: Failed to patch Puppeteer:', err);
}
