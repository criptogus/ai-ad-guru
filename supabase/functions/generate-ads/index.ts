
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors } from "./utils.ts";
import { generateGoogleAds, generateMetaAds } from "./adGenerators.ts";
import { parseAdResponse } from "./responseParser.ts";
import { WebsiteAnalysisResult } from "./types.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCors();
  }
  
  try {
    // Parse request body
    const { platform, campaignData } = await req.json();
    
    if (!platform || !campaignData) {
      throw new Error('Platform and campaign data are required');
    }
    
    console.log(`Generating ${platform} ads for ${campaignData.companyName}`);
    
    let adData;
    
    // Generate ads based on platform
    if (platform === 'google') {
      const response = await generateGoogleAds(campaignData);
      adData = parseAdResponse(response, platform, campaignData);
    } else if (platform === 'meta') {
      const response = await generateMetaAds(campaignData);
      adData = parseAdResponse(response, platform, campaignData);
    } else {
      throw new Error('Invalid platform specified');
    }

    console.log(`${platform} ad generation completed successfully with ${adData.length} variations`);

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
