
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Banner image generation started");
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    // Parse request body
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const { 
      prompt, 
      platform = "instagram", 
      format = "square",
      templateType = "product",
      templateName = "",
      templateId = "",
      brandTone = "professional"
    } = requestBody;
    
    if (!prompt) {
      throw new Error('Image prompt is required');
    }
    
    // Determine image size based on requested format
    let imageSize = "1024x1024"; // Default square format
    
    if (format === "story") {
      imageSize = "1024x1792"; // Portrait format
    } else if (format === "horizontal") {
      imageSize = "1792x1024"; // Landscape format
    }
    
    // Add template-specific style guidance based on the template type and name
    let templateStyleGuidance = "";
    
    switch (templateType) {
      case "product":
        templateStyleGuidance = `
- Focus on the product with clean, uncluttered background
- Use crisp, high-detail product visualization
- Apply subtle depth of field to highlight the product
- Include contextual elements showing the product in use
- Lighting should highlight product features
`;
        break;
      case "seasonal":
        templateStyleGuidance = `
- Incorporate seasonal color palette (summer: bright & vibrant, winter: cool blues & whites, etc.)
- Include subtle seasonal elements or symbols
- Create a mood that matches the season
- Use lighting that evokes the season (warm summer light, cool winter tones)
`;
        break;
      case "event":
        templateStyleGuidance = `
- Create a sense of excitement and anticipation
- Use dynamic composition that creates energy
- Include subtle event-related visual elements
- Professional and organized appearance
- Clear focal point to anchor event information
`;
        break;
      case "brand":
        templateStyleGuidance = `
- Sophisticated color palette that matches brand identity
- Clean, minimalist approach with breathing space
- Visual elements that convey brand values
- Consistent visual language throughout
- Subtle textures or patterns if appropriate
`;
        break;
      case "discount":
        templateStyleGuidance = `
- Use high contrast elements to create urgency
- Incorporate visual elements that suggest value
- Clear composition with strong focal point
- Energetic color choices that grab attention
- Dynamic angles or composition
`;
        break;
    }
    
    // Special handling for specific template IDs
    if (templateId === "webinar-event") {
      templateStyleGuidance += `
- Include visual elements specific to online events (screens, devices, virtual audience)
- Add technology elements that suggest digital connection
- Use blue tones that suggest professionalism and technology
- Include subtle visual elements like microphones, headsets, or presentation graphics
- Create a composition that suggests knowledge sharing and interaction
`;
    } else if (templateId === "holiday-special") {
      templateStyleGuidance += `
- Incorporate festive elements appropriate for holiday season (lights, decorations)
- Use warm, rich color palette with gold, red, or seasonal colors
- Include subtle gift elements or celebration visuals
- Create a cheerful, festive atmosphere
- Balance promotional intent with holiday spirit
`;
    } else if (templateId === "flash-sale") {
      templateStyleGuidance += `
- Use bold, high-contrast colors that create urgency (reds, oranges, yellows)
- Include dynamic elements that suggest limited time (clocks, timers)
- Create strong visual hierarchy that draws attention to the sale aspect
- Use diagonal or asymmetrical composition for energy
- Include subtle visual cues of value (price tags, percentage signs)
`;
    }
    
    // Add any template-name specific style if needed
    if (templateName.includes("minimalist")) {
      templateStyleGuidance += `
- Ultra-clean background with minimal elements
- Significant negative space
- Monochromatic or limited color palette
- Simple, geometric composition
`;
    }
    
    // Platform-specific guidance
    let platformGuidance = "";
    
    switch(platform) {
      case "instagram":
        platformGuidance = `
- Vibrant colors and visually striking composition
- High contrast to stand out in a busy feed
- Clear visual hierarchy that works on mobile screens
- Lifestyle-oriented imagery that feels authentic and engaging
- Composition allows for text overlays in key areas
`;
        break;
      case "linkedin":
        platformGuidance = `
- Professional and business-appropriate imagery
- Clean, corporate aesthetic with subtle color palette
- Visual elements that convey trust and expertise
- Sophisticated composition that appeals to professionals
- Clear areas for text that convey business messaging
`;
        break;
      case "google":
        platformGuidance = `
- Simple, clean design that stands out but doesn't feel cluttered
- Strong visual hook that can be understood quickly
- Clear areas for text overlay that maintain legibility
- Balanced color contrast for various display contexts
- Composition works across different display formats
`;
        break;
    }
    
    // Format-specific guidance
    let formatGuidance = "";
    
    switch(format) {
      case "square":
        formatGuidance = `
- Central focal point with balanced composition
- Visual elements arranged to work within 1:1 aspect ratio
- Equal weight distribution across the image
- Content properly framed within square boundaries
`;
        break;
      case "horizontal":
        formatGuidance = `
- Elements arranged to support left-to-right reading
- Visual weight balanced across horizontal layout
- Key elements positioned to avoid being cropped
- Composition utilizes the wider format effectively
`;
        break;
      case "story":
        formatGuidance = `
- Vertical composition with stacked visual hierarchy
- Key elements positioned in central field of view
- Content arranged to be viewed on vertical mobile screens
- Composition draws the eye from top to bottom
`;
        break;
    }
    
    // Tailor to brand tone
    let brandToneGuidance = "";
    switch (brandTone.toLowerCase()) {
      case "professional":
        brandToneGuidance = "Clean, corporate, trustworthy visual elements with balanced composition";
        break;
      case "playful":
        brandToneGuidance = "Vibrant colors, dynamic composition, and friendly visual elements";
        break;
      case "luxury":
        brandToneGuidance = "Rich textures, elegant composition, sophisticated color palette (golds, deep blues, etc.)";
        break;
      case "creative":
        brandToneGuidance = "Unique perspective, artistic elements, unexpected color combinations or compositions";
        break;
      default:
        brandToneGuidance = "Professional, clean visual elements with balanced composition";
    }
    
    // Enhance the prompt for better ad banner generation
    const enhancedPrompt = `
Generate a high-quality advertising banner image for ${platform} platform in ${format} format.

ADVERTISING CONTEXT:
- Banner Type: ${templateType} advertisement
- Template Style: ${templateName}
- Template ID: ${templateId}
- Platform: ${platform}
- Format: ${format}
- Brand Tone: ${brandToneGuidance}

SPECIFIC REQUIREMENTS:
${prompt}

TEMPLATE STYLE GUIDANCE:
${templateStyleGuidance}

PLATFORM-SPECIFIC GUIDANCE:
${platformGuidance}

FORMAT-SPECIFIC GUIDANCE:
${formatGuidance}

VISUAL STYLE:
- Professional, high-end commercial advertisement aesthetic
- Clean, uncluttered composition with focal point
- Optimal color contrast for text overlay visibility
- NO TEXT should be in the image (text will be added separately)
- Image should have areas with lower detail where text can be placed

TECHNICAL REQUIREMENTS:
- Photorealistic, commercial-grade image quality
- Proper lighting to highlight key elements
- Even color distribution
- Avoid busy backgrounds that would make text hard to read
`.trim();
    
    console.log("Enhanced DALL-E prompt:", enhancedPrompt);
    console.log(`Image size: ${imageSize}`);
    
    // Call OpenAI API to generate the image
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: imageSize,
        quality: "hd",
        style: "natural"
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("OpenAI API response:", JSON.stringify(data, null, 2));
    
    if (!data.data || data.data.length === 0) {
      console.error("OpenAI API response has no data");
      throw new Error("No image was generated");
    }
    
    const imageUrl = data.data[0].url;
    const revisedPrompt = data.data[0].revised_prompt;
    
    if (!imageUrl) {
      console.error("Empty image URL in response");
      throw new Error("Generated image URL is empty");
    }
    
    console.log("Image generation completed successfully");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        prompt: enhancedPrompt,
        revisedPrompt
      }), 
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
    
  } catch (error) {
    console.error("Error generating banner image:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
