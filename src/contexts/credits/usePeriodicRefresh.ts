
import { useEffect, useRef } from 'react';

export const usePeriodicRefresh = (userId: string | undefined, refreshCredits: () => Promise<void>) => {
  const refreshIntervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    // Refresh credits on mount
    refreshCredits();
    
    // Set up periodic refresh every 30 seconds
    refreshIntervalRef.current = window.setInterval(() => {
      console.log('Periodic credit refresh');
      refreshCredits();
    }, 30000);
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [userId, refreshCredits]);
};
