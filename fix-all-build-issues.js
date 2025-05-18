
// fix-all-build-issues.js
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log('🛠️ Iniciando script de correção completa para problemas de build...');

// 1. Corrigir o módulo nativo do Rollup
console.log('\n📦 Corrigindo módulo nativo do Rollup...');
try {
  execSync('node native-module-fix.js', { stdio: 'inherit' });
  console.log('✅ Módulo nativo do Rollup corrigido');
} catch (error) {
  console.error('❌ Erro ao corrigir módulo nativo do Rollup:', error);
  // Continuar com o script mesmo se esta parte falhar
}

// 2. Criar configuração TypeScript alternativa
console.log('\n📝 Criando configuração TypeScript alternativa...');
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
console.log('✅ Criado arquivo tsconfig.vite.json');

// 3. Compilar o vite.config.ts com a nova configuração
console.log('\n🔄 Compilando vite.config.ts...');
try {
  execSync('npx tsc -p tsconfig.vite.json', { stdio: 'inherit' });
  console.log('✅ vite.config.ts compilado com sucesso');
} catch (error) {
  console.error('❌ Erro ao compilar vite.config.ts:', error);
}

// 4. Executar o build com variáveis de ambiente ajustadas
console.log('\n🚀 Executando build com correções aplicadas...');
try {
  execSync('vite build --mode development', {
    stdio: 'inherit',
    env: {
      ...process.env,
      ROLLUP_NATIVE_SKIP: 'true',
      ROLLUP_PURE_JS: 'true',
      PUPPETEER_SKIP_DOWNLOAD: 'true',
      PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
      PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION: 'true',
      BROWSER: 'none',
      NODE_OPTIONS: '--no-warnings'
    }
  });
  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro ao executar o build:', error);
  console.log('\n🔍 Tentando solução alternativa...');
  
  // 5. Solução alternativa se o build falhar
  try {
    execSync('vite build --mode development --config vite.config.js', {
      stdio: 'inherit',
      env: {
        ...process.env,
        ROLLUP_NATIVE_SKIP: 'true',
        ROLLUP_PURE_JS: 'true'
      }
    });
    console.log('✅ Build alternativo concluído com sucesso!');
  } catch (alternativeError) {
    console.error('❌ Todas as tentativas de build falharam:', alternativeError);
    process.exit(1);
  }
}

console.log('\n✨ Processo de correção completo! O projeto deve estar funcionando agora.');
