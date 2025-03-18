
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
      
      Format each ad variation like this:
      {
        "headlines": ["Headline 1", "Headline 2", "Headline 3"],
        "descriptions": ["Description 1", "Description 2"]
      }
      
      Return exactly 3 ad variations in this format as a JSON array.
      `;
      
      console.log("Sending Google Ads prompt to OpenAI...");
      
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
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
      
      Format each ad variation like this:
      {
        "primaryText": "Engaging caption with emojis",
        "headline": "Attention-grabbing headline",
        "description": "Additional details",
        "imagePrompt": "Detailed description for DALL-E image generation that matches the ad content and brand tone"
      }
      
      Return exactly 3 ad variations in this format as a JSON array.
      `;
      
      console.log("Sending Meta/Instagram Ads prompt to OpenAI...");
      
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });
    } else {
      throw new Error('Invalid platform specified');
    }

    const generatedContent = response.choices[0].message.content;
    console.log(`OpenAI response for ${platform} ads:`, generatedContent);
    
    let adData;
    
    try {
      // Find JSON in the response
      const jsonMatch = generatedContent.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        adData = JSON.parse(jsonMatch[0]);
      } else {
        // If not found, try to parse the entire response as JSON
        adData = JSON.parse(generatedContent);
      }
      
      // Handle both array and non-array responses
      if (!Array.isArray(adData)) {
        // If the response is not an array, check if it contains an array property
        const possibleArrayProperties = Object.values(adData).filter(value => Array.isArray(value));
        if (possibleArrayProperties.length > 0) {
          // Use the first array found
          adData = possibleArrayProperties[0];
        } else {
          console.error(`No array found in response for ${platform} ads:`, adData);
          adData = [];
        }
      }
      
      // Final check to ensure we have at least 3 ad variations
      if (!Array.isArray(adData) || adData.length === 0) {
        console.error(`Invalid ${platform} ad format received:`, adData);
        
        // Generate fallback ad variations if the response was invalid
        if (platform === 'google') {
          adData = [
            {
              headlines: [
                `${campaignData.companyName} Services`,
                "Professional Quality",
                "Contact Us Today"
              ],
              descriptions: [
                `${campaignData.businessDescription.substring(0, 80)}...`,
                `${callToAction} Visit our website now.`
              ]
            },
            {
              headlines: [
                "Expert Solutions",
                `${campaignData.companyName}`,
                "Trusted Provider"
              ],
              descriptions: [
                "Top-rated services tailored to your needs. Quality guaranteed.",
                `${callToAction} Don't wait.`
              ]
            },
            {
              headlines: [
                "Special Offer Inside",
                "Premium Services",
                `${campaignData.companyName}`
              ],
              descriptions: [
                "Discover how we can help you achieve your goals today.",
                `${callToAction} Learn more now.`
              ]
            }
          ];
        } else if (platform === 'meta') {
          adData = [
            {
              primaryText: `✨ Transform your experience with ${campaignData.companyName}! ${uniqueSellingPoints.split(',')[0]} ${callToAction.split(',')[0]}`,
              headline: "Discover the Difference",
              description: "Premium Quality",
              imagePrompt: `Professional advertisement for ${campaignData.companyName}, showing their services in action with a clean, modern aesthetic. ${campaignData.brandTone} style.`
            },
            {
              primaryText: `🚀 Ready for a change? ${campaignData.companyName} delivers results that matter! ${uniqueSellingPoints.split(',')[0]} ${callToAction.split(',')[0]}`,
              headline: "Excellence Delivered",
              description: "See the Difference",
              imagePrompt: `Eye-catching advertisement showcasing ${campaignData.companyName}'s unique value proposition with vibrant colors and professional imagery. ${campaignData.brandTone} feel.`
            },
            {
              primaryText: `💯 Don't settle for less! ${campaignData.companyName} - where quality meets exceptional service. ${callToAction.split(',')[0]}`,
              headline: "The Smart Choice",
              description: "Join Satisfied Customers",
              imagePrompt: `High-quality advertisement featuring satisfied customers experiencing ${campaignData.companyName}'s services, with a ${campaignData.brandTone} atmosphere.`
            }
          ];
        }
      }
      
    } catch (error) {
      console.error(`Failed to parse OpenAI response as JSON for ${platform} ads:`, generatedContent);
      console.error(`Error message:`, error.message);
      
      // Generate fallback ad variations if parsing failed
      if (platform === 'google') {
        adData = [
          {
            headlines: [
              `${campaignData.companyName}`,
              "Quality Service",
              "Contact Now"
            ],
            descriptions: [
              `${campaignData.businessDescription.substring(0, 80)}...`,
              `${callToAction.split(',')[0]}`
            ]
          },
          {
            headlines: [
              "Professional Solutions",
              `${campaignData.companyName}`,
              "Expert Service"
            ],
            descriptions: [
              "High-quality services tailored to your needs.",
              `${callToAction.split(',')[0]}`
            ]
          },
          {
            headlines: [
              "Limited Time Offer",
              "Premium Quality",
              `${campaignData.companyName}`
            ],
            descriptions: [
              "Discover how we can help you today.",
              `${callToAction.split(',')[0]}`
            ]
          }
        ];
      } else if (platform === 'meta') {
        adData = [
          {
            primaryText: `✨ Experience the best with ${campaignData.companyName}! ${callToAction.split(',')[0]}`,
            headline: "Discover Excellence",
            description: "Premium Service",
            imagePrompt: `Professional advertisement for ${campaignData.companyName}, clean modern style.`
          },
          {
            primaryText: `🚀 Ready to elevate? ${campaignData.companyName} delivers! ${callToAction.split(',')[0]}`,
            headline: "Quality Guaranteed",
            description: "See Results",
            imagePrompt: `Eye-catching advertisement for ${campaignData.companyName}, professional look.`
          },
          {
            primaryText: `💯 Premium quality from ${campaignData.companyName}. ${callToAction.split(',')[0]}`,
            headline: "Smart Choice",
            description: "Join Happy Customers",
            imagePrompt: `High-quality advertisement for ${campaignData.companyName}, professional feel.`
          }
        ];
      }
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
