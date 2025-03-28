
import { supabase } from '@/integrations/supabase/client';
import { SecurityLogEntry } from '@/hooks/adConnections/types';

/**
 * Token security service
 * Manages token security related functions and logging
 */
export const tokenSecurity = {
  /**
   * Log security events for audit and monitoring
   */
  logSecurityEvent: async (event: SecurityLogEntry): Promise<void> => {
    try {
      if (!event.user_id) return;
      
      // Log to console for development
      console.log('Security event:', event);
      
      // In production, you would log to a secure database table
      // For now, we'll use Supabase storage to store security logs
      await supabase
        .from('security_logs')
        .insert({
          user_id: event.user_id,
          event_type: event.event,
          platform: event.platform,
          timestamp: event.timestamp,
          details: event.details || {}
        })
        .select()
        .single();
    } catch (error) {
      // Just log the error but don't throw - security logging should not block normal operations
      console.warn('Failed to log security event:', error);
    }
  },
  
  /**
   * Validate token expiration
   */
  isTokenExpired: (expiresAt: string | undefined | null): boolean => {
    if (!expiresAt) return true;
    
    try {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      
      // Add 5 minutes buffer to handle clock skew
      const bufferMs = 5 * 60 * 1000;
      return expiryDate.getTime() - bufferMs < now.getTime();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },
  
  /**
   * Mask sensitive data for display
   */
  maskData: (data: string, visibleChars = 4): string => {
    if (!data) return '';
    
    const firstPart = data.substring(0, visibleChars);
    const lastPart = data.substring(data.length - visibleChars);
    const maskedMiddle = '•'.repeat(Math.min(data.length - (visibleChars * 2), 8));
    
    return `${firstPart}${maskedMiddle}${lastPart}`;
  }
};

// Export the service for use throughout the application
export default tokenSecurity;
