
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  generateGoogleAds, 
  generateLinkedInAds, 
  generateMicrosoftAds, 
  generateMetaAds 
} from "./adGenerators.ts";
import { WebsiteAnalysisResult } from "./types.ts";
import { 
  generateFallbackGoogleAds, 
  generateFallbackMicrosoftAds 
} from "./fallbacks/googleAdsFallbacks.ts";
import { 
  generateFallbackMetaAds, 
  generateFallbackLinkedInAds 
} from "./fallbacks/metaAdsFallbacks.ts";
import { getOpenAIClient } from "./openai.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }

  try {
    // Parse the request body
    const { platform, campaignData, mindTrigger, systemMessage, userMessage, platforms } = await req.json();
    
    console.log("Generating ads for platform:", platform || platforms);
    console.log("Campaign data:", JSON.stringify(campaignData, null, 2));
    
    // If we have systemMessage and userMessage, use the prompt-based generation
    if (systemMessage && userMessage) {
      // Handle the OpenAI prompt-based generation
      console.log("Generating content from custom prompt");
      const result = await generateFromPrompt(systemMessage, userMessage);
      return new Response(
        JSON.stringify({ success: true, content: result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Otherwise use the platform-specific generation
    if (!campaignData) {
      throw new Error("Missing campaign data");
    }
    
    // Log detailed context information
    console.log("Campaign data context:", JSON.stringify({
      companyName: campaignData.companyName,
      objective: campaignData.objective,
      targetAudience: campaignData.targetAudience,
      industry: campaignData.industry,
      mindTrigger: mindTrigger || campaignData.mindTrigger
    }, null, 2));
    
    let result;
    
    // Generate ads based on the platform
    switch (platform) {
      case "google":
        try {
          result = await generateGoogleAds(campaignData, mindTrigger || campaignData.mindTrigger);
        } catch (error) {
          console.error("Error generating Google ads, using fallback:", error);
          result = JSON.stringify(generateFallbackGoogleAds(campaignData));
        }
        break;
      case "linkedin":
        try {
          result = await generateLinkedInAds(campaignData, mindTrigger || campaignData.mindTrigger);
        } catch (error) {
          console.error("Error generating LinkedIn ads, using fallback:", error);
          result = JSON.stringify(generateFallbackLinkedInAds(campaignData));
        }
        break;
      case "microsoft":
        try {
          result = await generateMicrosoftAds(campaignData, mindTrigger || campaignData.mindTrigger);
        } catch (error) {
          console.error("Error generating Microsoft ads, using fallback:", error);
          result = JSON.stringify(generateFallbackMicrosoftAds(campaignData));
        }
        break;
      case "meta":
        try {
          result = await generateMetaAds(campaignData, mindTrigger || campaignData.mindTrigger);
        } catch (error) {
          console.error("Error generating Meta ads, using fallback:", error);
          result = JSON.stringify(generateFallbackMetaAds(campaignData));
        }
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, data: JSON.parse(result) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-ads function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Function to generate content from OpenAI prompts
async function generateFromPrompt(systemMessage: string, userMessage: string) {
  try {
    console.log("Generating content from prompts with system message:", 
                systemMessage ? systemMessage.substring(0, 100) + "..." : "No system message");
    console.log("User message:", userMessage ? userMessage.substring(0, 100) + "..." : "No user message");
    
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.log("No OpenAI API key found, returning mock data");
      return {
        google_ads: [
          {
            headline_1: "Drive Results with Us",
            headline_2: "Professional Solutions",
            headline_3: "Expert Service",
            description_1: "We provide top-quality service that meets your needs.",
            description_2: "Contact us today to learn more.",
            display_url: "example.com"
          },
          {
            headline_1: "Premium Solutions",
            headline_2: "Exceptional Quality",
            headline_3: "Best Value",
            description_1: "Find the perfect solution for your business needs.",
            description_2: "Trusted by thousands of customers.",
            display_url: "example.com"
          }
        ],
        instagram_ads: [
          {
            headline: "Transform Your Experience",
            primaryText: "Transform your experience with our innovative solutions. #innovation #quality",
            description: "Discover what makes us different",
            image_prompt: "Professional product display with elegant modern styling"
          },
          {
            headline: "Quality You Can Trust",
            primaryText: "Discover what makes us different. Quality you can trust. #trusted #reliable",
            description: "Premium service for discerning customers",
            image_prompt: "Lifestyle image showing product in use in a modern setting"
          }
        ]
      };
    }
    
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    const content = response.choices[0].message.content;
    console.log("OpenAI raw response received, content length:", content ? content.length : 0);
    console.log("Content sample:", content ? content.substring(0, 200) + "..." : "No content");
    
    try {
      // Try to parse the response as JSON
      if (content && (content.trim().startsWith('{') || content.trim().startsWith('['))) {
        const parsedJson = JSON.parse(content);
        console.log("Successfully parsed response as JSON");
        return parsedJson;
      } else if (content) {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const jsonContent = jsonMatch[1].trim();
          console.log("Extracted JSON from code block, attempting to parse");
          return JSON.parse(jsonContent);
        }
        
        console.log("Response is not JSON format, returning raw content");
        // Create a structured object from the raw text
        return {
          raw_content: content,
          google_ads: extractGoogleAdsFromText(content),
          meta_ads: extractMetaAdsFromText(content)
        };
      }
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw response:", content);
      
      // Return a fallback structure with the raw content
      return {
        raw_content: content,
        parsing_error: parseError.message,
        google_ads: [
          {
            headline_1: "Drive Results with Us",
            headline_2: "Professional Solutions",
            headline_3: "Expert Service",
            description_1: "We provide top-quality service that meets your needs.",
            description_2: "Contact us today to learn more.",
            display_url: "example.com"
          }
        ],
        meta_ads: [
          {
            headline: "Transform Your Experience",
            primaryText: "Transform your experience with our innovative solutions. #innovation #quality",
            description: "Discover what makes us different",
            image_prompt: "Professional product display with elegant modern styling"
          }
        ]
      };
    }
  } catch (error) {
    console.error("Error generating content from prompt:", error);
    throw error;
  }
}

// Extract Google ads from text content
function extractGoogleAdsFromText(text: string) {
  if (!text) return [];
  
  try {
    const ads = [];
    // Look for sections that might be Google ads
    const regex = /(?:Ad|Google Ad|Ad Variation)\s*\d+[\s\S]*?(?=Ad\s*\d+|$)/gi;
    const matches = text.match(regex) || [];
    
    for (const adText of matches) {
      const headlines = [];
      const descriptions = [];
      
      // Extract headlines
      const headlineRegex = /(?:Headline|Title|H)\s*\d+\s*:?\s*([^\n]+)/gi;
      let headlineMatch;
      while ((headlineMatch = headlineRegex.exec(adText)) !== null) {
        headlines.push(headlineMatch[1].trim());
      }
      
      // Extract descriptions
      const descRegex = /(?:Description|Desc|D)\s*\d+\s*:?\s*([^\n]+)/gi;
      let descMatch;
      while ((descMatch = descRegex.exec(adText)) !== null) {
        descriptions.push(descMatch[1].trim());
      }
      
      // Create ad object if we have at least one headline
      if (headlines.length > 0) {
        ads.push({
          headline_1: headlines[0] || "Professional Service",
          headline_2: headlines[1] || "Quality Solutions",
          headline_3: headlines[2] || "Contact Us Today",
          description_1: descriptions[0] || "We provide top-quality service that meets your needs.",
          description_2: descriptions[1] || "Contact us today to learn more.",
          display_url: "yourwebsite.com"
        });
      }
    }
    
    return ads.length > 0 ? ads : [
      {
        headline_1: "Professional Service",
        headline_2: "Quality Solutions",
        headline_3: "Contact Us Today",
        description_1: "We provide top-quality service that meets your needs.",
        description_2: "Contact us today to learn more.",
        display_url: "yourwebsite.com"
      }
    ];
  } catch (error) {
    console.error("Error extracting Google ads from text:", error);
    return [
      {
        headline_1: "Professional Service",
        headline_2: "Quality Solutions",
        headline_3: "Contact Us Today",
        description_1: "We provide top-quality service that meets your needs.",
        description_2: "Contact us today to learn more.",
        display_url: "yourwebsite.com"
      }
    ];
  }
}

// Extract Instagram ads from text content
function extractMetaAdsFromText(text: string) {
  if (!text) return [];
  
  try {
    const ads = [];
    // Look for Instagram ad sections
    const regex = /(?:Instagram Ad|Meta Ad|Social Ad)\s*\d+[\s\S]*?(?=(?:Instagram|Meta|Social) Ad\s*\d+|$)/gi;
    const matches = text.match(regex) || [];
    
    // If no explicit Instagram sections, look for general ad sections
    if (matches.length === 0) {
      const generalRegex = /(?:Ad)\s*\d+[\s\S]*?(?=Ad\s*\d+|$)/gi;
      const generalMatches = text.match(generalRegex) || [];
      
      for (const adText of generalMatches) {
        let headline = "";
        let caption = "";
        let description = "";
        let imagePrompt = "";
        
        // Look for headline
        const headlineMatch = adText.match(/(?:Headline|Title)\s*:?\s*([^\n]+)/i);
        if (headlineMatch) {
          headline = headlineMatch[1].trim();
        }
        
        // Look for caption/text
        const captionMatch = adText.match(/(?:Caption|Text|Copy)\s*:?\s*([^\n]+(?:\n[^\n]+)*?)(?=Image|$)/i);
        if (captionMatch) {
          caption = captionMatch[1].trim();
        } else {
          // Take first paragraph as caption if no explicit caption
          const lines = adText.split('\n').filter(line => line.trim());
          if (lines.length > 1) {
            caption = lines.slice(1).join('\n').trim();
          }
        }
        
        // Look for description
        const descMatch = adText.match(/(?:Description|Brief)\s*:?\s*([^\n]+)/i);
        if (descMatch) {
          description = descMatch[1].trim();
        }
        
        // Look for image prompt
        const imageMatch = adText.match(/(?:Image|Visual|Image Prompt|Photo)\s*:?\s*([^\n]+(?:\n[^\n]+)*?)(?=Caption|Text|Copy|$)/i);
        if (imageMatch) {
          imagePrompt = imageMatch[1].trim();
        } else {
          // Generate image prompt from caption
          imagePrompt = `Professional lifestyle image related to: ${caption.substring(0, 100)}`;
        }
        
        if (caption || headline) {
          ads.push({
            headline: headline || caption.split(' ').slice(0, 5).join(' '),
            primaryText: caption,
            description: description || "Learn more about our products and services",
            image_prompt: imagePrompt || "Professional brand image with modern aesthetic"
          });
        }
      }
    } else {
      // Process explicit Instagram sections
      for (const adText of matches) {
        let headline = "";
        let caption = "";
        let description = "";
        let imagePrompt = "";
        
        // Look for headline
        const headlineMatch = adText.match(/(?:Headline|Title)\s*:?\s*([^\n]+)/i);
        if (headlineMatch) {
          headline = headlineMatch[1].trim();
        }
        
        // Look for caption/text
        const captionMatch = adText.match(/(?:Caption|Text|Copy)\s*:?\s*([^\n]+(?:\n[^\n]+)*?)(?=Image|$)/i);
        if (captionMatch) {
          caption = captionMatch[1].trim();
        }
        
        // Look for description
        const descMatch = adText.match(/(?:Description|Brief)\s*:?\s*([^\n]+)/i);
        if (descMatch) {
          description = descMatch[1].trim();
        }
        
        // Look for image prompt
        const imageMatch = adText.match(/(?:Image|Visual|Image Prompt|Photo)\s*:?\s*([^\n]+(?:\n[^\n]+)*?)(?=Caption|Text|Copy|$)/i);
        if (imageMatch) {
          imagePrompt = imageMatch[1].trim();
        } else {
          // Generate image prompt from caption
          imagePrompt = `Professional lifestyle image related to: ${caption.substring(0, 100)}`;
        }
        
        if (caption || headline) {
          ads.push({
            headline: headline || caption.split(' ').slice(0, 5).join(' '),
            primaryText: caption,
            description: description || "Learn more about our products and services",
            image_prompt: imagePrompt || "Professional brand image with modern aesthetic"
          });
        }
      }
    }
    
    // Fallback if no ads found
    if (ads.length === 0) {
      const paragraphs = text.split('\n\n').filter(p => p.trim());
      if (paragraphs.length > 0) {
        ads.push({
          headline: "Premium Quality",
          primaryText: paragraphs[0].trim(),
          description: "Discover what sets us apart",
          image_prompt: "Professional lifestyle image representing the brand"
        });
      } else {
        ads.push({
          headline: "Premium Quality",
          primaryText: "Discover our premium quality products and services. #quality #innovation",
          description: "Learn what makes us different",
          image_prompt: "Professional lifestyle image with modern aesthetic"
        });
      }
    }
    
    return ads;
  } catch (error) {
    console.error("Error extracting Instagram ads from text:", error);
    return [
      {
        headline: "Premium Quality",
        primaryText: "Discover our premium quality products and services. #quality #innovation",
        description: "Learn what makes us different",
        image_prompt: "Professional lifestyle image with modern aesthetic"
      }
    ];
  }
}
