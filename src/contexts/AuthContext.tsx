import { createContext, useContext, ReactNode, useEffect } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, setUser, session, isAuthenticated, isLoading: authStateLoading } = useAuthState();
  const { 
    login, 
    loginWithGoogle, 
    logout, 
    register, 
    createTestAccount,
    updateUserPaymentStatus,
    isLoading: actionsLoading 
  } = useAuthActions(user, setUser);

  // Combine isLoading states
  const isLoading = authStateLoading || actionsLoading;

  // For debugging - to understand authentication state
  useEffect(() => {
    console.log('Auth context state:', { 
      isAuthenticated, 
      isLoading, 
      user: user ? 'User exists' : 'No user', 
      session: session ? 'Session exists' : 'No session' 
    });
  }, [isAuthenticated, isLoading, user, session]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    register,
    createTestAccount,
    updateUserPaymentStatus,
    session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
