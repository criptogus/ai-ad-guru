
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Types for our context
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  credits: number;
  avatar?: string;
  hasPaid?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserPaymentStatus: (status: boolean) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUserPaymentStatus: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Transform Supabase user to our AuthUser format
  const transformUser = (supabaseUser: User): AuthUser => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: 'user',
      credits: 400, // Default credits
      avatar: supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.user_metadata?.name || 'User')}&background=6366f1&color=fff`,
      hasPaid: false, // Default to not paid
    };
  };

  // Check auth status on mount and subscribe to auth changes
  useEffect(() => {
    setIsLoading(true);

    // Get initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSupabaseUser(session.user);
        const transformedUser = transformUser(session.user);
        setUser(transformedUser);
        
        // Try to get user data from local storage to preserve payment status
        try {
          const savedUser = localStorage.getItem('adguru_user');
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser.id === transformedUser.id) {
              setUser({
                ...transformedUser,
                hasPaid: parsedUser.hasPaid
              });
            }
          }
        } catch (error) {
          console.error('Error reading from local storage:', error);
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (session) {
        setSupabaseUser(session.user);
        const transformedUser = transformUser(session.user);
        setUser(transformedUser);
        
        // Try to get user data from local storage to preserve payment status
        try {
          const savedUser = localStorage.getItem('adguru_user');
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser.id === transformedUser.id) {
              setUser({
                ...transformedUser,
                hasPaid: parsedUser.hasPaid
              });
            }
          }
        } catch (error) {
          console.error('Error reading from local storage:', error);
        }
      } else {
        setSupabaseUser(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save user data to local storage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('adguru_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back to AI Ad Guru!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });

      if (error) throw error;

      // No toast needed here as we're redirecting to Google
    } catch (error) {
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      localStorage.removeItem('adguru_user');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Welcome to AI Ad Guru!",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPaymentStatus = (status: boolean) => {
    if (!user) return;
    
    const updatedUser = { ...user, hasPaid: status };
    setUser(updatedUser);
    localStorage.setItem('adguru_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
        register,
        updateUserPaymentStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
