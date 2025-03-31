
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { secureApi } from '@/services/api/secureApi';
import { useToast } from '@/hooks/use-toast';
import { getCreditCost } from '@/services/credits/creditCosts';
import { consumeCredits } from '@/services/credits/creditUsage';
import { PromptTemplate } from '@/hooks/template/usePromptTemplates';

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

export interface UseGPT4oImageGenerationReturn {
  generateImage: (config: ImageGenerationConfig) => Promise<string | null>;
  isGenerating: boolean;
  lastError: string | null;
  lastGeneratedImageUrl: string | null;
  clearError: () => void;
}

export const useGPT4oImageGeneration = (): UseGPT4oImageGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastGeneratedImageUrl, setLastGeneratedImageUrl] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const imageCost = getCreditCost('imageGeneration');
  
  const generateImage = async (config: ImageGenerationConfig): Promise<string | null> => {
    if (!user) {
      const errorMessage = "You must be logged in to generate images";
      setLastError(errorMessage);
      toast({
        title: "Authentication Required",
        description: errorMessage,
        variant: "destructive",
      });
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
      toast({
        title: "Missing Template",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
    
    setIsGenerating(true);
    setLastError(null);
    
    try {
      // Preview credit usage
      toast({
        title: "Credit Usage Preview",
        description: `This will use ${imageCost} credits to generate this ad image with GPT-4o`,
        duration: 3000,
      });
      
      // Consume credits - assuming we need 5 credits for image generation
      const creditSuccess = await consumeCredits(
        user.id,
        imageCost,
        'imageGeneration', 
        `GPT-4o Ad Image Generation`
      );
      
      if (!creditSuccess) {
        throw new Error("Insufficient credits to generate this image");
      }
      
      // Call the GPT-4o Edge Function
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
      
      toast({
        title: "Image Generated Successfully",
        description: `${imageCost} credits were used for this ad image`,
        variant: "default",
      });
      
      return typedResponse.imageUrl;
      
    } catch (error) {
      console.error("Error generating image with GPT-4o:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred while generating image";
      
      setLastError(errorMessage);
      
      toast({
        title: "Image Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Try to refund credits on failure
      if (user?.id) {
        await consumeCredits(
          user.id,
          -imageCost,
          'imageGeneration', 
          'Refund for failed GPT-4o image generation'
        );
      }
      
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
