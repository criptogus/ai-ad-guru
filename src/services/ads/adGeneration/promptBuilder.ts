
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
  
  // Build the system message for the AI
  const systemMessage = `You are a world-class marketing strategist inside an award-winning ad agency.`;

  // Build the user message with all campaign details in a structured way
  const userMessage = `You will receive the full company context including website, business description, campaign goal, target audience, tone of voice, selected mental trigger, preferred language, and selected ad platforms. Based on this data, first identify clearly and concisely:

1. The company's market/industry
2. Main product or service offered
3. Unique value proposition

Then, using that understanding, generate 5 high-converting ad variations for each of the following platforms selected:

- Google Ads (Search Text Format)
- Instagram Ads (Post Text + Image Prompt)
- LinkedIn Ads (Post Text + Image Prompt)
- Microsoft Bing Ads (Search Text Format)

⚠️ For Instagram and LinkedIn image generation:
- Do not include any text on the image
- Image should be photorealistic, emotionally resonant, agency-quality
- The style should match the platform's advertising standards
- No watermarks or artificial distortions

✅ Ensure the copy is emotionally engaging and uses modern growth marketing techniques
✅ Use the selected mental trigger (e.g. scarcity, curiosity, authority)
✅ Return the output in the same language provided by the user (${language})

---

Company Information:
- Website URL: ${data.websiteUrl}
- Business Description: ${data.product || data.objective}
- Campaign Goal: ${data.objective}
- Target Audience: ${data.targetAudience}
- Tone of Voice: ${data.brandTone || 'profissional'}
- Mental Trigger: ${data.mindTrigger || 'escassez'}
- Language: ${language}
- Selected Platforms: ${data.platforms?.join(', ') || 'google, meta, linkedin, microsoft'}
- Unique Selling Points: ${differentials}

---

Please output the result in a clear JSON structure separating each ad variation under its respective platform with the following structure:

{
  "market": "Industry/market description",
  "product": "Main product or service",
  "differentiator": "Unique value proposition",
  "google_ads": [
    { 
      "headline1": "Main headline", 
      "headline2": "Secondary headline", 
      "headline3": "Additional headline", 
      "description1": "Main description text", 
      "description2": "Additional description"
    },
    // 4 more variations...
  ],
  "instagram_ads": [
    {
      "text": "Instagram caption with hashtags",
      "image_prompt": "Detailed description for image generation without text on image"
    },
    // 4 more variations...
  ],
  "linkedin_ads": [
    {
      "text": "LinkedIn post text",
      "image_prompt": "Detailed description for image generation without text on image"
    },
    // 4 more variations...
  ],
  "bing_ads": [
    {
      "headline1": "Main headline",
      "headline2": "Secondary headline",
      "headline3": "Additional headline",
      "description1": "Main description text",
      "description2": "Additional description"
    },
    // 4 more variations...
  ]
}

Only generate content for platforms listed in the Selected Platforms field. Return valid JSON structure only.`;

  return {
    systemMessage,
    userMessage
  };
};
