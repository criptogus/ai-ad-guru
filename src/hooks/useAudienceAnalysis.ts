
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

export interface AudienceAnalysisResult {
  success: boolean;
  platform: string;
  analysisText: string;
  // This could be expanded with structured data in the future
}

export const useAudienceAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AudienceAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeAudience = async (
    websiteData: WebsiteAnalysisResult,
    platform?: string
  ): Promise<AudienceAnalysisResult | null> => {
    setIsAnalyzing(true);
    
    try {
      if (!websiteData) {
        throw new Error("Website data is required for audience analysis");
      }

      console.log(`Analyzing audience for ${platform || 'all platforms'}`);
      
      const { data, error } = await supabase.functions.invoke('analyze-audience', {
        body: { 
          websiteData, 
          platform 
        }
      });

      if (error) {
        console.error('Error analyzing audience:', error);
        throw error;
      }

      console.log('Audience analysis result:', data);
      
      setAnalysisResult(data);
      
      toast({
        title: "Analysis Complete",
        description: `Audience targeting analysis for ${platform || 'all platforms'} completed successfully`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error in analyzeAudience:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze audience. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeAudience,
    isAnalyzing,
    analysisResult,
    setAnalysisResult
  };
};
