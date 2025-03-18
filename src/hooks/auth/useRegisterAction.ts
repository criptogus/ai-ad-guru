
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { register as signUp, RegisterResult } from '@/services/auth';

export const useRegisterAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const result: RegisterResult = await signUp(name, email, password);
      
      if (result.confirmationRequired) {
        toast({
          title: 'Confirmation required',
          description: 'Please check your email to confirm your account before logging in.',
        });
        navigate('/login');
        return;
      }
      
      // The profile will be created automatically via the trigger
      // User state will be updated by onAuthStateChange
      navigate('/billing');
      toast({
        title: 'Registration successful',
        description: 'Your account has been created. Welcome!',
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading
  };
};
