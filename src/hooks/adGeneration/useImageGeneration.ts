
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string, platform: string = 'meta'): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating image with prompt:", prompt.substring(0, 100) + "...");
      
      // Call the generate-image-gpt4o edge function
      const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
        body: { 
          imagePrompt: prompt,
          platform: platform,
          format: 'feed'
        }
      });
      
      if (error) {
        console.error("Error calling generate-image-gpt4o edge function:", error);
        throw error;
      }
      
      if (!data || !data.success || !data.imageUrl) {
        console.error("No image URL returned from function:", data);
        throw new Error("Failed to generate image");
      }
      
      console.log("Successfully generated image:", data.imageUrl.substring(0, 50) + "...");
      
      return data.imageUrl;
    } catch (error) {
      console.error("Error in generateAdImage:", error);
      
      // Return a fallback placeholder image
      return getFallbackImage(prompt);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getFallbackImage = (prompt: string): string => {
    // Return a placeholder image based on the platform
    const placeholders = [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0',
      'https://images.unsplash.com/photo-1551434678-e076c223a692',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
    ];
    
    // Use a deterministic index based on the prompt
    const index = Math.abs(prompt.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % placeholders.length;
    
    return placeholders[index];
  };

  return {
    generateAdImage,
    isGenerating
  };
};
