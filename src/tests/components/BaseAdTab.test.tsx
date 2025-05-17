import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BaseAdTab } from '@/components/analytics/insights/AIInsightsCard/tabs/BaseAdTab';

describe('BaseAdTab', () => {
  it('deve renderizar o preview do anúncio corretamente', () => {
    const adPreview = <div data-testid="ad-preview">Teste de Preview</div>;
    
    render(
      <BaseAdTab 
        adPreview={adPreview}
        platform="Google"
        suggestions={[]}
      />
    );
    
    expect(screen.getByTestId('ad-preview')).toBeInTheDocument();
    expect(screen.getByText('Teste de Preview')).toBeInTheDocument();
  });

  it('deve renderizar as sugestões corretamente', () => {
    const suggestions = ['Sugestão 1', 'Sugestão 2', 'Sugestão 3'];
    
    render(
      <BaseAdTab 
        adPreview={<div>Preview</div>}
        platform="Google"
        suggestions={suggestions}
      />
    );
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Sugestão 1')).toBeInTheDocument();
    expect(screen.getByText('Sugestão 2')).toBeInTheDocument();
    expect(screen.getByText('Sugestão 3')).toBeInTheDocument();
  });

  it('deve funcionar com array de sugestões vazio', () => {
    render(
      <BaseAdTab 
        adPreview={<div>Preview</div>}
        platform="Google"
        suggestions={[]}
      />
    );
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    // Não deve haver itens de sugestão
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('deve usar o array de sugestões padrão quando não fornecido', () => {
    render(
      <BaseAdTab 
        adPreview={<div>Preview</div>}
        platform="Google"
      />
    );
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
  });
});
