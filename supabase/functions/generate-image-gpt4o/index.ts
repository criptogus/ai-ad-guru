
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Set up OpenAI API key
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    // Parse request body
    const requestData = await req.json();
    const { imagePrompt, platform = 'meta', format = 'feed', adContext = {} } = requestData;
    
    console.log("Received image generation request:", JSON.stringify({
      imagePrompt: imagePrompt?.substring(0, 100) + "...",
      platform,
      format
    }));
    
    if (!imagePrompt) {
      throw new Error('No image prompt provided');
    }
    
    // Enhance the prompt with platform-specific context
    let enhancedPrompt = enhancePromptWithContext(imagePrompt, platform, format, adContext);
    
    console.log("Enhanced prompt for GPT-4o:", enhancedPrompt.substring(0, 100) + "...");
    
    // Determine the appropriate size based on platform and format
    let size = "1024x1024"; // Default square
    if (platform === 'linkedin' && format === 'landscape') {
      // Use a 16:9 ratio for LinkedIn landscape
      size = "1792x1024"; // Maintains the aspect ratio while staying within DALL-E's limits
    } else if (platform === 'meta' && format === 'portrait') {
      // Use a 4:5 ratio for Instagram portrait
      size = "1024x1280";
    } else if (format === 'story' || format === 'reel') {
      // Use a 9:16 ratio for stories/reels
      size = "1024x1792"; // Maintains the aspect ratio while staying within DALL-E's limits
    }
    
    // Use DALL-E 3 directly rather than through the GPT-4o tools
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
        size: size,
        quality: "standard",
        response_format: "url"
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error response:", errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error("No image URL in OpenAI response:", JSON.stringify(data));
      throw new Error("No image URL was returned by OpenAI");
    }
    
    const imageUrl = data.data[0].url;
    const revisedPrompt = data.data[0].revised_prompt || enhancedPrompt;
    
    console.log("Successfully generated image URL:", imageUrl.substring(0, 50) + "...");
    console.log("Revised prompt used by DALL-E:", revisedPrompt.substring(0, 100) + "...");
    
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: imageUrl,
        promptUsed: revisedPrompt
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Error generating image:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});

/**
 * Enhances the prompt with platform-specific and format-specific context
 */
function enhancePromptWithContext(prompt: string, platform: string, format: string, adContext: any = {}) {
  let enhancedPrompt = prompt;
  
  // Add platform-specific context
  if (platform === 'meta' || platform === 'instagram') {
    enhancedPrompt += ' Create a vibrant, attention-grabbing image suitable for Instagram advertising.';
  } else if (platform === 'linkedin') {
    enhancedPrompt += ' Create a professional, business-oriented image suitable for LinkedIn advertising.';
  } else if (platform === 'google') {
    enhancedPrompt += ' Create a clean, high-quality image suitable for Google search advertising.';
  }
  
  // Add format-specific context
  if (format === 'feed') {
    enhancedPrompt += ' Format should be square or 4:5 aspect ratio for social media feed.';
  } else if (format === 'story' || format === 'reel') {
    enhancedPrompt += ' Format should be 9:16 vertical for social media stories or reels.';
  } else if (format === 'landscape') {
    enhancedPrompt += ' Format should be 16:9 landscape for LinkedIn or wider displays.';
  } else if (format === 'square') {
    enhancedPrompt += ' Format should be 1:1 square for versatile social media use.';
  }
  
  // Add ad headline and primary text for additional context if available
  if (adContext.headline) {
    enhancedPrompt += ` The ad headline is: "${adContext.headline}".`;
  }
  
  if (adContext.primaryText && adContext.primaryText.length > 0) {
    // Extract the first sentence or part to keep the context concise
    const firstSentence = adContext.primaryText.split('.')[0];
    enhancedPrompt += ` The ad message is about: "${firstSentence}".`;
  }
  
  if (adContext.industry) {
    enhancedPrompt += ` The industry context is: ${adContext.industry}.`;
  }
  
  if (adContext.adTheme) {
    enhancedPrompt += ` The advertising theme is: ${adContext.adTheme}.`;
  }
  
  // Add quality guidance
  enhancedPrompt += ' High quality, photorealistic, detailed, professional advertising imagery with excellent lighting and composition.';
  
  // Add restrictions for advertising compliance
  enhancedPrompt += ' The image should not contain any text, numbers, logos, or watermarks as these will be added separately.';
  
  return enhancedPrompt;
}
