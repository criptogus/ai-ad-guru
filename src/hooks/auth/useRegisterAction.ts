
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';

export const useRegisterAction = (setUser: (user: CustomUser | null) => void, navigate?: (path: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            credits: 400,
            has_paid: false,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User registered successfully', data.user);
        const customUser: CustomUser = {
          ...data.user,
          name: name,
          credits: 400,
          hasPaid: false,
          avatar: data.user.user_metadata.avatar_url || '',
        };
        setUser(customUser);
        if (navigate) {
          navigate('/dashboard');
        }
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem signing up",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
