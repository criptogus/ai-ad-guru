
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
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
    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Parse request body
    const { platform, campaignData } = await req.json();
    
    if (!platform || !campaignData) {
      throw new Error('Platform and campaign data are required');
    }
    
    console.log(`Generating ${platform} ads for ${campaignData.companyName}`);
    
    let prompt = '';
    let response;
    
    if (platform === 'google') {
      // Generate Google Ads
      prompt = `
      Generate 3 high-converting Google Search Ads for ${campaignData.companyName}.
      
      Business: ${campaignData.businessDescription}
      Target Audience: ${campaignData.targetAudience}
      Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(", ") : campaignData.keywords}
      Call to Action: ${Array.isArray(campaignData.callToAction) ? campaignData.callToAction.join(", ") : campaignData.callToAction}
      Brand Tone: ${campaignData.brandTone}
      Unique Selling Points: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(", ") : campaignData.uniqueSellingPoints}

      Follow Google Ads best practices:
      - Headline: 30 characters max per headline, 3 headlines total
      - Description: 90 characters max per description, 2 descriptions total
      - Include keywords, unique selling points, and call to action
      - Make it compelling and specific to the target audience

      Return output as JSON array:
      [
        {
          "headlines": ["Headline 1", "Headline 2", "Headline 3"],
          "descriptions": ["Description 1", "Description 2"]
        },
        ... (more ad variations)
      ]
      
      Only return valid JSON without any additional text or explanation.
      `;
      
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      });
      
    } else if (platform === 'meta') {
      // Generate Meta/Instagram Ads
      prompt = `
      Generate 3 high-converting Meta/Instagram Ads for ${campaignData.companyName}.
      
      Business: ${campaignData.businessDescription}
      Target Audience: ${campaignData.targetAudience}
      Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(", ") : campaignData.keywords}
      Call to Action: ${Array.isArray(campaignData.callToAction) ? campaignData.callToAction.join(", ") : campaignData.callToAction}
      Brand Tone: ${campaignData.brandTone}
      Unique Selling Points: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(", ") : campaignData.uniqueSellingPoints}

      Follow Meta Ads best practices:
      - Primary Text: Engaging caption with emojis (max 125 characters)
      - Headline: Attention-grabbing headline (max 40 characters)
      - Description: Additional details (max 30 characters)
      - Include call to action and value proposition
      - Make it visually descriptive for image generation

      For each ad, also include an image prompt that DALL-E could use to generate a matching image.
      
      Return output as JSON array:
      [
        {
          "primaryText": "...",
          "headline": "...",
          "description": "...",
          "imagePrompt": "detailed description for DALL-E image generation"
        },
        ... (more ad variations)
      ]
      
      Only return valid JSON without any additional text or explanation.
      `;
      
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1200,
      });
    } else {
      throw new Error('Invalid platform specified');
    }

    const generatedContent = response.choices[0].message.content;
    let adData;
    
    try {
      // Extract JSON from the response
      adData = JSON.parse(generatedContent);
    } catch (error) {
      console.error(`Failed to parse OpenAI response as JSON for ${platform} ads:`, generatedContent);
      throw new Error(`Failed to parse ${platform} ad generation data`);
    }

    console.log(`${platform} ad generation completed successfully`);

    // Return the generated ads
    return new Response(JSON.stringify({ success: true, data: adData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error in generate-ads function:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || `An error occurred while generating ads` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
