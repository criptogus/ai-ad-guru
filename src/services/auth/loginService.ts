
import { supabase, configureSessionExpiration } from '@/integrations/supabase/client';
import { AuthError, Session, User, UserResponse, WeakPassword } from '@supabase/supabase-js';

interface LoginResult {
  session: Session | null;
  user: User | null;
  error?: AuthError | null;
  weakPassword?: WeakPassword | null;
}

// Login with email and password
export const loginWithEmail = async (email: string, password: string): Promise<LoginResult> => {
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
        // Modify message but keep the original error object
        const enhancedError = error;
        enhancedError.message = 'Please check your email and click the confirmation link to activate your account.';
        return {
          session: null,
          user: null,
          error: enhancedError,
        };
      } else if (error.message.includes('Invalid login credentials')) {
        // Modify message but keep the original error object
        const enhancedError = error;
        enhancedError.message = 'The email or password you entered is incorrect. Please try again.';
        return {
          session: null,
          user: null,
          error: enhancedError,
        };
      }
      
      return { session: null, user: null, error };
    }

    console.log('Sign-in successful:', data);
    
    // Configure session to expire after 24 hours (86400 seconds)
    await configureSessionExpiration(86400);
    
    return {
      session: data.session,
      user: data.user,
      error: null
    };
  } catch (error) {
    console.error('Error in loginWithEmail:', error);
    throw error;
  }
};

// Login with Google - improved with explicit redirect URL and better debugging
export const loginWithGoogle = async () => {
  // Get the EXACT redirect URL that matches what's registered in Google Cloud Console
  const origin = window.location.origin;
  
  // We're using a custom auth domain, so construct the callback URL accordingly
  // This MUST EXACTLY match what's registered in Google Cloud Console
  const redirectTo = 'https://auth.zeroagency.ai/auth/callback';
  
  console.log('Initiating Google sign-in with redirect URL:', redirectTo);
  console.log('Current origin:', origin);
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile',
        skipBrowserRedirect: false,
      }
    });

    if (error) {
      console.error('Google sign-in error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (error.message.includes('provider is not enabled')) {
        throw {
          code: 'provider_not_enabled',
          message: 'Google authentication is not enabled. Please contact support.'
        };
      }
      
      throw error;
    }

    console.log('Google sign-in initiated successfully:', data);
    return data;
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  console.log('Logging out user');
  
  // Clean up any session expiration data
  localStorage.removeItem('session_expires_at');
  
  await supabase.auth.signOut();
};
