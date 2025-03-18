
import { useState } from 'react';
import { useGoogleAds } from './useGoogleAds';
import { useMetaAds } from './useMetaAds';
import { useImageGeneration } from './useImageGeneration';
import { UseAdGenerationReturn } from './types';

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
    const result = await googleAdsGenerator(campaignData);
    setIsGenerating(false);
    return result;
  };

  const generateMetaAds = async (campaignData: any) => {
    setIsGenerating(true);
    const result = await metaAdsGenerator(campaignData);
    setIsGenerating(false);
    return result;
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
