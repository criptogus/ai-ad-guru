
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
      
      // Determine which type of placeholder to use based on platform and format
      const platform = additionalInfo?.platform || 'instagram';
      const imageFormat = additionalInfo?.imageFormat || additionalInfo?.format || 'square';
      
      // Generate dimensions based on format
      let dimensions = '1000x1000';
      
      if (imageFormat === 'portrait' || imageFormat === 'story') {
        dimensions = '1000x1200';
      } else if (imageFormat === 'landscape') {
        dimensions = '1200x1000';
      }
      
      // For testing, generate a more realistic placeholder using appropriate dimensions and colors
      const imageUrl = `https://via.placeholder.com/${dimensions}/${getPlatformColor(platform)}/FFFFFF?text=${encodeURIComponent(getShortPrompt(prompt))}`;
      
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

  // Helper to get platform-specific colors for placeholders
  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'instagram':
      case 'meta':
        return 'E4405F'; // Instagram red/pink
      case 'linkedin':
        return '0A66C2'; // LinkedIn blue
      case 'google':
        return '4285F4'; // Google blue
      case 'microsoft':
        return '00A4EF'; // Microsoft blue
      default:
        return '333333'; // Default dark gray
    }
  };
  
  // Helper to create a shortened prompt for the placeholder
  const getShortPrompt = (prompt: string): string => {
    const words = prompt.split(' ');
    if (words.length <= 3) return prompt;
    return words.slice(0, 3).join(' ') + '...';
  };

  return {
    generateAdImage,
    isGenerating,
    error
  };
};
