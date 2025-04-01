
import { useLoginActions } from './auth/useLoginActions';
import { useLogoutAction } from './auth/useLogoutAction';
import { useRegisterAction } from './auth/useRegisterAction';
import { usePaymentAction } from './auth/usePaymentAction';
import { loginWithGoogle } from '@/services/auth/loginService';
import { checkUserSubscription, verifySubscriptionWithStripe } from '@/services/auth/subscriptionService';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuthActions = (
  user?: User | null,
  setUser?: (user: User | null) => void
) => {
  const navigate = useNavigate();
  const { handleLogin, isSubmitting: isLoginSubmitting } = useLoginActions();
  const { logout, isLoading: isLogoutLoading } = useLogoutAction(setUser, navigate);
  const { register, isLoading: isRegisterLoading } = useRegisterAction(setUser, navigate);
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
  
  // Check subscription status - enhanced with Stripe double-check
  const checkSubscriptionStatus = async () => {
    if (!user) return false;
    
    try {
      setIsCheckingSubscription(true);
      console.log('Checking subscription status for user:', user.id);
      
      // First check in our database
      const hasActiveSubscription = await checkUserSubscription(user.id);
      
      if (hasActiveSubscription) {
        console.log('User has active subscription based on database check');
        return true;
      }
      
      // Double-check with Stripe if the database says no
      console.log('No active subscription found in database, verifying with Stripe');
      const stripeVerification = await verifySubscriptionWithStripe(user.id);
      
      if (stripeVerification) {
        console.log('Stripe verification confirmed active subscription');
        // Update our database to reflect this
        await updateUserPaymentStatus(true);
        toast.success('Your subscription has been verified.');
        return true;
      }
      
      console.log('No active subscription found in Stripe either');
      return false;
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
    isPaymentLoading ||
    isGoogleLoading ||
    isCheckingSubscription;

  return {
    login,
    loginWithGoogle: handleGoogleLogin,
    logout,
    register,
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    checkSubscriptionStatus,
    isLoading,
  };
};

export default useAuthActions;
