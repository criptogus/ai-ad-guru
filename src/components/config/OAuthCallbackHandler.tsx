
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useOAuthCallback } from '@/hooks/adConnections';
import { toast } from "sonner";

const OAuthCallbackHandler: React.FC = () => {
  const { user } = useAuth();
  const { processOAuthCallback } = useOAuthCallback();
  const [isProcessed, setIsProcessed] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        console.log("Callback path:", "/callback");
        
        // Log all the different redirect URIs that might be used
        console.log("Full redirect URI used:", `${window.location.origin}/callback`);
        console.log("Auth domain redirect URI:", "https://auth.zeroagency.ai/auth/callback");
        console.log("Auth domain v1 redirect URI:", "https://auth.zeroagency.ai/auth/v1/callback");
        console.log("===================================");
        
        // Process the OAuth callback
        await processOAuthCallback(user.id);
        
        // After processing is complete, set isProcessed to true
        setIsProcessed(true);
        
        // Show success message
        toast.success("Ad account connection successful!");
      } catch (error: any) {
        console.error("==== OAUTH CALLBACK ERROR ====");
        console.error("Error processing OAuth callback:", error);
        console.error("Error message:", error.message);
        console.error("============================");
        setError(error.message || "Unknown error occurred during authentication");
        setIsProcessed(true); // Set to true even on error to prevent endless loading
        
        // Show error message
        toast.error(`Authentication error: ${error.message || "Unknown error"}`);
      }
    };

    handleCallback();
  }, [user, processOAuthCallback]);

  // If processed, redirect to the connections page or stored return path
  if (isProcessed) {
    // Check if there was a stored return path
    const returnPath = sessionStorage.getItem('oauth_return_path');
    sessionStorage.removeItem('oauth_return_path'); // Clean up
    
    return <Navigate to={returnPath || "/connections"} replace />;
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
      <p className="mt-4 text-sm text-muted-foreground">Redirect URI: {window.location.origin}/callback</p>
      <p className="mt-1 text-sm text-muted-foreground">Auth Domain: https://auth.zeroagency.ai/auth/v1/callback</p>
    </div>
  );
};

export default OAuthCallbackHandler;
