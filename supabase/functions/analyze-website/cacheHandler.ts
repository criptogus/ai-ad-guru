
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

export class CacheHandler {
  private supabaseUrl: string;
  private supabaseKey: string;
  private client: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async checkCache(url: string): Promise<{ fromCache: boolean; data?: any; cachedAt?: string; expiresAt?: string }> {
    try {
      // Normalize URL for consistent caching
      const normalizedUrl = this.normalizeUrl(url);
      
      console.log('Checking cache for URL:', normalizedUrl);
      
      const { data, error } = await this.client
        .from('website_analysis_cache')
        .select('analysis_data, created_at')
        .eq('url', normalizedUrl)
        .single();
      
      if (error || !data) {
        console.log('Cache miss:', error?.message || 'No data found');
        return { fromCache: false };
      }
      
      // Calculate expiry date (30 days from creation)
      const createdAt = new Date(data.created_at);
      const expiresAt = new Date(createdAt);
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Check if cache has expired
      if (expiresAt < new Date()) {
        console.log('Cache expired for URL:', normalizedUrl);
        return { fromCache: false };
      }
      
      console.log('Cache hit for URL:', normalizedUrl);
      return { 
        fromCache: true, 
        data: data.analysis_data,
        cachedAt: data.created_at,
        expiresAt: expiresAt.toISOString()
      };
    } catch (error) {
      console.error('Error checking cache:', error);
      return { fromCache: false };
    }
  }

  async cacheResult(url: string, data: any): Promise<boolean> {
    try {
      // Normalize URL for consistent caching
      const normalizedUrl = this.normalizeUrl(url);
      
      console.log('Caching result for URL:', normalizedUrl);
      
      // Using upsert to handle both insert and update cases
      const { error } = await this.client
        .from('website_analysis_cache')
        .upsert({
          url: normalizedUrl,
          analysis_data: data,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error caching result:', error);
        return false;
      }
      
      console.log('Successfully cached result for URL:', normalizedUrl);
      return true;
    } catch (error) {
      console.error('Error caching result:', error);
      return false;
    }
  }
  
  private normalizeUrl(url: string): string {
    try {
      // Remove protocol, trailing slashes, and www
      let normalizedUrl = url.trim().toLowerCase();
      normalizedUrl = normalizedUrl.replace(/^(https?:\/\/)?(www\.)?/i, '');
      normalizedUrl = normalizedUrl.replace(/\/+$/, '');
      return normalizedUrl;
    } catch (error) {
      console.error('Error normalizing URL:', error);
      return url; // Return original if normalization fails
    }
  }
}
