
/**
 * OpenAI Cache Service
 * Provides utilities for caching OpenAI responses to reduce API costs
 */

import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';
import crypto from 'crypto';

export interface CacheParams {
  [key: string]: any;
}

export interface CachedResponse<T> {
  data: T | null;
  fromCache: boolean;
  cachedAt: string | null;
  expiresAt: string | null;
}

export class OpenAICacheService {
  /**
   * Generate a unique cache key from the parameters
   */
  private static generateCacheKey(params: CacheParams): string {
    const paramsString = JSON.stringify(params);
    return crypto.createHash('sha256').update(paramsString).digest('hex');
  }

  /**
   * Check if a response is cached and valid
   */
  static async getCachedResponse<T>(params: CacheParams): Promise<CachedResponse<T>> {
    try {
      console.log('[OpenAICache] Checking cache for', params);
      const cacheKey = this.generateCacheKey(params);
      
      const { data, error } = await supabase
        .from('openai_cache')
        .select('response, created_at, expiration')
        .eq('key', cacheKey)
        .gt('expiration', new Date().toISOString())
        .single();
      
      if (error) {
        console.log('[OpenAICache] No cache found or error:', error.message);
        return {
          data: null,
          fromCache: false,
          cachedAt: null,
          expiresAt: null
        };
      }
      
      console.log('[OpenAICache] Cache hit for', cacheKey);
      return {
        data: data.response as T,
        fromCache: true,
        cachedAt: data.created_at,
        expiresAt: data.expiration
      };
    } catch (error) {
      console.error('[OpenAICache] Error checking cache:', error);
      errorLogger.logError(error, 'OpenAICacheService.getCachedResponse');
      
      return {
        data: null,
        fromCache: false,
        cachedAt: null,
        expiresAt: null
      };
    }
  }

  /**
   * Store a response in the cache
   */
  static async cacheResponse<T>(params: CacheParams, response: T): Promise<boolean> {
    try {
      console.log('[OpenAICache] Caching response for', params);
      const cacheKey = this.generateCacheKey(params);
      
      // Calculate expiration date (30 days from now)
      const now = new Date();
      const expiration = new Date();
      expiration.setDate(now.getDate() + 30);
      
      const { error } = await supabase
        .from('openai_cache')
        .insert({
          key: cacheKey,
          response: response as any,
          expiration: expiration.toISOString()
        });
      
      if (error) {
        console.error('[OpenAICache] Error caching response:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'cache_response'
        }, 'OpenAICacheService.cacheResponse');
        
        return false;
      }
      
      console.log('[OpenAICache] Successfully cached response with key', cacheKey);
      return true;
    } catch (error) {
      console.error('[OpenAICache] Error in cacheResponse:', error);
      errorLogger.logError(error, 'OpenAICacheService.cacheResponse');
      return false;
    }
  }
}
