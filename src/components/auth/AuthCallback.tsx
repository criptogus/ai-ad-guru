
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, checkSubscriptionStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for auth state to be initialized
        if (isLoading) return;

        console.log('Auth callback processing, auth state:', { isAuthenticated, user: user?.id });

        // If we're already authenticated, we can proceed
        if (isAuthenticated && user) {
          setIsProcessing(true);
          
          // Check if the user has an active subscription
          const hasActiveSubscription = await checkSubscriptionStatus();
          
          // Determine where to navigate based on subscription status
          if (hasActiveSubscription) {
            console.log('User has active subscription, redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.log('User does not have active subscription, redirecting to billing');
            navigate('/billing');
          }
        } else {
          console.log('User not authenticated in callback, redirecting to login');
          navigate('/auth/login');
        }
      } catch (error: any) {
        console.error('Error processing auth callback:', error);
        setError(error.message || 'An error occurred during authentication');
        navigate('/auth/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [isLoading, isAuthenticated, user, navigate, checkSubscriptionStatus]);

  // If still loading or processing, show a loading state
  if (isLoading || isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <h2 className="mt-4 text-xl font-semibold">Processing your login...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we verify your account.</p>
      </div>
    );
  }

  // If there was an error, display it
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-destructive mb-2">Authentication Failed</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button 
          onClick={() => navigate('/auth/login')}
          className="text-primary hover:underline"
        >
          Return to Login
        </button>
      </div>
    );
  }

  // This is a fallback, but should not be reached due to redirects
  return null;
};

export default AuthCallback;
