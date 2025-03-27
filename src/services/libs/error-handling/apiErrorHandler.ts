
/**
 * API Error Handler
 * Handles API errors consistently across the application
 */

import { errorLogger } from './errorLogger';

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

/**
 * Parse error from API response
 */
export const parseApiError = (error: any): ApiError => {
  // If it's already in our format, return it
  if (error && typeof error === 'object' && 'message' in error) {
    return error as ApiError;
  }
  
  // Check for fetch Response object
  if (error instanceof Response) {
    return {
      message: `HTTP error ${error.status}: ${error.statusText}`,
      status: error.status
    };
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      details: { stack: error.stack }
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return { message: error };
  }
  
  // Default case
  return {
    message: 'An unknown error occurred',
    details: { originalError: error }
  };
};

/**
 * Handle API error with consistent behavior
 */
export const handleApiError = (
  error: any,
  context: string,
  options?: {
    rethrow?: boolean;
    defaultMessage?: string;
  }
): ApiError => {
  const parsedError = parseApiError(error);
  
  // Log the error
  errorLogger.logError(parsedError, context);
  
  // Return a consistent error format
  const formattedError: ApiError = {
    message: parsedError.message || options?.defaultMessage || 'An error occurred',
    code: parsedError.code,
    status: parsedError.status,
    details: parsedError.details
  };
  
  // Rethrow if needed
  if (options?.rethrow) {
    throw formattedError;
  }
  
  return formattedError;
};

/**
 * Safely execute a function that might throw API errors
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  context: string,
  fallbackValue?: T
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, context);
    return fallbackValue as T;
  }
};
