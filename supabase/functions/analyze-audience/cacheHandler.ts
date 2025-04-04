
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export class CacheHandler {
  private supabase;
  
  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL') || '',
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
  }
  
  async checkCache(cacheKey: string): Promise<{
    data: any | null;
    fromCache: boolean;
    cachedAt?: string;
  }> {
    try {
      console.log(`Checking cache for key: ${cacheKey}`);
      
      const { data, error } = await this.supabase
        .from('audience_analysis_cache')
        .select('*')
        .eq('url', cacheKey.split(':')[0])
        .eq('platform', cacheKey.split(':')[1] || 'all')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking cache:', error);
        return { data: null, fromCache: false };
      }
      
      if (data) {
        console.log('Cache hit:', data.id);
        return {
          data: data.analysis_result,
          fromCache: true,
          cachedAt: data.created_at
        };
      }
      
      console.log('Cache miss');
      return { data: null, fromCache: false };
    } catch (error) {
      console.error('Error in checkCache:', error);
      return { data: null, fromCache: false };
    }
  }
  
  async cacheResult(cacheKey: string, result: any): Promise<void> {
    try {
      console.log(`Caching result for key: ${cacheKey}`);
      
      const { error } = await this.supabase
        .from('audience_analysis_cache')
        .upsert({
          url: cacheKey.split(':')[0],
          platform: cacheKey.split(':')[1] || 'all',
          analysis_result: result,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'url,platform'
        });
      
      if (error) {
        console.error('Error caching result:', error);
        throw error;
      }
      
      console.log('Result cached successfully');
    } catch (error) {
      console.error('Error in cacheResult:', error);
    }
  }
}
