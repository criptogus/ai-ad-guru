
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
  generateAdImage: (prompt: string) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  // Use the smaller, more focused hooks
  const { handleGenerateGoogleAds } = useGoogleAdActions(
    analysisResult,
    generateGoogleAds, 
    setCampaignData
  );
  
  const { handleGenerateMetaAds } = useMetaAdActions(
    analysisResult,
    generateMetaAds, 
    setCampaignData
  );
  
  const { 
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError 
  } = useImageGenerationActions(
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
