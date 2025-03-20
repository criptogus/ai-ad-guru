
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';

export const useLoginActions = (setUser: (user: CustomUser | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      // Check for too many login attempts (simple rate limiting)
      if (loginAttempts >= 5) {
        toast({
          title: "Too Many Attempts",
          description: "Too many failed login attempts. Please try again later.",
          variant: "destructive",
        });
        return null;
      }

      setIsLoading(true);
      console.log('Attempting to sign in with email:', email);
      
      // Sanitize inputs to prevent injection
      const sanitizedEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Increment failed login attempts
        setLoginAttempts(prev => prev + 1);
        
        // Handle specific error codes with more user-friendly messages
        if (error.message.includes('Email not confirmed')) {
          throw {
            code: 'email_not_confirmed',
            message: 'Please check your email and click the confirmation link to activate your account.'
          };
        } else if (error.message.includes('Invalid login credentials')) {
          throw {
            code: 'invalid_credentials',
            message: 'The email or password you entered is incorrect. Please try again.'
          };
        }
        
        throw error;
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);

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

        console.log('User logged in successfully');
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
