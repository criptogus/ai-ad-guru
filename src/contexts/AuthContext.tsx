
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { setupSessionRefresh } from '@/utils/sessionRefresh';

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, setUser, session, isAuthenticated, isLoading: authStateLoading } = useAuthState();
  
  // Initialize auth actions
  const { 
    login, 
    loginWithGoogle, 
    logout, 
    register, 
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    checkSubscriptionStatus,
    isLoading: actionsLoading 
  } = useAuthActions(user, setUser);

  // Set up session refresh mechanism
  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout>;
    
    if (isAuthenticated && session) {
      // Start the session refresh mechanism
      intervalId = setupSessionRefresh();
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated, session]);

  // Combine isLoading states
  const isLoading = authStateLoading || actionsLoading;

  // For debugging - to understand authentication state - only log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Auth context state:', { 
      isAuthenticated, 
      isLoading, 
      user: user ? 'User exists' : 'No user', 
      session: session ? 'Session exists' : 'No session' 
    });
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    register,
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    checkSubscriptionStatus,
    session,
    setUser,
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
