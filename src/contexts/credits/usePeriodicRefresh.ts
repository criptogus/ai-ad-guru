
import { useEffect } from 'react';

export const usePeriodicRefresh = (userId: string | undefined, refreshCredits: () => Promise<void>) => {
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(() => {
      refreshCredits();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [userId, refreshCredits]);
};
