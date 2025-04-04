
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { GoogleAd, MetaAd } from './types';

export * from './types';

export const useAdGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateAds = async (
    analysisResult: WebsiteAnalysisResult | null,
    campaignData: any,
    platform: string,
    trigger?: string,
    count: number = 5
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
      // Get the language from the analysis result, default to English
      const language = analysisResult.language || 'en';
      console.log(`Generating ${platform} ads using language: ${language}`);

      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: {
          analysisResult,
          campaignData,
          platform,
          trigger,
          count,
          language // Pass language to ensure ads are generated in the same language
        },
      });

      if (error) {
        console.error(`Error generating ${platform} ads:`, error);
        throw error;
      }

      console.log(`${platform} ads:`, data);
      toast({
        title: "Ads Generated",
        description: `Successfully generated ${platform} ads`,
      });

      return data;
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate ads",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGoogleAds = async (
    analysisResult: WebsiteAnalysisResult | null,
    campaignData: any,
    trigger?: string,
    count: number = 5
  ): Promise<GoogleAd[] | null> => {
    return generateAds(analysisResult, campaignData, 'google', trigger, count);
  };

  const generateMetaAds = async (
    analysisResult: WebsiteAnalysisResult | null,
    campaignData: any,
    trigger?: string,
    count: number = 3
  ): Promise<MetaAd[] | null> => {
    return generateAds(analysisResult, campaignData, 'meta', trigger, count);
  };

  const generateMicrosoftAds = async (
    analysisResult: WebsiteAnalysisResult | null,
    campaignData: any,
    trigger?: string,
    count: number = 5
  ): Promise<GoogleAd[] | null> => {
    return generateAds(analysisResult, campaignData, 'microsoft', trigger, count);
  };

  const generateLinkedInAds = async (
    analysisResult: WebsiteAnalysisResult | null,
    campaignData: any,
    trigger?: string,
    count: number = 3
  ): Promise<MetaAd[] | null> => {
    return generateAds(analysisResult, campaignData, 'linkedin', trigger, count);
  };

  const generateAdImage = async (prompt: string, platformSize: string = 'instagram'): Promise<string | null> => {
    setLoadingImageIndex(0);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, platformSize },
      });

      if (error) {
        console.error('Error generating image:', error);
        throw error;
      }

      if (!data || !data.imageUrl) {
        throw new Error('No image URL returned');
      }

      console.log('Generated image URL:', data.imageUrl);
      toast({
        title: "Image Generated",
        description: "Successfully generated ad image",
      });

      return data.imageUrl;
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Image Generation Failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    generateGoogleAds,
    generateMetaAds,
    generateMicrosoftAds,
    generateLinkedInAds,
    generateAdImage,
    isGenerating,
    loadingImageIndex
  };
};

export default useAdGeneration;
