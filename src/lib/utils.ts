
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    // If URL parsing fails, just return the string
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

/**
 * Normalize a GoogleAd object to ensure it has headlines and descriptions arrays
 */
export const normalizeGoogleAd = (ad: any): GoogleAd => {
  if (!ad) return {} as GoogleAd;
  
  // Create a new object with all properties from the original ad
  const normalizedAd = { ...ad };
  
  // Ensure headlines array exists
  if (!normalizedAd.headlines) {
    normalizedAd.headlines = [
      normalizedAd.headline1 || '',
      normalizedAd.headline2 || '',
      normalizedAd.headline3 || ''
    ];
  }
  
  // Ensure descriptions array exists
  if (!normalizedAd.descriptions) {
    normalizedAd.descriptions = [
      normalizedAd.description1 || '',
      normalizedAd.description2 || ''
    ];
  }

  // Ensure siteLinks array includes link property
  if (normalizedAd.siteLinks) {
    normalizedAd.siteLinks = normalizedAd.siteLinks.map((link: any) => ({
      ...link,
      link: link.link || '#'
    }));
  }
  
  return normalizedAd as GoogleAd;
};

/**
 * Normalize a MetaAd object to ensure it has all required properties
 */
export const normalizeMetaAd = (ad: any): MetaAd => {
  if (!ad) return {} as MetaAd;
  
  // Create a new object with all properties from the original ad
  const normalizedAd = { ...ad };
  
  // Ensure format property exists with default value
  if (!normalizedAd.format) {
    normalizedAd.format = "feed";
  }
  
  // Ensure hashtags property exists as empty array if not present
  if (!normalizedAd.hashtags) {
    normalizedAd.hashtags = [];
  }
  
  return normalizedAd as MetaAd;
};
