
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { secureApi } from '@/services/api/secureApi';
import { toast } from 'sonner';
import { getCreditCost } from '@/services/credits/creditCosts';
import { consumeCredits } from '@/services/credits/creditUsage';
import { CreditAction } from '@/services/credits/types';

interface ImageGenerationConfig {
  templateId?: string;
  promptTemplate?: string;
  mainText?: string;
  subText?: string;
  companyName?: string;
  industry?: string;
  brandTone?: string;
  campaignId?: string;
}

export interface UseUserAIImageGenerationReturn {
  generateImage: (config: ImageGenerationConfig) => Promise<string | null>;
  isGenerating: boolean;
  lastError: string | null;
  lastGeneratedImageUrl: string | null;
  clearError: () => void;
}

export const useUserAIImageGeneration = (): UseUserAIImageGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastGeneratedImageUrl, setLastGeneratedImageUrl] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  const generateImage = async (config: ImageGenerationConfig): Promise<string | null> => {
    if (!user) {
      const errorMessage = "You must be logged in to generate images";
      setLastError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
    
    const { 
      templateId, 
      promptTemplate, 
      mainText, 
      subText, 
      companyName,
      industry,
      brandTone,
      campaignId 
    } = config;
    
    if (!templateId && !promptTemplate) {
      const errorMessage = "Either a template ID or prompt template is required";
      setLastError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
    
    setIsGenerating(true);
    setLastError(null);
    
    try {
      // Get credit cost for image generation
      const creditAction: CreditAction = 'imageGeneration';
      const imageCost = getCreditCost(creditAction);
      
      // Preview credit usage
      toast.info(`This will use ${imageCost} credits for image generation`);
      
      // Consume credits
      const creditSuccess = await consumeCredits(
        user.id,
        creditAction,
        imageCost,
        `AI Image Generation for Banner`
      );
      
      if (!creditSuccess) {
        throw new Error("Insufficient credits to generate this image");
      }
      
      // Call the image generation API
      const response = await secureApi.invokeFunction(
        'generate-image-gpt4o',
        {
          templateId,
          promptTemplate,
          mainText,
          subText,
          companyName,
          industry,
          brandTone,
          campaignId,
          userId: user.id
        }
      );
      
      const typedResponse = response as any; // Type assertion for response
      
      if (!typedResponse.success) {
        throw new Error(typedResponse.error || "Failed to generate image");
      }
      
      setLastGeneratedImageUrl(typedResponse.imageUrl);
      
      toast.success("Image Generated Successfully");
      
      return typedResponse.imageUrl;
      
    } catch (error) {
      console.error("Error generating image:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred while generating image";
      
      setLastError(errorMessage);
      toast.error(errorMessage);
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateImage,
    isGenerating,
    lastError,
    lastGeneratedImageUrl,
    clearError: () => setLastError(null)
  };
};
