
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { LinkedInAd, MicrosoftAd } from "@/contexts/CampaignContext";
import { 
  useGoogleAdActions, 
  useLinkedInAdActions,
  useMicrosoftAdActions,
  useImageGenerationActions 
} from "./adGeneration";

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
  
  const { 
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError 
  } = useImageGenerationActions(
    analysisResult,
    linkedInAds, // Changed from metaAds to linkedInAds
    generateAdImage,
    setCampaignData
  );

  return {
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds,
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError
  };
};
