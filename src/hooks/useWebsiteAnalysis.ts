
/**
 * Website Analysis Hook and Types
 */

import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

export interface WebsiteAnalysisResult {
  companyName: string;
  companyDescription?: string;
  businessDescription?: string;
  targetAudience?: string;
  brandTone?: string;
  uniqueSellingPoints?: string[];
  callToAction?: string[];
  keywords?: string[];
  websiteUrl: string;
  industry?: string;
  product?: string;
  language?: string;
  objective?: string;
  mindTrigger?: string;
}

export interface AnalysisCacheStatus {
  exists: boolean;
  cachedAt?: string;
}

// Add this new interface for cache information
export interface AnalysisCache {
  fromCache: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

// Export the hook as default
const useWebsiteAnalysis = () => {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [analysisCacheStatus, setAnalysisCacheStatus] = useState<AnalysisCacheStatus>({ exists: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<AnalysisCache | null>(null);
  
  // Let's alias isLoading as isAnalyzing for backward compatibility
  const isAnalyzing = isLoading;
  
  const clearError = () => setError(null);
  
  const getAnalysisCacheStatus = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-analysis-cache-status', {
        body: { url },
      });
      
      if (error) {
        console.error('Error getting cache status:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to check analysis cache status",
          variant: "destructive",
        });
        return;
      }
      
      setAnalysisCacheStatus({
        exists: data?.exists || false,
        cachedAt: data?.cachedAt
      });
      
      if (data?.exists) {
        setCacheInfo({
          fromCache: true,
          cachedAt: data?.cachedAt,
          expiresAt: data?.expiresAt
        });
      }
      
    } catch (err: any) {
      errorLogger.logError(err, 'getAnalysisCacheStatus');
      setError(err.message || 'Failed to get cache status');
      toast({
        title: "Error",
        description: err.message || "Failed to check analysis cache status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);
  
  const analyzeWebsite = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: { url },
      });
      
      if (error) {
        console.error('Error analyzing website:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to analyze website",
          variant: "destructive",
        });
        return null;
      }
      
      if (!data?.success) {
        console.error('Analysis failed:', data?.error || 'Unknown error');
        setError(data?.error || "Failed to analyze website");
        toast({
          title: "Error",
          description: data?.error || "Failed to analyze website",
          variant: "destructive",
        });
        return null;
      }
      
      // Check if this was from cache
      if (data.fromCache) {
        setCacheInfo({
          fromCache: true,
          cachedAt: data.cachedAt,
          expiresAt: data.expiresAt
        });
      } else {
        setCacheInfo({
          fromCache: false
        });
      }
      
      // Make sure all array fields are actually arrays
      const processedData = {
        ...data.data,
        uniqueSellingPoints: ensureArray(data.data.uniqueSellingPoints),
        keywords: ensureArray(data.data.keywords),
        callToAction: ensureArray(data.data.callToAction)
      };
      
      setAnalysisResult(processedData);
      return processedData as WebsiteAnalysisResult;
      
    } catch (err: any) {
      errorLogger.logError(err, 'analyzeWebsite');
      setError(err.message || 'Failed to analyze website');
      toast({
        title: "Error",
        description: err.message || "Failed to analyze website",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);
  
  // Helper function to ensure a value is an array
  const ensureArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  };
  
  return {
    analysisResult,
    analysisCacheStatus,
    isLoading,
    isAnalyzing, // Include isAnalyzing as an alias for isLoading
    error,
    analyzeWebsite,
    getAnalysisCacheStatus,
    clearError,
    cacheInfo,
    setAnalysisResult
  };
}

// Export the hook as default
export default useWebsiteAnalysis;
