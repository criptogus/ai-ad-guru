
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
    if (!analysisResult || !generateGoogleAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads.",
      });
      return;
    }
    
    // Credit cost information
    const creditCost = 5; // 5 credits for Google Ads
    
    try {
      setIsGenerating(true);
      
      // Show credit usage notification
      toast({
        title: "Credits Usage",
        description: `Generating Google Ads will use ${creditCost} credits.`,
      });
      
      const ads = await generateGoogleAds(analysisResult);
      
      if (ads && ads.length > 0) {
        setGoogleAds(ads);
        
        // Deduct credits
        if (onCreditDeduction) {
          onCreditDeduction(creditCost);
        }
        
        toast({
          title: "Google Ads Generated",
          description: `Successfully created ${ads.length} ad variations for ${creditCost} credits.`,
        });
      } else {
        toast({
          variant: "default",
          title: "No Ads Generated",
          description: "No ads were generated. Try adjusting your campaign details.",
        });
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate Google ads. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerateGoogleAds, isGenerating };
};
