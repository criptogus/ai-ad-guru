
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
  
  // Determine likely country context from website data or default to Brazil
  const countryContext = determineCountryContext(websiteData);
  
  // Build the base prompt with language awareness
  const basePrompt = `Act as a highly experienced Senior Marketing and New Business Analyst AI with deep expertise in strategic market analysis, consumer behavior, competitive positioning, and business development. Your task is to deliver a comprehensive, data-driven, and actionable report based on the provided company information, adhering to the highest standards of clarity, objectivity, and strategic insight.

IMPORTANT: Respond ONLY in ${getLanguageName(language)} language. Do not mix languages or include any text in other languages.

VERY IMPORTANT: This analysis should be specifically focused on ${countryContext}. All geographic recommendations, competitor analysis, and market insights should be relevant to this geographic context. Do NOT recommend locations outside ${countryContext} unless explicitly stated in the company information.

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

The report must address the following sections with precision and depth, leveraging industry best practices, analytical frameworks (e.g., SWOT, Porter's Five Forces, Blue Ocean Strategy), and real-world market dynamics. If specific company details are limited, make reasonable assumptions based on the provided context and clearly state them, ensuring the analysis remains grounded and adaptable.

Structure your report with the following four main sections:

1. PUBLIC TARGET PROFILE (PERFIL DO PÚBLICO-ALVO)
- Demographics: Age range, gender distribution, income level, education, and relevant professions
- Psychographics: Core desires, values, motivations, and pain points related to the company's offerings
- Lifestyle: Daily habits, hobbies, media consumption patterns, and social affiliations
- Concerns: Key worries or challenges related to the industry or product category
- Social Groups: Specific communities or subcultures likely to engage with the brand

2. GEOLOCATION ANALYSIS (ANÁLISE DE GEOLOCALIZAÇÃO)
- Primary Markets: Key cities, regions, or countries where the target audience is concentrated - SPECIFICALLY IN ${countryContext}
- Market Accessibility: Factors that make these locations viable for targeting
- Growth Potential: Emerging regions or underserved areas with high potential
- Challenges: Local barriers and strategies to mitigate them

3. MARKET ANALYSIS (ANÁLISE DE MERCADO)
- Market Overview: Size, growth rate, and key trends shaping the industry in ${countryContext}
- Oceano Azul (Blue Ocean): Identify untapped or underserved market segments
- Oceano Vermelho (Red Ocean): Describe the saturated, highly competitive segments
- Growth Opportunities: Specific areas for expansion
- Niche Markets: Micro-segments with unique needs that can be targeted

4. COMPETITOR INSIGHTS (INSIGHTS DOS CONCORRENTES)
- Key Competitors: Identify 3-5 primary competitors (direct and indirect) IN ${countryContext}
- Diferenciais Competitivos: Analyze each competitor's unique strengths and weaknesses
- Posicionamento de Mercado: Describe how competitors position themselves
- Oportunidades: Gaps in competitors' offerings that can be exploited
- Ameaças: Risks posed by competitors' actions and external factors

For each section, provide specific, actionable insights rather than generic statements. Base your analysis exclusively on the provided information - DO NOT invent or assume facts not present in the data. If information is limited, clearly state where you've made reasonable inferences based on the available context.

The response must be in a professional, concise, and authoritative tone, suitable for senior executives. Organize information with clear headers and bullet points where appropriate.`;

  return basePrompt;
};

// Helper function to determine country context from website data
function determineCountryContext(websiteData: WebsiteData): string {
  // Check if there's any explicit country information
  const allText = [
    websiteData.companyName || '',
    websiteData.websiteUrl || '',
    websiteData.businessDescription || '',
    websiteData.targetAudience || '',
    websiteData.brandTone || '',
    (websiteData.uniqueSellingPoints || []).join(' '),
    (websiteData.keywords || []).join(' '),
    (websiteData.callToAction || []).join(' ')
  ].join(' ').toLowerCase();
  
  // Look for URL TLD
  if (websiteData.websiteUrl) {
    if (websiteData.websiteUrl.endsWith('.br')) {
      return 'Brazil';
    }
    if (websiteData.websiteUrl.endsWith('.pt')) {
      return 'Portugal';
    }
    if (websiteData.websiteUrl.endsWith('.mx')) {
      return 'Mexico';
    }
    if (websiteData.websiteUrl.endsWith('.es')) {
      return 'Spain';
    }
  }
  
  // Look for mentions of country names
  if (allText.includes('brasil') || allText.includes('brazil')) {
    return 'Brazil';
  }
  if (allText.includes('portugal')) {
    return 'Portugal';
  }
  if (allText.includes('méxico') || allText.includes('mexico')) {
    return 'Mexico';
  }
  if (allText.includes('españa') || allText.includes('spain')) {
    return 'Spain';
  }
  
  // Default to Brazil if no country detected
  return 'Brazil';
}

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
