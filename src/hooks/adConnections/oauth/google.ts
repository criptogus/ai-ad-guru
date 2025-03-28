
/**
 * Google OAuth specific implementation
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate Google OAuth URL
 */
export const getGoogleOAuthUrl = (redirectUri: string): string => {
  // Use Supabase's built-in OAuth functionality instead of custom implementation
  // This ensures redirect URIs are properly configured
  return `/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUri)}`;
};

/**
 * Login with Google using Supabase's built-in OAuth
 */
export const loginWithGoogle = async () => {
  console.log('Initiating Google sign-in with Supabase OAuth');
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }

    console.log('Google sign-in initiated:', data);
    return data;
  } catch (error) {
    console.error('Error in loginWithGoogle:', error);
    throw error;
  }
};
