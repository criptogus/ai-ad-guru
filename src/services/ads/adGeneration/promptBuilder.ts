
import { CampaignPromptData, PromptMessages } from './types/promptTypes';

export const buildAdGenerationPrompt = (data: CampaignPromptData): PromptMessages => {
  // Early validation of required fields
  if (!data.companyName || !data.websiteUrl || !data.objective || !data.targetAudience) {
    throw new Error('Missing required campaign data for prompt generation');
  }

  // Ensure we have a language, defaulting to Portuguese
  const language = data.language || 'portuguese';
  
  // Get formatted differentials
  const differentials = data.differentials?.join(', ') || 'não especificado';
  
  // Build the system message with strict context enforcement
  const systemMessage = `You are a world-class advertising copywriter inside a premium AI marketing agency. 
Your goal is to generate accurate, persuasive ad variations for digital platforms based only on the structured information provided. 
Do not invent or assume services that are not explicitly mentioned in the business description.`;

  // Build the user message with enhanced structure and validation
  const userMessage = `Please generate high-converting ad variations using only the information below. 
Do not invent or assume any services not explicitly mentioned.

### 🏢 Company Details:
- Name: ${data.companyName}
- Website: ${data.websiteUrl}
- Business Description: ${data.objective}
- Key Differentiators: ${differentials}

### 🎯 Campaign Information:
- Campaign Goal: ${data.objective}
- Target Audience: ${data.targetAudience}
- Brand Voice: ${data.brandTone || 'professional'}
- Mental Trigger: ${data.mindTrigger || 'não especificado'}
- Language: ${language}

### 📋 Format Requirements:
1. Google/Bing Ads:
   - Headline 1 (max 30 chars)
   - Headline 2 (max 30 chars)
   - Description 1 (max 90 chars)
   - Description 2 (max 90 chars)

2. Instagram/LinkedIn:
   - Image prompt (no text overlay)
   - Caption text (2-3 lines)
   - Include relevant CTA

### ⚠️ Important Rules:
1. Use ONLY the information provided above
2. Generate content ONLY in ${language}
3. Never assume or add services not mentioned
4. Follow platform-specific character limits
5. For images: describe photorealistic scenes without text
6. Match the specified brand voice and mental trigger

### 📦 Return JSON Structure:
{
  "market_analysis": {
    "industry": "identified market/industry",
    "main_service": "core service offered",
    "value_proposition": "unique benefits"
  },
  "google_ads": [
    {
      "headline_1": "",
      "headline_2": "",
      "headline_3": "",
      "description_1": "",
      "description_2": ""
    }
  ],
  "instagram_ads": [
    {
      "text": "",
      "image_prompt": ""
    }
  ],
  "linkedin_ads": [
    {
      "text": "",
      "image_prompt": ""
    }
  ],
  "microsoft_ads": [
    {
      "headline_1": "",
      "headline_2": "",
      "description": "",
      "display_url": ""
    }
  ]
}

Return ONLY the JSON, without any explanation or additional text.`;

  return {
    systemMessage,
    userMessage
  };
};
