
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/contexts/CreditsContext';
import { useAuth } from '@/contexts/AuthContext';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { decrementCredits } = useCredits();
  const { user } = useAuth();
  
  const generateAdImage = async (
    prompt: string, 
    additionalInfo?: {
      companyName?: string;
      adType?: string;
      industry?: string;
      adContext?: any;
      imageFormat?: 'square' | 'portrait' | 'landscape';
      platform?: string;
      userId?: string;
    }
  ): Promise<string | null> => {
    if (!prompt) {
      setError('Prompt is required');
      return null;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log(`Generating image with prompt: ${prompt}`);
      console.log('Additional context:', additionalInfo);
      
      // Determine which function to call based on the platform or other criteria
      const functionName = additionalInfo?.platform === 'meta' || additionalInfo?.platform === 'instagram' 
        ? 'generate-meta-ad-image' 
        : 'generate-image';
      
      const { data, error: functionError } = await supabase.functions.invoke(functionName, {
        body: { 
          prompt,
          format: additionalInfo?.imageFormat || 'square',
          industry: additionalInfo?.industry || null,
          adType: additionalInfo?.adType || 'general',
          platform: additionalInfo?.platform || 'instagram',
          userId: additionalInfo?.userId || user?.id,
          companyName: additionalInfo?.companyName || 'Your Company',
          adContext: additionalInfo?.adContext || null
        }
      });
      
      if (functionError) {
        console.error('Error generating image:', functionError);
        setError(functionError.message || 'Failed to generate image');
        
        toast({
          title: 'Image Generation Failed',
          description: functionError.message || 'There was an error generating your image',
          variant: 'destructive',
        });
        
        return null;
      }
      
      if (!data?.imageUrl) {
        console.error('No image URL returned:', data);
        setError('No image was generated');
        
        toast({
          title: 'Image Generation Failed',
          description: 'The image generation service did not return a valid image',
          variant: 'destructive',
        });
        
        return null;
      }
      
      // Credit usage handling (if applicable)
      if (decrementCredits) {
        decrementCredits(5); // Cost to generate an image
      }
      
      console.log('Image generated successfully:', data.imageUrl);
      return data.imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in image generation:', err);
      setError(errorMessage);
      
      toast({
        title: 'Image Generation Failed',
        description: errorMessage,
        variant: 'destructive',
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
