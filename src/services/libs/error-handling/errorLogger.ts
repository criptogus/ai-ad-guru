
/**
 * Error Logger Service
 * Handles logging of errors to console and external services
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * Log an error with context information
 */
export const logError = (error: any, context?: string): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  const timestamp = new Date().toISOString();
  const contextInfo = context ? `[${context}]` : '';
  
  // Log to console for development
  console.error(`${timestamp} ${contextInfo} Error:`, errorMessage);
  
  if (errorStack) {
    console.error('Stack:', errorStack);
  }
  
  // In production, this would send to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Placeholder for external error tracking service integration
    // Example: sendToErrorTrackingService(errorMessage, errorStack, context);
  }
};

/**
 * Log a warning message
 */
export const logWarning = (message: string, context?: string): void => {
  const timestamp = new Date().toISOString();
  const contextInfo = context ? `[${context}]` : '';
  
  console.warn(`${timestamp} ${contextInfo} Warning:`, message);
};

/**
 * Track user actions (for analytics purposes)
 */
export const trackUserAction = (userId: string, action: string, details?: Record<string, any>): void => {
  const timestamp = new Date().toISOString();
  
  console.log(`${timestamp} User ${userId} performed action: ${action}`, details);
  
  // In production, this would send to an analytics service
  // Example: sendToAnalyticsService(userId, action, details);
};

// Export as a single object for easier imports
export const errorLogger = {
  logError,
  logWarning,
  trackUserAction
};
