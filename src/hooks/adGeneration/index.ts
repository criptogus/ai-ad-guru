
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
    setIsGenerating(true);
    try {
      const result = await googleAdsGenerator(campaignData);
      setIsGenerating(false);
      return result;
    } catch (error) {
      console.error("Error generating Google ads:", error);
      setIsGenerating(false);
      return null;
    }
  };

  const generateMetaAds = async (campaignData: any) => {
    setIsGenerating(true);
    try {
      const result = await metaAdsGenerator(campaignData);
      setIsGenerating(false);
      return result;
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      setIsGenerating(false);
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
