
import { WebsiteAnalysisResult } from "./types.ts";
import { createGoogleAdsPrompt, createLinkedInAdsPrompt, createMicrosoftAdsPrompt, createMetaAdsPrompt } from "./promptCreators.ts";
import { getOpenAIClient } from "./openai.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

export async function generateGoogleAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Google Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createGoogleAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt);
  return response;
}

export async function generateLinkedInAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating LinkedIn Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createLinkedInAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt);
  return response;
}

export async function generateMicrosoftAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Microsoft Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createMicrosoftAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt);
  return response;
}

export async function generateMetaAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Meta Ads with mind trigger:", mindTrigger || "None");
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createMetaAdsPrompt(campaignData, mindTrigger);
  
  const response = await callOpenAI(prompt);
  return response;
}

async function callOpenAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured in environment variables");
  }
  
  try {
    console.log("Sending prompt to OpenAI:", prompt.substring(0, 150) + "...");
    
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional advertising copywriter specializing in creating engaging ad copy for various platforms." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}
