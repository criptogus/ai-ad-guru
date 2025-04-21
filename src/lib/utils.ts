import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    console.error("Invalid URL", url, e);
    return url;
  }
}

/**
 * Normalize text for Google Ads by ensuring proper spacing after periods
 */
export const normalizeGoogleAdText = (text: string): string => {
  if (!text) return '';
  // Replace a period followed directly by a character with a period, space, and that character
  return text.replace(/\.(\S)/g, '. $1');
};

/**
 * Normalize Google ad object to ensure proper spacing after periods
 */
export const normalizeGoogleAd = (ad: any): any => {
  // Fix spacing after periods in all headlines and descriptions
  const fixSpacing = (text: string) => normalizeGoogleAdText(text);

  // Create new ad object with fixed text
  return {
    ...ad,
    headline1: fixSpacing(ad.headline1),
    headline2: fixSpacing(ad.headline2),
    headline3: fixSpacing(ad.headline3),
    description1: fixSpacing(ad.description1),
    description2: fixSpacing(ad.description2),
    headlines: ad.headlines?.map(fixSpacing) || [],
    descriptions: ad.descriptions?.map(fixSpacing) || [],
  };
};

/**
 * Normalize Meta ad object
 */
export const normalizeMetaAd = (ad: any): any => {
  if (!ad) return {};
  
  // Ensure the ad has required properties
  return {
    ...ad,
    format: ad.format || "feed",
    hashtags: ad.hashtags || [],
    // Add other default properties as needed
  };
};
