
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

export class CacheHandler {
  private supabaseClient;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  async checkCache(url: string) {
    try {
      // Normalize URL for consistent caching
      const normalizedUrl = this.normalizeUrl(url);
      
      // Query the cache table with expiration check
      const { data, error } = await this.supabaseClient
        .from('website_analysis_cache')
        .select('analysis_data, created_at, language')
        .eq('url', normalizedUrl)
        .single();
      
      if (error) {
        console.log("Cache miss or error:", error.message);
        return { data: null, fromCache: false };
      }
      
      if (data) {
        console.log("Cache hit:", normalizedUrl);
        
        // Check if cache is expired (30 days)
        const cacheDate = new Date(data.created_at);
        const expirationDate = new Date(cacheDate);
        expirationDate.setDate(expirationDate.getDate() + 30); // 30-day cache
        
        if (expirationDate < new Date()) {
          console.log("Cache expired, created at:", data.created_at);
          return { data: null, fromCache: false };
        }
        
        const cachedData = data.analysis_data;
        
        // Add language to cached result if it exists
        if (data.language) {
          cachedData.language = data.language;
        }
        
        return { 
          data: cachedData, 
          fromCache: true,
          cachedAt: data.created_at
        };
      }
      
      return { data: null, fromCache: false };
    } catch (error) {
      console.error("Error checking cache:", error);
      return { data: null, fromCache: false };
    }
  }

  async cacheResult(url: string, analysisData: any, language: string = 'en') {
    try {
      // Normalize URL for consistent caching
      const normalizedUrl = this.normalizeUrl(url);
      
      // Store in cache
      const { error } = await this.supabaseClient
        .from('website_analysis_cache')
        .upsert({
          url: normalizedUrl,
          analysis_data: analysisData,
          language,
          created_at: new Date().toISOString()
        }, { onConflict: 'url' });
      
      if (error) {
        console.error("Error caching result:", error);
        return false;
      }
      
      console.log("Successfully cached result for:", normalizedUrl);
      return true;
    } catch (error) {
      console.error("Error in cacheResult:", error);
      return false;
    }
  }

  private normalizeUrl(url: string): string {
    // Remove protocol, trailing slashes, and www. for consistent caching
    return url.replace(/^https?:\/\//, '')
              .replace(/^www\./, '')
              .replace(/\/$/, '')
              .toLowerCase();
  }
}
