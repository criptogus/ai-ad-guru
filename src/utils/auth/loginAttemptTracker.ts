
import { securityMonitor } from '@/middleware/securityMiddleware';

export interface LoginAttemptData {
  count: number;
  lastAttempt: number;
}

export interface LoginAttemptTracker {
  attempts: Record<string, LoginAttemptData>;
  maxAttempts: number;
  lockoutPeriod: number; // in milliseconds
  increment: (email: string) => void;
  isLocked: (email: string) => boolean;
  reset: (email: string) => void;
  cleanupOldEntries: () => void;
  getRemainingAttempts: (email: string) => number;
  getTimeRemaining: (email: string) => number | null;
}

/**
 * Creates a login attempt tracker that monitors failed login attempts
 * and implements account lockout functionality
 */
export const createLoginAttemptTracker = (): LoginAttemptTracker => {
  // Store attempts in memory (in a real app, this would be persisted)
  const tracker: LoginAttemptTracker = {
    attempts: {},
    maxAttempts: 5,
    lockoutPeriod: 15 * 60 * 1000, // 15 minutes
    
    increment(email: string) {
      if (!email || typeof email !== 'string') {
        console.error('Invalid email provided to increment');
        return;
      }
      
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
      if (!email || typeof email !== 'string') {
        console.error('Invalid email provided to isLocked');
        return false;
      }
      
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
      if (!email || typeof email !== 'string') {
        console.error('Invalid email provided to reset');
        return;
      }
      
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
    },
    
    getRemainingAttempts(email: string) {
      if (!email || !this.attempts[email]) {
        return this.maxAttempts;
      }
      
      return Math.max(0, this.maxAttempts - this.attempts[email].count);
    },
    
    getTimeRemaining(email: string) {
      if (!email || !this.attempts[email] || !this.isLocked(email)) {
        return null;
      }
      
      const { lastAttempt } = this.attempts[email];
      const now = Date.now();
      const timeElapsed = now - lastAttempt;
      
      return Math.max(0, this.lockoutPeriod - timeElapsed);
    }
  };
  
  return tracker;
};

// Create a singleton instance of the tracker
export const loginAttemptTracker = createLoginAttemptTracker();

// Set up a cleanup interval
setInterval(() => {
  loginAttemptTracker.cleanupOldEntries();
}, 60 * 60 * 1000); // Every hour
