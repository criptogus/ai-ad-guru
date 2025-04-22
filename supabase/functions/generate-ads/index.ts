
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { platform, campaignData, mindTrigger, systemMessage, userMessage } = body;
    
    console.log(`Generating ads for platform: ${platform}`);
    console.log('Using campaign data:', JSON.stringify(campaignData).substring(0, 200) + '...');
    
    // Check if we have the OpenAI API key
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in the environment variables");
    }
    
    // Construct the appropriate prompt based on the platform
    let prompt = "";
    
    if (systemMessage && userMessage) {
      // Use provided messages if available
      console.log("Using provided system and user messages");
    } else if (platform === 'google') {
      prompt = constructGoogleAdsPrompt(campaignData, mindTrigger);
    } else if (platform === 'meta' || platform === 'instagram') {
      prompt = constructMetaAdsPrompt(campaignData, mindTrigger);
    } else if (platform === 'linkedin') {
      prompt = constructLinkedInAdsPrompt(campaignData, mindTrigger);
    } else if (platform === 'microsoft') {
      prompt = constructMicrosoftAdsPrompt(campaignData, mindTrigger);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    // Make the OpenAI API call
    const messages = [];
    
    if (systemMessage && userMessage) {
      messages.push({ role: "system", content: systemMessage });
      messages.push({ role: "user", content: userMessage });
    } else {
      // Use default system message and constructed prompt
      messages.push({ 
        role: "system", 
        content: "You are an expert in digital advertising and copywriting. Create compelling, conversion-optimized ad copy for the specified platform."
      });
      messages.push({ role: "user", content: prompt });
    }
    
    // Make OpenAI API call
    console.log("Sending request to OpenAI API");
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using a more affordable model, upgrade to gpt-4o for better results
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    // Check if the request was successful
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }
    
    // Parse the response
    const openAIData = await openAIResponse.json();
    console.log("OpenAI response received");
    
    // Extract content and parse
    const content = openAIData.choices[0].message.content;
    console.log("Content preview:", content.substring(0, 200) + "...");
    
    // Process the response based on the platform
    let parsedResponse;
    
    try {
      // Try to parse JSON directly
      parsedResponse = JSON.parse(content);
    } catch (error) {
      // If direct parsing fails, try to extract JSON from markdown
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedResponse = JSON.parse(jsonMatch[1].trim());
        } catch (extractError) {
          console.error("Failed to parse extracted JSON:", extractError);
          throw new Error("Invalid JSON format in OpenAI response");
        }
      } else {
        // Fall back to text processing if JSON extraction fails
        parsedResponse = processTextResponse(content, platform, campaignData);
      }
    }
    
    // Return the processed response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractPlatformData(parsedResponse, platform)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in generate-ads function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Helper functions for constructing prompts
function constructGoogleAdsPrompt(campaignData, mindTrigger) {
  const { companyName, websiteUrl, objective, targetAudience, brandTone, industry } = campaignData;
  
  return `Create 5 Google Search Ads for ${companyName || "our company"}.
Company description: ${campaignData.companyDescription || industry || "Not provided"}
Target audience: ${targetAudience || "General audience"}
Brand tone: ${brandTone || "Professional"}
Website: ${websiteUrl || ""}
Objective: ${objective || "Increase brand awareness"}
Mind trigger (optional): ${mindTrigger || ""}

Each ad should include:
- 3 headlines (max 30 characters each)
- 2 descriptions (max 90 characters each)
- A display path (optional)

Format the response as a JSON array of objects with the following structure:
[
  {
    "headline1": "First headline text",
    "headline2": "Second headline text",
    "headline3": "Third headline text",
    "description1": "First description text",
    "description2": "Second description text",
    "displayPath": "example.com/path"
  }
]`;
}

