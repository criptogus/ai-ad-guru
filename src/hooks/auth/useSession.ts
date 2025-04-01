
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
        
        // Check if session should be expired based on our custom timeout
        if (session) {
          const expiresAt = localStorage.getItem('session_expires_at');
          if (expiresAt && parseInt(expiresAt, 10) < Date.now()) {
            console.log('useSession: Session expired based on our 24-hour limit');
            await supabase.auth.signOut();
            setSession(null);
          } else {
            setSession(session);
          }
        } else {
          setSession(null);
        }
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
      
      if (event === 'SIGNED_IN' && session) {
        // When user signs in, set up the 24-hour expiration
        const expiresAt = Date.now() + (86400 * 1000); // 24 hours in milliseconds
        localStorage.setItem('session_expires_at', expiresAt.toString());
      }
      
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
