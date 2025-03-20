
import { securityMonitor } from '@/middleware/securityMiddleware';

/**
 * CSRF token management
 */
export const csrfManager = {
  /**
   * Initialize a new CSRF token
   */
  initialize: (): string => {
    const token = Array.from(new Uint8Array(32), byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  /**
   * Get the current CSRF token
   */
  getToken: (): string => {
    const token = sessionStorage.getItem('csrf_token');
    if (!token) {
      return csrfManager.initialize();
    }
    return token;
  },

  /**
   * Track user activity for CSRF token refreshing
   */
  trackActivity: (): void => {
    sessionStorage.setItem('last_user_activity', Date.now().toString());
  },

  /**
   * Setup CSRF token refresh
   */
  setupRefresh: (): void => {
    // Initialize CSRF token when module loads
    csrfManager.initialize();

    // Refresh CSRF token periodically for enhanced security
    setInterval(() => {
      // Only refresh if the user is active (has interacted with the page recently)
      const lastActivity = parseInt(sessionStorage.getItem('last_user_activity') || '0', 10);
      const now = Date.now();
      
      // If user was active in the last 5 minutes, refresh the token
      if (now - lastActivity < 5 * 60 * 1000) {
        csrfManager.initialize();
        securityMonitor.log('csrf_token_refreshed', {}, 'info');
      }
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    // Track user activity
    document.addEventListener('click', csrfManager.trackActivity);
  }
};

// Initialize the CSRF system
csrfManager.setupRefresh();
