
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";

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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { url } = await req.json();
    console.log('Analyzing URL:', url);

    // Fetch website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) {
      throw new Error("Failed to parse HTML");
    }

    // Extract relevant content
    const title = doc.querySelector("title")?.textContent || "";
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute("content") || "";
    
    // Get main content (avoiding navigation, footer, etc)
    let mainContent = "";
    const contentElements = doc.querySelectorAll("main, article, section, .content, #content");
    for (let i = 0; i < contentElements.length; i++) {
      const text = contentElements[i].textContent?.trim();
      if (text && text.length > 50) {
        mainContent += text + "\n";
      }
      if (mainContent.length > 3000) break; // Limit content size
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `
    You are an expert business and marketing analyst. Analyze this website content and extract key business information.
    Use the website's original language in your response.

    Title: ${title}
    Meta Description: ${metaDescription}
    Keywords: ${metaKeywords}
    Content: ${mainContent.slice(0, 3000)}

    Extract and provide:
    1. Company Name
    2. Business Description (2-3 sentences)
    3. Target Audience
    4. Brand Tone/Voice
    5. Unique Selling Points (3-5 points)
    6. Keywords for Advertising (5-7 keywords)
    7. Call-to-Action Suggestions (3 variations)

    Return ONLY a JSON object with these exact fields:
    {
      "companyName": "string",
      "businessDescription": "string",
      "targetAudience": "string",
      "brandTone": "string",
      "uniqueSellingPoints": ["string"],
      "keywords": ["string"],
      "callToAction": ["string"]
    }
    `;

    console.log("Sending request to OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const analysisResult = JSON.parse(completion.choices[0].message.content);
    
    // Cache the result in the website_analysis_cache table
    const { data: supabaseUrl } = await Deno.env.get('SUPABASE_URL');
    const { data: supabaseKey } = await Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase
        .from('website_analysis_cache')
        .upsert({
          url,
          analysis_result: analysisResult,
        });
    }

    return new Response(
      JSON.stringify({ success: true, data: analysisResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
