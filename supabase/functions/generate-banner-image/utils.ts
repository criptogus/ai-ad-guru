
// Define CORS headers for the generate-banner-image edge function
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
export function handleCorsRequest(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  return null;
}

// Get styling based on brand tone
export function getBrandToneStyle(brandTone?: string): string {
  switch (brandTone?.toLowerCase()) {
    case 'professional':
      return 'Corporate and polished with muted colors, clean lines, professional setting';
    case 'friendly':
    case 'casual':
      return 'Warm and approachable with soft lighting, casual environment, natural interactions';
    case 'luxury':
    case 'premium':
      return 'High-end and elegant with rich colors, premium materials, sophisticated environment';
    case 'playful':
    case 'fun':
      return 'Vibrant and energetic with bright colors, dynamic composition, playful elements';
    case 'minimalist':
      return 'Clean and simple with ample white space, minimal elements, intentional composition';
    case 'bold':
    case 'dynamic':
      return 'Strong and impactful with high contrast, dramatic lighting, powerful visual elements';
    case 'innovative':
    case 'tech':
      return 'Modern and cutting-edge with blue tones, digital elements, futuristic aesthetic';
    default:
      return 'Clean, modern, and professional with balanced composition and commercial quality';
  }
}

// LinkedIn-specific prompt enhancement
export function enhanceLinkedInPrompt(data: any): string {
  const {
    prompt,
    companyName,
    brandTone,
    targetAudience,
    uniqueSellingPoints,
    industry,
    adTheme,
    imageFormat
  } = data;
  
  // Format unique selling points if they exist
  const formattedUSPs = Array.isArray(uniqueSellingPoints) 
    ? uniqueSellingPoints.join(', ') 
    : uniqueSellingPoints || 'Quality, reliability, expertise';
  
  // Get style based on brand tone
  const brandToneStyle = getBrandToneStyle(brandTone);
  
  // Format for LinkedIn specifically
  const formatDesc = imageFormat === 'landscape' 
    ? 'wide rectangular format (1200x627px)' 
    : 'square format (1080x1080px)';
  
  // Industry-specific styling
  let industryStyling = '';
  if (industry) {
    switch(industry.toLowerCase()) {
      case 'technology':
        industryStyling = 'sleek devices, digital interfaces, innovation visuals';
        break;
      case 'finance':
        industryStyling = 'professional settings, subtle wealth indicators, data visualizations';
        break;
      case 'healthcare':
        industryStyling = 'clean environments, caring professionals, wellness imagery';
        break;
      case 'education':
        industryStyling = 'learning environments, diverse students, knowledge symbols';
        break;
      default:
        industryStyling = 'professional imagery suitable for business context';
    }
  }
  
  // Theme-specific elements
  let themeElements = '';
  if (adTheme) {
    switch(adTheme.toLowerCase()) {
      case 'innovation':
        themeElements = 'futuristic elements, cutting-edge visuals, forward-thinking';
        break;
      case 'leadership':
        themeElements = 'confident posture, authoritative presence, guiding visuals';
        break;
      case 'collaboration':
        themeElements = 'team settings, partnership imagery, connection metaphors';
        break;
      case 'growth':
        themeElements = 'upward trends, expansion visuals, development metaphors';
        break;
      default:
        themeElements = 'professional business elements';
    }
  }

  // Create enhanced prompt for DALL-E 3 with B2B focus
  return `
Generate a high-end, professional advertising image for LinkedIn campaigns.

📌 Core Focus: ${prompt}
📌 Industry Elements: ${industryStyling}
📌 Visual Theme: ${themeElements}
📌 Company: ${companyName || 'the brand'}
📌 Target Audience: ${targetAudience || 'B2B professionals'}
📌 Key Value Propositions: ${formattedUSPs}
📌 Visual Style: ${brandToneStyle}
📌 Format Optimization: ${formatDesc}

Technical Specifications:
- Create an ultra-polished, agency-quality image in ${formatDesc}
- Professional and sleek aesthetic with business-appropriate visuals
- Clean composition with strong focal point and space for later text overlay
- No text or logos in the image itself
- Modern, premium lighting with subtle depth and dimension

Concept Options (choose most appropriate):
1. Tech-Driven Success: Sleek devices or interfaces in a minimalist setting
2. Professional Environment: Modern workspace with collaborative elements
3. Abstract Business Concept: Dynamic visuals symbolizing growth or innovation
4. Confident Professional: Diverse business person exuding competence and trust
5. Premium Product/Service: High-end representation with dramatic lighting

Apply cinematic, commercial-grade lighting and composition techniques to create an image that feels agency-crafted, purposeful, and versatile for B2B marketing.
`.trim();
}
