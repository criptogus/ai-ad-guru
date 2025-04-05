
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd, MetaAd, MicrosoftAd } from "@/hooks/adGeneration/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith("www.") ? domain.substring(4) : domain;
  } catch (error) {
    return url.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
  }
}

/**
 * Normalize GoogleAd object to ensure it has both individual properties and arrays
 */
export function normalizeGoogleAd(ad: Partial<GoogleAd>): GoogleAd {
  // Create headlines array if it doesn't exist
  const headlines = ad.headlines || [
    ad.headline1 || "",
    ad.headline2 || "",
    ad.headline3 || "",
  ];
  
  // Create descriptions array if it doesn't exist
  const descriptions = ad.descriptions || [
    ad.description1 || "",
    ad.description2 || "",
  ];
  
  // Create a new object with all properties
  return {
    headline1: ad.headline1 || headlines[0] || "",
    headline2: ad.headline2 || headlines[1] || "",
    headline3: ad.headline3 || headlines[2] || "",
    description1: ad.description1 || descriptions[0] || "",
    description2: ad.description2 || descriptions[1] || "",
    path1: ad.path1 || "",
    path2: ad.path2 || "",
    displayPath: ad.displayPath,
    headlines: headlines,
    descriptions: descriptions,
    siteLinks: ad.siteLinks || [],
    finalUrl: ad.finalUrl,
    id: ad.id
  };
}

/**
 * Normalize MetaAd object to ensure it has all needed properties
 */
export function normalizeMetaAd(ad: Partial<MetaAd>): MetaAd {
  return {
    headline: ad.headline || "",
    primaryText: ad.primaryText || "",
    description: ad.description || "",
    imagePrompt: ad.imagePrompt || "",
    imageUrl: ad.imageUrl,
    format: ad.format || "feed",
    hashtags: ad.hashtags || [],
    companyName: ad.companyName || "",
    finalUrl: ad.finalUrl
  };
}

/**
 * Normalize MicrosoftAd object (reusing Google Ad normalization as they share structure)
 */
export function normalizeMicrosoftAd(ad: Partial<MicrosoftAd>): MicrosoftAd {
  // Ensure Microsoft Ad has the same structure as Google Ad plus any specific properties
  const normalizedGoogleAd = normalizeGoogleAd(ad);
  return {
    ...normalizedGoogleAd,
    // Add any Microsoft-specific properties here if needed
  };
}
