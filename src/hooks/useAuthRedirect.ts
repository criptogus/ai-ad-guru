
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect when authentication status is determined and user is authenticated
    if (isLoading || !isAuthenticated || !user) return;

    const redirectLoggedInUser = async () => {
      try {
        console.log('Redirecting authenticated user from landing page...');
        
        // First check if user has paid billing status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('has_paid')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Default redirect to dashboard on error
          navigate('/dashboard');
          return;
        }
        
        // Check if user has set up billing
        if (!profile.has_paid) {
          console.log('User not paid, redirecting to billing');
          navigate('/billing');
          return;
        }
          
        // Check if user has connected any ad platforms
        const { count, error: connectionError } = await supabase
          .from('user_integrations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (connectionError) {
          console.error('Error checking ad connections:', connectionError);
          navigate('/dashboard');
          return;
        }
          
        // Redirect based on whether user has connections
        if (count === 0) {
          console.log('No ad platforms connected, redirecting to connections');
          navigate('/connections');
        } else {
          console.log('User has connected platforms, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error in redirect logic:', error);
        // Fallback to dashboard
        navigate('/dashboard');
      }
    };

    // Execute the redirect
    redirectLoggedInUser();
  }, [navigate, user, isAuthenticated, isLoading]);
};
