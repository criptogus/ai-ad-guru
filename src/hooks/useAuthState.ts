
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { CustomUser } from '@/types/auth';
import { createCustomUserWithProfile } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);

        if (session) {
          const customUser = await createCustomUserWithProfile(session.user);
          setUser(customUser);
          setIsAuthenticated(true);
        } else {
          // Explicitly set these states to ensure consistency
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        // Ensure consistent state on error
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session) {
        try {
          const customUser = await createCustomUserWithProfile(session.user);
          setUser(customUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error creating custom user:', error);
          // Handle error but maintain session
          setIsAuthenticated(!!session);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
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
