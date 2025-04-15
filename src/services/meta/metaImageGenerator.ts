
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GenerateImageParams {
  prompt: string;
  format?: 'square' | 'landscape' | 'portrait' | 'story';
  style?: string;
  maxRetries?: number;
}

export interface GenerateImageResult {
  imageUrl: string;
  originalUrl?: string;
  success: boolean;
  error?: string;
}

/**
 * Generates an image for Meta Ads using OpenAI via Supabase Edge Function
 */
export const generateMetaAdImage = async (params: GenerateImageParams): Promise<GenerateImageResult> => {
  const { prompt, format = 'square', style, maxRetries = 2 } = params;
  
  // Enhance the prompt with style information and ad-specific context if needed
  let enhancedPrompt = prompt;
  
  if (style) {
    enhancedPrompt += `. Style: ${style}.`;
  }
  
  enhancedPrompt += " Create a professional, high-quality advertisement image suitable for Instagram and Facebook. Image should have good composition with space for text overlay.";
  
  console.log("Generating image with prompt:", enhancedPrompt.substring(0, 100) + "...");
  
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries <= maxRetries) {
    try {
      // Get the user ID if available
      let userId = null;
      try {
        const auth = supabase.auth.getSession();
        userId = (await auth).data.session?.user?.id;
      } catch (e) {
        console.warn("Could not get user ID:", e);
      }
      
      // Call the edge function to generate the image
      const { data, error } = await supabase.functions.invoke('generate-meta-ad-image', {
        body: {
          prompt: enhancedPrompt,
          format,
          userId
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(data.error || "Image generation failed");
      }
      
      return {
        imageUrl: data.imageUrl,
        originalUrl: data.originalUrl,
        success: true
      };
    } catch (error) {
      console.error(`Image generation attempt ${retries + 1} failed:`, error);
      lastError = error;
      retries++;
      
      // Wait before retrying
      if (retries <= maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * retries));
      }
    }
  }
  
  return {
    imageUrl: "",
    success: false,
    error: lastError?.message || "Failed to generate image after multiple attempts"
  };
};
