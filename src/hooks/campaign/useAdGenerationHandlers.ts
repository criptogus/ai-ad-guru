
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export const useAdGenerationHandlers = (
  analysisResult: WebsiteAnalysisResult | null,
  campaignData: any,
  setGoogleAds: (ads: GoogleAd[]) => void,
  setMetaAds: (ads: MetaAd[]) => void,
  setLinkedInAds: (ads: any[]) => void,
  setMicrosoftAds: (ads: any[]) => void,
  generateGoogleAds: (analysisResult: WebsiteAnalysisResult, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  generateMetaAds: (analysisResult: WebsiteAnalysisResult, mindTrigger?: string) => Promise<MetaAd[] | null>,
  generateLinkedInAds: (analysisResult: WebsiteAnalysisResult, mindTrigger?: string) => Promise<any[] | null>,
  generateMicrosoftAds: (analysisResult: WebsiteAnalysisResult, mindTrigger?: string) => Promise<any[] | null>
) => {
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) return;
    
    const platform = "google";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
    const ads = await generateGoogleAds(analysisResult, mindTrigger);
    if (ads) {
      setGoogleAds(ads);
    }
  };

  const handleGenerateMetaAds = async () => {
    if (!analysisResult) return;
    
    const platform = "meta";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
    const ads = await generateMetaAds(analysisResult, mindTrigger);
    if (ads) {
      setMetaAds(ads);
    }
  };

  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult) return;
    
    const platform = "linkedin";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
    const ads = await generateLinkedInAds(analysisResult, mindTrigger);
    if (ads) {
      setLinkedInAds(ads);
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult) return;
    
    const platform = "microsoft";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
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
