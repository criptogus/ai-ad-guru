
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginFooter from '@/components/auth/LoginFooter';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { loginWithEmail } from '@/services/auth/loginService';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (email: string, password: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await loginWithEmail(email, password);
      
      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else if (data.session) {
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        setErrorMessage('Failed to log in. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background rounded-lg border shadow-sm w-full max-w-md mx-auto overflow-hidden">
      <div className="p-8">
        <LoginHeader />
        
        <SocialLoginButtons />
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errorMessage={errorMessage} />

        <LoginFooter />
      </div>
    </div>
  );
};

export default LoginPage;
