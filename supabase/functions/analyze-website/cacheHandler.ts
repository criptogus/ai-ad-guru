
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { validateAnalysisResult, normalizeArrayFields } from "./utils.ts";

export class CacheHandler {
  private client;
  
  constructor(supabaseUrl: string, serviceRoleKey: string) {
    // Initialize the Supabase client with service role key
    this.client = createClient(supabaseUrl, serviceRoleKey);
  }
  
  // Check cache for existing analysis of this URL
  async checkCache(url: string): Promise<{ 
    fromCache: boolean; 
    cachedAt?: string; 
    expiresAt?: string;
    data?: any;
  }> {
    try {
      // Create the cache table if it doesn't exist
      await this.ensureCacheTableExists();
      
      // Normalize the URL for consistent cache lookups
      const normalizedUrl = this.normalizeUrl(url);
      console.log("Checking cache for URL:", normalizedUrl);
      
      // Query the cache table
      const { data, error } = await this.client
        .from("website_analysis_cache")
        .select("*")
        .eq("url", normalizedUrl)
        .single();
      
      if (error || !data) {
        console.log("No cache entry found:", error?.message || "No data");
        return { fromCache: false };
      }
      
      // Calculate the expiration date (30 days after creation)
      const cachedAt = new Date(data.created_at);
      const expiresAt = new Date(cachedAt);
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // If the cache entry has expired, return not found
      if (new Date() > expiresAt) {
        console.log("Cache entry expired");
        return { fromCache: false };
      }
      
      console.log("Cache hit! Returning cached analysis from:", data.created_at);
      
      return {
        fromCache: true,
        cachedAt: cachedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        data: data.analysis_result
      };
    } catch (error) {
      console.error("Error checking cache:", error);
      return { fromCache: false };
    }
  }
  
  // Cache analysis result for future use
  async cacheResult(url: string, result: any): Promise<void> {
    try {
      if (!validateAnalysisResult(result)) {
        console.error("Invalid analysis result, not caching");
        return;
      }
      
      // Create the cache table if it doesn't exist
      await this.ensureCacheTableExists();
      
      // Normalize array fields
      const normalizedResult = normalizeArrayFields(result);
      
      // Normalize the URL for consistent cache lookups
      const normalizedUrl = this.normalizeUrl(url);
      
      // Insert or update the cache entry
      const { error } = await this.client
        .from("website_analysis_cache")
        .upsert({
          url: normalizedUrl,
          analysis_result: normalizedResult,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error("Error caching result:", error);
        return;
      }
      
      console.log("Successfully cached analysis for URL:", normalizedUrl);
    } catch (error) {
      console.error("Error caching result:", error);
    }
  }
  
  // Ensure the cache table exists
  private async ensureCacheTableExists(): Promise<void> {
    try {
      // Call the SQL function that creates the table if it doesn't exist
      const { error } = await this.client.rpc("create_website_analysis_cache_table");
      
      if (error) {
        console.error("Error ensuring cache table exists:", error);
      }
    } catch (error) {
      console.error("Error ensuring cache table exists:", error);
    }
  }
  
  // Normalize URL for consistent cache lookup
  private normalizeUrl(url: string): string {
    try {
      // Parse the URL
      const parsedUrl = new URL(url);
      
      // Get hostname and pathname (remove trailing slash)
      let normalizedUrl = parsedUrl.hostname + parsedUrl.pathname.replace(/\/$/, "");
      
      // Remove www. prefix if present
      normalizedUrl = normalizedUrl.replace(/^www\./, "");
      
      return normalizedUrl.toLowerCase();
    } catch (error) {
      // If URL parsing fails, just return the original string
      console.warn("URL normalization failed, using original:", url);
      return url.toLowerCase();
    }
  }
}
