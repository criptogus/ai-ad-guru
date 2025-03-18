
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from './useWebsiteAnalysis';

export interface GoogleAd {
  headlines: string[];
  descriptions: string[];
}

export interface MetaAd {
  primaryText: string;
  headline: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string; // Added after image generation
}

export const useAdGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const { toast } = useToast();

  const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: { 
          platform: 'google',
          campaignData 
        },
      });

      if (error) {
        console.error('Error generating Google ads:', error);
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate Google ads",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        toast({
          title: "Generation Failed",
          description: data.error || "Failed to generate Google ads",
          variant: "destructive",
        });
        return null;
      }

      const ads = data.data as GoogleAd[];
      setGoogleAds(ads);
      
      toast({
        title: "Ads Generated",
        description: "Successfully generated Google ads",
      });
      
      return ads;
    } catch (error) {
      console.error('Error generating Google ads:', error);
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMetaAds = async (campaignData: WebsiteAnalysisResult) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: { 
          platform: 'meta',
          campaignData 
        },
      });

      if (error) {
        console.error('Error generating Meta ads:', error);
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate Meta ads",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        toast({
          title: "Generation Failed",
          description: data.error || "Failed to generate Meta ads",
          variant: "destructive",
        });
        return null;
      }

      const ads = data.data as MetaAd[];
      setMetaAds(ads);
      
      toast({
        title: "Ads Generated",
        description: "Successfully generated Meta/Instagram ads",
      });
      
      return ads;
    } catch (error) {
      console.error('Error generating Meta ads:', error);
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAdImage = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) {
        console.error('Error generating image:', error);
        toast({
          title: "Image Generation Failed",
          description: error.message || "Failed to generate image",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        toast({
          title: "Image Generation Failed",
          description: data.error || "Failed to generate image",
          variant: "destructive",
        });
        return null;
      }

      return data.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Image Generation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    generateGoogleAds,
    generateMetaAds,
    generateAdImage,
    isGenerating,
    googleAds,
    metaAds,
  };
};
