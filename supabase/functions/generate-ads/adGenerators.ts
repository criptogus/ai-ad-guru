
import { WebsiteAnalysisResult } from "./types.ts";
import { createGoogleAdsPrompt, createLinkedInAdsPrompt, createMicrosoftAdsPrompt, createMetaAdsPrompt } from "./promptCreators.ts";
import { getOpenAIClient } from "./openai.ts";

export async function generateGoogleAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Google Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createGoogleAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt, "google");
  return response;
}

export async function generateLinkedInAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating LinkedIn Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createLinkedInAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt, "linkedin");
  return response;
}

export async function generateMicrosoftAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Microsoft Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createMicrosoftAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt, "microsoft");
  return response;
}

export async function generateMetaAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Meta Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createMetaAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt, "meta");
  return response;
}

interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

async function callOpenAI(prompt: PromptMessages, platform: string): Promise<string> {
  // Get OpenAI API key within the function scope for better edge function compatibility
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  
  if (!OPENAI_API_KEY) {
    console.log("No OpenAI API key found, returning mock data for platform:", platform);
    return JSON.stringify(getMockDataForPlatform(platform));
  }
  
  try {
    console.log(`Sending prompt to OpenAI for ${platform} platform:`, 
                prompt.systemMessage ? prompt.systemMessage.substring(0, 100) + "..." : "No system message",
                prompt.userMessage ? prompt.userMessage.substring(0, 100) + "..." : "No user message");
    
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt.systemMessage },
        { role: "user", content: prompt.userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // Safe access to response properties with optional chaining
    const content = response?.choices?.[0]?.message?.content;
    console.log(`OpenAI response received for ${platform}, content length:`, content?.length || 0);
    return content || "";
  } catch (error) {
    console.error(`Error calling OpenAI for ${platform}:`, error);
    // Return mock data specific to the platform when OpenAI fails
    return JSON.stringify(getMockDataForPlatform(platform));
  }
}

// Helper function to get appropriate mock data based on platform
function getMockDataForPlatform(platform: string): any[] {
  if (platform === "google" || platform === "microsoft") {
    return [
      {
        headline_1: "Drive Results with Us",
        headline_2: "Professional Solutions",
        headline_3: "Expert Service",
        description_1: "We provide top-quality service that meets your needs.",
        description_2: "Contact us today to learn more.",
        display_url: "www.example.com/services"
      },
      {
        headline_1: "Premium Solutions",
        headline_2: "Exceptional Quality", 
        headline_3: "Best Value",
        description_1: "Find the perfect solution for your business needs.",
        description_2: "Trusted by thousands of customers.",
        display_url: "www.example.com/solutions"
      }
    ];
  } else {
    // Meta or LinkedIn ads
    return [
      {
        headline: "Transform Your Experience",
        primaryText: "Transform your experience with our innovative solutions. #innovation #quality",
        description: "Discover what makes us different",
        image_prompt: "Professional product display with elegant modern styling"
      },
      {
        headline: "Quality You Can Trust",
        primaryText: "Discover what makes us different. Quality you can trust. #trusted #reliable",
        description: "Premium service for discerning customers",
        image_prompt: "Lifestyle image showing product in use in a modern setting"
      }
    ];
  }
}
