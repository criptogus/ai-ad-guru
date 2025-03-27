
/**
 * Error Boundary Utilities
 * Functions for handling errors in React components
 */

/**
 * Format error message for display in UI
 */
export const formatErrorMessage = (error: any): string => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // If error has a message property, use it
  if (error.message) {
    return error.message;
  }
  
  // Handle network errors
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Handle specific HTTP status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 401:
        return 'Authentication error. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${error.response.status}`;
    }
  }
  
  // Fallback for unknown errors
  return 'An error occurred. Please try again.';
};

/**
 * Extract error details for logging
 */
export const extractErrorDetails = (error: any): Record<string, any> => {
  const details: Record<string, any> = {
    message: error.message || 'Unknown error',
    timestamp: new Date().toISOString()
  };
  
  // Add stack trace if available
  if (error.stack) {
    details.stack = error.stack;
  }
  
  // Add HTTP response details if available
  if (error.response) {
    details.statusCode = error.response.status;
    details.statusText = error.response.statusText;
    details.data = error.response.data;
  }
  
  // Add request details if available
  if (error.config) {
    details.url = error.config.url;
    details.method = error.config.method;
  }
  
  return details;
};
