
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import TestAccountSection from '@/components/auth/TestAccountSection';

const LoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, loginWithGoogle, createTestAccount } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await loginWithGoogle();
      // The OAuth redirect will handle navigation
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'provider_not_enabled') {
        setError('Google login is not enabled. Please ensure it is enabled in your Supabase project.');
      } else {
        setError(err.message || 'Failed to login with Google. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTestAccount = async () => {
    try {
      setIsSubmitting(true);
      const result = await createTestAccount();
      if (result) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create test account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                AG
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} errorMessage={error} />
            
            <SocialLoginButtons 
              onGoogleLogin={handleGoogleLogin} 
              isSubmitting={isSubmitting} 
            />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-primary hover:underline">
                Create an account
              </Link>
            </div>
            
            <TestAccountSection onCreateTestAccount={handleCreateTestAccount} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
