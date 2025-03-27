
/**
 * Error logging service
 * This service handles logging errors to the console, server or monitoring service
 */
export const errorLogger = {
  /**
   * Log an error to the console with context information
   */
  logError: (error: any, context: string) => {
    console.error(`[${context}] Error:`, error);
    
    // In a production environment, you might want to send this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToMonitoringService(error, context);
    }
    
    return {
      message: error.message || 'An unknown error occurred',
      context,
      timestamp: new Date().toISOString(),
    };
  },
  
  /**
   * Log a warning to the console
   */
  logWarning: (message: string, context: string) => {
    console.warn(`[${context}] Warning:`, message);
    
    return {
      message,
      context,
      timestamp: new Date().toISOString(),
      level: 'warning',
    };
  },
  
  /**
   * Format error message for user display
   */
  formatErrorMessage: (error: any) => {
    if (!error) return 'An unknown error occurred';
    
    // Handle specific error types
    if (error.code === 'auth/invalid-login-credentials') {
      return 'Invalid email or password. Please try again.';
    }
    
    if (error.code === 'auth/user-not-found') {
      return 'User not found. Please check your email or sign up.';
    }
    
    if (error.code === 'auth/email-already-in-use') {
      return 'This email is already in use. Please use a different email or log in.';
    }
    
    // Default error message
    return error.message || 'An error occurred. Please try again.';
  }
};
