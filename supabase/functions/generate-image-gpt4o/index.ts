import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Set up OpenAI API key
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    // Parse request body
    const requestData = await req.json();
    const { imagePrompt, platform = 'meta', format = 'feed', adContext = {} } = requestData;
    
    console.log("Received image generation request:", JSON.stringify({
      imagePrompt: imagePrompt?.substring(0, 100) + "...",
      platform,
      format
    }));
    
    if (!imagePrompt) {
      throw new Error('No image prompt provided');
    }
    
    // Enhance the prompt with platform-specific context
    let enhancedPrompt = enhancePromptWithContext(imagePrompt, platform, format, adContext);
    
    console.log("Enhanced prompt for GPT-4o:", enhancedPrompt.substring(0, 100) + "...");
    
    // Step 1: Call OpenAI API with GPT-4o model to generate the DALL-E prompt and invoke the tool
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional ad image generator. Create high-quality, eye-catching images for digital advertising campaigns. When asked to generate an image, use the DALL-E tool with an enhanced version of the user's prompt to create the perfect marketing visual."
          },
          {
            role: "user",
            content: `Generate an advertisement image based on this description: ${enhancedPrompt}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "dalle",
              description: "Generate an image based on a prompt",
              parameters: {
                type: "object",
                properties: {
                  prompt: {
                    type: "string",
                    description: "The prompt to generate an image for"
                  },
                  size: {
                    type: "string",
                    enum: ["1024x1024", "1792x1024", "1024x1792"],
                    description: "The size of the image"
                  }
                },
                required: ["prompt"]
              }
            }
          }
        ],
        tool_choice: {
          type: "function",
          function: {
            name: "dalle"
          }
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error response:", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("OpenAI response received. Processing tool calls...");
    
    // Extract the image URL from the tool call response
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    
    if (!toolCalls || toolCalls.length === 0) {
      console.error("No tool calls found in response:", data);
      throw new Error("No image generation tool call in the response");
    }
    
    const dalleToolCall = toolCalls.find(call => call.function.name === "dalle");
    
    if (!dalleToolCall) {
      console.error("DALLE tool call not found in response");
      throw new Error("DALLE tool call not found in response");
    }
    
    let dalleArgs;
    try {
      dalleArgs = JSON.parse(dalleToolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse DALLE arguments:", e, dalleToolCall.function.arguments);
      throw new Error("Failed to parse DALLE arguments");
    }
    
    // Step 2: Use the tool output by making a second request
    console.log("Making second request to get the image using tool call with prompt:", dalleArgs.prompt.substring(0, 100) + "...");
    
    const secondResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional ad image generator specializing in creating high-quality marketing visuals."
          },
          {
            role: "user",
            content: `Generate an advertisement image based on this description: ${enhancedPrompt}`
          },
          {
            role: "assistant",
            content: null,
            tool_calls: [dalleToolCall]
          },
          {
            role: "tool",
            tool_call_id: dalleToolCall.id,
            content: JSON.stringify({ revised_prompt: dalleArgs.prompt })
          }
        ]
      })
    });
    
    if (!secondResponse.ok) {
      const errorText = await secondResponse.text();
      console.error("OpenAI second API error:", errorText);
      throw new Error(`OpenAI second API error: ${errorText}`);
    }
    
    const secondData = await secondResponse.json();
    
    // Extract the image URL from the response content
    const contentWithImageUrl = secondData.choices?.[0]?.message?.content;
    
    if (!contentWithImageUrl) {
      console.error("No content in second response:", secondData);
      throw new Error("Empty response from OpenAI");
    }
    
    console.log("Received content with image URL:", contentWithImageUrl.substring(0, 100) + "...");
    
    // Extract the URL using regex
    const urlMatch = contentWithImageUrl.match(/(https:\/\/[^\s"]+\.(png|jpg|jpeg|webp))/i);
    
    if (!urlMatch || !urlMatch[0]) {
      // Try a more general URL match if specific image extensions don't match
      const generalUrlMatch = contentWithImageUrl.match(/(https:\/\/oaidalleapiprodscus\.blob\.core\.windows\.net\/[^\s"]+)/i);
      
      if (!generalUrlMatch || !generalUrlMatch[0]) {
        console.error("Could not extract URL from content:", contentWithImageUrl);
        throw new Error("Could not extract image URL from content");
      }
      
      console.log("Found image URL with general pattern:", generalUrlMatch[0]);
      
      return new Response(
        JSON.stringify({
          success: true,
          imageUrl: generalUrlMatch[0],
          promptUsed: dalleArgs.prompt
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 200
        }
      );
    }
    
    const imageUrl = urlMatch[0];
    console.log("Successfully extracted image URL:", imageUrl.substring(0, 50) + "...");
    
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: imageUrl,
        promptUsed: dalleArgs.prompt
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Error generating image:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});

/**
 * Enhances the prompt with platform-specific and format-specific context
 */
function enhancePromptWithContext(prompt: string, platform: string, format: string, adContext: any = {}) {
  let enhancedPrompt = prompt;
  
  // Add platform-specific context
  if (platform === 'meta' || platform === 'instagram') {
    enhancedPrompt += ' Create a vibrant, attention-grabbing image suitable for Instagram advertising.';
  } else if (platform === 'linkedin') {
    enhancedPrompt += ' Create a professional, business-oriented image suitable for LinkedIn advertising.';
  } else if (platform === 'google') {
    enhancedPrompt += ' Create a clean, high-quality image suitable for Google search advertising.';
  }
  
  // Add format-specific context
  if (format === 'feed') {
    enhancedPrompt += ' Format should be square or 4:5 aspect ratio for social media feed.';
  } else if (format === 'story' || format === 'reel') {
    enhancedPrompt += ' Format should be 9:16 vertical for social media stories or reels.';
  } else if (format === 'landscape') {
    enhancedPrompt += ' Format should be 16:9 landscape.';
  }
  
  // Add ad headline and primary text for additional context if available
  if (adContext.headline) {
    enhancedPrompt += ` The ad headline is: "${adContext.headline}".`;
  }
  
  if (adContext.primaryText && adContext.primaryText.length > 0) {
    // Extract the first sentence or part to keep the context concise
    const firstSentence = adContext.primaryText.split('.')[0];
    enhancedPrompt += ` The ad message is about: "${firstSentence}".`;
  }
  
  if (adContext.industry) {
    enhancedPrompt += ` The industry context is: ${adContext.industry}.`;
  }
  
  // Add quality guidance
  enhancedPrompt += ' High quality, photorealistic, detailed, professional advertising imagery with excellent lighting and composition.';
  
  // Add restrictions for advertising compliance
  enhancedPrompt += ' The image should not contain any text, numbers, logos, or watermarks as these will be added separately.';
  
  return enhancedPrompt;
}
