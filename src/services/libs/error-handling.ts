
/**
 * Error Logger Service
 * Centralized error logging for the application
 */

interface ErrorLoggerInterface {
  logError: (error: unknown, context?: string) => void;
  logWarning: (message: string, context?: string) => void;
  logInfo: (message: string, context?: string) => void;
}

class ErrorLogger implements ErrorLoggerInterface {
  /**
   * Log an error with optional context
   */
  logError(error: unknown, context?: string): void {
    const errorObject = error instanceof Error ? error : new Error(String(error));
    
    // Format the log with context if provided
    const logMessage = context 
      ? `[${context}] ${errorObject.message}`
      : errorObject.message;
    
    console.error(logMessage);
    
    // In production, we could send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service like Sentry
      // Example: Sentry.captureException(errorObject, { extra: { context } });
    }
  }
  
  /**
   * Log a warning message with optional context
   */
  logWarning(message: string, context?: string): void {
    const logMessage = context ? `[${context}] ${message}` : message;
    console.warn(logMessage);
    
    // In production, we could send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service
    }
  }
  
  /**
   * Log an info message with optional context
   */
  logInfo(message: string, context?: string): void {
    const logMessage = context ? `[${context}] ${message}` : message;
    console.info(logMessage);
    
    // In production, we could send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service
    }
  }
}

// Export a singleton instance of the error logger
export const errorLogger = new ErrorLogger();
