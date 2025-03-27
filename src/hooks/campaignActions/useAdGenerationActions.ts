import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { 
  useGoogleAdActions,
  useMetaAdActions,
  useImageGenerationActions
} from "@/hooks/campaignActions/adGeneration";

export const useAdGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  linkedInAds: any[], // Keep type as is for compatibility
  microsoftAds: any[], // Keep type as is for compatibility
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  generateLinkedInAds: (campaignData: any, mindTrigger?: string) => Promise<any[] | null>,
  generateMicrosoftAds: (campaignData: any, mindTrigger?: string) => Promise<any[] | null>,
  generateAdImage: (prompt: string) => Promise<string | null>,
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

  // Initialize Meta ad actions
  const {
    handleGenerateMetaAds,
    isGenerating: isGeneratingMetaAds
  } = useMetaAdActions(
    analysisResult, 
    [], // Initialize with empty array
    async (campaignData: any, mindTrigger?: string) => {
      // For compatibility, convert LinkedIn ads to Meta format
      try {
        const result = await generateLinkedInAds(campaignData, mindTrigger);
        return result as unknown as MetaAd[];
      } catch (error) {
        console.error("Error in Meta ad generation:", error);
        return null;
      }
    },
    setCampaignData
  );

  const handleGenerateLinkedInAds = async () => {
    // Placeholder function for LinkedIn ad generation
    console.warn("LinkedIn ad generation not fully implemented");
  };

  const handleGenerateMicrosoftAds = async () => {
    // Placeholder function for Microsoft ad generation
    console.warn("Microsoft ad generation not fully implemented");
  };

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
  const isGenerating = isGeneratingGoogleAds || isGeneratingMetaAds;

  return {
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds: handleGenerateMetaAds, // Use Meta for LinkedIn for now
    handleGenerateMetaAds, // Add explicit Meta ads handler
    handleGenerateMicrosoftAds: async () => {
      // Placeholder function for Microsoft ad generation
      console.warn("Microsoft ad generation not fully implemented");
    },
    handleGenerateImage,
    loadingImageIndex,
    imageGenerationError,
    clearImageGenerationError,
    isGenerating
  };
};
