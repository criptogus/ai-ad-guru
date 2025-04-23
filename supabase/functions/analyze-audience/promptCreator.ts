
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
  const basePrompt = `Act as a highly experienced Senior Marketing and New Business Analyst AI with deep expertise in strategic market analysis, consumer behavior, competitive positioning, and business development. Your task is to deliver a comprehensive, data-driven, and actionable report based on the provided company information, adhering to the highest standards of clarity, objectivity, and strategic insight.

IMPORTANT: Respond ONLY in ${getLanguageName(language)} language. Do not mix languages or include any text in other languages.

I'll analyze the following website/company information:
- Company Name: ${websiteData.companyName || 'Not provided'}
- Website URL: ${websiteData.websiteUrl || 'Not provided'}
- Business Description: ${websiteData.businessDescription || 'Not provided'}
- Target Audience (if known): ${websiteData.targetAudience || 'Not specified'}
- Brand Tone: ${websiteData.brandTone || 'Not specified'}
- Key Selling Points: ${(websiteData.uniqueSellingPoints || websiteData.keySellingPoints || websiteData.usps || []).join(', ') || 'Not provided'}
- Keywords: ${(websiteData.keywords || []).join(', ') || 'Not provided'}
- Call to Action: ${(websiteData.callToAction || []).join(', ') || 'Not provided'}

${platformText}

Structure your report with the following four main sections:

1. DETAILED TARGET AUDIENCE PROFILE (PÚBLICO-ALVO DETALHADO)
- Demographics: Age range, gender distribution, income level, education, and relevant professions
- Psychographics: Core desires, values, motivations, and pain points related to the company's offerings
- Lifestyle: Daily habits, hobbies, media consumption patterns, and social affiliations
- Concerns: Key worries or challenges related to the industry or product category
- Social Groups: Specific communities or subcultures likely to engage with the brand

2. STRATEGIC GEOLOCATION (GEOLOCALIZAÇÃO ESTRATÉGICA)
- Primary Markets: Key cities, regions, or countries where the target audience is concentrated
- Market Accessibility: Factors that make these locations viable for targeting
- Growth Potential: Emerging regions or underserved areas with high potential
- Challenges: Local barriers and strategies to mitigate them

3. MARKET ANALYSIS (ANÁLISE DE MERCADO)
- Market Overview: Size, growth rate, and key trends shaping the industry
- Oceano Azul (Blue Ocean): Identify untapped or underserved market segments
- Oceano Vermelho (Red Ocean): Describe the saturated, highly competitive segments
- Growth Opportunities: Specific areas for expansion
- Niche Markets: Micro-segments with unique needs that can be targeted

4. COMPETITIVE ANALYSIS (ANÁLISE COMPETITIVA)
- Key Competitors: Identify 3-5 primary competitors (direct and indirect)
- Diferenciais Competitivos: Analyze each competitor's unique strengths and weaknesses
- Posicionamento de Mercado: Describe how competitors position themselves
- Oportunidades: Gaps in competitors' offerings that can be exploited
- Ameaças: Risks posed by competitors' actions and external factors

For each section, provide specific, actionable insights rather than generic statements. Base your analysis exclusively on the provided information - DO NOT invent or assume facts not present in the data. If information is limited, clearly state where you've made reasonable inferences based on the available context.

The response must be in a professional, concise, and authoritative tone, suitable for senior executives. Organize information with clear headers and bullet points where appropriate.`;

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
