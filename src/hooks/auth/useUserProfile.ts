
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { CustomUser } from '@/types/auth';
import { createCustomUserWithProfile } from '@/services/auth';

export const useUserProfile = (session: Session | null, isSessionLoading: boolean) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        
        if (session) {
          console.log('useUserProfile: User authenticated, fetching profile');
          try {
            const customUser = await createCustomUserWithProfile(session.user);
            setUser(customUser);
            setIsAuthenticated(true);
            console.log('useUserProfile: User and profile loaded', customUser);
          } catch (profileError) {
            console.error('useUserProfile: Error loading profile, but session exists:', profileError);
            setIsAuthenticated(true);
          }
        } else {
          console.log('useUserProfile: No session found, resetting auth state');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('useUserProfile: Error loading user profile:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isSessionLoading) {
      loadUserProfile();
    }
  }, [session, isSessionLoading]);

  return {
    user,
    setUser,
    isAuthenticated,
    isLoading,
  };
};
