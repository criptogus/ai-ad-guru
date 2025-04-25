
/**
 * Website Analysis Cache Handler
 * Handles caching and retrieval of website analysis results
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

interface CacheResult {
  fromCache: boolean;
  data?: any;
  cachedAt?: string;
  expiresAt?: string;
}

export class CacheHandler {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabaseClient: any;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Check if a URL has been cached recently
   */
  async checkCache(url: string): Promise<CacheResult> {
    try {
      // Normalize URL for consistent cache checking
      const normalizedUrl = this.normalizeUrl(url);
      
      // Hash the URL to use as a cache key
      const urlHash = await this.hashUrl(normalizedUrl);
      
      console.log(`Checking cache for URL: ${normalizedUrl} (hash: ${urlHash})`);
      
      // Check if we have a cached analysis for this URL
      try {
        // Check if the table exists first
        const { data: tableData, error: tableError } = await this.supabaseClient
          .from('website_analysis_cache')
          .select('created_at')
          .limit(1);
      
        if (tableError) {
          if (tableError.message.includes('does not exist')) {
            console.log('Cache table does not exist, creating it');
            // Create the cache table
            await this.createCacheTable();
            return { fromCache: false };
          }
          throw tableError;
        }
      
        // Table exists, check for our URL
        const { data, error } = await this.supabaseClient
          .from('website_analysis_cache')
          .select('*')
          .eq('url', normalizedUrl)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors
        
        if (error) {
          console.log(`Cache check error for URL ${normalizedUrl}: ${error.message}`);
          return { fromCache: false };
        }
        
        if (!data) {
          console.log(`No cache found for URL: ${normalizedUrl}`);
          return { fromCache: false };
        }
        
        // Check if the cache entry is still valid (less than 30 days old)
        const cacheDate = new Date(data.created_at);
        const now = new Date();
        const diffDays = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diffDays > 30) {
          console.log(`Cache expired for URL: ${normalizedUrl} (${diffDays.toFixed(1)} days old)`);
          return { fromCache: false };
        }
        
        console.log(`Cache hit for URL: ${normalizedUrl} (${diffDays.toFixed(1)} days old)`);
        
        // Calculate expiration date (30 days from cache date)
        const expiresAt = new Date(cacheDate);
        expiresAt.setDate(expiresAt.getDate() + 30);
        
        return {
          fromCache: true,
          data: data.analysis_result,
          cachedAt: data.created_at,
          expiresAt: expiresAt.toISOString()
        };
      } catch (error) {
        console.error(`Specific error checking cache: ${error.message}`);
        return { fromCache: false };
      }
    } catch (error) {
      console.error(`Error checking cache: ${error.message}`);
      return { fromCache: false };
    }
  }
  
  /**
   * Create the cache table if it doesn't exist
   */
  private async createCacheTable() {
    try {
      // Create the table via raw SQL
      const { error } = await this.supabaseClient.rpc('create_website_analysis_cache_table');
      
      if (error) {
        throw error;
      }
      
      console.log("Successfully created website_analysis_cache table");
      return true;
    } catch (error) {
      console.error(`Failed to create cache table: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Store analysis result in cache
   */
  async cacheResult(url: string, result: any): Promise<void> {
    try {
      // Normalize URL for consistent cache storage
      const normalizedUrl = this.normalizeUrl(url);
      
      console.log(`Caching result for URL: ${normalizedUrl}`);
      
      // Store the analysis result in the cache table
      const { error } = await this.supabaseClient
        .from('website_analysis_cache')
        .insert({
          url: normalizedUrl,
          analysis_result: result
        });
      
      if (error) {
        console.error(`Error caching result: ${error.message}`);
        throw error;
      }
      
      console.log(`Successfully cached result for URL: ${normalizedUrl}`);
    } catch (error) {
      console.error(`Failed to cache result: ${error.message}`);
    }
  }
  
  /**
   * Normalize URL for consistent cache lookups
   */
  private normalizeUrl(url: string): string {
    // Remove trailing slash if present
    let normalizedUrl = url.trim();
    
    // Ensure URL has a protocol
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Remove trailing slash if present
    if (normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    // Convert to lowercase for case-insensitive matching
    normalizedUrl = normalizedUrl.toLowerCase();
    
    return normalizedUrl;
  }
  
  /**
   * Create a hash of the URL for use as a cache key
   */
  private async hashUrl(url: string): Promise<string> {
    // Create a simple hash from the URL string
    // For a production system, consider using crypto APIs for better hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }
}
