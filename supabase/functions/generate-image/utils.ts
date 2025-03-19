
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

// Handle CORS for preflight requests
export function handleCorsRequest(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}
