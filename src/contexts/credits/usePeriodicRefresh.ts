
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePeriodicRefresh = (userId: string | undefined, refreshCredits: () => Promise<void>) => {
  useEffect(() => {
    if (!userId) return;
    
    // Initial refresh when component mounts
    refreshCredits();
    
    // Set up periodic refresh of credits
    const interval = setInterval(async () => {
      try {
        // Call the refresh-credit-balance Edge Function to refresh the materialized view
        const { error } = await supabase.functions.invoke('refresh-credit-balance');
        
        if (error) {
          console.error('Error refreshing credit balance view:', error);
        }
        
        // Refresh the local credits state
        await refreshCredits();
      } catch (err) {
        console.error('Error in periodic refresh:', err);
      }
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [userId, refreshCredits]);
};
