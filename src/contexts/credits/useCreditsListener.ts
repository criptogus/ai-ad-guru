
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCreditsListener = (userId: string | undefined, refreshCredits: () => Promise<void>) => {
  useEffect(() => {
    if (!userId) return;
    
    console.log('Setting up real-time listener for credit changes');
    
    // Set up a real-time listener for credit changes
    const subscription = supabase
      .channel('credit_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'credit_ledger',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Credit change detected:', payload);
          refreshCredits();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated:', payload);
          refreshCredits();
        }
      )
      .subscribe();
    
    return () => {
      console.log('Unsubscribing from credit changes');
      subscription.unsubscribe();
    };
  }, [userId, refreshCredits]);
};
