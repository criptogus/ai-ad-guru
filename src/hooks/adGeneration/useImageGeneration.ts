
import { useState } from 'react';
import { useCredits } from '@/contexts/CreditsContext';
import { toast } from 'sonner';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deductCredits } = useCredits();

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    if (!prompt) {
      setError("Image prompt is required");
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Generating image with prompt:", prompt);
      console.log("Additional info:", additionalInfo);

      // In a real implementation, we'd call the Supabase function here
      // For now, generate a mock image URL
      // In production, this would call DALL-E or another AI image generation service
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a placeholder image URL (using placeholder.com)
      const imageFormat = additionalInfo?.imageFormat || 'square';
      let dimensions = '1000x1000';
      
      if (imageFormat === 'portrait') {
        dimensions = '1000x1200';
      } else if (imageFormat === 'landscape') {
        dimensions = '1200x1000';
      }
      
      // For testing, return a placeholder image
      const imageUrl = `https://via.placeholder.com/${dimensions}?text=${encodeURIComponent(prompt.substring(0, 20))}`;
      
      // Apply credit deduction if available
      if (deductCredits) {
        // Standard cost for image generation is 5 credits
        deductCredits(5);
        toast.success("Image Generated", {
          description: "5 credits used for AI image generation"
        });
      }
      
      console.log("Generated image URL:", imageUrl);
      return imageUrl;
    } catch (err) {
      console.error("Error generating image:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      
      toast.error("Failed to generate image", {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAdImage,
    isGenerating,
    error
  };
};
