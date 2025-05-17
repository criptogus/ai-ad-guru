import { useToast } from '@/hooks/use-toast';

/**
 * Hook centralizado para tratamento de erros na aplicação
 * 
 * Fornece métodos consistentes para lidar com erros em toda a aplicação,
 * garantindo feedback adequado ao usuário e registro de erros para depuração.
 */
export const useErrorHandler = () => {
  const { toast } = useToast();

  /**
   * Trata um erro genérico, exibindo toast e registrando no console
   * @param error O erro capturado
   * @param customMessage Mensagem personalizada opcional para exibir ao usuário
   */
  const handleError = (error: unknown, customMessage?: string) => {
    // Registra o erro no console para depuração
    console.error('Error:', error);
    
    // Determina a mensagem de erro a ser exibida
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error instanceof Error) {
      errorMessage = customMessage || error.message;
    } else if (typeof error === 'string') {
      errorMessage = customMessage || error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = customMessage || (error as any).message;
    }
    
    // Exibe o toast com a mensagem de erro
    toast({
      title: 'Erro',
      description: errorMessage,
      variant: 'destructive',
    });
    
    return errorMessage;
  };

  /**
   * Trata erros específicos de API
   * @param error O erro da API
   * @param fallbackMessage Mensagem de fallback caso não seja possível extrair do erro
   */
  const handleApiError = (error: unknown, fallbackMessage = 'Erro na comunicação com o servidor') => {
    // Tenta extrair informações específicas de erros de API
    let statusCode: number | undefined;
    let apiErrorMessage: string | undefined;
    
    if (error && typeof error === 'object') {
      if ('status' in error) {
        statusCode = (error as any).status;
      }
      
      if ('data' in error && (error as any).data && 'message' in (error as any).data) {
        apiErrorMessage = (error as any).data.message;
      } else if ('message' in error) {
        apiErrorMessage = (error as any).message;
      }
    }
    
    // Personaliza a mensagem com base no código de status
    let userMessage = apiErrorMessage || fallbackMessage;
    
    if (statusCode) {
      if (statusCode === 401 || statusCode === 403) {
        userMessage = 'Você não tem permissão para realizar esta ação';
      } else if (statusCode === 404) {
        userMessage = 'O recurso solicitado não foi encontrado';
      } else if (statusCode >= 500) {
        userMessage = 'Erro no servidor. Por favor, tente novamente mais tarde';
      }
    }
    
    return handleError(error, userMessage);
  };

  /**
   * Trata erros específicos de autenticação
   * @param error O erro de autenticação
   */
  const handleAuthError = (error: unknown) => {
    let authErrorMessage = 'Erro de autenticação';
    
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMsg = (error as any).message;
      
      if (typeof errorMsg === 'string') {
        if (errorMsg.includes('invalid_credentials') || errorMsg.includes('Invalid login')) {
          authErrorMessage = 'Email ou senha incorretos';
        } else if (errorMsg.includes('email_not_confirmed')) {
          authErrorMessage = 'Por favor, confirme seu email antes de fazer login';
        } else if (errorMsg.includes('rate_limited')) {
          authErrorMessage = 'Muitas tentativas. Por favor, tente novamente mais tarde';
        }
      }
    }
    
    return handleError(error, authErrorMessage);
  };

  return {
    handleError,
    handleApiError,
    handleAuthError
  };
};
