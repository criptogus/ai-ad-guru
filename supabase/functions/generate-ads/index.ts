
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGoogleAds, generateLinkedInAds, generateMicrosoftAds, generateMetaAds } from "./adGenerators.ts";
import { parseAdResponse } from "./responseParser.ts";
import { generateFallbackGoogleAds, generateFallbackMetaAds, generateFallbackLinkedInAds, generateFallbackMicrosoftAds } from "./fallbacks/index.ts";

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
    // Parse the request body
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request body format",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { platform, campaignData, mindTrigger } = reqBody;
    
    if (!platform || !campaignData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameters: platform and campaignData",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log(`Generating ads for platform: ${platform}`);
    console.log(`With mind trigger: ${mindTrigger || "None"}`);
    console.log(`Campaign data: ${JSON.stringify(campaignData).substring(0, 200)}...`);

    // Try to generate AI ads, but use fallbacks if OpenAI call fails
    let response;
    let parsedAds;
    
    try {
      // First attempt: using OpenAI for generation
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

      // Parse the AI-generated response
      parsedAds = parseAdResponse(response, platform, campaignData);
      
    } catch (aiError) {
      console.error(`Error generating ads with AI: ${aiError.message}`);
      
      // Fallback: If AI generation fails, use predefined templates
      console.log(`Using fallback ads for ${platform} platform`);
      
      switch (platform) {
        case "google":
          parsedAds = generateFallbackGoogleAds(campaignData);
          break;
        case "linkedin":
          parsedAds = generateFallbackLinkedInAds(campaignData);
          break;
        case "microsoft":
          parsedAds = generateFallbackMicrosoftAds(campaignData);
          break;
        case "meta":
          parsedAds = generateFallbackMetaAds(campaignData);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    }
    
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
        error: error.message || "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
