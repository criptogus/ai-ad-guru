
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export const useCampaignCreation = (
  user: any,
  campaignData: any,
  googleAds: GoogleAd[],
  metaAds: MetaAd[]
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Create campaign in database
  const createCampaign = async () => {
    if (!user || !campaignData) return;
    
    setIsCreating(true);

    try {
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
            status: 'active'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Deduct credits
      await supabase
        .from('profiles')
        .update({ credits: user.credits - 5 })
        .eq('id', user.id);

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
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCampaign,
    isCreating
  };
};
