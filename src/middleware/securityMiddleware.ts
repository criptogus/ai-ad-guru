
import { supabase } from '@/integrations/supabase/client';

// IP and request rate tracking (in-memory for development)
const requestTracker = {
  ipRequests: new Map<string, { count: number, timestamp: number }>(),
  userRequests: new Map<string, { count: number, timestamp: number }>(),
  suspiciousIPs: new Set<string>(),
  blockedIPs: new Set<string>(),
};

// Clear tracking data periodically (every hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  // Clear old IP data
  requestTracker.ipRequests.forEach((data, ip) => {
    if (data.timestamp < oneHourAgo) {
      requestTracker.ipRequests.delete(ip);
    }
  });
  
  // Clear old user data
  requestTracker.userRequests.forEach((data, userId) => {
    if (data.timestamp < oneHourAgo) {
      requestTracker.userRequests.delete(userId);
    }
  });
}, 15 * 60 * 1000); // Run every 15 minutes

/**
 * Security monitoring and protection middleware
 */
export const securityMonitor = {
  /**
   * Log security events
   */
  log: (
    event: string,
    data: Record<string, any> = {},
    level: 'info' | 'warn' | 'error' = 'info'
  ) => {
    // Log locally with appropriate level
    const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
    logMethod(`[SECURITY] ${event}:`, data);
    
    // In production, you might want to send this to your backend
    if (process.env.NODE_ENV === 'production') {
      // This could be a call to your logging API endpoint
      // For now, just log locally
    }
  },

  /**
   * Track API access for security monitoring
   */
  trackApiAccess: (endpoint: string, method: string, userId?: string) => {
    const timestamp = Date.now();
    
    // Get client IP (for a real app, you'd get this from request headers)
    const clientIp = 'client-ip'; // Placeholder 
    
    // Track requests by IP
    if (!requestTracker.ipRequests.has(clientIp)) {
      requestTracker.ipRequests.set(clientIp, { count: 0, timestamp });
    }
    const ipData = requestTracker.ipRequests.get(clientIp)!;
    ipData.count++;
    ipData.timestamp = timestamp;
    
    // Track requests by user if authenticated
    if (userId) {
      if (!requestTracker.userRequests.has(userId)) {
        requestTracker.userRequests.set(userId, { count: 0, timestamp });
      }
      const userData = requestTracker.userRequests.get(userId)!;
      userData.count++;
      userData.timestamp = timestamp;
    }
    
    // Check for rate limiting
    if (ipData.count > 100) { // 100 requests per hour per IP
      requestTracker.suspiciousIPs.add(clientIp);
      securityMonitor.log('rate_limit_exceeded', { ip: clientIp, endpoint, method }, 'warn');
    }
    
    // Block if IP is in blocked list
    if (requestTracker.blockedIPs.has(clientIp)) {
      securityMonitor.log('blocked_ip_attempt', { ip: clientIp, endpoint, method }, 'warn');
      // In a real app, you would stop the request processing here
    }
    
    // Log the access
    securityMonitor.log('api_access', { 
      endpoint, 
      method, 
      userId: userId || 'anonymous',
      ip: clientIp,
      timestamp: new Date().toISOString() 
    }, 'info');
  },

  /**
   * Check for suspicious activity
   */
  checkForSuspiciousActivity: async (userId: string): Promise<boolean> => {
    try {
      // Get user's data from tracking
      const userData = requestTracker.userRequests.get(userId);
      
      // Check for suspicious patterns
      if (userData && userData.count > 200) { // 200 requests per hour per user
        securityMonitor.log('suspicious_user_activity', { 
          userId, 
          requestCount: userData.count,
          timeWindow: '1 hour' 
        }, 'warn');
        return true;
      }
      
      return false;
    } catch (error) {
      securityMonitor.log('suspicious_activity_check_failed', { 
        error: error.message,
        userId 
      }, 'error');
      return false;
    }
  },

  /**
   * Check JWT token validity
   */
  validateToken: async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session; // Return true if session exists
    } catch (error) {
      securityMonitor.log('token_validation_failed', { error: error.message }, 'error');
      return false;
    }
  }
};
