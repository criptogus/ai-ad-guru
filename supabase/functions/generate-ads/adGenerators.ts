
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
    
    if (!content) {
      console.log(`Empty response from OpenAI for ${platform}, using fallback`);
      return JSON.stringify(getMockDataForPlatform(platform));
    }
    
    console.log(`OpenAI response received for ${platform}, content length:`, content.length || 0);
    console.log(`Response sample: ${content.substring(0, 150)}...`);
    
    // Attempt to parse and validate JSON response
    try {
      // Try to parse the JSON response
      const parsed = JSON.parse(content);
      
      // Validate that we have an array for ad platforms
      if (!Array.isArray(parsed)) {
        console.log(`Response is not a valid array for ${platform}, attempting to extract JSON`);
        
        // Try to extract JSON from potential markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim();
          console.log(`Extracted JSON from code block: ${extractedJson.substring(0, 150)}...`);
          
          const extractedParsed = JSON.parse(extractedJson);
          if (Array.isArray(extractedParsed)) {
            console.log(`Successfully extracted array with ${extractedParsed.length} items`);
            return JSON.stringify(extractedParsed);
          }
        }
        
        // If we can't extract valid JSON, return fallback
        console.log(`Failed to parse valid JSON array from response, using fallback for ${platform}`);
        return JSON.stringify(getMockDataForPlatform(platform));
      }
      
      console.log(`Successfully parsed JSON array with ${parsed.length} items for ${platform}`);
      return JSON.stringify(parsed);
    } catch (parseError) {
      console.error(`Error parsing JSON from OpenAI response for ${platform}:`, parseError);
      console.log(`Raw response: ${content}`);
      
      // Try to extract structured data from text if JSON parsing fails
      if (platform === "google" || platform === "microsoft") {
        const extractedAds = extractTextAdsFromResponse(content);
        if (extractedAds.length > 0) {
          console.log(`Extracted ${extractedAds.length} text ads from response`);
          return JSON.stringify(extractedAds);
        }
      } else {
        const extractedAds = extractSocialAdsFromResponse(content);
        if (extractedAds.length > 0) {
          console.log(`Extracted ${extractedAds.length} social ads from response`);
          return JSON.stringify(extractedAds);
        }
      }
      
      // Return fallback data when all extraction attempts fail
      return JSON.stringify(getMockDataForPlatform(platform));
    }
  } catch (error) {
    console.error(`Error calling OpenAI for ${platform}:`, error);
    // Return mock data specific to the platform when OpenAI fails
    return JSON.stringify(getMockDataForPlatform(platform));
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
