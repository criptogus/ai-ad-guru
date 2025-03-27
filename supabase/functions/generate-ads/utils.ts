
// Utility functions for generate-ads edge function

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Helper function to handle error responses
 */
export const handleErrorResponse = (error: unknown, message: string, status = 500) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`${message}: ${errorMessage}`);
  
  return new Response(
    JSON.stringify({ success: false, error: message, details: errorMessage }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status
    }
  );
};

/**
 * Helper function to safely parse JSON
 */
export const safeJsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    
    // Try to find and extract JSON from the text if it's wrapped in markdown or other text
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (nestedError) {
        console.error("Error parsing extracted JSON:", nestedError);
      }
    }
    
    throw new Error("Failed to parse JSON response");
  }
};
