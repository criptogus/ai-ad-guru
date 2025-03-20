
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

// Helper to convert LinkedInAd to MetaAd format for compatibility
const convertToMetaAds = (linkedInAds: LinkedInAd[]): MetaAd[] => {
  return linkedInAds.map(ad => ({
    primaryText: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    imagePrompt: ad.imagePrompt || '', // Ensure imagePrompt is never undefined
    imageUrl: ad.imageUrl
  }));
};

export const useAdGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  linkedInAds: LinkedInAd[],
  microsoftAds: MicrosoftAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  generateLinkedInAds: (campaignData: any) => Promise<LinkedInAd[] | null>,
  generateMicrosoftAds: (campaignData: any) => Promise<MicrosoftAd[] | null>,
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  // Use the smaller, more focused hooks
  const { handleGenerateGoogleAds } = useGoogleAdActions(
    analysisResult,
    googleAds,
    generateGoogleAds, 
    setCampaignData
  );
  
  const { handleGenerateLinkedInAds } = useLinkedInAdActions(
    analysisResult,
    linkedInAds,
    generateLinkedInAds,
    setCampaignData
  );
  
  const { handleGenerateMicrosoftAds } = useMicrosoftAdActions(
    analysisResult,
    microsoftAds,
    generateMicrosoftAds,
    setCampaignData
  );
  
  // Convert LinkedInAds to MetaAds for compatibility
  const metaAds = convertToMetaAds(linkedInAds);
  
  const { handleGenerateMetaAds } = useMetaAdActions(
    analysisResult,
    metaAds,
    generateLinkedInAds, // Reuse LinkedIn ad generator for Meta/Instagram
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
