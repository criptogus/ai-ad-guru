
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/auth/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPayment?: boolean;
  requiredRole?: string;
  requiresMFA?: boolean;
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

  useEffect(() => {
    // Skip authentication redirection during payment verification
    if (isPaymentVerification) {
      console.log('Payment verification in progress, bypassing authentication check');
      return;
    }

    // Don't redirect while still loading
    if (isLoading) {
      return;
    }

    // Handle authentication check
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      
      // Store the current path for redirection after login
      const returnPath = `${location.pathname}${location.search}`;
      
      navigate("/auth/login", { 
        state: { 
          from: returnPath
        },
        // Use replace to prevent back button from taking users to protected routes
        replace: true 
      });
      return;
    } 
    
    // Handle payment requirement check
    if (requiresPayment && user && !user.hasPaid) {
      console.log('User not paid, redirecting to billing');
      navigate("/billing", { replace: true });
      return;
    }
    
    // Handle role-based access control
    if (requiredRole && user) {
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
        return;
      }
    }
    
    // Handle MFA requirement check
    if (requiresMFA && user) {
      // Check if user has completed MFA verification
      const hasMFAVerified = user.user_metadata?.mfa_verified === true;
      
      if (!hasMFAVerified) {
        console.log('MFA verification required');
        navigate("/mfa-verification", {
          state: {
            returnTo: location.pathname,
          },
          replace: true
        });
        return;
      }
    }
    
  }, [
    isAuthenticated, 
    isLoading, 
    user,
    navigate,
    location,
    requiresPayment, 
    requiredRole,
    requiresMFA,
    isPaymentVerification
  ]);

  if (isLoading) {
    return <LoadingState />;
  }

  // Always render children during payment verification
  if (isPaymentVerification) {
    console.log('Rendering children for payment verification flow');
    return <>{children}</>;
  }

  // Don't render children when not authenticated or unauthorized
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
