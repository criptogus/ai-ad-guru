
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.6.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

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

  try {
    const { websiteData, platform } = await req.json();
    
    if (!websiteData) {
      return new Response(JSON.stringify({ error: "Website data is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Analyzing audience for ${platform || 'all platforms'} using website data`);
    
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

Format your response as a structured analysis with clear sections and bullet points. Use 2024's best practices for ${platform} advertising.
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

Then, provide detailed targeting recommendations for each platform:

For Google Ads (Search & Display):
- Suggested keywords (with purchase or browsing intent)
- Audience awareness level (high, medium, low)
- Recommended geographic location
- Ideal devices (mobile/desktop)
- Suggested ad extensions
- Demographics (age, gender, income, education level)

For Meta Ads (Instagram/Facebook):
- Recommended custom audiences (e.g., engagement, traffic, lookalike)
- Interests related to the site content
- Age range and gender most likely to convert
- Suggested creatives (image or video)
- Ideal ad format (carousel, video, single image)
- Geolocation if applicable

For LinkedIn Ads:
- Job title targeting (e.g., C-Level, marketing, HR, technology)
- Industry/sector targeting
- Recommended company size
- Ideal geographic location
- Most appropriate campaign objective (brand awareness, leads, site visits)
- Recommended ad type (sponsored content, lead gen form, spotlight ad)

Format your response as a structured analysis with clear sections and bullet points for each platform. Use 2024's best practices for each advertising platform.
`;
  }
}

function parseAnalysisResponse(responseText: string, platform?: string): any {
  // For now, we'll return the raw text response
  // In a more advanced implementation, you could parse this into a structured format
  return {
    success: true,
    platform: platform || 'all',
    analysisText: responseText,
    // Additional structured data could be extracted here
  };
}
