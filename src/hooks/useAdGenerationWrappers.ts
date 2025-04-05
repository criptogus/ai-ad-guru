
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";
import { normalizeGoogleAd, normalizeMetaAd } from "@/lib/utils";

export const useAdGenerationWrappers = (
  generateGoogleAds: any,
  generateMetaAds: any,
  generateLinkedInAds: any,
  generateMicrosoftAds: any
) => {
  const wrappedGenerateGoogleAds = async (input: any, trigger?: string): Promise<GoogleAd[]> => {
    const ads = await generateGoogleAds(input, trigger);
    return Array.isArray(ads) ? ads.map(ad => normalizeGoogleAd(ad)) : [];
  };

  const wrappedGenerateMetaAds = async (input: any, trigger?: string): Promise<MetaAd[]> => {
    const ads = await generateMetaAds(input, trigger);
    return Array.isArray(ads) ? ads.map(ad => normalizeMetaAd(ad)) : [];
  };

  const wrappedGenerateLinkedInAds = async (input: any, trigger?: string): Promise<MetaAd[]> => {
    const ads = await generateLinkedInAds(input, trigger);
    return Array.isArray(ads) ? ads.map(ad => normalizeMetaAd(ad)) : [];
  };

  const wrappedGenerateMicrosoftAds = async (input: any, trigger?: string): Promise<GoogleAd[]> => {
    const ads = await generateMicrosoftAds(input, trigger);
    return Array.isArray(ads) ? ads.map(ad => normalizeGoogleAd(ad)) : [];
  };

  return {
    wrappedGenerateGoogleAds,
    wrappedGenerateMetaAds,
    wrappedGenerateLinkedInAds,
    wrappedGenerateMicrosoftAds
  };
};
