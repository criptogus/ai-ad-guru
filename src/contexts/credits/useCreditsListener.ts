
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCreditsListener = (userId: string | undefined, refreshCredits: () => Promise<void>) => {
  useEffect(() => {
    if (!userId) return;
    
    try {
      const creditsChannel = supabase
        .channel('credit-changes')
        .on(
          'postgres_changes',
          { 
            event: 'INSERT',
            schema: 'public',
            table: 'credit_ledger',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('Atualização de créditos detectada:', payload);
            refreshCredits();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(creditsChannel);
      };
    } catch (err) {
      console.error('Erro ao configurar listener de créditos:', err);
    }
  }, [userId, refreshCredits]);
};
