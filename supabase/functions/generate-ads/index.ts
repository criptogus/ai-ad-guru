import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  generateGoogleAds, 
  generateLinkedInAds, 
  generateMicrosoftAds, 
  generateMetaAds 
} from "./adGenerators.ts";
import { WebsiteAnalysisResult } from "./types.ts";
import { 
  generateFallbackGoogleAds, 
  generateFallbackMicrosoftAds 
} from "./fallbacks/googleAdsFallbacks.ts";
import { 
  generateFallbackMetaAds, 
  generateFallbackLinkedInAds 
} from "./fallbacks/metaAdsFallbacks.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }

  try {
    // Parse the request body
    const { platform, campaignData, mindTrigger, systemMessage, userMessage } = await req.json();
    
    console.log("Generating ads for platform:", platform);
    
    // If we have systemMessage and userMessage, use the prompt-based generation
    if (systemMessage && userMessage) {
      // Handle the OpenAI prompt-based generation
      const result = await generateFromPrompt(systemMessage, userMessage);
      return new Response(
        JSON.stringify({ success: true, content: result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Otherwise use the platform-specific generation
    if (!campaignData) {
      throw new Error("Missing campaign data");
    }
    
    let result;
    
    // Generate ads based on the platform
    switch (platform) {
      case "google":
        try {
          result = await generateGoogleAds(campaignData, mindTrigger);
        } catch (error) {
          console.error("Error generating Google ads, using fallback:", error);
          result = JSON.stringify(generateFallbackGoogleAds(campaignData));
        }
        break;
      case "linkedin":
        try {
          result = await generateLinkedInAds(campaignData, mindTrigger);
        } catch (error) {
          console.error("Error generating LinkedIn ads, using fallback:", error);
          result = JSON.stringify(generateFallbackLinkedInAds(campaignData));
        }
        break;
      case "microsoft":
        try {
          result = await generateMicrosoftAds(campaignData, mindTrigger);
        } catch (error) {
          console.error("Error generating Microsoft ads, using fallback:", error);
          result = JSON.stringify(generateFallbackMicrosoftAds(campaignData));
        }
        break;
      case "meta":
        try {
          result = await generateMetaAds(campaignData, mindTrigger);
        } catch (error) {
          console.error("Error generating Meta ads, using fallback:", error);
          result = JSON.stringify(generateFallbackMetaAds(campaignData));
        }
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, data: JSON.parse(result) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-ads function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Function to generate content from OpenAI prompts
async function generateFromPrompt(systemMessage: string, userMessage: string) {
  try {
    // Placeholder for actual OpenAI integration
    // For demo purposes, return mock data
    return {
      google_ads: [
        {
          headline_1: "Drive Results with Us",
          headline_2: "Professional Solutions",
          headline_3: "Expert Service",
          description_1: "We provide top-quality service that meets your needs.",
          description_2: "Contact us today to learn more.",
          display_url: "example.com"
        },
        {
          headline_1: "Premium Solutions",
          headline_2: "Exceptional Quality",
          headline_3: "Best Value",
          description_1: "Find the perfect solution for your business needs.",
          description_2: "Trusted by thousands of customers.",
          display_url: "example.com"
        }
      ],
      instagram_ads: [
        {
          text: "Transform your experience with our innovative solutions. #innovation #quality",
          image_prompt: "Professional product display with elegant modern styling"
        },
        {
          text: "Discover what makes us different. Quality you can trust. #trusted #reliable",
          image_prompt: "Lifestyle image showing product in use in a modern setting"
        }
      ]
    };
  } catch (error) {
    console.error("Error generating content from prompt:", error);
    throw error;
  }
}
