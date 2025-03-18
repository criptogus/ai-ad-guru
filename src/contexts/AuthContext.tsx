import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Session,
  User,
} from '@supabase/supabase-js';

// Define an extended User type that includes our custom properties
interface CustomUser extends User {
  name?: string;
  avatar?: string;
  credits?: number;
  hasPaid?: boolean;
}

export interface AuthContextType {
  user: CustomUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  createTestAccount: () => Promise<void>;
  updateUserPaymentStatus: (hasPaid: boolean) => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);

        if (session) {
          // Type assertion to convert User to CustomUser
          const customUser = session.user as CustomUser;
          
          // Add default values for our custom properties
          if (!customUser.name) customUser.name = 'User';
          if (!customUser.avatar) customUser.avatar = '';
          if (!customUser.credits) customUser.credits = 0;
          if (customUser.hasPaid === undefined) customUser.hasPaid = false;
          
          setUser(customUser);
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        // Type assertion to convert User to CustomUser
        const customUser = session.user as CustomUser;
        
        // Add default values for our custom properties
        if (!customUser.name) customUser.name = 'User';
        if (!customUser.avatar) customUser.avatar = '';
        if (!customUser.credits) customUser.credits = 0;
        if (customUser.hasPaid === undefined) customUser.hasPaid = false;
        
        setUser(customUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        toast({
          title: 'Sign-in failed',
          description: error.message,
          variant: 'destructive',
        });
        throw new Error('Invalid login credentials');
      }

      console.log('Sign-in successful:', data);
      setUser(data.user);
      setIsAuthenticated(true);
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw new Error('Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: 'Google sign-in failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Google sign-in initiated:', data);
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: 'Google login failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
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

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            avatar_url: '',
            credits: 100,  // Default credits for new users
            hasPaid: false // Default payment status
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Registration successful:', data);
      
      // Type assertion to convert User to CustomUser and add custom properties
      const customUser = data.user as CustomUser;
      if (!customUser.name) customUser.name = name;
      if (!customUser.avatar) customUser.avatar = '';
      if (!customUser.credits) customUser.credits = 100;
      if (customUser.hasPaid === undefined) customUser.hasPaid = false;
      
      setUser(customUser);
      setIsAuthenticated(true);
      navigate('/billing');

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createTestAccount = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Creating test account...');
      
      // Generate a unique email with timestamp to avoid "email already registered" errors
      const timestamp = new Date().getTime();
      const testEmail = `test${timestamp}@example.com`;
      const testPassword = 'Password123!';
      
      console.log(`Attempting to create test account with email: ${testEmail}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: 'Test User',
            avatar_url: '',
            credits: 500,  // More credits for test accounts
            hasPaid: true  // Test accounts have paid status for full access
          },
        },
      });

      if (error) {
        console.error("Error creating test account:", error);
        toast({
          title: "Failed to create test account",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Test account created:", data);
      
      toast({
        title: "Test account created",
        description: `Use ${testEmail} / ${testPassword} to log in`,
      });
      
      // Dispatch a custom event with the test account credentials
      const testAccountEvent = new CustomEvent('testAccountCreated', {
        detail: { email: testEmail, password: testPassword }
      });
      window.dispatchEvent(testAccountEvent);
    } catch (error: any) {
      console.error("Error creating test account:", error);
      toast({
        title: "Failed to create test account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPaymentStatus = async (hasPaid: boolean): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update the user in state
      const updatedUser = { ...user, hasPaid };
      setUser(updatedUser);
      
      // In a real application, we would also update this in the database
      // For now, we're just updating it in the local state
      toast({
        title: hasPaid ? "Subscription activated" : "Subscription cancelled",
        description: hasPaid ? "Your account has been upgraded." : "Your subscription has been cancelled.",
      });
      
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Failed to update subscription',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      {!isLoading && children}
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
