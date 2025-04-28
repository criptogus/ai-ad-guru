
import { useState } from 'react';
import { loginWithEmail, loginWithGoogle } from '@/services/auth/loginService';
import { toast } from 'sonner';
import { navigate } from '../adConnections/utils/navigationUtils';

export const useLoginActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle login
  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    
    setIsSubmitting(true);
    try {
      const response = await loginWithEmail(email, password);
      
      if (response && response.session) {
        toast.success('Logged in successfully');
        navigate('/dashboard');
        return response;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error codes
      if (error.code === 'email_not_confirmed') {
        toast.error('Please verify your email before logging in');
      } else if (error.code === 'invalid_credentials') {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Failed to log in');
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      // This will redirect to Google auth page
    } catch (error: any) {
      console.error('Error logging in with Google:', error);
      toast.error(error.message || 'Failed to log in with Google');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleLogin,
    handleGoogleLogin,
    isSubmitting,
  };
};
