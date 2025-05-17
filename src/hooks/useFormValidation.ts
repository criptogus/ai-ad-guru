import { useErrorHandler } from '@/hooks/useErrorHandler';
import { z } from 'zod';

/**
 * Hook para validação de formulários com tratamento de erros padronizado
 * 
 * Este hook fornece uma interface consistente para validação de formulários
 * usando Zod e integração com o hook de tratamento de erros centralizado.
 */
export const useFormValidation = () => {
  const { handleError } = useErrorHandler();

  /**
   * Valida dados de formulário contra um schema Zod
   * @param schema Schema Zod para validação
   * @param data Dados a serem validados
   * @returns Objeto com dados validados ou null em caso de erro
   */
  const validateForm = <T>(schema: z.ZodType<T>, data: unknown): T | null => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Formata as mensagens de erro do Zod para exibição amigável
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join('\n');
        
        handleError(error, `Erro de validação:\n${errorMessages}`);
      } else {
        handleError(error, 'Erro ao validar formulário');
      }
      return null;
    }
  };

  /**
   * Valida dados de formulário de forma assíncrona
   * @param schema Schema Zod para validação
   * @param data Dados a serem validados
   * @returns Promise com dados validados ou null em caso de erro
   */
  const validateFormAsync = async <T>(schema: z.ZodType<T>, data: unknown): Promise<T | null> => {
    try {
      return await schema.parseAsync(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join('\n');
        
        handleError(error, `Erro de validação:\n${errorMessages}`);
      } else {
        handleError(error, 'Erro ao validar formulário');
      }
      return null;
    }
  };

  return {
    validateForm,
    validateFormAsync
  };
};
