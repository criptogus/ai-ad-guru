
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If user is already authenticated, redirect them
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/billing');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (name: string, email: string, password: string) => {
    setError(null);
    
    try {
      setIsSubmitting(true);
      await register(name, email, password);
      // After registration, auth context will update isAuthenticated
      // and useEffect will redirect to billing
      toast({
        title: 'Registration successful',
        description: 'Your account has been created. Redirecting you to the dashboard.',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      // Improve error message handling for better user feedback
      let errorMessage = 'Failed to sign up. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('Database error')) {
          errorMessage = 'Our system is currently experiencing issues. Please try again later.';
        } else if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try to log in.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast({
        title: 'Registration failed',
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xl font-bold">
                AG
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create an AI Ad Guru account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            <RegisterForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md border bg-background text-foreground hover:bg-muted transition-colors"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
              </svg>
              Google
            </button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-brand-600 hover:underline">
                Sign in
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
