
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { LinkedInAd, MicrosoftAd } from "@/contexts/CampaignContext";
import { useAdGenerationActions } from "./useAdGenerationActions";
import { useCampaignCreation } from "./useCampaignCreation";
import { useWebsiteAnalysisActions } from "./useWebsiteAnalysisActions";
import { supabase } from "@/integrations/supabase/client";

// Helper to convert LinkedInAd to MetaAd
const convertToMetaAds = (linkedInAds: LinkedInAd[]): MetaAd[] => {
  return linkedInAds.map(ad => ({
    primaryText: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    imagePrompt: ad.imagePrompt || '', // Ensure imagePrompt is never undefined
    imageUrl: ad.imageUrl
  }));
};

export const useCampaignActions = (
  user: any,
  campaignData: any,
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  linkedInAds: LinkedInAd[],
  microsoftAds: MicrosoftAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  generateLinkedInAds: (campaignData: any) => Promise<LinkedInAd[] | null>,
  generateMicrosoftAds: (campaignData: any) => Promise<MicrosoftAd[] | null>,
  generateAdImage: (prompt: string) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  // Website analysis actions
  const { 
    handleAnalyzeWebsite,
    isAnalyzing
  } = useWebsiteAnalysisActions();

  // Convert LinkedInAds to MetaAds for compatibility
  const metaAds = convertToMetaAds(linkedInAds);

  // Ad generation actions
  const {
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds,
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError
  } = useAdGenerationActions(
    analysisResult,
    googleAds,
    linkedInAds,
    microsoftAds,
    generateGoogleAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage,
    setCampaignData
  );

  // Campaign creation actions
  const {
    createCampaign,
    isCreating
  } = useCampaignCreation(
    user,
    campaignData,
    googleAds,
    metaAds // Use the converted metaAds here instead of linkedInAds
  );

  return {
    handleAnalyzeWebsite,
    isAnalyzing,
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds,
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError,
    createCampaign,
    isCreating
  };
};
