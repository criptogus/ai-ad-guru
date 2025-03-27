
// Wrapper for OpenAI API interactions

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Create an OpenAI client for interacting with the API
 */
export const createOpenAIClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }

  return {
    /**
     * Creates a chat completion with the OpenAI API
     */
    createChatCompletion: async ({
      model,
      messages,
      temperature = 0.7,
      max_tokens = 2000
    }: {
      model: string;
      messages: Message[];
      temperature?: number;
      max_tokens?: number;
    }): Promise<ChatCompletionResponse> => {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
      }
    }
  };
};
