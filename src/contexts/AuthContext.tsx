
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// Types for our context
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  credits: number;
  avatar?: string;
  hasPaid?: boolean;
}

interface AuthContextType {
  user: User | null;
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

// Mock user data - In a real app, this would come from your backend API
const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  credits: 400,
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
  hasPaid: false, // Default to not paid
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('adguru_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock login - In a real app, this would be an API call
      if (email === 'demo@example.com' && password === 'password') {
        setUser(MOCK_USER);
        localStorage.setItem('adguru_user', JSON.stringify(MOCK_USER));
        toast({
          title: "Login successful",
          description: "Welcome back to AI Ad Guru!",
        });
      } else {
        throw new Error('Invalid credentials');
      }
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
      // Mock Google login - In a real app, this would use a proper OAuth flow
      setUser(MOCK_USER);
      localStorage.setItem('adguru_user', JSON.stringify(MOCK_USER));
      toast({
        title: "Login successful",
        description: "Welcome to AI Ad Guru!",
      });
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
      // Clear user from state and local storage
      setUser(null);
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
      // Mock registration - In a real app, this would be an API call
      const newUser = {
        ...MOCK_USER,
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
        hasPaid: false, // New users start without a paid account
      };
      setUser(newUser);
      localStorage.setItem('adguru_user', JSON.stringify(newUser));
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
