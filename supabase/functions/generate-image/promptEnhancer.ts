
interface PromptEnhancerParams {
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

export function enhancePrompt({
  prompt,
  companyName = "",
  brandTone = "",
  targetAudience = "",
  uniqueSellingPoints = "",
  platform = "instagram",
  industry = "",
  adTheme = "",
  imageFormat = "square"
}: PromptEnhancerParams): string {
  
  // Format aspect ratio notes
  let formatGuide = "";
  if (imageFormat === "square") {
    formatGuide = "Use a square format (1:1 aspect ratio).";
  } else if (imageFormat === "landscape") {
    formatGuide = "Use a landscape format (1.91:1 aspect ratio, like 1792x1024).";
  } else if (imageFormat === "portrait") {
    formatGuide = "Use a portrait/vertical format (9:16 aspect ratio, ideal for Stories/Reels).";
  }
  
  // Create platform-specific guidelines
  let platformGuide = "";
  if (platform === "linkedin") {
    platformGuide = "Create a professional, business-oriented image for LinkedIn.";
  } else if (platform === "instagram") {
    if (imageFormat === "portrait") {
      platformGuide = "Create a visually striking vertical image for Instagram Stories/Reels.";
    } else {
      platformGuide = "Create a vibrant, attention-grabbing image for Instagram Feed.";
    }
  } else if (platform === "facebook") {
    platformGuide = "Create an engaging image for Facebook that builds connection.";
  }
  
  // Add specific industry/theme context if provided
  let themeContext = "";
  if (industry && adTheme) {
    themeContext = `The image should reflect the ${industry} industry with a ${adTheme} theme.`;
  } else if (industry) {
    themeContext = `The image should be appropriate for the ${industry} industry.`;
  } else if (adTheme) {
    themeContext = `The image should convey a ${adTheme} theme.`;
  }
  
  // Create a concise brand context section
  let brandContext = "";
  if (companyName || brandTone) {
    brandContext = `For ${companyName ? companyName + " " : ""}with a ${brandTone || "professional"} brand tone.`;
  }
  
  // Trim all unnecessary spaces and build the enhanced prompt
  return [
    prompt.trim(),
    formatGuide,
    platformGuide,
    themeContext,
    brandContext,
    "High quality, professional appearance with excellent lighting and composition.",
    "No watermarks or text overlay (text will be added separately)."
  ].filter(part => part.length > 0).join(" ");
}
