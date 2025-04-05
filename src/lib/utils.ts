
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
 * Normalizes a GoogleAd object by ensuring it has both individual fields (headline1, headline2, etc.)
 * and array fields (headlines, descriptions) for compatibility
 */
export const normalizeGoogleAd = (ad: Partial<GoogleAd>): GoogleAd => {
  if (!ad) return {
    headline1: '',
    headline2: '',
    headline3: '',
    description1: '',
    description2: '',
    path1: '',
    path2: '',
    headlines: [],
    descriptions: [],
    siteLinks: []
  };
  
  // Create headlines array if it doesn't exist
  const headlines = ad.headlines || [
    ad.headline1 || '',
    ad.headline2 || '',
    ad.headline3 || ''
  ];
  
  // Create descriptions array if it doesn't exist
  const descriptions = ad.descriptions || [
    ad.description1 || '',
    ad.description2 || ''
  ];
  
  const normalizedAd: GoogleAd = { 
    headline1: ad.headline1 || headlines[0] || '',
    headline2: ad.headline2 || headlines[1] || '',
    headline3: ad.headline3 || headlines[2] || '',
    description1: ad.description1 || descriptions[0] || '',
    description2: ad.description2 || descriptions[1] || '',
    path1: ad.path1 || '',
    path2: ad.path2 || '',
    headlines: headlines,
    descriptions: descriptions,
    siteLinks: ad.siteLinks || [],
    displayPath: ad.displayPath,
    finalUrl: ad.finalUrl,
    id: ad.id
  };
  
  // Ensure siteLinks have link property
  if (normalizedAd.siteLinks && Array.isArray(normalizedAd.siteLinks)) {
    normalizedAd.siteLinks = normalizedAd.siteLinks.map((siteLink: any) => {
      if (!siteLink.link) {
        return { ...siteLink, link: '#' };
      }
      return siteLink;
    });
  }
  
  return normalizedAd;
};

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
  // Use GoogleAd normalization and explicitly ensure headlines/descriptions
  const baseAd = normalizeGoogleAd(ad);
  return {
    ...baseAd,
    headlines: baseAd.headlines,
    descriptions: baseAd.descriptions
  };
}
