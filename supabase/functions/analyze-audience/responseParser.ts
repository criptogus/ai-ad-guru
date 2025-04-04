interface ParsedAnalysis {
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
}

export const parseAnalysisResponse = (responseText: string, platform?: string): ParsedAnalysis => {
  // Initialize the result
  const result: ParsedAnalysis = {
    success: true,
    platform: platform || 'all',
    analysisText: '',
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
  
  try {
    // Extract paragraphs text for the audience analysis - preserve all the original formatting
    result.analysisText = responseText;
    
    // Parse demographics
    result.demographics = parseDemographics(responseText);
    
    // Parse interests
    result.interests = parseListSection(responseText, "interests");
    
    // Parse pain points
    result.painPoints = parseListSection(responseText, "pain points");
    
    // Parse decision factors
    result.decisionFactors = parseListSection(responseText, "decision factors");
    
    return result;
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    
    // Return with the original text even if parsing failed
    return {
      success: false,
      platform: platform || 'all',
      analysisText: responseText,
    };
  }
};

// Helper function to parse demographics section
function parseDemographics(text: string): { ageGroups: string[], gender: string[], educationLevel: string[], incomeLevel: string[] } {
  const result = {
    ageGroups: [] as string[],
    gender: [] as string[],
    educationLevel: [] as string[],
    incomeLevel: [] as string[]
  };
  
  // Age groups
  result.ageGroups = extractDemographicTrait(text, "age", ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]);
  
  // Gender
  result.gender = extractDemographicTrait(text, "gender", ["male", "female", "all"]);
  
  // Education level
  result.educationLevel = extractDemographicTrait(text, "education", ["high school", "college", "graduate", "undergraduate", "bachelor", "master", "phd"]);
  
  // Income level
  result.incomeLevel = extractDemographicTrait(text, "income", ["low", "middle", "high", "affluent"]);
  
  return result;
}

// Helper function to extract demographic traits
function extractDemographicTrait(text: string, traitName: string, possibleValues: string[]): string[] {
  const lowerText = text.toLowerCase();
  const regex = new RegExp(`${traitName}[^\\n.]*?(?:${possibleValues.join('|')})`, 'gi');
  const matches = lowerText.match(regex) || [];
  
  return matches.length > 0 
    ? possibleValues.filter(value => matches.some(match => match.includes(value))) 
    : determineDefaultTraits(traitName);
}

// Helper function to provide default traits if none are found
function determineDefaultTraits(traitName: string): string[] {
  switch (traitName) {
    case "age":
      return ["25-34", "35-44"]; // Default age range
    case "gender":
      return ["All"]; // Default gender targeting
    case "education":
      return ["College", "Graduate"]; // Default education level
    case "income":
      return ["Middle", "Upper-middle"]; // Default income level
    default:
      return [];
  }
}

// Helper function to parse list sections
function parseListSection(text: string, sectionName: string): string[] {
  const lowerText = text.toLowerCase();
  
  // Try to find the section and extract items
  const sectionRegex = new RegExp(`${sectionName}[^:]*:\\s*([\\s\\S]*?)(?:(?:\\n\\n)|$)`, 'i');
  const sectionMatch = lowerText.match(sectionRegex);
  
  if (sectionMatch && sectionMatch[1]) {
    // Extract items that are in bullet points or newlines
    const itemsText = sectionMatch[1];
    const itemsRegex = /(?:^|\n)\s*(?:-|\*|\d+\.)\s*(.*?)(?=(?:\n\s*(?:-|\*|\d+\.)|$))/g;
    const itemMatches = [...itemsText.matchAll(itemsRegex)];
    
    if (itemMatches.length > 0) {
      return itemMatches.map(match => 
        match[1]
          .replace(/^\s+|\s+$/g, '') // Trim whitespace
          .replace(/^["']|["']$/g, '') // Remove quotes if present
      ).filter(item => item.length > 0);
    }
    
    // If no bullet points, try splitting by newlines or commas
    return itemsText
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  
  // Return default items based on section name if no matches found
  return getDefaultItems(sectionName);
}

// Helper function to provide default items if none are found
function getDefaultItems(sectionName: string): string[] {
  switch (sectionName.toLowerCase()) {
    case "interests":
      return ["Digital Marketing", "Technology", "Business Growth", "Efficiency", "Innovation"];
    case "pain points":
      return ["Time Management", "Cost Efficiency", "ROI Tracking", "Ad Performance", "Targeting Accuracy"];
    case "decision factors":
      return ["Price", "Ease of Use", "Support Quality", "Results", "Integration Capabilities"];
    default:
      return [];
  }
}
