
import { WebsiteAnalysisResult } from "./types.ts";
import { createGoogleAdsPrompt, createLinkedInAdsPrompt, createMicrosoftAdsPrompt, createMetaAdsPrompt } from "./promptCreators.ts";
import { getOpenAIClient } from "./openai.ts";

export async function generateGoogleAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Google Ads with mind trigger:", mindTrigger || "None");
  console.log("Campaign data language:", campaignData.language);
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createGoogleAdsPrompt(campaignData, mindTrigger);
  
  // Log the full prompt for debugging
  console.log("🧠 System message preview:", prompt.systemMessage.slice(0, 200));
  console.log("🧠 User message preview:", prompt.userMessage.slice(0, 200));
  
  const response = await callOpenAI(prompt, "google");
  return response;
}

export async function generateLinkedInAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating LinkedIn Ads with mind trigger:", mindTrigger || "None");
  console.log("Campaign data language:", campaignData.language);
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createLinkedInAdsPrompt(campaignData, mindTrigger);
  
  // Log the full prompt for debugging
  console.log("🧠 System message preview:", prompt.systemMessage.slice(0, 200));
  console.log("🧠 User message preview:", prompt.userMessage.slice(0, 200));
  
  const response = await callOpenAI(prompt, "linkedin");
  return response;
}

export async function generateMicrosoftAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Microsoft Ads with mind trigger:", mindTrigger || "None");
  console.log("Campaign data language:", campaignData.language);
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createMicrosoftAdsPrompt(campaignData, mindTrigger);
  
  // Log the full prompt for debugging
  console.log("🧠 System message preview:", prompt.systemMessage.slice(0, 200));
  console.log("🧠 User message preview:", prompt.userMessage.slice(0, 200));
  
  const response = await callOpenAI(prompt, "microsoft");
  return response;
}

export async function generateMetaAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string): Promise<string> {
  console.log("Generating Meta Ads with mind trigger:", mindTrigger || "None");
  console.log("Campaign data language:", campaignData.language);
  
  // Apply mind trigger to enhance prompt and generation
  const prompt = createMetaAdsPrompt(campaignData, mindTrigger);
  
  // Log the full prompt for debugging
  console.log("🧠 System message preview:", prompt.systemMessage.slice(0, 200));
  console.log("🧠 User message preview:", prompt.userMessage.slice(0, 200));
  
  const response = await callOpenAI(prompt, "meta");
  return response;
}

interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

async function callOpenAI(prompt: PromptMessages, platform: string): Promise<string> {
  // Verify the OpenAI API key
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!OPENAI_API_KEY) {
    throw new Error("❌ OPENAI_API_KEY is not defined in environment variables.");
  }

  try {
    const openai = getOpenAIClient();

    console.log(`🔍 Sending prompt to OpenAI for platform [${platform}]`);
    
    // Log full prompts for debugging
    console.log("🧠 Complete system message:", prompt.systemMessage);
    console.log("🧠 Complete user message:", prompt.userMessage);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt.systemMessage },
        { role: "user", content: prompt.userMessage }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response?.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("⚠️ No content returned from OpenAI response.");
    }

    console.log(`✅ OpenAI response received (${content.length} characters)`);
    console.log(`📝 Response sample: ${content.substring(0, 300)}...`);
    return content;

  } catch (error) {
    console.error(`🚨 Error during OpenAI call for platform [${platform}]:`, error);
    throw new Error("Failed to generate ads with OpenAI: " + (error instanceof Error ? error.message : String(error)));
  }
}

