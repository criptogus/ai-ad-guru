
import { WebsiteData } from "./utils.ts";

export const createAudienceAnalysisPrompt = (
  websiteData: WebsiteData,
  platform?: string,
  language: string = 'en'
): string => {
  // Define platform-specific prompting
  const platformText = platform && platform !== 'all' 
    ? `Focus specifically on audiences for ${platform} ads.` 
    : 'Provide a general audience analysis that works across all major ad platforms.';
  
  // Build the base prompt with language awareness
  let basePrompt = `Analyze the following website data and create a detailed audience targeting profile for digital advertising.

Website Information:
- Company Name: ${websiteData.companyName || 'Not provided'}
- Website URL: ${websiteData.websiteUrl || 'Not provided'}
- Business Description: ${websiteData.businessDescription || 'Not provided'}
- Target Audience (if known): ${websiteData.targetAudience || 'Not specified'}
- Brand Tone: ${websiteData.brandTone || 'Not specified'}
- Key Selling Points: ${(websiteData.uniqueSellingPoints || websiteData.keySellingPoints || websiteData.usps || []).join(', ') || 'Not provided'}
- Keywords: ${(websiteData.keywords || []).join(', ') || 'Not provided'}
- Call to Action: ${(websiteData.callToAction || []).join(', ') || 'Not provided'}

${platformText}

Based on this information, please provide:

1. A comprehensive audience analysis in paragraph form (this will be displayed to the user).
2. Structured audience targeting data in these categories:
   - Demographics (age groups, gender, education level, income level)
   - Interests
   - Pain points
   - Decision factors

Format your response in a clear, structured way. Your analysis should be strategic and specific, not generic.`;

  // Add language-specific instructions
  if (language && language !== 'en') {
    basePrompt += `\n\nPlease provide your analysis in ${getLanguageName(language)} language.`;
  }
  
  return basePrompt;
};

// Helper function to get language name from code
function getLanguageName(langCode: string): string {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'pt': 'Portuguese',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'nl': 'Dutch',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ru': 'Russian',
    'ar': 'Arabic'
  };
  
  return languageMap[langCode] || 'the specified';
}
