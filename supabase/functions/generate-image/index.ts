
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
    const { prompt } = await req.json();
    
    console.log(`Generating image for prompt: ${prompt}`);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Image prompt is required" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Simplified placeholder response
    const placeholderImage = 'https://placehold.co/600x600/EEE/31343C?text=AI+Image';

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
      JSON.stringify({ error: "Failed to generate image" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
