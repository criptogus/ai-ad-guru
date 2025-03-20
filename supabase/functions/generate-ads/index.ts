
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors, formatCampaignData } from "./utils.ts";
import { generateGoogleAds, generateLinkedInAds, generateMicrosoftAds, generateMetaAds } from "./adGenerators.ts";
import { parseAdResponse, generateFallbackGoogleAds, generateFallbackLinkedInAds, generateFallbackMicrosoftAds, generateFallbackMetaAds } from "./responseParser.ts";
import { WebsiteAnalysisResult } from "./types.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: handleCors() });
  }
  
  try {
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
        }),
        { 
          status: 400, 
          headers: { ...handleCors(true), 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { platform, campaignData } = requestData;
    
    if (!platform || !campaignData) {
      console.error("Missing required fields:", { platform, campaignData: !!campaignData });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Platform and campaign data are required' 
        }),
        { 
          status: 400, 
          headers: { ...handleCors(true), 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Ensure required data is present
    if (!campaignData.companyName) {
      console.error("Missing company name in campaign data");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Company name is required in campaign data' 
        }),
        { 
          status: 400, 
          headers: { ...handleCors(true), 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Generating ${platform} ads for ${campaignData.companyName}`);
    console.log("Company information language sample:", 
      campaignData.businessDescription?.substring(0, 100) || "No business description",
      campaignData.targetAudience?.substring(0, 100) || "No target audience");
    
    // Format campaign data for prompt
    const formattedData = formatCampaignData(campaignData);
    console.log("Formatted campaign data:", formattedData);
    
    let adData;
    let response;
    
    // Generate ads based on platform
    try {
      if (platform === 'google') {
        response = await generateGoogleAds(campaignData);
        console.log("Raw Google ad response:", response);
        adData = parseAdResponse(response, platform, campaignData);
        console.log("Parsed Google ads:", adData);
      } else if (platform === 'linkedin') {
        response = await generateLinkedInAds(campaignData);
        console.log("Raw LinkedIn ad response:", response);
        adData = parseAdResponse(response, platform, campaignData);
        console.log("Parsed LinkedIn ads:", adData);
      } else if (platform === 'microsoft') {
        response = await generateMicrosoftAds(campaignData);
        console.log("Raw Microsoft ad response:", response);
        adData = parseAdResponse(response, platform, campaignData);
        console.log("Parsed Microsoft ads:", adData);
      } else if (platform === 'meta') {
        response = await generateMetaAds(campaignData);
        console.log("Raw Meta ad response:", response);
        adData = parseAdResponse(response, platform, campaignData);
        console.log("Parsed Meta ads:", adData);
      } else {
        throw new Error('Invalid platform specified');
      }
    } catch (error) {
      console.error(`Error generating ${platform} ads:`, error);
      
      // Create fallback data directly based on platform
      if (platform === 'google') {
        adData = generateFallbackGoogleAds(campaignData);
      } else if (platform === 'linkedin') {
        adData = generateFallbackLinkedInAds(campaignData);
      } else if (platform === 'microsoft') {
        adData = generateFallbackMicrosoftAds(campaignData);
      } else if (platform === 'meta') {
        adData = generateFallbackMetaAds(campaignData);
      } else {
        adData = [];
      }
      
      console.log(`Using fallback ${platform} ads due to error`);
    }

    console.log(`${platform} ad generation completed with ${adData.length} variations`);

    // Return the generated ads
    return new Response(JSON.stringify({ success: true, data: adData }), {
      headers: { ...handleCors(true), 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error in generate-ads function:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || `An error occurred while generating ads` 
      }),
      { 
        status: 500, 
        headers: { ...handleCors(true), 'Content-Type': 'application/json' } 
      }
    );
  }
});