function constructMetaAdsPrompt(campaignData, mindTrigger) {
  const { companyName, websiteUrl, objective, targetAudience, brandTone, industry } = campaignData;
  
  return `Create 5 Meta/Instagram Ads for ${companyName || "our company"}.
Company description: ${campaignData.companyDescription || industry || "Not provided"}
Target audience: ${targetAudience || "General audience"}
Brand tone: ${brandTone || "Engaging"}
Website: ${websiteUrl || ""}
Objective: ${objective || "Increase brand awareness"}
Mind trigger (optional): ${mindTrigger || ""}

Each ad should include:
- A headline (max 40 characters)
- Primary text (the main ad copy)
- A description (optional)
- An image prompt describing what would make an effective ad image
- A call to action

Format the response as a JSON array of objects with the following structure:
[
  {
    "headline": "Headline text",
    "primaryText": "Main ad copy text",
    "description": "Additional description",
    "imagePrompt": "Detailed description of the image that should be generated",
    "callToAction": "Learn More"
  }
]`;
}

function constructLinkedInAdsPrompt(campaignData, mindTrigger) {
  const { companyName, websiteUrl, objective, targetAudience, brandTone, industry } = campaignData;
  
  return `Create 3 LinkedIn Ads for ${companyName || "our company"}.
Company description: ${campaignData.companyDescription || industry || "Not provided"}
Target audience: ${targetAudience || "Business professionals"}
Brand tone: ${brandTone || "Professional"}
Website: ${websiteUrl || ""}
Objective: ${objective || "Increase brand awareness"}
Mind trigger (optional): ${mindTrigger || ""}

Each ad should include:
- A headline (max 50 characters)
- Primary text (150-200 characters)
- A description (optional)
- An image prompt describing what would make an effective ad image
- A call to action

Format the response as a JSON array of objects with the following structure:
[
  {
    "headline": "Headline text",
    "primaryText": "Main ad copy text",
    "description": "Additional description",
    "imagePrompt": "Detailed description of the image that should be generated",
    "callToAction": "Learn More"
  }
]`;
}

function constructMicrosoftAdsPrompt(campaignData, mindTrigger) {
  const { companyName, websiteUrl, objective, targetAudience, brandTone, industry } = campaignData;
  
  return `Create 3 Microsoft/Bing Ads for ${companyName || "our company"}.
Company description: ${campaignData.companyDescription || industry || "Not provided"}
Target audience: ${targetAudience || "General audience"}
Brand tone: ${brandTone || "Professional"}
Website: ${websiteUrl || ""}
Objective: ${objective || "Increase brand awareness"}
Mind trigger (optional): ${mindTrigger || ""}

Each ad should include:
- 3 headlines (max 30 characters each)
- 2 descriptions (max 90 characters each)
- A display path (optional)

Format the response as a JSON array of objects with the following structure:
[
  {
    "headline1": "First headline text",
    "headline2": "Second headline text",
    "headline3": "Third headline text",
    "description1": "First description text",
    "description2": "Second description text",
    "displayPath": "example.com/path"
  }
]`;
}

// Helper function to extract platform-specific data from the response
function extractPlatformData(parsedResponse, platform) {
  // Case 1: If the response is already an array, return it
  if (Array.isArray(parsedResponse)) {
    return parsedResponse;
  }
  
  // Case 2: Check for platform-specific keys
  if (platform === 'google' && parsedResponse.google_ads) {
    return parsedResponse.google_ads;
  } else if ((platform === 'meta' || platform === 'instagram') && parsedResponse.meta_ads) {
    return parsedResponse.meta_ads;
  } else if ((platform === 'meta' || platform === 'instagram') && parsedResponse.instagram_ads) {
    return parsedResponse.instagram_ads;
  } else if (platform === 'linkedin' && parsedResponse.linkedin_ads) {
    return parsedResponse.linkedin_ads;
  } else if (platform === 'microsoft' && parsedResponse.microsoft_ads) {
    return parsedResponse.microsoft_ads;
  }
  
  // Case 3: Return the entire response if none of the above apply
  return parsedResponse;
}

