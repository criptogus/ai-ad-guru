
/**
 * Enhanced error handling utilities for edge functions
 */

export function formatErrorResponse(error: any): { success: false; error: string; details?: string } {
  // Format the error for a consistent response shape
  return {
    success: false,
    error: error.message || 'Unknown error occurred',
    details: error.stack || 'No stack trace available'
  };
}

export function handleRequestError(error: any): Response {
  console.error('Request error:', error);
  
  // Always return a 200 status to avoid breaking OAuth flows in the frontend
  // But include detailed error information in the response body
  return new Response(
    JSON.stringify(formatErrorResponse(error)),
    { 
      status: 200, // Using 200 status intentionally to avoid breaking OAuth flows
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Used for logging specific types of errors
export function logOAuthError(phase: string, error: any, metadata: Record<string, any> = {}): void {
  console.error(`OAuth Error [${phase}]:`, {
    message: error.message,
    stack: error.stack,
    ...metadata
  });
}
