
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonerToast } from 'sonner';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { MetaAd } from '@/hooks/adGeneration';
import { getCreditCosts, consumeCredits } from '@/services';
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

    setIsGenerating(true);

    try {
      // Show credit usage preview
      sonerToast.info("Credit Usage Preview", {
        description: `This will use ${creditCosts.metaAdGeneration} credits to generate Instagram ad suggestions`,
        duration: 3000,
      });
      
      // Consume credits before generating the ads
      const creditSuccess = await consumeCredits(
        user.id,
        creditCosts.metaAdGeneration,
        'meta_ad_generation',
        'Instagram ad generation'
      );
      
      if (!creditSuccess) {
        sonerToast.error("Insufficient Credits", {
          description: "You don't have enough credits for this operation",
          duration: 5000,
        });
        setIsGenerating(false);
        return;
      }

      console.log("Generating Meta ads with analysis result:", analysisResult);
      const generatedAds = await generateMetaAds(analysisResult);
      
      if (generatedAds && generatedAds.length > 0) {
        // Update campaign data with the generated Meta ads
        setCampaignData(prev => ({
          ...prev,
          metaAds: generatedAds
        }));
        
        sonerToast.success("Instagram Ads Generated", {
          description: `${generatedAds.length} ads created using ${creditCosts.metaAdGeneration} credits`,
          duration: 3000,
        });
      } else {
        // If generation failed, refund the credits
        await consumeCredits(
          user.id,
          -creditCosts.metaAdGeneration, // Negative amount for refund
          'credit_refund',
          'Refund for failed Instagram ad generation'
        );
        
        sonerToast.error("Generation Failed", {
          description: "Failed to generate Instagram ads. Your credits have been refunded.",
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
      
      // Refund credits on error
      if (user) {
        await consumeCredits(
          user.id,
          -creditCosts.metaAdGeneration,
          'credit_refund',
          'Refund for failed Instagram ad generation'
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleGenerateMetaAds,
    isGenerating
  };
};
