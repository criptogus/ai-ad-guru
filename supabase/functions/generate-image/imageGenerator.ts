
import { corsHeaders } from "./utils.ts";

interface ImageGenerationConfig {
  prompt: string;
  imageFormat: string;
  openaiApiKey: string;
}

export async function generateImageWithGPT4o(config: ImageGenerationConfig): Promise<{ url: string, revisedPrompt?: string }> {
  const { prompt, imageFormat, openaiApiKey } = config;
  
  // Determine image size based on requested format
  let size = "1024x1024"; // Default square format
  
  if (imageFormat === "portrait") {
    size = "1024x1792"; // Portrait format
  } else if (imageFormat === "landscape") {
    size = "1792x1024"; // Landscape format for LinkedIn (approximating 1200x627 ratio)
  }
  
  // Limit prompt length to 1000 characters as required by OpenAI API
  const MAX_PROMPT_LENGTH = 1000;
  const truncatedPrompt = prompt.length > MAX_PROMPT_LENGTH 
    ? prompt.substring(0, MAX_PROMPT_LENGTH - 3) + "..." 
    : prompt;
  
  console.log("Enhanced GPT-4o prompt (truncated):", truncatedPrompt);
  console.log(`Image format: ${imageFormat}, size: ${size}`);
  console.log(`Original prompt length: ${prompt.length}, truncated to: ${truncatedPrompt.length}`);
  
  // Retry mechanism for OpenAI API
  let retries = 0;
  const maxRetries = 2;
  
  while (retries <= maxRetries) {
    try {
      // Make direct fetch to OpenAI API for image generation (DALL-E)
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          prompt: truncatedPrompt,
          n: 1,
          size: size,
          quality: "hd", // Use HD quality for better results
          style: "natural", // Natural style for more photorealistic results
          response_format: "url"
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
      
      if (!data.data || data.data.length === 0) {
        throw new Error("No image was generated");
      }
      
      return { 
        url: data.data[0].url,
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
