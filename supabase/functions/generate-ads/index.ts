
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  generateGoogleAds,
  generateMetaAds,
  generateLinkedInAds,
  generateMicrosoftAds
} from "./adGenerators.ts";
import { WebsiteAnalysisResult } from "./types.ts";
import { getSimplifiedLanguageCode } from "./responseValidators.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Função para detectar idioma pelo domínio da URL
function detectLanguageFromUrl(url: string): string | null {
  if (!url) return null;
  const domain = url.toLowerCase();
  if (domain.includes(".br")) return "pt";
  if (domain.includes(".es")) return "es";
  if (domain.includes(".fr")) return "fr";
  if (domain.includes(".de")) return "de";
  if (domain.includes(".it")) return "it";
  // Considera .com como inglês SE não for .com.br
  if (domain.endsWith(".com") && !domain.endsWith(".com.br")) return "en";
  return null;
}

// Check if text belongs to detected language using common patterns
function isInCorrectLanguage(text: string, lang: string): boolean {
  if (!text || !lang) return true;
  
  const patternMap: Record<string, RegExp> = {
    pt: /[áàâãéêíóôõúçè]/i,
    en: /\b(the|you|your|service|quality|contact)\b/i,
    es: /[áéíóúñ¿¡]/i,
    fr: /[éèêàçôœù]/i,
    de: /[äöüß]/i,
    it: /[àèéìíîòóùú]/i,
  };
  
  const pattern = patternMap[lang];
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
    const { platform, campaignData, mindTrigger, temperature = 0.7 } = await req.json();
    console.log("Generate Ads Function called with:", { platform, mindTrigger, temperature });

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
      websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || "exemplo.com.br",
      objective: campaignData.objective || "awareness",
      product: campaignData.product || "",
      industry: campaignData.industry || "",
      targetAudience: campaignData.targetAudience || "",
      brandTone: campaignData.brandTone || "professional",
      language: campaignData.language || "", // Não forçar
      companyDescription: campaignData.companyDescription || campaignData.description || "",
      businessDescription: campaignData.businessDescription || "",
      uniqueSellingPoints: campaignData.uniqueSellingPoints || campaignData.differentials || [],
      callToAction: campaignData.callToAction || "Saiba mais",
      keywords: campaignData.keywords || []
    };

    // Language detection logic
    // Se não houver idioma definido, detecta do domínio
    if (!normalizedData.language) {
      const detectedLanguage = detectLanguageFromUrl(normalizedData.websiteUrl);
      normalizedData.language = detectedLanguage || "pt"; // Default para português se não detectar
      console.log(`Detected language from URL: ${normalizedData.language}`);
    }
    
    // Simplificar o código de idioma para processamento
    const simplifiedLangCode = getSimplifiedLanguageCode(normalizedData.language);
    console.log(`Using simplified language code: ${simplifiedLangCode}`);

    console.log("Processing ad generation with normalized data:", JSON.stringify(normalizedData, null, 2));
    
    // Generate ads based on platform
    let adsJson;
    let platformName;
    
    try {
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
        case "bing":
          adsJson = await generateMicrosoftAds(normalizedData, mindTrigger);
          platformName = "Microsoft/Bing Ads";
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      
      // Verificar se temos anúncios válidos
      if (!adsJson || !Array.isArray(adsJson) || adsJson.length === 0) {
        throw new Error(`No valid ads generated for platform: ${platform}`);
      }
      
      console.log(`Successfully generated ${adsJson.length} ads for ${platformName}`);
      
      return new Response(
        JSON.stringify({ success: true, data: adsJson }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error(`Error generating ads for ${platform}:`, error);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message || `Failed to generate ads for ${platform}` 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }
  } catch (error) {
    console.error("Error in generate-ads function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unknown error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
