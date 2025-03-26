
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLogoutAction = (
  setUser: (user: any | null) => void, 
  navigate?: (path: string) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      
      // Only navigate if navigate function is provided
      if (navigate) {
        navigate('/auth/login');
      }
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
};
