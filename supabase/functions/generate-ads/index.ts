
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGoogleAds, generateMetaAds, generateLinkedInAds, generateMicrosoftAds } from "./adGenerators.ts";
import { WebsiteAnalysisResult } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { platform, campaignData, mindTrigger } = await req.json();
    console.log("Generate Ads Function called with:", { platform, mindTrigger });

    // Ensure we have required data
    if (!campaignData || !campaignData.companyName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required campaign data. Please provide at least companyName and product information." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Normalize required fields for prompt creation
    const normalizedData: WebsiteAnalysisResult = {
      companyName: campaignData.companyName,
      websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || `exemplo.com.br`,
      objective: campaignData.objective || "awareness",
      product: campaignData.product || "",
      industry: campaignData.industry || "",
      targetAudience: campaignData.targetAudience || "",
      brandTone: campaignData.brandTone || "professional",
      language: campaignData.language || "Portuguese",
      companyDescription: campaignData.companyDescription || campaignData.description || "",
      businessDescription: campaignData.businessDescription || "",
      uniqueSellingPoints: campaignData.uniqueSellingPoints || campaignData.differentials || [],
      callToAction: campaignData.callToAction || "Saiba mais",
      keywords: campaignData.keywords || []
    };

    // Normalize language to prevent mixed languages
    if (!normalizedData.language || normalizedData.language.toLowerCase().startsWith('en')) {
      normalizedData.language = "Portuguese";
    }
    
    console.log("Processing ad generation with normalized data:", JSON.stringify(normalizedData, null, 2));
    
    // Generate ads based on platform
    let adsJson;
    let platformName;
    
    switch (platform) {
      case "google":
        adsJson = await generateGoogleAds(normalizedData, mindTrigger);
        platformName = "Google Ads";
        break;
      case "meta":
      case "instagram":
        adsJson = await generateMetaAds(normalizedData, mindTrigger);
        platformName = "Meta/Instagram Ads";
        break;
      case "linkedin":
        adsJson = await generateLinkedInAds(normalizedData, mindTrigger);
        platformName = "LinkedIn Ads";
        break;
      case "microsoft":
        adsJson = await generateMicrosoftAds(normalizedData, mindTrigger);
        platformName = "Microsoft Ads";
        break;
      default:
        // Default to Google Ads if platform is not specified
        adsJson = await generateGoogleAds(normalizedData, mindTrigger);
        platformName = "Google Ads";
    }
    
    console.log(`Generated ${platformName} content of ${adsJson?.length || 0} characters`);
    
    try {
      // Try to parse the response as JSON
      let parsedAds;
      
      try {
        parsedAds = JSON.parse(adsJson);
        console.log(`Successfully parsed JSON response for ${platformName}`);
      } catch (parseError) {
        console.error(`Error parsing ${platformName} response as JSON:`, parseError);
        console.log("Raw response:", adsJson);
        
        // If parsing fails, try to extract structured data using regex patterns
        if (platform === "google" || platform === "microsoft") {
          throw new Error(`Invalid JSON response from AI for ${platformName}. Response must be in the specified JSON format.`);
        } else if (platform === "meta" || platform === "linkedin" || platform === "instagram") {
          throw new Error(`Invalid JSON response from AI for ${platformName}. Response must be in the specified JSON format.`);
        }
      }
      
      // Validate that we got a proper array with the expected fields
      if (!Array.isArray(parsedAds)) {
        throw new Error(`Invalid response format: expected array but got ${typeof parsedAds}`);
      }
      
      // Check for mixed language by looking at patterns in text fields
      if (normalizedData.language.toLowerCase() === "portuguese") {
        // Detect if the content has English text by checking for common English words
        // and the absence of Portuguese accents in longer texts
        const englishPattern = /\b(the|with|our|your|service|professional|quality)\b/i;
        const portuguesePattern = /[áàâãéèêíìóòôõúùç]/i;
        
        for (const ad of parsedAds) {
          // Check key text fields
          const textFields = platform === "google" || platform === "microsoft" ? 
            [ad.headline_1, ad.headline_2, ad.headline_3, ad.description_1, ad.description_2] :
            [ad.headline, ad.primaryText, ad.description];
          
          for (const text of textFields) {
            if (text && text.length > 15 && englishPattern.test(text) && !portuguesePattern.test(text)) {
              console.warn("Detected possible English text in ad:", text);
              throw new Error(`Conteúdo em inglês detectado no anúncio. Os anúncios devem estar completamente em ${normalizedData.language}.`);
            }
          }
        }
      }
      
      // All validations passed, return the successful response
      return new Response(
        JSON.stringify({
          success: true,
          data: parsedAds,
          platform
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (responseError) {
      console.error(`Error processing ${platformName} response:`, responseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: responseError.message || `Failed to process ${platformName} response`
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 422
        }
      );
    }
  } catch (error) {
    console.error("Error generating ads:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An unexpected error occurred"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
