
import { WebsiteData } from "./utils.ts";

export const createAudienceAnalysisPrompt = (websiteData: WebsiteData, platform?: string, language = 'en'): string => {
  // Determine the language-specific instructions
  const languageInstructions = getLanguageSpecificInstructions(language);
  
  // Determine which platform to analyze for
  const platformText = platform ? 
    `Focus specifically on the ${platform.toUpperCase()} ads platform.` : 
    'Analyze audience data for all major ad platforms (Google, Meta, LinkedIn).';
  
  // Construct the prompt with the language-specific instructions
  const prompt = `
${languageInstructions.systemPrompt}

${languageInstructions.analysisTask}

Company Information:
- Company Name: ${websiteData.companyName}
- Business Description: ${websiteData.businessDescription}
- Current Target Audience: ${websiteData.targetAudience}
- Brand Tone: ${websiteData.brandTone}
- Keywords: ${websiteData.keywords.join(', ')}
- Call To Action phrases: ${websiteData.callToAction.join(', ')}
- Unique Selling Points: ${websiteData.uniqueSellingPoints.join(', ')}
${websiteData.industry ? '- Industry: ' + websiteData.industry : ''}
${websiteData.websiteUrl ? '- Website URL: ' + websiteData.websiteUrl : ''}

${platformText}

${languageInstructions.outputFormat}
`;

  return prompt;
};

interface LanguageInstructions {
  systemPrompt: string;
  analysisTask: string;
  outputFormat: string;
}

function getLanguageSpecificInstructions(language: string): LanguageInstructions {
  // Default English instructions
  const defaultInstructions: LanguageInstructions = {
    systemPrompt: "You are an expert in digital marketing audience analysis with deep knowledge of all advertising platforms including Google Ads, Meta (Facebook/Instagram), and LinkedIn advertising. Your task is to analyze business information and determine the ideal target audience.",
    analysisTask: "Based on the following business information, provide a detailed audience analysis for digital advertising campaigns:",
    outputFormat: `Please provide your analysis in the following format:
1. A detailed overview of the ideal audience for this business
2. Demographic details (age groups, gender distribution, education level, income level)
3. Key interests that this audience has
4. Pain points this audience experiences that the business can solve
5. Decision factors that influence this audience's purchasing decisions`
  };
  
  // Portuguese instructions
  const ptInstructions: LanguageInstructions = {
    systemPrompt: "Você é um especialista em análise de público-alvo para marketing digital com profundo conhecimento de todas as plataformas de publicidade, incluindo Google Ads, Meta (Facebook/Instagram) e publicidade LinkedIn. Sua tarefa é analisar informações de negócios e determinar o público-alvo ideal.",
    analysisTask: "Com base nas seguintes informações comerciais, forneça uma análise detalhada do público-alvo para campanhas de publicidade digital:",
    outputFormat: `Por favor, forneça sua análise no seguinte formato:
1. Uma visão geral detalhada do público ideal para este negócio
2. Detalhes demográficos (faixas etárias, distribuição de gênero, nível de educação, nível de renda)
3. Principais interesses que este público possui
4. Pontos de dor que este público experimenta e que o negócio pode resolver
5. Fatores de decisão que influenciam as decisões de compra deste público`
  };
  
  // Spanish instructions
  const esInstructions: LanguageInstructions = {
    systemPrompt: "Eres un experto en análisis de audiencia para marketing digital con un profundo conocimiento de todas las plataformas publicitarias, incluyendo Google Ads, Meta (Facebook/Instagram) y publicidad en LinkedIn. Tu tarea es analizar la información del negocio y determinar la audiencia objetivo ideal.",
    analysisTask: "Basado en la siguiente información del negocio, proporciona un análisis detallado de la audiencia para campañas publicitarias digitales:",
    outputFormat: `Por favor, proporciona tu análisis en el siguiente formato:
1. Una descripción detallada de la audiencia ideal para este negocio
2. Detalles demográficos (grupos de edad, distribución de género, nivel educativo, nivel de ingresos)
3. Intereses clave que tiene esta audiencia
4. Puntos de dolor que experimenta esta audiencia y que el negocio puede resolver
5. Factores de decisión que influyen en las decisiones de compra de esta audiencia`
  };
  
  // Return the appropriate instructions based on the language
  switch (language.toLowerCase()) {
    case 'pt':
      return ptInstructions;
    case 'es':
      return esInstructions;
    default:
      return defaultInstructions;
  }
}
