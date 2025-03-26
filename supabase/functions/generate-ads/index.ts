
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGoogleAds, generateLinkedInAds, generateMicrosoftAds, generateMetaAds } from "./adGenerators.ts";
import { parseAdResponse } from "./responseParser.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { platform, campaignData, mindTrigger } = await req.json();
    console.log(`Generating ads for platform: ${platform}`);
    console.log(`With mind trigger: ${mindTrigger || "None"}`);
    console.log(`Campaign data: ${JSON.stringify(campaignData).substring(0, 200)}...`);

    let response;
    switch (platform) {
      case "google":
        response = await generateGoogleAds(campaignData, mindTrigger);
        break;
      case "linkedin":
        response = await generateLinkedInAds(campaignData, mindTrigger);
        break;
      case "microsoft":
        response = await generateMicrosoftAds(campaignData, mindTrigger);
        break;
      case "meta":
        response = await generateMetaAds(campaignData, mindTrigger);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Parse the response into the appropriate format
    const parsedAds = parseAdResponse(response, platform, campaignData);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: parsedAds,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`Error generating ads:`, error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
