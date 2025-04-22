
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";
import { normalizeGoogleAd, normalizeMetaAd } from "@/lib/utils";

export const useAdGenerationWrappers = (
  generateGoogleAds: any,
  generateMetaAds: any,
  generateLinkedInAds: any,
  generateMicrosoftAds: any
) => {
  const wrappedGenerateGoogleAds = async (input: any, trigger?: string): Promise<GoogleAd[]> => {
    try {
      console.log("wrappedGenerateGoogleAds called with:", input);
      const ads = await generateGoogleAds(input, trigger);
      return Array.isArray(ads) ? ads.map(ad => normalizeGoogleAd(ad)) : [];
    } catch (error) {
      console.error("Error in wrappedGenerateGoogleAds:", error);
      return [];
    }
  };

  const wrappedGenerateMetaAds = async (input: any, trigger?: string): Promise<MetaAd[]> => {
    try {
      console.log("wrappedGenerateMetaAds called with:", input);
      const ads = await generateMetaAds(input, trigger);
      return Array.isArray(ads) ? ads.map(ad => normalizeMetaAd(ad)) : [];
    } catch (error) {
      console.error("Error in wrappedGenerateMetaAds:", error);
      return [];
    }
  };

  const wrappedGenerateLinkedInAds = async (input: any, trigger?: string): Promise<MetaAd[]> => {
    try {
      console.log("wrappedGenerateLinkedInAds called with:", input);
      const ads = await generateLinkedInAds(input, trigger);
      return Array.isArray(ads) ? ads.map(ad => normalizeMetaAd(ad)) : [];
    } catch (error) {
      console.error("Error in wrappedGenerateLinkedInAds:", error);
      return [];
    }
  };

  const wrappedGenerateMicrosoftAds = async (input: any, trigger?: string): Promise<GoogleAd[]> => {
    try {
      console.log("wrappedGenerateMicrosoftAds called with:", input);
      const ads = await generateMicrosoftAds(input, trigger);
      return Array.isArray(ads) ? ads.map(ad => normalizeGoogleAd(ad)) : [];
    } catch (error) {
      console.error("Error in wrappedGenerateMicrosoftAds:", error);
      return [];
    }
  };

  return {
    wrappedGenerateGoogleAds,
    wrappedGenerateMetaAds,
    wrappedGenerateLinkedInAds,
    wrappedGenerateMicrosoftAds
  };
};
