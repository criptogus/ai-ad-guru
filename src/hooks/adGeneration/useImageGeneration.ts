
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string): Promise<string | null> => {
    if (!prompt) {
      console.error('No prompt provided for image generation');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating image with prompt:', prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) {
        console.error('Error generating image:', error);
        throw error;
      }

      if (!data.success) {
        console.error('Image generation failed:', data.error);
        throw new Error(data.error || "Failed to generate image");
      }

      if (!data.imageUrl) {
        console.error('No image URL returned from function');
        throw new Error("No image URL returned");
      }

      console.log('Image generated successfully, URL:', data.imageUrl);
      return data.imageUrl;
    } catch (error) {
      console.error('Error calling generate-image function:', error);
      toast({
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
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
  };
};
