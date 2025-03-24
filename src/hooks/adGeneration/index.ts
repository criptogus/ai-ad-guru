
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GoogleAd, MetaAd, UseAdGenerationReturn } from './types';

export * from './types';

export const useAdGeneration = (): UseAdGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const { toast } = useToast();

  const generateGoogleAds = async (campaignData: any): Promise<GoogleAd[] | null> => {
    if (!campaignData) {
      toast({
        title: "Error",
        description: "Campaign data is required to generate ads",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      // Example of placeholder code - this would call your actual API
      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: { 
          platform: 'google',
          campaignData,
        },
      });

      if (error) {
        console.error('Error generating Google ads:', error);
        throw error;
      }

      console.log('Generated Google ads:', data);
      
      // Cast to correct type
      const ads = data?.ads as GoogleAd[] || [];
      setGoogleAds(ads);
      
      toast({
        title: "Ads Generated",
        description: `Successfully created ${ads.length} Google ads`,
      });
      
      return ads;
    } catch (error) {
      console.error('Error calling generate-ads function:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Google ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMetaAds = async (campaignData: any): Promise<MetaAd[] | null> => {
    if (!campaignData) {
      toast({
        title: "Error",
        description: "Campaign data is required to generate ads",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      // Example of placeholder code - this would call your actual API
      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: { 
          platform: 'meta',
          campaignData,
        },
      });

      if (error) {
        console.error('Error generating Meta ads:', error);
        throw error;
      }

      console.log('Generated Meta ads:', data);
      
      // Cast to correct type
      const ads = data?.ads as MetaAd[] || [];
      setMetaAds(ads);
      
      toast({
        title: "Ads Generated",
        description: `Successfully created ${ads.length} Meta ads`,
      });
      
      return ads;
    } catch (error) {
      console.error('Error calling generate-ads function:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Meta ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Add the missing functions
  const generateLinkedInAds = async (campaignData: any): Promise<any[] | null> => {
    if (!campaignData) {
      toast({
        title: "Error",
        description: "Campaign data is required to generate ads",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      // Example of placeholder code - this would be your actual API call
      console.log('Generating LinkedIn ads with data:', campaignData);
      
      // Placeholder for LinkedIn ads generation
      const mockAds = [
        { id: 1, headline: "LinkedIn Ad 1", description: "Description for LinkedIn ad 1" },
        { id: 2, headline: "LinkedIn Ad 2", description: "Description for LinkedIn ad 2" }
      ];
      
      toast({
        title: "LinkedIn Ads",
        description: "LinkedIn ads generation is in development",
      });
      
      return mockAds;
    } catch (error) {
      console.error('Error generating LinkedIn ads:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate LinkedIn ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMicrosoftAds = async (campaignData: any): Promise<any[] | null> => {
    if (!campaignData) {
      toast({
        title: "Error",
        description: "Campaign data is required to generate ads",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      // Example of placeholder code - this would be your actual API call
      console.log('Generating Microsoft ads with data:', campaignData);
      
      // Placeholder for Microsoft ads generation
      const mockAds = [
        { id: 1, headline1: "Microsoft Ad 1", description1: "Description for Microsoft ad 1" },
        { id: 2, headline1: "Microsoft Ad 2", description1: "Description for Microsoft ad 2" }
      ];
      
      toast({
        title: "Microsoft Ads",
        description: "Microsoft ads generation is in development",
      });
      
      return mockAds;
    } catch (error) {
      console.error('Error generating Microsoft ads:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Microsoft ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "An image prompt is required",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      // Example of placeholder code - this would call your actual API
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, additionalInfo },
      });

      if (error) {
        console.error('Error generating image:', error);
        throw error;
      }

      console.log('Generated image:', data);
      
      // Return image URL
      return data?.imageUrl || null;
    } catch (error) {
      console.error('Error calling generate-image function:', error);
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate image. Please try again.",
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
    isGenerating,
    googleAds,
    metaAds
  };
};
