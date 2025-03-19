
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get API keys from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials are not properly set');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { 
      prompt, 
      brandTone, 
      companyName, 
      targetAudience, 
      uniqueSellingPoints,
      imageFormat = "square" // Default to square format (1024x1024)
    } = await req.json();
    
    if (!prompt) {
      throw new Error('Image prompt is required');
    }
    
    console.log(`Generating image with prompt: ${prompt}`);
    console.log(`Company: ${companyName}, Brand Tone: ${brandTone}`);
    console.log(`Image format: ${imageFormat}`);
    
    // Enhanced prompt for DALL-E 3 to ensure photorealism and ad best practices
    const enhancedPrompt = `
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
${getBrandToneStyle(brandTone)}

🎭 Target Audience & Context:
- Target Audience: ${targetAudience || 'General consumers'}
- Unique Selling Points: ${uniqueSellingPoints ? uniqueSellingPoints.join(', ') : 'High quality, reliable service'}
- Show the product/service in a real-world context that resonates with this audience
- Include natural emotional reactions from people interacting with the product

🔥 Conversion Optimization:
- Emphasize the emotional benefits (how it makes customers feel)
- Use aspirational imagery that shows the "after" state of using the product
- Include subtle lifestyle elements that the target audience identifies with
- Frame the image to draw attention to the key value proposition

IMPORTANT: This MUST be PHOTOREALISTIC with the quality of a professional advertising photograph taken by a commercial photographer with high-end equipment. NO cartoon styles, NO digital art styles, NO illustrations.
`;
    
    console.log("Enhanced DALL-E 3 prompt:", enhancedPrompt);
    
    // Determine image size based on requested format
    const imageSize = imageFormat === "portrait" ? "1024x1792" : "1024x1024";
    
    // Make direct fetch to OpenAI API to ensure proper parameters
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: imageSize,
        quality: "hd", // Use HD quality for better results
        style: "natural", // Natural style for more photorealistic results
        response_format: "url"
      })
    });
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.error("OpenAI API response:", data);
      throw new Error("No image was generated");
    }

    const temporaryImageUrl = data.data[0].url;
    
    if (!temporaryImageUrl) {
      throw new Error("Generated image URL is empty");
    }
    
    console.log("OpenAI image generation completed successfully");
    console.log("Temporary image URL:", temporaryImageUrl);
    
    // Download the image from OpenAI
    console.log("Downloading image from OpenAI...");
    const imageResponse = await fetch(temporaryImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const fileName = `ad-${Date.now()}.png`;
    
    // Check if ai-images bucket exists, create if not
    console.log("Checking if bucket exists...");
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketName = 'ai-images';
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log("Creating bucket:", bucketName);
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      
      if (bucketError) {
        console.error("Error creating bucket:", bucketError);
        throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
      }
    }
    
    // Upload the image to Supabase storage
    console.log("Uploading image to Supabase storage...");
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`instagram-ads/${fileName}`, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image to storage: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`instagram-ads/${fileName}`);
    
    const persistentImageUrl = publicUrlData.publicUrl;
    
    console.log("Image stored in Supabase storage");
    console.log("Persistent image URL:", persistentImageUrl);

    // Return the persistent image URL and the revised prompt used by DALL-E
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: persistentImageUrl,
        prompt: enhancedPrompt,
        revisedPrompt: data.data[0].revised_prompt || enhancedPrompt
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error("Error in generate-image function:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while generating the image" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Enhanced function to get style based on brand tone
function getBrandToneStyle(brandTone?: string): string {
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
