
# Correções para Problemas de Build

Este documento registra as alterações feitas para resolver problemas de build no projeto.

## Problema 1: Erro com Módulo Nativo do Rollup

**Erro:**
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

**Solução:**
- Implementado `native-module-fix.js` para substituir o módulo nativo por uma implementação em JavaScript puro
- Adicionadas variáveis de ambiente no `netlify.toml` para evitar a dependência de módulos nativos

## Problema 2: Erro de Configuração TypeScript

**Erro:**
```
error TS6305: Output file '/dev-server/vite.config.d.ts' has not been built from source file '/dev-server/vite.config.ts'.
tsconfig.json(40,5): error TS6306: Referenced project '/dev-server/tsconfig.node.json' must have setting "composite": true.
tsconfig.json(40,5): error TS6310: Referenced project '/dev-server/tsconfig.node.json' may not disable emit.
```

**Solução:**
- Criado arquivo `tsconfig.vite.json` alternativo para compilar o `vite.config.ts` sem depender de `tsconfig.node.json`
- Atualizado `fix-build.sh` para usar a nova configuração
- Implementado `fix-typescript-config.js` para aplicar as correções de forma automatizada

## Problema 3: Arquivo Somente Leitura

**Erro:**
```
You attempted to modify a read-only file: tsconfig.node.json
```

**Solução:**
- Evitado modificar `tsconfig.node.json` criando configurações alternativas em `tsconfig.vite.json`
- Implementada abordagem alternativa que não requer modificações em arquivos somente leitura

## Scripts de Correção Disponíveis

1. **fix-all-build-issues.js** - Script completo para resolver todos os problemas
   ```
   node fix-all-build-issues.js
   ```

2. **fix-build.sh** - Script bash para aplicar correções e executar o build
   ```
   bash fix-build.sh
   ```

3. **fix-typescript-config.js** - Corrige especificamente os erros de configuração TypeScript
   ```
   node fix-typescript-config.js
   ```

## Deploy no Netlify

Para garantir o funcionamento no Netlify, o arquivo `netlify.toml` foi atualizado para:
- Compilar o `vite.config.ts` antes do build
- Definir variáveis de ambiente para evitar dependências de módulos nativos
