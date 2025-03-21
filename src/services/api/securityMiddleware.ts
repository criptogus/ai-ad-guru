
import { supabase } from '@/integrations/supabase/client';

/**
 * Security monitoring and protection middleware
 */
export const securityMonitor = {
  /**
   * Log security events
   */
  log: (
    event: string,
    data: Record<string, any> = {},
    level: 'info' | 'warn' | 'error' = 'info'
  ) => {
    // Log locally with appropriate level
    const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
    logMethod(`[SECURITY] ${event}:`, data);
    
    // In production, you might want to send this to your backend/analytics
    if (process.env.NODE_ENV === 'production') {
      // Track security events in production for analysis
      try {
        // This could send data to your monitoring service or Supabase
        // We're just logging for now
      } catch (err) {
        console.error('Failed to log security event:', err);
      }
    }
  },

  /**
   * Track API access for security monitoring
   */
  trackApiAccess: (endpoint: string, method: string, userId?: string) => {
    securityMonitor.log('api_access', { endpoint, method, userId, timestamp: new Date().toISOString() }, 'info');
  },

  /**
   * Check for suspicious activity
   */
  checkForSuspiciousActivity: async (userId: string) => {
    try {
      // Example: Check if user has too many failed login attempts
      // Example: Check for rapid-fire API calls or other suspicious patterns
      return false; // No suspicious activity detected
    } catch (error) {
      securityMonitor.log('suspicious_activity_check_failed', { error: error.message }, 'error');
      return false;
    }
  },

  /**
   * Sanitize data before displaying it
   */
  sanitizeOutput: (data: any): any => {
    if (!data) return data;
    
    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => securityMonitor.sanitizeOutput(item));
    }
    
    // Handle objects
    if (typeof data === 'object' && data !== null) {
      const sanitized: Record<string, any> = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          // Skip sensitive fields
          if (['password', 'access_token', 'refresh_token', 'token'].includes(key.toLowerCase())) {
            sanitized[key] = '[REDACTED]';
          } else {
            sanitized[key] = securityMonitor.sanitizeOutput(data[key]);
          }
        }
      }
      return sanitized;
    }
    
    // Return primitives as is
    return data;
  }
};
