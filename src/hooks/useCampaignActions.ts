
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export const useCampaignActions = (
  user: any,
  campaignData: any,
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  metaAds: MetaAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>,
  generateAdImage: (prompt: string) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Handle page transitions
  const handleAnalyzeWebsite = async (url: string) => {
    // Analysis logic is in useWebsiteAnalysis hook
    return null;
  };

  // Generate Google ads
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please analyze your website first",
        variant: "destructive",
      });
      return;
    }

    console.log("Generating Google ads with analysis result:", analysisResult);
    const ads = await generateGoogleAds(analysisResult);
    console.log("Generated Google ads:", ads);
    
    if (ads && ads.length > 0) {
      // Update campaign data with generated ads
      setCampaignData(prev => ({
        ...prev,
        googleAds: ads
      }));
      
      toast({
        title: "Google Ads Generated",
        description: `Successfully created ${ads.length} ad variations. The first ad will be used initially and automatically optimized based on performance.`,
      });
    } else {
      toast({
        title: "Ad Generation Failed",
        description: "Unable to generate Google ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate Meta ads
  const handleGenerateMetaAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please analyze your website first",
        variant: "destructive",
      });
      return;
    }

    console.log("Generating Meta ads with analysis result:", analysisResult);
    const ads = await generateMetaAds(analysisResult);
    console.log("Generated Meta ads:", ads);
    
    if (ads && ads.length > 0) {
      // Update campaign data with generated ads
      setCampaignData(prev => ({
        ...prev,
        metaAds: ads
      }));
      
      toast({
        title: "Meta Ads Generated",
        description: `Successfully created ${ads.length} ad variations. Generating images will make them more effective.`,
      });
    } else {
      toast({
        title: "Ad Generation Failed",
        description: "Unable to generate Meta ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate image for Meta ad
  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) {
      toast({
        title: "Image Prompt Required",
        description: "Please provide an image prompt",
        variant: "destructive",
      });
      return;
    }

    console.log("Generating image for ad:", ad);
    console.log("With prompt:", ad.imagePrompt);
    
    try {
      const imageUrl = await generateAdImage(ad.imagePrompt);
      console.log("Generated image URL:", imageUrl);
      
      if (imageUrl) {
        // Create a new MetaAd object with the updated imageUrl
        const updatedAd: MetaAd = { ...ad, imageUrl };
        console.log("Updated ad with image:", updatedAd);
        
        // Create a new array with the updated ad
        const updatedAds = [...metaAds];
        updatedAds[index] = updatedAd;
        
        // Update both the Meta ads array and the campaign data
        setCampaignData(prev => {
          console.log("Updating campaign data with new Meta ads:", updatedAds);
          return {
            ...prev,
            metaAds: updatedAds
          };
        });
        
        toast({
          title: "Image Generated",
          description: "Ad image was successfully created",
        });
        
        return updatedAd;
      } else {
        throw new Error("Image generation returned null");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

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
    handleAnalyzeWebsite,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage,
    createCampaign,
    isCreating
  };
};
