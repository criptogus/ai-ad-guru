
import { useGenerateGoogleAdsHandler } from './handlers/useGenerateGoogleAdsHandler';
import { useGenerateMetaAdsHandler } from './handlers/useGenerateMetaAdsHandler';
import { useGenerateMicrosoftAdsHandler } from './handlers/useGenerateMicrosoftAdsHandler';
import { useGenerateLinkedInAdsHandler } from './handlers/useGenerateLinkedInAdsHandler';
import { useCampaignCreateHandler } from './handlers/useCampaignCreateHandler';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';

export interface UseAdGenerationHandlersProps {
  setGoogleAds: (ads: GoogleAd[]) => void;
  setMetaAds: (ads: MetaAd[]) => void;
  setMicrosoftAds?: (ads: GoogleAd[]) => void;
  setLinkedInAds?: (ads: MetaAd[]) => void;
  campaignData: any;
  createCampaign?: any;
  setIsCreating?: (isCreating: boolean) => void;
  analysisResult?: any;
  generateGoogleAds?: (analysisResult: any) => Promise<GoogleAd[] | null>;
  generateMetaAds?: (analysisResult: any) => Promise<MetaAd[] | null>;
  generateMicrosoftAds?: (analysisResult: any) => Promise<GoogleAd[] | null>;
  generateLinkedInAds?: (analysisResult: any) => Promise<MetaAd[] | null>;
}

export const useAdGenerationHandlers = ({
  setGoogleAds,
  setMetaAds,
  setMicrosoftAds,
  setLinkedInAds,
  campaignData,
  createCampaign,
  setIsCreating,
  analysisResult,
  generateGoogleAds,
  generateMetaAds,
  generateMicrosoftAds,
  generateLinkedInAds,
}: UseAdGenerationHandlersProps) => {
  // Provide all handlers from sub-hooks
  const { handleGenerateGoogleAds } = useGenerateGoogleAdsHandler({
    setGoogleAds,
    analysisResult,
    generateGoogleAds,
  });
  const { handleGenerateMetaAds } = useGenerateMetaAdsHandler({
    setMetaAds,
    analysisResult,
    generateMetaAds,
  });
  const { handleGenerateMicrosoftAds } = useGenerateMicrosoftAdsHandler({
    setMicrosoftAds: setMicrosoftAds!,
    analysisResult,
    generateMicrosoftAds,
  });
  const { handleGenerateLinkedInAds } = useGenerateLinkedInAdsHandler({
    setLinkedInAds: setLinkedInAds!,
    analysisResult,
    generateLinkedInAds,
  });
  const { handleCreateCampaign } = useCampaignCreateHandler({
    createCampaign,
    setIsCreating,
  });

  // No change to handleAdsGenerated
  const handleAdsGenerated = (generatedAds: any) => {
    if (!generatedAds) return;

    if (generatedAds.google_ads) setGoogleAds(generatedAds.google_ads);
    if (generatedAds.meta_ads) setMetaAds(generatedAds.meta_ads);
    if (generatedAds.linkedin_ads && setLinkedInAds) setLinkedInAds(generatedAds.linkedin_ads);
    if (generatedAds.microsoft_ads && setMicrosoftAds) setMicrosoftAds(generatedAds.microsoft_ads);
  };

  return {
    handleAdsGenerated,
    handleCreateCampaign,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateLinkedInAds,
  };
};
