
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: Date | string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// Add the missing getDomain function
export function getDomain(url: string): string {
  if (!url) return "";
  try {
    // Add protocol if missing
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }
    
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./i, '');
  } catch (e) {
    // If URL parsing fails, try to extract domain manually
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
    return domainMatch ? domainMatch[1] : url;
  }
}

// Utility function to convert Google Ad from API response format to app format
export function normalizeGoogleAd(ad: any): any {
  // Handle direct structure from OpenAI response (google_ads format)
  if (ad.headline_1 || ad.headline_2 || ad.headline_3) {
    return {
      headline1: ad.headline_1 || '',
      headline2: ad.headline_2 || '',
      headline3: ad.headline_3 || '',
      description1: ad.description_1 || '',
      description2: ad.description_2 || '',
      displayPath: ad.display_url || '',
      headlines: [ad.headline_1 || '', ad.headline_2 || '', ad.headline_3 || ''],
      descriptions: [ad.description_1 || '', ad.description_2 || '']
    };
  }
  
  // Handle existing app format (ensuring both old and new fields exist)
  const normalizedAd = { ...ad };
  
  // Ensure headlines array exists
  if (!normalizedAd.headlines) {
    normalizedAd.headlines = [
      normalizedAd.headline1 || '',
      normalizedAd.headline2 || '',
      normalizedAd.headline3 || ''
    ];
  }
  
  // Ensure headline1/2/3 fields exist
  if (!normalizedAd.headline1) normalizedAd.headline1 = normalizedAd.headlines[0] || '';
  if (!normalizedAd.headline2) normalizedAd.headline2 = normalizedAd.headlines[1] || '';
  if (!normalizedAd.headline3) normalizedAd.headline3 = normalizedAd.headlines[2] || '';
  
  // Ensure descriptions array exists
  if (!normalizedAd.descriptions) {
    normalizedAd.descriptions = [
      normalizedAd.description1 || '',
      normalizedAd.description2 || ''
    ];
  }
  
  // Ensure description1/2 fields exist
  if (!normalizedAd.description1) normalizedAd.description1 = normalizedAd.descriptions[0] || '';
  if (!normalizedAd.description2) normalizedAd.description2 = normalizedAd.descriptions[1] || '';
  
  return normalizedAd;
}

// Utility function to convert Meta Ad from API response format to app format
export function normalizeMetaAd(ad: any): any {
  // Handle direct structure from OpenAI response (instagram_ads format)
  if (ad.text || ad.image_prompt) {
    return {
      primaryText: ad.text || '',
      headline: ad.headline || '',
      description: ad.description || '',
      imagePrompt: ad.image_prompt || '',
      imageUrl: ad.image_url || ''
    };
  }
  
  // Handle existing app format
  const normalizedAd = { ...ad };
  
  // Ensure all required fields exist
  if (!normalizedAd.primaryText) normalizedAd.primaryText = '';
  if (!normalizedAd.headline) normalizedAd.headline = '';
  if (!normalizedAd.description) normalizedAd.description = '';
  if (!normalizedAd.imagePrompt) normalizedAd.imagePrompt = '';
  
  return normalizedAd;
}
