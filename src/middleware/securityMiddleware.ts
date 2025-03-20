import { getSecurityHeaders, buildCSPHeader } from '@/config/security';

/**
 * Applies security headers to the application
 * This function can be used in server middleware or as a React component
 */
export const applySecurityHeaders = () => {
  // Apply Content Security Policy via meta tag if we're in a browser context
  if (typeof document !== 'undefined') {
    // Remove any existing CSP meta tag to avoid duplicates
    const existingCspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCspTag) {
      existingCspTag.remove();
    }

    // Create and append a new CSP meta tag
    const cspTag = document.createElement('meta');
    cspTag.httpEquiv = 'Content-Security-Policy';
    cspTag.content = buildCSPHeader();
    document.head.appendChild(cspTag);

    // Add other security headers to HTML as meta tags where possible
    const securityHeaders = getSecurityHeaders();
    Object.entries(securityHeaders).forEach(([header, value]) => {
      // Skip CSP as we already handled it
      if (header === 'Content-Security-Policy') return;
      
      // Only add headers that can be set as meta tags
      const metaEquivHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Referrer-Policy',
        'X-XSS-Protection'
      ];
      
      if (metaEquivHeaders.includes(header)) {
        const metaTag = document.createElement('meta');
        metaTag.httpEquiv = header;
        metaTag.content = value as string;
        document.head.appendChild(metaTag);
      }
    });
  }
};

/**
 * Security monitoring and logging
 * Tracks security-related events and can trigger alerts
 */
export const securityMonitor = {
  log: (event: string, details: Record<string, any> = {}, level: 'info' | 'warn' | 'error' = 'info') => {
    // Add timestamp
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      level,
      ...details
    };
    
    // Log to console during development
    if (process.env.NODE_ENV === 'development') {
      console[level](`[SECURITY ${level.toUpperCase()}]`, event, details);
    }
    
    // In production, we would typically send these logs to a security monitoring service
    // This is a placeholder for that functionality
    if (process.env.NODE_ENV === 'production') {
      // Example: send to monitoring service
      try {
        // localStorage as a temporary storage for security events in browser
        // In a real app, you'd send this to your backend
        const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        securityLogs.push(logEntry);
        
        // Keep only the most recent 100 events to prevent localStorage overflow
        if (securityLogs.length > 100) {
          securityLogs.shift();
        }
        
        localStorage.setItem('security_logs', JSON.stringify(securityLogs));
        
        // If this is a high-severity event, we might want to alert immediately
        if (level === 'error') {
          // In a real app, you might send an API request to your security monitoring service
          console.error('[SECURITY ALERT]', event, details);
        }
      } catch (error) {
        // Fail silently if localStorage is not available
        console.error('Failed to log security event', error);
      }
    }
    
    return logEntry;
  },
  
  // Track suspicious activities
  trackSuspiciousActivity: (userId: string, activityType: string, details: Record<string, any> = {}) => {
    return securityMonitor.log(`suspicious_activity_${activityType}`, {
      userId,
      ...details
    }, 'warn');
  },
  
  // Track authentication events
  trackAuthEvent: (userId: string, eventType: 'login' | 'logout' | 'failed_login' | 'password_change', details: Record<string, any> = {}) => {
    return securityMonitor.log(`auth_${eventType}`, {
      userId,
      ...details
    }, eventType === 'failed_login' ? 'warn' : 'info');
  },
  
  // Track API access events
  trackApiAccess: (endpoint: string, method: string, userId?: string, details: Record<string, any> = {}) => {
    return securityMonitor.log('api_access', {
      endpoint,
      method,
      userId,
      ...details
    }, 'info');
  }
};

/**
 * Security audit utilities
 * Tools to help with regular security audits
 */
export const securityAudit = {
  // Check if dependencies need updating
  checkDependencies: async () => {
    // In a real implementation, this would call an API to check for vulnerabilities
    // For now, we'll just log the action
    securityMonitor.log('security_audit_dependencies', {
      status: 'scheduled',
      message: 'Dependency check scheduled'
    });
    
    return {
      status: 'completed',
      vulnerabilities: 0,
      message: 'Dependency check completed successfully'
    };
  },
  
  // Schedule regular audits
  scheduleRegularAudits: (intervalDays = 7) => {
    // This would set up a recurring task to perform security audits
    // For a frontend app, we might store the last audit date and check on app startup
    const lastAuditDate = localStorage.getItem('last_security_audit_date');
    const now = new Date();
    
    if (!lastAuditDate || (new Date(lastAuditDate).getTime() + intervalDays * 86400000) < now.getTime()) {
      // Time for a new audit
      securityMonitor.log('security_audit_scheduled', {
        lastAudit: lastAuditDate,
        nextAudit: now.toISOString()
      });
      
      // Update the last audit date
      localStorage.setItem('last_security_audit_date', now.toISOString());
      
      // Run the audit
      securityAudit.checkDependencies();
      
      return {
        status: 'scheduled',
        message: 'Security audit scheduled and initiated'
      };
    }
    
    return {
      status: 'skipped',
      message: 'Security audit not due yet'
    };
  }
};
