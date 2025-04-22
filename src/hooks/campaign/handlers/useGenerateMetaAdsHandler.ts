
import { useToast } from '@/hooks/use-toast';
import { MetaAd } from '@/hooks/adGeneration/types';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

interface UseGenerateMetaAdsHandlerProps {
  setMetaAds: (ads: MetaAd[]) => void;
  analysisResult?: WebsiteAnalysisResult | null;
  generateMetaAds?: (analysisResult: any) => Promise<MetaAd[] | null>;
}

export const useGenerateMetaAdsHandler = ({
  setMetaAds,
  analysisResult,
  generateMetaAds,
}: UseGenerateMetaAdsHandlerProps) => {
  const { toast } = useToast();

  const handleGenerateMetaAds = async () => {
    if (!analysisResult || !generateMetaAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads.",
      });
      return;
    }
    try {
      const ads = await generateMetaAds(analysisResult);
      if (ads && ads.length > 0) {
        setMetaAds(ads);
        toast({
          title: "Meta Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`,
        });
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate Meta ads. Please try again.",
      });
    }
  };

  return { handleGenerateMetaAds };
};
