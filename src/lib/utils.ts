import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, '');
  } catch (e) {
    console.error("Invalid URL", url, e);
    return '';
  }
};

/**
 * Normalizes a GoogleAd object to ensure it has all required fields
 */
export function normalizeGoogleAd(ad: any): GoogleAd {
  if (!ad) return {} as GoogleAd;
  
  // Ensure headlines and descriptions are always arrays
  const headlines = Array.isArray(ad.headlines) ? ad.headlines : [];
  const descriptions = Array.isArray(ad.descriptions) ? ad.descriptions : [];
  
  // Ensure siteLinks has the required format with 'link' property
  const siteLinks = Array.isArray(ad.siteLinks) 
    ? ad.siteLinks.map((link: any) => ({
        title: link.title || '',
        link: link.link || '#',
        description: link.description
      }))
    : [];
  
  return {
    id: ad.id,
    headline1: ad.headline1 || '',
    headline2: ad.headline2 || '',
    headline3: ad.headline3 || '',
    description1: ad.description1 || '',
    description2: ad.description2 || '',
    path1: ad.path1 || '',
    path2: ad.path2 || '',
    displayPath: ad.displayPath,
    headlines: headlines,
    descriptions: descriptions,
    siteLinks: siteLinks
  };
}

/**
 * Normalizes a MetaAd object to ensure it has all required fields
 */
export function normalizeMetaAd(ad: any): MetaAd {
  if (!ad) return {} as MetaAd;
  
  // Normalize hashtags field - ensure it's always an array or string
  let hashtags = ad.hashtags;
  if (hashtags === undefined || hashtags === null) {
    hashtags = [];
  }
  
  return {
    id: ad.id,
    headline: ad.headline || '',
    primaryText: ad.primaryText || '',
    description: ad.description || '',
    imagePrompt: ad.imagePrompt || '',
    imageUrl: ad.imageUrl || '',
    format: ad.format || 'feed',
    hashtags: hashtags,
    companyName: ad.companyName || ''
  };
}
