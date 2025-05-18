
// fix-typescript-config.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 Aplicando correções na configuração TypeScript...');

// Criar uma configuração alternativa para o vite.config.ts
const tsConfigVite = {
  compilerOptions: {
    target: "ESNext",
    useDefineForClassFields: true,
    lib: ["DOM", "DOM.Iterable", "ESNext"],
    allowJs: false,
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    module: "ESNext",
    moduleResolution: "Node",
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: false,
    composite: true,
    declaration: true,
    jsx: "react-jsx",
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"]
    }
  },
  include: ["vite.config.ts"]
};

// Escrever o arquivo de configuração
fs.writeFileSync('tsconfig.vite.json', JSON.stringify(tsConfigVite, null, 2));
console.log('✅ Configuração TypeScript alternativa criada: tsconfig.vite.json');

// Compilar o vite.config.ts
try {
  console.log('📝 Compilando vite.config.ts...');
  execSync('npx tsc -p tsconfig.vite.json', { stdio: 'inherit' });
  console.log('✅ vite.config.ts compilado com sucesso');
} catch (error) {
  console.error('❌ Erro ao compilar vite.config.ts:', error);
}

console.log('🔄 Processo de correção TypeScript concluído');
