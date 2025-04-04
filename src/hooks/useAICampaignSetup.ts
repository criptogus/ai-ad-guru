
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from './useWebsiteAnalysis';

export const useAICampaignSetup = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCampaignSetup = async (
    analysisResult: WebsiteAnalysisResult,
    platform: string
  ) => {
    if (!analysisResult) {
      toast({
        title: "Missing Analysis",
        description: "Please analyze a website first",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      console.log('Generating campaign setup based on analysis');
      
      // Extract the detected language from the analysis result, default to English
      const language = analysisResult.language || 'en';
      console.log('Using language for campaign setup:', language);
      
      const { data, error } = await supabase.functions.invoke('generate-campaign-setup', {
        body: { 
          analysisResult,
          platform,
          language
        },
      });

      if (error) {
        console.error('Error generating campaign setup:', error);
        throw error;
      }

      console.log('Campaign setup:', data);
      toast({
        title: "Campaign Setup Generated",
        description: "AI has created recommended campaign settings",
      });

      return data;
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate campaign setup",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCampaignSetup,
    isGenerating
  };
};
