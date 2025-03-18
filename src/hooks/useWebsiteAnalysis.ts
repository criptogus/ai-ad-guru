
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
      
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: { url: formattedUrl },
      });

      if (error) {
        console.error('Error analyzing website:', error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze website",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        toast({
          title: "Analysis Failed",
          description: data.error || "Failed to analyze website",
          variant: "destructive",
        });
        return null;
      }

      const result = data.data as WebsiteAnalysisResult;
      setAnalysisResult(result);
      
      toast({
        title: "Website Analyzed",
        description: "Successfully analyzed website content",
      });
      
      return result;
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Analysis Failed",
        description: "An unexpected error occurred",
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
