
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';
import crypto from 'crypto';

interface CacheParams {
  [key: string]: any;
}

interface CacheEntry {
  id: string;
  key: string;
  response: any;
  expiration: string;
  created_at: string;
}

export class OpenAICacheService {
  /**
   * Generate a cache key from input parameters
   */
  static generateCacheKey(params: CacheParams): string {
    const inputString = JSON.stringify(params);
    return crypto.createHash('sha256').update(inputString).digest('hex');
  }

  /**
   * Check if a response is cached for the given parameters
   */
  static async hasCachedResponse(params: CacheParams): Promise<boolean> {
    try {
      const cacheKey = this.generateCacheKey(params);
      console.log('Checking for cached response with key:', cacheKey);
      
      const { data, error } = await supabase
        .from('openai_cache')
        .select('id, expiration')
        .eq('key', cacheKey)
        .gt('expiration', new Date().toISOString())
        .maybeSingle();
      
      if (error) {
        console.error('Error checking OpenAI cache:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'check_cache'
        }, 'OpenAICacheService.hasCachedResponse');
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in hasCachedResponse:', error);
      errorLogger.logError(error, 'OpenAICacheService.hasCachedResponse');
      return false;
    }
  }

  /**
   * Retrieve a cached response
   */
  static async getCachedResponse<T>(params: CacheParams): Promise<{ data: T | null; fromCache: boolean; cachedAt?: string; expiresAt?: string }> {
    try {
      const cacheKey = this.generateCacheKey(params);
      console.log('Getting cached response with key:', cacheKey);
      
      const { data, error } = await supabase
        .from('openai_cache')
        .select('response, created_at, expiration')
        .eq('key', cacheKey)
        .gt('expiration', new Date().toISOString())
        .maybeSingle();
      
      if (error) {
        console.error('Error retrieving from OpenAI cache:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'get_cache'
        }, 'OpenAICacheService.getCachedResponse');
        return { data: null, fromCache: false };
      }
      
      if (data) {
        console.log('Cache hit! Using cached response from:', data.created_at);
        return { 
          data: data.response as T,
          fromCache: true,
          cachedAt: data.created_at,
          expiresAt: data.expiration
        };
      }
      
      return { data: null, fromCache: false };
    } catch (error) {
      console.error('Error in getCachedResponse:', error);
      errorLogger.logError(error, 'OpenAICacheService.getCachedResponse');
      return { data: null, fromCache: false };
    }
  }

  /**
   * Store a response in the cache
   */
  static async cacheResponse(params: CacheParams, response: any, expirationDays: number = 30): Promise<boolean> {
    try {
      const cacheKey = this.generateCacheKey(params);
      console.log('Caching response with key:', cacheKey);
      
      // Calculate expiration date
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + expirationDays);
      
      const { error } = await supabase
        .from('openai_cache')
        .insert({
          key: cacheKey,
          response,
          expiration: expiration.toISOString()
        });
      
      if (error) {
        console.error('Error caching OpenAI response:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'cache_response'
        }, 'OpenAICacheService.cacheResponse');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in cacheResponse:', error);
      errorLogger.logError(error, 'OpenAICacheService.cacheResponse');
      return false;
    }
  }

  /**
   * Get and cache response if not cached yet
   */
  static async getOrCreateCachedResponse<T>(
    params: CacheParams, 
    fetchFunction: () => Promise<T>
  ): Promise<{ data: T | null; fromCache: boolean; cachedAt?: string; expiresAt?: string }> {
    // Try to get from cache first
    const cachedResult = await this.getCachedResponse<T>(params);
    
    if (cachedResult.fromCache && cachedResult.data) {
      return cachedResult;
    }
    
    // If not in cache, fetch and cache
    try {
      const response = await fetchFunction();
      
      if (response) {
        await this.cacheResponse(params, response);
        return { data: response, fromCache: false };
      }
      
      return { data: null, fromCache: false };
    } catch (error) {
      console.error('Error fetching data for cache:', error);
      errorLogger.logError(error, 'OpenAICacheService.getOrCreateCachedResponse');
      return { data: null, fromCache: false };
    }
  }
}
