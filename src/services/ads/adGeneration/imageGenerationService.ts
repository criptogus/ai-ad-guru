
import { supabase } from "@/integrations/supabase/client";

interface ImageGenerationParams {
  companyName?: string;
  brandTone?: string;
  industry?: string;
  format?: string;
  adContext?: any;
  companyDescription?: string;
  targetAudience?: string;
  objective?: string;
  adType?: string;
  [key: string]: any;
}

export const generateAdImage = async (
  prompt: string, 
  additionalInfo?: ImageGenerationParams
): Promise<string | null> => {
  try {
    console.log("🖼️ Generating ad image with prompt:", prompt.substring(0, 100) + "...");
    console.log("Additional info:", additionalInfo);
    
    // Handle missing prompt
    if (!prompt || prompt.trim().length < 10) {
      throw new Error("Invalid image prompt: too short or missing");
    }
    
    // Set default format based on ad type
    const format = additionalInfo?.format || 
      (additionalInfo?.adType === 'instagram' ? 'square' : 'landscape');
    
    const adType = additionalInfo?.adType || 'instagram';
    
    // Enhance prompt with better context for more reliable image generation
    const enhancedPrompt = `Crie uma imagem profissional de alta qualidade para anúncio de ${adType === 'instagram' ? 'Instagram' : 'LinkedIn'} com as seguintes características:

Empresa: ${additionalInfo?.companyName || 'empresa'}
Setor: ${additionalInfo?.industry || 'setor não especificado'}
Público: ${additionalInfo?.targetAudience || 'público geral'}
Tom: ${additionalInfo?.brandTone || 'profissional'}

IMPORTANTE: 
- A imagem deve ser fotorrealista com acabamento profissional
- SEM TEXTO na imagem
- Alta qualidade visual e iluminação profissional
- Composição limpa e moderna

INSTRUÇÕES ESPECÍFICAS:
${prompt}`;

    // Log the final prompt
    console.log("🎨 Enhanced image prompt:", enhancedPrompt);
    
    // Prepare request body with comprehensive context
    const requestBody = { 
      prompt: enhancedPrompt,
      additionalInfo: {
        ...additionalInfo,
        format,
        adType,
        industry: additionalInfo?.industry || '',
        brandName: additionalInfo?.companyName || '',
        companyDescription: additionalInfo?.companyDescription || '',
        targetAudience: additionalInfo?.targetAudience || '',
        objective: additionalInfo?.objective || ''
      }
    };
    
    console.log("📤 Sending image generation request to Supabase Edge Function");
    
    // Call the Supabase edge function to generate the image
    const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
      body: requestBody,
    });

    if (error) {
      console.error("🚨 Error in Supabase function call:", error);
      throw new Error(error.message || "Failed to call image generation function");
    }

    if (!data || !data.success) {
      console.error("🚨 Image generation failed:", data?.error || "Unknown error");
      throw new Error(data?.error || "Failed to generate image");
    }

    console.log("✅ Image generated successfully:", data.imageUrl ? "URL received" : "No URL");
    
    // Add fallback URL for testing if needed
    const imageUrl = data.imageUrl || "https://placehold.co/600x600?text=Image+Generation+Demo";
    
    return imageUrl;
  } catch (error) {
    console.error("🚨 Error in generateAdImage:", error);
    throw error;
  }
};
