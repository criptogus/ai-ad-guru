
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

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
    const { 
      platform, 
      websiteData, 
      mindTrigger, 
      variations = 3 
    } = await req.json();

    // Input validation
    if (!platform || !websiteData) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Generate fallback ads
    let ads = [];

    // Always generate some fallback ads
    if (platform === 'google') {
      // Generate basic Google ads
      ads = Array(variations).fill(0).map((_, i) => ({
        id: `google-ad-${Date.now()}-${i}`,
        headline: `${websiteData.businessName || 'Business'} - Premium Solutions`,
        description: `Discover our ${websiteData.uniqueSellingPoints?.[0] || 'top quality'} products and services. Learn more now!`,
        path1: 'solutions',
        path2: 'premium',
        finalUrl: websiteData.websiteUrl || 'https://example.com',
      }));
    } else if (platform === 'meta') {
      // Generate basic Meta/Instagram ads
      ads = Array(variations).fill(0).map((_, i) => ({
        id: `meta-ad-${Date.now()}-${i}`,
        caption: `Discover what makes us different: ${websiteData.uniqueSellingPoints?.[0] || 'quality service'}. \n\nVisit our website to learn more! ${websiteData.callToAction?.[0] || 'Shop now'} 🔥\n\n#business #quality #service`,
        imagePrompt: `A professional image for ${websiteData.businessName || 'a business'} that sells ${websiteData.productOrService || 'products and services'}`,
        placeholderImage: 'https://placehold.co/600x600/EEE/31343C?text=AI+Image+Coming+Soon',
      }));
    }

    // Return the generated ads
    return new Response(
      JSON.stringify({ 
        success: true,
        platform,
        ads
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
