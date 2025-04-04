
export interface AnalysisResult {
  success: boolean;
  platform: string;
  analysisText: string;
  demographics?: {
    ageGroups: string[];
    gender: string[];
    educationLevel: string[];
    incomeLevel: string[];
  };
  interests?: string[];
  painPoints?: string[];
  decisionFactors?: string[];
  language?: string;
}

export const parseAnalysisResponse = (responseText: string, platform?: string): AnalysisResult => {
  try {
    // Default structure for the analysis result
    const analysisResult: AnalysisResult = {
      success: true,
      platform: platform || 'all',
      analysisText: responseText,
      demographics: {
        ageGroups: [],
        gender: [],
        educationLevel: [],
        incomeLevel: []
      },
      interests: [],
      painPoints: [],
      decisionFactors: []
    };

    // Attempt to extract structured data from the response
    // This basic implementation looks for certain keywords in different languages
    
    // Extract age groups
    analysisResult.demographics!.ageGroups = extractDataByKeywords(
      responseText, 
      ['age', 'idade', 'edad'], 
      ['years', 'anos', 'años']
    );
    
    // Extract gender
    analysisResult.demographics!.gender = extractDataByKeywords(
      responseText, 
      ['gender', 'gênero', 'género'], 
      ['male', 'female', 'masculino', 'feminino', 'hombre', 'mujer']
    );
    
    // Extract education level
    analysisResult.demographics!.educationLevel = extractDataByKeywords(
      responseText, 
      ['education', 'educação', 'educación'], 
      ['college', 'university', 'graduate', 'faculdade', 'universidade', 'graduado', 'universidad']
    );
    
    // Extract income level
    analysisResult.demographics!.incomeLevel = extractDataByKeywords(
      responseText, 
      ['income', 'renda', 'ingresos'], 
      ['high', 'middle', 'low', 'alto', 'médio', 'baixo', 'medio', 'bajo']
    );
    
    // Extract interests
    analysisResult.interests = extractDataByKeywords(
      responseText, 
      ['interests', 'interesses', 'intereses'], 
      ['technology', 'business', 'tecnologia', 'negócios', 'negocios']
    );
    
    // Extract pain points
    analysisResult.painPoints = extractDataByKeywords(
      responseText, 
      ['pain points', 'pontos de dor', 'puntos de dolor'], 
      ['time', 'money', 'tempo', 'dinheiro', 'tiempo', 'dinero']
    );
    
    // Extract decision factors
    analysisResult.decisionFactors = extractDataByKeywords(
      responseText, 
      ['decision factors', 'fatores de decisão', 'factores de decisión'], 
      ['price', 'quality', 'preço', 'qualidade', 'precio', 'calidad']
    );

    // If we couldn't extract structured data, provide default values
    if (analysisResult.demographics!.ageGroups.length === 0) {
      analysisResult.demographics!.ageGroups = ['25-34', '35-44'];
    }
    
    if (analysisResult.demographics!.gender.length === 0) {
      analysisResult.demographics!.gender = ['All'];
    }
    
    if (analysisResult.demographics!.educationLevel.length === 0) {
      analysisResult.demographics!.educationLevel = ['College', 'Graduate'];
    }
    
    if (analysisResult.demographics!.incomeLevel.length === 0) {
      analysisResult.demographics!.incomeLevel = ['Middle', 'Upper-middle'];
    }
    
    if (analysisResult.interests!.length === 0) {
      analysisResult.interests = ['Technology', 'Business', 'Digital Marketing'];
    }
    
    if (analysisResult.painPoints!.length === 0) {
      analysisResult.painPoints = ['Time management', 'Cost efficiency', 'Technical complexity'];
    }
    
    if (analysisResult.decisionFactors!.length === 0) {
      analysisResult.decisionFactors = ['Quality', 'Price', 'Support'];
    }

    return analysisResult;
  } catch (error) {
    console.error('Error parsing analysis response:', error);
    return {
      success: false,
      platform: platform || 'all',
      analysisText: 'Error parsing analysis: ' + (error as Error).message,
    };
  }
};

// Helper function to extract data from text using keywords
function extractDataByKeywords(text: string, sectionKeywords: string[], dataKeywords: string[]): string[] {
  const results: string[] = [];
  
  // Find paragraphs that might contain the section keywords
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
  
  for (const paragraph of paragraphs) {
    const lowerParagraph = paragraph.toLowerCase();
    
    // Check if the paragraph contains any of the section keywords
    const hasSectionKeyword = sectionKeywords.some(keyword => 
      lowerParagraph.includes(keyword.toLowerCase())
    );
    
    if (hasSectionKeyword) {
      // Extract items that include data keywords
      for (const dataKeyword of dataKeywords) {
        if (lowerParagraph.includes(dataKeyword.toLowerCase())) {
          // Try to extract the specific item
          const words = paragraph.split(/[,;:]/).map(w => w.trim());
          for (const word of words) {
            if (word.toLowerCase().includes(dataKeyword.toLowerCase()) && !results.includes(word)) {
              results.push(word);
            }
          }
          
          // If we couldn't extract specific items, just add the data keyword
          if (results.length === 0) {
            results.push(dataKeyword);
          }
        }
      }
    }
  }
  
  // If we still don't have results, try to find any mentions of the data keywords in the text
  if (results.length === 0) {
    for (const dataKeyword of dataKeywords) {
      if (text.toLowerCase().includes(dataKeyword.toLowerCase())) {
        results.push(dataKeyword);
      }
    }
  }
  
  return results;
}
