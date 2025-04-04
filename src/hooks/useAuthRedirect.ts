
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook to redirect authenticated users to the dashboard
 * and unauthenticated users to the login page (depending on context)
 */
export const useAuthRedirect = (options?: { 
  redirectAuthenticated?: boolean; // Whether to redirect authenticated users (default: true)
  redirectPath?: string;          // Path to redirect to (default: '/dashboard')
  requireAuth?: boolean;          // Whether authentication is required (default: false)
}) => {
  const navigate = useNavigate();
  
  const {
    redirectAuthenticated = true,
    redirectPath = '/dashboard',
    requireAuth = false
  } = options || {};

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If authenticated and redirectAuthenticated is true, redirect to dashboard
        if (session && redirectAuthenticated) {
          console.log('useAuthRedirect: User authenticated, redirecting to dashboard');
          navigate(redirectPath);
        } 
        // If authentication is required but user is not authenticated, redirect to login
        else if (requireAuth && !session) {
          console.log('useAuthRedirect: Authentication required but user not authenticated, redirecting to login');
          toast.info('Please log in to continue');
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('useAuthRedirect: Error checking authentication status:', error);
      }
    };

    checkAuth();
  }, [navigate, redirectAuthenticated, redirectPath, requireAuth]);
};

export default useAuthRedirect;
