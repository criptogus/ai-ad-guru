
import { Session, User } from '@supabase/supabase-js';

// Define an extended User type that includes our custom properties
export interface CustomUser extends User {
  name?: string;
  avatar?: string;
  credits?: number;
  hasPaid?: boolean;
  receivedFreeCredits?: boolean;
  refreshUser?: () => Promise<void>; // Add this method to the type
}

// Define our Profile interface that matches the database structure
export interface Profile {
  id: string;
  name: string;
  avatar: string | null;
  credits: number;
  has_paid: boolean;
  received_free_credits: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: CustomUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<any>;
  updateUserPaymentStatus: (hasPaid: boolean) => Promise<any>;
  simulateSuccessfulPayment: () => Promise<any>;
  checkSubscriptionStatus: () => Promise<boolean>;
  session: Session | null;
  setUser: (user: CustomUser | null) => void;
  refreshUser: () => Promise<void>; // Add this method to the context type
}
