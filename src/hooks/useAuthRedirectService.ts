
import { useCallback } from 'react';
import { navigate } from './adConnections/utils/navigationUtils';

/**
 * This hook provides navigation functions for authentication redirects.
 * It abstracts the router dependency from auth-related services.
 */
export const useAuthRedirectService = () => {
  const redirectToLogin = useCallback(() => {
    navigate('/auth/login');
  }, []);

  const redirectToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, []);

  const redirectToBilling = useCallback(() => {
    navigate('/billing');
  }, []);

  return {
    redirectToLogin,
    redirectToDashboard,
    redirectToBilling,
  };
};

export default useAuthRedirectService;
