
import { WebsiteAnalysisResult } from "./types.ts";

// Helper function to replace template variables in prompts
function templateReplace(promptTemplate: string, data: Record<string, string | undefined>): string {
  let processedPrompt = promptTemplate;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    if (processedPrompt.includes(placeholder) && value !== undefined) {
      processedPrompt = processedPrompt.replace(
        new RegExp(placeholder, 'g'), 
        value
      );
    }
  });
  
  return processedPrompt;
}

// Fetch prompt from database
async function fetchPromptTemplate(key: string): Promise<string | null> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not found, using default prompt');
    return null;
  }
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/app_prompts?key=eq.${key}&select=prompt`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prompt: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0].prompt;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching prompt template:', error);
    return null;
  }
}

// Default prompt templates as fallbacks
const DEFAULT_PROMPT_TEMPLATES = {
  openai_ad_generator: "You are an AI assistant specialized in creating effective advertising content. Generate compelling ad copy for {{platform}} that highlights the unique value proposition of {{companyName}} in the {{industry}} industry. The target audience is {{targetAudience}}. Use a {{brandTone}} tone and incorporate these keywords: {{keywords}}. The primary call to action should be: {{callToAction}}. Focus on these unique selling points: {{uniqueSellingPoints}}."
};

// Get prompt template with fallback to default
async function getPromptTemplate(key: string): Promise<string> {
  const dbPrompt = await fetchPromptTemplate(key);
  if (dbPrompt) {
    return dbPrompt;
  }
  
  return DEFAULT_PROMPT_TEMPLATES[key] || DEFAULT_PROMPT_TEMPLATES.openai_ad_generator;
}

// Create Google Ads prompt
export async function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  const basePrompt = await getPromptTemplate('openai_ad_generator');
  
  const templateData = {
    platform: 'Google Search Ads',
    companyName: campaignData.companyName || '',
    industry: campaignData.industry || '',
    targetAudience: campaignData.targetAudience || '',
    brandTone: campaignData.brandTone || 'professional',
    keywords: campaignData.keywords?.join(', ') || '',
    callToAction: campaignData.callToAction || '',
    uniqueSellingPoints: campaignData.uniqueSellingPoints?.join(', ') || ''
  };
  
  let prompt = templateReplace(basePrompt, templateData);
  
  prompt += `
  
  Create 5 Google Search Ads variations. Each ad should have:
  - 3 headlines (max 30 characters each)
  - 2 descriptions (max 90 characters each)
  - A display URL path (optional)
  
  Format your response as a JSON array containing 5 ad objects with these properties:
  - headlines (array of 3 strings)
  - descriptions (array of 2 strings)
  - displayPath (string, optional)
  
  Ensure all copy follows Google Ads guidelines, no excessive capitalization or punctuation.`;
  
  if (mindTrigger) {
    prompt += `\n\nAdditional creative direction: ${mindTrigger}`;
  }
  
  return prompt;
}

// Create Meta Ads prompt
export async function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  const basePrompt = await getPromptTemplate('openai_ad_generator');
  
  const templateData = {
    platform: 'Instagram/Meta Ads',
    companyName: campaignData.companyName || '',
    industry: campaignData.industry || '',
    targetAudience: campaignData.targetAudience || '',
    brandTone: campaignData.brandTone || 'engaging',
    keywords: campaignData.keywords?.join(', ') || '',
    callToAction: campaignData.callToAction || '',
    uniqueSellingPoints: campaignData.uniqueSellingPoints?.join(', ') || ''
  };
  
  let prompt = templateReplace(basePrompt, templateData);
  
  prompt += `
  
  Create 3 Instagram/Meta Ad variations. Each ad should have:
  - A compelling headline (max 40 characters)
  - Primary text (90-125 characters, engaging and conversational)
  - A clear call-to-action
  - A short description (optional)
  - An image prompt that describes a high-quality image that would work well with the ad
  
  Format your response as a JSON array containing 3 ad objects with these properties:
  - headline (string)
  - primaryText (string)
  - description (string, optional)
  - callToAction (string)
  - imagePrompt (string)
  
  The ads should be visually oriented and emotionally compelling for social media users.`;
  
  if (mindTrigger) {
    prompt += `\n\nAdditional creative direction: ${mindTrigger}`;
  }
  
  return prompt;
}

// Create LinkedIn Ads prompt
export async function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  const basePrompt = await getPromptTemplate('openai_ad_generator');
  
  const templateData = {
    platform: 'LinkedIn Ads',
    companyName: campaignData.companyName || '',
    industry: campaignData.industry || '',
    targetAudience: campaignData.targetAudience || '',
    brandTone: campaignData.brandTone || 'professional',
    keywords: campaignData.keywords?.join(', ') || '',
    callToAction: campaignData.callToAction || '',
    uniqueSellingPoints: campaignData.uniqueSellingPoints?.join(', ') || ''
  };
  
  let prompt = templateReplace(basePrompt, templateData);
  
  prompt += `
  
  Create 3 LinkedIn Ad variations. Each ad should have:
  - A professional headline (max 50 characters)
  - Primary text (150-200 characters, professional and value-focused)
  - A clear call-to-action
  - A short description (optional)
  - An image prompt that describes a professional image that would work well for LinkedIn
  
  Format your response as a JSON array containing 3 ad objects with these properties:
  - headline (string)
  - primaryText (string)
  - description (string, optional)
  - callToAction (string)
  - imagePrompt (string)
  
  The ads should be professional, focused on business value, and appropriate for a B2B audience.`;
  
  if (mindTrigger) {
    prompt += `\n\nAdditional creative direction: ${mindTrigger}`;
  }
  
  return prompt;
}

// Create Microsoft Ads prompt
export async function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  const basePrompt = await getPromptTemplate('openai_ad_generator');
  
  const templateData = {
    platform: 'Microsoft Ads',
    companyName: campaignData.companyName || '',
    industry: campaignData.industry || '',
    targetAudience: campaignData.targetAudience || '',
    brandTone: campaignData.brandTone || 'balanced',
    keywords: campaignData.keywords?.join(', ') || '',
    callToAction: campaignData.callToAction || '',
    uniqueSellingPoints: campaignData.uniqueSellingPoints?.join(', ') || ''
  };
  
  let prompt = templateReplace(basePrompt, templateData);
  
  prompt += `
  
  Create 5 Microsoft Ads variations. Each ad should have:
  - 3 headlines (max 30 characters each)
  - 2 descriptions (max 90 characters each)
  - A display URL path (optional)
  
  Format your response as a JSON array containing 5 ad objects with these properties:
  - headlines (array of 3 strings)
  - descriptions (array of 2 strings)
  - displayPath (string, optional)
  
  Ensure all copy follows Microsoft Ads guidelines, with clear value propositions.`;
  
  if (mindTrigger) {
    prompt += `\n\nAdditional creative direction: ${mindTrigger}`;
  }
  
  return prompt;
}
