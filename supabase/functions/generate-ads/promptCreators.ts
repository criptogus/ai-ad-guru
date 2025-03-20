
import { WebsiteAnalysisResult } from "./types.ts";

export function createGoogleAdsPrompt(data: WebsiteAnalysisResult): string {
  const uniqueSellingPoints = Array.isArray(data.uniqueSellingPoints) 
    ? data.uniqueSellingPoints.join("\n- ") 
    : data.uniqueSellingPoints || "";
    
  const callToAction = Array.isArray(data.callToAction) 
    ? data.callToAction.join(", ") 
    : data.callToAction || "Learn More";
    
  const keywords = Array.isArray(data.keywords) 
    ? data.keywords.join(", ") 
    : data.keywords || "";

  return `
Create 5 Google Search Ads for the following business:
  
Company name: ${data.companyName}
Business description: ${data.businessDescription || ""}
Target audience: ${data.targetAudience || ""}
Brand tone: ${data.brandTone || "Professional"}

Unique selling points:
- ${uniqueSellingPoints}

Primary keywords: ${keywords}
Call to action options: ${callToAction}

The output should be a JSON array of ad objects. Each ad should have:
1. "headlines": An array of 3 headlines, each 30 characters or less
2. "descriptions": An array of 2 descriptions, each 90 characters or less

Response format example:
[
  {
    "headlines": ["First Headline", "Second Headline", "Third Headline"],
    "descriptions": ["First description line that's compelling and under 90 chars.", "Second description line also under 90 characters."]
  },
  {...}
]

Ensure the content is professional, compelling, and within character limits. Include relevant keywords and CTAs from the provided options.
ONLY return the valid JSON array, nothing else. Do not use backticks or markdown formatting in your response.
`;
}

export function createLinkedInAdsPrompt(data: WebsiteAnalysisResult): string {
  const uniqueSellingPoints = Array.isArray(data.uniqueSellingPoints) 
    ? data.uniqueSellingPoints.join("\n- ") 
    : data.uniqueSellingPoints || "";
    
  const callToAction = Array.isArray(data.callToAction) 
    ? data.callToAction.join(", ") 
    : data.callToAction || "Learn More";
    
  const keywords = Array.isArray(data.keywords) 
    ? data.keywords.join(", ") 
    : data.keywords || "";

  return `
Create 3 LinkedIn Ads for the following business:
  
Company name: ${data.companyName}
Business description: ${data.businessDescription || ""}
Target audience: ${data.targetAudience || ""}
Brand tone: ${data.brandTone || "Professional"}

Unique selling points:
- ${uniqueSellingPoints}

Primary keywords: ${keywords}
Call to action options: ${callToAction}

The output should be a JSON array of ad objects. Each ad should have:
1. "headline": A headline (150 characters max)
2. "primaryText": The main ad copy (600 characters max)
3. "description": A brief description that can be used as a CTA (150 characters max)
4. "imagePrompt": A descriptive prompt for generating an image that would work well with this ad

Response format example:
[
  {
    "headline": "Compelling Headline Here",
    "primaryText": "Main ad copy that's informative and engaging goes here. This should speak to the target audience and highlight benefits.",
    "description": "Learn more about our solutions today.",
    "imagePrompt": "Professional image showing [relevant subject] that would represent the business well"
  },
  {...}
]

Ensure the content is professional, compelling, and within character limits. Create ads that would perform well on LinkedIn for the specified target audience.
ONLY return the valid JSON array, nothing else. Do not use backticks or markdown formatting in your response.
`;
}

export function createMicrosoftAdsPrompt(data: WebsiteAnalysisResult): string {
  const uniqueSellingPoints = Array.isArray(data.uniqueSellingPoints) 
    ? data.uniqueSellingPoints.join("\n- ") 
    : data.uniqueSellingPoints || "";
    
  const callToAction = Array.isArray(data.callToAction) 
    ? data.callToAction.join(", ") 
    : data.callToAction || "Learn More";
    
  const keywords = Array.isArray(data.keywords) 
    ? data.keywords.join(", ") 
    : data.keywords || "";

  return `
Create 5 Microsoft Search Ads for the following business:
  
Company name: ${data.companyName}
Business description: ${data.businessDescription || ""}
Target audience: ${data.targetAudience || ""}
Brand tone: ${data.brandTone || "Professional"}

Unique selling points:
- ${uniqueSellingPoints}

Primary keywords: ${keywords}
Call to action options: ${callToAction}

The output should be a JSON array of ad objects. Each ad should have:
1. "headlines": An array of 3 headlines, each 30 characters or less
2. "descriptions": An array of 2 descriptions, each 90 characters or less

Response format example:
[
  {
    "headlines": ["First Headline", "Second Headline", "Third Headline"],
    "descriptions": ["First description line that's compelling and under 90 chars.", "Second description line also under 90 characters."]
  },
  {...}
]

Ensure the content is professional, compelling, and within character limits. Include relevant keywords and CTAs from the provided options.
ONLY return the valid JSON array, nothing else. Do not use backticks or markdown formatting in your response.
`;
}

export function createMetaAdsPrompt(data: WebsiteAnalysisResult): string {
  const uniqueSellingPoints = Array.isArray(data.uniqueSellingPoints) 
    ? data.uniqueSellingPoints.join("\n- ") 
    : data.uniqueSellingPoints || "";
    
  const callToAction = Array.isArray(data.callToAction) 
    ? data.callToAction.join(", ") 
    : data.callToAction || "Learn More";
    
  const keywords = Array.isArray(data.keywords) 
    ? data.keywords.join(", ") 
    : data.keywords || "";

  return `
Create 3 Instagram Ads for the following business:
  
Company name: ${data.companyName}
Business description: ${data.businessDescription || ""}
Target audience: ${data.targetAudience || ""}
Brand tone: ${data.brandTone || "Professional"}

Unique selling points:
- ${uniqueSellingPoints}

Primary keywords: ${keywords}
Call to action options: ${callToAction}

The output should be a JSON array of ad objects. Each ad should have:
1. "headline": A headline (150 characters max)
2. "primaryText": The main ad copy (600 characters max)
3. "description": A brief description that can be used as a CTA (150 characters max)
4. "imagePrompt": A descriptive prompt for generating an image that would work well with this ad

Response format example:
[
  {
    "headline": "Compelling Headline Here",
    "primaryText": "Main ad copy that's informative and engaging goes here. This should speak to the target audience and highlight benefits.",
    "description": "Learn more about our solutions today.",
    "imagePrompt": "Professional image showing [relevant subject] that would represent the business well"
  },
  {...}
]

Ensure the content is professional, compelling, and within character limits. Create ads that would perform well on Instagram for the specified target audience.
ONLY return the valid JSON array, nothing else. Do not use backticks or markdown formatting in your response.
`;
}
