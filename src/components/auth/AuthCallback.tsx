
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log debugging information
        console.log('AuthCallback: Processing callback');
        console.log('Current URL:', window.location.href);
        console.log('Hash fragment present:', !!window.location.hash);
        
        // Extract any return_to path from the URL if present
        const searchParams = new URLSearchParams(location.search);
        const returnTo = searchParams.get('return_to') || '/dashboard';
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session in callback:', error);
          setError(error.message);
          setIsProcessing(false);
          return;
        }
        
        if (data.session) {
          console.log('Session found in callback, redirecting to post-login flow');
          
          // Get user profile data to determine where to redirect
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('has_paid')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          // Determine where to redirect based on payment status
          if (profile && !profile.has_paid) {
            console.log('User not paid, redirecting to billing');
            navigate('/billing', { replace: true });
          } else {
            // Check for ad connections
            const { count, error: connectionError } = await supabase
              .from('user_integrations')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', data.session.user.id);
              
            if (connectionError) {
              console.error('Error checking connections:', connectionError);
            }
            
            if (count === 0) {
              console.log('No ad platforms connected, redirecting to connections');
              navigate('/connections', { replace: true });
            } else {
              console.log('User has connections, redirecting to dashboard or return path');
              navigate(returnTo, { replace: true });
            }
          }
          
          // Show success toast
          toast.success('Successfully authenticated!');
        } else {
          console.log('No session found in callback');
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
        }
      } catch (err) {
        console.error('Exception in auth callback:', err);
        setError('An unexpected error occurred during authentication.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, location.search]);

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <h2 className="mt-4 text-xl font-semibold">Completing authentication...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we prepare your account.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-destructive mb-2">Authentication Failed</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button 
          onClick={() => navigate('/auth/login')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <h2 className="mt-4 text-xl font-semibold">Redirecting...</h2>
    </div>
  );
};

export default AuthCallback;
