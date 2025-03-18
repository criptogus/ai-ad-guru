
import { useSession } from './auth/useSession';
import { useUserProfile } from './auth/useUserProfile';

export const useAuthState = () => {
  const { session, isLoading: sessionLoading } = useSession();
  const { user, setUser, isAuthenticated, isLoading: profileLoading } = useUserProfile(session, sessionLoading);

  // Consider both session and profile loading states
  const isLoading = sessionLoading || profileLoading;

  return {
    user,
    setUser,
    session,
    isAuthenticated,
    isLoading,
  };
};
