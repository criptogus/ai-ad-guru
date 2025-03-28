
import { useState } from 'react';
import { toast } from 'sonner';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { GoogleAd } from '@/hooks/adGeneration';

export const useMicrosoftAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  microsoftAds: GoogleAd[],
  generateMicrosoftAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult) {
      toast.error("Website analysis required before generating ads");
      return;
    }

    try {
      setIsGenerating(true);
      
      // Get the Microsoft mind trigger if available
      const mindTrigger = analysisResult.campaignData?.mindTriggers?.microsoft || '';
      
      console.log("Generating Microsoft ads with trigger:", mindTrigger);
      const generatedAds = await generateMicrosoftAds(analysisResult, mindTrigger);
      
      if (generatedAds) {
        toast.success(`Generated ${generatedAds.length} Microsoft ad variations`);
        
        // Update campaign data with the new ads
        setCampaignData(prev => ({
          ...prev,
          microsoftAds: generatedAds
        }));
      } else {
        toast.error("Failed to generate Microsoft ads");
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
      toast.error("An error occurred while generating Microsoft ads");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleGenerateMicrosoftAds,
    isGenerating
  };
};
