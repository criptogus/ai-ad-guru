
import { useToast } from '@/hooks/use-toast';
import { GoogleAd } from '@/hooks/adGeneration/types';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

interface UseGenerateGoogleAdsHandlerProps {
  setGoogleAds: (ads: GoogleAd[]) => void;
  analysisResult?: WebsiteAnalysisResult | null;
  generateGoogleAds?: (analysisResult: any) => Promise<GoogleAd[] | null>;
}

export const useGenerateGoogleAdsHandler = ({
  setGoogleAds,
  analysisResult,
  generateGoogleAds,
}: UseGenerateGoogleAdsHandlerProps) => {
  const { toast } = useToast();

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult || !generateGoogleAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads.",
      });
      return;
    }
    try {
      const ads = await generateGoogleAds(analysisResult);
      if (ads && ads.length > 0) {
        setGoogleAds(ads);
        toast({
          title: "Google Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`,
        });
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate Google ads. Please try again.",
      });
    }
  };

  return { handleGenerateGoogleAds };
};
