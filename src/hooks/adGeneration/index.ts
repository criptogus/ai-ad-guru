
import { useState } from 'react';
import { useGoogleAds } from './useGoogleAds';
import { useMetaAds } from './useMetaAds';
import { useImageGeneration } from './useImageGeneration';
import { UseAdGenerationReturn, GoogleAd, MetaAd } from './types';

export * from './types';

export const useAdGeneration = (): UseAdGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    generateGoogleAds: googleAdsGenerator, 
    googleAds 
  } = useGoogleAds();
  
  const { 
    generateMetaAds: metaAdsGenerator, 
    metaAds 
  } = useMetaAds();
  
  const { 
    generateAdImage 
  } = useImageGeneration();

  const generateGoogleAds = async (campaignData: any) => {
    console.log("useAdGeneration - Generating Google ads with data:", campaignData);
    setIsGenerating(true);
    try {
      const result = await googleAdsGenerator(campaignData);
      console.log("useAdGeneration - Generated Google ads:", result);
      setIsGenerating(false);
      return result;
    } catch (error) {
      console.error("Error generating Google ads:", error);
      setIsGenerating(false);
      return null;
    }
  };

  const generateMetaAds = async (campaignData: any) => {
    console.log("useAdGeneration - Generating Meta ads with data:", campaignData);
    setIsGenerating(true);
    try {
      const result = await metaAdsGenerator(campaignData);
      console.log("useAdGeneration - Generated Meta ads:", result);
      setIsGenerating(false);
      return result;
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      setIsGenerating(false);
      return null;
    }
  };

  const generateAdImageWithLogging = async (prompt: string) => {
    console.log("useAdGeneration - Generating image with prompt:", prompt);
    try {
      const imageUrl = await generateAdImage(prompt);
      console.log("useAdGeneration - Generated image URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  return {
    generateGoogleAds,
    generateMetaAds,
    generateAdImage: generateAdImageWithLogging,
    isGenerating,
    googleAds,
    metaAds,
  };
};
