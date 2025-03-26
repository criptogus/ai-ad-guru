
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const clearError = () => setLastError('');

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string> => {
    setIsGenerating(true);
    setLastError('');
    
    try {
      console.log("Generating image with prompt:", prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          model: "dall-e-3", 
          size: "1024x1024",
          ...additionalInfo 
        }
      });
      
      if (error) {
        console.error("Error generating image:", error);
        setLastError(error.message);
        throw error;
      }
      
      if (!data?.imageUrl) {
        const errorMsg = "No image URL received from API";
        console.error(errorMsg);
        setLastError(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log("Image generated:", data.imageUrl);
      setGeneratedImageUrl(data.imageUrl);
      return data.imageUrl;
    } catch (error) {
      console.error("Error in generateAdImage:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setLastError(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAdImage,
    isGenerating,
    lastError,
    generatedImageUrl,
    clearError
  };
};
