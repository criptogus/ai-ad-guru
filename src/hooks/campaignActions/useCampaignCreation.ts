
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { consumeCredits, getCreditCosts } from "@/services/userRoles";

export const useCampaignCreation = (
  user: any,
  campaignData: any,
  googleAds: GoogleAd[],
  metaAds: MetaAd[]
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const creditCosts = getCreditCosts();

  // Create campaign in database
  const createCampaign = async () => {
    if (!user || !campaignData) return;
    
    setIsCreating(true);

    try {
      // Calculate required credits
      const requiredCredits = creditCosts.campaignCreation;
      const hasImages = metaAds.some(ad => ad.image);
      const totalCredits = requiredCredits + (hasImages ? creditCosts.imageGeneration : 0);
      
      // First consume credits
      const creditSuccess = await consumeCredits(
        user.id,
        totalCredits,
        'campaign_creation',
        `Campaign: ${campaignData.name} - ${hasImages ? 'With images' : 'Text only'}`
      );
      
      if (!creditSuccess) {
        setIsCreating(false);
        navigate('/billing', { state: { from: 'campaign', requiredCredits: totalCredits } });
        return;
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert([
          {
            user_id: user.id,
            name: campaignData.name,
            description: campaignData.description,
            target_audience: campaignData.targetAudience,
            platform: campaignData.platform,
            budget: campaignData.budget,
            budget_type: campaignData.budgetType,
            start_date: campaignData.startDate,
            end_date: campaignData.endDate,
            objective: campaignData.objective,
            website_url: campaignData.websiteUrl,
            google_ads: googleAds,
            meta_ads: metaAds,
            status: 'active',
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

      // Navigate to campaigns page
      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Campaign Creation Failed",
        description: "There was an error creating your campaign",
        variant: "destructive",
      });
      
      // If we get here, try to refund the credits
      try {
        const requiredCredits = creditCosts.campaignCreation;
        const hasImages = metaAds.some(ad => ad.image);
        const totalCredits = requiredCredits + (hasImages ? creditCosts.imageGeneration : 0);
        
        await supabase
          .from('profiles')
          .update({ 
            credits: user.credits + totalCredits 
          })
          .eq('id', user.id);
      } catch (refundError) {
        console.error('Error refunding credits:', refundError);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCampaign,
    isCreating
  };
};
