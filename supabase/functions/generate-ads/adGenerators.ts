
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
    console.log("No OpenAI API key found, returning mock data");
    return JSON.stringify([
      {
        headline_1: "Drive Results with Us",
        headline_2: "Professional Solutions",
        headline_3: "Expert Service",
        description_1: "We provide top-quality service that meets your needs.",
        description_2: "Contact us today to learn more."
      },
      {
        headline_1: "Premium Solutions",
        headline_2: "Exceptional Quality",
        headline_3: "Best Value",
        description_1: "Find the perfect solution for your business needs.",
        description_2: "Trusted by thousands of customers."
      }
    ]);
  }
  
  try {
    console.log("Sending prompt to OpenAI:", prompt ? prompt.substring(0, 150) + "..." : "No prompt provided");
    
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
    // Return mock data when OpenAI fails
    return JSON.stringify([
      {
        headline_1: "Drive Results with Us",
        headline_2: "Professional Solutions",
        headline_3: "Expert Service",
        description_1: "We provide top-quality service that meets your needs.",
        description_2: "Contact us today to learn more."
      },
      {
        headline_1: "Premium Solutions",
        headline_2: "Exceptional Quality",
        headline_3: "Best Value",
        description_1: "Find the perfect solution for your business needs.",
        description_2: "Trusted by thousands of customers."
      }
    ]);
  }
}
