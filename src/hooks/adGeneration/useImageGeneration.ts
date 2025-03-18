
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      console.log('Generating image with prompt:', prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) {
        console.error('Error generating image:', error);
        toast({
          title: "Image Generation Failed",
          description: error.message || "Failed to generate image",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        console.error('Image generation failed:', data.error);
        toast({
          title: "Image Generation Failed",
          description: data.error || "Failed to generate image",
          variant: "destructive",
        });
        return null;
      }

      console.log('Image generated successfully:', data.imageUrl);
      return data.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Image Generation Failed",
        description: "An unexpected error occurred",
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
