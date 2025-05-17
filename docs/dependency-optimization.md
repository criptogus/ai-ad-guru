# Análise e Otimização de Dependências

Este documento apresenta uma análise detalhada das dependências do projeto AI Ad Guru, com recomendações para otimização do bundle, remoção de pacotes desnecessários e atualização de versões.

## Resumo Executivo

O projeto possui um número significativo de dependências (mais de 60), muitas das quais podem ser otimizadas ou removidas para melhorar o desempenho e a manutenibilidade.

## Dependências Redundantes ou Desnecessárias

| Pacote | Recomendação | Justificativa |
|--------|--------------|---------------|
| `react-icons` | Remover | Já utilizamos `lucide-react` para ícones. Manter duas bibliotecas de ícones aumenta o tamanho do bundle. |
| `puppeteer` | Mover para devDependencies | É uma dependência pesada (~170MB) usada apenas para testes e não deve estar em produção. |
| `rollup` como dependência direta | Remover | Já está incluído como dependência do Vite. Manter como dependência direta pode causar conflitos de versão. |

## Otimizações de Importação

| Pacote | Recomendação | Justificativa |
|--------|--------------|---------------|
| `@radix-ui/*` | Importar seletivamente | Atualmente importamos todos os componentes Radix, mesmo os não utilizados. Importar apenas os necessários reduzirá o bundle. |
| `lucide-react` | Importar ícones individualmente | Em vez de importar todo o pacote, importar apenas os ícones utilizados reduzirá significativamente o tamanho do bundle. |
| `date-fns` | Importar funções específicas | Importar apenas as funções de data necessárias em vez do pacote completo. |

## Atualizações Recomendadas

| Pacote | Versão Atual | Versão Recomendada | Justificativa |
|--------|--------------|-------------------|---------------|
| `vite` | 4.5.2 | 5.x | A versão 5 traz melhorias significativas de performance e segurança. |
| `rollup` | 2.60.0 | Remover ou atualizar para 3.x | A versão atual é muito antiga (2021) e pode causar problemas de compatibilidade. |

## Dependências Pesadas a Otimizar

| Pacote | Tamanho | Recomendação |
|--------|---------|--------------|
| `puppeteer` | ~170MB | Mover para devDependencies e usar `puppeteer-core` se possível |
| `recharts` | ~2MB | Considerar alternativas mais leves como `lightweight-charts` ou `chart.js` |
| `framer-motion` | ~1MB | Importar apenas os componentes necessários ou considerar alternativas mais leves |

## Configuração de Bundle Splitting

Recomendamos implementar bundle splitting mais agressivo no Vite para melhorar o carregamento inicial:

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom',
            'react-router-dom'
          ],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            // outros componentes UI frequentemente usados
          ],
          'charts': ['recharts'],
          'animations': ['framer-motion'],
        }
      }
    }
  }
})
```

## Plano de Implementação

1. **Fase 1: Remoção de Dependências Desnecessárias**
   - Remover `react-icons` e substituir por `lucide-react`
   - Mover `puppeteer` para devDependencies
   - Remover `rollup` como dependência direta

2. **Fase 2: Otimização de Importações**
   - Refatorar importações de `lucide-react` para serem seletivas
   - Refatorar importações de `@radix-ui/*` para incluir apenas componentes necessários
   - Otimizar importações de `date-fns`

3. **Fase 3: Atualizações de Versão**
   - Atualizar `vite` para versão 5.x
   - Atualizar outras dependências desatualizadas

4. **Fase 4: Configuração de Bundle Splitting**
   - Implementar estratégia de chunking no vite.config.js

## Impacto Esperado

- **Redução do tamanho do bundle**: ~30-40%
- **Melhoria no tempo de carregamento inicial**: ~25%
- **Redução no tempo de build**: ~15%
- **Melhoria na manutenibilidade**: Menos dependências para gerenciar e atualizar
