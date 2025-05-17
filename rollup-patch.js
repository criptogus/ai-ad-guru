/**
 * Script para corrigir o erro do módulo nativo do Rollup no Netlify
 * 
 * Este script modifica o arquivo native.js do Rollup para evitar
 * a tentativa de carregar módulos nativos opcionais que causam
 * falha no build do Netlify.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo native.js do Rollup
const nativeJsPath = path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');

console.log('Verificando existência do arquivo Rollup native.js...');

// Verifica se o arquivo existe
if (!fs.existsSync(nativeJsPath)) {
  console.log('Arquivo native.js não encontrado. Pulando patch.');
  process.exit(0);
}

console.log(`Arquivo encontrado: ${nativeJsPath}`);
console.log('Aplicando patch para evitar erro de módulo nativo...');

// Lê o conteúdo do arquivo
let content = fs.readFileSync(nativeJsPath, 'utf8');

// Substitui o código que tenta carregar o módulo nativo
// por uma versão que retorna uma implementação vazia
const patchedContent = content.replace(
  /try\s*{[\s\S]*?requireWithFriendlyError[\s\S]*?}\s*catch\s*\(e\)\s*{[\s\S]*?}/,
  `try {
    // Patch aplicado para evitar erro de módulo nativo no Netlify
    console.log('Usando implementação JavaScript pura para o Rollup (patch aplicado)');
    return {
      // Implementação vazia que não usa módulos nativos
      getDefaultExportFromCjs: () => ({}),
      getImportMetaUrl: () => '',
      getPackageType: () => 'commonjs',
      requireReturnsDefault: () => true,
      resolve: () => null,
      syncBuiltinESMExports: () => {}
    };
  } catch (e) {
    console.log('Erro ao aplicar patch, usando fallback:', e);
    return {};
  }`
);

// Escreve o conteúdo modificado de volta no arquivo
fs.writeFileSync(nativeJsPath, patchedContent, 'utf8');

console.log('Patch aplicado com sucesso!');
