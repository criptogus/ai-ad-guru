
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
  
  // Build the system message for the AI with enhanced agency context
  const systemMessage = `You are a world-class marketing strategist inside an award-winning ad agency, 
specializing in creating high-converting, emotionally resonant ad campaigns across multiple platforms. 
Your expertise lies in understanding markets deeply and crafting compelling messages that drive results.`;

  // Build the user message with structured analysis and requirements
  const userMessage = `Analyze the following company data and create highly effective ad campaigns:

### 📌 Company Analysis Required:
1. Market/Industry Identification
2. Main Product/Service Definition
3. Unique Value Proposition

### 📊 Company Information:
- Company: ${data.companyName}
- Website: ${data.websiteUrl}
- Description: ${data.companyDescription || data.objective}
- Campaign Goal: ${data.objective}
- Target Audience: ${data.targetAudience}
- Brand Voice: ${data.brandTone || 'professional'}
- Key Differentiators: ${differentials}
- Mental Trigger: ${data.mindTrigger || 'não especificado'}
- Campaign Language: ${language}

### 🎯 Ad Generation Requirements:
1. Generate ads ONLY in ${language}
2. Focus on emotional engagement and modern growth marketing techniques
3. Incorporate the specified mental trigger naturally
4. Follow platform-specific best practices
5. For image-based ads (Instagram/LinkedIn):
   - No text overlays on images
   - Photorealistic, emotionally resonant quality
   - Professional agency-grade visuals
   - No watermarks or artificial elements

### 📦 Return JSON Structure:
{
  "market_analysis": {
    "industry": "identified market/industry",
    "main_product": "core product/service offered",
    "value_proposition": "unique selling points"
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

