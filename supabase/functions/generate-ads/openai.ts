
import { OpenAI } from "https://esm.sh/openai@4.20.1";

// Enhanced environment variable handling with multiple fallback strategies
const getOpenAIApiKey = (): string => {
  // Attempt multiple methods to retrieve the API key
  const envMethods = [
    () => Deno.env.get("OPENAI_API_KEY"),
    () => Deno.env.get("OPENAI_KEY"),
    () => Deno.env.get("OPEN_AI_KEY")
  ];

  let apiKey: string | undefined;

  for (const method of envMethods) {
    try {
      apiKey = method();
      if (apiKey) break;
    } catch (e) {
      console.warn(`❌ Error accessing environment variable: ${e.message}`);
    }
  }

  if (!apiKey) {
    console.error("🚨 CRITICAL ERROR: No OpenAI API key found in environment variables");
    throw new Error("OpenAI API key is required but not set. Please configure it in Supabase Edge Function secrets.");
  }

  return apiKey;
};

// Configurable OpenAI client creation with optional base URL and timeout
export function getOpenAIClient(options: {
  baseURL?: string;
  timeout?: number;
} = {}) {
  try {
    const apiKey = getOpenAIApiKey();

    return new OpenAI({
      apiKey,
      baseURL: options.baseURL || "https://api.openai.com/v1",
      timeout: options.timeout || 30000, // 30 seconds default timeout
      // Optional: add custom fetch implementation if needed
      // fetchImplementation: customFetch
    });
  } catch (error) {
    console.error("❌ OpenAI Client Initialization Error:", error);
    throw new Error(`Failed to initialize OpenAI client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Optional: add a validation method for the API key
export async function validateOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey });
    
    // Perform a lightweight test by attempting a simple completion
    await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Test connection" }],
      max_tokens: 10
    });
    
    return true;
  } catch (error) {
    console.error("❌ OpenAI Key Validation Failed:", error);
    return false;
  }
}
