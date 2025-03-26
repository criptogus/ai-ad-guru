
import { corsHeaders } from "./utils.ts";

interface ImageGenerationConfig {
  prompt: string;
  imageFormat: string;
  openaiApiKey: string;
}

export async function generateImageWithGPT4o(config: ImageGenerationConfig): Promise<{ url: string, revisedPrompt?: string }> {
  const { prompt, imageFormat, openaiApiKey } = config;
  
  // Limit prompt length to 950 characters to allow room for the system message
  const MAX_PROMPT_LENGTH = 950;
  const truncatedPrompt = prompt.length > MAX_PROMPT_LENGTH 
    ? prompt.substring(0, MAX_PROMPT_LENGTH - 3) + "..." 
    : prompt;
  
  console.log("Enhanced prompt (truncated):", truncatedPrompt);
  console.log(`Image format: ${imageFormat}`);
  console.log(`Original prompt length: ${prompt.length}, truncated to: ${truncatedPrompt.length}`);
  
  // Determine aspect ratio based on image format
  let aspectRatio = "1:1"; // Default square
  if (imageFormat === "landscape") {
    aspectRatio = "16:9";
  } else if (imageFormat === "portrait" || imageFormat === "story" || imageFormat === "reel") {
    aspectRatio = "9:16";
  }
  
  // Retry mechanism for OpenAI API
  let retries = 0;
  const maxRetries = 2;
  
  while (retries <= maxRetries) {
    try {
      // Make request to OpenAI API using the Chat Completions endpoint with the image_generation tool
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Generate a high-quality advertisement image in ${aspectRatio} aspect ratio format.`
            },
            {
              role: "user",
              content: truncatedPrompt
            }
          ],
          tools: [
            {
              type: "image_generation"
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error (${response.status}):`, errorText);
        
        if (retries < maxRetries && (response.status === 429 || response.status >= 500)) {
          retries++;
          console.log(`Retrying OpenAI API call (${retries}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
          continue;
        }
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Parse the tool_calls from the response
      const toolCalls = data.choices?.[0]?.message?.tool_calls;
      
      if (!toolCalls || toolCalls.length === 0) {
        throw new Error("No image generation tool calls found in response");
      }
      
      // Find the image generation tool call
      const imageToolCall = toolCalls.find((call: any) => call.type === "image_generation");
      
      if (!imageToolCall || !imageToolCall.image || !imageToolCall.image.url) {
        throw new Error("No image URL found in the response");
      }
      
      return { 
        url: imageToolCall.image.url,
        revisedPrompt: truncatedPrompt !== prompt ? truncatedPrompt : undefined
      };
    } catch (error) {
      console.error("Error occurred, retrying...", error);
      
      if (retries < maxRetries) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        continue;
      }
      
      console.error("Max retries reached, giving up on OpenAI API call", error);
      throw error;
    }
  }
  
  throw new Error("Failed to generate image after maximum retries");
}

export async function downloadImage(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }
  return await response.blob();
}
