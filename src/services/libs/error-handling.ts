
/**
 * Error Logging Service
 * Provides utilities for consistent error logging across the application
 */

interface ErrorLoggerInterface {
  logError: (error: any, source?: string) => void;
  logWarning: (message: string, source?: string) => void;
  logInfo: (message: string, source?: string) => void;
}

/**
 * Error logger utility for standardized error handling
 */
export const errorLogger: ErrorLoggerInterface = {
  /**
   * Log an error with source information
   */
  logError: (error: any, source?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Error${source ? ` in ${source}` : ''}]: ${errorMessage}`, error);
  },
  
  /**
   * Log a warning with source information
   */
  logWarning: (message: string, source?: string) => {
    console.warn(`[Warning${source ? ` in ${source}` : ''}]: ${message}`);
  },
  
  /**
   * Log information with source information
   */
  logInfo: (message: string, source?: string) => {
    console.info(`[Info${source ? ` from ${source}` : ''}]: ${message}`);
  }
};
