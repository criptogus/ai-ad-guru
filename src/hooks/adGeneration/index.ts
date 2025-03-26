
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  GoogleAd, 
  MetaAd, 
  AdGenerationInput, 
  UseAdGenerationReturn 
} from './types';
import { useImageGeneration } from './useImageGeneration';

export const useAdGeneration = (): UseAdGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateAdImage } = useImageGeneration();

  // Generate Google Ads
  const generateGoogleAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<GoogleAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating Google Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      const request = {
        ...input,
        platform: "google",
        mindTrigger // Include mind trigger in request
      };

      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: request
      });

      if (error) {
        console.error("Error generating Google ads:", error);
        throw error;
      }

      console.log("Google ads generated:", data);
      return data.ads as GoogleAd[];
    } catch (error) {
      console.error("Error in generateGoogleAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Google Ads",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Meta Ads (Instagram)
  const generateMetaAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<MetaAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating Meta Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      const request = {
        ...input,
        platform: "meta",
        mindTrigger // Include mind trigger in request
      };

      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: request
      });

      if (error) {
        console.error("Error generating Meta ads:", error);
        throw error;
      }

      console.log("Meta ads generated:", data);
      return data.ads as MetaAd[];
    } catch (error) {
      console.error("Error in generateMetaAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Instagram/Meta Ads",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate LinkedIn Ads
  const generateLinkedInAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<MetaAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating LinkedIn Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      const request = {
        ...input,
        platform: "linkedin",
        mindTrigger // Include mind trigger in request
      };

      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: request
      });

      if (error) {
        console.error("Error generating LinkedIn ads:", error);
        throw error;
      }

      console.log("LinkedIn ads generated:", data);
      return data.ads as MetaAd[];
    } catch (error) {
      console.error("Error in generateLinkedInAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate LinkedIn Ads",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Microsoft Ads
  const generateMicrosoftAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<GoogleAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating Microsoft Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      const request = {
        ...input,
        platform: "microsoft",
        mindTrigger // Include mind trigger in request
      };

      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: request
      });

      if (error) {
        console.error("Error generating Microsoft ads:", error);
        throw error;
      }

      console.log("Microsoft ads generated:", data);
      return data.ads as GoogleAd[];
    } catch (error) {
      console.error("Error in generateMicrosoftAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Microsoft Ads",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage,
    isGenerating
  };
};

export * from './types';
