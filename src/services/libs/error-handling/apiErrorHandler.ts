
/**
 * API Error Handler
 * Functions for handling API errors
 */

import { errorLogger } from './errorLogger';

export interface ApiError {
  message: string;
  code: string;
  status?: number;
  details?: any;
}

/**
 * Handle API error and return a standardized error object
 */
export const handleApiError = (error: any, context: string): ApiError => {
  // Log the error
  errorLogger.logError(error, context);
  
  // Extract error information
  const apiError: ApiError = {
    message: error.message || 'An error occurred',
    code: 'unknown_error',
  };
  
  // Handle Axios/fetch errors
  if (error.response) {
    apiError.status = error.response.status;
    apiError.details = error.response.data;
    
    // Set appropriate error code based on status
    if (error.response.status === 401) {
      apiError.code = 'unauthorized';
      apiError.message = 'Authentication required';
    } else if (error.response.status === 403) {
      apiError.code = 'forbidden';
      apiError.message = 'Permission denied';
    } else if (error.response.status === 404) {
      apiError.code = 'not_found';
      apiError.message = 'Resource not found';
    } else if (error.response.status >= 500) {
      apiError.code = 'server_error';
      apiError.message = 'Server error';
    }
  } else if (error.request) {
    // Request was made but no response received
    apiError.code = 'network_error';
    apiError.message = 'Network error. Please check your connection.';
  }
  
  return apiError;
};

/**
 * Check if an error should be retried
 */
export const shouldRetryRequest = (error: any, retryCount: number, maxRetries: number = 3): boolean => {
  if (retryCount >= maxRetries) {
    return false;
  }
  
  // Retry for network errors
  if (!error.response && error.request) {
    return true;
  }
  
  // Retry for server errors (5xx)
  if (error.response && error.response.status >= 500) {
    return true;
  }
  
  // Retry for 429 (Too Many Requests)
  if (error.response && error.response.status === 429) {
    return true;
  }
  
  return false;
};

/**
 * Calculate retry delay with exponential backoff
 */
export const calculateRetryDelay = (retryCount: number, baseDelay: number = 1000): number => {
  return Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Max 30 seconds
};
