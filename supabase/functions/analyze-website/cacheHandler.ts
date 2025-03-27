
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export class CacheHandler {
  private supabase: ReturnType<typeof createClient> | null;
  
  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = (supabaseUrl && supabaseKey) 
      ? createClient(supabaseUrl, supabaseKey)
      : null;
  }

  /**
   * Check if there's a cached analysis for the given URL
   */
  async checkCache(url: string): Promise<{ data: any | null, fromCache: boolean, cachedAt?: string }> {
    if (!url || !this.supabase) {
      return { data: null, fromCache: false };
    }

    try {
      // Check if we have a cached result (within the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: cachedData, error: cacheError } = await this.supabase
        .from('website_analysis_cache')
        .select('*')
        .eq('url', url)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .maybeSingle();
      
      if (cacheError) {
        console.error("Error checking cache:", cacheError);
        return { data: null, fromCache: false };
      }
      
      // If we have a valid cached result, return it
      if (cachedData && cachedData.analysis_result) {
        console.log("Using cached analysis result from:", cachedData.created_at);
        return { 
          data: cachedData.analysis_result, 
          fromCache: true, 
          cachedAt: cachedData.created_at 
        };
      }
      
      return { data: null, fromCache: false };
    } catch (error) {
      console.error("Error in cache operation:", error);
      return { data: null, fromCache: false };
    }
  }

  /**
   * Cache the analysis result for future use
   */
  async cacheResult(url: string, analysisResult: any, language?: string): Promise<boolean> {
    if (!url || !this.supabase) {
      return false;
    }

    try {
      const { error: upsertError } = await this.supabase
        .from('website_analysis_cache')
        .upsert({
          url: url,
          analysis_result: analysisResult,
          language: language || analysisResult.language || 'en'
        }, { onConflict: 'url' });
      
      if (upsertError) {
        console.error("Error caching analysis result:", upsertError);
        return false;
      }
      
      console.log("Analysis result cached successfully");
      return true;
    } catch (error) {
      console.error("Error in cache operation:", error);
      return false;
    }
  }
}
