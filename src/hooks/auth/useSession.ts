
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        console.log('useSession: Getting session');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('useSession: Session result:', session ? 'Session found' : 'No session');
        setSession(session);
      } catch (error) {
        console.error('useSession: Error getting session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useSession: Auth state changed:', event, session ? 'with session' : 'no session');
      setSession(session);
    });

    return () => {
      console.log('useSession: Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
  };
};
