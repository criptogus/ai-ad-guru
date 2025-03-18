
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';

export const useLogoutAction = (setUser: (user: CustomUser | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        throw error;
      }

      console.log('User logged out successfully');
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
};
