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
    uniqueSellingPoints
  } = data;
  
  // Format unique selling points if they exist
  const formattedUSPs = Array.isArray(uniqueSellingPoints) 
    ? uniqueSellingPoints.join(', ') 
    : uniqueSellingPoints || 'High quality, reliable service';
  
  // Get brand tone style from utility function
  const brandToneStyle = getBrandToneStyle(brandTone);
  
  // Create enhanced prompt for DALL-E 3 with optimized structure for advertising images
  return `
Generate a high-end, photorealistic advertising image designed for an Instagram ad campaign.

📌 Product & Brand: ${companyName || 'the company'} - ${prompt}
📌 Target Audience: ${targetAudience || 'General consumers'}
📌 Unique Selling Points: ${formattedUSPs}
📌 Visual Style: ${brandToneStyle}
📌 Composition: Professional product showcase with balanced framing, cinematic lighting, and subtle depth of field
📌 Background: A realistic, high-end commercial setting matching the brand tone
📌 Mood & Emotion: Engaging, aspirational, eye-catching
📌 Color Palette: Vibrant, high contrast, optimized for social media engagement
📌 Photography Standard: Commercial studio-grade quality, natural shadows, crisp details
📌 Avoid: Abstract elements, surreal distortions, unnatural proportions, excessive blur, ANY TEXT OVERLAYS

🎯 Goal: Create a realistic and high-conversion Instagram ad image that will drive clicks and engagement.

CRITICAL REQUIREMENTS:
1. This MUST be a PHOTOREALISTIC commercial photograph, NOT digital art or illustration
2. Use professional studio-quality photography techniques
3. Show the product/service in a real-world context that resonates with ${targetAudience || 'the target audience'}
4. Include subtle emotional elements that highlight the benefits
5. NO text overlay (Meta restricts excessive text in ad images)
6. Image must be clean, uncluttered, and focus on the main product/message
`.trim();
}
