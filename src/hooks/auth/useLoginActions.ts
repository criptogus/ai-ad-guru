
import { useState } from 'react';
import { loginWithEmail, loginWithGoogle } from '@/services/auth/loginService';
import { toast } from 'sonner';

export const useLoginActions = (navigate?: (path: string) => void) => {
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
      
      if (navigate) {
        navigate('/dashboard');
      }
      
      toast.success('Logged in successfully');
      return response;
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
  
  return {
    handleLogin,
    isSubmitting,
  };
};
