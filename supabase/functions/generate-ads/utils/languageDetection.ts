
// Language detection utility functions

/**
 * Checks if text contains common English words
 */
export function isEnglishText(text: string): boolean {
  if (!text) return false; // Changed default to false
  
  // Common English words
  const englishWords = ['the', 'and', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'you', 'it'];
  const lowerText = text.toLowerCase();
  
  // Count matches for better confidence
  let matchCount = 0;
  englishWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      matchCount++;
    }
  });
  
  // Return true if we have enough matches (at least 2)
  return matchCount >= 2;
}

/**
 * Checks if text contains common Portuguese words
 */
export function isPortugueseText(text: string): boolean {
  if (!text) return false;
  
  // Common Portuguese words
  const portugueseWords = ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao'];
  const lowerText = text.toLowerCase();
  
  // Count matches for better confidence
  let matchCount = 0;
  portugueseWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      matchCount++;
    }
  });
  
  // Return true if we have enough matches (at least 3 for Portuguese)
  return matchCount >= 3;
}

/**
 * Checks if text contains common Spanish words
 */
export function isSpanishText(text: string): boolean {
  if (!text) return false;
  
  // Common Spanish words
  const spanishWords = ['de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'un', 'por', 'con', 'no', 'una', 'su', 'para', 'es', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'del', 'se', 'las'];
  const lowerText = text.toLowerCase();
  
  // Count matches for better confidence
  let matchCount = 0;
  spanishWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      matchCount++;
    }
  });
  
  // Return true if we have enough matches (at least 3 for Spanish)
  return matchCount >= 3;
}

/**
 * Detects languages present in ad content
 */
export function detectLanguagesInAdContent(ad: any): { 
  english: boolean, 
  portuguese: boolean, 
  spanish: boolean, 
  mixed: boolean,
  primaryLanguage: 'en' | 'pt' | 'es' | 'unknown'
} {
  const allText = [];
  
  // Extract all text content from the ad based on its shape
  if ('headlines' in ad || 'headline1' in ad || 'headline_1' in ad) {
    // Google ad
    const headlines = [
      ad.headline1 || ad.headline_1 || ad.headlines?.[0] || '',
      ad.headline2 || ad.headline_2 || ad.headlines?.[1] || '',
      ad.headline3 || ad.headline_3 || ad.headlines?.[2] || ''
    ].filter(Boolean);
    
    const descriptions = [
      ad.description1 || ad.description_1 || ad.descriptions?.[0] || '',
      ad.description2 || ad.description_2 || ad.descriptions?.[1] || ''
    ].filter(Boolean);
    
    allText.push(...headlines, ...descriptions);
  } else {
    // Meta ad
    if (ad.primaryText) allText.push(ad.primaryText);
    if (ad.headline) allText.push(ad.headline);
    if (ad.description) allText.push(ad.description);
  }
  
  // Join all text for more comprehensive analysis
  const fullText = allText.join(' ');
  
  // Detect languages in the combined text for better accuracy
  const hasEnglish = isEnglishText(fullText);
  const hasPortuguese = isPortugueseText(fullText);
  const hasSpanish = isSpanishText(fullText);
  
  // Determine if languages are mixed
  const mixed = (hasEnglish && (hasPortuguese || hasSpanish)) || 
               (hasPortuguese && (hasEnglish || hasSpanish)) || 
               (hasSpanish && (hasEnglish || hasPortuguese));
  
  // Determine primary language based on presence
  let primaryLanguage: 'en' | 'pt' | 'es' | 'unknown' = 'unknown';
  
  if (hasPortuguese && !hasEnglish && !hasSpanish) {
    primaryLanguage = 'pt';
  } else if (hasSpanish && !hasEnglish && !hasPortuguese) {
    primaryLanguage = 'es';
  } else if (hasEnglish && !hasPortuguese && !hasSpanish) {
    primaryLanguage = 'en';
  } else if (hasPortuguese && (hasEnglish || hasSpanish)) {
    // If mixed but Portuguese is present, prioritize it
    primaryLanguage = 'pt';
  } else if (hasSpanish) {
    primaryLanguage = 'es';
  } else if (hasEnglish) {
    primaryLanguage = 'en';
  }
  
  return {
    english: hasEnglish,
    portuguese: hasPortuguese,
    spanish: hasSpanish,
    mixed,
    primaryLanguage
  };
}

/**
 * Returns language code based on language detection or fallback
 */
export function detectLanguageCode(text: string | undefined, fallback = 'pt'): 'en' | 'pt' | 'es' {
  if (!text) return fallback as 'en' | 'pt' | 'es';
  
  // Check the text for specific language markers
  if (isPortugueseText(text)) return 'pt';
  if (isSpanishText(text)) return 'es';
  if (isEnglishText(text)) return 'en';
  
  // Default to fallback if no language detected
  return fallback as 'en' | 'pt' | 'es';
}

/**
 * Detect language from a locale string like pt-BR, en-US
 */
export function getLanguageFromLocale(locale: string | undefined): 'en' | 'pt' | 'es' {
  if (!locale) return 'pt'; // Default to Portuguese
  
  const lang = locale.split('-')[0].toLowerCase();
  
  if (lang === 'pt') return 'pt';
  if (lang === 'es') return 'es';
  return 'en';
}

/**
 * Validate that ad content matches the expected language
 */
export function validateAdLanguage(ad: any, expectedLanguage: string): boolean {
  const languages = detectLanguagesInAdContent(ad);
  
  switch (expectedLanguage.toLowerCase()) {
    case 'pt':
    case 'pt-br':
      return languages.portuguese && !languages.mixed;
    case 'es':
    case 'es-es':
      return languages.spanish && !languages.mixed;
    case 'en':
    case 'en-us':
    default:
      return languages.english && !languages.mixed;
  }
}

/**
 * Get language display name from code
 */
export function getLanguageDisplayName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    fr: "French",
    de: "German",
    "pt-br": "Brazilian Portuguese",
    "en-us": "American English"
  };
  
  return languages[code.toLowerCase()] || code;
}
