import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd } from "@/hooks/adGeneration";

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
export const normalizeGoogleAd = (ad: GoogleAd): GoogleAd => {
  if (!ad) return ad;
  
  const normalizedAd: any = { ...ad };
  
  // Initialize arrays if they don't exist
  if (!normalizedAd.headlines) {
    normalizedAd.headlines = [
      normalizedAd.headline1 || '',
      normalizedAd.headline2 || '',
      normalizedAd.headline3 || ''
    ];
  }
  
  if (!normalizedAd.descriptions) {
    normalizedAd.descriptions = [
      normalizedAd.description1 || '',
      normalizedAd.description2 || ''
    ];
  }
  
  // Ensure individual fields exist too
  if (!normalizedAd.headline1 && normalizedAd.headlines?.[0]) {
    normalizedAd.headline1 = normalizedAd.headlines[0];
  }
  
  if (!normalizedAd.headline2 && normalizedAd.headlines?.[1]) {
    normalizedAd.headline2 = normalizedAd.headlines[1];
  }
  
  if (!normalizedAd.headline3 && normalizedAd.headlines?.[2]) {
    normalizedAd.headline3 = normalizedAd.headlines[2];
  }
  
  if (!normalizedAd.description1 && normalizedAd.descriptions?.[0]) {
    normalizedAd.description1 = normalizedAd.descriptions[0];
  }
  
  if (!normalizedAd.description2 && normalizedAd.descriptions?.[1]) {
    normalizedAd.description2 = normalizedAd.descriptions[1];
  }
  
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
  // Ensure Microsoft Ad has the same structure as Google Ad plus any specific properties
  const normalizedGoogleAd = normalizeGoogleAd(ad);
  return {
    ...normalizedGoogleAd,
    // Add any Microsoft-specific properties here if needed
  };
}
