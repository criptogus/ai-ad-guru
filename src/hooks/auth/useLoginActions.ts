
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomUser } from '@/types/auth';
import { sanitizeInput } from '@/utils/security';
import { securityConfig } from '@/config/security';

// Create a module-level tracking for login attempts that persists between renders
// In a real app, this should be stored in local storage or a backend service with expiration
type LoginAttemptTracker = {
  attempts: Record<string, { count: number, lastAttempt: number }>;
  isLocked: (email: string) => boolean;
  recordAttempt: (email: string) => void;
  resetAttempts: (email: string) => void;
};

const loginAttemptTracker: LoginAttemptTracker = {
  attempts: {},
  
  isLocked(email: string): boolean {
    const entry = this.attempts[email];
    if (!entry) return false;
    
    const { count, lastAttempt } = entry;
    const now = Date.now();
    
    // Check if lockout period has expired
    if (count >= securityConfig.auth.maxLoginAttempts) {
      const lockoutExpiry = lastAttempt + securityConfig.auth.lockoutDuration;
      if (now < lockoutExpiry) {
        // Still locked
        return true;
      } else {
        // Lockout expired, reset attempts
        this.resetAttempts(email);
        return false;
      }
    }
    
    return false;
  },
  
  recordAttempt(email: string): void {
    const now = Date.now();
    if (!this.attempts[email]) {
      this.attempts[email] = { count: 1, lastAttempt: now };
    } else {
      this.attempts[email].count += 1;
      this.attempts[email].lastAttempt = now;
    }
    
    // Clean up old entries to prevent memory leaks
    this.cleanupOldEntries();
  },
  
  resetAttempts(email: string): void {
    delete this.attempts[email];
  },
  
  cleanupOldEntries(): void {
    const now = Date.now();
    const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
    
    Object.keys(this.attempts).forEach(email => {
      const lastAttempt = this.attempts[email].lastAttempt;
      if (now - lastAttempt > expiryTime) {
        delete this.attempts[email];
      }
    });
  }
};

export const useLoginActions = (setUser: (user: CustomUser | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cleanup old login attempt records periodically
  useEffect(() => {
    const cleanup = () => {
      loginAttemptTracker.cleanupOldEntries();
    };
    
    // Run cleanup every 10 minutes
    const intervalId = setInterval(cleanup, 10 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Sanitize and normalize email input
      const sanitizedEmail = sanitizeInput(email).trim().toLowerCase();
      
      // Check if this account is locked due to too many failed attempts
      if (loginAttemptTracker.isLocked(sanitizedEmail)) {
        const remainingLockTime = Math.ceil(
          (loginAttemptTracker.attempts[sanitizedEmail].lastAttempt + 
           securityConfig.auth.lockoutDuration - Date.now()) / 60000
        );
        
        toast({
          title: "Account Temporarily Locked",
          description: `Too many failed login attempts. Please try again in ${remainingLockTime} minutes.`,
          variant: "destructive",
        });
        return null;
      }

      setIsLoading(true);
      console.log('Attempting to sign in with email:', sanitizedEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Record failed login attempt
        loginAttemptTracker.recordAttempt(sanitizedEmail);
        
        // Check if we've reached the maximum attempts
        if (loginAttemptTracker.attempts[sanitizedEmail]?.count >= securityConfig.auth.maxLoginAttempts) {
          toast({
            title: "Account Temporarily Locked",
            description: `Too many failed login attempts. Please try again in ${securityConfig.auth.lockoutDuration / 60000} minutes.`,
            variant: "destructive",
          });
          return null;
        }
        
        // Handle specific error codes with more user-friendly messages
        if (error.message.includes('Email not confirmed')) {
          throw {
            code: 'email_not_confirmed',
            message: 'Please check your email and click the confirmation link to activate your account.'
          };
        } else if (error.message.includes('Invalid login credentials')) {
          throw {
            code: 'invalid_credentials',
            message: 'The email or password you entered is incorrect. Please try again.'
          };
        }
        
        throw error;
      }

      // Reset login attempts on successful login
      loginAttemptTracker.resetAttempts(sanitizedEmail);

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        const customUser: CustomUser = {
          ...data.user,
          name: profileData?.name || data.user.user_metadata?.name || '',
          credits: profileData?.credits || data.user.user_metadata?.credits || 0,
          hasPaid: profileData?.has_paid || data.user.user_metadata?.has_paid || false,
          avatar: profileData?.avatar || data.user.user_metadata?.avatar_url || '',
        };

        console.log('User logged in successfully');
        setUser(customUser);
        navigate('/dashboard');
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "There was a problem signing in",
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
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        throw error;
      }

      return data;
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message || "There was a problem signing in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    isLoading,
  };
};
