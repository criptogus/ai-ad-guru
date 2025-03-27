
/**
 * API Error Handler
 * Handles error responses from API calls
 */

import { toast } from 'sonner';

export interface ApiError {
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
}

/**
 * Handle API errors with appropriate user feedback
 */
export const handleApiError = (error: any, context?: string): ApiError => {
  const apiError: ApiError = {
    message: 'An unknown error occurred'
  };
  
  // Extract useful information from error object
  if (error.response) {
    // HTTP error response
    apiError.status = error.response.status;
    apiError.message = error.response.data?.message || `Error ${error.response.status}`;
    apiError.details = error.response.data;
    
    // Special handling for common status codes
    switch (error.response.status) {
      case 401:
        apiError.message = 'Authentication required. Please log in again.';
        break;
      case 403:
        apiError.message = 'You do not have permission to perform this action.';
        break;
      case 429:
        apiError.message = 'Too many requests. Please try again later.';
        break;
    }
  } else if (error.request) {
    // Request was made but no response received
    apiError.message = 'No response from server. Please check your connection.';
  } else if (error.message) {
    // Error setting up the request
    apiError.message = error.message;
  }
  
  // Add context to the error message if provided
  const contextMessage = context ? `[${context}] ${apiError.message}` : apiError.message;
  
  // Show toast notification for user feedback
  toast.error('Error', {
    description: contextMessage,
  });
  
  // Log error to console for debugging
  console.error(contextMessage, error);
  
  return apiError;
};

/**
 * Check if an error is a network connectivity issue
 */
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

/**
 * Check if an error is due to authentication issues
 */
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};
