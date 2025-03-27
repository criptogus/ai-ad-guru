
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

import { GoogleAd, MetaAd } from "./types.ts";

// Minimal mock implementation
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { websiteUrl, platforms } = await req.json();
    
    console.log(`Generating ads for website: ${websiteUrl}, platforms: ${platforms.join(', ')}`);
    
    const response: Record<string, GoogleAd[] | MetaAd[]> = {};
    
    // Generate placeholder ads based on requested platforms
    if (platforms.includes('google')) {
      response.google = [
        {
          headlines: [
            "Premium Quality Services",
            "Top-Rated Solutions",
            "Best Value Guaranteed"
          ],
          descriptions: [
            "Professional services tailored to your needs. Try today!",
            "Discover why customers choose us. Fast results!"
          ]
        }
      ];
    }
    
    if (platforms.includes('meta')) {
      response.meta = [
        {
          headline: "Transform Your Business Today",
          primaryText: "Get started with our premium services and see results fast",
          description: "Click to learn more about our exclusive offers",
          imagePrompt: "Professional team working together in modern office with bright lighting"
        }
      ];
    }

    return new Response(
      JSON.stringify({ success: true, ...response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Ad generation error:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate ads" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
