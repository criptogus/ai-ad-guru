
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { loginWithEmail, loginWithGoogle as googleLogin } from '@/services/auth';

export const useLoginActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    isLoading
  };
};
