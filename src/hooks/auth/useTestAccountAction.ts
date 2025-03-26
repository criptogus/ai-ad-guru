
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';

export const useTestAccountAction = (setUser: (user: CustomUser | null) => void, navigate?: (path: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createTestAccount = async () => {
    try {
      setIsLoading(true);
      const testEmail = `test${Math.floor(Math.random() * 10000)}@adguru.test`;
      const testPassword = `testPassword${Math.floor(Math.random() * 10000)}`;
      const testName = `Test User ${Math.floor(Math.random() * 100)}`;

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: testName,
            credits: 400,
            has_paid: true, // Test accounts have paid status
          },
        },
      });

      if (error) {
        console.error('Test account creation error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Test account created successfully', data.user);
        const customUser: CustomUser = {
          ...data.user,
          name: testName,
          credits: 400,
          hasPaid: true,
          avatar: '',
        };
        setUser(customUser);
        if (navigate) {
          navigate('/dashboard');
        }
        
        toast({
          title: "Test Account Created",
          description: "You're now logged in with a test account",
        });
        
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Test Account Creation Failed",
        description: error.message || "There was a problem creating a test account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTestAccount,
    isLoading,
  };
};
