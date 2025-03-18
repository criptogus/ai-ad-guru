
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

const LoginHeader: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xl font-bold">
          AG
        </div>
      </div>
      <CardTitle className="text-2xl text-center">AI Ad Guru</CardTitle>
      <CardDescription className="text-center">
        Enter your credentials to access your account
      </CardDescription>
    </>
  );
};

export default LoginHeader;
