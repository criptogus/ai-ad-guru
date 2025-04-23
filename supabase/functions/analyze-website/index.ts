
// analyze-website edge function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { CacheHandler } from "./cacheHandler.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize OpenAI and Cheerio modules
const cheerio = await import("https://esm.sh/cheerio@1.0.0-rc.12");
const OpenAI = await import("https://esm.sh/openai@4.8.0");

// Initialize OpenAI client with API key from environment
const openai = new OpenAI.OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    const { url, checkCacheOnly, userId } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Initialize cache handler
    const cacheHandler = new CacheHandler(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Check cache first
    const cacheResult = await cacheHandler.checkCache(url);
    
    // If only checking cache status, return that info
    if (checkCacheOnly) {
      return new Response(
        JSON.stringify({
          success: true,
          fromCache: cacheResult.fromCache,
          cachedAt: cacheResult.cachedAt,
          expiresAt: cacheResult.expiresAt,
          data: cacheResult.data
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we have cached data, return it
    if (cacheResult.fromCache) {
      console.log("Returning cached analysis for URL:", url);
      
      return new Response(
        JSON.stringify({
          success: true,
          fromCache: true,
          cachedAt: cacheResult.cachedAt,
          expiresAt: cacheResult.expiresAt,
          data: cacheResult.data
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Log credit usage for userId if provided
    if (userId && userId !== 'anonymous') {
      console.log("Recording credit usage for user:", userId);
      
      try {
        await supabaseClient
          .from('credit_logs')
          .insert([{
            user_id: userId,
            action: 'website_analysis',
            credits_used: 2,
            context: { url }
          }]);
      } catch (error) {
        console.error("Error logging credit usage:", error);
      }
    }
    
    console.log("Fetching and analyzing URL:", url);
    
    // Fetch website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }
    
    const htmlContent = await response.text();
    
    // Use cheerio to parse the HTML
    const $ = cheerio.load(htmlContent);
    
    // Extract main content
    let contentText = "";
    
    // Try to extract from common content selectors
    const contentSelectors = ['main', 'article', '#content', '.content', '#main', '.main'];
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        contentText += element.text() + " ";
      }
    }
    
    // If no content found from selectors, extract all visible body text
    if (contentText.trim() === "") {
      // Remove scripts, styles, and comments
      $('script, style, noscript, iframe, img').remove();
      contentText = $('body').text();
    }
    
    // Extract metadata
    const metaTitle = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Extract h1, h2, h3 tags for additional context
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      const headingText = $(el).text().trim();
      if (headingText) {
        headings.push(headingText);
      }
    });
    
    // Clean up the text
    contentText = contentText.replace(/\s+/g, ' ').trim();
    
    // Prepare the data for analysis
    const websiteData = {
      title: metaTitle,
      description: metaDescription,
      headings: headings.slice(0, 10).join(' | '), // Limit to first 10 headings
      content: contentText.substring(0, 5000) // Limit content to 5000 chars
    };
    
    console.log("Extracted website data:", {
      title: websiteData.title,
      descriptionLength: websiteData.description.length,
      headingsCount: headings.length,
      contentLength: websiteData.content.length
    });
    
    // Analyze the website using OpenAI
    const prompt = `
      You are a website analyzer that extracts key business information.
      
      Analyze the following website content and extract:
      1. Company Name
      2. Company/Business Description (a concise paragraph)
      3. Target Audience
      4. Brand Tone (e.g. professional, casual, luxurious)
      5. Keywords (5-10 relevant keywords)
      6. Call to Action phrases (2-4 phrases)
      7. Unique Selling Points (3-5 points)
      8. Industry category
      
      Website Title: ${websiteData.title}
      Website Description: ${websiteData.description}
      Headings: ${websiteData.headings}
      
      Website Content:
      ${websiteData.content}
      
      Format your response as JSON with these exact keys:
      {
        "companyName": "",
        "companyDescription": "",
        "businessDescription": "",
        "targetAudience": "",
        "brandTone": "",
        "keywords": [],
        "callToAction": [],
        "uniqueSellingPoints": [],
        "industry": ""
      }
      
      If you can't determine something, make an educated guess based on the available content.
      Do not include explanations, just the JSON object.
    `;
    
    console.log("Calling OpenAI for website analysis...");
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an AI specialized in analyzing websites and extracting business information. Respond only with the requested JSON format." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    
    // Parse the response
    const analysisResult = JSON.parse(completion.choices[0].message.content);
    
    // Fill in websiteUrl field
    analysisResult.websiteUrl = url;
    
    console.log("Analysis complete:", {
      companyName: analysisResult.companyName,
      industryDetected: analysisResult.industry,
      keywordsCount: analysisResult.keywords.length
    });
    
    // Cache the result
    await cacheHandler.cacheResult(url, analysisResult);
    
    // Return the analysis result
    return new Response(
      JSON.stringify({
        success: true,
        fromCache: false,
        data: analysisResult
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing website:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
