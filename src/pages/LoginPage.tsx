
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Import the components
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

  console.log('LoginPage: Rendering with isAuthenticated =', isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from || '/dashboard';
      console.log('LoginPage: User is authenticated, redirecting to', from);
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    
    try {
      setIsSubmitting(true);
      console.log('LoginPage: Attempting login with email:', email);
      await login(email, password);
      // Login will update the auth context state
      console.log('LoginPage: Login successful');
    } catch (error: any) {
      console.error('LoginPage: Login error:', error);
      
      // Set appropriate error message based on error code
      if (error.code === 'email_not_confirmed') {
        setError('Please check your email inbox and click the confirmation link to activate your account.');
      } else if (error.code === 'invalid_credentials') {
        setError('The email or password you entered is incorrect. Please try again.');
      } else {
        setError(error.message || 'Failed to sign in. Please try again.');
      }
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
      console.error('LoginPage: Google login error:', error);
      setError(error?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTestAccount = async () => {
    try {
      setError(null);
      setIsCreatingTestAccount(true);
      console.log('LoginPage: Creating test account');
      await createTestAccount();
      console.log('LoginPage: Test account created');
    } catch (error: any) {
      console.error('LoginPage: Error creating test account:', error);
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
