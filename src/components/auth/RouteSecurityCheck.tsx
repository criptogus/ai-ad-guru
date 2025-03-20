
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { securityMonitor } from '@/middleware/securityMiddleware';
import { generateSecureToken } from '@/utils/security';

interface SecurityCheckProps {
  requiresPayment?: boolean;
  requiredRole?: string;
  requiresMFA?: boolean;
}

export const useRouteSecurityCheck = ({
  requiresPayment = false,
  requiredRole,
  requiresMFA = false
}: SecurityCheckProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in a payment verification flow
  const isPaymentVerification = location.search.includes('session_id=');
  
  // Get the current timestamp for security checks
  const currentTimestamp = Date.now();

  const performSecurityCheck = () => {
    // Skip authentication redirection during payment verification
    if (isPaymentVerification) {
      console.log('Payment verification in progress, bypassing authentication check');
      return { shouldRender: true };
    }

    // Handle authentication check
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      
      // Log security event - unauthenticated access attempt
      securityMonitor.log('security_unauthenticated_access', {
        path: location.pathname,
        requiresPayment,
        requiredRole,
        requiresMFA
      }, 'warn');
      
      // Store the current path for redirection after login
      const returnPath = `${location.pathname}${location.search}`;
      
      // Add a security token to prevent open redirects
      const secureToken = btoa(returnPath);
      
      navigate("/login", { 
        state: { 
          from: returnPath,
          secureToken,
          timestamp: currentTimestamp
        },
        // Use replace to prevent back button from taking users to protected routes
        replace: true 
      });
      
      return { shouldRender: false };
    } 
    
    // Handle payment requirement check
    if (requiresPayment && user && !user.hasPaid) {
      console.log('User not paid, redirecting to billing');
      
      // Log security event - unpaid access attempt
      securityMonitor.log('security_unpaid_access', {
        userId: user.id,
        path: location.pathname
      }, 'info');
      
      navigate("/billing", { replace: true });
      return { shouldRender: false };
    }
    
    // Handle role-based access control
    if (requiredRole && user) {
      // This is a simplified role check - implement proper role checking based on your data structure
      const hasRequiredRole = user.user_metadata?.role === requiredRole;
      if (!hasRequiredRole) {
        console.log(`User lacks required role: ${requiredRole}, access denied`);
        
        // Log security event - insufficient role
        securityMonitor.log('security_insufficient_role', {
          userId: user.id,
          path: location.pathname,
          userRole: user.user_metadata?.role,
          requiredRole
        }, 'warn');
        
        navigate("/dashboard", { 
          state: { 
            accessDenied: true, 
            requiredRole 
          },
          replace: true
        });
        
        return { shouldRender: false };
      }
    }
    
    // Handle MFA requirement check
    if (requiresMFA && user) {
      // Check if user has completed MFA verification
      const hasMFAVerified = user.user_metadata?.mfa_verified === true;
      
      if (!hasMFAVerified) {
        console.log('MFA verification required');
        
        // Log security event - MFA required
        securityMonitor.log('security_mfa_required', {
          userId: user.id,
          path: location.pathname
        }, 'info');
        
        navigate("/mfa-verification", {
          state: {
            returnTo: location.pathname,
            secureToken: btoa(location.pathname),
            timestamp: currentTimestamp
          },
          replace: true
        });
        
        return { shouldRender: false };
      }
    }
    
    // Successfully authenticated and authorized access
    if (user) {
      securityMonitor.log('security_authorized_access', {
        userId: user.id,
        path: location.pathname
      }, 'info');
    }
    
    return { shouldRender: true };
  };

  return {
    isLoading,
    isPaymentVerification,
    performSecurityCheck,
  };
};
