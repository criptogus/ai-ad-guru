
import { useGoogleAds } from './useGoogleAds';
import { useMetaAds } from './useMetaAds';
import { useGPT4oImageGeneration } from './useGPT4oImageGeneration';
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
  
  return {
    ...googleAdsHook,
    ...metaAdsHook,
    generateAdImage,
    isGenerating: googleAdsHook.isGenerating || metaAdsHook.isGenerating || imageGenHook.isGenerating,
    error: googleAdsHook.error || metaAdsHook.error || imageGenHook.error
  };
};

// Re-export types
export type { GoogleAd, MetaAd } from './types';
