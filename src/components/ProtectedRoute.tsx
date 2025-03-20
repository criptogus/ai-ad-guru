import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/auth/LoadingState';
import { useRouteSecurityCheck } from '@/components/auth/RouteSecurityCheck';
import { detectSecurityIssues, setupSecurityHeartbeat, setupCSRFProtection } from '@/components/auth/SecurityUtils';

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
  const { isAuthenticated } = useAuth();
  const { 
    isLoading, 
    isPaymentVerification,
    performSecurityCheck 
  } = useRouteSecurityCheck({
    requiresPayment,
    requiredRole,
    requiresMFA
  });

  useEffect(() => {
    // Run security checks
    detectSecurityIssues();
    
    // Set up CSRF protection
    setupCSRFProtection();
    
    if (!isLoading) {
      // Perform the security check for this route
      performSecurityCheck();
    }
    
    // Set up a security heartbeat
    const securityInterval = setupSecurityHeartbeat(isAuthenticated);
    
    return () => {
      clearInterval(securityInterval);
    };
  }, [
    isAuthenticated, 
    isLoading, 
    requiresPayment, 
    requiredRole,
    requiresMFA,
    performSecurityCheck
  ]);

  if (isLoading) {
    return <LoadingState />;
  }

  // Always render children during payment verification
  if (isPaymentVerification) {
    console.log('Rendering children for payment verification flow');
    return <>{children}</>;
  }

  // Don't render children when not authenticated or when payment is required but not paid
  // These checks are now handled in performSecurityCheck, but we keep them here as a fallback
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
