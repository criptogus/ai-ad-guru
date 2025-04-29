
// rollup-fix.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo do Rollup que está causando o erro
const rollupNativePath = path.resolve('./node_modules/rollup/dist/native.js');

try {
  if (fs.existsSync(rollupNativePath)) {
    let content = fs.readFileSync(rollupNativePath, 'utf8');
    
    // Verificar se o patch já foi aplicado
    if (!content.includes('ROLLUP_PATCH_APPLIED')) {
      // Modificar o arquivo para evitar o erro de módulo não encontrado
      content = `// ROLLUP_PATCH_APPLIED
const mockNative = {
  isSupported: false,
  getDefaultExports() {
    return {};
  }
};

// Mock da importação nativa que está falhando
module.exports = mockNative;
`;
      
      fs.writeFileSync(rollupNativePath, content);
      console.log('Patched Rollup native module');
    }
  }
} catch (err) {
  console.error('Error patching Rollup:', err);
}
