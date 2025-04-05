
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface AdGenerationHandlersProps {
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  generateGoogleAds: (input: WebsiteAnalysisResult, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  generateMetaAds: (input: WebsiteAnalysisResult, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (input: WebsiteAnalysisResult, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateMicrosoftAds: (input: WebsiteAnalysisResult, mindTrigger?: string) => Promise<GoogleAd[] | null>;
}

export const useAdGenerationHandlers = ({
  analysisResult,
  campaignData,
  setGoogleAds,
  setMetaAds,
  setLinkedInAds,
  setMicrosoftAds,
  generateGoogleAds,
  generateMetaAds,
  generateLinkedInAds,
  generateMicrosoftAds
}: AdGenerationHandlersProps) => {
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) return;
    
    const platform = "google";
    const mindTrigger = campaignData?.mindTriggers?.[platform];
    
    const ads = await generateGoogleAds(analysisResult, mindTrigger);
    if (ads) {
      setGoogleAds(ads);
    }
  };

  const handleGenerateMetaAds = async () => {
    if (!analysisResult) return;
    
    const platform = "meta";
    const mindTrigger = campaignData?.mindTriggers?.[platform];
    
    const ads = await generateMetaAds(analysisResult, mindTrigger);
    if (ads) {
      setMetaAds(ads);
    }
  };

  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult) return;
    
    const platform = "linkedin";
    const mindTrigger = campaignData?.mindTriggers?.[platform];
    
    const ads = await generateLinkedInAds(analysisResult, mindTrigger);
    if (ads) {
      setLinkedInAds(ads);
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult) return;
    
    const platform = "microsoft";
    const mindTrigger = campaignData?.mindTriggers?.[platform];
    
    const ads = await generateMicrosoftAds(analysisResult, mindTrigger);
    if (ads) {
      setMicrosoftAds(ads);
    }
  };

  return {
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds
  };
};
