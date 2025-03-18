
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { useAdGenerationActions } from "./useAdGenerationActions";
import { useCampaignCreation } from "./useCampaignCreation";
import { useWebsiteAnalysisActions } from "./useWebsiteAnalysisActions";

export const useCampaignActions = (
  user: any,
  campaignData: any,
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  metaAds: MetaAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>,
  generateAdImage: (prompt: string) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  // Website analysis actions
  const { 
    handleAnalyzeWebsite 
  } = useWebsiteAnalysisActions();

  // Ad generation actions
  const {
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage
  } = useAdGenerationActions(
    analysisResult,
    googleAds,
    metaAds,
    generateGoogleAds,
    generateMetaAds,
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
    metaAds
  );

  return {
    handleAnalyzeWebsite,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage,
    createCampaign,
    isCreating
  };
};
