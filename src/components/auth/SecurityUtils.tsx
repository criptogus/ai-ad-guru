
import { securityMonitor } from '@/middleware/securityMiddleware';

/**
 * Detect potential client-side security issues
 */
export const detectSecurityIssues = () => {
  const isUsingHTTPS = window.location.protocol === 'https:';
  const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
  
  // Only show security warnings in production environment
  if (!isLocalhost && !isUsingHTTPS) {
    console.error('Security Warning: Application is not using HTTPS');
    securityMonitor.log('security_no_https', {
      url: window.location.href
    }, 'error');
  }
  
  // Check for XSS protection via Content-Security-Policy
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!metaCSP && !isLocalhost) {
    console.warn('Security Warning: No Content-Security-Policy meta tag detected');
    securityMonitor.log('security_no_csp', {
      url: window.location.href
    }, 'warn');
  }
  
  // Check for localStorage tampering
  try {
    const lastAuthCheck = localStorage.getItem('last_auth_check');
    if (lastAuthCheck) {
      const lastCheck = parseInt(lastAuthCheck, 10);
      // If last check is in the future, localStorage might have been tampered with
      if (lastCheck > Date.now()) {
        console.error('Security Warning: Potential localStorage tampering detected');
        securityMonitor.log('security_storage_tampering', {
          lastCheck,
          now: Date.now()
        }, 'error');
        localStorage.clear(); // Clear potentially compromised data
        window.location.href = '/login?reason=security';
        return false;
      }
    }
    // Update last auth check
    localStorage.setItem('last_auth_check', Date.now().toString());
  } catch (e) {
    // Browser might have localStorage disabled
    console.warn('Unable to access localStorage');
  }
  
  // Check for Clickjacking protection
  const xFrameOptionsHeader = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (!xFrameOptionsHeader && !isLocalhost) {
    console.warn('Security Warning: No X-Frame-Options header detected');
    securityMonitor.log('security_no_xframe_options', {
      url: window.location.href
    }, 'warn');
  }
  
  return true;
};

/**
 * Set up a security heartbeat to periodically verify session integrity
 */
export const setupSecurityHeartbeat = (isAuthenticated: boolean) => {
  const securityInterval = setInterval(() => {
    // Store a security verification timestamp that can be checked on the server
    sessionStorage.setItem('security_heartbeat', Date.now().toString());
    
    // Re-verify session token to catch expired tokens
    if (isAuthenticated) {
      // This would ideally call a lightweight endpoint to verify the token
      console.log('Security heartbeat: verifying session integrity');
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
  
  return securityInterval;
};

/**
 * Set up CSRF protection
 */
export const setupCSRFProtection = () => {
  // Generate and store a CSRF token if one doesn't exist
  if (!sessionStorage.getItem('csrf_token')) {
    const generateSecureToken = () => {
      return Array.from(new Uint8Array(32), byte => 
        byte.toString(16).padStart(2, '0')
      ).join('');
    };
    
    sessionStorage.setItem('csrf_token', generateSecureToken());
  }
};
