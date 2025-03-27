
/**
 * API Error Handler
 * Handles errors from API requests
 */

import { errorLogger } from './errorLogger';

/**
 * Standard API error format
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

/**
 * Parse API error response
 */
export const parseApiError = (error: any): ApiError => {
  // If it's already in our format, return it
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    return error as ApiError;
  }
  
  // If it's an axios error
  if (error && error.response) {
    const { status, data } = error.response;
    
    return {
      status,
      message: data?.message || 'An error occurred with the API request',
      code: data?.code,
      details: data?.details
    };
  }
  
  // If it's a network error
  if (error && error.message && error.message.includes('Network Error')) {
    return {
      status: 0,
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR'
    };
  }
  
  // Default unknown error
  return {
    status: 500,
    message: error?.message || 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    details: error
  };
};

/**
 * Handle API error - logs it and returns a formatted error
 */
export const handleApiError = (error: any, context: string): ApiError => {
  // Log the error
  errorLogger.logError(error, `API Error (${context})`);
  
  // Parse and return formatted error
  return parseApiError(error);
};

/**
 * Create a function that handles API errors for a specific context
 */
export const createApiErrorHandler = (context: string) => {
  return (error: any): ApiError => handleApiError(error, context);
};

export default {
  parseApiError,
  handleApiError,
  createApiErrorHandler
};
