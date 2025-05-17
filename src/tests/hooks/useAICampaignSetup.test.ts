import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAICampaignSetup } from '@/hooks/useAICampaignSetup';

// Mock das dependências
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleApiError: vi.fn(),
  }),
}));

describe('useAICampaignSetup', () => {
  const mockAnalysisResult = {
    url: 'https://example.com',
    language: 'pt',
    title: 'Example Website',
    description: 'An example website for testing',
    keywords: ['example', 'test', 'website'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve iniciar com isGenerating como false', () => {
    const { result } = renderHook(() => useAICampaignSetup());
    expect(result.current.isGenerating).toBe(false);
  });

  it('deve retornar null quando não há resultado de análise', async () => {
    const { result } = renderHook(() => useAICampaignSetup());
    
    let response;
    await act(async () => {
      response = await result.current.generateCampaignSetup(null, 'google');
    });
    
    expect(response).toBeNull();
  });

  it('deve chamar a função do Supabase com os parâmetros corretos', async () => {
    const mockResponse = {
      data: { campaignSettings: { name: 'Test Campaign' } },
      error: null,
    };
    
    const { supabase } = await import('@/integrations/supabase/client');
    supabase.functions.invoke.mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useAICampaignSetup());
    
    await act(async () => {
      await result.current.generateCampaignSetup(mockAnalysisResult, 'google');
    });
    
    expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-campaign-setup', {
      body: {
        analysisResult: mockAnalysisResult,
        platform: 'google',
        language: 'pt',
      },
    });
  });

  it('deve atualizar isGenerating durante o processo', async () => {
    const mockResponse = {
      data: { campaignSettings: { name: 'Test Campaign' } },
      error: null,
    };
    
    const { supabase } = await import('@/integrations/supabase/client');
    supabase.functions.invoke.mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useAICampaignSetup());
    
    expect(result.current.isGenerating).toBe(false);
    
    let promise;
    act(() => {
      promise = result.current.generateCampaignSetup(mockAnalysisResult, 'google');
      expect(result.current.isGenerating).toBe(true);
    });
    
    await act(async () => {
      await promise;
    });
    
    expect(result.current.isGenerating).toBe(false);
  });

  it('deve lidar com erros da API corretamente', async () => {
    const mockError = {
      message: 'API Error',
      status: 500,
    };
    
    const mockErrorResponse = {
      data: null,
      error: mockError,
    };
    
    const { supabase } = await import('@/integrations/supabase/client');
    supabase.functions.invoke.mockResolvedValue(mockErrorResponse);
    
    const { result } = renderHook(() => useAICampaignSetup());
    
    let response;
    await act(async () => {
      response = await result.current.generateCampaignSetup(mockAnalysisResult, 'google');
    });
    
    expect(response).toBeNull();
    expect(result.current.isGenerating).toBe(false);
  });
});
