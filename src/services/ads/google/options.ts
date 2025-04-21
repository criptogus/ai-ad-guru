
/**
 * Google Ads Options
 * Contains options and formatting utilities for Google ads
 */

export interface AdFormatOptions {
  maxLength: number;
  recommendedLength: number;
  minRecommendedLength?: number;
  description?: string;
}

export const getHeadlineOptions = (): AdFormatOptions => {
  return {
    maxLength: 30,
    recommendedLength: 25,
    minRecommendedLength: 10,
    description: "Headlines should be short, impactful, and include keywords when possible."
  };
};

export const getDescriptionOptions = (): AdFormatOptions => {
  return {
    maxLength: 90,
    recommendedLength: 80,
    minRecommendedLength: 40,
    description: "Descriptions should provide more detail about your offering and include a clear call to action."
  };
};

export const getPathOptions = (): AdFormatOptions => {
  return {
    maxLength: 15,
    recommendedLength: 10,
    description: "Paths should be relevant to your landing page URL and help users understand where they'll go."
  };
};

export const formatGoogleAdText = (text: string): string => {
  if (!text) return '';
  
  // Ensure there's a space after periods, commas, and other punctuation
  let formattedText = text.replace(/([.,:;!?])([^\s])/g, '$1 $2');
  
  // Ensure proper capitalization at the start of sentences
  formattedText = formattedText.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
  
  return formattedText;
};

export const normalizeDescriptions = (descriptions: string[]): string[] => {
  if (!descriptions || !descriptions.length) return [];
  
  return descriptions.map(desc => formatGoogleAdText(desc));
};

