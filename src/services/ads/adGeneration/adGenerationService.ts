
import { CampaignPromptData, GeneratedAdContent, PromptMessages } from "./types/promptTypes";
import { buildAdGenerationPrompt } from "./promptBuilder";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates ad content for multiple platforms based on campaign data
 * @param campaignData Campaign information used to generate the ads
 * @returns Generated ad content for Google, Instagram, LinkedIn and Microsoft ads
 */
export const generateAds = async (campaignData: CampaignPromptData): Promise<GeneratedAdContent | null> => {
  try {
    // Build the prompt for OpenAI
    const { systemMessage, userMessage } = buildAdGenerationPrompt(campaignData);
    
    console.log("Generating ads with system message:", systemMessage.substring(0, 100) + "...");
    console.log("And user message:", userMessage.substring(0, 100) + "...");
    
    // Call the Supabase edge function to generate ads
    const { data, error } = await supabase.functions.invoke("generate-ads", {
      body: {
        systemMessage,
        userMessage,
        language: campaignData.language || "portuguese",
        temperature: 0.7
      }
    });
    
    if (error) {
      console.error("Error calling generate-ads function:", error);
      throw new Error(`Failed to generate ads: ${error.message}`);
    }
    
    if (!data || !data.success) {
      console.error("No data returned or generation failed:", data);
      throw new Error("Failed to generate ads: No valid response from API");
    }
    
    console.log("Generated ad content:", data);
    
    // Return the content from the response
    return data.content as GeneratedAdContent;
  } catch (error) {
    console.error("Error in generateAds:", error);
    throw error;
  }
};
