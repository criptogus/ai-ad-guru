
import { OpenAI } from "https://esm.sh/openai@4.20.1";

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Create an OpenAI client instance
export function getOpenAIClient() {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }
  
  return new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}
