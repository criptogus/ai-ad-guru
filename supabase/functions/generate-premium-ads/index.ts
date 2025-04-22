import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { parseGoogleAds, parseMetaAds, parseLinkedInAds, parseMicrosoftAds } from "./adResponseParsers.ts";

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
    const { campaignData, platform, language = "portuguese" } = body;
    
    console.log(`Generating premium ads for platform: ${platform}`);
    console.log('Using campaign data:', JSON.stringify(campaignData).substring(0, 200) + '...');
    
    // Check if we have the OpenAI API key
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in the environment variables");
    }
    
    // Prepare the system message
    const systemMessage = 
      "You are a world-class copywriter working at a top-tier advertising agency, focused on creating smart, persuasive and high-converting ad copy.";
    
    // Prepare the user message
    const userMessage = createPremiumPrompt(campaignData, platform, language);
    
    // Make OpenAI API call
    console.log("Sending request to OpenAI API with GPT-4o model");
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ],
        temperature: 0.8,
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
    
    // Extract the content
    const content = openAIData.choices[0].message.content;
    console.log("Content preview:", content.substring(0, 200) + "...");
    
    // Parse the response based on the platform
    let parsedAds;
    
    if (platform === 'google') {
      parsedAds = parseGoogleAds(content);
    } else if (platform === 'meta' || platform === 'instagram') {
      parsedAds = parseMetaAds(content);
    } else if (platform === 'linkedin') {
      parsedAds = parseLinkedInAds(content);
    } else if (platform === 'microsoft' || platform === 'bing') {
      parsedAds = parseMicrosoftAds(content);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    // Return the processed response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parsedAds 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in generate-premium-ads function:", error);
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

/**
 * Creates a premium prompt for ad generation using the exact template requested
 */
function createPremiumPrompt(campaignData: any, platform: string, language: string): string {
  const mentalTrigger = campaignData.mindTriggers?.[platform] || "";
  const companyName = campaignData.companyName || campaignData.name || "";
  const companyWebsite = campaignData.websiteUrl || campaignData.targetUrl || "";
  const productOrService = campaignData.companyDescription || campaignData.description || campaignData.industry || "";
  const campaignGoal = campaignData.objective || "awareness";
  const targetAudience = campaignData.targetAudience || "";
  const toneOfVoice = campaignData.brandTone || "professional";
  
  // Only generate ads for the requested platform
  let platformSpecificInstructions = "";
  if (platform === "google") {
    platformSpecificInstructions = "Create 5 high-performing Google Ads variations";
  } else if (platform === "meta" || platform === "instagram") {
    platformSpecificInstructions = "Create 3 high-performing Instagram/Meta Ads variations";
  } else if (platform === "linkedin") {
    platformSpecificInstructions = "Create 3 high-performing LinkedIn Ads variations";
  } else if (platform === "microsoft" || platform === "bing") {
    platformSpecificInstructions = "Create 3 high-performing Bing/Microsoft Ads variations";
  } else {
    platformSpecificInstructions = `Create 3 high-performing ${platform} ad variations`;
  }
  
  return `${platformSpecificInstructions}

Use the following context:

- Brand name: ${companyName}
- Website: ${companyWebsite}
- Product/service: ${productOrService}
- Campaign goal: ${campaignGoal}
- Target audience: ${targetAudience}
- Language: ${language}
- Tone of voice: ${toneOfVoice}
- Mental trigger: ${mentalTrigger}

Requirements:
- All texts should be tailored for the platform's best practices.
- Return only the ad text (no code), properly formatted.
- Keep the output in the specified language (${language}).
- Don't use placeholder text—write as if you were hired by a premium ad agency.
${platform === "meta" || platform === "instagram" || platform === "linkedin" 
  ? "- The ads must include text suitable to accompany an image (above the fold copy)."
  : ""}
${platform === "google" || platform === "microsoft" || platform === "bing"
  ? "- The ads must follow format: Headline 1 (30 chars), Headline 2 (30 chars), Headline 3 (30 chars), Description 1 (90 chars), Description 2 (90 chars)."
  : ""}
- Avoid generic phrases like "Try now" — focus on emotional resonance, benefits, and storytelling.

Return the result structured as JSON for easy parsing:

${getJsonStructureExample(platform)}`;
}

/**
 * Provides a JSON structure example based on the platform
 */
function getJsonStructureExample(platform: string): string {
  if (platform === "google" || platform === "microsoft" || platform === "bing") {
    return `[
  {
    "headline1": "Compelling First Headline",
    "headline2": "Strong Second Headline",
    "headline3": "Final Call To Action",
    "description1": "First persuasive description that explains benefits and creates desire in the audience.",
    "description2": "Second description with strong emotional appeal and clear next action step."
  },
  // more ad variations...
]`;
  } else if (platform === "meta" || platform === "instagram") {
    return `[
  {
    "headline": "Attention-Grabbing Headline",
    "primaryText": "Engaging and persuasive primary text that tells a story and connects emotionally with the viewer.",
    "description": "Additional context or supporting details",
    "imagePrompt": "Detailed description of what the ideal image should contain to complement this ad"
  },
  // more ad variations...
]`;
  } else if (platform === "linkedin") {
    return `[
  {
    "headline": "Professional Headline for B2B Context",
    "primaryText": "Focused business-oriented copy that establishes authority and showcases value proposition clearly.",
    "description": "Supporting business context or credentials",
    "imagePrompt": "Description of professional image that reinforces business credibility"
  },
  // more ad variations...
]`;
  }
  
  // Default generic structure
  return `[
  {
    "headline": "Main Ad Headline",
    "primaryText": "Main ad copy text",
    "description": "Additional details",
    "imagePrompt": "Image description"
  },
  // more ad variations...
]`;
}

/**
 * Parses the OpenAI response into structured ad data
 */
function parseAdResponse(response: string, platform: string, campaignData: any): any[] {
  try {
    console.log(`Parsing response for ${platform} ads`);
    
    // Try to extract JSON from the response (handles cases where OpenAI wraps JSON in markdown)
    let jsonContent = response;
    
    // Try to extract JSON if it's wrapped in code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // Try to parse the JSON content
    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (error) {
      console.error(`JSON parsing failed, trying to extract structured data for ${platform}`);
      return extractStructuredData(response, platform, campaignData);
    }
    
    // If response is already an array, return it
    if (Array.isArray(parsedData)) {
      return normalizeAdsForPlatform(parsedData, platform);
    }
    
    // If response is an object with platform-specific arrays
    if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
      const platformKey = getPlatformKey(platform, parsedData);
      if (platformKey && Array.isArray(parsedData[platformKey])) {
        return normalizeAdsForPlatform(parsedData[platformKey], platform);
      }
    }
    
    // Fallback to structured data extraction
    return extractStructuredData(response, platform, campaignData);
  } catch (error) {
    console.error(`Error parsing ${platform} ad response:`, error);
    // Return a simple fallback ad
    return createFallbackAds(platform, campaignData);
  }
}

