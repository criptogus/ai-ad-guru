
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';

export const useLogoutAction = (setUser: (user: CustomUser | null) => void, navigate?: (path: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      
      // Only navigate if the navigate function is provided
      if (navigate) {
        navigate('/login');
      }
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
