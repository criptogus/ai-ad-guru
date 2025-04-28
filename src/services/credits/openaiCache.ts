
import { supabase } from '@/integrations/supabase/client';
import crypto from 'crypto';

/**
 * Gera uma chave de cache única baseada nos parâmetros de entrada
 */
export const generateCacheKey = (inputParams: any): string => {
  // Converter o objeto para string para gerar o hash
  const inputString = JSON.stringify(inputParams);
  return crypto.createHash('sha256').update(inputString).digest('hex');
};

/**
 * Verifica se existe um cache válido para os parâmetros de entrada
 */
export const getOpenAICache = async (inputParams: any): Promise<any | null> => {
  try {
    const cacheKey = generateCacheKey(inputParams);
    
    const { data, error } = await supabase
      .from('openai_cache')
      .select('response')
      .eq('key', cacheKey)
      .gt('expiration', new Date().toISOString())
      .maybeSingle();
    
    if (error || !data) {
      console.log('Cache miss or error:', error);
      return null;
    }
    
    console.log('Cache hit for key:', cacheKey);
    return data.response;
  } catch (err) {
    console.error('Error accessing OpenAI cache:', err);
    return null;
  }
};

/**
 * Salva uma resposta da OpenAI no cache
 */
export const setOpenAICache = async (inputParams: any, response: any): Promise<boolean> => {
  try {
    const cacheKey = generateCacheKey(inputParams);
    
    // Calcular data de expiração (30 dias a partir de agora)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    const { error } = await supabase
      .from('openai_cache')
      .insert({
        key: cacheKey,
        response: response,
        expiration: expirationDate.toISOString(),
      });
    
    if (error) {
      console.error('Error saving to OpenAI cache:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error writing to OpenAI cache:', err);
    return false;
  }
};
