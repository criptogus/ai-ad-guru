
/**
 * Website Analysis Service
 * Analyzes websites to extract information for ad creation
 */

import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

export interface WebsiteAnalysisParams {
  url: string;
  userId: string;
}

export interface WebsiteAnalysisResult {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keywords: string[];
  callToAction: string[];
  uniqueSellingPoints: string[];
  websiteUrl: string;
}

export interface WebsiteAnalysisCache {
  fromCache: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

/**
 * Analyze a website to extract information
 */
export const analyzeWebsite = async (params: WebsiteAnalysisParams): Promise<WebsiteAnalysisResult | null> => {
  try {
    console.log('Analyzing website', params.url);
    
    // Format URL if needed
    let formattedUrl = params.url.trim();
    
    // Check if URL has a protocol, add https:// if missing
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // Call the analyze-website edge function
    const { data, error } = await supabase.functions.invoke('analyze-website', {
      body: { url: formattedUrl }
    });
    
    if (error) {
      console.error('Edge function error:', error);
      errorLogger.logError(error, 'analyzeWebsite');
      return null;
    }
    
    if (!data.success) {
      console.error('Analysis error:', data.error);
      errorLogger.logError(new Error(data.error || 'Unknown error'), 'analyzeWebsite');
      return null;
    }
    
    const result = data.data as WebsiteAnalysisResult;
    
    // Add the website URL to the result
    result.websiteUrl = formattedUrl;
    
    console.log('Website analysis completed:', result);
    
    // Return cache information
    if (data.fromCache) {
      console.log('Result from cache, cached at:', data.cachedAt);
      
      // Log this info for other components to use if needed
      // You can access this from the component that called this function
      const cacheInfo: WebsiteAnalysisCache = {
        fromCache: true,
        cachedAt: data.cachedAt,
        expiresAt: data.expiresAt
      };
      
      // You could potentially use the component context to pass this info
      // or return it as part of an extended result object
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing website:', error);
    errorLogger.logError(error, 'analyzeWebsite');
    return null;
  }
};

/**
 * Get website analysis cache status
 */
export const getAnalysisCacheStatus = async (url: string): Promise<{ exists: boolean; cachedAt?: string; expiresAt?: string }> => {
  try {
    // Format URL for consistent cache checking
    let formattedUrl = url.trim();
    
    // Check if URL has a protocol, add https:// if missing
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    console.log('Checking analysis cache status for', formattedUrl);
    
    // Call the edge function with a cache-check parameter
    const { data, error } = await supabase.functions.invoke('analyze-website', {
      body: { url: formattedUrl, checkCacheOnly: true }
    });
    
    if (error) {
      throw error;
    }
    
    if (data.fromCache) {
      return {
        exists: true,
        cachedAt: data.cachedAt,
        expiresAt: data.expiresAt
      };
    }
    
    return { exists: false };
  } catch (error) {
    errorLogger.logError(error, 'getAnalysisCacheStatus');
    return { exists: false };
  }
};

/**
 * Update website analysis results
 */
export const updateAnalysisResult = async (
  userId: string,
  analysisResult: Partial<WebsiteAnalysisResult>
): Promise<WebsiteAnalysisResult | null> => {
  try {
    // This is a placeholder for actual update logic
    console.log('Updating analysis result for user', userId);
    
    // In a real implementation, this would update the analysis in the database
    
    // Return placeholder updated result
    return {
      ...(analysisResult as WebsiteAnalysisResult)
    };
  } catch (error) {
    errorLogger.logError(error, 'updateAnalysisResult');
    return null;
  }
};
