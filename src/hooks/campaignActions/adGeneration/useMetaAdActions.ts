
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import { toast } from "sonner";

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateMetaAds: (campaignData: any, mindTrigger?: string) => Promise<MetaAd[] | null>,
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateMetaAds = async () => {
    if (!analysisResult) {
      toast("Website analysis required", {
        description: "Please analyze a website before generating ads"
      });
      return;
    }

    try {
      setIsGenerating(true);

      // Get the mind trigger from the campaign data
      const mindTrigger = (window as any).campaignContext?.campaignData?.mindTriggers?.meta || "";
      
      console.log("Generating Meta ads with mind trigger:", mindTrigger);
      const ads = await generateMetaAds(analysisResult, mindTrigger);

      if (!ads || ads.length === 0) {
        throw new Error("Failed to generate Instagram ads");
      }

      // Update campaign data with the generated ads
      setCampaignData((prev: any) => ({
        ...prev,
        metaAds: ads,
      }));

      toast("Instagram Ads Generated", {
        description: `${ads.length} ad variations created. 5 credits used.`
      });

    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast("Ad Generation Failed", {
        description: error instanceof Error ? error.message : "Failed to generate Instagram Ads. Please check network connection and try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) {
      toast("Image Prompt Required", {
        description: "Please provide an image prompt first"
      });
      return;
    }

    try {
      setLoadingImageIndex(index);
      
      const additionalInfo = {
        companyName: analysisResult?.companyName,
        targetAudience: analysisResult?.targetAudience,
        uniqueSellingPoints: analysisResult?.uniqueSellingPoints,
        platform: "instagram"
      };
      
      console.log("Generating image with prompt:", ad.imagePrompt);
      const imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
      
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }
      
      // Update the ad with the generated image URL
      const updatedAds = [...metaAds];
      updatedAds[index] = { ...ad, imageUrl };
      
      setCampaignData((prev: any) => ({
        ...prev,
        metaAds: updatedAds,
      }));
      
      toast("Image Generated", {
        description: "Instagram ad image generated successfully. 5 credits used."
      });
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast("Image Generation Failed", {
        description: error instanceof Error ? error.message : "Failed to generate image. Please check network connection and try again."
      });
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateMetaAds,
    handleGenerateImage,
    isGenerating,
    loadingImageIndex,
  };
};
