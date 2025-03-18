
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Import the newly created components
import ErrorDisplay from '@/components/auth/ErrorDisplay';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import TestAccountSection from '@/components/auth/TestAccountSection';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LoginFooter from '@/components/auth/LoginFooter';

const LoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingTestAccount, setIsCreatingTestAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithGoogle, isAuthenticated, createTestAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from || '/dashboard';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    
    try {
      setIsSubmitting(true);
      console.log('Attempting login with email:', email);
      await login(email, password);
      // After successful login, auth context will update isAuthenticated
      // and useEffect will redirect to dashboard
    } catch (error: any) {
      console.error('Login error:', error);
      // Improve error message handling for better user feedback
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('Database error')) {
          errorMessage = 'Our system is currently experiencing issues. Please try again later.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email or password is incorrect. Please check your credentials and try again.';
          console.log('Email used for login attempt:', email);
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await loginWithGoogle();
      // This will redirect to Google auth page
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error?.message || 'Failed to sign in with Google. Please try again.');
      toast({
        title: 'Google login failed',
        description: error?.message || 'An error occurred during Google sign in.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTestAccount = async () => {
    try {
      setError(null);
      setIsCreatingTestAccount(true);
      await createTestAccount();
    } catch (error: any) {
      console.error('Error creating test account:', error);
      setError(error?.message || 'Failed to create test account. Please try again.');
    } finally {
      setIsCreatingTestAccount(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <LoginHeader />
          </CardHeader>
          <CardContent className="space-y-4">
            <ErrorDisplay error={error} />
            
            <TestAccountSection 
              isCreatingTestAccount={isCreatingTestAccount} 
              onCreateTestAccount={handleCreateTestAccount} 
            />
            
            <LoginForm 
              onSubmit={handleLogin} 
              isSubmitting={isSubmitting} 
            />

            <SocialLoginButtons 
              onGoogleLogin={handleGoogleLogin} 
              isSubmitting={isSubmitting} 
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <LoginFooter />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
