
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generates an image using AI based on a prompt
   */
  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log("Generating image with GPT-4o, prompt:", prompt);
      
      // Make sure we have a valid prompt
      if (!prompt || prompt.trim().length === 0) {
        console.error("Empty prompt provided");
        setError("Image prompt cannot be empty");
        toast.error("Cannot generate image", { description: "Image prompt cannot be empty" });
        return null;
      }

      // Call the edge function to generate the image using GPT-4o
      const { data, error: functionError } = await supabase.functions.invoke('generate-image-gpt4o', {
        body: {
          imagePrompt: prompt,
          platform: additionalInfo?.platform || 'meta',
          format: additionalInfo?.format || 'feed',
          adContext: {
            headline: additionalInfo?.headline,
            primaryText: additionalInfo?.primaryText,
            industry: additionalInfo?.industry
          }
        }
      });

      if (functionError) {
        console.error("Supabase function error:", functionError);
        setError(functionError.message || "Failed to generate image");
        toast.error("Image generation failed", { 
          description: functionError.message || "An error occurred while generating the image" 
        });
        return null;
      }

      if (!data || !data.success) {
        console.error("API reported error:", data?.error || "Unknown error");
        setError(data?.error || "API reported an error");
        toast.error("Image generation failed", { description: data?.error || "API reported an error" });
        return null;
      }

      if (!data.imageUrl) {
        console.error("No image URL returned from function");
        setError("No image was generated");
        toast.error("Image generation failed", { description: "No image was returned" });
        return null;
      }

      console.log("Successfully generated image URL with GPT-4o:", data.imageUrl);
      console.log("Prompt used by DALL-E:", data.promptUsed);
      
      toast.success("Image generated successfully", {
        description: "5 credits were used for AI image generation with GPT-4o"
      });
      
      return data.imageUrl;
    } catch (err) {
      console.error("Exception in generateAdImage:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast.error("Image generation failed", { description: errorMessage });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAdImage,
    isGenerating,
    error,
    clearError: () => setError(null)
  };
};

export default useImageGeneration;
