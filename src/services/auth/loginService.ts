
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

// Login with Google
export const loginWithGoogle = async () => {
  console.log('Initiating Google sign-in');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    }
  });

  if (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }

  console.log('Google sign-in initiated:', data);
  return data;
};

// Sign out
export const logout = async () => {
  console.log('Logging out user');
  await supabase.auth.signOut();
};
