
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

export const useAdGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  metaAds: MetaAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>,
  generateAdImage: (prompt: string) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);

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
  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    setImageGenerationError(null);
    
    if (!ad.imagePrompt) {
      setImageGenerationError("Image prompt is required");
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
      } else {
        throw new Error("Image generation returned null");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setImageGenerationError(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to allow component-level handling
    }
  };

  return {
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError: () => setImageGenerationError(null)
  };
};
