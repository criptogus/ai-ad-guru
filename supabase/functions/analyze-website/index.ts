
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { OpenAI } from "https://esm.sh/openai@4.20.1";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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
    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "OpenAI API key is not configured" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Parse request body
    const requestData = await req.json();
    const { url } = requestData;
    
    if (!url) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "URL is required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Analyzing website: ${url}`);

    // Step 1: Fetch website content
    let websiteData;
    try {
      websiteData = await fetchWebsiteData(url);
      console.log("Successfully fetched website data");
    } catch (error) {
      console.error("Error fetching website data:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to fetch website data: ${error.message}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Step 2: Analyze website with OpenAI
    const prompt = `
    Analyze the following website data:
    - Title: ${websiteData.title}
    - Description: ${websiteData.description}
    - Keywords: ${websiteData.keywords}
    - Content Preview: ${websiteData.visibleText.substring(0, 3000)}

    Extract:
    - companyName: Company Name
    - businessDescription: Business Description (short, 1-2 sentences)
    - targetAudience: Target Audience (who buys from them, be specific with demographics and interests)
    - brandTone: Brand Tone (e.g., friendly, professional, luxury)
    - keywords: Top 5 Keywords for Ads (list format)
    - callToAction: 3 Call-to-Action suggestions (short phrases)
    - uniqueSellingPoints: 3 Unique Selling Points (what makes them different)
    
    Return this in clean JSON format without any additional text or explanation.
    `;

    try {
      console.log("Sending request to OpenAI...");
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      });

      console.log("Received response from OpenAI");
      const analysisText = response.choices[0].message.content;
      let websiteAnalysis;
      
      try {
        // Extract JSON from the response
        websiteAnalysis = JSON.parse(analysisText);
        console.log("Successfully parsed OpenAI response as JSON");
      } catch (error) {
        console.error("Failed to parse OpenAI response as JSON:", analysisText);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to parse website analysis data" 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log("Website analysis completed successfully");

      // Return the analysis results
      return new Response(JSON.stringify({ success: true, data: websiteAnalysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (openAiError) {
      console.error("OpenAI API error:", openAiError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Error communicating with AI service: ${openAiError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error in analyze-website function:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while analyzing the website" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

/**
 * Fetches and extracts data from a website URL
 */
async function fetchWebsiteData(url: string) {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log(`Fetching website: ${url}`);
    
    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    console.log(`Fetched ${html.length} bytes of HTML content`);
    
    // Parse HTML
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) {
      throw new Error("Failed to parse HTML");
    }

    // Extract title
    const title = doc.querySelector("title")?.textContent || "No title found";
    console.log(`Title: ${title}`);
    
    // Extract meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content") || 
                            doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || 
                            "No description found";
    
    // Extract meta keywords
    const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute("content") || 
                         "No keywords found";
    
    // Extract visible text
    let visibleText = "";
    // Get main content elements
    const contentElements = doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, a, span, div");
    for (let i = 0; i < contentElements.length; i++) {
      const text = contentElements[i].textContent?.trim();
      if (text && text.length > 20) { // Filter out short snippets that are likely not relevant
        visibleText += text + " ";
      }
      
      // Limit text length to avoid excessive token usage
      if (visibleText.length > 5000) {
        break;
      }
    }
    
    visibleText = visibleText.replace(/\s+/g, " ").trim();
    console.log(`Extracted ${visibleText.length} characters of visible text`);
    
    // Return structured data
    return {
      title,
      description: metaDescription,
      keywords: metaKeywords,
      visibleText
    };
  } catch (error) {
    console.error("Error in fetchWebsiteData:", error);
    throw error;
  }
}
