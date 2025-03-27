
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WebsiteAnalysisResult {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keywords: string[];
  callToAction: string[];
  uniqueSellingPoints: string[];
  websiteUrl?: string;
}

export interface AnalysisCache {
  fromCache: boolean;
  cachedAt?: string;
}

export const useWebsiteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [cacheInfo, setCacheInfo] = useState<AnalysisCache | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    if (!url || !url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    
    try {
      // Format URL - ensure it has a protocol
      let formattedUrl = url.trim();
      
      // If URL doesn't have a protocol and doesn't start with www, add www
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        // If the URL doesn't start with www, add it
        if (!formattedUrl.startsWith('www.')) {
          formattedUrl = 'www.' + formattedUrl;
        }
        // Add https protocol
        formattedUrl = 'https://' + formattedUrl;
      }
      
      console.log('Calling analyze-website function with URL:', formattedUrl);
      
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: { url: formattedUrl },
      });

      if (error) {
        console.error('Error analyzing website:', error);
        throw error;
      }

      if (!data.success) {
        console.error('Analysis failed:', data.error);
        throw new Error(data.error || "Failed to analyze website");
      }

      console.log('Analysis result:', data.data);
      const result = data.data as WebsiteAnalysisResult;
      
      // Store the website URL in the result
      result.websiteUrl = formattedUrl;
      setAnalysisResult(result);
      
      // Set cache info if available
      if (data.fromCache) {
        setCacheInfo({
          fromCache: true,
          cachedAt: data.cachedAt
        });
        
        toast({
          title: "Using Cached Analysis",
          description: "Using previously analyzed data for this website",
        });
      } else {
        setCacheInfo({
          fromCache: false
        });
        
        toast({
          title: "Website Analyzed",
          description: "Successfully analyzed website content",
        });
      }
      
      return result;
    } catch (error: any) {
      console.error('Error calling analyze-website function:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze website. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update the analysis result from edited data
  const updateAnalysisResult = (updatedResult: WebsiteAnalysisResult) => {
    setAnalysisResult(updatedResult);
    return updatedResult;
  };

  return {
    analyzeWebsite,
    updateAnalysisResult,
    isAnalyzing,
    analysisResult,
    setAnalysisResult,
    cacheInfo
  };
};
