
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { 
  useGoogleAdActions,
  useMetaAdActions,
  useImageGenerationActions,
  useMicrosoftAdActions
} from "@/hooks/campaignActions/adGeneration";

export const useAdGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  linkedInAds: any[], // Keep type as is for compatibility
  microsoftAds: any[], // Keep type as is for compatibility
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  generateLinkedInAds: (campaignData: any, mindTrigger?: string) => Promise<any[] | null>,
  generateMicrosoftAds: (campaignData: any, mindTrigger?: string) => Promise<any[] | null>,
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  // Initialize Google ad actions
  const { 
    handleGenerateGoogleAds,
    isGenerating: isGeneratingGoogleAds
  } = useGoogleAdActions(
    analysisResult,
    googleAds,
    generateGoogleAds,
    setCampaignData
  );

  // Initialize Microsoft ad actions
  const {
    handleGenerateMicrosoftAds,
    isGenerating: isGeneratingMicrosoftAds
  } = useMicrosoftAdActions(
    analysisResult,
    microsoftAds,
    generateMicrosoftAds,
    setCampaignData
  );

  // Initialize Meta ad actions
  const {
    handleGenerateMetaAds,
    isGenerating: isGeneratingMetaAds
  } = useMetaAdActions(
    analysisResult, 
    [], // Initialize with empty array
    generateLinkedInAds, // Pass the generateLinkedInAds function
    setCampaignData
  );

  // Update handleGenerateLinkedInAds to use handleGenerateMetaAds
  const handleGenerateLinkedInAds = handleGenerateMetaAds;

  // Initialize image generation actions
  const { 
    handleGenerateImage,
    loadingImageIndex,
    error: imageGenerationError,
    clearError: clearImageGenerationError
  } = useImageGenerationActions(
    generateAdImage,
    setCampaignData
  );

  // Track overall generation state
  const isGenerating = isGeneratingGoogleAds || isGeneratingMetaAds || isGeneratingMicrosoftAds;

  return {
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds,
    handleGenerateMetaAds, // Add explicit Meta ads handler
    handleGenerateMicrosoftAds,
    handleGenerateImage,
    loadingImageIndex,
    imageGenerationError,
    clearImageGenerationError,
    isGenerating
  };
};
