
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
    const { prompt, brandTone, companyName, targetAudience, uniqueSellingPoints } = await req.json();
    
    if (!prompt) {
      throw new Error('Image prompt is required');
    }
    
    console.log(`Generating image with prompt: ${prompt}`);
    console.log(`Company: ${companyName}, Brand Tone: ${brandTone}`);
    
    // Enhanced prompt for DALL-E 3 following best practices for Instagram ads
    const enhancedPrompt = `
Create a high-converting Instagram ad image for ${companyName || 'the company'}, promoting the following:

${prompt}

🔹 Best Practices:
- Clean, professional, and eye-catching composition
- High-quality, high-resolution ad style
- High contrast and vibrant colors to attract attention
- No text overlay (Meta restricts ad text)
- Product/service should be clearly visible and appealing
- Use a modern, engaging background that fits the brand tone: ${brandTone || 'professional'}
- Showcase how the product/service solves a problem or enhances lifestyle

🎨 Instagram Ad Visual Style:
${getBrandToneStyle(brandTone)}

Target Audience: ${targetAudience || 'General consumers'}
Unique Selling Points: ${uniqueSellingPoints ? uniqueSellingPoints.join(', ') : 'High quality, reliable service'}

🔥 Goal: Maximize Instagram engagement & conversions
`;
    
    console.log("Enhanced DALL-E 3 prompt:", enhancedPrompt);
    
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
        size: "1024x1024",
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

    // Return the persistent image URL
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: persistentImageUrl
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

// Helper function to get style based on brand tone
function getBrandToneStyle(brandTone?: string): string {
  if (!brandTone) return "Professional, clean design with neutral colors";
  
  const tone = brandTone.toLowerCase();
  
  if (tone.includes("luxury") || tone.includes("premium") || tone.includes("elegant")) {
    return "Elegant, sophisticated design with dark theme, premium feel, luxury aesthetics";
  }
  
  if (tone.includes("tech") || tone.includes("modern") || tone.includes("innovative")) {
    return "Futuristic, sleek UI, digital aesthetic with subtle neon accents, high-tech feel";
  }
  
  if (tone.includes("playful") || tone.includes("fun") || tone.includes("energetic")) {
    return "Bright colors, fun illustrations, energetic composition, playful aesthetic";
  }
  
  if (tone.includes("minimalist") || tone.includes("simple") || tone.includes("clean")) {
    return "Clean, neutral background, subtle shadows, minimalist design, uncluttered composition";
  }
  
  if (tone.includes("professional") || tone.includes("business") || tone.includes("corporate")) {
    return "Professional blue tones, business-appropriate design, corporate aesthetic";
  }
  
  // Default style if no specific tone is matched
  return "Professional, clean design with colors that pop on Instagram";
}
