
// Helper functions for the generate-image edge function

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced function to get style based on brand tone
export function getBrandToneStyle(brandTone?: string): string {
  if (!brandTone) return "Professional photography style with clean product focus";
  
  const tone = brandTone.toLowerCase();
  
  if (tone.includes("luxury") || tone.includes("premium") || tone.includes("elegant")) {
    return "Luxury high-end photography with rich textures, premium lighting, sophisticated composition, elegant atmosphere, subtle gold/black accents, aspirational lifestyle";
  }
  
  if (tone.includes("tech") || tone.includes("modern") || tone.includes("innovative")) {
    return "Modern tech photography with sleek minimalism, blue undertones, clean workspace, innovative context, subtle futuristic elements, product-centered composition";
  }
  
  if (tone.includes("playful") || tone.includes("fun") || tone.includes("energetic")) {
    return "Vibrant lifestyle photography with authentic joy, bright natural lighting, candid moments, genuine emotional reactions, dynamic composition, real people using product";
  }
  
  if (tone.includes("minimalist") || tone.includes("simple") || tone.includes("clean")) {
    return "Minimalist photography with ample negative space, single focal point, monochromatic palette, subtle shadows, clean lines, uncluttered composition";
  }
  
  if (tone.includes("professional") || tone.includes("business") || tone.includes("corporate")) {
    return "Professional business photography with confident professionals, productive environment, neutral tones, clean office setting, trustworthy expressions";
  }
  
  if (tone.includes("natural") || tone.includes("organic") || tone.includes("eco")) {
    return "Natural organic photography with warm sunlight, earthy tones, environmental elements, authentic textures, sustainable lifestyle context";
  }
  
  // Default style if no specific tone is matched
  return "High-quality professional product photography with lifestyle context, natural lighting, and authentic setting";
}

// Enhanced function to get LinkedIn-specific brand colors
export function getLinkedInPalette(): string {
  return "Professional color palette with combinations of: #0077B5 (LinkedIn blue), #313335 (charcoal gray), #F5F5F5 (light gray), #FFFFFF (white), with subtle accents of #0073B1 (darker blue) for corporate identity";
}

// LinkedIn-specific image prompt enhancer
export function enhanceLinkedInPrompt(data: any): string {
  const {
    prompt,
    companyName,
    brandTone,
    targetAudience,
    uniqueSellingPoints,
    industry,
    adTheme
  } = data;
  
  // Format unique selling points if they exist
  const formattedUSPs = Array.isArray(uniqueSellingPoints) 
    ? uniqueSellingPoints.join(', ') 
    : uniqueSellingPoints || 'Professional solutions, reliability, expertise';
  
  // Get brand tone style from utility function
  const brandToneStyle = getBrandToneStyle(brandTone);
  const linkedInPalette = getLinkedInPalette();
  
  // Create enhanced prompt for DALL-E 3 with LinkedIn-specific structure
  return `
Generate a high-quality, professional LinkedIn advertising image designed for B2B marketing.

📌 Business Context: ${companyName || 'the company'} - ${prompt}
📌 Industry: ${industry || 'Business/Technology'}
📌 Ad Theme: ${adTheme || 'Professional Services'}
📌 Target Audience: ${targetAudience || 'Business professionals, executives, and decision-makers'} 
📌 Unique Selling Points: ${formattedUSPs}
📌 Setting: Modern corporate environment, professional workspace, business meeting, or data-driven context
📌 Visual Style: ${brandToneStyle}
📌 Composition: Clean, well-balanced, corporate aesthetic with clear focal point and professional environment
📌 Color Palette: ${linkedInPalette}
📌 Mood & Emotion: Authoritative, trustworthy, success-oriented, professional, credible
📌 Background: Professional business context appropriate for LinkedIn B2B advertising
📌 Photography Standard: Corporate photography style, premium lighting, realistic professional environment

🎯 Goal: Create a business-appropriate LinkedIn ad image that resonates with professionals and drives B2B engagement.

CRITICAL REQUIREMENTS:
1. Image MUST look PROFESSIONAL, CORPORATE, and BUSINESS-APPROPRIATE
2. Must be PHOTOREALISTIC with professional business context
3. No abstract art or playful elements that would be inappropriate for LinkedIn
4. NO text overlay (LinkedIn restricts excessive text in ad images)
5. Must convey trustworthiness, credibility, and professional expertise
6. Image must be clean, uncluttered, and appropriate for B2B marketing
`.trim();
}

// Handle CORS for preflight requests
export function handleCorsRequest(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}
