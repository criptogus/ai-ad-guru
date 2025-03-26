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

  // Start with a concise base prompt
  let enhancedPrompt = `Generate a high-quality advertising image: ${prompt}`;
  
  // Keep prompt concise to avoid exceeding OpenAI's 1000 character limit
  // Add only the most essential context
  if (companyName) {
    enhancedPrompt += ` For ${companyName}.`;
  }
  
  // Add brand tone in a concise way
  enhancedPrompt += ` ${brandTone} style.`;
  
  // Add platform-specific brief instructions
  if (platform === "instagram") {
    enhancedPrompt += " For Instagram.";
  } else if (platform === "linkedin") {
    enhancedPrompt += " For LinkedIn.";
  } else if (platform === "facebook") {
    enhancedPrompt += " For Facebook.";
  } else if (platform === "google") {
    enhancedPrompt += " For Google ads.";
  }
  
  // Add format specification
  if (imageFormat === "square") {
    enhancedPrompt += " Square format.";
  } else if (imageFormat === "portrait") {
    enhancedPrompt += " Vertical format.";
  } else if (imageFormat === "landscape") {
    enhancedPrompt += " Horizontal format.";
  }
  
  // Add only the most crucial industry/theme context
  if (industry && adTheme) {
    enhancedPrompt += ` ${industry} industry, ${adTheme} theme.`;
  } else if (industry) {
    enhancedPrompt += ` ${industry} industry.`;
  } else if (adTheme) {
    enhancedPrompt += ` ${adTheme} theme.`;
  }
  
  // Add final quality instructions in a concise manner
  enhancedPrompt += " Professional quality, high detail.";
  
  return enhancedPrompt;
}
