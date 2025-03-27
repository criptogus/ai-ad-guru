
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    if (!prompt) {
      const error = "Missing Image Prompt";
      setLastError(error);
      toast({
        title: "Missing Image Prompt",
        description: "An image prompt is required to generate an image",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsGenerating(true);
      setLastError(null);
      
      console.log("Generating image with prompt:", prompt);
      
      // Enhanced image prompt with platform-specific details
      const platform = additionalInfo?.platform || 'meta';
      const enhancedPrompt = enhanceImagePrompt(prompt, platform, additionalInfo?.style);
      
      console.log("Enhanced prompt:", enhancedPrompt);

      // Call the image generation edge function
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: enhancedPrompt,
          platform,
          style: additionalInfo?.style || 'photorealistic'
        },
      });

      if (error) {
        console.error("Error generating image:", error);
        const errorMessage = error.message || "Failed to generate image";
        setLastError(errorMessage);
        toast({
          title: "Image Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      }

      if (!data.imageUrl) {
        const errorMessage = "No image URL returned";
        setLastError(errorMessage);
        console.error(errorMessage);
        toast({
          title: "Image Generation Failed",
          description: "No image was generated. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Image generated successfully");
      toast({
        title: "Image Generated",
        description: "Image was successfully created",
      });
      
      return data.imageUrl;
    } catch (error) {
      console.error("Error in generateAdImage:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setLastError(errorMessage);
      toast({
        title: "Image Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Enhance an image prompt with platform-specific details and quality improvements
   */
  const enhanceImagePrompt = (prompt: string, platform: string, style?: string): string => {
    let enhancedPrompt = prompt;
    
    // Don't add extra context if the prompt already seems detailed
    if (prompt.length < 100) {
      // Add platform-specific context
      if (platform === 'meta' || platform === 'instagram') {
        enhancedPrompt += ' Create a vibrant, attention-grabbing image suitable for Instagram. Square format, 1:1 ratio.';
      } else if (platform === 'linkedin') {
        enhancedPrompt += ' Create a professional, business-oriented image suitable for LinkedIn. Clean, corporate style.';
      }
      
      // Add style information if provided
      if (style) {
        enhancedPrompt += ` Style: ${style}.`;
      }
      
      // Add general quality improvements
      enhancedPrompt += ' High quality, detailed, well-composed.';
    }
    
    return enhancedPrompt;
  };

  return {
    generateAdImage,
    isGenerating,
    lastError
  };
};
