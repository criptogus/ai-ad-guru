
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsRequest } from "../generate-image/utils.ts";
import { supabaseAdmin } from "./supabaseClient.ts";

// Set up OpenAI API key
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsRequest(req);
  if (corsResponse) return corsResponse;
  
  try {
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    // Parse request body
    const requestData = await req.json();
    const { 
      promptTemplate, 
      mainText, 
      subText,
      companyName,
      brandTone,
      industry,
      templateId,
      campaignId,
      userId
    } = requestData;
    
    console.log("Received image generation request:", JSON.stringify({
      templateId,
      mainText,
      subText,
      campaignId,
    }));
    
    if (!promptTemplate && !templateId) {
      throw new Error('Either promptTemplate or templateId is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required for image generation');
    }
    
    // Get template if templateId is provided
    let finalPrompt = promptTemplate;
    
    if (templateId && !promptTemplate) {
      // Fetch template from Supabase
      const { data: template, error } = await supabaseAdmin
        .from('prompt_templates')
        .select('*')
        .eq('id', templateId)
        .single();
        
      if (error) {
        throw new Error(`Error fetching template: ${error.message}`);
      }
      
      if (!template) {
        throw new Error(`Template with ID ${templateId} not found`);
      }
      
      finalPrompt = template.prompt_text;
    }
    
    // Replace template variables
    if (mainText) {
      finalPrompt = finalPrompt.replace(/\${mainText:[^}]*}/g, mainText);
    }
    
    if (subText) {
      finalPrompt = finalPrompt.replace(/\${subText:[^}]*}/g, subText);
    }
    
    // Add context about company, industry, and brand tone if available
    if (companyName || brandTone || industry) {
      finalPrompt += " The ad is for ";
      
      if (companyName) {
        finalPrompt += `${companyName}`;
      } else {
        finalPrompt += "a company";
      }
      
      if (industry) {
        finalPrompt += ` in the ${industry} industry`;
      }
      
      if (brandTone) {
        finalPrompt += `. The brand tone is ${brandTone}`;
      }
      
      finalPrompt += ".";
    }
    
    // Ensure prompt doesn't exceed OpenAI's limit (truncate if needed)
    const MAX_PROMPT_LENGTH = 1000;
    if (finalPrompt.length > MAX_PROMPT_LENGTH) {
      finalPrompt = finalPrompt.substring(0, MAX_PROMPT_LENGTH - 3) + "...";
      console.log(`Prompt was truncated to ${MAX_PROMPT_LENGTH} characters`);
    }
    
    console.log("Sending prompt to GPT-4o:", finalPrompt);
    
    // Call OpenAI API with GPT-4o model and image generation tool
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
            role: "user",
            content: finalPrompt
          }
        ],
        tools: [
          {
            type: "image_generation"
          }
        ]
      })
    });
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }
    
    const openAIData = await openAIResponse.json();
    console.log("OpenAI response:", JSON.stringify(openAIData));
    
    // Extract image URL from OpenAI response - using the new format with tool_calls
    const message = openAIData.choices?.[0]?.message;
    const toolCalls = message?.tool_calls;
    
    if (!toolCalls || toolCalls.length === 0) {
      throw new Error("No image was generated or no tool_calls in the response");
    }
    
    // Find the image generation tool call
    const imageToolCall = toolCalls.find((call: any) => call.type === "image_generation");
    if (!imageToolCall) {
      throw new Error("No image generation tool call in the response");
    }
    
    const imageUrl = imageToolCall.image?.url;
    if (!imageUrl) {
      throw new Error("No image URL in the tool_calls response");
    }
    
    // Store the generated image in database
    const { data: imageRecord, error: insertError } = await supabaseAdmin
      .from('generated_images')
      .insert({
        user_id: userId,
        campaign_id: campaignId || null,
        template_id: templateId || null,
        image_url: imageUrl,
        prompt_used: finalPrompt
      })
      .select()
      .single();
      
    if (insertError) {
      console.error("Error storing image record:", insertError);
      // Continue anyway - we'll return the image URL even if recording fails
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
        promptUsed: finalPrompt,
        recordId: imageRecord?.id
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
    
  } catch (error) {
    console.error("Error generating image with GPT-4o:", error);
    
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
