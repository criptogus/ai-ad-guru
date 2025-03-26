
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

  // Build a comprehensive prompt for GPT-4o
  let enhancedPrompt = `Generate a high-quality, photorealistic advertising image: ${prompt}`;
  
  // Add company context
  if (companyName) {
    enhancedPrompt += ` For company: ${companyName}.`;
  }
  
  // Add brand tone guidance
  enhancedPrompt += ` Use a ${brandTone} visual tone.`;
  
  // Add platform-specific optimization
  if (platform === "instagram") {
    enhancedPrompt += ` Optimize for Instagram ads with vibrant colors and engaging composition.`;
  } else if (platform === "linkedin") {
    enhancedPrompt += ` Optimize for LinkedIn with professional aesthetics suitable for business audience.`;
  } else if (platform === "facebook") {
    enhancedPrompt += ` Optimize for Facebook with social engagement-focused visuals.`;
  } else if (platform === "google") {
    enhancedPrompt += ` Optimize for Google Display ads with clear focal points.`;
  }
  
  // Add industry context
  if (industry) {
    enhancedPrompt += ` Industry context: ${industry}.`;
  }
  
  // Add ad theme
  if (adTheme) {
    enhancedPrompt += ` Ad theme: ${adTheme}.`;
  }
  
  // Add target audience
  if (targetAudience) {
    enhancedPrompt += ` Target audience: ${targetAudience}.`;
  }
  
  // Add USPs
  if (uniqueSellingPoints) {
    enhancedPrompt += ` Highlight these unique selling points: ${uniqueSellingPoints}.`;
  }
  
  // Add format-specific guidance
  if (imageFormat === "square") {
    enhancedPrompt += ` Create in square format with balanced composition.`;
  } else if (imageFormat === "portrait") {
    enhancedPrompt += ` Create in portrait format with vertically stacked elements.`;
  } else if (imageFormat === "landscape") {
    enhancedPrompt += ` Create in landscape format optimized for wider displays.`;
  }
  
  // Add final quality instructions for GPT-4o
  enhancedPrompt += ` Create a highly realistic, professional advertising image with excellent lighting, composition, and detail. The image should be eye-catching and visually appealing, suitable for digital marketing.`;
  
  return enhancedPrompt;
}
