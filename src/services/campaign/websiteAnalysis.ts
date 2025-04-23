
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

/**
 * Analyze a website to extract information
 */
export const analyzeWebsite = async (params: WebsiteAnalysisParams): Promise<WebsiteAnalysisResult | null> => {
  try {
    console.log('Analyzing website', params.url);
    
    // Call the analyze-website edge function
    const { data, error } = await supabase.functions.invoke('analyze-website', {
      body: { url: params.url }
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
    result.websiteUrl = params.url;
    
    console.log('Website analysis completed:', result);
    return result;
  } catch (error) {
    console.error('Error analyzing website:', error);
    errorLogger.logError(error, 'analyzeWebsite');
    return null;
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

/**
 * Get website analysis cache status
 */
export const getAnalysisCacheStatus = async (url: string): Promise<{ exists: boolean; cachedAt?: string }> => {
  try {
    // This is a placeholder for actual cache status check
    console.log('Checking analysis cache status for', url);
    
    // In a real implementation, this would check if the analysis is cached
    
    return { exists: false };
  } catch (error) {
    errorLogger.logError(error, 'getAnalysisCacheStatus');
    return { exists: false };
  }
};
