
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  loginWithEmail,
  loginWithGoogle as googleLogin,
  logout as signOut,
  register as signUp,
  createTestAccount as createTest,
  updatePaymentStatus,
  RegisterResult
} from '@/services/authService';
import { CustomUser } from '@/types/auth';

export const useAuthActions = (user: CustomUser | null, setUser: (user: CustomUser | null) => void) => {
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLocalLoading(true);
      console.log('Login attempt with email:', email);
      
      const authResult = await loginWithEmail(email, password);
      console.log('Login successful:', authResult);
      
      // The user state will be updated automatically by onAuthStateChange
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error codes
      if (error.code === 'email_not_confirmed') {
        toast({
          title: 'Email not confirmed',
          description: error.message || 'Please check your email to confirm your account.',
          variant: 'destructive',
        });
      } else if (error.code === 'invalid_credentials') {
        toast({
          title: 'Login failed',
          description: error.message || 'The email or password you entered is incorrect.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login failed',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setLocalLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLocalLoading(true);
      await googleLogin();
      // This will redirect to Google auth page
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: 'Google login failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLocalLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLocalLoading(true);
      await signOut();
      // User state will be updated by onAuthStateChange
      navigate('/login');
      toast({
        description: 'Logged out successfully!',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLocalLoading(true);
      const result: RegisterResult = await signUp(name, email, password);
      
      if (result.confirmationRequired) {
        toast({
          title: 'Confirmation required',
          description: 'Please check your email to confirm your account before logging in.',
        });
        navigate('/login');
        return;
      }
      
      // The profile will be created automatically via the trigger
      // User state will be updated by onAuthStateChange
      navigate('/billing');
      toast({
        title: 'Registration successful',
        description: 'Your account has been created. Welcome!',
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLocalLoading(false);
    }
  };

  const createTestAccount = async (): Promise<void> => {
    try {
      setLocalLoading(true);
      const { testEmail, testPassword } = await createTest();
      
      toast({
        title: "Test account created",
        description: `Use the credentials to log in. Click Sign In button to continue.`,
      });
      
      // Dispatch a custom event with the test account credentials
      const testAccountEvent = new CustomEvent('testAccountCreated', {
        detail: { email: testEmail, password: testPassword }
      });
      window.dispatchEvent(testAccountEvent);
    } catch (error: any) {
      console.error("Error creating test account:", error);
      toast({
        title: "Failed to create test account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLocalLoading(false);
    }
  };

  const updateUserPaymentStatus = async (hasPaid: boolean): Promise<void> => {
    try {
      setLocalLoading(true);
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update the profile in the database
      await updatePaymentStatus(user.id, hasPaid);
      
      // Update the user in local state
      const updatedUser = { ...user, hasPaid };
      setUser(updatedUser);
      
      toast({
        title: hasPaid ? "Subscription activated" : "Subscription cancelled",
        description: hasPaid ? "Your account has been upgraded." : "Your subscription has been cancelled.",
      });
      
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Failed to update subscription',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    logout,
    register,
    createTestAccount,
    updateUserPaymentStatus,
    isLoading: localLoading
  };
};
