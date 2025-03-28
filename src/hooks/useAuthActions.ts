
import { useLoginActions } from './auth/useLoginActions';
import { useLogoutAction } from './auth/useLogoutAction';
import { useRegisterAction } from './auth/useRegisterAction';
import { useTestAccountAction } from './auth/useTestAccountAction';
import { usePaymentAction } from './auth/usePaymentAction';
import { loginWithGoogle } from '@/services/auth/loginService';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useToast } from './use-toast';

export const useAuthActions = (
  user?: User | null,
  setUser?: (user: User | null) => void,
  navigate?: (path: string) => void
) => {
  const { handleLogin, isSubmitting: isLoginSubmitting } = useLoginActions(navigate);
  const { logout, isLoading: isLogoutLoading } = useLogoutAction(setUser, navigate);
  const { register, isLoading: isRegisterLoading } = useRegisterAction(setUser, navigate);
  const { createTestAccount, isLoading: isTestAccountLoading } = useTestAccountAction(setUser, navigate);
  const { 
    updateUserPaymentStatus, 
    simulateSuccessfulPayment,
    isLoading: isPaymentLoading 
  } = usePaymentAction(user, setUser);
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  
  // Login with credentials
  const login = async (email: string, password: string) => {
    return handleLogin(email, password);
  };
  
  // Handle Google login with improved error handling
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      console.log('Initiating Google login flow');
      const result = await loginWithGoogle();
      // This will redirect to Google auth page
      console.log('Google login initiated successfully');
    } catch (error: any) {
      console.error('Error logging in with Google:', error);
      
      if (error.message && error.message.includes('redirect_uri_mismatch')) {
        toast({
          title: "OAuth Configuration Error",
          description: "The redirect URI is misconfigured. Please contact support or check Supabase OAuth settings.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Google Login Failed",
          description: error.message || "Failed to initiate Google login",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  // Combine all loading states
  const isLoading = 
    isLoginSubmitting || 
    isLogoutLoading || 
    isRegisterLoading || 
    isTestAccountLoading || 
    isPaymentLoading ||
    isGoogleLoading;

  return {
    login,
    loginWithGoogle: handleGoogleLogin,
    logout,
    register,
    createTestAccount,
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    isLoading,
  };
};

export default useAuthActions;
