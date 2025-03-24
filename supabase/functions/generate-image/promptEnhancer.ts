
import { getBrandToneStyle, enhanceLinkedInPrompt } from "./utils.ts";

interface PromptData {
  prompt: string;
  companyName?: string;
  brandTone?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string[] | string;
  platform?: string;
  industry?: string;
  adTheme?: string;
  imageFormat?: string;
}

export function enhancePrompt(data: PromptData): string {
  // If this is specifically for LinkedIn, use LinkedIn-specific enhancer
  if (data.platform === "linkedin") {
    return enhanceLinkedInPrompt(data);
  }
  
  // Otherwise, use the Instagram/Meta enhancer (default)
  const {
    prompt,
    companyName,
    brandTone,
    targetAudience,
    uniqueSellingPoints,
    platform
  } = data;
  
  // Format unique selling points if they exist
  const formattedUSPs = Array.isArray(uniqueSellingPoints) 
    ? uniqueSellingPoints.join(', ') 
    : uniqueSellingPoints || 'High quality, reliable service';
  
  // Get brand tone style from utility function
  const brandToneStyle = getBrandToneStyle(brandTone);
  
  // Determine if we're creating for Instagram specifically
  const isInstagram = platform === 'instagram' || platform === 'meta';
  
  // Create enhanced prompt for DALL-E 3 with optimized structure for advertising images
  return `
Generate a high-end, photorealistic advertising image designed for ${isInstagram ? 'an Instagram ad campaign' : 'digital advertising'}.

📌 Core Focus: ${prompt}
📌 Brand Context: ${companyName || 'the company'}
📌 Target Audience: ${targetAudience || 'General consumers'}
📌 Unique Selling Points: ${formattedUSPs}
📌 Visual Style: ${brandToneStyle}

Technical Specifications:
- Professional product/service showcase with balanced framing and cinematic lighting
- Realistic, high-end commercial setting matching the brand tone
- Engaging, aspirational, eye-catching mood
- Vibrant, high contrast color palette optimized for social media engagement
- Commercial studio-grade quality with natural shadows and crisp details
- NO text overlays or logos
- Clean composition with space for later text addition

Concept Options (choose most appropriate):
1. Lifestyle Elevation: Confident individual in vibrant environment showing product/service benefits
2. Product Spotlight: High-end product in dramatic setting with premium lighting
3. Abstract Impact: Dynamic visuals symbolizing the core benefit or emotion
4. Modern Context: Contemporary setting showing the product/service in real-world use
5. Tech-Forward: Sleek, innovative presentation with modern aesthetic

This MUST be a PHOTOREALISTIC commercial photograph, NOT digital art or illustration, using professional studio-quality photography techniques.
`.trim();
}
