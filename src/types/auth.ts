
import { Session, User } from '@supabase/supabase-js';

// Define an extended User type that includes our custom properties
export interface CustomUser extends User {
  name?: string;
  avatar?: string;
  credits?: number;
  hasPaid?: boolean;
}

// Define our Profile interface that matches the database structure
export interface Profile {
  id: string;
  name: string;
  avatar: string | null;
  credits: number;
  has_paid: boolean;
  created_at: string;
  updated_at: string;
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
  simulateSuccessfulPayment: () => Promise<void>;
  session: Session | null;
}
