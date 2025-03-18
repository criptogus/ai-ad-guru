
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
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
    
    // Format keywords, CTAs, and USPs for better prompt formatting
    const keywords = Array.isArray(campaignData.keywords) ? campaignData.keywords.join(", ") : campaignData.keywords;
    const callToAction = Array.isArray(campaignData.callToAction) ? campaignData.callToAction.join(", ") : campaignData.callToAction;
    const uniqueSellingPoints = Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(", ") : campaignData.uniqueSellingPoints;
    
    let prompt = '';
    let response;
    
    if (platform === 'google') {
      // Generate Google Ads using the advanced prompt structure
      prompt = `
      You are a top-tier digital marketing expert specializing in high-converting online ads.
      
      Your goal is to create optimized ad variations for a company using the latest conversion-focused ad techniques.
      
      ### Company Information
      Company: ${campaignData.companyName}
      Business Description: ${campaignData.businessDescription}
      Target Audience: ${campaignData.targetAudience}
      Brand Tone: ${campaignData.brandTone}
      Keywords: ${keywords}
      Unique Selling Points: ${uniqueSellingPoints}
      Call-to-Action: ${callToAction}
      
      ## 🎯 Generate Google Search Ads
      Best Practices:
      - Headlines: Max 30 characters each, 3 headlines per ad
      - Descriptions: Max 90 characters each, 2 descriptions per ad
      - Each ad variation must focus on a different persuasion technique, such as:
        - Scarcity/Urgency (e.g., "Limited Time Offer!")
        - Social Proof (e.g., "Trusted by 10,000+ Customers")
        - Problem-Solution (e.g., "Tired of X? Try Y!")
        - Direct Benefit (e.g., "Boost Your Productivity Today!")
        - Emotional Appeal (e.g., "Feel More Confident with Y")
      
      ### Generate 3 Google Ad Variations
      Return in this JSON format:
      [
        {
          "headlines": ["Headline 1", "Headline 2", "Headline 3"],
          "descriptions": ["Description 1", "Description 2"]
        },
        {
          "headlines": ["Headline 1", "Headline 2", "Headline 3"],
          "descriptions": ["Description 1", "Description 2"]
        },
        {
          "headlines": ["Headline 1", "Headline 2", "Headline 3"],
          "descriptions": ["Description 1", "Description 2"]
        }
      ]
      
      Only return the JSON array with no additional text.
      `;
      
      console.log("Sending Google Ads prompt to OpenAI...");
      
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });
      
    } else if (platform === 'meta') {
      // Generate Meta/Instagram Ads using the advanced prompt structure
      prompt = `
      You are a top-tier digital marketing expert specializing in high-converting online ads.
      
      Your goal is to create optimized ad variations for a company using the latest conversion-focused ad techniques.
      
      ### Company Information
      Company: ${campaignData.companyName}
      Business Description: ${campaignData.businessDescription}
      Target Audience: ${campaignData.targetAudience}
      Brand Tone: ${campaignData.brandTone}
      Keywords: ${keywords}
      Unique Selling Points: ${uniqueSellingPoints}
      Call-to-Action: ${callToAction}
      
      ## 📸 Generate Instagram Ads (Text + Image)
      Best Practices:
      - Primary Text: Engaging caption with emojis (150-200 characters)
      - Headline: Attention-grabbing headline (max 40 characters)
      - Description: Additional details (max 30 characters)
      - Use emojis & hashtags when relevant
      - Call-to-action MUST be strong (e.g., "Shop Now!", "Sign Up Today!")
      
      ### Generate 3 Instagram Ad Variations
      For each ad, also include an image prompt that DALL-E could use to generate a matching image.
      
      Return in this JSON format:
      [
        {
          "primaryText": "Engaging caption with emojis",
          "headline": "Attention-grabbing headline",
          "description": "Additional details",
          "imagePrompt": "Detailed description for DALL-E image generation that matches the ad content and brand tone"
        },
        {
          "primaryText": "Engaging caption with emojis",
          "headline": "Attention-grabbing headline",
          "description": "Additional details",
          "imagePrompt": "Detailed description for DALL-E image generation that matches the ad content and brand tone"
        },
        {
          "primaryText": "Engaging caption with emojis",
          "headline": "Attention-grabbing headline",
          "description": "Additional details",
          "imagePrompt": "Detailed description for DALL-E image generation that matches the ad content and brand tone"
        }
      ]
      
      Only return the JSON array with no additional text.
      `;
      
      console.log("Sending Meta/Instagram Ads prompt to OpenAI...");
      
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });
    } else {
      throw new Error('Invalid platform specified');
    }

    const generatedContent = response.choices[0].message.content;
    console.log(`OpenAI response for ${platform} ads:`, generatedContent);
    
    let adData;
    
    try {
      // Extract JSON from the response
      adData = JSON.parse(generatedContent);
      
      // Handle both array and non-array responses
      if (!Array.isArray(adData)) {
        // If the response is not an array but contains an array property
        if (platform === 'google' && Array.isArray(adData.google_ads)) {
          adData = adData.google_ads;
        } else if (platform === 'meta' && Array.isArray(adData.instagram_ads)) {
          adData = adData.instagram_ads;
        }
      }
      
      // Final check to ensure we have an array
      if (!Array.isArray(adData)) {
        console.error(`Invalid ${platform} ad format received:`, adData);
        adData = [];
      }
      
    } catch (error) {
      console.error(`Failed to parse OpenAI response as JSON for ${platform} ads:`, generatedContent);
      throw new Error(`Failed to parse ${platform} ad generation data: ${error.message}`);
    }

    console.log(`${platform} ad generation completed successfully with ${adData.length} variations`);

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
