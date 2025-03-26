
interface PromptEnhancerConfig {
  prompt: string;
  companyName?: string;
  brandTone?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string;
  platform?: string;
  industry?: string;
  adTheme?: string;
  imageFormat?: string;
}

export function enhancePrompt(config: PromptEnhancerConfig): string {
  const {
    prompt,
    companyName,
    brandTone = "professional",
    targetAudience,
    uniqueSellingPoints,
    platform = "instagram",
    industry,
    adTheme,
    imageFormat = "square"
  } = config;

  // Start with the base prompt
  let enhancedPrompt = prompt;
  
  // Add only essential context in a concise manner
  const contextParts = [];
  
  if (companyName) {
    contextParts.push(`For ${companyName}`);
  }
  
  if (brandTone) {
    contextParts.push(`${brandTone} style`);
  }
  
  if (platform) {
    contextParts.push(`For ${platform}`);
  }
  
  if (imageFormat) {
    let formatDesc = "";
    if (imageFormat === "square") formatDesc = "Square format";
    else if (imageFormat === "portrait") formatDesc = "Vertical format";
    else if (imageFormat === "landscape") formatDesc = "Horizontal format";
    
    if (formatDesc) contextParts.push(formatDesc);
  }
  
  if (industry) {
    contextParts.push(`${industry} industry`);
  }
  
  if (adTheme) {
    contextParts.push(`${adTheme} theme`);
  }
  
  // Add quality instructions at the end
  contextParts.push("Professional quality, high detail");
  
  // Combine everything in a space-efficient way
  if (contextParts.length > 0) {
    enhancedPrompt += ". " + contextParts.join(", ") + ".";
  }
  
  return enhancedPrompt;
}
