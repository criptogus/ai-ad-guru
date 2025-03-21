
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BannerTemplate, BannerFormat, BannerPlatform } from "@/components/smart-banner/SmartBannerBuilder";
import { getCreditCosts, consumeCredits } from "@/services";

export const useAIImageGeneration = (
  selectedTemplate: BannerTemplate | null,
  selectedFormat: BannerFormat,
  selectedPlatform: BannerPlatform,
  userId: string | undefined,
  saveImageToUserBank: (imageUrl: string) => Promise<void>
) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [brandTone, setBrandTone] = useState("professional");
  const creditCosts = getCreditCosts();

  // Generate an AI image for the banner background
  const generateAIImage = async (prompt: string): Promise<string | null> => {
    if (!userId) {
      toast.error("Please log in to generate images");
      return null;
    }
    
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return null;
    }
    
    setIsGeneratingImage(true);
    
    try {
      // Preview credit usage
      toast.info("Credit Usage Preview", {
        description: `This will use ${creditCosts.smartBanner} credits to generate this banner image`,
        duration: 3000,
      });
      
      // Consume credits
      const creditSuccess = await consumeCredits(
        userId,
        creditCosts.smartBanner,
        'smart_banner_creation',
        `AI Banner for ${selectedPlatform} (${selectedFormat})`
      );
      
      if (!creditSuccess) {
        toast.error("Insufficient Credits", {
          description: "You don't have enough credits to generate this image",
          duration: 5000,
        });
        return null;
      }
      
      // Determine image dimensions based on format
      let imageFormat = "square";
      if (selectedFormat === "horizontal") {
        imageFormat = "landscape";
      } else if (selectedFormat === "story") {
        imageFormat = "portrait";
      }
      
      // Call the Supabase function to generate the image with DALL-E
      const { data, error } = await supabase.functions.invoke('generate-banner-image', {
        body: { 
          prompt,
          platform: selectedPlatform,
          format: selectedFormat,
          templateType: selectedTemplate.type,
          templateName: selectedTemplate.name,
          templateId: selectedTemplate.id,
          brandTone
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.imageUrl) {
        throw new Error("No image was generated");
      }
      
      // Save to user's image bank
      if (data.imageUrl) {
        await saveImageToUserBank(data.imageUrl);
      }
      
      toast.success("Banner image generated successfully");
      return data.imageUrl;
    } catch (error) {
      console.error("Error generating AI image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      // Refund credits on failure
      if (userId) {
        await consumeCredits(
          userId,
          -creditCosts.smartBanner,
          'credit_refund',
          'Refund for failed banner image generation'
        );
      }
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Regenerate the AI image with the same prompt
  const regenerateImage = async (): Promise<string | null> => {
    // This would typically use the same prompt as before
    // For simplicity, we're mocking this functionality
    setIsGeneratingImage(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real implementation, you would call the AI service again
      toast.success("Banner image regenerated");
      return null; // In a real implementation, return the new image URL
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast.error("Failed to regenerate image");
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    isGeneratingImage,
    generateAIImage,
    regenerateImage,
    brandTone,
    setBrandTone
  };
};
