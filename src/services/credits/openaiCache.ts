
/**
 * OpenAI Cache Service
 * Implements 30-day caching for OpenAI responses to reduce costs
 */

import { supabase } from '@/integrations/supabase/client';
import crypto from 'crypto';
import { toast } from 'sonner';

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
        });
      
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
   * Check if we have a cached response for the given parameters
   */
  static async hasCachedResponse(inputParams: any): Promise<boolean> {
    try {
      const cacheKey = this.generateCacheKey(inputParams);
      const cachedResponse = await this.getCachedResponse(cacheKey);
      return cachedResponse !== null;
    } catch (error) {
      console.error('Error checking cache status:', error);
      return false;
    }
  }

  /**
   * Cached API handler - wrapper for OpenAI calls
   * Returns cached response if available, otherwise calls the API and caches the result
   * 
   * @param inputParams - Parameters for the OpenAI call
   * @param apiFn - Function that makes the actual API call
   * @param skipCache - Optional flag to skip cache and force a fresh API call
   * @param deductCredits - Optional function to handle credit deduction
   */
  static async cachedApiCall<T>(
    inputParams: any, 
    apiFn: (params: any) => Promise<T>,
    skipCache: boolean = false,
    deductCredits?: () => Promise<boolean>
  ): Promise<T> {
    try {
      // Generate cache key from input parameters
      const cacheKey = this.generateCacheKey(inputParams);
      
      // Try to get from cache first (unless skipCache is true)
      if (!skipCache) {
        const cachedResponse = await this.getCachedResponse(cacheKey);
        if (cachedResponse) {
          console.log('Using cached OpenAI response');
          return cachedResponse as T;
        }
      }
      
      // No cache hit or skipCache is true, deduct credits before API call
      if (deductCredits) {
        console.log('Deducting credits before API call');
        const creditSuccess = await deductCredits();
        if (!creditSuccess) {
          console.error('Failed to deduct credits');
          throw new Error('Failed to deduct credits: Insufficient credits or system error');
        }
      }
      
      // Call the API
      console.log('No cache hit or forced refresh, calling OpenAI API');
      const response = await apiFn(inputParams);
      
      // Store in cache asynchronously (don't wait for it)
      this.storeResponse(cacheKey, response)
        .catch(err => console.error('Failed to store response in cache:', err));
      
      return response;
    } catch (error) {
      console.error('Error in cached API call:', error);
      // Make sure we provide detailed error information
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error during API call');
      }
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
