
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    setIsGenerating(true);
    setLastError(null);
    
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

      // Add error handling for edge function call
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { prompt: enhancedPrompt }
        });

        if (error) {
          console.error("Error invoking generate-image function:", error);
          setLastError(error.message || "Error generating image");
          throw error;
        }

        if (!data || !data.imageUrl) {
          throw new Error("No image URL returned from image generation");
        }

        // Return the URL of the generated image
        return data.imageUrl;
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Edge function error: ${functionError.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Image generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setLastError(errorMessage);
      toast({
        title: "Failed to generate image",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAdImage,
    isGenerating,
    lastError
  };
};
