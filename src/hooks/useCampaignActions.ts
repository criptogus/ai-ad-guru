
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/useAdGeneration";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CustomUser } from "@/types/auth";

export const useCampaignActions = (
  user: CustomUser | null,
  campaignData: any,
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  metaAds: MetaAd[],
  generateGoogleAds: (campaignData: WebsiteAnalysisResult) => Promise<GoogleAd[] | null>,
  generateMetaAds: (campaignData: WebsiteAnalysisResult) => Promise<MetaAd[] | null>,
  generateAdImage: (prompt: string) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleAnalyzeWebsite = async (url: string, analyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>) => {
    const result = await analyzeWebsite(url);
    if (result) {
      setCampaignData((prev: any) => ({
        ...prev,
        websiteUrl: url,
        businessInfo: result,
      }));
    }
    return result;
  };

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) return;
    
    const ads = await generateGoogleAds(analysisResult);
    if (ads) {
      setCampaignData((prev: any) => ({
        ...prev,
        googleAds: ads,
      }));
    }
  };

  const handleGenerateMetaAds = async () => {
    if (!analysisResult) return;
    
    const ads = await generateMetaAds(analysisResult);
    if (ads) {
      setCampaignData((prev: any) => ({
        ...prev,
        metaAds: ads,
      }));
    }
  };

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!metaAds || metaAds.length === 0) return;
    
    const imageUrl = await generateAdImage(ad.imagePrompt);
    if (imageUrl) {
      // Update the Meta ad with the generated image URL
      const updatedAds = [...metaAds];
      updatedAds[index] = {
        ...updatedAds[index],
        imageUrl,
      };
      
      // Update state
      setCampaignData((prev: any) => ({
        ...prev,
        metaAds: updatedAds,
      }));
    }
  };

  const createCampaign = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a campaign",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare campaign data
      const newCampaign = {
        user_id: user.id,
        name: campaignData.name,
        platform: campaignData.platform,
        budget: campaignData.budget,
        budget_type: campaignData.budgetType,
        status: 'draft',
      };
      
      // Insert campaign into database
      const { data: createdCampaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert(newCampaign)
        .select()
        .single();
      
      if (campaignError) {
        console.error('Error creating campaign:', campaignError);
        toast({
          title: "Campaign Creation Failed",
          description: campaignError.message || "Failed to create campaign",
          variant: "destructive",
        });
        return;
      }
      
      // Deduct credits from user
      const { error: creditsError } = await supabase
        .from('profiles')
        .update({ credits: (user.credits || 0) - 5 })
        .eq('id', user.id);
      
      if (creditsError) {
        console.error('Error updating credits:', creditsError);
      }
      
      toast({
        title: "Campaign Created Successfully",
        description: "Your campaign has been created and 5 credits have been deducted from your account",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Campaign Creation Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    handleAnalyzeWebsite,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage,
    createCampaign
  };
};
