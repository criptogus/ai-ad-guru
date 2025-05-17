// rollup-native-patch.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nativePath = path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');

console.log('Verificando existência do arquivo Rollup native.js...');

if (fs.existsSync(nativePath)) {
  console.log(`Arquivo encontrado: ${nativePath}`);
  console.log('Aplicando patch para evitar erro de módulo nativo...');
  
  let content = fs.readFileSync(nativePath, 'utf8');
  
  // Modificar o arquivo para não tentar carregar módulos nativos
  content = content.replace(
    /try\s*{[\s\S]*?requireWithFriendlyError[\s\S]*?}\s*catch\s*\(e\)\s*{/,
    'try { return null; } catch (e) {'
  );
  
  fs.writeFileSync(nativePath, content);
  console.log('Patch aplicado com sucesso ao módulo nativo do Rollup!');
} else {
  console.log('Arquivo native.js não encontrado. Pulando patch.');
}
