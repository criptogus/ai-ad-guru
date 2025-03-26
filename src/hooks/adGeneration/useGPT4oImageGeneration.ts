
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { secureApi } from '@/services/api/secureApi';
import { useToast } from '@/hooks/use-toast';
import { getCreditCosts, consumeCredits } from '@/services';
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
  const creditCosts = getCreditCosts();
  
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
      toast.info("Credit Usage Preview", {
        description: `This will use ${creditCosts.instagramAd} credits to generate this ad image with GPT-4o`,
        duration: 3000,
      });
      
      // Consume credits
      const creditSuccess = await consumeCredits(
        user.id,
        creditCosts.instagramAd,
        'gpt4o_image_generation',
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
      
      if (!response.success) {
        throw new Error(response.error || "Failed to generate image");
      }
      
      setLastGeneratedImageUrl(response.imageUrl);
      
      toast.success("Image Generated Successfully", {
        description: `${creditCosts.instagramAd} credits were used for this ad image`,
      });
      
      return response.imageUrl;
      
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
          -creditCosts.instagramAd, // Negative to refund
          'credit_refund',
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
