
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
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });
  
  return response.choices[0].message.content;
};
