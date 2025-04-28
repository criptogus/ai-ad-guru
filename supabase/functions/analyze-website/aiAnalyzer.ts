
import { OpenAI } from "https://esm.sh/openai@4.20.1";
import { validateAnalysisResult, normalizeArrayFields } from "./utils.ts";

// Function to create a prompt for the OpenAI analysis with improved industry classification
function createAnalysisPrompt(websiteData: any): string {
  return `
    Analyze the following website data and provide a comprehensive analysis:
    - Title: ${websiteData.title}
    - Description: ${websiteData.description}
    - Keywords: ${websiteData.keywords}
    - Content Preview: ${websiteData.visibleText.substring(0, 3000)}

    Extract:
    - companyName: Company Name
    - businessDescription: Business Description (short, 1-2 sentences)
    - targetAudience: Target Audience (who buys from them, be specific with demographics and interests)
    - brandTone: Brand Tone (e.g., friendly, professional, luxury)
    - keywords: Top 5 Keywords for Ads (list format)
    - callToAction: 3 Call-to-Action suggestions (short phrases)
    - uniqueSellingPoints: 3 Unique Selling Points (what makes them different)
    
    VERY IMPORTANT INSTRUCTIONS FOR INDUSTRY CLASSIFICATION:
    - industry: Provide a SPECIFIC industry classification (avoid generic terms like "Other", "General", or "Technology")
    - Use DETAILED industry categories like: Healthcare Technology, E-commerce Retail, Enterprise Software, Digital Marketing Agency, Investment Banking, K-12 Education, etc.
    - NEVER use vague classifications like "Other", "General", "Various", "Technology" or "Service"
    - The industry name MUST be in the SAME LANGUAGE as the website content (do not use English if the site is not in English)
    
    IMPORTANT: Your analysis must be in the SAME LANGUAGE as the content of the website. If the website is in Spanish, your analysis should be in Spanish. If it's in English, respond in English, etc. NEVER translate the content to another language.
    
    Return ONLY a JSON object with these fields and NO additional text. Format as valid JSON like this:
    {"companyName": "Example Corp", "businessDescription": "...", "targetAudience": "...", "brandTone": "...", "industry": "Specific Industry Name", "keywords": ["word1", "word2", "word3", "word4", "word5"], "callToAction": ["cta1", "cta2", "cta3"], "uniqueSellingPoints": ["usp1", "usp2", "usp3"], "language": "en"}
    
    Include a "language" field with the ISO code of the language you detected (e.g., "en" for English, "pt" for Portuguese, "es" for Spanish).
    `;
}

// Function to analyze website data with OpenAI
export async function analyzeWebsiteWithAI(websiteData: any, openaiApiKey: string) {
  console.log("Initializing OpenAI client...");
  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  });

  const prompt = createAnalysisPrompt(websiteData);
  
  console.log("Sending request to OpenAI...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // Using a more capable model for multilingual content
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 800,
    response_format: { type: "json_object" } // Added to ensure we get JSON back
  });

  console.log("Received response from OpenAI");
  const analysisText = response.choices[0].message.content;
  console.log("Raw OpenAI response:", analysisText);
  
  try {
    // Extract JSON from the response
    const websiteAnalysis = JSON.parse(analysisText);
    console.log("Successfully parsed OpenAI response as JSON");
    
    // Validate the analysis result has all required fields
    if (!validateAnalysisResult(websiteAnalysis)) {
      throw new Error("Invalid analysis result: missing required fields");
    }
    
    // Ensure arrays are properly formatted
    const normalizedAnalysis = normalizeArrayFields(websiteAnalysis);
    
    // Make sure language is set, default to "en" if not provided
    if (!normalizedAnalysis.language) {
      normalizedAnalysis.language = "en";
    }
    
    // Log the industry field specifically for debugging
    console.log("Industry classification:", normalizedAnalysis.industry, "Language:", normalizedAnalysis.language);
    
    return normalizedAnalysis;
    
  } catch (error) {
    console.error("Failed to parse OpenAI response as JSON:", error);
    console.error("Raw response:", analysisText);
    throw new Error(`Failed to parse website analysis data: ${error.message}`);
  }
}
