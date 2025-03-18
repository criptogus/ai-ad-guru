
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { data, testEmail, testPassword };
  } catch (error) {
    console.error("Error in createTestAccount:", error);
    throw error;
  }
};
