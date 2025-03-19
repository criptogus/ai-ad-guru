
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { 
  useGoogleAdActions, 
  useMetaAdActions, 
  useImageGenerationActions 
} from "./adGeneration";

export const useAdGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  metaAds: MetaAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>,
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
  
  const { handleGenerateMetaAds } = useMetaAdActions(
    analysisResult,
    metaAds,
    generateMetaAds, 
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
    handleGenerateMetaAds,
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError
  };
};
