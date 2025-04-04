
import { WebsiteData } from "./utils.ts";

// Create audience analysis prompts based on website data and platform
export function createAudienceAnalysisPrompt(websiteData: WebsiteData, platform?: string, language: string = 'en'): string {
  // Extract the relevant content from website data
  const content = `
Company Name: ${websiteData.companyName || 'Unknown'}
Business Description: ${websiteData.businessDescription || 'Not provided'}
Target Audience: ${websiteData.targetAudience || 'Not specified'}
Brand Tone: ${websiteData.brandTone || 'Not specified'}
Keywords: ${websiteData.keywords ? websiteData.keywords.join(', ') : 'None provided'}
Unique Selling Points: ${websiteData.uniqueSellingPoints ? websiteData.uniqueSellingPoints.join(', ') : 'None provided'}
Call to Action: ${websiteData.callToAction ? websiteData.callToAction.join(', ') : 'None provided'}
Website URL: ${websiteData.websiteUrl || 'Not provided'}
  `;

  // Get language name for prompt
  const languageName = getLanguageName(language);
  
  // Create the prompt based on whether a specific platform is requested
  if (platform) {
    return `
You are a media strategist and audience analysis expert. Based on the following website content, provide a detailed audience targeting recommendation specifically for ${platform} ads. Write your entire response in ${languageName}.

${content}

Analyze this content to identify:
1. The company's market segment
2. Products or services offered
3. Positioning and tone of voice
4. Communication objective (sales, branding, lead generation, etc.)

Then, provide detailed targeting recommendations for ${platform} including:
- Recommended audience segments
- Demographics (age, gender, income, education level if applicable)
- Geographic targeting
- Interests and behaviors
- Device targeting
- Ad format recommendations
- Campaign objective recommendations

Provide your response as structured JSON with the following fields but ALSO include a detailed narrative analysis outside of the JSON structure:
{
  "demographics": {
    "ageGroups": ["25-34", "35-44"],
    "gender": ["Male", "Female"],
    "educationLevel": ["College", "Graduate"],
    "incomeLevel": ["Middle", "Upper-middle"]
  },
  "interests": ["Interest1", "Interest2", "Interest3"],
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "decisionFactors": ["Factor1", "Factor2", "Factor3"]
}

After the JSON, provide a narrative analysis explaining your recommendations in ${languageName}.
`;
  } else {
    // If no specific platform is requested, provide analysis for all platforms
    return `
You are a media strategist and audience analysis expert. Based on the following website content, provide a detailed audience targeting recommendation for Google Ads, Meta Ads (Facebook/Instagram), and LinkedIn Ads. Write your entire response in ${languageName}.

${content}

Analyze this content to identify:
1. The company's market segment
2. Products or services offered
3. Positioning and tone of voice
4. Communication objective (sales, branding, lead generation, etc.)

Then, provide detailed targeting recommendations for each platform.

Provide your response as structured JSON with the following fields but ALSO include a detailed narrative analysis outside of the JSON structure:
{
  "demographics": {
    "ageGroups": ["25-34", "35-44"],
    "gender": ["Male", "Female"],
    "educationLevel": ["College", "Graduate"],
    "incomeLevel": ["Middle", "Upper-middle"]
  },
  "interests": ["Interest1", "Interest2", "Interest3"],
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "decisionFactors": ["Factor1", "Factor2", "Factor3"]
}

After the JSON, provide a narrative analysis explaining your recommendations in ${languageName}.
`;
  }
}

// Helper function to get language name from ISO code
function getLanguageName(langCode: string): string {
  const languages: Record<string, string> = {
    'en': 'English',
    'pt': 'Portuguese',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'nl': 'Dutch',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic'
  };
  
  return languages[langCode] || 'English';
}
