
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

export interface AudienceAnalysisResult {
  success: boolean;
  platform: string;
  analysisText: string;
  // Structured audience data
  demographics?: {
    ageGroups: string[];
    gender: string[];
    educationLevel: string[];
    incomeLevel: string[];
  };
  interests?: string[];
  painPoints?: string[];
  decisionFactors?: string[];
  // Cache information
  fromCache?: boolean;
  cachedAt?: string;
  // Language information
  language?: string;
}

export interface AudienceCacheInfo {
  fromCache: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

export const useAudienceAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AudienceAnalysisResult | null>(null);
  const [cacheInfo, setCacheInfo] = useState<AudienceCacheInfo | null>(null);
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

      // Extract the language from website analysis, default to English
      const language = websiteData.language || 'en';
      console.log(`Analyzing audience for ${platform || 'all platforms'} using website: ${websiteData.websiteUrl || 'unknown'} in language: ${language}`);
      
      const { data, error } = await supabase.functions.invoke('analyze-audience', {
        body: { 
          websiteData, 
          platform,
          language
        }
      });

      if (error) {
        console.error('Error analyzing audience:', error);
        throw error;
      }

      console.log('Audience analysis result:', data);
      
      // Process the raw analysis text if needed and structure the data
      const processedData: AudienceAnalysisResult = {
        ...data,
        // If data doesn't have the structured fields, we add them with defaults
        demographics: data.demographics || {
          ageGroups: ["25-34", "35-44"], // Default values
          gender: ["All"],
          educationLevel: ["College", "Graduate"],
          incomeLevel: ["Middle", "Upper-middle"]
        },
        interests: data.interests || ["Digital Marketing", "Technology", "Business"],
        painPoints: data.painPoints || ["Time management", "ROI tracking", "Ad performance"],
        decisionFactors: data.decisionFactors || ["Cost effectiveness", "Ease of use", "Support"],
        language: language // Set the language from website data
      };
      
      setAnalysisResult(processedData);
      
      // Set cache info if available
      if (data.fromCache) {
        // Calculate expiration date (30 days from cached date)
        const cachedAt = new Date(data.cachedAt);
        const expiresAt = new Date(cachedAt);
        expiresAt.setDate(expiresAt.getDate() + 30);

        setCacheInfo({
          fromCache: true,
          cachedAt: data.cachedAt,
          expiresAt: expiresAt.toISOString()
        });
        
        toast({
          title: "Using Cached Analysis",
          description: "Using previously analyzed audience data for this website",
        });
      } else {
        setCacheInfo({
          fromCache: false
        });
        
        toast({
          title: "Analysis Complete",
          description: `Audience targeting analysis for ${platform || 'all platforms'} completed successfully`,
        });
      }
      
      return processedData;
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
    setAnalysisResult,
    cacheInfo
  };
};
