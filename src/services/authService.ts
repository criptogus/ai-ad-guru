
import { supabase } from '@/integrations/supabase/client';
import { CustomUser, Profile } from '@/types/auth';
import { User, Session } from '@supabase/supabase-js';

// Helper function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile for user ID:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    console.log('Profile data retrieved:', data);
    return data as Profile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

// Helper function to update the user object with profile data
export const createCustomUserWithProfile = async (authUser: User): Promise<CustomUser> => {
  console.log('Creating custom user with profile for:', authUser.id);
  const profile = await fetchUserProfile(authUser.id);
  
  if (profile) {
    console.log('Profile found, creating customUser with profile data');
    const customUser: CustomUser = {
      ...authUser,
      name: profile.name,
      avatar: profile.avatar || '',
      credits: profile.credits,
      hasPaid: profile.has_paid
    };
    
    return customUser;
  } else {
    console.log('No profile found, creating basic customUser');
    // Fallback to just the auth user if profile isn't found
    const customUser: CustomUser = {
      ...authUser,
      name: authUser.user_metadata?.name || 'User',
      avatar: '',
      credits: 0,
      hasPaid: false
    };
    
    return customUser;
  }
};

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

// Define a return type for register that includes the confirmationRequired property
export type RegisterResult = {
  user: User;
  session: Session;
  confirmationRequired?: boolean;
};

// Register new user
export const register = async (name: string, email: string, password: string): Promise<RegisterResult> => {
  console.log('Registering new user:', email);
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
        avatar_url: '',
      },
    },
  });

  if (error) {
    console.error('Registration error:', error);
    throw error;
  }

  console.log('Registration successful:', data);
  
  // Check if email confirmation is required
  if (data.user && !data.user.email_confirmed_at) {
    return {
      ...data,
      confirmationRequired: true
    };
  }
  
  return data;
};

// Create a test account
export const createTestAccount = async () => {
  // Generate a unique email with timestamp to avoid "email already registered" errors
  const timestamp = new Date().getTime();
  const testEmail = `test${timestamp}@gmail.com`;
  const testPassword = 'Password123!';
  
  console.log(`Attempting to create test account with email: ${testEmail}`);
  
  try {
    // Create a new test account
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User',
          avatar_url: '',
        },
      },
    });

    if (error) {
      console.error("Error creating test account:", error);
      throw error;
    }

    console.log("Test account created:", data);
    
    // Wait a moment for the account to be fully registered in the system
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to sign in with the new credentials to make sure it works
    try {
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
    } catch (e) {
      console.log("Note: Immediate sign-in failed but test account was created:", e);
    }
    
    return { data, testEmail, testPassword };
  } catch (error) {
    console.error("Error in createTestAccount:", error);
    throw error;
  }
};

// Update user's payment status
export const updatePaymentStatus = async (userId: string, hasPaid: boolean) => {
  const { error } = await supabase
    .from('profiles')
    .update({ has_paid: hasPaid })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Get the current session
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting current session:', error);
    throw error;
  }
  
  return data.session;
};
