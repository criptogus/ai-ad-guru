
import { useToast } from '@/hooks/use-toast';
import { GoogleAd } from '@/hooks/adGeneration/types';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

interface UseGenerateMicrosoftAdsHandlerProps {
  setMicrosoftAds: (ads: GoogleAd[]) => void;
  analysisResult?: WebsiteAnalysisResult | null;
  generateMicrosoftAds?: (analysisResult: any) => Promise<GoogleAd[] | null>;
}

export const useGenerateMicrosoftAdsHandler = ({
  setMicrosoftAds,
  analysisResult,
  generateMicrosoftAds,
}: UseGenerateMicrosoftAdsHandlerProps) => {
  const { toast } = useToast();

  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult || !generateMicrosoftAds || !setMicrosoftAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads.",
      });
      return;
    }
    try {
      const ads = await generateMicrosoftAds(analysisResult);
      if (ads && ads.length > 0) {
        setMicrosoftAds(ads);
        toast({
          title: "Microsoft Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`,
        });
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate Microsoft ads. Please try again.",
      });
    }
  };

  return { handleGenerateMicrosoftAds };
};
