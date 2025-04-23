
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

    // Detect language first
    console.log("Detecting language of website content...");
    const languageDetectionPrompt = `
      You are a language detection system. Analyze the following website content and determine the primary language used.
      
      Website title: ${metaTitle}
      Website description: ${metaDescription}
      Content sample: ${contentText.substring(0, 500)}
      
      Respond with ONLY the ISO language code (e.g., "en", "pt", "es", "fr", etc.).
      Do not include any explanation or additional text.
    `;
    
    const languageDetection = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a language detection system. Respond with ONLY the ISO language code (e.g., 'en', 'pt', 'es', 'fr') without any explanation."
        },
        {
          role: "user",
          content: languageDetectionPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });
    
    const detectedLanguage = languageDetection.choices[0].message.content.trim().toLowerCase();
    console.log("Detected language:", detectedLanguage);
    
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
    
    // Define standard industry categories to guide the AI
    const standardIndustries = `
      Standard Industry Categories:
      - Education (schools, universities, e-learning, training)
      - Healthcare (hospitals, clinics, medical services)
      - Technology (software, hardware, IT services)
      - Finance (banking, insurance, investments)
      - Retail (e-commerce, stores, consumer goods)
      - Manufacturing (production, factories)
      - Marketing (agencies, advertising)
      - Real Estate (property, construction)
      - Travel (tourism, hospitality, hotels)
      - Food & Beverage (restaurants, catering)
      - Consulting (business services, professional advice)
      - Entertainment (media, events)
      - Energy (oil, gas, renewables)
      - Agriculture (farming, food production)
      - Arts (creative services, design)
      - Automotive (vehicles, transportation)
      - Media (publishing, broadcasting)
      - Pharmaceuticals (medicine, research)
      - Telecommunications (communication services)
      - Transportation (logistics, shipping)
    `;
    
    // Create a prompt that respects the detected language
    let systemPrompt = `You are an AI specialized in analyzing websites and extracting business information. Respond only with the requested JSON format.
    When identifying the industry category, you MUST choose one from the standard industry list and NOT use descriptive adjectives or qualities.`;
    
    // Use the detected language for the analysis prompt
    if (detectedLanguage === "pt") {
      systemPrompt += " Responda em português.";
    } else if (detectedLanguage === "es") {
      systemPrompt += " Responde en español.";
    } else if (detectedLanguage === "fr") {
      systemPrompt += " Répondez en français.";
    }
    
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
      8. Industry category - You MUST select from this standard list of industries:
         Education, Healthcare, Technology, Finance, Retail, Manufacturing, Marketing, Real Estate,
         Travel, Food & Beverage, Consulting, Entertainment, Energy, Agriculture, Arts, Automotive,
         Media, Pharmaceuticals, Telecommunications, Transportation, Professional Services, Non-Profit,
         Government, Sports, Fitness, Beauty, Fashion
      
      IMPORTANT: For the industry field, ONLY choose ONE standard industry category name from the list above.
      DO NOT use descriptive terms like "professional" or "inspirational" for the industry field.
      For example, if it's a school website, use "Education" not "Educational" or "Professional".
      
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
        "industry": "",
        "language": "${detectedLanguage}"
      }
      
      If you can't determine something, make an educated guess based on the available content.
      For the "industry" field, ONLY use a standard industry category name from the list provided.
      Do not include explanations, just the JSON object.
      Respond in the primary language of the website content.
    `;
    
    console.log("Calling OpenAI for website analysis...");
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    
    // Parse the response
    const analysisResult = JSON.parse(completion.choices[0].message.content);
    
    // Fill in websiteUrl field and ensure language is set
    analysisResult.websiteUrl = url;
    analysisResult.language = detectedLanguage;
    
    console.log("Analysis complete:", {
      companyName: analysisResult.companyName,
      industryDetected: analysisResult.industry,
      keywordsCount: analysisResult.keywords.length,
      language: analysisResult.language
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
