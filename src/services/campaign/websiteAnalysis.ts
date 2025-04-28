
/**
 * Website Analysis Service
 * Analyzes websites to extract information for ad creation
 */

import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';
import { toast } from 'sonner';
import { OpenAICacheService } from '@/services/credits/openaiCache';

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
  language?: string;
  industry?: string;
}

export interface WebsiteAnalysisCache {
  fromCache: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

/**
 * Helper function to normalize language codes
 */
const normalizeLanguageCode = (langCode?: string): string => {
  if (!langCode) return 'en';
  
  // Handle common variations
  const normalized = langCode.toLowerCase().trim();
  
  if (normalized.startsWith('pt')) return 'pt';
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('fr')) return 'fr';
  
  return normalized.split('-')[0]; // Return base language code
};

/**
 * Analyze a website to extract information
 */
export const analyzeWebsite = async (params: WebsiteAnalysisParams): Promise<WebsiteAnalysisResult | null> => {
  try {
    console.log('Analyzing website', params.url, 'for user', params.userId);
    
    // Format URL if needed
    let formattedUrl = params.url.trim();
    
    // Check if URL has a protocol, add https:// if missing
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // Use cache if available - create a proper cache params object
    const cacheParams = { 
      url: formattedUrl,
      userId: params.userId
    };
    
    const cachedResult = await OpenAICacheService.getCachedResponse<WebsiteAnalysisResult>(cacheParams);
    
    if (cachedResult.data) {
      console.log('Using cached analysis result');
      const result = cachedResult.data;
      
      // Add the website URL to the result
      result.websiteUrl = formattedUrl;
      
      // Add cache information
      (result as any).fromCache = true;
      (result as any).cachedAt = cachedResult.cachedAt;
      (result as any).expiresAt = cachedResult.expiresAt;
      
      return result;
    }
    
    console.log('No cache found, calling edge function with params:', { url: formattedUrl, userId: params.userId });
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke('analyze-website', {
      body: { 
        url: formattedUrl,
        userId: params.userId
      }
    });
    
    if (error) {
      console.error('Edge function error:', error);
      errorLogger.logError(error, 'analyzeWebsite');
      throw new Error(`Edge function error: ${error.message || 'Unknown error'}`);
    }
    
    if (!data) {
      console.error('No data returned from analyze-website function');
      throw new Error('No data returned from analyze-website function');
    }
    
    console.log('Edge function response:', data);
    
    if (!data.success) {
      console.error('Analysis error:', data.error);
      errorLogger.logError(new Error(data.error || 'Unknown error'), 'analyzeWebsite');
      throw new Error(`Analysis error: ${data.error || 'Unknown error'}`);
    }
    
    if (!data.data) {
      console.error('No analysis result data in response');
      throw new Error('No analysis result data in response');
    }
    
    const result = data.data as WebsiteAnalysisResult;
    
    // Add the website URL to the result
    result.websiteUrl = formattedUrl;
    
    // Normalize language code
    if (result.language) {
      result.language = normalizeLanguageCode(result.language);
    }
    
    // Ensure we have valid arrays
    result.keywords = Array.isArray(result.keywords) ? result.keywords : [];
    result.callToAction = Array.isArray(result.callToAction) ? result.callToAction : [];
    result.uniqueSellingPoints = Array.isArray(result.uniqueSellingPoints) ? result.uniqueSellingPoints : [];
    
    // Log the specific fields we're concerned with
    console.log('Website analysis results:', {
      companyName: result.companyName,
      language: result.language,
      industry: result.industry,
      keywordsCount: result.keywords.length,
      uniqueSellingPointsCount: result.uniqueSellingPoints.length
    });
    
    // Cache the result for future use
    OpenAICacheService.cacheResponse(cacheParams, result);
    
    // Return cache information
    if (data.fromCache) {
      console.log('Result from cache, cached at:', data.cachedAt);
      
      // Add cache properties to result for other components to use
      (result as any).fromCache = true;
      (result as any).cachedAt = data.cachedAt;
      (result as any).expiresAt = data.expiresAt;
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing website:', error);
    errorLogger.logError(error, 'analyzeWebsite');
    
    // Show error toast
    toast.error("Website Analysis Error", {
      description: error instanceof Error ? error.message : "Couldn't analyze the website. Please try again later."
    });
    
    throw error; // Re-throw to allow the caller to handle it
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
    
    // Create proper cache params object
    const cacheParams = { url: formattedUrl };
    
    const cachedResult = await OpenAICacheService.getCachedResponse(cacheParams);
    
    if (cachedResult.data) {
      return {
        exists: true,
        cachedAt: cachedResult.cachedAt,
        expiresAt: cachedResult.expiresAt
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking cache status:', error);
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
