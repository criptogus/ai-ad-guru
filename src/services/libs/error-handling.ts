
/**
 * Error Logging Service
 * Provides utilities for consistent error logging across the application
 */

interface ErrorLoggerInterface {
  logError: (error: any, source?: string) => void;
  logWarning: (message: string, source?: string) => void;
  logInfo: (message: string, source?: string) => void;
  logDebug: (message: any, source?: string) => void;
}

/**
 * Format error message for consistent reporting
 */
const formatErrorDetails = (error: any): string => {
  if (!error) return 'Unknown error (null)';
  
  if (typeof error === 'string') return error;
  
  if (error.message) {
    let details = error.message;
    
    // Add additional Supabase details if available
    if (error.details) details += ` | Details: ${error.details}`;
    if (error.hint) details += ` | Hint: ${error.hint}`;
    if (error.code) details += ` | Code: ${error.code}`;
    
    return details;
  }
  
  // Handle structured error objects
  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'Complex error object (cannot stringify)';
    }
  }
  
  return JSON.stringify(error);
};

/**
 * Error logger utility for standardized error handling
 */
export const errorLogger: ErrorLoggerInterface = {
  /**
   * Log an error with source information
   */
  logError: (error: any, source?: string) => {
    const timestamp = new Date().toISOString();
    const formattedSource = source ? `[${source}]` : '[unknown]';
    const errorDetails = formatErrorDetails(error);
    
    // Log formatted error to console
    console.error(`${timestamp} ${formattedSource} Error: ${errorDetails}`);
    
    // If it's an Error object, also log the stack trace
    if (error instanceof Error && error.stack) {
      console.error(`Stack trace: ${error.stack}`);
    }
    
    // Handle Supabase specific error format
    if (error && error.code && (error.details || error.hint)) {
      console.error('Supabase error details:', {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message
      });
    }
    
    // If this is an object with more structured data, log that too
    if (typeof error === 'object' && error !== null && !(error instanceof Error)) {
      console.error('Additional error context:', error);
    }
    
    // Here we could also send the error to an external error tracking service
    // if we had one set up, e.g. Sentry, LogRocket, etc.
  },
  
  /**
   * Log a warning with source information
   */
  logWarning: (message: string, source?: string) => {
    const timestamp = new Date().toISOString();
    const formattedSource = source ? `[${source}]` : '[unknown]';
    console.warn(`${timestamp} ${formattedSource} Warning: ${message}`);
  },
  
  /**
   * Log information with source information
   */
  logInfo: (message: string, source?: string) => {
    const timestamp = new Date().toISOString();
    const formattedSource = source ? `[${source}]` : '[unknown]';
    console.info(`${timestamp} ${formattedSource} Info: ${message}`);
  },
  
  /**
   * Log debug information (only in development)
   */
  logDebug: (message: any, source?: string) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      const formattedSource = source ? `[${source}]` : '[unknown]';
      
      if (typeof message === 'object') {
        console.debug(`${timestamp} ${formattedSource} Debug:`);
        console.debug(message);
      } else {
        console.debug(`${timestamp} ${formattedSource} Debug: ${message}`);
      }
    }
  }
};
