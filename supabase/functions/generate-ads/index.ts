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

function detectLanguageFromUrl(url: string): string | null {
  if (!url) return null;
  const domain = url.toLowerCase();
  if (domain.includes(".br")) return "pt";
  if (domain.includes(".es")) return "es";
  if (domain.includes(".fr")) return "fr";
  if (domain.includes(".de")) return "de";
  if (domain.includes(".it")) return "it";
  if (domain.endsWith(".com") && !domain.endsWith(".com.br")) return "en";
  return null;
}

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

async function getUserIdFromJWT(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const jwt = authHeader.replace(/^Bearer /, "");
  if (!jwt) return null;

  const [, payloadBase64] = jwt.split(".");
  if (!payloadBase64) return null;
  try {
    const payload = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
    return payload.sub || payload.user_id || null;
  } catch (e) {
    return null;
  }
}

async function getUserCreditBalance(supabaseAdmin: any, userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("credit_balance")
    .select("balance")
    .eq("user_id", userId)
    .single();
  if (error || !data) return 0;
  return data.balance;
}

async function deductCredits(supabaseAdmin: any, userId: string, creditsToDeduct: number, action: string, context: any = {}) {
  const { error: ledgerError } = await supabaseAdmin
    .from("credit_ledger")
    .insert({
      user_id: userId,
      change: -creditsToDeduct,
      reason: action,
      ref_id: context?.ref_id || null
    });

  const { error: logError } = await supabaseAdmin
    .from("credit_logs")
    .insert({
      user_id: userId,
      action,
      credits_used: creditsToDeduct,
      context: JSON.stringify(context),
    });

  if (ledgerError || logError) {
    throw new Error(
      "Credit deduction failed: " +
        (ledgerError?.message || "") +
        (logError ? " (log: " + logError?.message + ")" : "")
    );
  }
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, campaignData, mindTrigger, temperature = 0.7 } = await req.json();

    const userId = await getUserIdFromJWT(req);
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing or invalid user session. Please log in."
      }), { headers: corsHeaders, status: 401 });
    }

    let creditsRequired = 0;
    let actionName = "";
    switch (platform) {
      case "google":
        creditsRequired = 5;
        actionName = "generate_google_ads";
        break;
      case "meta":
      case "instagram":
        creditsRequired = 5;
        actionName = "generate_meta_ads";
        break;
      case "microsoft":
      case "bing":
        creditsRequired = 5;
        actionName = "generate_microsoft_ads";
        break;
      case "linkedin":
        creditsRequired = 5;
        actionName = "generate_linkedin_ads";
        break;
      default:
        creditsRequired = 5;
        actionName = "generate_other_ads";
    }

    const balance = await getUserCreditBalance(supabaseAdmin, userId);
    if (balance < creditsRequired) {
      return new Response(JSON.stringify({
        success: false,
        error: "Not enough credits. Please purchase more credits."
      }), { headers: corsHeaders, status: 402 });
    }

    const normalizedData: WebsiteAnalysisResult = {
      companyName: campaignData.companyName,
      websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || "exemplo.com.br",
      objective: campaignData.objective || "awareness",
      product: campaignData.product || "",
      industry: campaignData.industry || "",
      targetAudience: campaignData.targetAudience || "",
      brandTone: campaignData.brandTone || "professional",
      language: campaignData.language || "",
      companyDescription: campaignData.companyDescription || campaignData.description || "",
      businessDescription: campaignData.businessDescription || "",
      uniqueSellingPoints: campaignData.uniqueSellingPoints || campaignData.differentials || [],
      callToAction: campaignData.callToAction || "Saiba mais",
      keywords: campaignData.keywords || []
    };

    if (!normalizedData.language) {
      const detectedLanguage = detectLanguageFromUrl(normalizedData.websiteUrl);
      normalizedData.language = detectedLanguage || "pt";
      console.log(`Detected language from URL: ${normalizedData.language}`);
    }
    
    const simplifiedLangCode = getSimplifiedLanguageCode(normalizedData.language);
    console.log(`Using simplified language code: ${simplifiedLangCode}`);

    console.log("Processing ad generation with normalized data:", JSON.stringify(normalizedData, null, 2));

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

      if (!adsJson || !Array.isArray(adsJson) || adsJson.length === 0) {
        throw new Error(`No valid ads generated for platform: ${platform}`);
      }

      try {
        await deductCredits(supabaseAdmin, userId, creditsRequired, actionName, {
          companyName: campaignData.companyName,
          platform,
          adsCount: adsJson.length,
        });
      } catch (deductErr) {
        console.error("❌ Failed to deduct credits:", deductErr);
        return new Response(JSON.stringify({
          success: false,
          error: "Credit deduction failed. Please contact support.",
        }), { headers: corsHeaders, status: 500 });
      }

      const afterBalance = await getUserCreditBalance(supabaseAdmin, userId);

      return new Response(
        JSON.stringify({
          success: true,
          data: adsJson,
          creditsRemaining: afterBalance,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error(`Error generating ads for ${platform}:`, error);

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || `Failed to generate ads for ${platform}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in generate-ads function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unknown error occurred",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
