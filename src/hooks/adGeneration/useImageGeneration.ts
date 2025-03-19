
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    if (!prompt) {
      const errorMessage = "Please provide a description for the image you want to generate";
      console.error('No prompt provided for image generation');
      setLastError(errorMessage);
      toast({
        title: "Missing Prompt",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }

    setIsGenerating(true);
    setLastError(null);
    
    try {
      console.log('Generating image with prompt:', prompt);
      console.log('Additional context:', additionalInfo);
      
      // Include additional context in the function call
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt,
          ...additionalInfo
        },
      });

      if (error) {
        console.error('Error generating image:', error);
        const errorMessage = error.message || "Service error while generating image";
        setLastError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.success) {
        console.error('Image generation failed:', data.error);
        const errorMessage = data.error || "Failed to generate image";
        setLastError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.imageUrl) {
        console.error('No image URL returned from function');
        const errorMessage = "No image URL returned";
        setLastError(errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Image generated successfully, URL:', data.imageUrl);
      
      // Inform the user about credit usage (5 credits for Instagram ad image)
      toast({
        title: "Image Generated Successfully",
        description: "5 credits have been used for this Instagram ad image",
        duration: 3000,
      });
      
      return data.imageUrl;
    } catch (error) {
      console.error('Error calling generate-image function:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      setLastError(errorMessage);
      toast({
        title: "Image Generation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
      throw error; // Re-throw to allow component-level handling
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAdImage,
    isGenerating,
    lastError,
    clearError: () => setLastError(null)
  };
};
