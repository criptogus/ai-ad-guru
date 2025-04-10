
import { useGoogleAds } from './useGoogleAds';
import { useMetaAds } from './useMetaAds';
import { useGPT4oImageGeneration, UseGPT4oImageGenerationReturn } from './useGPT4oImageGeneration';
import { useImageGeneration } from './useImageGeneration';

// Export all hooks
export const useAdGeneration = () => {
  const googleAdsHook = useGoogleAds();
  const metaAdsHook = useMetaAds();
  const imageGenHook = useGPT4oImageGeneration();
  
  // Create an adapter for the generateAdImage function to ensure it has the right signature
  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | any> => {
    return imageGenHook.generateAdImage(prompt, additionalInfo);
  };

  // Add mock implementations for LinkedIn and Microsoft ads
  const generateLinkedInAds = async (campaignData: any, mindTrigger?: string) => {
    console.log("LinkedIn ad generation requested", campaignData);
    return metaAdsHook.generateMetaAds?.(campaignData, mindTrigger) || null;
  };
  
  const generateMicrosoftAds = async (campaignData: any, mindTrigger?: string) => {
    console.log("Microsoft ad generation requested", campaignData);
    return googleAdsHook.generateGoogleAds?.(campaignData, mindTrigger) || null;
  };
  
  return {
    ...googleAdsHook,
    ...metaAdsHook,
    generateAdImage,
    generateLinkedInAds,
    generateMicrosoftAds,
    isGenerating: googleAdsHook.isGenerating || metaAdsHook.isGenerating || imageGenHook.isGenerating,
    error: googleAdsHook.error || metaAdsHook.error || imageGenHook.error
  };
};

// Re-export types
export type { GoogleAd, MetaAd } from './types';
export type { UseGPT4oImageGenerationReturn };
