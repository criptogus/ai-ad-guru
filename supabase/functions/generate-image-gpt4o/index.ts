
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../generate-image/utils.ts";

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
    let finalPrompt = imagePrompt + " High quality, photorealistic, detailed, professional photography style. Create a professional, high-quality Instagram ad image. The image should be visually striking with excellent lighting and composition.";
    
    console.log("Sending prompt to ChatGPT-4o:", finalPrompt.substring(0, 100) + "...");
    
    // Call OpenAI API with GPT-4o model and tool calling for image generation
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }
    
    const openAIData = await openAIResponse.json();
    console.log("OpenAI response received. Extracting image URL...");
    
    // Extract the image URL from the tool call
    const toolCalls = openAIData.choices[0]?.message?.tool_calls;
    
    if (!toolCalls || toolCalls.length === 0) {
      console.error("No tool calls found in response:", openAIData);
      throw new Error("No image generation tool call in the response");
    }
    
    const dalleToolCall = toolCalls.find(call => call.function.name === "dalle");
    
    if (!dalleToolCall) {
      console.error("DALL-E tool call not found in response");
      throw new Error("DALL-E tool call not found in response");
    }
    
    let dalleArgs;
    try {
      dalleArgs = JSON.parse(dalleToolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse DALL-E arguments:", e, dalleToolCall.function.arguments);
      throw new Error("Failed to parse DALL-E arguments");
    }
    
    // The image URL should be in the next message from the assistant
    const imageUrl = openAIData.choices[0]?.message?.content;
    
    if (!imageUrl || !imageUrl.includes("http")) {
      // If we don't have an image URL in the content, we need to submit the tool outputs to get the image
      console.log("Image URL not in initial response, fetching the image by submitting tool outputs...");
      
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
            openAIData.choices[0].message,
            {
              role: "tool",
              tool_call_id: dalleToolCall.id,
              content: JSON.stringify({ url: "IMAGE_URL_WILL_BE_HERE" })
            }
          ]
        })
      });
      
      if (!secondResponse.ok) {
        const errorData = await secondResponse.json();
        console.error("OpenAI second API error:", errorData);
        throw new Error(`OpenAI second API error: ${JSON.stringify(errorData)}`);
      }
      
      const secondResponseData = await secondResponse.json();
      const extractedImageUrl = secondResponseData.choices[0]?.message?.content;
      
      if (!extractedImageUrl || !extractedImageUrl.includes("http")) {
        console.error("No image URL in second response:", secondResponseData);
        throw new Error("No image URL found in the OpenAI response");
      }
      
      // Extract the URL from the response
      const urlMatch = extractedImageUrl.match(/(https?:\/\/[^\s]+)/);
      const finalImageUrl = urlMatch ? urlMatch[0] : null;
      
      if (!finalImageUrl) {
        console.error("Could not extract URL from content:", extractedImageUrl);
        throw new Error("Could not extract URL from content");
      }
      
      console.log("Successfully generated image URL from second request");
      
      return new Response(
        JSON.stringify({
          success: true,
          imageUrl: finalImageUrl,
          promptUsed: dalleArgs.prompt || finalPrompt
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Extract URL if it's embedded in text
    const urlMatch = imageUrl.match(/(https?:\/\/[^\s]+)/);
    const finalImageUrl = urlMatch ? urlMatch[0] : imageUrl;
    
    console.log("Successfully generated image URL");
    
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: finalImageUrl,
        promptUsed: dalleArgs.prompt || finalPrompt
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
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
