
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Implement CacheHandler directly in this file to avoid import issues
class CacheHandler {
  private client;
  private CACHE_EXPIRATION_DAYS = 30; // 30 days cache expiration
  
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
      expiresAt.setDate(expiresAt.getDate() + this.CACHE_EXPIRATION_DAYS);
      
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
  
  // Ensure the cache table exists
  private async ensureCacheTableExists(): Promise<void> {
    try {
      // Create the website_analysis_cache table if it doesn't exist using direct SQL
      const { error } = await this.client.rpc("create_cache_table_if_not_exists");
      
      if (error) {
        // If the RPC function doesn't exist, create the table directly with SQL query
        console.error("Error calling RPC function, trying direct SQL:", error);
        
        // Try to create the table directly with a SQL query
        const { error: sqlError } = await this.client.from('website_analysis_cache').select('count(*)');
        
        if (sqlError && sqlError.code === '42P01') { // Table doesn't exist error code
          // Create the table
          const { error: createError } = await this.client.rpc('exec_sql', {
            query_string: `
              CREATE TABLE IF NOT EXISTS public.website_analysis_cache (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                url TEXT NOT NULL UNIQUE,
                analysis_result JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );
              CREATE INDEX IF NOT EXISTS idx_website_analysis_cache_url ON public.website_analysis_cache(url);
            `
          });
          
          if (createError) {
            console.error("Error creating cache table with direct SQL:", createError);
          }
        }
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(JSON.stringify({
        success: false,
        error: "URL is required"
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Initialize the cache handler with Supabase connection info
    const cacheHandler = new CacheHandler(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Check if we have a cached result for this URL
    const cachedResult = await cacheHandler.checkCache(url);
    
    if (cachedResult.fromCache) {
      return new Response(JSON.stringify({
        success: true,
        exists: true,
        cachedAt: cachedResult.cachedAt,
        expiresAt: cachedResult.expiresAt
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({
        success: true,
        exists: false
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error(`Error in get-analysis-cache-status function:`, error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