/**
 * Get the key for platform-specific ads in the response
 */
function getPlatformKey(platform: string, data: any): string | null {
  if (platform === "google" && data.google_ads) return "google_ads";
  if (platform === "meta" && (data.meta_ads || data.instagram_ads)) return data.meta_ads ? "meta_ads" : "instagram_ads";
  if (platform === "instagram" && (data.instagram_ads || data.meta_ads)) return data.instagram_ads ? "instagram_ads" : "meta_ads";
  if (platform === "linkedin" && data.linkedin_ads) return "linkedin_ads";
  if (platform === "microsoft" && (data.microsoft_ads || data.bing_ads)) return data.microsoft_ads ? "microsoft_ads" : "bing_ads";
  if (platform === "bing" && (data.bing_ads || data.microsoft_ads)) return data.bing_ads ? "bing_ads" : "microsoft_ads";
  
  // Look for any key containing the platform name
  for (const key in data) {
    if (key.toLowerCase().includes(platform.toLowerCase()) && Array.isArray(data[key])) {
      return key;
    }
  }
  
  return null;
}

/**
 * Extract structured data from text response when JSON parsing fails
 */
function extractStructuredData(response: string, platform: string, campaignData: any): any[] {
  console.log(`Extracting structured data for ${platform} from text response`);
  
  if (platform === "google" || platform === "microsoft" || platform === "bing") {
    return extractSearchAds(response, platform, campaignData);
  } else if (platform === "meta" || platform === "instagram" || platform === "linkedin") {
    return extractSocialAds(response, platform, campaignData);
  }
  
  // Default fallback
  return createFallbackAds(platform, campaignData);
}

/**
 * Extract search ads (Google, Bing, Microsoft) from text response
 */
