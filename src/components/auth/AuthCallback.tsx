
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, checkSubscriptionStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // If there's a hash in the URL, this might be a direct OAuth redirect with token
        if (location.hash && location.hash.includes('access_token')) {
          console.log('Detected access token in URL hash, handling OAuth callback');
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session from hash:', error);
            throw error;
          }
          
          console.log('Session obtained from hash:', data.session ? 'Valid session' : 'No session');
          
          // Wait a moment to ensure auth state is updated
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Wait for auth state to be initialized
        if (isLoading) return;

        console.log('Auth callback processing, auth state:', { isAuthenticated, user: user?.id });

        // If we're already authenticated, we can proceed
        if (isAuthenticated && user) {
          setIsProcessing(true);
          
          // Check if the user has an active subscription
          const hasActiveSubscription = await checkSubscriptionStatus();
          
          // Get return path from location state if available
          const state = location.state as { from?: string } | undefined;
          const returnTo = state?.from || '/dashboard';
          
          // Determine where to navigate based on subscription status
          if (hasActiveSubscription) {
            console.log('User has active subscription, redirecting to:', returnTo);
            toast.success('Welcome back! Your subscription is active.');
            navigate(returnTo);
          } else {
            console.log('User does not have active subscription, redirecting to billing');
            toast.info('Please activate your subscription to continue.');
            // Store intended destination for after billing
            sessionStorage.setItem('returnAfterBilling', returnTo);
            navigate('/billing');
          }
        } else {
          console.log('User not authenticated in callback, redirecting to login');
          toast.error('Authentication failed. Please try again.');
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
  }, [isLoading, isAuthenticated, user, navigate, checkSubscriptionStatus, location]);

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
