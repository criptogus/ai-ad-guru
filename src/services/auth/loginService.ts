
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

// Login with Google - enhanced with more debug options and explicit URL handling
export const loginWithGoogle = async () => {
  // Get the exact redirect URL that must be registered in Google Cloud Console
  const origin = window.location.origin;
  
  // UPDATED: Use the Supabase v1 auth path that includes the /v1/ segment
  // CRITICAL: This MUST EXACTLY match what's registered in Google Cloud Console
  const redirectTo = 'https://auth.zeroagency.ai/auth/v1/callback';
  
  console.log('==== GOOGLE AUTH DEBUG INFO ====');
  console.log('Initiating Google sign-in with redirect URL:', redirectTo);
  console.log('Current origin:', origin);
  console.log('Make sure this EXACT URL is registered in Google Cloud Console');
  console.log('================================');
  
  try {
    // Use the default behavior without skipBrowserRedirect
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile',
      }
    });

    if (error) {
      console.error('==== GOOGLE AUTH ERROR ====');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      console.error('==========================');
      
      if (error.message.includes('provider is not enabled')) {
        throw error;
      }
      
      if (error.message.includes('redirect_uri_mismatch')) {
        console.error('REDIRECT URI MISMATCH ERROR: The redirect URI in your Google OAuth settings does not match the one being used.');
        console.error('Please ensure you have registered EXACTLY this URL in Google Cloud Console:');
        console.error(redirectTo);
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
