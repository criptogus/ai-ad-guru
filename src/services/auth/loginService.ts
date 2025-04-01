import { supabase, configureSessionExpiration } from '@/integrations/supabase/client';

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
    
    // Configure session to expire after 24 hours (86400 seconds)
    await configureSessionExpiration(86400);
    
    return data;
  } catch (error) {
    console.error('Error in loginWithEmail:', error);
    throw error;
  }
};

// Login with Google - improved with dynamic origin detection and environment awareness
export const loginWithGoogle = async () => {
  console.log('Initiating Google sign-in');
  
  // Get the current domain dynamically
  const origin = window.location.origin;
  
  // Use an explicit auth/callback path that matches the route in App.tsx
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
        scopes: 'email profile',
        skipBrowserRedirect: false,
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
  
  // Clean up any session expiration data
  localStorage.removeItem('session_expires_at');
  
  await supabase.auth.signOut();
};
