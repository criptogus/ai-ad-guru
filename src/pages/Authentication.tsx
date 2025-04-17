
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Authentication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultTab = location.pathname.includes('register') ? 'register' : 'login';

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-gray-100 dark:from-background dark:to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg bg-card">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Lovable</h1>
          <p className="mt-2 text-muted-foreground">
            AI-powered ad management platform
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm 
              onSubmit={handleLogin} 
              isSubmitting={isSubmitting} 
            />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm 
              onSubmit={handleRegister} 
              isSubmitting={isSubmitting} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Authentication;
