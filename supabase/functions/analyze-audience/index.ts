
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

Format your response as JSON with the following structure:
{
  "demographics": {
    "ageGroups": ["25-34", "35-44"],
    "gender": ["Male", "Female"],
    "educationLevel": ["College", "Graduate"],
    "incomeLevel": ["Middle", "Upper-middle"]
  },
  "interests": ["Interest1", "Interest2", "Interest3"],
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "decisionFactors": ["Factor1", "Factor2", "Factor3"],
  "analysisText": "Your full text analysis here"
}
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

Format your response as JSON with the following structure:
{
  "demographics": {
    "ageGroups": ["25-34", "35-44"],
    "gender": ["Male", "Female"],
    "educationLevel": ["College", "Graduate"],
    "incomeLevel": ["Middle", "Upper-middle"]
  },
  "interests": ["Interest1", "Interest2", "Interest3"],
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "decisionFactors": ["Factor1", "Factor2", "Factor3"],
  "analysisText": "Your full text analysis here"
}
`;
  }
}

function parseAnalysisResponse(responseText: string, platform?: string): any {
  try {
    // Try to extract JSON from the response if it's present
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsedData = JSON.parse(jsonStr);
      
      return {
        success: true,
        platform: platform || 'all',
        analysisText: responseText,
        ...parsedData
      };
    }
    
    // Fallback - return structured data with the raw text
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
