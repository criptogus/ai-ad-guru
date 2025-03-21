
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../generate-image/utils.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Banner image generation started");
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    // Parse request body
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const { 
      prompt, 
      platform = "instagram", 
      format = "square",
      templateType = "product"
    } = requestBody;
    
    if (!prompt) {
      throw new Error('Image prompt is required');
    }
    
    // Determine image size based on requested format
    let imageSize = "1024x1024"; // Default square format
    
    if (format === "story") {
      imageSize = "1024x1792"; // Portrait format
    } else if (format === "horizontal") {
      imageSize = "1792x1024"; // Landscape format
    }
    
    // Enhance the prompt for better ad banner generation
    const enhancedPrompt = `
Generate a high-quality advertising banner image for ${platform} platform in ${format} format.

ADVERTISING CONTEXT:
- Banner Type: ${templateType} advertisement
- Platform: ${platform}
- Format: ${format}

SPECIFIC REQUIREMENTS:
${prompt}

VISUAL STYLE:
- Professional, high-end commercial advertisement aesthetic
- Clean, uncluttered composition with focal point
- Optimal color contrast for text overlay visibility
- NO TEXT should be in the image (text will be added separately)
- Image should have areas with lower detail where text can be placed

TECHNICAL REQUIREMENTS:
- Photorealistic, commercial-grade image quality
- Proper lighting to highlight key elements
- Even color distribution
- Avoid busy backgrounds that would make text hard to read
`.trim();
    
    console.log("Enhanced DALL-E prompt:", enhancedPrompt);
    console.log(`Image size: ${imageSize}`);
    
    // Call OpenAI API to generate the image
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: imageSize,
        quality: "hd",
        style: "natural"
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("OpenAI API response:", JSON.stringify(data, null, 2));
    
    if (!data.data || data.data.length === 0) {
      console.error("OpenAI API response has no data");
      throw new Error("No image was generated");
    }
    
    const imageUrl = data.data[0].url;
    const revisedPrompt = data.data[0].revised_prompt;
    
    if (!imageUrl) {
      console.error("Empty image URL in response");
      throw new Error("Generated image URL is empty");
    }
    
    console.log("Image generation completed successfully");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        prompt: enhancedPrompt,
        revisedPrompt
      }), 
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
    
  } catch (error) {
    console.error("Error generating banner image:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
