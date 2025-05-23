import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import RegisterForm from '@/components/auth/register/RegisterForm';

const SignupPage: React.FC = () => {
  // Create dummy handlers to satisfy the component's props
  const handleSubmit = async (data: any) => {
    console.log('Register form submitted with:', data);
    // Registration logic is handled inside the RegisterForm component
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm 
              onSubmit={handleSubmit}
              isSubmitting={false}
            />
            <Separator className="my-4" />
            <div className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-primary hover:underline"
              >
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
