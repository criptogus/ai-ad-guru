
import { getBrandToneStyle } from "./utils.ts";

interface PromptData {
  prompt: string;
  companyName?: string;
  brandTone?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string[] | string;
}

export function enhancePrompt(data: PromptData): string {
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
  
  // Create enhanced prompt for DALL-E 3
  return `
Create a photorealistic, high-converting Instagram ad image for ${companyName || 'the company'}, with the following details:

${prompt}

🔹 Image Requirements:
- 100% PHOTOREALISTIC, NOT digital artwork or illustration
- Professional studio-quality photography
- Sharp focus, high resolution, and excellent lighting
- High contrast and vibrant, eye-catching colors
- NO text overlay (Meta restricts excessive text in ad images)
- Clean, uncluttered composition focusing on the main product/message

🎨 Instagram Ad Style:
${brandToneStyle}

🎭 Target Audience & Context:
- Target Audience: ${targetAudience || 'General consumers'}
- Unique Selling Points: ${formattedUSPs}
- Show the product/service in a real-world context that resonates with this audience
- Include natural emotional reactions from people interacting with the product

🔥 Conversion Optimization:
- Emphasize the emotional benefits (how it makes customers feel)
- Use aspirational imagery that shows the "after" state of using the product
- Include subtle lifestyle elements that the target audience identifies with
- Frame the image to draw attention to the key value proposition

IMPORTANT: This MUST be PHOTOREALISTIC with the quality of a professional advertising photograph taken by a commercial photographer with high-end equipment. NO cartoon styles, NO digital art styles, NO illustrations.
`.trim();
}
