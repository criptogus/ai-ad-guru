
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { securityMonitor } from '@/middleware/securityMiddleware';

interface LoginAttemptTracker {
  attempts: Record<string, { count: number; lastAttempt: number }>;
  maxAttempts: number;
  lockoutPeriod: number; // in milliseconds
  increment: (email: string) => void;
  isLocked: (email: string) => boolean;
  reset: (email: string) => void;
  cleanupOldEntries: () => void; // Added missing property
}

export const useLoginActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the login attempt tracker
  const loginAttemptTracker: LoginAttemptTracker = {
    attempts: {},
    maxAttempts: 5,
    lockoutPeriod: 15 * 60 * 1000, // 15 minutes
    
    increment(email: string) {
      const now = Date.now();
      
      if (!this.attempts[email]) {
        this.attempts[email] = { count: 0, lastAttempt: now };
      }
      
      this.attempts[email].count += 1;
      this.attempts[email].lastAttempt = now;
      
      // Log the attempts for security monitoring
      securityMonitor.trackAuthEvent(email, 'failed_login', { 
        attemptCount: this.attempts[email].count 
      });
    },
    
    isLocked(email: string) {
      if (!this.attempts[email]) return false;
      
      const { count, lastAttempt } = this.attempts[email];
      const now = Date.now();
      
      // If the lockout period has passed, reset the counter
      if (count >= this.maxAttempts && now - lastAttempt > this.lockoutPeriod) {
        this.reset(email);
        return false;
      }
      
      return count >= this.maxAttempts;
    },
    
    reset(email: string) {
      if (this.attempts[email]) {
        delete this.attempts[email];
      }
    },
    
    cleanupOldEntries() {
      const now = Date.now();
      const staleTime = 24 * 60 * 60 * 1000; // 24 hours
      
      Object.keys(this.attempts).forEach(email => {
        if (now - this.attempts[email].lastAttempt > staleTime) {
          delete this.attempts[email];
        }
      });
    }
  };
  
  // Cleanup old entries periodically to prevent memory leaks
  setInterval(() => {
    loginAttemptTracker.cleanupOldEntries();
  }, 60 * 60 * 1000); // Every hour
  
  const handleLogin = async (email: string, password: string) => {
    // Trim and validate inputs
    email = email.trim().toLowerCase();
    
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if the account is locked due to too many failed attempts
    if (loginAttemptTracker.isLocked(email)) {
      toast({
        title: 'Account Temporarily Locked',
        description: 'Too many failed login attempts. Please try again later or reset your password.',
        variant: 'destructive',
      });
      
      securityMonitor.trackSuspiciousActivity('unknown', 'login_attempt_during_lockout', { 
        email 
      });
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Increment failed login attempts
        loginAttemptTracker.increment(email);
        
        // Display appropriate error message
        if (loginAttemptTracker.isLocked(email)) {
          toast({
            title: 'Account Temporarily Locked',
            description: 'Too many failed login attempts. Please try again later or reset your password.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Login Failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive',
          });
        }
        
        securityMonitor.trackAuthEvent(email, 'failed_login', {
          reason: error.message
        });
        
        return;
      }
      
      // On successful login, reset any failed attempts
      loginAttemptTracker.reset(email);
      
      // Log successful login
      if (data.user) {
        securityMonitor.trackAuthEvent(data.user.id, 'login', {
          method: 'password'
        });
      }
      
      // Navigate to dashboard on success
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      
      navigate('/dashboard');
    } catch (generalError) {
      console.error('Unexpected error during login:', generalError);
      
      toast({
        title: 'An unexpected error occurred',
        description: 'Please try again later. If the problem persists, contact support.',
        variant: 'destructive',
      });
      
      securityMonitor.log('unexpected_auth_error', {
        context: 'login',
        error: generalError
      }, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { handleLogin, isSubmitting };
};

export default useLoginActions;