function extractSearchAds(response: string, platform: string, campaignData: any): any[] {
  const ads = [];
  
  // Split by ad indicators
  const adSections = response.split(/Ad \d+:|## Ad \d+|Ad Variation \d+:|Google Ad \d+:|Bing Ad \d+:|Microsoft Ad \d+:/i);
  
  for (let i = 1; i < adSections.length; i++) {  // Start from 1 to skip intro text
    const section = adSections[i].trim();
    if (!section) continue;
    
    // Extract headlines
    const h1Match = section.match(/H1:|Headline 1:|Title 1:/i);
    const h2Match = section.match(/H2:|Headline 2:|Title 2:/i);
    const h3Match = section.match(/H3:|Headline 3:|Title 3:/i);
    const d1Match = section.match(/D1:|Desc 1:|Description 1:/i);
    const d2Match = section.match(/D2:|Desc 2:|Description 2:/i);
    
    const headline1 = h1Match 
      ? extractTextAfterMatch(section, h1Match[0])
      : "";
      
    const headline2 = h2Match
      ? extractTextAfterMatch(section, h2Match[0])
      : "";
      
    const headline3 = h3Match
      ? extractTextAfterMatch(section, h3Match[0])
      : "";
      
    const description1 = d1Match
      ? extractTextAfterMatch(section, d1Match[0])
      : "";
      
    const description2 = d2Match
      ? extractTextAfterMatch(section, d2Match[0])
      : "";
    
    // If we find any headlines, create an ad
    if (headline1 || headline2 || headline3 || description1 || description2) {
      ads.push({
        headline1: headline1 || `${campaignData.companyName || 'Premium'} Service`,
        headline2: headline2 || 'Quality Solutions',
        headline3: headline3 || 'Contact Us Today',
        description1: description1 || `Discover ${campaignData.companyName || 'our'} premium solutions.`,
        description2: description2 || 'Get started today and see the difference.',
        path1: 'services',
        path2: 'premium'
      });
    }
  }
  
  // If we couldn't extract any structured ads, try a different approach
  if (ads.length === 0) {
    const lines = response.split('\n');
    
    // Look for patterns like "- H1: text" or "- Headline 1: text"
    let currentAd = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if line starts a new ad
      if (trimmed.match(/^Ad \d+:/) || trimmed.match(/^## Ad \d+/)) {
        if (Object.keys(currentAd).length > 0) {
          ads.push(currentAd);
          currentAd = {};
        }
        continue;
      }
      
      // Extract headline or description
      const h1Match = trimmed.match(/^-\s*H1:|^-\s*Headline 1:|^-\s*Title 1:/i);
      const h2Match = trimmed.match(/^-\s*H2:|^-\s*Headline 2:|^-\s*Title 2:/i);
      const h3Match = trimmed.match(/^-\s*H3:|^-\s*Headline 3:|^-\s*Title 3:/i);
      const d1Match = trimmed.match(/^-\s*D1:|^-\s*Desc 1:|^-\s*Description 1:/i);
      const d2Match = trimmed.match(/^-\s*D2:|^-\s*Description 2:/i);
      
      if (h1Match) {
        currentAd['headline1'] = trimmed.substring(h1Match[0].length).trim();
      } else if (h2Match) {
        currentAd['headline2'] = trimmed.substring(h2Match[0].length).trim();
      } else if (h3Match) {
        currentAd['headline3'] = trimmed.substring(h3Match[0].length).trim();
      } else if (d1Match) {
        currentAd['description1'] = trimmed.substring(d1Match[0].length).trim();
      } else if (d2Match) {
        currentAd['description2'] = trimmed.substring(d2Match[0].length).trim();
      }
    }
    
    // Add the last ad if it has content
    if (Object.keys(currentAd).length > 0) {
      ads.push(currentAd);
    }
  }
  
  // Return fallback if still no ads
  return ads.length > 0 ? normalizeAdsForPlatform(ads, platform) : createFallbackAds(platform, campaignData);
}

/**
 * Extract social media ads (Meta, Instagram, LinkedIn) from text response
 */
function extractSocialAds(response: string, platform: string, campaignData: any): any[] {
  const ads = [];
  
  // Split by ad indicators
  const adSections = response.split(/Ad \d+:|## Ad \d+|Ad Variation \d+:|Instagram Ad \d+:|Meta Ad \d+:|LinkedIn Ad \d+:/i);
  
  for (let i = 1; i < adSections.length; i++) {  // Start from 1 to skip intro text
    const section = adSections[i].trim();
    if (!section) continue;
    
    // Extract components
    const headlineMatch = section.match(/Headline:|Title:/i);
    const textMatch = section.match(/Text:|Primary Text:|Copy:/i);
    const descMatch = section.match(/Description:|Additional Text:/i);
    const imgPromptMatch = section.match(/Image Prompt:|Image Description:|Image:/i);
    
    const headline = headlineMatch 
      ? extractTextAfterMatch(section, headlineMatch[0])
      : "";
      
    const primaryText = textMatch
      ? extractTextAfterMatch(section, textMatch[0])
      : "";
      
    const description = descMatch
      ? extractTextAfterMatch(section, descMatch[0])
      : "";
      
    const imagePrompt = imgPromptMatch
      ? extractTextAfterMatch(section, imgPromptMatch[0])
      : "";
    
    // If we find any content, create an ad
    if (headline || primaryText) {
      ads.push({
        headline: headline || `${campaignData.companyName || 'Premium'} Solutions`,
        primaryText: primaryText || `Discover how ${campaignData.companyName || 'we'} can help your business grow.`,
        description: description || '',
        imagePrompt: imagePrompt || `Professional image for ${campaignData.companyName || 'business'} ad that shows ${campaignData.companyDescription || 'our services'}.`
      });
    }
  }
  
  // If we couldn't extract any structured ads, try a different approach
  if (ads.length === 0) {
    const lines = response.split('\n');
    
    // Look for complete paragraphs
    let currentAd = {};
    let inText = false;
    let textContent = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if line starts a new ad
      if (trimmed.match(/^Ad \d+:/) || trimmed.match(/^## Ad \d+/)) {
        if (Object.keys(currentAd).length > 0) {
          // If we collected text content, add it to the ad
          if (inText && textContent) {
            currentAd['primaryText'] = textContent.trim();
            textContent = '';
            inText = false;
          }
          ads.push(currentAd);
          currentAd = {};
        }
        continue;
      }
      
      // Check for headline, text, etc.
      if (trimmed.match(/^Headline:/i)) {
        if (inText && textContent) {
          currentAd['primaryText'] = textContent.trim();
          textContent = '';
          inText = false;
        }
        currentAd['headline'] = trimmed.substring(trimmed.indexOf(':') + 1).trim();
      } else if (trimmed.match(/^Text:/i) || trimmed.match(/^Primary Text:/i)) {
        if (inText && textContent) {
          currentAd['primaryText'] = textContent.trim();
          textContent = '';
          inText = false;
        }
        inText = true;
        const textAfterLabel = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        if (textAfterLabel) {
          textContent += textAfterLabel + ' ';
        }
      } else if (trimmed.match(/^Description:/i)) {
        if (inText && textContent) {
          currentAd['primaryText'] = textContent.trim();
          textContent = '';
          inText = false;
        }
        currentAd['description'] = trimmed.substring(trimmed.indexOf(':') + 1).trim();
      } else if (trimmed.match(/^Image Prompt:/i) || trimmed.match(/^Image:/i)) {
        if (inText && textContent) {
          currentAd['primaryText'] = textContent.trim();
          textContent = '';
          inText = false;
        }
        currentAd['imagePrompt'] = trimmed.substring(trimmed.indexOf(':') + 1).trim();
      } else if (trimmed && inText) {
        // Continue collecting text content
        textContent += trimmed + ' ';
      } else if (trimmed && !Object.keys(currentAd).length) {
        // If we have text with no label and no ad properties yet, assume it's headline
        currentAd['headline'] = trimmed;
      } else if (trimmed && !currentAd['primaryText'] && !inText) {
        // If we have text with no label but already have headline, assume it's primary text
        inText = true;
        textContent += trimmed + ' ';
      }
    }
    
    // Add the last ad if it has content
    if (Object.keys(currentAd).length > 0) {
      // If we collected text content, add it to the ad
      if (inText && textContent) {
        currentAd['primaryText'] = textContent.trim();
      }
      ads.push(currentAd);
    }
  }
  
  // Return fallback if still no ads
  return ads.length > 0 ? normalizeAdsForPlatform(ads, platform) : createFallbackAds(platform, campaignData);
}

/**
 * Extract text after a match until the next line break or next pattern
 */
function extractTextAfterMatch(text: string, match: string): string {
  const startIndex = text.indexOf(match) + match.length;
  let endIndex = text.indexOf('\n', startIndex);
  
  // If no newline, check for next pattern
  if (endIndex === -1) {
    endIndex = text.length;
  }
  
  // Check for other patterns that might end this field
  const patterns = ['Headline', 'Title', 'Description', 'Text', 'Image', 'H1', 'H2', 'H3', 'D1', 'D2'];
  
  for (const pattern of patterns) {
    const patternIndex = text.indexOf(pattern + ':', startIndex);
    if (patternIndex !== -1 && patternIndex < endIndex) {
      endIndex = patternIndex;
    }
  }
  
  return text.substring(startIndex, endIndex).trim();
}

/**
 * Create fallback ads when parsing fails
 */
function createFallbackAds(platform: string, campaignData: any): any[] {
  console.log(`Creating fallback ads for ${platform}`);
  const companyName = campaignData.companyName || campaignData.name || 'Our Company';
  
  if (platform === "google" || platform === "microsoft" || platform === "bing") {
    return [
      {
        headline1: `${companyName} Services`,
        headline2: "Premium Quality",
        headline3: "Get Results Today",
        description1: `Discover how ${companyName} can help you achieve your goals with our premium services.`,
        description2: "Contact us today to learn more about our offers and solutions.",
        path1: "services",
        path2: "premium"
      },
      {
        headline1: `The ${companyName} Difference`,
        headline2: "Expert Solutions",
        headline3: "Contact Us Now",
        description1: `${companyName} offers specialized services designed to meet your specific needs and requirements.`,
        description2: "Visit our website to learn more about how we can help you succeed.",
        path1: "experts",
        path2: "solutions"
      },
      {
        headline1: `${companyName} - Top Rated`,
        headline2: "Trusted By Clients",
        headline3: "Free Consultation",
        description1: `Join thousands of satisfied clients who trust ${companyName} for professional services.`,
        description2: "Schedule your free consultation today and see the difference.",
        path1: "consultation",
        path2: "free"
      }
    ];
  } else {
    return [
      {
        headline: `${companyName} - Premium Solutions`,
        primaryText: `Discover how ${companyName} can transform your business with our industry-leading solutions. Our team of experts is ready to help you achieve your goals faster and more efficiently than ever before.`,
        description: "Professional services tailored to your needs",
        imagePrompt: `Professional image showing ${companyName}'s services in action, with satisfied clients in a modern setting.`
      },
      {
        headline: `Transform Your Business with ${companyName}`,
        primaryText: `Ready to take your business to the next level? ${companyName} provides cutting-edge solutions designed to boost your productivity, increase revenue, and outperform your competition.`,
        description: "Innovative solutions for modern businesses",
        imagePrompt: `Clean, modern image representing growth and success, featuring elements related to ${campaignData.industry || 'business'} with professional aesthetics.`
      },
      {
        headline: `${companyName} - Industry Leaders`,
        primaryText: `Join thousands of successful businesses that rely on ${companyName} every day. Our proven approaches deliver measurable results, helping you achieve your business objectives with confidence.`,
        description: "Trusted by industry leaders",
        imagePrompt: `Professional image showing business growth, success metrics, or team collaboration in a ${campaignData.industry || 'corporate'} environment.`
      }
    ];
  }
}

/**
 * Normalize ad data to ensure consistent structure for the platform
 */
function normalizeAdsForPlatform(ads: any[], platform: string): any[] {
  return ads.map(ad => {
    if (platform === "google" || platform === "microsoft" || platform === "bing") {
      return {
        headline1: ad.headline1 || ad.h1 || ad.headline || ad.headlines?.[0] || "",
        headline2: ad.headline2 || ad.h2 || ad.headlines?.[1] || "",
        headline3: ad.headline3 || ad.h3 || ad.headlines?.[2] || "",
        description1: ad.description1 || ad.d1 || ad.descriptions?.[0] || "",
        description2: ad.description2 || ad.d2 || ad.descriptions?.[1] || "",
        path1: ad.path1 || ad.displayPath1 || ad.path || "",
        path2: ad.path2 || ad.displayPath2 || ""
      };
    } else {
      return {
        headline: ad.headline || ad.title || "",
        primaryText: ad.primaryText || ad.text || ad.content || ad.copy || "",
        description: ad.description || ad.additionalText || "",
        imagePrompt: ad.imagePrompt || ad.imageDescription || ad.image || ""
      };
    }
  });
}
