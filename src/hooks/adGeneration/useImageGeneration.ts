
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // This effect attempts to validate and preload the image URL when it's generated
  useEffect(() => {
    if (generatedImageUrl) {
      console.log("Preloading and validating generated image:", generatedImageUrl);
      
      const preloadImage = new Image();
      preloadImage.onload = () => {
        console.log("Generated image preloaded successfully");
      };
      preloadImage.onerror = (err) => {
        console.error("Generated image failed to preload:", err);
        // Don't set an error, just log it
      };
      
      // Add a timestamp to prevent caching
      const cacheBuster = generatedImageUrl.includes('?') ? '&t=' : '?t=';
      preloadImage.src = generatedImageUrl + cacheBuster + Date.now();
    }
  }, [generatedImageUrl]);

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    if (!prompt) {
      const errorMessage = "Please provide a description for the image you want to generate";
      console.error('No prompt provided for image generation');
      setLastError(errorMessage);
      toast({
        title: "Missing Prompt",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      return null;
    }

    setIsGenerating(true);
    setLastError(null);
    setGeneratedImageUrl(null); // Reset previous URL
    
    try {
      console.log('Generating image with GPT-4o prompt:', prompt);
      console.log('Additional context:', JSON.stringify(additionalInfo, null, 2));
      
      // Prepare parameters for image generation
      const imageFormat = additionalInfo?.imageFormat || "square";
      
      // Include additional context in the function call
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt,
          imageFormat,
          ...additionalInfo
        },
      });

      console.log('GPT-4o image generation response:', JSON.stringify(data, null, 2));

      if (error) {
        console.error('Error generating image with GPT-4o:', error);
        const errorMessage = error.message || "Service error while generating image";
        setLastError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!data || !data.success) {
        console.error('GPT-4o image generation failed:', data?.error || 'Unknown error');
        const errorMessage = data?.error || "Failed to generate image";
        setLastError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.imageUrl) {
        console.error('No image URL returned from GPT-4o function');
        const errorMessage = "No image URL returned";
        setLastError(errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Image generated successfully with GPT-4o, URL:', data.imageUrl);
      console.log('GPT-4o revised prompt:', data.revisedPrompt || 'No revised prompt');
      
      // Store the generated URL in state
      setGeneratedImageUrl(data.imageUrl);
      
      // Ensure the URL has a cache-busting parameter
      const imageUrl = data.imageUrl.includes('?') 
        ? data.imageUrl 
        : `${data.imageUrl}?t=${Date.now()}`;
      
      // Test the image URL to make sure it's accessible
      const img = new Image();
      img.onerror = () => {
        console.error('The generated image URL failed to load:', imageUrl);
      };
      img.onload = () => {
        console.log('The generated image URL loaded successfully');
      };
      img.src = imageUrl;
      
      // Inform the user about credit usage (5 credits for Instagram ad image)
      toast({
        title: "Image Generated Successfully with GPT-4o",
        description: "5 credits have been used for this Instagram ad image",
        duration: 3000,
      });
      
      return imageUrl;
    } catch (error) {
      console.error('Error calling generate-image function with GPT-4o:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      setLastError(errorMessage);
      toast({
        title: "GPT-4o Image Generation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
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
    generatedImageUrl,
    clearError: () => setLastError(null)
  };
};
