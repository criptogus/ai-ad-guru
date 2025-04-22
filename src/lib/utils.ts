
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extract domain from URL
export function getDomain(url: string): string {
  try {
    // Add protocol if missing
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch (e) {
    // Return the original string if it's not a valid URL
    return url.replace(/^www\./, '');
  }
}

// Normalize Google Ad data from OpenAI API response
export function normalizeGoogleAd(ad: any): GoogleAd {
  return {
    headline1: ad.headline_1 || ad.headlines?.[0] || "Headline 1",
    headline2: ad.headline_2 || ad.headlines?.[1] || "Headline 2",
    headline3: ad.headline_3 || ad.headlines?.[2] || "Headline 3",
    description1: ad.description_1 || ad.descriptions?.[0] || "Description 1",
    description2: ad.description_2 || ad.descriptions?.[1] || "Description 2",
    displayPath: ad.display_url || ad.displayPath || "example.com",
    finalUrl: ad.final_url || ad.finalUrl,
    path1: ad.path1,
    path2: ad.path2
  };
}

// Normalize Meta Ad data from OpenAI API response
export function normalizeMetaAd(ad: any): MetaAd {
  return {
    primaryText: ad.text || ad.primaryText || "",
    headline: ad.headline || ad.title || "",
    description: ad.description || "",
    imagePrompt: ad.image_prompt || ad.imagePrompt || "",
    imageUrl: ad.image_url || ad.imageUrl || "",
    format: ad.format || "square"
  };
}
