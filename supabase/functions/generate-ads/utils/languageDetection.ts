
// Language detection utility functions

/**
 * Checks if text contains common English words
 */
export function isEnglishText(text: string): boolean {
  if (!text) return true; // Default to English if empty
  
  // Common English words
  const englishWords = ['the', 'and', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'you', 'it'];
  const lowerText = text.toLowerCase();
  
  return englishWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Checks if text contains common Portuguese words
 */
export function isPortugueseText(text: string): boolean {
  if (!text) return false;
  
  // Common Portuguese words
  const portugueseWords = ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao'];
  const lowerText = text.toLowerCase();
  
  return portugueseWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Checks if text contains common Spanish words
 */
export function isSpanishText(text: string): boolean {
  if (!text) return false;
  
  // Common Spanish words
  const spanishWords = ['de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'un', 'por', 'con', 'no', 'una', 'su', 'para', 'es', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'del', 'se', 'las'];
  const lowerText = text.toLowerCase();
  
  return spanishWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Detects languages present in ad content
 */
export function detectLanguagesInAdContent(ad: any): { 
  english: boolean, 
  portuguese: boolean, 
  spanish: boolean, 
  mixed: boolean 
} {
  const allText = [];
  
  // Extract all text content from the ad based on its shape
  if ('headlines' in ad) {
    // Google ad
    allText.push(...ad.headlines, ...ad.descriptions);
  } else {
    // Meta ad
    allText.push(ad.primaryText, ad.headline, ad.description);
  }
  
  // Detect languages in each text piece
  const hasEnglish = allText.some(isEnglishText);
  const hasPortuguese = allText.some(isPortugueseText);
  const hasSpanish = allText.some(isSpanishText);
  
  // Determine if languages are mixed
  const mixed = (hasEnglish && (hasPortuguese || hasSpanish)) || 
               (hasPortuguese && (hasEnglish || hasSpanish)) || 
               (hasSpanish && (hasEnglish || hasPortuguese));
  
  return {
    english: hasEnglish,
    portuguese: hasPortuguese,
    spanish: hasSpanish,
    mixed
  };
}
