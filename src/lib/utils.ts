
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Normalize Google Ad data from API response to our internal format
export function normalizeGoogleAd(ad: Partial<GoogleAd> | any): GoogleAd {
  // Check if we already have the normalized format (has headline1, headline2, etc.)
  if (ad.headline1 || ad.headlines) {
    // Create a properly structured ad
    const normalizedAd: GoogleAd = {
      headline1: ad.headline1 || ad.headlines?.[0] || '',
      headline2: ad.headline2 || ad.headlines?.[1] || '',
      headline3: ad.headline3 || ad.headlines?.[2] || '',
      description1: ad.description1 || ad.descriptions?.[0] || '',
      description2: ad.description2 || ad.descriptions?.[1] || '',
      path1: ad.path1 || '',
      path2: ad.path2 || '',
      displayPath: ad.displayPath || '',
      siteLinks: ad.siteLinks || [],
      finalUrl: ad.finalUrl || '',
    };

    // Ensure headlines and descriptions arrays exist
    normalizedAd.headlines = normalizedAd.headlines || [
      normalizedAd.headline1,
      normalizedAd.headline2,
      normalizedAd.headline3,
    ].filter(Boolean);
    
    normalizedAd.descriptions = normalizedAd.descriptions || [
      normalizedAd.description1,
      normalizedAd.description2,
    ].filter(Boolean);

    return normalizedAd;
  }

  // Handle API response format (headline_1, description_1, etc.)
  if (ad.headline_1 || ad.display_url) {
    return {
      headline1: ad.headline_1 || '',
      headline2: ad.headline_2 || '',
      headline3: ad.headline_3 || '',
      description1: ad.description_1 || '',
      description2: ad.description_2 || '',
      path1: '',
      path2: '',
      displayPath: ad.display_url || '',
      siteLinks: [],
      finalUrl: ad.final_url || '',
      headlines: [ad.headline_1, ad.headline_2, ad.headline_3].filter(Boolean),
      descriptions: [ad.description_1, ad.description_2].filter(Boolean),
    };
  }

  // Fallback for empty/unknown format
  return {
    headline1: '',
    headline2: '',
    headline3: '',
    description1: '',
    description2: '',
    path1: '',
    path2: '',
    displayPath: '',
    siteLinks: [],
    finalUrl: '',
    headlines: [],
    descriptions: [],
  };
}

// Normalize Meta Ad data from API response to our internal format
export function normalizeMetaAd(ad: Partial<MetaAd> | any): MetaAd {
  // Check if we already have the normalized format
  if (ad.headline || ad.primaryText) {
    // Create a properly structured ad
    return {
      headline: ad.headline || '',
      primaryText: ad.primaryText || '',
      description: ad.description || '',
      imagePrompt: ad.imagePrompt || '',
      imageUrl: ad.imageUrl || '',
      format: ad.format || 'feed',
      hashtags: ad.hashtags || [],
      callToAction: ad.callToAction || '',
    };
  }

  // Handle API response format
  if (ad.text || ad.image_prompt) {
    const primaryText = ad.text || '';
    const headline = primaryText.split('\n')[0] || '';

    return {
      headline: headline,
      primaryText: primaryText,
      description: ad.description || '',
      imagePrompt: ad.image_prompt || '',
      imageUrl: ad.image_url || '',
      format: ad.format || 'feed',
      hashtags: extractHashtags(primaryText),
      callToAction: ad.call_to_action || '',
    };
  }

  // Fallback for empty/unknown format
  return {
    headline: '',
    primaryText: '',
    description: '',
    imagePrompt: '',
    imageUrl: '',
    format: 'feed',
    hashtags: [],
    callToAction: '',
  };
}

// Extract hashtags from text
function extractHashtags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches : [];
}
