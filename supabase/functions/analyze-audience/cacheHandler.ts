
// Cache handler for audience analysis

interface CacheResponse<T> {
  data: T | null;
  fromCache: boolean;
  cachedAt?: string;
}

export class CacheHandler {
  private supabaseUrl: string | undefined;
  private supabaseServiceKey: string | undefined;
  private cacheExpiryHours = 24; // Cache valid for 24 hours

  constructor(supabaseUrl?: string, supabaseServiceKey?: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseServiceKey = supabaseServiceKey;
  }

  async checkCache(cacheKey: string): Promise<CacheResponse<any>> {
    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      console.warn('Supabase credentials not found, skipping cache check');
      return { data: null, fromCache: false };
    }

    try {
      // Fetch from cache table
      const response = await fetch(`${this.supabaseUrl}/rest/v1/audience_analysis_cache?key=eq.${encodeURIComponent(cacheKey)}`, {
        headers: {
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'apikey': this.supabaseServiceKey,
        }
      });

      if (!response.ok) {
        console.error('Error checking cache:', response.statusText);
        return { data: null, fromCache: false };
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const cachedResult = data[0];
        const cachedAt = new Date(cachedResult.created_at);
        const now = new Date();
        
        // Check if cache is expired (older than cacheExpiryHours)
        const cacheAgeHours = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60);
        
        if (cacheAgeHours < this.cacheExpiryHours) {
          console.log(`Cache hit for ${cacheKey}`);
          return { 
            data: cachedResult.data, 
            fromCache: true,
            cachedAt: cachedAt.toISOString()
          };
        } else {
          console.log(`Cache expired for ${cacheKey}`);
          return { data: null, fromCache: false };
        }
      }
      
      console.log(`Cache miss for ${cacheKey}`);
      return { data: null, fromCache: false };
      
    } catch (error) {
      console.error('Error checking audience analysis cache:', error);
      return { data: null, fromCache: false };
    }
  }

  async cacheResult(cacheKey: string, data: any): Promise<void> {
    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      console.warn('Supabase credentials not found, skipping cache write');
      return;
    }

    try {
      // First check if this key already exists
      const checkResponse = await fetch(`${this.supabaseUrl}/rest/v1/audience_analysis_cache?key=eq.${encodeURIComponent(cacheKey)}`, {
        headers: {
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'apikey': this.supabaseServiceKey,
        }
      });
      
      if (!checkResponse.ok) {
        console.error('Error checking existing cache:', checkResponse.statusText);
        return;
      }
      
      const existingData = await checkResponse.json();
      let method = 'POST';
      let url = `${this.supabaseUrl}/rest/v1/audience_analysis_cache`;
      
      // If entry exists, update it instead of creating a new one
      if (existingData && existingData.length > 0) {
        method = 'PATCH';
        url = `${url}?key=eq.${encodeURIComponent(cacheKey)}`;
      }
      
      // Store in cache table
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'apikey': this.supabaseServiceKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          key: cacheKey,
          data,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error('Error caching audience analysis:', response.statusText);
      } else {
        console.log(`Successfully cached audience analysis for ${cacheKey}`);
      }
    } catch (error) {
      console.error('Error writing to audience analysis cache:', error);
    }
  }
}
