
import { useToast } from '@/hooks/use-toast';
import { MetaAd } from '@/hooks/adGeneration/types';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

interface UseGenerateLinkedInAdsHandlerProps {
  setLinkedInAds: (ads: MetaAd[]) => void;
  analysisResult?: WebsiteAnalysisResult | null;
  generateLinkedInAds?: (analysisResult: any) => Promise<MetaAd[] | null>;
}

export const useGenerateLinkedInAdsHandler = ({
  setLinkedInAds,
  analysisResult,
  generateLinkedInAds,
}: UseGenerateLinkedInAdsHandlerProps) => {
  const { toast } = useToast();

  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult || !generateLinkedInAds || !setLinkedInAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads.",
      });
      return;
    }
    try {
      const ads = await generateLinkedInAds(analysisResult);
      if (ads && ads.length > 0) {
        setLinkedInAds(ads);
        toast({
          title: "LinkedIn Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`,
        });
      }
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate LinkedIn ads. Please try again.",
      });
    }
  };

  return { handleGenerateLinkedInAds };
};
