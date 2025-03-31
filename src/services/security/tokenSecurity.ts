
import { supabase } from '@/integrations/supabase/client';
import { SecurityLogEntry } from '@/hooks/adConnections/types';

// Service for security-related operations with OAuth tokens
export const tokenSecurity = {
  /**
   * Log security events for audit trail
   */
  logSecurityEvent: async (entry: SecurityLogEntry): Promise<void> => {
    try {
      const { error } = await supabase
        .from('security_logs')
        .insert({
          user_id: entry.user_id,
          event: entry.event,
          platform: entry.platform,
          timestamp: entry.timestamp,
          details: entry.details || {}
        });
      
      if (error) {
        console.warn('Failed to log security event:', error);
      }
    } catch (err) {
      console.warn('Error in security logging:', err);
    }
  },
  
  /**
   * Revoke tokens for a specific platform
   */
  revokeTokens: async (userId: string, platform: string): Promise<boolean> => {
    try {
      // First get the tokens
      const { data, error } = await supabase
        .from('user_integrations')
        .select('access_token, refresh_token')
        .eq('user_id', userId)
        .eq('platform', platform)
        .single();
      
      if (error || !data) {
        console.warn('No tokens found to revoke');
        return true; // Nothing to revoke is technically a success
      }
      
      // For different platforms, call different revocation endpoints
      if (platform === 'google' && data.access_token) {
        // Google token revocation
        const response = await fetch('https://oauth2.googleapis.com/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ token: data.access_token }).toString(),
        });
        
        if (!response.ok) {
          console.warn('Failed to revoke Google token:', await response.text());
        }
      }
      
      // Finally, remove the tokens from the database regardless of revocation outcome
      await supabase
        .from('user_integrations')
        .delete()
        .eq('user_id', userId)
        .eq('platform', platform);
      
      return true;
    } catch (err) {
      console.error('Error revoking tokens:', err);
      return false;
    }
  }
};
