
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to refresh the user's session when needed
 * This helps keep the session active during long periods of activity
 */
export const refreshSession = async (): Promise<boolean> => {
  try {
    // Check if we need to refresh
    const expiresAt = localStorage.getItem('session_expires_at');
    if (!expiresAt) return false;
    
    // Get current time
    const now = Date.now();
    const expiry = parseInt(expiresAt, 10);
    
    // If we're more than 80% through our session, refresh it
    // This ensures we refresh before expiry but not too frequently
    if (now > (expiry - (0.2 * 86400 * 1000))) {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        console.error('Failed to refresh session:', error);
        return false;
      }
      
      // Reset the 24-hour timer
      const newExpiresAt = Date.now() + (86400 * 1000); // 24 hours
      localStorage.setItem('session_expires_at', newExpiresAt.toString());
      console.log('Session refreshed, new expiration set');
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in refreshSession:', error);
    return false;
  }
};

/**
 * Set up periodic session refresh to maintain user login
 */
export const setupSessionRefresh = (): ReturnType<typeof setTimeout> => {
  // Check session every 15 minutes
  const intervalId = setInterval(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      await refreshSession();
    } else {
      // If no session, clear the interval
      clearInterval(intervalId);
    }
  }, 15 * 60 * 1000); // 15 minutes
  
  return intervalId;
};
