
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';

export const useTestAccountAction = (user: CustomUser | null, setUser: (user: CustomUser | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createTestAccount = async () => {
    try {
      setIsLoading(true);
      const randomString = Math.random().toString(36).substring(7);
      const email = `testuser_${randomString}@example.com`;
      const password = 'testpassword';
      const name = 'Test User';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            credits: 400,
            has_paid: true,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Test account creation error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Test account created successfully', data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          credits: 400,
          hasPaid: true,
          avatar: data.user.user_metadata.avatar_url || '',
        });
        navigate('/dashboard');
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Test Account Creation Failed",
        description: error.message || "There was a problem creating the test account",
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
