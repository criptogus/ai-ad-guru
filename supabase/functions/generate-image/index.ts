
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }
    
    const { prompt, platform = 'meta', style = 'photorealistic' } = await req.json();
    
    if (!prompt) {
      throw new Error("Missing image prompt");
    }
    
    console.log(`Generating image for platform: ${platform} with style: ${style}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);
    
    // Generate the image using OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: platform === 'meta' || platform === 'instagram' ? "1024x1024" : "1792x1024", // Square for Instagram, wide for LinkedIn
        quality: style === 'photorealistic' ? "hd" : "standard",
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }
    
    console.log("Image generated successfully!");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        prompt
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred"
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
