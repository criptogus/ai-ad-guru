
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginFooter from '@/components/auth/LoginFooter';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

const LoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Handle login submission
      console.log('Login data:', data);
      // Add your login logic here
    } catch (error) {
      console.error('Login error:', error);
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
        
        <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        <LoginFooter />
      </div>
    </div>
  );
};

export default LoginPage;
