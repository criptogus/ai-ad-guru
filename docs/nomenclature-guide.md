# Guia de Padronização de Nomenclatura

Este documento estabelece as convenções de nomenclatura para arquivos e diretórios no projeto AI Ad Guru, visando garantir consistência e facilitar a manutenção.

## Convenções Gerais

### Diretórios

- **Singular**: Para módulos que representam um conceito único ou uma funcionalidade específica
  - Exemplos: `auth`, `config`, `layout`

- **Plural**: Para módulos que contêm coleções de entidades similares
  - Exemplos: `components`, `hooks`, `utils`

### Arquivos

- **Componentes React**: PascalCase
  - Exemplos: `Button.tsx`, `UserProfile.tsx`

- **Hooks**: camelCase com prefixo "use"
  - Exemplos: `useAuth.ts`, `useErrorHandler.ts`

- **Serviços**: camelCase com sufixo "Service"
  - Exemplos: `authService.ts`, `campaignService.ts`

- **Utilitários**: camelCase
  - Exemplos: `formatDate.ts`, `stringUtils.ts`

- **Tipos e Interfaces**: PascalCase
  - Exemplos: `UserTypes.ts`, `CampaignInterface.ts`

## Padronização Específica

### Módulos a Padronizar

1. **campaign → campaigns**
   - Justificativa: Este módulo contém múltiplas entidades e funcionalidades relacionadas a campanhas

2. **ad → ads**
   - Justificativa: Este módulo contém múltiplas entidades e funcionalidades relacionadas a anúncios

### Estrutura de Diretórios Padronizada

```
src/
├── components/     # Componentes React reutilizáveis
├── contexts/       # Contextos React
├── hooks/          # Hooks personalizados
├── pages/          # Componentes de página
├── services/       # Serviços e APIs
│   ├── ads/        # Serviços relacionados a anúncios (plural)
│   ├── auth/       # Serviços de autenticação (singular - conceito único)
│   ├── campaigns/  # Serviços relacionados a campanhas (plural)
│   └── ...
├── utils/          # Funções utilitárias
└── ...
```

## Implementação

A padronização será implementada em fases:

1. Renomear diretórios mantendo a compatibilidade
2. Atualizar imports em arquivos afetados
3. Atualizar referências em documentação
4. Validar funcionamento com testes

## Benefícios

- **Consistência**: Facilita a navegação e compreensão do código
- **Manutenção**: Reduz confusão e erros ao trabalhar com o código
- **Onboarding**: Facilita a integração de novos desenvolvedores
- **Escalabilidade**: Estabelece padrões claros para expansão futura
