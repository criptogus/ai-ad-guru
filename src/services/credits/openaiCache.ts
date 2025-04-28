
/**
 * OpenAI Cache Service
 * Implements 30-day caching for OpenAI responses to reduce costs
 */

import { supabase } from '@/integrations/supabase/client';
import crypto from 'crypto';

interface CacheEntry {
  key: string;
  response: any;
  expiration: string;
  created_at: string;
}

export class OpenAICacheService {
  /**
   * Generate a cache key from input parameters
   */
  static generateCacheKey(inputObject: any): string {
    const inputString = JSON.stringify(inputObject);
    return crypto.createHash('sha256').update(inputString).digest('hex');
  }

  /**
   * Get cached response if it exists and is valid
   */
  static async getCachedResponse(key: string): Promise<any | null> {
    try {
      console.log('Looking for cached OpenAI response with key:', key);
      
      const { data, error } = await supabase
        .from('openai_cache')
        .select('response, expiration')
        .eq('key', key)
        .gt('expiration', new Date().toISOString())
        .single();
      
      if (error || !data) {
        console.log('No valid cache entry found');
        return null;
      }
      
      console.log('Found valid cached response, expiring at:', data.expiration);
      return data.response;
    } catch (error) {
      console.error('Error retrieving from cache:', error);
      return null;
    }
  }

  /**
   * Store a response in the cache with 30-day expiration
   */
  static async storeResponse(key: string, response: any): Promise<boolean> {
    try {
      // Calculate expiration date (30 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      
      console.log('Storing OpenAI response in cache, expires:', expirationDate.toISOString());
      
      const { error } = await supabase
        .from('openai_cache')
        .upsert({
          key,
          response,
          expiration: expirationDate.toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error storing in cache:', error);
        return false;
      }
      
      console.log('Successfully cached OpenAI response');
      return true;
    } catch (error) {
      console.error('Error storing in cache:', error);
      return false;
    }
  }

  /**
   * Cached API handler - wrapper for OpenAI calls
   * Returns cached response if available, otherwise calls the API and caches the result
   */
  static async cachedApiCall<T>(
    inputParams: any, 
    apiFn: (params: any) => Promise<T>
  ): Promise<T> {
    try {
      // Generate cache key from input parameters
      const cacheKey = this.generateCacheKey(inputParams);
      
      // Try to get from cache first
      const cachedResponse = await this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        console.log('Using cached OpenAI response');
        return cachedResponse as T;
      }
      
      // No cache hit, call the API
      console.log('No cache hit, calling OpenAI API');
      const response = await apiFn(inputParams);
      
      // Store in cache asynchronously (don't wait for it)
      this.storeResponse(cacheKey, response)
        .catch(err => console.error('Failed to store response in cache:', err));
      
      return response;
    } catch (error) {
      console.error('Error in cached API call:', error);
      throw error;
    }
  }

  /**
   * Clean up expired cache entries
   */
  static async cleanExpiredEntries(): Promise<number> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('openai_cache')
        .delete()
        .lt('expiration', now)
        .select('count');
      
      if (error) {
        console.error('Error cleaning expired cache entries:', error);
        return 0;
      }
      
      return data?.length || 0;
    } catch (error) {
      console.error('Error cleaning expired cache:', error);
      return 0;
    }
  }
}
