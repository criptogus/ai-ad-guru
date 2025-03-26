
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
      // Make request to OpenAI API using the DALL-E-3 model
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `${truncatedPrompt} Use a ${aspectRatio} aspect ratio format.`,
          n: 1,
          size: imageFormat === "portrait" || imageFormat === "story" || imageFormat === "reel" 
                 ? "1024x1792" 
                 : imageFormat === "landscape" 
                 ? "1792x1024" 
                 : "1024x1024",
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
      
      // Extract the image URL from the response
      if (!data.data || !data.data[0] || !data.data[0].url) {
        throw new Error("No image URL found in the response");
      }

      const imageUrl = data.data[0].url;
      const revisedPrompt = data.data[0].revised_prompt || undefined;
      
      return { 
        url: imageUrl,
        revisedPrompt
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
