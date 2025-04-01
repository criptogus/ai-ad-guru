
import { useState, useEffect } from 'react';
import { useSession } from './auth/useSession';
import { useUserProfile } from './auth/useUserProfile';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const { session, isLoading: sessionLoading } = useSession();
  const { user, setUser, isAuthenticated, isLoading: profileLoading } = useUserProfile(session, sessionLoading);

  // Consider both session and profile loading states
  const isLoading = sessionLoading || profileLoading;

  // Handle hash fragments that might contain tokens (OAuth redirect)
  useEffect(() => {
    const handleHashFragment = async () => {
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('Detected token in hash, processing...');
        try {
          // Allow Supabase to process the hash fragment
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error processing hash fragment:', error);
          } else {
            console.log('Hash fragment processed successfully, session:', data.session ? 'exists' : 'none');
            
            // If we have a session but URL still contains the hash, clean it up
            if (data.session) {
              // Clean up the URL by removing the hash fragment
              window.history.replaceState(
                {}, 
                document.title, 
                window.location.pathname + window.location.search
              );
            }
          }
        } catch (err) {
          console.error('Exception processing hash fragment:', err);
        }
      }
    };

    handleHashFragment();
  }, []);

  return {
    user,
    setUser,
    session,
    isAuthenticated,
    isLoading,
  };
};
