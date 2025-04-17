
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { checkUserCredits, deductUserCredits } from "@/services/credits/creditChecks";
import { getCreditCost } from "@/services/credits/creditCosts";
import { toast } from "sonner";

export const useCampaignCreation = (
  user: any,
  campaignData: any,
  googleAds: GoogleAd[],
  metaAds: MetaAd[] 
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreditCheckPending, setIsCreditCheckPending] = useState(false);

  const calculateRequiredCredits = () => {
    let totalCredits = 0;
    
    // Base credit cost for campaign type
    const platformCredits = campaignData.platforms?.includes('google') 
      ? getCreditCost('googleAds') 
      : 0;
    
    totalCredits += platformCredits;
    
    // Add credits for Meta ads if any
    if (metaAds.length > 0) {
      totalCredits += getCreditCost('metaAds');
      
      // Add image generation credits for ads with images
      const adsWithImages = metaAds.filter(ad => ad.imageUrl || ad.imagePrompt);
      if (adsWithImages.length > 0) {
        totalCredits += adsWithImages.length * getCreditCost('imageGeneration');
      }
    }
    
    return totalCredits;
  };

  const createCampaign = async () => {
    if (!user || !campaignData) return;
    
    setIsCreating(true);
    setIsCreditCheckPending(true);

    try {
      // Calculate required credits
      const requiredCredits = calculateRequiredCredits();
      
      // Check if user has enough credits
      const creditCheck = await checkUserCredits(user.id, 'googleAds', 1);
      setIsCreditCheckPending(false);
      
      if (!creditCheck.hasEnough) {
        setIsCreating(false);
        // Navigate to billing page with information about required credits
        navigate('/billing', { 
          state: { 
            from: 'campaign', 
            requiredCredits: creditCheck.deficit
          } 
        });
        return;
      }

      // Deduct credits for campaign creation
      const creditSuccess = await deductUserCredits(
        user.id,
        'googleAds',
        'Campaign Creation',
        `Campaign: ${campaignData.name}`
      );
      
      if (!creditSuccess) {
        setIsCreating(false);
        toast({
          title: "Credit Error",
          description: "Failed to deduct credits. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // If there are image ads, deduct credits for each image
      if (metaAds.some(ad => ad.imageUrl || ad.imagePrompt)) {
        const imageAdsCount = metaAds.filter(ad => ad.imageUrl || ad.imagePrompt).length;
        await deductUserCredits(
          user.id,
          'imageGeneration',
          'Image Generation',
          `Campaign: ${campaignData.name}`,
          imageAdsCount
        );
      }

      // Insert campaign with 10% fee acknowledgment
      const { data, error } = await supabase
        .from('campaigns')
        .insert([
          {
            user_id: user.id,
            name: campaignData.name,
            description: campaignData.description,
            target_audience: campaignData.targetAudience,
            platform: campaignData.platform || campaignData.platforms?.join(','),
            budget: campaignData.budget,
            budget_type: campaignData.budgetType,
            start_date: campaignData.startDate,
            end_date: campaignData.endDate,
            objective: campaignData.objective,
            website_url: campaignData.websiteUrl,
            google_ads: googleAds,
            meta_ads: metaAds,
            status: 'active',
            fee_acknowledged: true, // User acknowledges the 10% platform fee
            optimization_frequency: campaignData.optimizationFrequency || 'weekly'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully",
      });

      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Campaign Creation Failed",
        description: "There was an error creating your campaign",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCampaign,
    isCreating,
    isCreditCheckPending,
    calculateRequiredCredits
  };
};
