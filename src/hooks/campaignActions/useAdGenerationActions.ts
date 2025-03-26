
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { LinkedInAd, MicrosoftAd } from "@/contexts/CampaignContext";
import { 
  useGoogleAdActions, 
  useLinkedInAdActions,
  useMicrosoftAdActions,
  useImageGenerationActions,
  useMetaAdActions
} from "./adGeneration";
import { getMindTrigger } from "./getMindTrigger";

// Helper to convert LinkedInAd to MetaAd format for compatibility
const convertToMetaAds = (linkedInAds: LinkedInAd[]): MetaAd[] => {
  return linkedInAds.map(ad => ({
    primaryText: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    imagePrompt: ad.imagePrompt || '', // Ensure imagePrompt is never undefined
    imageUrl: ad.imageUrl,
    format: ad.format,
    hashtags: ad.hashtags
  }));
};

export const useAdGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  linkedInAds: LinkedInAd[],
  microsoftAds: MicrosoftAd[],
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  generateLinkedInAds: (campaignData: any, mindTrigger?: string) => Promise<LinkedInAd[] | null>,
  generateMicrosoftAds: (campaignData: any, mindTrigger?: string) => Promise<MicrosoftAd[] | null>,
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  // Get the campaign data to access mind triggers
  const campaignData = (window as any).campaignContext?.campaignData || {};

  // Use the smaller, more focused hooks
  const { handleGenerateGoogleAds } = useGoogleAdActions(
    analysisResult,
    googleAds,
    (data) => generateGoogleAds(data, getMindTrigger(campaignData, "google")), 
    setCampaignData
  );
  
  const { handleGenerateLinkedInAds } = useLinkedInAdActions(
    analysisResult,
    linkedInAds,
    (data) => generateLinkedInAds(data, getMindTrigger(campaignData, "linkedin")),
    setCampaignData
  );
  
  const { handleGenerateMicrosoftAds } = useMicrosoftAdActions(
    analysisResult,
    microsoftAds,
    (data) => generateMicrosoftAds(data, getMindTrigger(campaignData, "microsoft")),
    setCampaignData
  );
  
  // Convert LinkedInAds to MetaAds for compatibility
  const metaAds = convertToMetaAds(linkedInAds);
  
  const { handleGenerateMetaAds, handleGenerateImage: handleGenerateMetaImage } = useMetaAdActions(
    analysisResult,
    metaAds,
    (data) => generateLinkedInAds(data, getMindTrigger(campaignData, "meta")),
    generateAdImage,
    setCampaignData
  );
  
  const { 
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError 
  } = useImageGenerationActions(
    analysisResult,
    metaAds,
    generateAdImage,
    setCampaignData
  );

  return {
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError
  };
};
