
import { supabase } from "@/integrations/supabase/client";
import { AdPlatform, SecurityLogEntry } from "@/hooks/adConnections/types";

/**
 * Security service for handling tokens and security logging
 */
export const tokenSecurity = {
  /**
   * Log security events related to ad platform connections
   */
  logSecurityEvent: async (entry: SecurityLogEntry): Promise<void> => {
    try {
      await supabase
        .from('security_logs')
        .insert({
          event: entry.event,
          user_id: entry.user_id,
          platform: entry.platform || null,
          details: entry.details || {},
          ip_address: entry.ip_address || null,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Non-blocking - we don't want to fail the operation if logging fails
    }
  },

  /**
   * Check if a token needs to be refreshed based on expiration time
   */
  needsTokenRefresh: (expiresAt: string | null | undefined): boolean => {
    if (!expiresAt) return true;
    
    try {
      // Add a buffer of 5 minutes to ensure we refresh before expiration
      const expirationDate = new Date(expiresAt);
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      return new Date(Date.now() + bufferTime) > expirationDate;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // If we can't determine, assume we need to refresh
    }
  },

  /**
   * Mask sensitive data for display or logging
   */
  maskSensitiveData: (value: string, visibleChars = 4): string => {
    if (!value) return '';
    if (value.length <= visibleChars * 2) return '*'.repeat(value.length);
    return `${value.substring(0, visibleChars)}${'*'.repeat(value.length - visibleChars * 2)}${value.substring(value.length - visibleChars)}`;
  },

  /**
   * Validate token refresh response against potential security threats
   */
  validateTokenResponse: (response: any): boolean => {
    // Implement validation logic here
    if (!response) return false;
    if (!response.access_token) return false;
    
    // Check for suspicious patterns
    const tokenLength = response.access_token.length;
    if (tokenLength < 20) return false; // Too short for a proper OAuth token
    
    return true;
  },

  /**
   * Get detailed connection info without exposing sensitive data
   */
  getSecureConnectionInfo: (connection: any) => {
    if (!connection) return null;
    
    return {
      id: connection.id,
      platform: connection.platform,
      accountId: connection.account_id || null,
      connected: true,
      connectedAt: connection.created_at,
      expiresAt: connection.expires_at,
      // Mask tokens for UI or logging
      accessTokenStatus: connection.access_token ? 'valid' : 'missing',
      refreshTokenStatus: connection.refresh_token ? 'valid' : 'missing',
    };
  }
};
