
import { useLoginActions } from './auth/useLoginActions';
import { useLogoutAction } from './auth/useLogoutAction';
import { useRegisterAction } from './auth/useRegisterAction';
import { useTestAccountAction } from './auth/useTestAccountAction';
import { usePaymentAction } from './auth/usePaymentAction';
import { loginWithGoogle } from '@/services/auth/loginService';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';

export const useAuthActions = (
  user?: User | null,
  setUser?: (user: User | null) => void
) => {
  const { handleLogin, isSubmitting: isLoginSubmitting } = useLoginActions();
  const { logout, isLoading: isLogoutLoading } = useLogoutAction();
  const { register, isLoading: isRegisterLoading } = useRegisterAction();
  const { createTestAccount, isLoading: isTestAccountLoading } = useTestAccountAction();
  const { 
    updateUserPaymentStatus, 
    simulateSuccessfulPayment,
    isLoading: isPaymentLoading 
  } = usePaymentAction(user, setUser);
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // Login with Google OAuth
  const login = async (email: string, password: string) => {
    return handleLogin(email, password);
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      // This will redirect to Google auth page
    } catch (error) {
      console.error('Error logging in with Google:', error);
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
