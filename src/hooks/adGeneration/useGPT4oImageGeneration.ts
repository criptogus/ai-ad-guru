import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { storeAIResult } from '@/services/ai/aiResultsStorage';

export interface UseGPT4oImageGenerationReturn {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | any>;
  isGenerating: boolean;
  error: string | null;
}

export const useGPT4oImageGeneration = (): UseGPT4oImageGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateAdImage = async (
    prompt: string, 
    additionalInfo?: any
  ): Promise<string | any> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating image with prompt:", prompt.substring(0, 100) + "...");
      console.log("With additional info:", additionalInfo ? JSON.stringify(additionalInfo).substring(0, 100) + "..." : "none");
      
      // Determine platform from additionalInfo or use default
      const platform = additionalInfo?.platform || 'meta';
      // Determine format from additionalInfo or use default
      const format = additionalInfo?.imageFormat || additionalInfo?.format || 'feed';
      
      // Call the generate-image-gpt4o edge function
      const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
        body: { 
          imagePrompt: prompt,
          platform: platform,
          format: format,
          adContext: additionalInfo // Pass all additional info as context
        }
      });
      
      if (error) {
        console.error("Error calling generate-image-gpt4o edge function:", error);
        setError(error.message || "Failed to call image generation service");
        throw error;
      }
      
      if (!data || !data.success || !data.imageUrl) {
        console.error("No image URL returned from function:", data);
        const errorMessage = "Failed to generate image";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      const imageUrl = data.imageUrl;
      console.log("Successfully generated image:", imageUrl.substring(0, 50) + "...");
      
      // Store the AI result if user is logged in
      if (user?.id) {
        await storeAIResult(user.id, {
          input: prompt,
          response: {
            imageUrl: imageUrl,
            platform,
            format
          },
          type: 'image_generation',
          metadata: additionalInfo
        });
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error in generateAdImage:", error);
      
      // Set error message for UI display
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      
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
    isGenerating,
    error
  };
};
