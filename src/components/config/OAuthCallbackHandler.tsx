
import React, { useEffect, useState } from 'react';
import { useAdAccountConnections } from '@/hooks/adConnections';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useOAuthCallback } from '@/hooks/adConnections';

const OAuthCallbackHandler: React.FC = () => {
  const { user } = useAuth();
  const { processOAuthCallback } = useOAuthCallback();
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (!user) return;

      try {
        // The processOAuthCallback returns a promise - we need to wait for it
        await processOAuthCallback(user.id);
        
        // After processing is complete, set isProcessed to true
        setIsProcessed(true);
      } catch (error) {
        console.error("Error processing OAuth callback:", error);
        setIsProcessed(true); // Set to true even on error to prevent endless loading
      }
    };

    handleCallback();
  }, [user, processOAuthCallback]);

  // If processed, redirect to the connections page
  if (isProcessed) {
    // Check if there was a stored return path
    const returnPath = sessionStorage.getItem('oauth_return_path');
    sessionStorage.removeItem('oauth_return_path'); // Clean up
    return <Navigate to={returnPath || "/connections"} replace />;
  }

  // While processing, show a loading state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <h2 className="mt-4 text-xl font-semibold">Processing authentication...</h2>
      <p className="mt-2 text-muted-foreground">Please wait while we complete your ad account connection.</p>
    </div>
  );
};

export default OAuthCallbackHandler;
