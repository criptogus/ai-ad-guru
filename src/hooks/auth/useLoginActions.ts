
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { securityMonitor } from '@/middleware/securityMiddleware';
import { loginAttemptTracker } from '@/utils/auth/loginAttemptTracker';

export const useLoginActions = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogin = async (email: string, password: string) => {
    // Validate inputs
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    // Trim and normalize email
    email = email.trim().toLowerCase();
    
    // Check if the account is locked due to too many failed attempts
    if (loginAttemptTracker.isLocked(email)) {
      const timeRemaining = loginAttemptTracker.getTimeRemaining(email);
      const minutesRemaining = timeRemaining ? Math.ceil(timeRemaining / 60000) : 15;
      
      toast({
        title: 'Account Temporarily Locked',
        description: `Too many failed login attempts. Please try again in ${minutesRemaining} ${minutesRemaining === 1 ? 'minute' : 'minutes'} or reset your password.`,
        variant: 'destructive',
      });
      
      securityMonitor.trackSuspiciousActivity('unknown', 'login_attempt_during_lockout', { 
        email 
      });
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try to login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Increment failed login attempts
        loginAttemptTracker.increment(email);
        
        const remainingAttempts = loginAttemptTracker.getRemainingAttempts(email);
        
        // Display appropriate error message based on remaining attempts
        if (loginAttemptTracker.isLocked(email)) {
          toast({
            title: 'Account Temporarily Locked',
            description: 'Too many failed login attempts. Please try again later or reset your password.',
            variant: 'destructive',
          });
        } else if (remainingAttempts <= 2) {
          toast({
            title: 'Login Failed',
            description: `Invalid email or password. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before your account is temporarily locked.`,
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
      
      // We'll handle navigation in the auth components
      return data;
    } catch (generalError: any) {
      console.error('Unexpected error during login:', generalError);
      
      // Handle unexpected errors gracefully
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
