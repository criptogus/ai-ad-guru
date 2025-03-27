
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    setIsGenerating(true);
    setLastError(null);
    
    try {
      console.log("Generating image with prompt:", prompt);
      
      if (!prompt || prompt.trim() === '') {
        throw new Error("Image prompt cannot be empty");
      }

      // Request the image generation
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          platform: additionalInfo?.platform || 'meta',
          style: additionalInfo?.style || 'professional'
        }
      });

      if (error) {
        console.error("Error generating image:", error);
        throw error;
      }

      if (!data || !data.image) {
        throw new Error("No image data returned from the generation service");
      }

      console.log("Image generated successfully");
      return data.image;
    } catch (error) {
      console.error("Error in generateAdImage:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
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

  return {
    generateAdImage,
    isGenerating,
    lastError
  };
};