// Helper function to extract text ads from non-JSON response
function extractTextAdsFromResponse(text: string): any[] {
  const ads = [];
  
  // Look for sections labeled as ad variations
  const adSections = text.split(/Ad\s+\d+:|Variation\s+\d+:|Google\s+Ad\s+\d+:|Microsoft\s+Ad\s+\d+:/i);
  
  for (let section of adSections) {
    section = section.trim();
    if (!section) continue;
    
    // Try to extract ad components using regex patterns
    const headline1Match = section.match(/Headline 1:?\s*(.*?)(?:\n|$)/i) || 
                          section.match(/Title 1:?\s*(.*?)(?:\n|$)/i) ||
                          section.match(/H1:?\s*(.*?)(?:\n|$)/i);
                          
    const headline2Match = section.match(/Headline 2:?\s*(.*?)(?:\n|$)/i) || 
                          section.match(/Title 2:?\s*(.*?)(?:\n|$)/i) ||
                          section.match(/H2:?\s*(.*?)(?:\n|$)/i);
                          
    const headline3Match = section.match(/Headline 3:?\s*(.*?)(?:\n|$)/i) || 
                          section.match(/Title 3:?\s*(.*?)(?:\n|$)/i) ||
                          section.match(/H3:?\s*(.*?)(?:\n|$)/i);
                          
    const desc1Match = section.match(/Description 1:?\s*(.*?)(?:\n|$)/i) ||
                       section.match(/Description:?\s*(.*?)(?:\n|$)/i) ||
                       section.match(/Desc 1:?\s*(.*?)(?:\n|$)/i) ||
                       section.match(/D1:?\s*(.*?)(?:\n|$)/i);
                       
    const desc2Match = section.match(/Description 2:?\s*(.*?)(?:\n|$)/i) ||
                       section.match(/Desc 2:?\s*(.*?)(?:\n|$)/i) ||
                       section.match(/D2:?\s*(.*?)(?:\n|$)/i);
                       
    const displayUrlMatch = section.match(/Display URL:?\s*(.*?)(?:\n|$)/i) ||
                           section.match(/URL:?\s*(.*?)(?:\n|$)/i);
    
    // Only add if we found at least some headline data
    if (headline1Match || headline2Match || headline3Match) {
      ads.push({
        headline_1: headline1Match ? headline1Match[1].trim() : "Professional Service",
        headline_2: headline2Match ? headline2Match[1].trim() : "Quality Results",
        headline_3: headline3Match ? headline3Match[1].trim() : "Contact Today",
        description_1: desc1Match ? desc1Match[1].trim() : "We provide excellent service that meets your needs.",
        description_2: desc2Match ? desc2Match[1].trim() : "Contact us today to learn more.",
        display_url: displayUrlMatch ? displayUrlMatch[1].trim() : "example.com"
      });
    }
  }
  
  // If no ads found, return empty array (will be replaced with fallback)
  return ads;
}

// Helper function to extract social media ads from non-JSON response
function extractSocialAdsFromResponse(text: string): any[] {
  const ads = [];
  
  // Look for sections labeled as ad variations
  const adSections = text.split(/Ad\s+\d+:|Variation\s+\d+:|Meta\s+Ad\s+\d+:|Instagram\s+Ad\s+\d+:|LinkedIn\s+Ad\s+\d+:/i);
  
  for (let section of adSections) {
    section = section.trim();
    if (!section) continue;
    
    // Try to extract ad components using regex patterns
    const headlineMatch = section.match(/Headline:?\s*(.*?)(?:\n|$)/i) || 
                         section.match(/Title:?\s*(.*?)(?:\n|$)/i);
                         
    const primaryTextMatch = section.match(/Primary Text:?\s*(.*?)(?:\n|$)/i) || 
                            section.match(/Caption:?\s*(.*?)(?:\n|$)/i) ||
                            section.match(/Text:?\s*(.*?)(?:\n|$)/i) ||
                            section.match(/Copy:?\s*(.*?)(?:\n|$)/i);
                            
    const descMatch = section.match(/Description:?\s*(.*?)(?:\n|$)/i) ||
                     section.match(/Additional Text:?\s*(.*?)(?:\n|$)/i);
                     
    const imagePromptMatch = section.match(/Image Prompt:?\s*(.*?)(?:\n|$)/i) ||
                             section.match(/Image:?\s*(.*?)(?:\n|$)/i) ||
                             section.match(/Visual:?\s*(.*?)(?:\n|$)/i);
    
    // Only add if we found at least some headline or text data
    if (headlineMatch || primaryTextMatch) {
      ads.push({
        headline: headlineMatch ? headlineMatch[1].trim() : "Professional Service",
        primaryText: primaryTextMatch ? primaryTextMatch[1].trim() : "Discover our premium service designed to meet your needs.",
        description: descMatch ? descMatch[1].trim() : "Learn more about our services",
        image_prompt: imagePromptMatch ? imagePromptMatch[1].trim() : "Professional image representing quality service"
      });
    }
  }
  
  // If no ads found, return empty array (will be replaced with fallback)
  return ads;
}
