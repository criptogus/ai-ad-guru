
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
}

export const useWebsiteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = async (url: string) => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    
    try {
      // Ensure URL has a protocol
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = 'https://' + url;
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
      setAnalysisResult(result);
      
      toast({
        title: "Website Analyzed",
        description: "Successfully analyzed website content",
      });
      
      return result;
    } catch (error) {
      console.error('Error calling analyze-website function:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeWebsite,
    isAnalyzing,
    analysisResult,
  };
};
