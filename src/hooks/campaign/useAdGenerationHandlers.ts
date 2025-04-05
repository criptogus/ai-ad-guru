import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { normalizeGoogleAd, normalizeMetaAd } from "@/lib/utils";

interface UseAdGenerationHandlersProps {
  analysisResult: WebsiteAnalysisResult;
  campaignData: any;
  setGoogleAds: (ads: GoogleAd[]) => void;
  setMetaAds: (ads: MetaAd[]) => void;
  setLinkedInAds: (ads: MetaAd[]) => void;
  setMicrosoftAds: (ads: GoogleAd[]) => void;
  generateGoogleAds: (input: any, trigger?: string) => Promise<GoogleAd[] | null>;
  generateMetaAds: (input: any, trigger?: string) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (input: any, trigger?: string) => Promise<MetaAd[] | null>;
  generateMicrosoftAds: (input: any, trigger?: string) => Promise<GoogleAd[] | null>;
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
}: UseAdGenerationHandlersProps) => {
  const handleGenerateGoogleAds = async () => {
    try {
      const mindTrigger = campaignData?.mindTriggers?.google;
      const ads = await generateGoogleAds(analysisResult, mindTrigger);
      
      if (ads) {
        const normalizedAds = ads.map(ad => normalizeGoogleAd(ad));
        setGoogleAds(normalizedAds);
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
    }
  };

  const handleGenerateMetaAds = async () => {
    try {
      const mindTrigger = campaignData?.mindTriggers?.meta;
      const ads = await generateMetaAds(analysisResult, mindTrigger);
      
      if (ads) {
        const normalizedAds = ads.map(ad => normalizeMetaAd(ad));
        setMetaAds(normalizedAds);
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
    }
  };

  const handleGenerateLinkedInAds = async () => {
    try {
      const mindTrigger = campaignData?.mindTriggers?.linkedin;
      const ads = await generateLinkedInAds(analysisResult, mindTrigger);
      
      if (ads) {
        const normalizedAds = ads.map(ad => normalizeMetaAd(ad));
        setLinkedInAds(normalizedAds);
      }
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    try {
      const mindTrigger = campaignData?.mindTriggers?.microsoft;
      const ads = await generateMicrosoftAds(analysisResult, mindTrigger);
      
      if (ads) {
        const normalizedAds = ads.map(ad => {
          const normalizedAd = normalizeGoogleAd(ad);
          return normalizedAd;
        });
        setMicrosoftAds(normalizedAds);
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
    }
  };

  return {
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds
  };
};
