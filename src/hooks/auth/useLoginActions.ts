
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';

export const useLoginActions = (setUser: (user: CustomUser | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        const customUser: CustomUser = {
          ...data.user,
          name: profileData?.name || data.user.user_metadata?.name || '',
          credits: profileData?.credits || data.user.user_metadata?.credits || 0,
          hasPaid: profileData?.has_paid || data.user.user_metadata?.has_paid || false,
          avatar: profileData?.avatar || data.user.user_metadata?.avatar_url || '',
        };

        console.log('User logged in successfully', customUser);
        setUser(customUser);
        navigate('/dashboard');
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "There was a problem signing in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        throw error;
      }

      return data;
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message || "There was a problem signing in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    isLoading,
  };
};
