import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { CustomUser } from '@/types/auth';
import { createCustomUserWithProfile } from '@/services/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        console.log('useAuthState: Getting session');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('useAuthState: Session result:', session ? 'Session found' : 'No session');

        setSession(session);

        if (session) {
          console.log('useAuthState: User authenticated, fetching profile');
          try {
            const customUser = await createCustomUserWithProfile(session.user);
            setUser(customUser);
            setIsAuthenticated(true);
            console.log('useAuthState: User and profile loaded', customUser);
          } catch (profileError) {
            console.error('useAuthState: Error loading profile, but session exists:', profileError);
            setIsAuthenticated(true);
          }
        } else {
          console.log('useAuthState: No session found, resetting auth state');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('useAuthState: Error getting session:', error);
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuthState: Auth state changed:', event, session ? 'with session' : 'no session');
      setSession(session);
      
      if (session) {
        try {
          console.log('useAuthState: Creating custom user with profile on auth change');
          const customUser = await createCustomUserWithProfile(session.user);
          setUser(customUser);
          setIsAuthenticated(true);
          console.log('useAuthState: Auth state updated successfully', event);
        } catch (error) {
          console.error('useAuthState: Error creating custom user:', error);
          setIsAuthenticated(!!session);
        }
      } else {
        console.log('useAuthState: No session in auth change event');
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      console.log('useAuthState: Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    session,
    isAuthenticated,
    isLoading,
  };
};
