
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
  
  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    console.error("OpenAI API response:", JSON.stringify(data));
    throw new Error(data.error?.message || "No image was generated");
  }

  const temporaryImageUrl = data.data[0].url;
  
  if (!temporaryImageUrl) {
    console.error("Empty image URL in response:", JSON.stringify(data));
    throw new Error("Generated image URL is empty");
  }
  
  console.log("OpenAI image generation completed successfully");
  
  return { 
    url: temporaryImageUrl, 
    revisedPrompt: data.data[0].revised_prompt 
  };
}

export async function downloadImage(imageUrl: string): Promise<Blob> {
  console.log("Downloading image from OpenAI:", imageUrl);
  try {
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    const blob = await imageResponse.blob();
    console.log(`Image downloaded successfully. Size: ${blob.size} bytes, Type: ${blob.type}`);
    return blob;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}
