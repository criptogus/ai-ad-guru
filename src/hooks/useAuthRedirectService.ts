
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This hook provides navigation functions for authentication redirects.
 * It abstracts the router dependency from auth-related services.
 */
export const useAuthRedirectService = () => {
  const navigate = useNavigate();

  const redirectToLogin = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  const redirectToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const redirectToBilling = useCallback(() => {
    navigate('/billing');
  }, [navigate]);

  return {
    redirectToLogin,
    redirectToDashboard,
    redirectToBilling,
  };
};

export default useAuthRedirectService;
