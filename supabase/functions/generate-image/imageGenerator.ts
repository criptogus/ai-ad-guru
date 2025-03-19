
import { corsHeaders } from "./utils.ts";

interface ImageGenerationConfig {
  prompt: string;
  imageFormat: string;
  openaiApiKey: string;
}

export async function generateImageWithDallE(config: ImageGenerationConfig): Promise<{ url: string, revisedPrompt?: string }> {
  const { prompt, imageFormat, openaiApiKey } = config;
  
  // Determine image size based on requested format
  const imageSize = imageFormat === "portrait" ? "1024x1792" : "1024x1024";
  
  console.log("Enhanced DALL-E 3 prompt:", prompt);
  console.log(`Image format: ${imageFormat}, size: ${imageSize}`);
  
  // Retry mechanism for OpenAI API
  let retries = 0;
  const maxRetries = 2;
  
  while (retries <= maxRetries) {
    try {
      // Make direct fetch to OpenAI API to ensure proper parameters
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: imageSize,
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
      console.log("OpenAI API response:", JSON.stringify(data, null, 2));
      
      if (!data.data || data.data.length === 0) {
        console.error("OpenAI API response has no data:", JSON.stringify(data, null, 2));
        throw new Error(data.error?.message || "No image was generated");
      }

      const temporaryImageUrl = data.data[0].url;
      
      if (!temporaryImageUrl) {
        console.error("Empty image URL in response:", JSON.stringify(data, null, 2));
        throw new Error("Generated image URL is empty");
      }
      
      console.log("OpenAI image generation completed successfully");
      console.log("Temporary image URL (first 50 chars):", temporaryImageUrl.substring(0, 50) + "...");
      
      return { 
        url: temporaryImageUrl, 
        revisedPrompt: data.data[0].revised_prompt 
      };
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        console.log(`Error occurred, retrying (${retries}/${maxRetries})...`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
      } else {
        console.error("Max retries reached, giving up on OpenAI API call", error);
        throw error;
      }
    }
  }
  
  // This should never be reached due to throw in the loop, but TypeScript wants it
  throw new Error("Failed to generate image after multiple retries");
}

export async function downloadImage(imageUrl: string): Promise<Blob> {
  console.log("Downloading image from OpenAI:", imageUrl.substring(0, 50) + "...");
  
  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const imageResponse = await fetch(imageUrl, { 
      signal: controller.signal,
      headers: {
        'Accept': 'image/png,image/*',
      }
    });
    clearTimeout(timeoutId);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    const contentType = imageResponse.headers.get('content-type');
    console.log(`Image response content type: ${contentType}`);
    
    const blob = await imageResponse.blob();
    console.log(`Image downloaded successfully. Size: ${blob.size} bytes, Type: ${blob.type}`);
    
    // Verify the blob is valid
    if (blob.size === 0) {
      throw new Error("Downloaded image has zero size");
    }
    
    // Convert non-png images to png if needed
    if (blob.type !== 'image/png') {
      console.log("Converting image to PNG format...");
      return await convertToPng(blob);
    }
    
    return blob;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}

// Helper function to convert any image to PNG format
async function convertToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      canvas.convertToBlob({ type: 'image/png' })
        .then(pngBlob => {
          console.log(`Image converted to PNG. New size: ${pngBlob.size} bytes`);
          resolve(pngBlob);
        })
        .catch(reject);
    };
    
    img.onerror = () => reject(new Error("Failed to load image for conversion"));
    img.src = URL.createObjectURL(blob);
  });
}
