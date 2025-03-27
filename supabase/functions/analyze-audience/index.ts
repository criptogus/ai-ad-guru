
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.6.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Initialize Supabase client for caching
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase configuration missing');
    // Continue without caching
  }

  const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

  try {
    const { websiteData, platform } = await req.json();
    
    if (!websiteData) {
      return new Response(JSON.stringify({ error: "Website data is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const websiteUrl = websiteData.websiteUrl || "";
    const cacheKey = `${websiteUrl}:${platform || 'all'}`;
    console.log(`Analyzing audience for ${platform || 'all platforms'} using website with URL: ${websiteUrl}`);
    
    // Check cache first if we have a valid URL and Supabase client
    if (websiteUrl && supabase) {
      // Check if we have a cached result (within the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from('audience_analysis_cache')
          .select('*')
          .eq('url', websiteUrl)
          .eq('platform', platform || 'all')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .maybeSingle();
        
        if (cacheError) {
          console.error("Error checking audience cache:", cacheError);
          // Continue with analysis even if cache check fails
        }
        
        // If we have a valid cached result, return it
        if (cachedData && cachedData.analysis_result) {
          console.log("Using cached audience analysis result from:", cachedData.created_at);
          return new Response(JSON.stringify({
            ...cachedData.analysis_result,
            fromCache: true,
            cachedAt: cachedData.created_at
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } catch (cacheError) {
        console.error("Error in audience cache operation:", cacheError);
        // Continue with analysis even if cache check fails
      }
    }
    
    // Create a prompt based on the provided advanced analytics prompt template
    const prompt = createAudienceAnalysisPrompt(websiteData, platform);
    
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using a smaller model for cost efficiency
      messages: [
        { role: "system", content: "You are a media strategist and audience analysis expert specializing in creating targeting recommendations for digital ad campaigns." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysisResult = parseAnalysisResponse(response.choices[0].message.content, platform);
    
    // Cache the analysis result if we have a URL and Supabase client
    if (websiteUrl && supabase) {
      try {
        const { error: upsertError } = await supabase
          .from('audience_analysis_cache')
          .upsert({
            url: websiteUrl,
            platform: platform || 'all',
            analysis_result: analysisResult
          }, { onConflict: 'url,platform' });
        
        if (upsertError) {
          console.error("Error caching audience analysis result:", upsertError);
          // Continue even if caching fails
        } else {
          console.log("Audience analysis result cached successfully");
        }
      } catch (cacheError) {
        console.error("Error in audience cache operation:", cacheError);
        // Continue even if caching fails
      }
    }
    
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error generating audience analysis:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function createAudienceAnalysisPrompt(websiteData: any, platform?: string) {
  // Extract the relevant content from website data
  const content = `
Company Name: ${websiteData.companyName || 'Unknown'}
Business Description: ${websiteData.businessDescription || 'Not provided'}
Target Audience: ${websiteData.targetAudience || 'Not specified'}
Brand Tone: ${websiteData.brandTone || 'Not specified'}
Keywords: ${websiteData.keywords ? websiteData.keywords.join(', ') : 'None provided'}
Unique Selling Points: ${websiteData.uniqueSellingPoints ? websiteData.uniqueSellingPoints.join(', ') : 'None provided'}
Call to Action: ${websiteData.callToAction ? websiteData.callToAction.join(', ') : 'None provided'}
Website URL: ${websiteData.websiteUrl || 'Not provided'}
  `;

  // Create the prompt based on whether a specific platform is requested
  if (platform) {
    return `
You are a media strategist and audience analysis expert. Based on the following website content, provide a detailed audience targeting recommendation specifically for ${platform} ads.

${content}

Analyze this content to identify:
1. The company's market segment
2. Products or services offered
3. Positioning and tone of voice
4. Communication objective (sales, branding, lead generation, etc.)

Then, provide detailed targeting recommendations for ${platform} including:
- Recommended audience segments
- Demographics (age, gender, income, education level if applicable)
- Geographic targeting
- Interests and behaviors
- Device targeting
- Ad format recommendations
- Campaign objective recommendations

Provide your response as structured JSON with the following fields but ALSO include a detailed narrative analysis outside of the JSON structure:
{
  "demographics": {
    "ageGroups": ["25-34", "35-44"],
    "gender": ["Male", "Female"],
    "educationLevel": ["College", "Graduate"],
    "incomeLevel": ["Middle", "Upper-middle"]
  },
  "interests": ["Interest1", "Interest2", "Interest3"],
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "decisionFactors": ["Factor1", "Factor2", "Factor3"]
}

After the JSON, provide a narrative analysis explaining your recommendations.
`;
  } else {
    // If no specific platform is requested, provide analysis for all platforms
    return `
You are a media strategist and audience analysis expert. Based on the following website content, provide a detailed audience targeting recommendation for Google Ads, Meta Ads (Facebook/Instagram), and LinkedIn Ads.

${content}

Analyze this content to identify:
1. The company's market segment
2. Products or services offered
3. Positioning and tone of voice
4. Communication objective (sales, branding, lead generation, etc.)

Then, provide detailed targeting recommendations for each platform.

Provide your response as structured JSON with the following fields but ALSO include a detailed narrative analysis outside of the JSON structure:
{
  "demographics": {
    "ageGroups": ["25-34", "35-44"],
    "gender": ["Male", "Female"],
    "educationLevel": ["College", "Graduate"],
    "incomeLevel": ["Middle", "Upper-middle"]
  },
  "interests": ["Interest1", "Interest2", "Interest3"],
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "decisionFactors": ["Factor1", "Factor2", "Factor3"]
}

After the JSON, provide a narrative analysis explaining your recommendations.
`;
  }
}

function parseAnalysisResponse(responseText: string, platform?: string): any {
  try {
    // Try to extract JSON from the response if it's present
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let analysisTextOnly = responseText;
    
    if (jsonMatch) {
      // Extract the JSON part
      const jsonStr = jsonMatch[0];
      const parsedData = JSON.parse(jsonStr);
      
      // Remove the JSON part from the analysis text to get clean text
      analysisTextOnly = responseText.replace(jsonMatch[0], '').trim();
      // Also remove any code block markers
      analysisTextOnly = analysisTextOnly.replace(/```json|```/g, '').trim();
      
      return {
        success: true,
        platform: platform || 'all',
        analysisText: analysisTextOnly,
        demographics: parsedData.demographics || {
          ageGroups: ["25-34", "35-44"],
          gender: ["All"],
          educationLevel: ["College", "Graduate"],
          incomeLevel: ["Middle", "Upper-middle"]
        },
        interests: parsedData.interests || ["Digital Marketing", "Technology", "Business"],
        painPoints: parsedData.painPoints || ["Time management", "ROI tracking", "Ad performance"],
        decisionFactors: parsedData.decisionFactors || ["Cost effectiveness", "Ease of use", "Support"]
      };
    }
    
    // Fallback - return structured data with the raw text
    return {
      success: true,
      platform: platform || 'all',
      analysisText: analysisTextOnly,
      demographics: {
        ageGroups: ["25-34", "35-44"],
        gender: ["All"],
        educationLevel: ["College", "Graduate"],
        incomeLevel: ["Middle", "Upper-middle"]
      },
      interests: ["Digital Marketing", "Technology", "Business"],
      painPoints: ["Time management", "ROI tracking", "Ad performance"],
      decisionFactors: ["Cost effectiveness", "Ease of use", "Support"]
    };
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    
    // Fallback data with the raw text
    return {
      success: true,
      platform: platform || 'all',
      analysisText: responseText,
      demographics: {
        ageGroups: ["25-34", "35-44"],
        gender: ["All"],
        educationLevel: ["College", "Graduate"],
        incomeLevel: ["Middle", "Upper-middle"]
      },
      interests: ["Digital Marketing", "Technology", "Business"],
      painPoints: ["Time management", "ROI tracking", "Ad performance"],
      decisionFactors: ["Cost effectiveness", "Ease of use", "Support"]
    };
  }
}
