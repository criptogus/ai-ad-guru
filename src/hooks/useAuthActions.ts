
import { useLoginActions } from './auth/useLoginActions';
import { useLogoutAction } from './auth/useLogoutAction';
import { useRegisterAction } from './auth/useRegisterAction';
import { useTestAccountAction } from './auth/useTestAccountAction';
import { usePaymentAction } from './auth/usePaymentAction';
import { loginWithGoogle } from '@/services/auth/loginService';
import { checkUserSubscription } from '@/services/auth/subscriptionService';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthActions = (
  user?: User | null,
  setUser?: (user: User | null) => void
) => {
  const navigate = useNavigate();
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
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  
  // Login with credentials
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
  
  // Check subscription status
  const checkSubscriptionStatus = async () => {
    if (!user) return false;
    
    try {
      setIsCheckingSubscription(true);
      const hasActiveSubscription = await checkUserSubscription(user.id);
      
      if (!hasActiveSubscription) {
        navigate('/billing');
      }
      
      return hasActiveSubscription;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    } finally {
      setIsCheckingSubscription(false);
    }
  };
  
  // Combine all loading states
  const isLoading = 
    isLoginSubmitting || 
    isLogoutLoading || 
    isRegisterLoading || 
    isTestAccountLoading || 
    isPaymentLoading ||
    isGoogleLoading ||
    isCheckingSubscription;

  return {
    login,
    loginWithGoogle: handleGoogleLogin,
    logout,
    register,
    createTestAccount,
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    checkSubscriptionStatus,
    isLoading,
  };
};

export default useAuthActions;
