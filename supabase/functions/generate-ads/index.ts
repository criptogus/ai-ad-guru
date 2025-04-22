import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGoogleAds, generateMetaAds, generateLinkedInAds, generateMicrosoftAds } from "./adGenerators.ts";
import { WebsiteAnalysisResult } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Função para detectar idioma pelo domínio da URL
function detectLanguageFromUrl(url: string): string | null {
  if (!url) return null;
  const domain = url.toLowerCase();
  if (domain.includes(".br")) return "Portuguese";
  if (domain.includes(".es")) return "Spanish";
  if (domain.includes(".fr")) return "French";
  if (domain.includes(".de")) return "German";
  if (domain.includes(".it")) return "Italian";
  // Considera .com como inglês SE não for .com.br
  if (domain.endsWith(".com")) return "English";
  return null;
}

const languagePatterns = {
  Portuguese: /[áàâãéêíóôõúçè]/i,
  English: /\b(the|you|your|service|quality|contact)\b/i,
  Spanish: /[áéíóúñ¿¡]/i,
  French: /[éèêàçôœù]/i,
  German: /[äöüß]/i,
  Italian: /[àèéìíîòóùú]/i,
};

function isInCorrectLanguage(text: string, lang: string): boolean {
  const pattern = languagePatterns[lang as keyof typeof languagePatterns];
  if (!pattern) return true;
  return pattern.test(text);
}

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
      language: campaignData.language, // Não forçar
      companyDescription: campaignData.companyDescription || campaignData.description || "",
      businessDescription: campaignData.businessDescription || "",
      uniqueSellingPoints: campaignData.uniqueSellingPoints || campaignData.differentials || [],
      callToAction: campaignData.callToAction || "Saiba mais",
      keywords: campaignData.keywords || []
    };

    // Nova lógica: só cair no detectLanguage se não vier preenchido
    if (!normalizedData.language) {
      normalizedData.language = detectLanguageFromUrl(normalizedData.websiteUrl) || "Portuguese";
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
      
      // Checagem robusta: revalida todos os textos no idioma esperado
      if (normalizedData.language) {
        const lang = normalizedData.language.charAt(0).toUpperCase() + normalizedData.language.slice(1).toLowerCase();
        for (const ad of parsedAds) {
          // Descobre campos do anúncio conforme tipo de plataforma
          let textFields: string[] = [];
          if (platform === "google" || platform === "microsoft") {
            textFields = [
              ad.headline_1, ad.headline_2, ad.headline_3, ad.description_1, ad.description_2
            ];
          } else {
            textFields = [
              ad.headline, ad.primaryText, ad.description
            ];
          }
          for (const text of textFields) {
            if (text && text.length > 10 && !isInCorrectLanguage(text, lang)) {
              console.warn(`Idioma incompatível detectado em plataforma [${platform}]: "${text}"`);
              throw new Error(
                `Conteúdo fora do idioma selecionado (${lang}) detectado no anúncio. Corrija o briefing ou altere o idioma.`
              );
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
