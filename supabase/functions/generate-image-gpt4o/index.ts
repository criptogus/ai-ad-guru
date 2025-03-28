
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
    const { imagePrompt } = requestData;
    
    console.log("Received image generation request:", JSON.stringify({
      imagePrompt: imagePrompt?.substring(0, 100) + "...",
    }));
    
    if (!imagePrompt) {
      throw new Error('No image prompt provided');
    }
    
    // Enhance the prompt for better results
    let finalPrompt = imagePrompt + " High quality, photorealistic, detailed, professional photography style.";
    
    console.log("Sending prompt to GPT-4o:", finalPrompt.substring(0, 100) + "...");
    
    // Call OpenAI API with GPT-4o model and tool calling for image generation
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
            content: "You are a professional image generator. When asked to create an image, use the DALL-E tool to generate it based on the description provided."
          },
          {
            role: "user",
            content: `Generate an image of: ${finalPrompt}`
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
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      } catch (e) {
        throw new Error(`OpenAI API error: ${errorText}`);
      }
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
    
    // Now we need to use the tool output by making a second request
    console.log("Making second request to get the image...");
    
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
            content: "You are a professional image generator. When asked to create an image, use the DALL-E tool to generate it based on the description provided."
          },
          {
            role: "user",
            content: `Generate an image of: ${finalPrompt}`
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
    
    // The image URL should be in the content of the response
    const contentWithImageUrl = secondData.choices?.[0]?.message?.content;
    
    if (!contentWithImageUrl || !contentWithImageUrl.includes("http")) {
      console.error("No image URL in second response:", secondData);
      throw new Error("No image URL found in the OpenAI response");
    }
    
    // Extract the URL from the content
    const urlMatch = contentWithImageUrl.match(/(https?:\/\/[^\s"]+)/);
    
    if (!urlMatch || !urlMatch[0]) {
      console.error("Could not extract URL from content:", contentWithImageUrl);
      throw new Error("Could not extract URL from content");
    }
    
    const imageUrl = urlMatch[0].replace(/\.$/, ""); // Remove trailing period if present
    
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
