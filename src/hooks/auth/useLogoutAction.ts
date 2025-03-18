
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/services/auth';

export const useLogoutAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Logging out user');
      
      await logout();
      
      // User state will be updated by onAuthStateChange
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      
      // Always redirect to login page after logout
      navigate('/login');
      
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
    logout: handleLogout,
    isLoading
  };
};
