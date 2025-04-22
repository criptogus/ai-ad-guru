

import { OpenAI } from "https://esm.sh/openai@4.20.1";

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Create an OpenAI client instance
export function getOpenAIClient() {
  if (!OPENAI_API_KEY) {
    console.error("CRITICAL ERROR: OPENAI_API_KEY is not set in environment variables");
    throw new Error("OPENAI_API_KEY environment variable is required but not set. Please configure it in your Supabase Edge Function secrets.");
  }
  
  try {
    return new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  } catch (error) {
    console.error("Error creating OpenAI client:", error);
    throw new Error("Failed to initialize OpenAI client. Please check your API key and try again.");
  }
}
