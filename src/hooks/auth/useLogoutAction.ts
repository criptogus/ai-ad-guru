
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { navigate } from '../adConnections/utils/navigationUtils';

export const useLogoutAction = (
  setUser: (user: any | null) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast: uiToast } = useToast();

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      
      // Use sonner toast for a better UX
      toast.success("Logged out successfully");
      
      // Navigate to login page
      navigate('/auth/login');
    } catch (error: any) {
      toast.error("Logout failed", {
        description: error.message || "There was a problem logging out"
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
