
import { supabase } from "@/integrations/supabase/client";
import { GoogleAd, MetaAd, LinkedInAd, MicrosoftAd } from "@/hooks/adGeneration/types";
import { useToast } from "@/hooks/use-toast";

export interface AdGenerationParams {
  companyName: string;
  websiteUrl: string;
  companyDescription?: string;
  product?: string;
  objective?: string;
  targetAudience?: string;
  brandTone?: string;
  platforms: string[];
}

export const generateAds = async (params: AdGenerationParams): Promise<Record<string, any[]>> => {
  const result: Record<string, any[]> = {};
  
  // Process each platform in parallel
  await Promise.all(params.platforms.map(async (platform) => {
    try {
      // Call the generate-premium-ads function for each platform
      const { data, error } = await supabase.functions.invoke("generate-premium-ads", {
        body: {
          platform,
          campaignData: {
            ...params,
            language: "portuguese", // Default to Portuguese
          }
        }
      });

      if (error) {
        console.error(`Error generating ads for ${platform}:`, error);
        throw new Error(`Erro ao gerar anúncios para ${platform}: ${error.message}`);
      }
      
      if (data?.success && Array.isArray(data.data)) {
        result[platform] = normalizeAdsForPlatform(data.data, platform);
      } else {
        console.error(`Invalid response for ${platform}:`, data);
        throw new Error(`Resposta inválida para ${platform}`);
      }
    } catch (err) {
      console.error(`Failed to generate ads for ${platform}:`, err);
      // Add empty array to show the platform in UI but with no ads
      result[platform] = [];
    }
  }));
  
  return result;
};

// Normalize ads to ensure consistent structure based on platform
function normalizeAdsForPlatform(ads: any[], platform: string): any[] {
  switch (platform) {
    case 'google':
      return ads.map(ad => ({
        headline1: ad.headline1 || ad.headline_1 || "",
        headline2: ad.headline2 || ad.headline_2 || "",
        headline3: ad.headline3 || ad.headline_3 || "",
        description1: ad.description1 || ad.description_1 || "",
        description2: ad.description2 || ad.description_2 || "",
        path1: ad.path1 || ad.displayPath1 || "",
        path2: ad.path2 || ad.displayPath2 || "",
        isComplete: true
      }));
    
    case 'meta':
      return ads.map(ad => ({
        headline: ad.headline || ad.title || "",
        primaryText: ad.primaryText || ad.primary_text || ad.text || "",
        description: ad.description || "",
        imagePrompt: ad.imagePrompt || ad.image_prompt || "",
        isComplete: true
      }));
    
    case 'linkedin':
      return ads.map(ad => ({
        headline: ad.headline || ad.title || "",
        primaryText: ad.primaryText || ad.primary_text || ad.text || "",
        description: ad.description || "",
        imagePrompt: ad.imagePrompt || ad.image_prompt || "",
        isComplete: true
      }));
    
    case 'microsoft':
      return ads.map(ad => ({
        headline1: ad.headline1 || ad.headline_1 || "",
        headline2: ad.headline2 || ad.headline_2 || "",
        headline3: ad.headline3 || ad.headline_3 || "",
        description1: ad.description1 || ad.description_1 || "",
        description2: ad.description2 || ad.description_2 || "",
        path1: ad.path1 || ad.displayPath1 || "",
        path2: ad.path2 || ad.displayPath2 || "",
        isComplete: true
      }));
    
    default:
      return ads;
  }
}

// Track credit usage for ad generation
export const trackAdGenerationCredits = async (
  userId: string, 
  platforms: string[], 
  adsCount: number
): Promise<void> => {
  try {
    // Record credit usage
    await supabase.from('credit_logs').insert({
      user_id: userId,
      credits_used: calculateCreditCost(platforms, adsCount),
      action: 'generate_ads',
      context: { platforms, adsCount }
    });
  } catch (error) {
    console.error('Failed to track credit usage:', error);
  }
};

// Calculate credit cost based on platform and number of ads
function calculateCreditCost(platforms: string[], adsCount: number): number {
  // Base cost per platform
  const platformCost: Record<string, number> = {
    google: 5,
    meta: 5,
    linkedin: 8,
    microsoft: 5
  };
  
  // Sum up costs for all platforms
  return platforms.reduce((total, platform) => {
    return total + (platformCost[platform] || 5);
  }, 0);
}
