
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      // Use a more descriptive prompt for the image generation
      let enhancedPrompt = prompt;
      
      if (additionalInfo?.platform) {
        if (additionalInfo.platform === 'meta' || additionalInfo.platform === 'instagram') {
          enhancedPrompt += `. Create a high-quality, Instagram-style image optimized for social media. Make sure the image is visually striking and would stop users from scrolling.`;
        } else if (additionalInfo.platform === 'linkedin') {
          enhancedPrompt += `. Create a professional, business-appropriate image for LinkedIn. Ensure it has a corporate feel and would appeal to business professionals.`;
        }
      }
      
      // Add style guidance
      enhancedPrompt += ` The image should be high-quality, well-composed, and visually appealing with good lighting and composition. No text overlay needed.`;

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: enhancedPrompt }
      });

      if (error) {
        console.error("Error generating image:", error);
        throw error;
      }

      // Return the URL of the generated image
      return data.imageUrl;
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Failed to generate image",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAdImage,
    isGenerating
  };
};
