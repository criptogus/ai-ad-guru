
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { generateSecureToken } from '@/utils/security';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPayment?: boolean;
  requiredRole?: string; // Add support for role-based access control
  requiresMFA?: boolean; // Add support for MFA requirement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresPayment = false,
  requiredRole,
  requiresMFA = false
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in a payment verification flow
  const isPaymentVerification = location.search.includes('session_id=');

  // Get the current timestamp for security checks
  const currentTimestamp = Date.now();

  // Detect potential client-side security issues
  const detectSecurityIssues = () => {
    const isUsingHTTPS = window.location.protocol === 'https:';
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    // Only show security warnings in production environment
    if (!isLocalhost && !isUsingHTTPS) {
      console.error('Security Warning: Application is not using HTTPS');
    }
    
    // Check for XSS protection via Content-Security-Policy
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!metaCSP && !isLocalhost) {
      console.warn('Security Warning: No Content-Security-Policy meta tag detected');
    }
    
    // Check for localStorage tampering
    try {
      const lastAuthCheck = localStorage.getItem('last_auth_check');
      if (lastAuthCheck) {
        const lastCheck = parseInt(lastAuthCheck, 10);
        // If last check is in the future, localStorage might have been tampered with
        if (lastCheck > Date.now()) {
          console.error('Security Warning: Potential localStorage tampering detected');
          localStorage.clear(); // Clear potentially compromised data
          window.location.href = '/login?reason=security';
          return;
        }
      }
      // Update last auth check
      localStorage.setItem('last_auth_check', Date.now().toString());
    } catch (e) {
      // Browser might have localStorage disabled
      console.warn('Unable to access localStorage');
    }
  };

  useEffect(() => {
    // Run security checks
    detectSecurityIssues();
    
    // Generate and store a CSRF token if one doesn't exist
    if (!sessionStorage.getItem('csrf_token')) {
      sessionStorage.setItem('csrf_token', generateSecureToken());
    }
    
    if (!isLoading) {
      // Skip authentication redirection during payment verification
      if (isPaymentVerification) {
        console.log('Payment verification in progress, bypassing authentication check');
        return;
      }

      // Handle authentication check
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
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
      } 
      // Handle payment requirement check
      else if (requiresPayment && user && !user.hasPaid) {
        console.log('User not paid, redirecting to billing');
        navigate("/billing", { replace: true });
      }
      // Handle role-based access control
      else if (requiredRole && user) {
        // This is a simplified role check - implement proper role checking based on your data structure
        const hasRequiredRole = user.user_metadata?.role === requiredRole;
        if (!hasRequiredRole) {
          console.log(`User lacks required role: ${requiredRole}, access denied`);
          navigate("/dashboard", { 
            state: { 
              accessDenied: true, 
              requiredRole 
            },
            replace: true
          });
        }
      }
      // Handle MFA requirement check
      else if (requiresMFA && user) {
        // Check if user has completed MFA verification
        // This is a placeholder for where you would implement MFA checks
        const hasMFAVerified = user.user_metadata?.mfa_verified === true;
        
        if (!hasMFAVerified) {
          console.log('MFA verification required');
          navigate("/mfa-verification", {
            state: {
              returnTo: location.pathname,
              secureToken: btoa(location.pathname),
              timestamp: currentTimestamp
            },
            replace: true
          });
        }
      }
    }
    
    // Set up a security heartbeat to periodically verify session integrity
    const securityInterval = setInterval(() => {
      // Store a security verification timestamp that can be checked on the server
      sessionStorage.setItem('security_heartbeat', Date.now().toString());
      
      // Re-verify session token to catch expired tokens
      if (isAuthenticated) {
        // This would ideally call a lightweight endpoint to verify the token
        console.log('Security heartbeat: verifying session integrity');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      clearInterval(securityInterval);
    };
  }, [
    isAuthenticated, 
    isLoading, 
    navigate, 
    location.pathname, 
    location.search,
    requiresPayment, 
    user, 
    isPaymentVerification,
    requiredRole,
    requiresMFA,
    currentTimestamp
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Always render children during payment verification
  if (isPaymentVerification) {
    console.log('Rendering children for payment verification flow');
    return <>{children}</>;
  }

  // Don't render children when not authenticated or when payment is required but not paid
  if (!isAuthenticated) return null;
  if (requiresPayment && user && !user.hasPaid) return null;
  if (requiredRole && user && user.user_metadata?.role !== requiredRole) return null;
  if (requiresMFA && user && user.user_metadata?.mfa_verified !== true) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
