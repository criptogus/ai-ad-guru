
import { OpenAI } from "https://esm.sh/openai@4.20.1";

// Initialize OpenAI client
export const getOpenAIClient = () => {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  return new OpenAI({
    apiKey: openaiApiKey,
  });
};

// Generate content with OpenAI
export const generateWithOpenAI = async (prompt: string) => {
  const openai = getOpenAIClient();
  
  console.log("Sending prompt to OpenAI...");
  console.log("Prompt length:", prompt.length);
  console.log("Prompt preview:", prompt.substring(0, 150) + "...");
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the most capable model for better ad generation
      messages: [
        { 
          role: "system", 
          content: "You are an expert advertising copywriter who creates high-converting, platform-specific ads based on marketing best practices. Return your response as properly formatted JSON only."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }, // Request JSON format
    });
    
    if (!response.choices || response.choices.length === 0) {
      console.error("OpenAI returned no choices");
      throw new Error("Failed to generate content with OpenAI - no choices returned");
    }
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating with OpenAI:", error);
    throw error;
  }
};
