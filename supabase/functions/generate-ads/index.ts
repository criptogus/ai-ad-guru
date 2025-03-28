
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { createOpenAIClient } from "./openai.ts";
import { createGoogleAdsPrompt, createMetaAdsPrompt, createLinkedInAdsPrompt, createMicrosoftAdsPrompt, createImageGenerationPrompt } from "./promptCreators.ts";
import { parseAdResponse } from "./responseParser.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { platform, campaignData, mindTrigger } = await req.json();
    
    console.log(`Generating ads for ${platform} platform`);
    console.log("Campaign data:", JSON.stringify(campaignData).substring(0, 200) + "...");
    console.log("Mind trigger:", mindTrigger || "None provided");

    if (!platform) {
      console.error("No platform specified");
      return new Response(
        JSON.stringify({ success: false, error: "Platform is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!campaignData) {
      console.error("No campaign data provided");
      return new Response(
        JSON.stringify({ success: false, error: "Campaign data is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key not found");
      return new Response(
        JSON.stringify({ success: false, error: "OpenAI API key not configured" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = createOpenAIClient(OPENAI_API_KEY);
    
    // Generate prompt based on platform
    let prompt;
    if (platform === 'google') {
      prompt = await createGoogleAdsPrompt(campaignData, mindTrigger);
    } else if (platform === 'meta') {
      prompt = await createMetaAdsPrompt(campaignData, mindTrigger);
    } else if (platform === 'linkedin') {
      prompt = await createLinkedInAdsPrompt(campaignData, mindTrigger);
    } else if (platform === 'microsoft') {
      prompt = await createMicrosoftAdsPrompt(campaignData, mindTrigger);
    } else {
      console.error(`Unsupported platform: ${platform}`);
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported platform: ${platform}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Call OpenAI to generate ads
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ad copywriter with years of experience in digital advertising. You create high-converting ad copy for various platforms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    // Check if we have a valid response
    if (!response.choices || response.choices.length === 0) {
      console.error("No response from OpenAI");
      return new Response(
        JSON.stringify({ success: false, error: "Failed to generate ads" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Extract response text
    const responseText = response.choices[0].message.content;
    console.log("OpenAI raw response:", responseText.substring(0, 200) + "...");

    // Parse the response based on platform
    try {
      const ads = parseAdResponse(responseText, platform, campaignData);
      
      console.log(`Successfully generated ${ads.length} ${platform} ads`);
      
      return new Response(
        JSON.stringify({ success: true, data: ads }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to parse generated ads", 
          details: parseError.message,
          rawResponse: responseText.substring(0, 500) + "..." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in generate-ads function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "An error occurred" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