// Fallback function for text processing if JSON parsing fails
function processTextResponse(content, platform, campaignData) {
  console.log("Falling back to text processing for platform:", platform);
  
  if (platform === 'google' || platform === 'microsoft') {
    // Create basic structure for search ads
    const lines = content.split('\n').filter(line => line.trim());
    const ads = [];
    let currentAd = {};
    let adCount = 0;
    
    for (const line of lines) {
      if (line.includes('Headline') || line.includes('headline')) {
        // Save previous ad if it had headlines
        if (Object.keys(currentAd).length > 0 && currentAd.headline1) {
          ads.push(currentAd);
          adCount++;
          if (adCount >= 5) break;
          currentAd = {};
        }
        
        // Start a new ad if we see "Ad #" or similar patterns
        if (line.match(/Ad #\d|Ad \d|Headline 1/i)) {
          currentAd = {};
        }
        
        if (line.includes('Headline 1') || line.includes('headline 1')) {
          currentAd.headline1 = line.split(':')[1]?.trim() || `${campaignData.companyName} Offer`;
        } else if (line.includes('Headline 2') || line.includes('headline 2')) {
          currentAd.headline2 = line.split(':')[1]?.trim() || 'Quality Service';
        } else if (line.includes('Headline 3') || line.includes('headline 3')) {
          currentAd.headline3 = line.split(':')[1]?.trim() || 'Learn More Today';
        }
      } else if (line.includes('Description') || line.includes('description')) {
        if (line.includes('Description 1') || line.includes('description 1')) {
          currentAd.description1 = line.split(':')[1]?.trim() || `Discover ${campaignData.companyName}'s services. High quality solutions for your needs.`;
        } else if (line.includes('Description 2') || line.includes('description 2')) {
          currentAd.description2 = line.split(':')[1]?.trim() || 'Contact us today to learn more about our offers.';
        }
      }
    }
    
    // Add the last ad if it has content
    if (Object.keys(currentAd).length > 0 && currentAd.headline1) {
      ads.push(currentAd);
    }
    
    // If we couldn't extract ads, create a fallback
    if (ads.length === 0) {
      ads.push({
        headline1: campaignData.companyName || 'Quality Service',
        headline2: 'Premium Solutions',
        headline3: 'Contact Us Today',
        description1: `Discover ${campaignData.companyName}'s exceptional services. We offer the best quality for your needs.`,
        description2: 'Visit our website to learn more about our special offers.'
      });
    }
    
    return ads;
  } else {
    // For social media ads (Meta, Instagram, LinkedIn)
    const ads = [];
    const sections = content.split(/Ad #\d|Ad \d|---/);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      const ad = {
        headline: '',
        primaryText: '',
        description: '',
        imagePrompt: '',
        callToAction: ''
      };
      
      // Try to extract headline
      const headlineMatch = section.match(/Headline:?\s*(.*)/i);
      if (headlineMatch && headlineMatch[1]) {
        ad.headline = headlineMatch[1].trim();
      }
      
      // Try to extract primary text
      const primaryTextMatch = section.match(/Primary Text:?\s*([\s\S]*?)(?=Description|Image|Call to Action|$)/i);
      if (primaryTextMatch && primaryTextMatch[1]) {
        ad.primaryText = primaryTextMatch[1].trim();
      }
      
      // Try to extract description
      const descriptionMatch = section.match(/Description:?\s*([\s\S]*?)(?=Image|Call to Action|$)/i);
      if (descriptionMatch && descriptionMatch[1]) {
        ad.description = descriptionMatch[1].trim();
      }
      
      // Try to extract image prompt
      const imagePromptMatch = section.match(/Image Prompt:?\s*([\s\S]*?)(?=Call to Action|$)/i);
      if (imagePromptMatch && imagePromptMatch[1]) {
        ad.imagePrompt = imagePromptMatch[1].trim();
      }
      
      // Try to extract call to action
      const ctaMatch = section.match(/Call to Action:?\s*(.*)/i);
      if (ctaMatch && ctaMatch[1]) {
        ad.callToAction = ctaMatch[1].trim();
      }
      
      // Only add the ad if we have at least headline and primary text
      if (ad.headline && ad.primaryText) {
        ads.push(ad);
      }
    }
    
    // If we couldn't extract any ads, create a fallback
    if (ads.length === 0) {
      ads.push({
        headline: campaignData.companyName || 'Quality Service',
        primaryText: `Discover how ${campaignData.companyName} can help you achieve your goals. Our premium solutions are designed to meet your needs.`,
        description: 'We offer the best quality in the market.',
        imagePrompt: `Professional image of ${campaignData.companyName}'s products or services being used by satisfied customers.`,
        callToAction: 'Learn More'
      });
    }
    
    return ads;
  }
}
