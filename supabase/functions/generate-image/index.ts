
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { prompt, platform = 'meta', format = 'square', brandTone = 'professional' } = await req.json();
    
    console.log(`Generating image for prompt: ${prompt}`);
    console.log(`Platform: ${platform}, Format: ${format}, Brand Tone: ${brandTone}`);

    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Image prompt is required" 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // For testing and development, use placeholders based on format
    let placeholderImage;
    
    if (format === 'square') {
      placeholderImage = 'https://placehold.co/1000x1000/EEEEEE/31343C?text=Instagram+Ad';
    } else if (format === 'story' || format === 'portrait') {
      placeholderImage = 'https://placehold.co/1080x1920/EEEEEE/31343C?text=Instagram+Story';
    } else if (format === 'landscape' || format === 'horizontal') {
      placeholderImage = 'https://placehold.co/1200x628/EEEEEE/31343C?text=LinkedIn+Ad';
    } else {
      placeholderImage = 'https://placehold.co/1000x1000/EEEEEE/31343C?text=Default+Ad';
    }

    // Add dynamic text from the prompt to the placeholder
    const shortPrompt = prompt.substring(0, 30).replace(/\s+/g, '+');
    placeholderImage = placeholderImage.replace('Ad', `${shortPrompt}...`);

    console.log(`Generated placeholder image URL: ${placeholderImage}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: placeholderImage 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
