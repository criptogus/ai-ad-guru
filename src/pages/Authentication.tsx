
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Authentication: React.FC = () => {
  const location = useLocation();
  const defaultTab = location.pathname.includes('register') ? 'register' : 'login';

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
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Authentication;
