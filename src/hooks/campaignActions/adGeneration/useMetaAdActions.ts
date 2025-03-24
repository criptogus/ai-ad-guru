
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonerToast } from 'sonner';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { MetaAd } from '@/hooks/adGeneration';
import { getCreditCosts } from '@/services';
import { checkUserCredits, deductUserCredits } from '@/services/credits/creditChecks';
import { useAuth } from '@/contexts/AuthContext';

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateMetaAds: (campaignData: any) => Promise<any>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const creditCosts = getCreditCosts();

  // Generate Meta Ads
  const handleGenerateMetaAds = async (): Promise<void> => {
    if (isGenerating) return;
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please analyze a website first before generating ads",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate ads",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough credits
    const metaAdCost = creditCosts.metaAdGeneration || 5; // Fallback to 5 if not defined
    const hasCredits = await checkUserCredits(user.id, metaAdCost);
    
    if (!hasCredits) {
      sonerToast.error("Insufficient Credits", {
        description: `You need ${metaAdCost} credits to generate Instagram ads`,
        duration: 5000,
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Show credit usage preview
      sonerToast.info("Credit Usage Preview", {
        description: `This will use ${metaAdCost} credits to generate Instagram ad suggestions`,
        duration: 3000,
      });
      
      console.log("Generating Meta ads with analysis result:", analysisResult);
      const generatedAds = await generateMetaAds(analysisResult);
      
      if (generatedAds && generatedAds.length > 0) {
        // Actually consume credits after successful generation
        const creditSuccess = await deductUserCredits(
          user.id,
          metaAdCost,
          'meta_ad_generation',
          'Instagram ad generation'
        );
        
        if (!creditSuccess) {
          console.error("Failed to deduct credits but ads were generated");
        }
        
        // Update campaign data with the generated Meta ads
        setCampaignData(prev => ({
          ...prev,
          metaAds: generatedAds
        }));
        
        sonerToast.success("Instagram Ads Generated", {
          description: `${generatedAds.length} ads created using ${metaAdCost} credits`,
          duration: 3000,
        });
      } else {
        sonerToast.error("Generation Failed", {
          description: "Failed to generate Instagram ads. Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast({
        title: "Generation Error",
        description: "An error occurred while generating Instagram ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleGenerateMetaAds,
    isGenerating
  };
};
