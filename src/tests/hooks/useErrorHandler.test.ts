import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// Mock do hook useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useErrorHandler', () => {
  let consoleSpy;
  
  beforeEach(() => {
    // Espionar console.error para verificar se está sendo chamado
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('deve tratar erros genéricos corretamente', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    // Testar com um objeto Error
    const testError = new Error('Erro de teste');
    result.current.handleError(testError);
    
    // Verificar se console.error foi chamado
    expect(consoleSpy).toHaveBeenCalledWith('Error:', testError);
  });

  it('deve tratar erros de API corretamente', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    // Testar com um erro de API simulado
    const apiError = {
      status: 404,
      data: { message: 'Recurso não encontrado' }
    };
    
    result.current.handleApiError(apiError);
    
    // Verificar se console.error foi chamado
    expect(consoleSpy).toHaveBeenCalledWith('Error:', apiError);
  });

  it('deve tratar erros de autenticação corretamente', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    // Testar com um erro de autenticação simulado
    const authError = {
      message: 'invalid_credentials'
    };
    
    result.current.handleAuthError(authError);
    
    // Verificar se console.error foi chamado
    expect(consoleSpy).toHaveBeenCalledWith('Error:', authError);
  });

  it('deve personalizar mensagens de erro com base no código de status', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    // Testar com diferentes códigos de status
    const notFoundError = {
      status: 404,
      message: 'Not found'
    };
    
    const serverError = {
      status: 500,
      message: 'Internal server error'
    };
    
    const authError = {
      status: 401,
      message: 'Unauthorized'
    };
    
    result.current.handleApiError(notFoundError);
    result.current.handleApiError(serverError);
    result.current.handleApiError(authError);
    
    // Verificar se console.error foi chamado para cada erro
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });
});
