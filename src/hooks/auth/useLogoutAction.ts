
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { logout as signOut } from '@/services/auth';

export const useLogoutAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut();
      // User state will be updated by onAuthStateChange
      navigate('/login');
      toast({
        description: 'Logged out successfully!',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading
  };
};
