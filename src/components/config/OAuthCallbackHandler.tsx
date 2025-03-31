
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { useOAuthCallback } from '@/hooks/adConnections/useOAuthCallback';
import { fetchUserConnections } from '@/hooks/adConnections/connectionService';

const OAuthCallbackHandler: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your authentication...');
  const navigate = useNavigate();
  const { processOAuthCallback } = useOAuthCallback();

  useEffect(() => {
    const handleCallback = async () => {
      if (!user) {
        setStatus('error');
        setMessage('You must be logged in to connect an ad account.');
        return;
      }

      try {
        const result = await processOAuthCallback(user.id, async () => {
          await fetchUserConnections(user.id);
        });

        if (result) {
          setStatus('success');
          setMessage('Your account has been successfully connected!');
          
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            navigate('/connections');
          }, 3000);
        } else {
          // Not an OAuth callback, redirect to connections page
          navigate('/connections');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'There was an error connecting your account.');
      }
    };

    handleCallback();
  }, [user, navigate, processOAuthCallback]);

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Authentication {status === 'success' ? 'Complete' : 'In Progress'}</CardTitle>
          <CardDescription>
            {status === 'loading' ? 'Connecting your ad account...' : 
             status === 'success' ? 'Your ad account has been connected' : 
             'There was an issue connecting your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle>Connection Successful</AlertTitle>
              <AlertDescription>
                {message}
                <p className="mt-2 text-sm opacity-80">Redirecting you back in a moment...</p>
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/connections')}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Connections
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OAuthCallbackHandler;
