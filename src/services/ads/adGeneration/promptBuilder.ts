
import { CampaignPromptData, PromptMessages } from './types/promptTypes';

export const buildAdGenerationPrompt = (data: CampaignPromptData): PromptMessages => {
  // Early validation of required fields
  if (!data.companyName || !data.websiteUrl || !data.objective || !data.targetAudience) {
    throw new Error('Missing required campaign data for prompt generation');
  }

  // Core business info validation - use objective if companyDescription is missing
  const businessDescription = data.companyDescription?.trim() || data.objective;
  if (!businessDescription) {
    throw new Error('Business description is required for accurate ad generation');
  }

  // Ensure we have a language, defaulting to English
  const language = data.language || 'english';
  
  // Get formatted differentials
  const differentials = data.differentials?.join(', ') || 'not specified';
  
  // Build the system message with strict context enforcement
  const systemMessage = `You are a world-class advertising copywriter inside a premium AI marketing agency. 
Your task is to create highly effective, contextually relevant advertisements STRICTLY based on the company information provided.
You must NOT invent or assume services, features, or details that are not explicitly mentioned in the business description.
Each ad must clearly reflect the company's actual offerings, target audience, and campaign objective.`;

  // Build the user message with enhanced structure and detailed context instructions
  const userMessage = `IMPORTANT: First analyze the company context, then create ads that are 100% relevant to the specific business.

### 🏢 COMPANY CONTEXT ANALYSIS:
- Name: ${data.companyName}
- Website: ${data.websiteUrl}
- Business Description: ${businessDescription}
- Key Differentiators: ${differentials}
- Industry: ${data.industry || 'Not specified'}
- Product/Service Focus: ${data.product || 'General company offering'}

### 🎯 CAMPAIGN CONTEXT ANALYSIS:
- Campaign Goal: ${data.objective}
- Target Audience: ${data.targetAudience}
- Brand Voice: ${data.brandTone || 'professional'}
- Mental Trigger: ${data.mindTrigger || 'not specified'}
- Language: ${language}

### 📋 CONTENT REQUIREMENTS:
1. Google/Bing Ads:
   - Headline 1 (max 30 chars)
   - Headline 2 (max 30 chars)
   - Headline 3 (max 30 chars)
   - Description 1 (max 90 chars)
   - Description 2 (max 90 chars)

2. Instagram/LinkedIn:
   - Image prompt (no text overlay, photorealistic)
   - Caption text (2-3 lines)
   - Include relevant CTA

### ⚠️ STRICT RULES:
1. Use ONLY the information provided above - do not invent features or services
2. Generate content ONLY in ${language}
3. Every ad must directly address the specific ${data.objective} campaign goal
4. Ads must target ONLY the described audience: ${data.targetAudience}
5. Match the specified brand voice: ${data.brandTone || 'professional'}
6. Incorporate the mental trigger: ${data.mindTrigger || 'general persuasion'}
7. For images: describe photorealistic scenes that represent the actual business

### 📦 Return JSON Structure:
{
  "market_analysis": {
    "industry": "identified market/industry based on provided info",
    "main_service": "core service/product explicitly mentioned",
    "value_proposition": "unique benefits explicitly mentioned"
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
