
import { AudienceAnalysisResult } from "./utils.ts";

// Parse the OpenAI response and extract structured data
export function parseAnalysisResponse(responseText: string, platform?: string): AudienceAnalysisResult {
  try {
    // Try to extract JSON from the response if it's present
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let analysisTextOnly = responseText;
    
    if (jsonMatch) {
      // Extract the JSON part
      const jsonStr = jsonMatch[0];
      const parsedData = JSON.parse(jsonStr);
      
      // Remove the JSON part from the analysis text to get clean text
      analysisTextOnly = responseText.replace(jsonMatch[0], '').trim();
      // Also remove any code block markers
      analysisTextOnly = analysisTextOnly.replace(/```json|```/g, '').trim();
      
      return {
        success: true,
        platform: platform || 'all',
        analysisText: analysisTextOnly,
        demographics: parsedData.demographics || {
          ageGroups: ["25-34", "35-44"],
          gender: ["All"],
          educationLevel: ["College", "Graduate"],
          incomeLevel: ["Middle", "Upper-middle"]
        },
        interests: parsedData.interests || ["Digital Marketing", "Technology", "Business"],
        painPoints: parsedData.painPoints || ["Time management", "ROI tracking", "Ad performance"],
        decisionFactors: parsedData.decisionFactors || ["Cost effectiveness", "Ease of use", "Support"]
      };
    }
    
    // Fallback - return structured data with the raw text
    return {
      success: true,
      platform: platform || 'all',
      analysisText: analysisTextOnly,
      demographics: {
        ageGroups: ["25-34", "35-44"],
        gender: ["All"],
        educationLevel: ["College", "Graduate"],
        incomeLevel: ["Middle", "Upper-middle"]
      },
      interests: ["Digital Marketing", "Technology", "Business"],
      painPoints: ["Time management", "ROI tracking", "Ad performance"],
      decisionFactors: ["Cost effectiveness", "Ease of use", "Support"]
    };
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    
    // Fallback data with the raw text
    return {
      success: true,
      platform: platform || 'all',
      analysisText: responseText,
      demographics: {
        ageGroups: ["25-34", "35-44"],
        gender: ["All"],
        educationLevel: ["College", "Graduate"],
        incomeLevel: ["Middle", "Upper-middle"]
      },
      interests: ["Digital Marketing", "Technology", "Business"],
      painPoints: ["Time management", "ROI tracking", "Ad performance"],
      decisionFactors: ["Cost effectiveness", "Ease of use", "Support"]
    };
  }
}
