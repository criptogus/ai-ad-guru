
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AudienceAnalysisResult, WebsiteData } from "./utils.ts";

// Cache operations for audience analysis results
export class CacheHandler {
  private supabase: ReturnType<typeof createClient> | null;
  
  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = (supabaseUrl && supabaseKey) 
      ? createClient(supabaseUrl, supabaseKey)
      : null;
  }

  async checkCache(
    websiteUrl: string, 
    platform: string = 'all'
  ): Promise<{ data: AudienceAnalysisResult | null, fromCache: boolean, cachedAt?: string }> {
    if (!websiteUrl || !this.supabase) {
      return { data: null, fromCache: false };
    }

    try {
      // Check if we have a cached result (within the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: cachedData, error: cacheError } = await this.supabase
        .from('audience_analysis_cache')
        .select('*')
        .eq('url', websiteUrl)
        .eq('platform', platform)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .maybeSingle();
      
      if (cacheError) {
        console.error("Error checking audience cache:", cacheError);
        return { data: null, fromCache: false };
      }
      
      // If we have a valid cached result, return it
      if (cachedData && cachedData.analysis_result) {
        console.log("Using cached audience analysis result from:", cachedData.created_at);
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

  async cacheResult(
    websiteUrl: string, 
    platform: string = 'all', 
    analysisResult: AudienceAnalysisResult
  ): Promise<boolean> {
    if (!websiteUrl || !this.supabase) {
      return false;
    }

    try {
      const { error: upsertError } = await this.supabase
        .from('audience_analysis_cache')
        .upsert({
          url: websiteUrl,
          platform: platform || 'all',
          analysis_result: analysisResult
        }, { onConflict: 'url,platform' });
      
      if (upsertError) {
        console.error("Error caching audience analysis result:", upsertError);
        return false;
      }
      
      console.log("Audience analysis result cached successfully");
      return true;
    } catch (error) {
      console.error("Error in cache operation:", error);
      return false;
    }
  }
}
