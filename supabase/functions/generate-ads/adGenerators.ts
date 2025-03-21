import { WebsiteAnalysisResult } from "./types.ts";
import { createGoogleAdsPrompt, createLinkedInAdsPrompt, createMicrosoftAdsPrompt, createMetaAdsPrompt } from "./promptCreators.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

export async function generateGoogleAds(campaignData: WebsiteAnalysisResult): Promise<string> {
  const prompt = createGoogleAdsPrompt(campaignData);
  
  const response = await callOpenAI(prompt);
  return response;
}

export async function generateLinkedInAds(campaignData: WebsiteAnalysisResult): Promise<string> {
  const prompt = createLinkedInAdsPrompt(campaignData);
  
  const response = await callOpenAI(prompt);
  return response;
}

export async function generateMicrosoftAds(campaignData: WebsiteAnalysisResult): Promise<string> {
  const prompt = createMicrosoftAdsPrompt(campaignData);
  
  const response = await callOpenAI(prompt);
  return response;
}

export async function generateMetaAds(campaignData: WebsiteAnalysisResult): Promise<string> {
  const prompt = createMetaAdsPrompt(campaignData);
  
  const response = await callOpenAI(prompt);
  return response;
}

async function callOpenAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured in environment variables");
  }
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional advertising copywriter specializing in creating engaging ad copy for various platforms." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API error:", errorBody);
      throw new Error(`OpenAI API error: ${response.status} - ${errorBody}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}
