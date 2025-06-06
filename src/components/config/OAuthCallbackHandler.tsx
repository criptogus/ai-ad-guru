
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useOAuthCallback } from '@/hooks/adConnections';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const OAuthCallbackHandler: React.FC = () => {
  const { user } = useAuth();
  const { processOAuthCallback } = useOAuthCallback();
  const [isProcessed, setIsProcessed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string>('/connections');

  useEffect(() => {
    const handleCallback = async () => {
      if (!user) return;
      
      try {
        // Enhanced debugging - Log detailed redirect information
        console.log("==== OAUTH CALLBACK DEBUG INFO ====");
        console.log("OAuthCallbackHandler: Processing callback for user", user.id);
        console.log("Current URL:", window.location.href);
        console.log("Current origin:", window.location.origin);
        console.log("Path:", window.location.pathname);
        console.log("Search params:", window.location.search);
        console.log("Hash:", window.location.hash);
        console.log("Consistent redirect URI:", "https://auth.zeroagency.ai/auth/v1/callback");
        console.log("===================================");
        
        // Check for required OAuth parameters
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error("OAuth error in URL:", { error, errorDescription });
          throw new Error(errorDescription || error);
        }
        
        if (!code || !state) {
          console.error("Missing required OAuth parameters:", { code, state });
          setError("Missing required OAuth parameters");
          setIsProcessed(true);
          return;
        }
        
        console.log("Found OAuth parameters:", { 
          code: code ? "present" : "missing", 
          state: state || "missing"
        });
        
        // Process the OAuth callback
        await processOAuthCallback(user.id);
        
        // After processing is complete, set isProcessed to true
        setIsProcessed(true);
        
        // Show success message - updated to use sonner format
        toast.success("Ad account connection successful!");
        
        // Check how many connections the user has to determine the correct redirect path
        const { count, error: countError } = await supabase
          .from('user_integrations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (countError) {
          console.error('Error checking user connections:', countError);
        } else {
          console.log(`User has ${count} ad platform connections`);
          
          // Set the redirect path based on the number of connections
          if (count && count > 1) {
            setRedirectPath('/campaign/create');
          } else {
            // First platform connection or error counting connections
            setRedirectPath('/connections');
          }
        }
        
      } catch (error: any) {
        console.error("==== OAUTH CALLBACK ERROR ====");
        console.error("Error processing OAuth callback:", error);
        console.error("Error message:", error.message);
        console.error("============================");
        setError(error.message || "Unknown error occurred during authentication");
        setIsProcessed(true); // Set to true even on error to prevent endless loading
        
        // Show error message - updated to use sonner format
        toast.error("Authentication Error", {
          description: error.message || "Unknown error"
        });
      }
    };

    handleCallback();
  }, [user, processOAuthCallback]);

  // If processed, redirect to the appropriate page
  if (isProcessed) {
    // Check if there was a stored return path
    let returnPath;
    try {
      returnPath = sessionStorage.getItem('oauth_return_path');
      if (returnPath) {
        sessionStorage.removeItem('oauth_return_path'); // Clean up
        console.log('Redirecting to stored return path:', returnPath);
      }
    } catch (e) {
      console.warn('Could not access sessionStorage for return path:', e);
    }
    
    return <Navigate to={returnPath || redirectPath} replace />;
  }

  // Error state
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
        <a href="/connections" className="text-primary hover:underline">
          Return to Connections page
        </a>
      </div>
    );
  }

  // While processing, show a loading state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <h2 className="mt-4 text-xl font-semibold">Processing authentication...</h2>
      <p className="mt-2 text-muted-foreground">Please wait while we complete your ad account connection.</p>
      <p className="mt-4 text-sm text-muted-foreground">Original Redirect URI: {window.location.origin}/callback</p>
      <p className="mt-1 text-sm text-muted-foreground">Auth Domain: https://auth.zeroagency.ai/auth/v1/callback</p>
    </div>
  );
};

export default OAuthCallbackHandler;
