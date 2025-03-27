
/**
 * API Cache
 * Caching mechanism for API requests
 */

interface CacheEntry {
  data: any;
  expiresAt: number;
}

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
}

class ApiCache {
  private cache: Map<string, CacheEntry>;
  private defaultTtl: number;

  constructor(defaultTtl = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map();
    this.defaultTtl = defaultTtl;
  }

  /**
   * Set a value in the cache
   */
  set(key: string, data: any, options?: Partial<CacheOptions>): void {
    const ttl = options?.ttl ?? this.defaultTtl;
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if the entry has expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Remove a value from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all values from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if the entry has expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

// Export a singleton instance
export const apiCache = new ApiCache();

/**
 * Create a wrapper function that caches API results
 */
export function withCache<T, P extends any[]>(
  fn: (...args: P) => Promise<T>,
  keyFn: (...args: P) => string,
  options?: Partial<CacheOptions>
): (...args: P) => Promise<T> {
  return async (...args: P): Promise<T> => {
    const cacheKey = keyFn(...args);
    const cachedValue = apiCache.get<T>(cacheKey);
    
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    const result = await fn(...args);
    apiCache.set(cacheKey, result, options);
    
    return result;
  };
}
