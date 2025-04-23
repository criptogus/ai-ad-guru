
// Define the WebsiteData type for audience analysis
export interface WebsiteData {
  companyName?: string;
  websiteUrl?: string;
  businessDescription?: string;
  targetAudience?: string;
  brandTone?: string;
  uniqueSellingPoints?: string[];
  keySellingPoints?: string[];
  usps?: string[];
  keywords?: string[];
  callToAction?: string[];
  language?: string;
  industry?: string;
  product?: string;
}

// Helper function to determine the language from website data
export function detectLanguage(data: WebsiteData): string {
  // If language is explicitly set, use it
  if (data.language) {
    return data.language;
  }
  
  // Try to detect language from content
  const allText = [
    data.companyName || '',
    data.businessDescription || '',
    data.targetAudience || '',
    data.brandTone || '',
    (data.uniqueSellingPoints || []).join(' '),
    (data.keywords || []).join(' '),
    (data.callToAction || []).join(' ')
  ].join(' ').toLowerCase();
  
  // Simple language detection based on common words
  if (allText.match(/\b(e|o|da|de|em|para|que|com|os|as)\b/g)) {
    return 'pt';
  } else if (allText.match(/\b(y|el|la|los|las|en|para|que|con)\b/g)) {
    return 'es';
  } else if (allText.match(/\b(et|le|la|les|en|pour|que|avec)\b/g)) {
    return 'fr';
  }
  
  // Default to English
  return 'en';
}
