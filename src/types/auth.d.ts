
import { User } from '@supabase/supabase-js';

export interface CustomUser extends User {
  name?: string;
  avatar?: string;
  credits?: number;
  hasPaid?: boolean;
  receivedFreeCredits?: boolean;
}

export interface AuthContextType {
  user: CustomUser | null;
  isAuthenticated: boolean;
  setUser: (user: CustomUser | null) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: CustomUser | null; error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<void>;
  updateUserPaymentStatus: (hasPaid: boolean) => Promise<void>;
  checkSubscriptionStatus: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
  authenticateWithGoogle: () => Promise<void>;
}
