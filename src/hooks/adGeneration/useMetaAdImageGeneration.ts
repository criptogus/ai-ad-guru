
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { generateMetaAdImage, MetaAdImageParams, GeneratedMetaAdImage } from '@/services/media/metaAdImageGenerator';
import { storeAIResult } from '@/services/ai/aiResultsStorage';

export interface UseMetaAdImageGenerationResult {
  generateImage: (params: Omit<MetaAdImageParams, 'userId'>) => Promise<GeneratedMetaAdImage | null>;
  isGenerating: boolean;
  lastGenerated: GeneratedMetaAdImage | null;
  error: string | null;
}

export const useMetaAdImageGeneration = (): UseMetaAdImageGenerationResult => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<GeneratedMetaAdImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateImage = async (params: Omit<MetaAdImageParams, 'userId'>): Promise<GeneratedMetaAdImage | null> => {
    if (isGenerating) {
      toast({
        title: "Already generating an image",
        description: "Please wait for the current generation to complete",
        variant: "destructive"
      });
      return null;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Ensure we have a user ID
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Add user ID to params
      const fullParams: MetaAdImageParams = {
        ...params,
        userId: user.id
      };
      
      console.log("Generating Meta ad image with params:", {
        basePrompt: fullParams.basePrompt.substring(0, 50) + "...",
        format: fullParams.format,
        style: fullParams.style,
        industry: fullParams.industry,
        brandName: fullParams.brandName
      });
      
      // Show toast notification
      toast({
        title: "Generating Meta ad image",
        description: "This may take 15-30 seconds...",
      });
      
      // Generate the image
      const result = await generateMetaAdImage(fullParams);
      
      if (!result) {
        throw new Error("Failed to generate image");
      }
      
      // Update state with the generated image
      setLastGenerated(result);
      
      // Store the AI result
      await storeAIResult(user.id, {
        input: result.originalPrompt,
        response: {
          imageUrl: result.url,
          enhancedPrompt: result.prompt,
          format: result.format
        },
        type: 'meta_ad_image_generation',
        metadata: {
          format: fullParams.format,
          style: fullParams.style,
          industry: fullParams.industry,
          brandName: fullParams.brandName,
          timestamp: result.timestamp
        }
      });
      
      // Show success toast
      toast({
        title: "Meta ad image generated",
        description: "5 credits were used for this AI-powered image generation",
        variant: "default"
      });
      
      return result;
    } catch (error) {
      console.error("Error in generateMetaAdImage:", error);
      
      // Set error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      
      // Show error toast
      toast({
        title: "Failed to generate image",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateImage,
    isGenerating,
    lastGenerated,
    error
  };
};
