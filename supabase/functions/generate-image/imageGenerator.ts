
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
    console.error("OpenAI API error:", response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    console.error("OpenAI API response:", JSON.stringify(data, null, 2));
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
}

export async function downloadImage(imageUrl: string): Promise<Blob> {
  console.log("Downloading image from OpenAI:", imageUrl.substring(0, 50) + "...");
  
  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const imageResponse = await fetch(imageUrl, { signal: controller.signal });
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
    
    return blob;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}
