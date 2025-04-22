
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAd } from '@/hooks/adGeneration/types';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

interface UseGenerateGoogleAdsHandlerProps {
  setGoogleAds: (ads: GoogleAd[]) => void;
  analysisResult?: WebsiteAnalysisResult | null;
  generateGoogleAds?: (analysisResult: WebsiteAnalysisResult) => Promise<GoogleAd[] | null>;
  onCreditDeduction?: (amount: number) => void;
}

export const useGenerateGoogleAdsHandler = ({
  setGoogleAds,
  analysisResult,
  generateGoogleAds,
  onCreditDeduction,
}: UseGenerateGoogleAdsHandlerProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateGoogleAds = async () => {
    // Validate required data before proceeding
    if (!analysisResult || !generateGoogleAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads.",
      });
      return;
    }

    // Define credit cost for Google Ads generation
    const creditCost = 5;

    try {
      setIsGenerating(true);

      // Inform user about credit usage
      toast({
        title: "Credits Usage",
        description: `This operation will use ${creditCost} credits.`,
      });

      // Generate ads using website analysis
      const ads = await generateGoogleAds(analysisResult);
      console.log("🧪 Ads received:", ads);

      // Handle successful ad generation
      if (ads && ads.length > 0) {
        console.log("🧪 First ad sample:", ads[0]);
        setGoogleAds(ads);

        // Deduct credits if handler is provided
        if (onCreditDeduction) {
          onCreditDeduction(creditCost);
        }

        // Notify user about successful generation
        toast({
          title: "Google Ads Generated",
          description: `Successfully generated ${ads.length} ad(s) using ${creditCost} credits.`,
        });
      } else {
        // Handle case when no ads are generated
        toast({
          variant: "default",
          title: "No Ads Generated",
          description: "Try changing your campaign input. No ads were returned.",
        });
      }
    } catch (error) {
      console.error("Error generating Google Ads:", error);
      // Provide detailed error message
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error 
          ? error.message 
          : "Unknown error occurred during ad generation.",
      });
    } finally {
      // Always reset generating state
      setIsGenerating(false);
    }
  };

  return { handleGenerateGoogleAds, isGenerating };
};
