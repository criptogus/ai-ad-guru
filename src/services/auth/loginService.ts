
import { supabase } from '@/integrations/supabase/client';

// Login with email and password
export const loginWithEmail = async (email: string, password: string) => {
  console.log('Attempting to sign in with email:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Sign-in error:', error);
      
      // Handle specific error codes with more user-friendly messages
      if (error.message.includes('Email not confirmed')) {
        throw {
          code: 'email_not_confirmed',
          message: 'Please check your email and click the confirmation link to activate your account.'
        };
      } else if (error.message.includes('Invalid login credentials')) {
        throw {
          code: 'invalid_credentials',
          message: 'The email or password you entered is incorrect. Please try again.'
        };
      }
      
      throw error;
    }

    console.log('Sign-in successful:', data);
    return data;
  } catch (error) {
    console.error('Error in loginWithEmail:', error);
    throw error;
  }
};

// Login with Google - improved with more debugging and error handling
export const loginWithGoogle = async () => {
  console.log('Initiating Google sign-in');
  
  // Get the current URL for proper redirect handling
  const origin = window.location.origin;
  
  // Use an explicit auth/callback path that matches what's in App.tsx
  const redirectTo = `${origin}/auth/callback`;
  
  console.log('Using redirect URL:', redirectTo);
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // Set the project name that will be displayed on the Google consent screen
        // This makes it show "Zero Digital Agency" instead of the Supabase project ID
        scopes: 'email profile',
        skipBrowserRedirect: false, // Ensure we redirect to Google auth page
      }
    });

    if (error) {
      console.error('Google sign-in error:', error);
      
      if (error.message.includes('provider is not enabled')) {
        throw {
          code: 'provider_not_enabled',
          message: 'Google authentication is not enabled. Please contact support.'
        };
      }
      
      throw error;
    }

    console.log('Google sign-in initiated:', data);
    return data;
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  console.log('Logging out user');
  await supabase.auth.signOut();
};
