
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAIClient {
  createChatCompletion: (params: ChatCompletionRequest) => Promise<OpenAIResponse>;
}

export const createOpenAIClient = (apiKey: string): OpenAIClient => {
  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }

  return {
    createChatCompletion: async (params: ChatCompletionRequest): Promise<OpenAIResponse> => {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
      }

      return await response.json();
    }
  };
};
