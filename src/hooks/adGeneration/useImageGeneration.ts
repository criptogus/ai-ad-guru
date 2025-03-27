
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

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
        console.log("Calling generate-image function with prompt:", enhancedPrompt.substring(0, 100) + "...");
        
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { prompt: enhancedPrompt }
        });

        if (error) {
          console.error("Error invoking generate-image function:", error);
          setLastError(error.message || "Error generating image");
          throw error;
        }

        if (!data || !data.imageUrl) {
          console.error("Invalid response from generate-image function:", data);
          throw new Error("No image URL returned from image generation");
        }

        // If this was a fallback image, inform the user
        if (data.fallback) {
          toast("Using Placeholder Image", {
            description: "We're using a placeholder image due to temporary connection issues.",
          });
        }

        // Return the URL of the generated image
        return data.imageUrl;
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        
        // Return a placeholder image as a fallback
        toast("Using Placeholder Image", {
          description: "We're using a placeholder image due to temporary connection issues.",
        });
        
        return "https://placehold.co/1024x1024/3B82F6/FFFFFF/png?text=Instagram+Ad";
      }
    } catch (error) {
      console.error("Image generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setLastError(errorMessage);
      
      toast("Using Placeholder Image", {
        description: "We're using a placeholder image instead due to a temporary issue.",
      });
      
      // Return a placeholder image as a fallback
      return "https://placehold.co/1024x1024/3B82F6/FFFFFF/png?text=Instagram+Ad";
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
